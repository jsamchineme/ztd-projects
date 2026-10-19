// Chats with Claude Code in a project's folder. Each prompt runs `claude -p` (through studio-ctl, as the
// project user) and resumes the chat's Claude session. Events are saved and streamed to every open tab.
import { db, now, audit, getSetting } from './db.mjs';
import { randomId } from './crypto.mjs';
import { spawnCtl, ctl } from './ctl.mjs';
import { credentialsFor, lender } from './claude.mjs';
import { blocked, record } from './budget.mjs';
import { listServices } from './projects.mjs';
import { DOMAIN, STUDIO_URL } from './config.mjs';
import { notify, notifyAdmins, notifyTeam } from './notify.mjs';
import { uploadsFor, publicUpload, sizeText } from './uploads.mjs';
import * as R from './runner.mjs';

const runs = new Map();        // chatId -> { child, startedAt, userId }
const watchers = new Map();    // chatId -> Set(res)
const MODELS = ['fable', 'opus', 'sonnet', 'haiku'];
const RUN_ON = ['auto', 'computer', 'server'];

export const getChat = id => db.prepare('SELECT * FROM chat WHERE id = ?').get(id);
export const isRunning = chatId => runs.has(chatId);
export const runningChats = () => [...runs.keys()];

export function listChats(projectId, userId){
  // prompt: the first message in full (the title is cut to 70 characters), shown when hovering the chat in the list.
  return db.prepare(`SELECT chat.*, (SELECT json_extract(e.data, '$.text') FROM chat_event e WHERE e.chatId = chat.id AND json_extract(e.data, '$.type') = 'user' ORDER BY e.seq LIMIT 1) AS prompt
    FROM chat WHERE projectId = ? ORDER BY archivedAt IS NOT NULL, updatedAt DESC LIMIT 300`).all(projectId)
    .map(c => ({ ...c, prompt: c.prompt ? String(c.prompt).slice(0, 2000) : undefined, running: runs.has(c.id), mine: c.userId === userId }));
}
export function createChat(projectId, userId, { model = 'opus', mode = 'edit' } = {}){
  const id = randomId(9), t = now();
  db.prepare('INSERT INTO chat (id, projectId, userId, model, mode, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)')
    .run(id, projectId, userId, MODELS.includes(model) ? model : 'opus', mode === 'plan' ? 'plan' : 'edit', t, t);
  return getChat(id);
}
export function chatEvents(chatId, after = -1){
  return db.prepare('SELECT seq, at, data FROM chat_event WHERE chatId = ? AND seq > ? ORDER BY seq').all(chatId, after)
    .map(r => ({ seq: r.seq, at: r.at, ...JSON.parse(r.data) }));
}

function push(chatId, ev, store = true){
  let seq = null;
  if (store){
    seq = (db.prepare('SELECT max(seq) AS m FROM chat_event WHERE chatId = ?').get(chatId).m ?? -1) + 1;
    db.prepare('INSERT INTO chat_event (chatId, seq, at, data) VALUES (?,?,?,?)').run(chatId, seq, now(), JSON.stringify(ev));
  }
  const line = `data: ${JSON.stringify({ seq, at: now(), ...ev })}\n\n`;
  for (const res of watchers.get(chatId) || []) res.write(line);
}

export function watch(chatId, res){
  if (!watchers.has(chatId)) watchers.set(chatId, new Set());
  watchers.get(chatId).add(res);
  res.write(`data: ${JSON.stringify({ type: 'state', running: runs.has(chatId) })}\n\n`);
  return () => watchers.get(chatId)?.delete(res);
}

