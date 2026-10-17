// People's own computers running their chats (Account → Your computers). runner/studio-runner.mjs on the computer keeps
// a WebSocket open to /api/runner/socket. When its owner sends a prompt and it's connected with room, the turn runs
// there instead of on the server: Studio sends a snapshot of the project's files (a git bundle, ops/gitsync.mjs), the
// chat's Claude session if it last ran somewhere else, and the prompt. The computer runs its own `claude`, signed in
// with its own account, and streams the output back line by line. At the end it sends its changes and the session,
// which Studio adds to the project. Files and sessions live on the server between turns, so a chat can move either
// way between turns. Only the computer's owner's prompts run there.
//
// A turn keeps going on the computer if the connection drops or Studio restarts: the computer keeps the output and
// its changes until Studio has them, and picks up where it was when it reconnects (DROP_GRACE, then Studio gives up
// on the turn; the changes still come in when the computer is back).
import { createHash } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { WebSocketServer } from 'ws';
import { db, now, audit } from './db.mjs';
import { randomId } from './crypto.mjs';
import { STUDIO_URL, APP_DIR } from './config.mjs';
import { ctl, ctlJson } from './ctl.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS runner (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  tokenHash TEXT NOT NULL UNIQUE,
  maxChats INTEGER NOT NULL DEFAULT 2,  -- turns it runs at once (one per project)
  info TEXT NOT NULL DEFAULT '{}',      -- what it said when it last connected: host, platform, claude, home
  createdAt INTEGER NOT NULL,
  lastSeenAt INTEGER
);
CREATE TABLE IF NOT EXISTS runner_job_done (id TEXT PRIMARY KEY, at INTEGER NOT NULL);   -- turns whose changes are in`);

const DROP_GRACE = Number(process.env.STUDIO_RUNNER_GRACE_MS) || 15 * 60 * 1000;
const MAX_RUNNERS = 5;
const SESSION = /^[0-9a-f-]{36}$/;
const hash = token => createHash('sha256').update('studio-runner:' + token).digest('hex');
const err = (status, message) => Object.assign(new Error(message), { status });
// The runner's own code, served to computers; a computer whose copy differs updates itself between turns.
const FILES = { 'studio-runner.mjs': join(APP_DIR, 'runner', 'studio-runner.mjs'), 'gitsync.mjs': join(APP_DIR, 'ops', 'gitsync.mjs'), 'install.sh': join(APP_DIR, 'runner', 'install.sh') };
export const RUNNER_VERSION = createHash('sha1').update(readFileSync(FILES['studio-runner.mjs'])).update(readFileSync(FILES['gitsync.mjs'])).digest('hex').slice(0, 12);

const conns = new Map();   // runner id -> { ws, runner, asks: Map }
const jobs = new Map();    // job id -> { id, runnerId, chatId, projectId, slug, child, lastLine, dropTimer }
let hooks = { notice(){}, adopt(){} };
// lib/agent.mjs: notice(chatId, text) adds a notice to a chat; adopt(chat) watches a turn found running after a restart.
export const setHooks = h => { hooks = h; };

const runnerById = id => db.prepare('SELECT * FROM runner WHERE id = ?').get(id);
const infoOf = r => { try { return JSON.parse(r.info || '{}'); } catch { return {}; } };
const activeOn = runnerId => [...jobs.values()].filter(j => j.runnerId === runnerId);
export const isConnected = runnerId => conns.has(runnerId);
export const runnerName = runnerId => runnerById(runnerId)?.name || 'your computer';
// The folder a project's chats run in on that computer.
export const folderOn = (runner, slug) => `${infoOf(runner).home || '~/StudioRunner'}/projects/${slug}`;

export function listRunners(userId){
  return db.prepare('SELECT id, name, maxChats, info, createdAt, lastSeenAt FROM runner WHERE userId = ? ORDER BY createdAt').all(userId)
    .map(r => { const i = infoOf(r); return { id: r.id, name: r.name, maxChats: r.maxChats, createdAt: r.createdAt, lastSeenAt: r.lastSeenAt,
      connected: conns.has(r.id), running: activeOn(r.id).length, host: i.host || null, platform: i.platform || null, claude: i.claude || null, version: i.version || null }; });
}

// The code is shown once, inside the install command; Studio keeps only its hash.
export function addRunner(user, name, ip){
  name = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'My Mac';
  if (db.prepare('SELECT count(*) AS n FROM runner WHERE userId = ?').get(user.id).n >= MAX_RUNNERS) throw err(400, `You can add up to ${MAX_RUNNERS} computers. Remove one first.`);
  const id = randomId(9), token = randomId(32);
  db.prepare('INSERT INTO runner (id, userId, name, tokenHash, createdAt) VALUES (?,?,?,?,?)').run(id, user.id, name, hash(token), now());
  audit(user.id, 'runner.add', name, '', ip);
  return { id, name, command: `curl -fsSL ${STUDIO_URL}/runner/install.sh | bash -s -- ${token}` };
}

export function removeRunner(user, id, ip){
  const r = db.prepare('SELECT * FROM runner WHERE id = ? AND userId = ?').get(id, user.id);
  if (!r) throw err(404, 'That computer isn’t added.');
  const c = conns.get(id);
  if (c){ c.replaced = true; send(c, { type: 'unpaired' }); c.ws.close(4001, 'Removed in Studio'); conns.delete(id); }
  for (const job of activeOn(id)) job.child.end(1, `${r.name} was removed from Studio, so this turn stopped.`);
  db.prepare('DELETE FROM runner WHERE id = ?').run(id);
  audit(user.id, 'runner.remove', r.name, '', ip);
}

export function setMaxChats(user, id, n){
  const r = db.prepare('SELECT * FROM runner WHERE id = ? AND userId = ?').get(id, user.id);
  if (!r) throw err(404, 'That computer isn’t added.');
  const max = Math.max(1, Math.min(6, Math.round(Number(n)) || 2));
  db.prepare('UPDATE runner SET maxChats = ? WHERE id = ?').run(max, id);
  if (conns.has(id)) conns.get(id).runner.maxChats = max;
}

// The runner's files, for the install command and updates. install.sh gets this Studio's address.
export function runnerFile(name){
  if (!FILES[name]) return null;
  const text = readFileSync(FILES[name], 'utf8');
  return name === 'install.sh' ? text.replaceAll('__STUDIO_URL__', STUDIO_URL) : text;
}

// Where this person's turn in this project runs: one of their computers that's connected, has room and isn't already
// running a turn in this project, or null for the server. runOn: 'auto' (a computer if one can, else the server),
// 'computer' (a computer, or an error) or 'server'.
export function pick(user, project, runOn){
  if (runOn === 'server') return null;
  const mine = [...conns.values()].map(c => c.runner).filter(r => r.userId === user.id);
  const free = mine.find(r => { const a = activeOn(r.id); return a.length < r.maxChats && !a.some(j => j.projectId === project.id); });
  if (free) return free;
  if (runOn === 'computer'){
    if (!mine.length) throw err(409, listRunners(user.id).length ? 'Your computer isn’t connected to Studio right now. Wake it up, or choose Auto or Studio server.' : 'You haven’t added a computer yet (Account → Your computers).');
    throw err(409, 'Your computer is already busy with as many chats as it runs at once, or with another chat in this project. Wait, or choose Auto or Studio server.');
  }
  return null;
}

// What lib/agent.mjs watches: it looks like the server's child process (stdout lines, stderr, close), and also
// emits 'notice' for things to tell the chat.
class RemoteChild extends EventEmitter {
  constructor(job){ super(); this.job = job; this.remote = true; this.stdout = new EventEmitter(); this.stderr = new EventEmitter(); this.exitCode = null; }
  kill(sig){ stopJob(this.job, sig === 'SIGKILL'); }
  end(code, text){
    if (this.exitCode !== null) return;
    const j = this.job;
    clearTimeout(j.dropTimer);
    jobs.delete(j.id);
    db.prepare('UPDATE chat SET runnerId = NULL, runnerJob = NULL WHERE id = ? AND runnerJob = ?').run(j.chatId, j.id);
    if (text) this.stderr.emit('data', text);
    this.exitCode = code;
    this.emit('close', code);
  }
}

// Starts a turn on a computer. files: the message's attachments (lib/uploads.mjs), sent along since the computer can't
// read the server's copies.
export function startJob(runner, { chat, project, user, prompt, system, files = [] }){
  const job = { id: randomId(12), runnerId: runner.id, chatId: chat.id, projectId: project.id, slug: project.slug, lastLine: -1, dropTimer: null };
  const child = job.child = new RemoteChild(job);
  jobs.set(job.id, job);
  db.prepare('UPDATE chat SET runnerId = ?, runnerJob = ?, runnerLine = -1 WHERE id = ?').run(runner.id, job.id, chat.id);
  (async () => {
    const conn = () => { const c = conns.get(runner.id); if (!c) throw new Error('it isn’t connected any more'); return c; };
    const have = await ask(conn(), { type: 'have', slug: project.slug });
    const git = await ctlJson(['sync-out', project.slug], { stdin: JSON.stringify({ have: have.commits || [] }), timeout: 300000 });
    let transcript = null;
    if (chat.claudeSessionId && chat.lastRanOn !== runner.id){
      const r = await ctl(['session-export', project.slug, chat.claudeSessionId], { timeout: 60000 });
      transcript = r.code === 0 && r.out.trim() ? r.out.trim() : null;
    }
    const attachments = files.map(f => ({ id: f.id, name: f.name, kind: f.kind, size: f.size, data: readFileSync(f.path).toString('base64') }));
    if (child.exitCode !== null) return;   // stopped meanwhile
    send(conn(), { type: 'job', job: job.id, chatId: chat.id, slug: project.slug, model: chat.model, mode: chat.mode, prompt, system,
      sessionId: chat.claudeSessionId || null, transcript, attachments, git, name: user.name, email: user.email });
  })().catch(e => child.end(1, `Couldn’t start this on ${runner.name}: ${e.message}`));
  return child;
}

function stopJob(job, force){
  const c = conns.get(job.runnerId);
  if (c && !force){ send(c, { type: 'stop', job: job.id }); return; }
  if (c) return;   // it's stopping, and sends its changes when it has
  // Not connected: the turn ends here now. The computer stops it, and its changes come in, when it reconnects.
  job.child.end(1);
}

// A turn found marked as running on a computer when Studio starts (or when that computer reconnects first).
export function adopt(chat){
  const job = { id: chat.runnerJob, runnerId: chat.runnerId, chatId: chat.id, projectId: chat.projectId, slug: null, lastLine: chat.runnerLine ?? -1, dropTimer: null };
  job.slug = db.prepare('SELECT slug FROM project WHERE id = ?').get(chat.projectId)?.slug;
  job.child = new RemoteChild(job);
  jobs.set(job.id, job);
  if (!conns.has(job.runnerId)) waitForReturn(job);
  return job.child;
}
export const hasJob = id => jobs.has(id);

function waitForReturn(job){
  clearTimeout(job.dropTimer);
  const mins = Math.round(DROP_GRACE / 60000);
  job.dropTimer = setTimeout(() => job.child.end(1, `${runnerName(job.runnerId)} went offline in the middle of this turn and didn’t come back within ${mins} minute${mins === 1 ? '' : 's'}. Whatever it changed is added to the project when it reconnects.`), DROP_GRACE);
  job.dropTimer.unref?.();
}

// ---------- the socket ----------
// The runner sends { type: 'hello', token, version, host, platform, claude, home, jobs: [ids it's running or still
// has results for] } first; Studio answers { type: 'ready' } and, for each of those jobs, { type: 'resume', job, after }
// (send the output lines after that one, then the result) or, for a turn Studio has given up on, { type: 'resume',
// job, lines: false } and { type: 'stop' }. Then: Studio → { type: 'have', req, slug } (which commits do you have),
// { type: 'job', … }, { type: 'stop', job }, { type: 'done-ack', job }, { type: 'pong' }; runner → { type: 'have', req,
// commits }, { type: 'line', job, n, line }, { type: 'done', job, … } (see applyDone), { type: 'ping' }.
const wss = new WebSocketServer({ noServer: true, maxPayload: 300 * 1024 * 1024 });
export function handleRunnerUpgrade(req, socket, head){ wss.handleUpgrade(req, socket, head, ws => welcome(ws)); }

const send = (c, m) => { if (c.ws.readyState === c.ws.OPEN) c.ws.send(JSON.stringify(m)); };
function ask(c, m){
  const req = randomId(8);
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => { c.asks.delete(req); reject(new Error('it didn’t answer')); }, 30000);
    c.asks.set(req, v => { clearTimeout(t); resolve(v); });
    send(c, { ...m, req });
  });
}

function welcome(ws){
  let conn = null;
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  const helloTimer = setTimeout(() => ws.close(4000, 'Say hello first'), 10000);
  ws.on('message', raw => {
    let m; try { m = JSON.parse(String(raw)); } catch { return; }
    ws.isAlive = true;
    if (!conn){
      if (m.type !== 'hello') return;
      clearTimeout(helloTimer);
      const runner = db.prepare('SELECT runner.* FROM runner JOIN user ON user.id = runner.userId WHERE tokenHash = ? AND NOT coalesce(user.banned, 0)').get(hash(String(m.token || '')));
      if (!runner){ ws.send(JSON.stringify({ type: 'unpaired' })); return ws.close(4001, 'Not paired'); }
      const old = conns.get(runner.id);
      if (old){ old.replaced = true; old.ws.close(4002, 'Connected again'); }
      const info = { host: String(m.host || '').slice(0, 100), platform: String(m.platform || '').slice(0, 30), claude: String(m.claude || '').slice(0, 60),
        version: String(m.version || '').slice(0, 20), home: String(m.home || '').slice(0, 300) };
      db.prepare('UPDATE runner SET lastSeenAt = ?, info = ? WHERE id = ?').run(now(), JSON.stringify(info), runner.id);
      conn = { ws, runner: { ...runner, info: JSON.stringify(info) }, asks: new Map() };
      conns.set(runner.id, conn);
      send(conn, { type: 'ready', name: runner.name, version: RUNNER_VERSION });
      for (const id of (Array.isArray(m.jobs) ? m.jobs : []).map(String).slice(0, 50)) reattach(conn, id);
      return;
    }
    if (m.type === 'ping') return send(conn, { type: 'pong' });
    if (m.type === 'have'){ conn.asks.get(m.req)?.(m); conn.asks.delete(m.req); return; }
    if (m.type === 'line') return onLine(conn, m);
    if (m.type === 'done') return onDone(conn, m).catch(e => console.error('runner done', e));
  });
  ws.on('close', () => {
    clearTimeout(helloTimer);
    if (!conn || conns.get(conn.runner.id) !== conn) return;
    conns.delete(conn.runner.id);
    db.prepare('UPDATE runner SET lastSeenAt = ? WHERE id = ?').run(now(), conn.runner.id);
    if (conn.replaced) return;
    for (const job of activeOn(conn.runner.id)){
      job.child.emit('notice', `Lost touch with ${conn.runner.name}. Claude keeps working there; waiting for it to come back…`);
      waitForReturn(job);
    }
  });
  ws.on('error', () => {});
}

function reattach(conn, id){
  let job = jobs.get(id);
  if (!job){
    // Studio restarted during the turn and this computer is back before Studio picked the chat up.
    const chat = db.prepare('SELECT * FROM chat WHERE runnerJob = ? AND runnerId = ?').get(id, conn.runner.id);
    if (chat){ hooks.adopt(chat); job = jobs.get(id); }
  }
  if (job && job.runnerId === conn.runner.id){
    const away = !!job.dropTimer;
    clearTimeout(job.dropTimer); job.dropTimer = null;
    if (away) job.child.emit('notice', `Back in touch with ${conn.runner.name}.`);
    send(conn, { type: 'resume', job: id, after: job.lastLine });
  } else {
    // A turn Studio gave up on (or stopped while it was away): stop it, but still take its changes.
    send(conn, { type: 'resume', job: id, lines: false });
    send(conn, { type: 'stop', job: id });
  }
}

function onLine(conn, m){
  const job = jobs.get(String(m.job));
  if (!job || job.runnerId !== conn.runner.id || job.child.exitCode !== null) return;
  const n = Number(m.n);
  if (!Number.isInteger(n) || n <= job.lastLine) return;
  job.lastLine = n;
  const line = String(m.line || '');
  // Saved for picking up after a restart; streamed text deltas aren't saved anyway, so they don't count.
  if (!line.includes('"stream_event"')) db.prepare('UPDATE chat SET runnerLine = ? WHERE id = ?').run(n, job.chatId);
  job.child.stdout.emit('data', line + '\n');
}

// The end of a turn: { job, chatId, slug, code, stderr, sync: { base, head, after, headAfter, bundle } | null,
// syncError, transcript (gzipped, base64) | null, sessionId }. Its changes go into the project folder (once, even if the
// computer sends this again), then the turn ends. Changes from a turn Studio gave up on still come in.
async function onDone(conn, m){
  const id = String(m.job);
  const job = jobs.get(id);
  const live = job && job.runnerId === conn.runner.id && job.child.exitCode === null ? job : null;
  const notices = [];
  if (!db.prepare('SELECT 1 FROM runner_job_done WHERE id = ?').get(id)){
    const chat = db.prepare('SELECT * FROM chat WHERE id = ?').get(String(m.chatId));
    const project = chat && db.prepare('SELECT * FROM project WHERE id = ?').get(chat.projectId);
    const owner = db.prepare('SELECT id, role FROM user WHERE id = ?').get(conn.runner.userId);
    const allowed = project && project.slug === m.slug && owner && (owner.role === 'admin' || db.prepare('SELECT 1 FROM member WHERE userId = ? AND organizationId = ?').get(owner.id, project.organizationId));
    if (allowed){
      const name = conn.runner.name;
      if (m.sync){
        try {
          const r = await ctlJson(['sync-in', project.slug], { stdin: JSON.stringify(m.sync), timeout: 300000 });
          if (r.conflicts?.length) notices.push(`Some changes made on ${name} clashed with changes made here meanwhile. ${r.conflicts.length === 1 ? 'This file has' : 'These files have'} conflict markers (<<<<<<< and >>>>>>>) to sort out: ${r.conflicts.slice(0, 10).join(', ')}${r.conflicts.length > 10 ? '…' : ''}`);
          if (r.commits === 'as-changes') notices.push(`Claude committed on ${name}, but the project’s history here moved on meanwhile, so those commits came in as uncommitted changes.`);
          if (r.unapplied) notices.push(`The changes made on ${name} couldn’t be added here, because files changed while they were being added. They’re kept in the project’s git as ${r.unapplied}: ask Claude to bring them in.`);
        } catch (e){ notices.push(`The changes made on ${name} couldn’t be added to the project: ${e.message}`); }
      } else if (m.syncError) notices.push(`${name} couldn’t send back its changes: ${String(m.syncError).slice(0, 300)}`);
      if (m.transcript && SESSION.test(m.sessionId || '')){
        const r = await ctl(['session-import', project.slug, m.sessionId], { stdin: String(m.transcript), timeout: 60000 });
        if (r.code === 0) db.prepare('UPDATE chat SET claudeSessionId = ?, lastRanOn = ? WHERE id = ?').run(m.sessionId, conn.runner.id, chat.id);
      }
      if (!live) notices.unshift(`${name} is back. The changes from its interrupted turn are now in the project.`);
      if (!live) for (const t of notices) hooks.notice(chat.id, t);
    }
    db.prepare('INSERT OR IGNORE INTO runner_job_done (id, at) VALUES (?, ?)').run(id, now());
    db.prepare('DELETE FROM runner_job_done WHERE at < ?').run(now() - 30 * 24 * 3600 * 1000);
  }
  send(conn, { type: 'done-ack', job: id });
  if (live){
    for (const t of notices) live.child.emit('notice', t);
    live.child.end(Number.isInteger(m.code) ? m.code : 1, String(m.stderr || '').slice(-20000));
  }
}

// Connections that stopped answering (a computer that went to sleep can leave one open) are closed.
setInterval(() => { for (const c of conns.values()){ if (!c.ws.isAlive){ c.ws.terminate(); continue; } c.ws.isAlive = false; try { c.ws.ping(); } catch {} } }, 30000).unref();
