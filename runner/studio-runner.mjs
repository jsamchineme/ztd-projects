#!/usr/bin/env node
// Studio Runner: runs your ZTD Devs Studio chats on this computer, with its own CPU and memory and the Claude Code
// signed in here. Installed by the command on Studio's Account page (runner/install.sh), which starts it at login.
// It keeps a connection open to Studio (outgoing only: nothing on this computer is opened to the internet). For each
// turn Studio sends, it brings its copy of the project up to date (~/StudioRunner/projects/<project>), runs `claude`
// there and streams the output to Studio. At the end it sends back what changed and Claude's session for the chat.
// See lib/runner.mjs in Studio for the other side. Needs Node.js 22 or newer, git and Claude Code.
//
//   node studio-runner.mjs           runs it (the LaunchAgent does this)
//   STUDIO_RUNNER_HOME=<folder>      keeps its settings and projects there instead of ~/StudioRunner
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, realpathSync, renameSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { homedir, hostname, platform } from 'node:os';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as gitsync from './gitsync.mjs';

const HOME = process.env.STUDIO_RUNNER_HOME || join(homedir(), 'StudioRunner');
const APP = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(HOME, 'config.json'), 'utf8'));   // { studio, token, claude, git, path }
if (conf.path) process.env.PATH = conf.path;
const CLAUDE_DIR = process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');
const PROJECTS = join(HOME, 'projects'), PENDING = join(HOME, 'pending'), UPLOADS = join(HOME, 'uploads');
const VERSION = createHash('sha1').update(readFileSync(join(APP, 'studio-runner.mjs'))).update(readFileSync(join(APP, 'gitsync.mjs'))).digest('hex').slice(0, 12);
const SLUG = /^[a-z][a-z0-9-]{0,30}[a-z0-9]$/;
const KEEP_LINES = 20000;   // output lines kept for Studio to catch up on after a dropped connection
for (const d of [PROJECTS, PENDING, UPLOADS]) mkdirSync(d, { recursive: true });
const log = (...a) => console.log(new Date().toISOString(), ...a);

// The `claude` command: a path, or a .mjs/.js file run with this Node (the tests use a stand-in).
const claudeCmd = () => { const c = conf.claude || 'claude'; return /\.m?js$/.test(c) ? [process.execPath, c] : [c]; };
const claudeVersion = (() => { try { const [c, ...a] = claudeCmd(); return String(spawnSync(c, [...a, '--version'], { encoding: 'utf8', timeout: 15000 }).stdout || '').trim().split('\n')[0].slice(0, 60); } catch { return ''; } })();

// git in a project folder, for gitsync.mjs.
const gitIn = cwd => (args, { input, env } = {}) => {
  const r = spawnSync(conf.git || 'git', ['-c', 'core.quotepath=off', ...args], { cwd, input, env: { ...process.env, ...env }, maxBuffer: 1024 * 1024 * 1024 });
  return { status: r.status, stdout: r.stdout || Buffer.alloc(0), stderr: String(r.stderr || '') + (r.error ? r.error.message : '') };
};

// ---------- turns ----------
// id -> { id, chatId, slug, n, lines: [[n, line]], base: { base, head }, sessionId, child, done, stopped }
// A turn is saved in pending/ from start to Studio's done-ack, so a restart of this runner (or of the computer)
// still sends Studio what changed.
const jobs = new Map();
const savePending = job => { const { child, ...rest } = job; writeFileSync(join(PENDING, `${job.id}.json.tmp`), JSON.stringify(rest)); renameSync(join(PENDING, `${job.id}.json.tmp`), join(PENDING, `${job.id}.json`)); };

function emit(job, line){
  job.n++;
  if (!line.includes('"stream_event"')){
    job.lines.push([job.n, line]);
    if (job.lines.length > KEEP_LINES) job.lines.splice(0, job.lines.length - KEEP_LINES);
    try { const m = JSON.parse(line); if (m.session_id && gitsync.SESSION.test(m.session_id)) job.sessionId = m.session_id; } catch {}
  }
  send({ type: 'line', job: job.id, n: job.n, line });
}