// runner: the person's computer the turn runs on (lib/runner.mjs), or none for the server.
function systemPrompt(project, user, runner){
  const svcs = listServices(project.id);
  const lines = svcs.map(s => `- ${s.name} (${s.label}): \`${s.command}\` on port ${s.port}` + (s.subdomain ? `, live at https://${s.subdomain}.${DOMAIN}` : ''));
  const about = project.description?.trim() ? `About this project (from its Studio settings): ${project.description.trim()}\n` : '';
  const end = `Task board: the project's board (Studio's Board tab, also called tasks, to-dos or the backlog) is the file BOARD.md in the
project folder. Studio shows that file as the board, so editing it IS how you add, change, move or finish tasks: there is no
board tool or studio-ctl command for it, and you don't need one. Don't put tasks in any other file. Its format:
  # Board

  ## To do
  - A task, one line
    Notes about it, indented under the task.

  ## In progress

  ## Done
\`## \` headings are the columns and \`- \` lines are tasks. To group tasks within a column, put them under a \`### \` heading,
with any lines about the group (owner, what it depends on) right under that heading; a task moved to another column goes
under the same \`### \` heading there. If BOARD.md doesn't exist yet, create it with those three
columns. Keep the format, and keep tasks short. When you finish work that a task on the board describes, move it to Done.

Don't commit or push: the person reviews changes in Studio's Changes tab and commits there.
Never print or copy secrets from environment variables or credential files.
Each message from the person is one turn, and nobody is watching while you work. When you end your turn, anything you
left running in the background (commands, agents) is stopped and you won't hear back from it. So don't reply with
"I'll keep going" or "I'll report back": wait for background work to finish, and finish the task, before your final reply.`;
  if (runner) return `You are working through ZTD Devs Studio, a web app the team uses to build and run their projects with Claude.
This turn runs on ${user.name}'s own computer (${runner.name}), not on the Studio server.
Project: ${project.name} (folder: ${R.folderOn(runner, project.slug)}, the current directory: a copy of the project, which lives on the Studio server). The person writing to you is ${user.name}.
${about}When your turn ends, Studio copies what changed in this folder (committed or not) back to the project on the server, where
the team reviews it. Files that git ignores (node_modules, .env and the like) stay on this computer and aren't copied, so
install dependencies here if you need them. You can run the project and its tests here.
The project's services run on the Studio server, not here, and you can't restart them from this computer: \`sudo studio-ctl\`
doesn't exist here. If your changes need a service restarted, say which in your final reply. The services:
${lines.join('\n') || '- none yet'}

${end}
Keep the final reply short: what changed, what to check, and which services need restarting.`;
  return `You are working through ZTD Devs Studio, a web app the team uses to build and run their projects with Claude.
Project: ${project.name} (folder: /srv/projects/${project.slug}/repo, the current directory). The person writing to you is ${user.name}.
${about}Running services for this project:
${lines.join('\n') || '- none yet'}

Running services don't reload code by themselves. After you change code that a running service uses (server files, config), restart it:
  sudo studio-ctl svc ${project.slug} <service> restart
Check it came back up and read its logs with:
  sudo studio-ctl status
  sudo studio-ctl logs ${project.slug} <service> 80
Front-end files served as static files usually only need a browser reload, so say so instead of restarting.
${end}
Keep the final reply short: what changed, what to check, and the live address to look at.`;
}

export async function sendPrompt(chat, project, user, { prompt, model, mode, attachments, runOn }){
  if (runs.has(chat.id)) throw Object.assign(new Error('Claude is still working on this chat. Wait, or press Stop.'), { status: 409 });
  prompt = String(prompt || '').trim();
  const files = uploadsFor(project, attachments);
  if (!prompt && !files.length) throw Object.assign(new Error('Write a prompt first.'), { status: 400 });
  if (prompt.length > 100000) throw Object.assign(new Error('That prompt is too long.'), { status: 400 });
  runOn = RUN_ON.includes(runOn) ? runOn : chat.runOn;
  const where = placeRun(project, user, runOn);
  model = MODELS.includes(model) ? model : chat.model;
  mode = mode === 'plan' ? 'plan' : mode === 'edit' ? 'edit' : chat.mode;

  if (chat.title === 'New chat') db.prepare('UPDATE chat SET title = ? WHERE id = ?').run((prompt || files[0].name).replace(/\s+/g, ' ').slice(0, 70), chat.id);
  db.prepare('UPDATE chat SET model = ?, mode = ?, runOn = ?, updatedAt = ?, archivedAt = NULL, autoResumes = 0 WHERE id = ?').run(model, mode, runOn, now(), chat.id);
  push(chat.id, { type: 'user', text: prompt, attachments: files.length ? files.map(publicUpload) : undefined, userId: user.id, userName: user.name, model, mode });
  audit(user.id, 'chat.prompt', project.slug, { chat: chat.id, model, mode, on: where.runner ? where.runner.name : 'server' });
  const cred = where.cred || credentialsFor(user.id);
  if (prompt && cred && project.description?.trim() && getSetting('scopeCheck', false)) checkScope(chat, project, user, prompt, cred);
  startRun(getChat(chat.id), project, user, where, prompt || (files.length ? 'Have a look at the attached files.' : ''), files);
}

