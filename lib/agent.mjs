// Chats with Claude Code in a project's folder. Each prompt runs `claude -p` (through studio-ctl, as the
// project user) and resumes the chat's Claude session. Events are saved and streamed to every open tab.
import { db, now, audit, getSetting } from './db.mjs';
import { randomId } from './crypto.mjs';
import { spawnCtl, ctl } from './ctl.mjs';
import { credentialsFor } from './claude.mjs';
import { listServices } from './projects.mjs';
import { DOMAIN, STUDIO_URL } from './config.mjs';
import { notify, notifyAdmins } from './notify.mjs';
import { uploadsFor, publicUpload, sizeText } from './uploads.mjs';

const runs = new Map();        // chatId -> { child, startedAt, userId }
const watchers = new Map();    // chatId -> Set(res)
const MODELS = ['fable', 'opus', 'sonnet', 'haiku'];

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

function systemPrompt(project, user){
  const svcs = listServices(project.id);
  const lines = svcs.map(s => `- ${s.name} (${s.label}): \`${s.command}\` on port ${s.port}` + (s.subdomain ? `, live at https://${s.subdomain}.${DOMAIN}` : ''));
  return `You are working through ZTD Devs Studio, a web app the team uses to build and run their projects with Claude.
Project: ${project.name} (folder: /srv/projects/${project.slug}/repo, the current directory). The person writing to you is ${user.name}.
${project.description?.trim() ? `About this project (from its Studio settings): ${project.description.trim()}\n` : ''}Running services for this project:
${lines.join('\n') || '- none yet'}

Running services don't reload code by themselves. After you change code that a running service uses (server files, config), restart it:
  sudo studio-ctl svc ${project.slug} <service> restart
Check it came back up and read its logs with:
  sudo studio-ctl status
  sudo studio-ctl logs ${project.slug} <service> 80
Front-end files served as static files usually only need a browser reload, so say so instead of restarting.
Don't commit or push: the person reviews changes in Studio's Changes tab and commits there.
Never print or copy secrets from environment variables or credential files.
Keep the final reply short: what changed, what to check, and the live address to look at.`;
}

export async function sendPrompt(chat, project, user, { prompt, model, mode, attachments }){
  if (runs.has(chat.id)) throw Object.assign(new Error('Claude is still working on this chat. Wait, or press Stop.'), { status: 409 });
  prompt = String(prompt || '').trim();
  const files = uploadsFor(project, attachments);
  if (!prompt && !files.length) throw Object.assign(new Error('Write a prompt first.'), { status: 400 });
  if (prompt.length > 100000) throw Object.assign(new Error('That prompt is too long.'), { status: 400 });
  const cred = credentialsFor(user.id);
  if (!cred) throw Object.assign(new Error('Connect your Claude account first (Account → Claude).'), { status: 400, code: 'no_claude' });
  model = MODELS.includes(model) ? model : chat.model;
  mode = mode === 'plan' ? 'plan' : mode === 'edit' ? 'edit' : chat.mode;

  if (chat.title === 'New chat') db.prepare('UPDATE chat SET title = ? WHERE id = ?').run((prompt || files[0].name).replace(/\s+/g, ' ').slice(0, 70), chat.id);
  db.prepare('UPDATE chat SET model = ?, mode = ?, updatedAt = ?, archivedAt = NULL WHERE id = ?').run(model, mode, now(), chat.id);
  push(chat.id, { type: 'user', text: prompt, attachments: files.length ? files.map(publicUpload) : undefined, userId: user.id, userName: user.name, model, mode });
  // Claude gets the paths and opens the files itself: Read handles images, PDFs, notebooks and text.
  const toClaude = files.length
    ? `${prompt || 'Have a look at the attached files.'}\n\nAttached files (open them with the Read tool):\n${files.map(f => `- ${f.path} (${f.kind}, ${sizeText(f.size)})`).join('\n')}`
    : prompt;
  audit(user.id, 'chat.prompt', project.slug, { chat: chat.id, model, mode });
  if (prompt && project.description?.trim() && getSetting('scopeCheck', false)) checkScope(chat, project, user, prompt, cred);

  const child = spawnCtl(['agent', project.slug, model, mode, chat.claudeSessionId || '-'], {
    stdin: JSON.stringify({ prompt: toClaude, ...cred, system: systemPrompt(project, user) })
  });
  const run = { child, startedAt: now(), userId: user.id, stopped: false, gotResult: false };
  runs.set(chat.id, run);
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
    if (run.stopped) push(chat.id, { type: 'notice', text: 'Stopped.' });
    else if (!run.gotResult){
      const msg = errText.trim().split('\n').slice(-4).join('\n') || `Claude exited (code ${code}).`;
      push(chat.id, { type: 'error', text: /401|authenticat|OAuth|token/i.test(msg) ? `Claude couldn't sign in. Reconnect Claude in Account settings.\n\n${msg}` : msg });
    }
    db.prepare('UPDATE chat SET updatedAt = ? WHERE id = ?').run(now(), chat.id);
    push(chat.id, { type: 'state', running: false }, false);
    emailRunFinished(chat, project, user, run, errText, code);
  });
}

// Account → Email notifications: runs over a minute, or ones that failed. Not ones the person stopped.
const LONG_RUN = 60000;
function emailRunFinished(chat, project, user, run, errText, code){
  if (run.stopped) return;
  const durationMs = now() - run.startedAt;
  const ok = run.gotResult && !run.error;
  if (ok && durationMs < LONG_RUN) return;
  const error = run.error || errText.trim().split('\n').slice(-4).join('\n') || `Claude exited (code ${code}).`;
  const summary = ok && run.lastText ? run.lastText.replace(/\s+/g, ' ').trim().slice(0, 400) + (run.lastText.length > 400 ? '…' : '') : '';
  notify(user.id, 'runFinished', { ok, error, summary, durationMs, chatTitle: getChat(chat.id)?.title || chat.title, projectName: project.name,
    url: `${STUDIO_URL}/p/${project.slug}/chat/${chat.id}` });
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

function handle(chatId, m, run, toolNames){
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
      else if (b.type === 'tool_use'){ toolNames.set(b.id, b.name); push(chatId, { type: 'tool', id: b.id, name: b.name, input: b.input }); }
    }
    return;
  }
  if (m.type === 'user' && Array.isArray(m.message?.content)){
    if (m.parent_tool_use_id) return;
    for (const b of m.message.content) if (b.type === 'tool_result'){
      let text = textOf(b.content);
      if (text.length > 30000) text = text.slice(0, 30000) + `\n… (${text.length - 30000} more characters)`;
      push(chatId, { type: 'tool_result', id: b.tool_use_id, name: toolNames.get(b.tool_use_id), text, isError: !!b.is_error });
    }
    return;
  }
  if (m.type === 'result'){
    run.gotResult = true;
    if (m.is_error || m.subtype !== 'success') run.error = String(m.result || m.subtype || 'Claude stopped with an error');
    const cost = Number(m.total_cost_usd) || 0;
    if (m.session_id) db.prepare('UPDATE chat SET claudeSessionId = ? WHERE id = ?').run(m.session_id, chatId);
    db.prepare('UPDATE chat SET costUsd = costUsd + ? WHERE id = ?').run(cost, chatId);
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