function startJob(m){
  if (!SLUG.test(m.slug || '') || !/^[\w-]{6,40}$/.test(m.job || '')) return;
  if (jobs.has(m.job)) return;
  const job = { id: m.job, chatId: m.chatId, slug: m.slug, n: -1, lines: [], base: null, sessionId: m.sessionId || null, done: null, stopped: false };
  jobs.set(job.id, job);
  const busy = [...jobs.values()].some(j => j !== job && j.slug === m.slug);
  if (busy) return finish(job, 1, 'This computer still has another turn in this project to finish or send to Studio. Try again in a moment.', { noSync: true });
  const dir = join(PROJECTS, m.slug);
  let prompt = String(m.prompt || '');
  try {
    mkdirSync(dir, { recursive: true });
    const git = gitIn(dir);
    if (!existsSync(join(dir, '.git')) && git(['init', '-q']).status !== 0) throw new Error('git init failed');
    if (m.git.bundle) gitsync.unbundle(git, Buffer.from(m.git.bundle, 'base64'), m.git.snap);
    gitsync.restore(git, m.git);
    job.base = { base: m.git.snap, head: m.git.head };
    savePending(job);
    // The chat's Claude session, where `claude --resume` looks for it in this folder.
    if (m.transcript && gitsync.SESSION.test(m.sessionId || '')){
      const sdir = gitsync.sessionDir(CLAUDE_DIR, realpathSync(dir));
      mkdirSync(sdir, { recursive: true });
      writeFileSync(join(sdir, `${m.sessionId}.jsonl`), gunzipSync(Buffer.from(m.transcript, 'base64')));
    }
    // Attached files: saved here, outside the project, and listed for Claude to open.
    if (m.attachments?.length){
      const paths = m.attachments.map(a => {
        const d = join(UPLOADS, m.slug, String(a.id).replace(/[^\w-]/g, '').slice(0, 40) || 'file');
        mkdirSync(d, { recursive: true });
        const p = join(d, basename(String(a.name || 'file')).replace(/^\.+/, '_') || 'file');
        writeFileSync(p, Buffer.from(a.data, 'base64'));
        return `- ${p} (${a.kind}, ${Math.round(a.size / 1024)} KB)`;
      });
      prompt += `\n\nAttached files (open them with the Read tool):\n${paths.join('\n')}`;
    }
  } catch (e){
    log(`job ${job.id} ${m.slug}: ${e.message}`);
    return finish(job, 1, `Couldn’t get the project ready on this computer: ${e.message}`, { noSync: !job.base });
  }
  log(`job ${job.id} ${m.slug} ${m.model} ${m.mode}`);
  runClaude(job, m, dir, prompt, m.sessionId);
}

function runClaude(job, m, dir, prompt, resume){
  const [cmd, ...pre] = claudeCmd();
  const args = [...pre, '-p', '--output-format', 'stream-json', '--verbose', '--include-partial-messages', '--model', m.model,
    '--permission-mode', m.mode === 'plan' ? 'plan' : 'bypassPermissions',
    // Headless (-p) chats have no one at a terminal to answer, so AskUserQuestion always errors mid-turn. Turn it off so
    // Claude asks in its reply instead; the person answers in their next prompt.
    '--disallowedTools', 'AskUserQuestion'];
  if (resume) args.push('--resume', resume);
  if (existsSync(join(UPLOADS, m.slug))) args.push('--add-dir', join(UPLOADS, m.slug));
  if (m.system) args.push('--append-system-prompt', String(m.system).slice(0, 20000));
  const env = { ...process.env, STUDIO_PROJECT: m.slug, DISABLE_AUTOUPDATER: '1' };
  // Commits Claude makes are made as the Studio user who sent the prompt.
  if (/^[^\n<>]{1,100}$/.test(m.name || '')) env.GIT_AUTHOR_NAME = env.GIT_COMMITTER_NAME = m.name;
  if (/^[^\s<>@]+@[^\s<>@]+$/.test(m.email || '')) env.GIT_AUTHOR_EMAIL = env.GIT_COMMITTER_EMAIL = m.email;
  const child = spawn(cmd, args, { cwd: dir, env, stdio: ['pipe', 'pipe', 'pipe'], detached: true });
  job.child = child;
  child.stdin.on('error', () => {});
  child.stdin.end(prompt);
  // Keeps the Mac from sleeping while Claude works (it still sleeps with the lid closed on battery).
  if (platform() === 'darwin') spawn('caffeinate', ['-i', '-w', String(child.pid)], { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  let buf = '', errText = '', started = false;
  child.stdout.on('data', d => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0){ const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (line){ started = true; emit(job, line); } }
  });
  child.stderr.on('data', d => { errText = (errText + d).slice(-20000); });
  child.on('error', e => { errText += e.message; });
  child.on('close', code => {
    job.child = null;
    // The session didn't come along (or was lost here): start a new one rather than fail.
    if (resume && !started && !job.stopped && /no conversation found|session/i.test(errText)){
      log(`job ${job.id}: session ${resume} not found here, starting a new one`);
      return runClaude(job, m, dir, `(Your earlier conversation in this chat couldn’t be loaded on this computer, so this is a new session. Look at the project to catch up.)\n\n${prompt}`, null);
    }
    finish(job, code ?? 1, errText);
  });
}

function stopJob(id){
  const job = jobs.get(id);
  if (!job?.child) return;
  job.stopped = true;
  const group = sig => { try { process.kill(-job.child.pid, sig); } catch {} };
  group('SIGINT');
  setTimeout(() => { if (job.child) group('SIGKILL'); }, 5000).unref();
}