// Where a turn runs: { runner } for one of the person's own computers (lib/runner.mjs), with no Studio Claude
// connection or budget needed, since it uses the computer's own Claude; or { cred } for the server.
function placeRun(project, user, runOn){
  const runner = R.pick(user, project, runOn);
  return runner ? { runner } : { cred: canRun(project, user) };
}

// The Claude connection to run with, or why this person can't run Claude in this project now.
function canRun(project, user){
  const cred = credentialsFor(user.id);
  if (!cred) throw Object.assign(new Error('Connect your Claude account first (Account → Claude).'), { status: 400, code: 'no_claude' });
  const over = blocked(project, user.id);
  if (over) throw Object.assign(new Error(over), { status: 429, code: 'budget' });
  return cred;
}

// files: the message's attachments. Claude gets their paths and opens them itself: Read handles images, PDFs,
// notebooks and text. On a computer, the runner saves them there and lists its own paths.
function startRun(chat, project, user, where, prompt, files = []){
  const { runner, cred } = where;
  // Moving between the server and a computer: the session comes along (lib/runner.mjs), but its paths don't.
  const from = chat.lastRanOn || 'server', to = runner ? runner.id : 'server';
  if (runner) push(chat.id, { type: 'notice', text: `Running on ${runner.name}.` });
  else if (from !== 'server') push(chat.id, { type: 'notice', text: 'Running on the Studio server.' });
  if (chat.claudeSessionId && from !== to)
    prompt = `(This chat has moved ${runner ? `to ${user.name}’s computer, ${runner.name}` : 'to the Studio server'}: the project folder is now ${runner ? R.folderOn(runner, project.slug) : `/srv/projects/${project.slug}/repo`}, and what you can run there differs. Earlier messages may mention other paths.)\n\n${prompt}`;
  let child;
  if (runner) child = R.startJob(runner, { chat, project, user, prompt, system: systemPrompt(project, user, runner), files });
  else {
    const toClaude = files.length ? `${prompt}\n\nAttached files (open them with the Read tool):\n${files.map(f => `- ${f.path} (${f.kind}, ${sizeText(f.size)})`).join('\n')}` : prompt;
    child = spawnCtl(['agent', project.slug, chat.model, chat.mode, chat.claudeSessionId || '-'], {
      stdin: JSON.stringify({ prompt: toClaude, ...cred, name: user.name, email: user.email, system: systemPrompt(project, user) })
    });
    db.prepare("UPDATE chat SET lastRanOn = 'server' WHERE id = ?").run(chat.id);
  }
  watchRun(chat, project, user, child, runner ? null : lender(user.id));
}