// The end of a turn: what changed (a snapshot of the folder against the one Studio sent) and the session, kept until
// Studio says it has them.
function finish(job, code, stderr, { noSync = false } = {}){
  let sync = null, syncError = null, transcript = null;
  const dir = join(PROJECTS, job.slug);
  if (!noSync && job.base){
    try {
      const git = gitIn(dir);
      const s = gitsync.snapshot(git);
      const b = gitsync.bundle(git, s.snap, [job.base.base]);
      sync = { base: job.base.base, head: job.base.head, after: s.snap, headAfter: s.head, bundle: b ? b.toString('base64') : null };
    } catch (e){ syncError = e.message; }
  }
  if (job.sessionId && !noSync){
    try { transcript = gzipSync(readFileSync(join(gitsync.sessionDir(CLAUDE_DIR, realpathSync(dir)), `${job.sessionId}.jsonl`))).toString('base64'); } catch {}
  }
  job.done = { type: 'done', job: job.id, chatId: job.chatId, slug: job.slug, code, stderr: String(stderr || '').slice(-20000), sync, syncError, transcript, sessionId: job.sessionId };
  savePending(job);
  log(`job ${job.id} done (${code})${sync ? '' : syncError ? `, changes not sent: ${syncError}` : ''}`);
  send(job.done);
}

// ---------- the connection ----------
let ws = null, backoff = 1000, lastPong = Date.now();
const send = m => { if (ws?.readyState === 1) ws.send(JSON.stringify(m)); };

function connect(){
  const url = conf.studio.replace(/^http/, 'ws').replace(/\/$/, '') + '/api/runner/socket';
  const sock = ws = new WebSocket(url);
  sock.onopen = () => {
    backoff = 1000; lastPong = Date.now();
    log(`connected to ${conf.studio}`);
    send({ type: 'hello', token: conf.token, version: VERSION, host: hostname(), platform: platform(), claude: claudeVersion, home: HOME, jobs: [...jobs.keys()] });
  };
  sock.onmessage = e => { let m; try { m = JSON.parse(String(e.data)); } catch { return; } lastPong = Date.now(); handle(m); };
  sock.onclose = e => {
    if (ws !== sock) return;
    ws = null;
    if (e.code === 4001){ log('This computer was removed from Studio (or its code is wrong). Stopping.'); process.exit(0); }
    log(`disconnected (${e.code}), trying again in ${Math.round(backoff / 1000)} s`);
    setTimeout(connect, backoff);
    backoff = Math.min(backoff * 2, 30000);
  };
  sock.onerror = () => {};
}

function handle(m){
  if (m.type === 'ready'){
    log(`ready as "${m.name}"`);
    if (m.version && m.version !== VERSION) update().catch(e => log(`update failed: ${e.message}`));
  }
  else if (m.type === 'unpaired'){ log('This computer was removed from Studio (or its code is wrong). Stopping.'); process.exit(0); }
  else if (m.type === 'have'){
    const dir = join(PROJECTS, String(m.slug || ''));
    send({ type: 'have', req: m.req, commits: SLUG.test(m.slug || '') && existsSync(join(dir, '.git')) ? gitsync.known(gitIn(dir)) : [] });
  }
  else if (m.type === 'job') startJob(m);
  else if (m.type === 'stop') stopJob(m.job);
  else if (m.type === 'resume'){
    // Back after a dropped connection (or a Studio restart): what Studio missed, then the result if there is one.
    const job = jobs.get(m.job);
    if (!job) return;
    if (m.lines !== false) for (const [n, line] of job.lines) if (n > m.after) send({ type: 'line', job: job.id, n, line });
    if (job.done) send(job.done);
  }
  else if (m.type === 'done-ack'){ jobs.delete(m.job); rmSync(join(PENDING, `${m.job}.json`), { force: true }); }
}

// Studio has a newer runner: fetch it and exit once no turn is running; the LaunchAgent starts the new one.
async function update(){
  for (const f of ['studio-runner.mjs', 'gitsync.mjs']){
    const r = await fetch(`${conf.studio}/runner/${f}`);
    if (!r.ok) throw new Error(`${f}: ${r.status}`);
    writeFileSync(join(APP, `${f}.new`), await r.text());
  }
  const swap = () => {
    if ([...jobs.values()].some(j => j.child)) return setTimeout(swap, 10000);
    for (const f of ['studio-runner.mjs', 'gitsync.mjs']) renameSync(join(APP, `${f}.new`), join(APP, f));
    log('updated; restarting'); process.exit(75);
  };
  swap();
}

// Studio answers pings; a connection that went quiet (sleep, a changed network) is dropped and made again.
setInterval(() => {
  if (!ws || ws.readyState !== 1) return;
  if (Date.now() - lastPong > 75000){ log('connection went quiet, reconnecting'); try { ws.close(); } catch {} ws = null; setTimeout(connect, 1000); return; }
  send({ type: 'ping' });
}, 30000);
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { for (const j of jobs.values()) if (j.child) try { process.kill(-j.child.pid, 'SIGTERM'); } catch {} process.exit(0); });
// Turns from before a restart: finished ones wait for Studio's done-ack; unfinished ones send what they changed.
for (const f of readdirSync(PENDING).filter(f => f.endsWith('.json'))){
  try {
    const job = JSON.parse(readFileSync(join(PENDING, f), 'utf8'));
    jobs.set(job.id, job);
    if (!job.done) finish(job, 1, 'The runner on this computer stopped in the middle of this turn (it restarted, or the computer shut down).');
  } catch { rmSync(join(PENDING, f), { force: true }); }
}
log(`Studio Runner ${VERSION} (${claudeVersion || 'claude version unknown'}), projects in ${PROJECTS}`);
connect();