// Follows a turn's output to its end, wherever it runs. child: Claude through studio-ctl, or a turn on a computer
// (lib/runner.mjs), which looks the same and also tells the chat things ('notice').
function watchRun(chat, project, user, child, lenderId){
  // asked: tool calls asked to run in the background; background: those whose work is still running (see handle).
  const run = { child, remote: !!child.remote, startedAt: now(), userId: user.id, lenderId, projectId: project.id, stopped: false, gotResult: false, asked: new Set(), background: new Set() };
  if (run.remote) child.on('notice', text => push(chat.id, { type: 'notice', text }));
  runs.set(chat.id, run);
  // Marks the chat as mid-run until it ends, so that if Studio stops first, it picks the chat up when it starts.
  db.prepare('UPDATE chat SET runUserId = ? WHERE id = ?').run(user.id, chat.id);
  push(chat.id, { type: 'state', running: true }, false);

  let buf = '', errText = '';
  const toolNames = new Map();
  child.stdout.on('data', d => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0){
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let m; try { m = JSON.parse(line); } catch { continue; }
      handle(chat.id, m, run, toolNames);
    }
  });
  child.stderr.on('data', d => { errText += d; if (errText.length > 20000) errText = errText.slice(-20000); });
  child.on('close', code => {
    runs.delete(chat.id);
    // Studio is stopping: leave the chat marked, to be picked up when Studio starts again.
    if (shuttingDown) return;
    // Ended without an answer and not by Stop: when Studio stops or restarts under systemd, its chats are stopped
    // just before Studio itself is, so wait a moment; if Studio is still here after that, it wasn't a restart.
    // It stays listed as running meanwhile, so nobody starts another prompt in it yet.
    if (!run.remote && !run.stopped && !run.gotResult){ runs.set(chat.id, run); return setTimeout(() => { runs.delete(chat.id); if (!shuttingDown) finish(code); }, RESTART_GRACE); }
    finish(code);
  });
  function finish(code){
    db.prepare('UPDATE chat SET runUserId = NULL WHERE id = ?').run(chat.id);
    if (run.stopped) push(chat.id, { type: 'notice', text: 'Stopped.' });
    else if (!run.gotResult){
      const msg = errText.trim().split('\n').slice(-4).join('\n') || `Claude exited (code ${code}).`;
      push(chat.id, { type: 'error', text: /401|authenticat|OAuth|token/i.test(msg) ? `Claude couldn't sign in. Reconnect Claude in Account settings.\n\n${msg}` : msg });
    }
    db.prepare('UPDATE chat SET updatedAt = ? WHERE id = ?').run(now(), chat.id);
    if (!run.stopped && run.gotResult && !run.error && run.background.size && !shuttingDown && carryOn(chat, project, user)) return;
    push(chat.id, { type: 'state', running: false }, false);
    runFinishedNotices(chat, project, user, run, errText, code);
  }
}

// ----- picking chats up after Studio restarts -----
let shuttingDown = false;
const RESTART_GRACE = 3000;
const MAX_AUTO_RESUMES = 2;   // in a row, without anyone sending a prompt; stops a chat that keeps restarting Studio
// Called when Studio gets SIGTERM/SIGINT: chats still running are left marked, and their Claude stopped.
export function shutdown(){
  shuttingDown = true;
  // Turns on people's computers carry on there; Studio picks them up again when it starts (lib/runner.mjs).
  for (const run of runs.values()) if (!run.remote && run.child.exitCode === null) run.child.kill('SIGTERM');
}
const RESUME_NOTE = 'Studio restarted while you were working, which stopped you mid-task. Any command that was running then was cut off. Check where things stand, then carry on with the task.';
// Called once Studio has started: chats that were mid-run when it stopped carry on in the same Claude session.
export function resumeInterrupted(){
  for (const chat of db.prepare('SELECT * FROM chat WHERE runnerJob IS NOT NULL').all()) adoptRemote(chat);
  for (const chat of db.prepare('SELECT * FROM chat WHERE runUserId IS NOT NULL AND runnerJob IS NULL').all()){
    const done = text => { db.prepare('UPDATE chat SET runUserId = NULL WHERE id = ?').run(chat.id); push(chat.id, { type: 'notice', text }); };
    const project = db.prepare('SELECT * FROM project WHERE id = ?').get(chat.projectId);
    const user = db.prepare('SELECT id, name, email, role, banned FROM user WHERE id = ?').get(chat.runUserId);
    const member = user && project && (user.role === 'admin' || db.prepare('SELECT 1 FROM member WHERE userId = ? AND organizationId = ?').get(user.id, project.organizationId));
    if (!project || !member || user.banned || !chat.claudeSessionId){ done('Studio restarted while Claude was working on this. Send a message to carry on.'); continue; }
    if (chat.autoResumes >= MAX_AUTO_RESUMES){ done(`Studio restarted while Claude was working on this, ${MAX_AUTO_RESUMES + 1} times in a row, so Claude wasn’t started again. Send a message to carry on.`); continue; }
    let where;
    try { where = placeRun(project, user, chat.runOn); } catch (e){ done(`Studio restarted while Claude was working on this, and Claude couldn’t carry on: ${e.message}`); continue; }
    db.prepare('UPDATE chat SET autoResumes = autoResumes + 1, updatedAt = ? WHERE id = ?').run(now(), chat.id);
    push(chat.id, { type: 'notice', text: 'Studio restarted while Claude was working on this. Picking up where it left off…' });
    audit(user.id, 'chat.resumed', project.slug, { chat: chat.id });
    startRun(getChat(chat.id), project, user, where, RESUME_NOTE);
  }
}

// A turn that was running on someone's computer when Studio stopped. It carried on there; Studio follows it again
// from the last output line it had, once that computer reconnects (lib/runner.mjs).
function adoptRemote(chat){
  if (runs.has(chat.id) || R.hasJob(chat.runnerJob)) return;
  const project = db.prepare('SELECT * FROM project WHERE id = ?').get(chat.projectId);
  const user = chat.runUserId && db.prepare('SELECT id, name, email, role FROM user WHERE id = ?').get(chat.runUserId);
  if (!project || !user){ db.prepare('UPDATE chat SET runnerId = NULL, runnerJob = NULL, runUserId = NULL WHERE id = ?').run(chat.id); return; }
  watchRun(chat, project, user, R.adopt(chat), null);
}
R.setHooks({ notice: (chatId, text) => push(chatId, { type: 'notice', text }), adopt: adoptRemote });

// ----- turns that end with work still running in the background -----
// Claude may start a command or agent in the background and end its turn without waiting ("I'll report back"). In a
// Studio chat, that work stops with the turn and nobody prompts Claude again, so the chat goes quiet. Studio prompts it
// to carry on instead, counted with restart pick-ups (autoResumes), so at most MAX_AUTO_RESUMES times without a prompt.
const CONTINUE_NOTE = 'Your last turn ended while work you started in the background was still running, so that work was stopped and nobody was told. Check what finished and what didn’t, redo what didn’t (in the foreground this time, or wait for it), and carry on until the task is actually done.';
function carryOn(chat, project, user){
  const c = getChat(chat.id);
  if (!c) return false;
  if (c.autoResumes >= MAX_AUTO_RESUMES){
    push(chat.id, { type: 'notice', text: `Claude ended its turn with work still running in the background, ${MAX_AUTO_RESUMES + 1} times in a row, so Studio didn’t start it again. Send a message to carry on.` });
    return false;
  }
  let where;
  try { where = placeRun(project, user, c.runOn); } catch (e){
    push(chat.id, { type: 'notice', text: `Claude ended its turn with work still running in the background, and couldn’t carry on: ${e.message}` });
    return false;
  }
  db.prepare('UPDATE chat SET autoResumes = autoResumes + 1 WHERE id = ?').run(chat.id);
  push(chat.id, { type: 'notice', text: 'Claude ended its turn with work still running in the background, which stops with the turn. Asking it to carry on…' });
  audit(user.id, 'chat.continued', project.slug, { chat: chat.id });
  startRun(getChat(chat.id), project, user, where, CONTINUE_NOTE);
  return true;
}
// A tool call left running in the background: run_in_background, or a result that says so (agents can run in the
// background by default). Only the first line of a Bash or agent result counts: output that merely mentions background
// work (a file or log printed by a command) isn't background work.
const BACKGROUND_RESULT = /^\s*(command running in (the )?background|.*launched in the background|async agent launched)/i;
const CAN_BACKGROUND = /^(Bash|Agent|Task)$/;
const leftInBackground = (name, text) => CAN_BACKGROUND.test(name || '') && BACKGROUND_RESULT.test(text.split('\n')[0]);
// Background work reporting back within the turn (a task notification), or Claude collecting its output.
const isNotification = text => /<task-notification>/i.test(text);
const COLLECTS = /^(TaskOutput|BashOutput|AgentOutput)$/;

// Account → Push notifications: every run, and teammates' if they follow them. Email: runs over a minute, or ones
// that failed. Neither for a run the person stopped.
const LONG_RUN = 60000;
function runFinishedNotices(chat, project, user, run, errText, code){
  if (run.stopped || run.awaitingAnswer) return;   // the turn paused on a question, not finished
  const durationMs = now() - run.startedAt;
  const ok = run.gotResult && !run.error;
  const error = run.error || errText.trim().split('\n').slice(-4).join('\n') || `Claude exited (code ${code}).`;
  const summary = ok && run.lastText ? run.lastText.replace(/\s+/g, ' ').trim().slice(0, 400) + (run.lastText.length > 400 ? '…' : '') : '';
  const data = { ok, error, summary, durationMs, chatTitle: getChat(chat.id)?.title || chat.title, projectName: project.name, userName: user.name,
    url: `${STUDIO_URL}/p/${project.id}/chat/${chat.id}` };
  notify(user.id, 'runFinished', data, { email: !ok || durationMs >= LONG_RUN });
  notifyTeam(project.organizationId, 'teamRun', data, user.id);
}

// Focus checks (Admin → Project focus): while Claude works, Haiku compares the prompt with the project's description.
// A prompt that doesn't fit is flagged in the chat and the activity log, never blocked. A failed check flags nothing.
async function checkScope(chat, project, user, prompt, cred){
  const r = await ctl(['scope-check', project.slug], { timeout: 70000,
    stdin: JSON.stringify({ prompt, name: project.name, purpose: project.description, ...cred }) });
  if (r.code !== 0){ audit(user.id, 'chat.focus-check-failed', project.slug, { chat: chat.id, error: r.err.slice(0, 200) }); return; }
  const off = /^\W*OFF\b\W*(.*)$/i.exec(r.out.trim());
  if (!off) return;
  const reason = off[1].trim().slice(0, 200) || 'It doesn’t look like work on this project.';
  push(chat.id, { type: 'flag', text: reason, userId: user.id, userName: user.name });
  audit(user.id, 'chat.off-topic', project.slug, { chat: chat.id, reason, prompt: prompt.slice(0, 300) });
  notifyAdmins('focusFlag', { userName: user.name, projectName: project.name, excerpt: prompt.slice(0, 300), reason, url: `${STUDIO_URL}/admin` }, user.id);
}

function textOf(content){
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(c => c.type === 'text' ? c.text : c.type === 'image' ? '[image]' : '').join('\n');
  return '';
}

// One piece of background work is done (which one isn't always clear, so the oldest).
const doneInBackground = run => { const first = run.background.values().next(); if (!first.done) run.background.delete(first.value); };

function handle(chatId, m, run, toolNames){
  if (run.awaitingAnswer) return;   // turn is ending on an AskUserQuestion card; ignore anything the killed process still emits
  if (m.type === 'system' && m.subtype === 'init' && m.session_id){
    db.prepare('UPDATE chat SET claudeSessionId = ? WHERE id = ?').run(m.session_id, chatId);
    return;
  }
  if (m.type === 'system' && m.subtype === 'api_retry'){
    if (m.error_status === 401 || m.error_status === 403){
      // A bad or expired login won't fix itself; stop instead of retrying for minutes.
      run.gotResult = true;
      run.error = 'Claude couldn’t sign in with your connection. Reconnect Claude on your Account page.';
      push(chatId, { type: 'error', text: 'Claude couldn’t sign in with your connection. Reconnect Claude on your Account page, then send the prompt again.' });
      run.child.kill('SIGTERM');
    } else if (!run.retryNoted){
      run.retryNoted = true;
      push(chatId, { type: 'notice', text: m.error_status === 429 ? 'Claude is rate limited or at its usage limit. Retrying…' : `Claude’s API had a problem (${m.error_status || m.error}). Retrying…` });
    }
    return;
  }
  if (m.type === 'stream_event'){
    const e = m.event;
    if (e?.type === 'content_block_delta'){
      if (e.delta?.type === 'text_delta') push(chatId, { type: 'delta', text: e.delta.text }, false);
      else if (e.delta?.type === 'thinking_delta') push(chatId, { type: 'thinking_delta', text: e.delta.thinking }, false);
    }
    return;
  }
  if (m.type === 'assistant' && m.message?.content){
    if (m.parent_tool_use_id) return;   // sub-agent chatter: the Task tool's result summarises it
    for (const b of m.message.content){
      if (b.type === 'text' && b.text.trim()){ run.lastText = b.text; push(chatId, { type: 'text', text: b.text }); }
      else if (b.type === 'thinking' && b.thinking?.trim()) push(chatId, { type: 'thinking', text: b.thinking });
      else if (b.type === 'tool_use'){
        toolNames.set(b.id, b.name);
        // AskUserQuestion needs a person at a terminal to answer, which headless `claude -p` has none of, so it just
        // errors. Instead, show the question as a card in the chat and end the turn here cleanly (like Stop, but not an
        // error); when the person picks an option, their choice is sent as the next prompt, resuming this session.
        if (b.name === 'AskUserQuestion' && Array.isArray(b.input?.questions)){
          run.gotResult = true;        // ending on purpose, so finish() shows no error
          run.awaitingAnswer = true;
          push(chatId, { type: 'question', id: b.id, questions: b.input.questions });
          run.child.kill('SIGTERM');
          return;
        }
        if (b.input?.run_in_background === true) run.asked.add(b.id);
        push(chatId, { type: 'tool', id: b.id, name: b.name, input: b.input });
      }
    }
    return;
  }
  if (m.type === 'system' && /^task_(notification|completed)$/.test(m.subtype || '')){ doneInBackground(run); return; }
  if (m.type === 'user' && typeof m.message?.content === 'string'){
    if (!m.parent_tool_use_id && isNotification(m.message.content)) doneInBackground(run);
    return;
  }
  if (m.type === 'user' && Array.isArray(m.message?.content)){
    if (m.parent_tool_use_id) return;
    for (const b of m.message.content){
      if (b.type === 'text' && isNotification(b.text)) doneInBackground(run);
      if (b.type !== 'tool_result') continue;
      const name = toolNames.get(b.tool_use_id);
      if (name === 'AskUserQuestion') continue;   // shown as a question card, not a tool result (see the tool_use above)
      let text = textOf(b.content);
      if (!b.is_error && (run.asked.has(b.tool_use_id) || leftInBackground(name, text))) run.background.add(b.tool_use_id);
      if (!b.is_error && COLLECTS.test(name || '')) doneInBackground(run);
      if (text.length > 30000) text = text.slice(0, 30000) + `\n… (${text.length - 30000} more characters)`;
      push(chatId, { type: 'tool_result', id: b.tool_use_id, name, text, isError: !!b.is_error });
    }
    return;
  }
  if (m.type === 'result'){
    run.gotResult = true;
    if (m.is_error || m.subtype !== 'success') run.error = String(m.result || m.subtype || 'Claude stopped with an error');
    const cost = Number(m.total_cost_usd) || 0;
    if (m.session_id) db.prepare('UPDATE chat SET claudeSessionId = ? WHERE id = ?').run(m.session_id, chatId);
    db.prepare('UPDATE chat SET costUsd = costUsd + ? WHERE id = ?').run(cost, chatId);
    if (!run.remote) record({ projectId: run.projectId, userId: run.userId, lenderId: run.lenderId, source: 'chat', model: m.modelUsage ? Object.keys(m.modelUsage)[0] : null, costUsd: cost });
    push(chatId, { type: 'result', ok: !m.is_error && m.subtype === 'success', subtype: m.subtype, costUsd: cost, durationMs: m.duration_ms, turns: m.num_turns,
      text: m.is_error ? String(m.result || m.subtype || 'Claude stopped with an error') : '' });
  }
}

export function stop(chatId){
  const run = runs.get(chatId);
  if (!run) return false;
  run.stopped = true;
  run.child.kill('SIGTERM');
  setTimeout(() => { if (runs.get(chatId) === run) run.child.kill('SIGKILL'); }, 8000);
  return true;
}

export function archiveChat(chatId, archived){
  db.prepare('UPDATE chat SET archivedAt = ? WHERE id = ?').run(archived ? now() : null, chatId);
}
export function deleteChat(chatId){
  stop(chatId);
  db.prepare('DELETE FROM chat WHERE id = ?').run(chatId);
}
