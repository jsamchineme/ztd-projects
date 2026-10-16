// A fake Studio API for the design preview. Answers every call the real front end makes, from made-up data in
// memory, and plays a short scripted Claude run when a message is sent. Nothing touches the real Studio.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { seed, realLog, realFiles, DOMAIN } from './mock-data.mjs';

const REPO = join(import.meta.dirname, '..');
let S = seed();
const watchers = new Map();   // chatId -> Set of SSE responses
const runs = new Map();       // chatId -> timers of a scripted run
export function reset(){ for (const id of runs.keys()) cancelRun(id); S = seed(); }

const err = (status, message, code) => Object.assign(new Error(message), { status, code });
const send = (res, status, body, type = 'application/json', headers = {}) => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...headers });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
};
const readBody = req => new Promise(resolve => {
  const chunks = []; req.on('data', c => chunks.push(c));
  req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch { resolve({}); } });
});
const sse = res => {
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.write(': ok\n\n');
  const ping = setInterval(() => res.write('event: ping\ndata: \n\n'), 20000);
  res.on('close', () => clearInterval(ping));
};
const me = () => S.users[0];
const cookieOpts = 'Path=/; SameSite=Lax';

// ---------- views, shaped like server.mjs returns them ----------
const statusOf = s => ({ state: s.state, since: s.state === 'running' ? new Date(s.since).toString() : null, restarts: s.restarts, memoryMB: s.state === 'running' || s.state === 'starting' ? s.mem : null, enabled: !!s.autostart });
const serviceView = s => ({ id: s.id, name: s.name, label: s.label, command: s.command, port: s.port, subdomain: s.subdomain, memoryMB: s.memoryMB, autostart: s.autostart, publicAccess: s.publicAccess,
  certStatus: s.certStatus, url: s.subdomain ? `https://${s.subdomain}.${DOMAIN}` : null, envKeys: s.envKeys, unit: null, status: statusOf(s) });
const roleIn = orgId => S.teams.find(t => t.organizationId === orgId)?.members.find(m => m[0] === me().id)?.[1] || 'site-admin';
function projectView(p){
  const role = roleIn(p.organizationId);
  const team = S.teams.find(t => t.organizationId === p.organizationId);
  const worker = p.workerClaudeUserId ? S.users.find(u => u.id === p.workerClaudeUserId) : null;
  return { id: p.id, slug: p.slug, name: p.name, description: p.description, organizationId: p.organizationId, status: p.status, statusDetail: null, workerClaudeUserId: p.workerClaudeUserId,
    createdAt: Date.now() - 90 * 864e5, role, canManage: true, team: team ? { id: team.organizationId, name: team.name } : null, services: p.services.map(serviceView),
    workerClaude: worker ? { id: worker.id, name: worker.name } : null, running: S.chats.filter(c => c.projectId === p.id && c.running).length };
}
const chatView = c => ({ id: c.id, projectId: c.projectId, userId: c.userId, title: c.title, model: c.model, mode: c.mode, costUsd: 0, createdAt: c.createdAt, updatedAt: c.updatedAt,
  archivedAt: c.archivedAt, running: c.running, mine: c.userId === me().id, prompt: c.events.find(e => e.type === 'user')?.text?.slice(0, 2000) });
const memberships = () => S.teams.filter(t => t.members.some(m => m[0] === me().id)).map(t => ({ organizationId: t.organizationId, role: roleIn(t.organizationId), name: t.name, slug: t.slug }));
const project = id => { const p = S.projects.find(x => x.id === id); if (!p) throw err(404, 'Project not found'); return p; };
const chat = id => { const c = S.chats.find(x => x.id === id); if (!c) throw err(404, 'Chat not found'); return c; };

// ---------- chat events and the scripted run ----------
function push(c, ev, store = true){
  ev = { ...ev, at: Date.now() };
  if (store){ ev.seq = c.events.length; c.events.push(ev); }
  for (const res of watchers.get(c.id) || []) res.write(`data: ${JSON.stringify(ev)}\n\n`);
}
function cancelRun(id){ for (const t of runs.get(id) || []) clearTimeout(t); runs.delete(id); }
function playRun(c, prompt){
  cancelRun(c.id);
  c.running = true; c.updatedAt = Date.now();
  const p = S.projects.find(x => x.id === c.projectId);
  const repo = `/srv/projects/${p.slug}/repo/`;
  const reply = `This is the design preview, so nothing really changed. In Studio, Claude would now work on “${String(prompt).slice(0, 80)}” in **${p.name}**:\n\n- read the relevant files\n- make the change and run the tests\n- tell you what to check\n\nEverything here is made-up data, so feel free to click around.`;
  const steps = [];
  let at = 300;
  const step = (gap, fn) => { at += gap; steps.push(setTimeout(fn, at)); };
  push(c, { type: 'state', running: true }, false);
  step(200, () => push(c, { type: 'thinking_delta', text: '…' }, false));
  step(1400, () => push(c, { type: 'thinking', text: 'Find where this lives, change it, then check it in the browser.' }));
  step(400, () => push(c, { type: 'tool', id: 'r1', name: 'Grep', input: { pattern: String(prompt).split(/\s+/).slice(0, 2).join(' '), path: repo + 'public' } }));
  step(900, () => push(c, { type: 'tool_result', id: 'r1', text: 'public/app.js:42', isError: false }));
  step(500, () => push(c, { type: 'tool', id: 'r2', name: 'Edit', input: { file_path: repo + 'public/app.css', old_string: '--accent: #b9572f;', new_string: '--accent: #00427c;' } }));
  step(1100, () => push(c, { type: 'tool_result', id: 'r2', text: 'The file has been updated.', isError: false }));
  const words = reply.split(/(\s+)/);
  for (let i = 0; i < words.length; i += 3) step(70, () => push(c, { type: 'delta', text: words.slice(i, i + 3).join('') }, false));
  step(300, () => push(c, { type: 'text', text: reply }));
  step(100, () => { push(c, { type: 'result', ok: true, durationMs: at, turns: 4, costUsd: 0.12 }); c.running = false; c.updatedAt = Date.now(); push(c, { type: 'state', running: false }, false); runs.delete(c.id); });
  runs.set(c.id, steps);
}

// ---------- small generated images ----------
function qrSvg(text){
  let h = 2166136261; const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const n = 29, cells = [];
  const finder = (x, y) => { for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if (i === 0 || i === 6 || j === 0 || j === 6 || (i > 1 && i < 5 && j > 1 && j < 5)) cells.push([x + i, y + j]); };
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) if (!inFinder(x, y) && rnd() < .48) cells.push([x, y]);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${n + 2} ${n + 2}" width="220" height="220"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><path fill="#111" d="${cells.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join('')}"/></svg>`;
}
const pictureSvg = name => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 300" width="440" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00427c"/><stop offset="1" stop-color="#1d5fa3"/></linearGradient></defs><rect width="440" height="300" fill="url(#g)"/><rect x="28" y="28" width="384" height="40" rx="8" fill="#fff" opacity=".15"/><rect x="28" y="92" width="240" height="22" rx="6" fill="#fff" opacity=".85"/><rect x="28" y="126" width="180" height="14" rx="5" fill="#fff" opacity=".45"/><rect x="28" y="210" width="120" height="40" rx="20" fill="#ffc349"/><text x="412" y="282" fill="#fff" opacity=".6" font-family="sans-serif" font-size="13" text-anchor="end">${name.replace(/[<&]/g, '')}</text></svg>`;

// ---------- the fake repo's diff, files and logs ----------
const DIFF = `diff --git a/public/app.css b/public/app.css
index 3f2a1c4..9b7e0d2 100644
--- a/public/app.css
+++ b/public/app.css
@@ -8,11 +8,14 @@
   --muted: #6b6860;
   --faint: #8f8b82;
-  --accent: #b9572f;
-  --accent-hover: #a14a26;
-  --accent-soft: #f6e6dd;
+  --accent: #00427c;          /* ZTD navy */
+  --accent-fill: #00427c;
+  --accent-hover: #003463;
+  --accent-soft: #e4edf6;
+  --gold: #ffc349;            /* ZTD gold */
   --accent-text: #ffffff;
   --ok: #2f7d4f;
@@ -44,7 +47,7 @@
 * { box-sizing: border-box; }
 html, body { height: 100%; }
-body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.55 var(--sans); }
+body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.55 "DM Sans", var(--sans); }
 a { color: var(--accent); }
diff --git a/public/icon.svg b/public/icon.svg
index 1d2e3f4..5a6b7c8 100644
--- a/public/icon.svg
+++ b/public/icon.svg
@@ -1 +1 @@
-<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#c4643f"/>…</svg>
+<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#00427c"/>…</svg>
`;
const FAKE_FILES = { 'package.json': '{\n  "name": "site",\n  "type": "module",\n  "scripts": { "start": "node server.mjs" }\n}\n', 'server.mjs': '// A small static web server. Studio sets PORT.\nimport http from \'node:http\';\n// …\n',
  'public/index.html': '<!doctype html>\n<html lang="en-GB">\n<head><meta charset="utf-8"><title>Site</title></head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>\n', 'public/styles.css': 'body { font-family: system-ui; }\n', 'CLAUDE.md': '# Project\n\nBuilt with ZTD Devs Studio.\n' };
const LOG_LINES = ['Starting server…', 'Loaded 4 projects from the database', 'Listening on 4401', 'GET / 200 4ms', 'GET /app.css 200 1ms', 'GET /api/board 200 23ms', 'POST /api/cards 201 41ms', 'GET /api/board 200 19ms', 'WARN slow query: 812ms', 'GET /health 200 0ms'];
// Shaped like journalctl's lines; the Services tab drops the first three words (time, host, unit).
const logLine = (i, at = Date.now() - (40 - i) * 7000) => `${new Date(at).toISOString().slice(0, 19)} studio node[48213]: ${LOG_LINES[i % LOG_LINES.length]}`;

// ---------- routes ----------
const routes = [];
const route = (method, pattern, fn) => routes.push({ method, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '([^/]+)') + '$'), keys: [...pattern.matchAll(/:(\w+)/g)].map(m => m[1]), fn });

route('GET', '/api/me', ({ cookies }) => {
  if (cookies.pv_out) throw err(401, 'Sign in first');
  const u = me();
  return { user: { id: u.id, name: u.name, email: u.email, role: u.role, twoFactorEnabled: !cookies.pv_mfa, image: null }, session: { id: 'sess1', expiresAt: new Date(Date.now() + 30 * 864e5).toISOString() },
    teams: memberships(), claude: S.claude, mailEnabled: S.mail.source !== 'none', domain: DOMAIN, appName: 'ZTD Devs Studio' };
});
route('GET', '/api/qr', ({ url }, res) => send(res, 200, qrSvg(url.searchParams.get('text') || ''), 'image/svg+xml'));
route('GET', '/api/invite/:id', () => ({ email: 'jo@ztddevs.com', role: 'member', teamName: 'ZTD Devs', inviterName: 'Samuel', status: 'pending', hasAccount: false }));

route('GET', '/api/claude', () => S.claude);
route('POST', '/api/claude/connect', () => ({ url: 'https://claude.ai/oauth/authorize?design-preview' }));
route('POST', '/api/claude/code', ({ body }) => { if (!String(body.code || '').trim()) throw err(400, 'Paste the code from claude.ai first.'); S.claude = { connected: true, kind: 'subscription', hint: 'samuel@ztddevs.com', createdAt: Date.now() }; return S.claude; });
route('POST', '/api/claude/cancel', () => ({ ok: true }));
route('POST', '/api/claude/apikey', () => { S.claude = { connected: true, kind: 'apikey', hint: 'sk-ant-…x4Qa', createdAt: Date.now() }; return S.claude; });
route('DELETE', '/api/claude', () => { S.claude = { connected: false }; return { ok: true }; });

route('GET', '/api/projects', () => S.projects.map(projectView));
route('POST', '/api/projects', ({ body }) => {
  const slug = String(body.slug || '').trim();
  if (!/^[a-z][a-z0-9-]{0,30}[a-z0-9]$/.test(slug)) throw err(400, 'Use a short name of lowercase letters, numbers and dashes.');
  if (S.projects.some(p => p.slug === slug)) throw err(400, `${slug}.${DOMAIN} is already used.`);
  const p = { id: 'p' + Date.now().toString(36), slug, name: body.name || slug, organizationId: body.organizationId, description: body.description || '', status: 'ready', workerClaudeUserId: null,
    services: [{ id: 's' + Date.now().toString(36), name: 'web', label: 'Website', command: 'node server.mjs', port: 4460, subdomain: slug, memoryMB: 800, autostart: 1, publicAccess: 0, certStatus: 'pending', envKeys: [], state: 'starting', since: Date.now(), mem: 28, restarts: 0 }] };
  S.projects.push(p); S.gitState[p.id] = { files: [], log: [] };
  return projectView(p);
});
route('GET', '/api/projects/:id', ({ params }) => projectView(project(params.id)));
route('PATCH', '/api/projects/:id', ({ params, body }) => {
  const p = project(params.id);
  if (body.name !== undefined) p.name = String(body.name).trim() || p.name;
  if (body.description !== undefined) p.description = String(body.description);
  if (body.organizationId) p.organizationId = body.organizationId;
  if (body.workerClaudeUserId !== undefined) p.workerClaudeUserId = body.workerClaudeUserId || null;
  return projectView(p);
});
route('DELETE', '/api/projects/:id', ({ params, body }) => {
  const p = project(params.id);
  if (body.confirm !== p.slug) throw err(400, `Type the project's short name (${p.slug}) to delete it.`);
  S.projects = S.projects.filter(x => x !== p);
  return { ok: true };
});
route('GET', '/api/projects/:id/user', ({ params }) => { const p = project(params.id); return p.ownUser || p.slug !== 'studio-src' ? { user: `ztd-${p.slug}`, own: true } : { user: 'ztd', own: false }; });
route('POST', '/api/projects/:id/own-user', async ({ params }) => { const p = project(params.id); await new Promise(r => setTimeout(r, 1500)); p.ownUser = true; return { user: `ztd-${p.slug}`, running: [], failed: [] }; });

route('PUT', '/api/projects/:id/services', ({ params, body }) => {
  const p = project(params.id);
  p.services = (body.services || []).map((s, i) => {
    const old = p.services.find(x => x.id === s.id);
    const envKeys = String(s.envText || '').split('\n').map(l => l.split('=')[0].trim()).filter(Boolean);
    return { ...(old || { state: 'stopped', since: Date.now(), mem: null, restarts: 0, certStatus: 'pending' }), id: s.id || 's' + Date.now().toString(36) + i, name: s.name || 'web', label: s.label || s.name || 'Service',
      command: s.command, port: s.port, subdomain: s.subdomain || null, memoryMB: s.memoryMB, autostart: s.autostart ? 1 : 0, publicAccess: s.publicAccess ? 1 : 0, envKeys };
  });
  return projectView(p);
});
route('POST', '/api/projects/:id/services/:sid/certificate', ({ params }) => { const s = project(params.id).services.find(x => x.id === params.sid); s.certStatus = 'ok'; return { ok: true }; });
route('POST', '/api/projects/:id/services/:sid/:action', async ({ params }) => {
  const p = project(params.id), s = p.services.find(x => x.id === params.sid);
  if (!s) throw err(404, 'Service not found');
  await new Promise(r => setTimeout(r, 700));
  if (params.action === 'stop') s.state = 'stopped';
  else { s.state = 'running'; s.since = Date.now(); s.mem = s.mem || 64; }
  return projectView(p);
});
route('GET', '/api/projects/:id/services/:sid/logs', ({ params }, res) => {
  project(params.id);
  sse(res);
  for (let i = 0; i < 40; i++) res.write(`data: ${JSON.stringify(logLine(i))}\n\n`);
  let i = 40;
  const t = setInterval(() => res.write(`data: ${JSON.stringify(logLine(i++, Date.now()))}\n\n`), 2000);
  res.on('close', () => clearInterval(t));
});

const gitOf = id => { project(id); return S.gitState[id] ||= { files: [], log: [] }; };
const logOf = id => { const g = gitOf(id); if (!g.log) g.log = realLog(); return g.log; };
route('GET', '/api/projects/:id/git/status', ({ params }) => ({ repo: true, branch: 'main', files: gitOf(params.id).files }));
route('GET', '/api/projects/:id/git/diff', ({ params }, res) => send(res, 200, gitOf(params.id).files.length ? DIFF : '', 'text/plain; charset=utf-8'));
route('GET', '/api/projects/:id/git/log', ({ params }) => logOf(params.id));
route('POST', '/api/projects/:id/git/commit', ({ params, body }) => {
  const g = gitOf(params.id);
  if (!String(body.message || '').trim()) throw err(400, 'Write a short commit message first.');
  logOf(params.id).unshift({ hash: Math.random().toString(16).slice(2, 12), author: me().name, date: new Date().toISOString(), subject: body.message });
  g.files = []; return { ok: true };
});
route('POST', '/api/projects/:id/git/discard', ({ params, body }) => { const g = gitOf(params.id); g.files = g.files.filter(f => !(body.files || []).includes(f.path)); return { ok: true }; });
route('POST', '/api/projects/:id/git/revert-last', ({ params }) => { const l = logOf(params.id); l.unshift({ hash: Math.random().toString(16).slice(2, 12), author: me().name, date: new Date().toISOString(), subject: `Revert "${l[0]?.subject}"` }); return { ok: true }; });

route('GET', '/api/projects/:id/files', ({ params }) => project(params.id).slug === 'studio-src' ? realFiles() : Object.keys(FAKE_FILES));
route('GET', '/api/projects/:id/file', ({ params, url }, res) => {
  const p = project(params.id), path = url.searchParams.get('path') || '';
  if (p.slug === 'studio-src'){
    if (!realFiles().includes(path)) throw err(404, 'Cannot read that file');
    return send(res, 200, readFileSync(join(REPO, path), 'utf8'), 'text/plain; charset=utf-8');
  }
  if (!(path in FAKE_FILES)) throw err(404, 'Cannot read that file');
  send(res, 200, FAKE_FILES[path], 'text/plain; charset=utf-8');
});

route('GET', '/api/projects/:id/chats', ({ params }) => { project(params.id); return S.chats.filter(c => c.projectId === params.id).sort((a, b) => (!!a.archivedAt - !!b.archivedAt) || b.updatedAt - a.updatedAt).map(chatView); });
route('POST', '/api/projects/:id/chats', ({ params, body }) => {
  project(params.id);
  const c = { id: 'c' + Date.now().toString(36), projectId: params.id, userId: me().id, title: 'New chat', model: body.model || 'opus', mode: body.mode || 'edit', createdAt: Date.now(), updatedAt: Date.now(), archivedAt: null, running: false, events: [] };
  S.chats.push(c); return chatView(c);
});
route('GET', '/api/chats/:id', ({ params }) => { const c = chat(params.id); return { chat: chatView(c), events: c.events }; });
route('PATCH', '/api/chats/:id', ({ params, body }) => { const c = chat(params.id); if (body.title) c.title = String(body.title).slice(0, 120); return chatView(c); });
route('POST', '/api/chats/:id/archive', ({ params, body }) => { const c = chat(params.id); c.archivedAt = body.archived !== false ? Date.now() : null; return chatView(c); });
route('DELETE', '/api/chats/:id', ({ params }) => { cancelRun(params.id); S.chats = S.chats.filter(c => c.id !== params.id); return { ok: true }; });
route('POST', '/api/chats/:id/messages', ({ params, body }) => {
  const c = chat(params.id);
  if (c.running) throw err(409, 'Claude is still working on this chat. Wait, or press Stop.');
  if (!S.claude.connected) throw err(400, 'Connect your Claude account first (Account → Claude).', 'no_claude');
  const prompt = String(body.prompt || '').trim();
  const files = (body.attachments || []).map(id => S.uploads[id]).filter(Boolean);
  if (!prompt && !files.length) throw err(400, 'Write a prompt first.');
  if (c.title === 'New chat') c.title = (prompt || files[0].name).replace(/\s+/g, ' ').slice(0, 70);
  c.archivedAt = null; c.model = body.model || c.model; c.mode = body.mode || c.mode;
  push(c, { type: 'user', text: prompt, attachments: files.length ? files : undefined, userId: me().id, userName: me().name, model: c.model, mode: c.mode });
  playRun(c, prompt || files[0].name);
  return { ok: true };
});
route('POST', '/api/chats/:id/stop', ({ params }) => {
  const c = chat(params.id);
  if (!c.running) return { stopped: false };
  cancelRun(c.id); c.running = false;
  push(c, { type: 'notice', text: 'Stopped.' }); push(c, { type: 'state', running: false }, false);
  return { stopped: true };
});
route('GET', '/api/chats/:id/stream', ({ params, url }, res) => {
  const c = chat(params.id);
  sse(res);
  const after = Number(url.searchParams.get('after'));
  if (Number.isInteger(after)) for (const ev of c.events.filter(e => e.seq > after)) res.write(`data: ${JSON.stringify(ev)}\n\n`);
  if (!watchers.has(c.id)) watchers.set(c.id, new Set());
  watchers.get(c.id).add(res);
  res.on('close', () => watchers.get(c.id)?.delete(res));
  // A chat that was already "working" when the page opened carries on from where it was.
  if (c.running && !runs.has(c.id)) playRun(c, c.events.find(e => e.type === 'user')?.text || '');
});
route('POST', '/api/projects/:id/uploads', ({ body }) => {
  const name = String(body.name || 'pasted file');
  const ext = name.split('.').pop().toLowerCase();
  const kind = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) ? 'image' : ext === 'pdf' ? 'pdf' : ext === 'ipynb' ? 'notebook' : ['txt', 'md', 'js', 'mjs', 'css', 'html', 'json', 'csv'].includes(ext) ? 'text' : 'other';
  const u = { id: 'up' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name, kind, size: Math.round(String(body.data || '').length * 0.75) };
  S.uploads[u.id] = u; return u;
});
route('GET', '/api/uploads/:id', ({ params }, res) => {
  const u = S.uploads[params.id];
  if (!u) throw err(404, 'File not found');
  if (u.kind === 'image') return send(res, 200, pictureSvg(u.name), 'image/svg+xml');
  send(res, 200, `This is a stand-in for ${u.name} in the design preview.\n`, 'application/octet-stream', { 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(u.name + '.txt')}` });
});

route('GET', '/api/teams', () => S.teams.map(t => {
  const role = roleIn(t.organizationId);
  return { organizationId: t.organizationId, name: t.name, slug: t.slug, role, canAdmin: ['site-admin', 'owner', 'admin'].includes(role),
    members: t.members.map(([uid, r], i) => { const u = S.users.find(x => x.id === uid); return { id: `m-${t.organizationId}-${i}`, role: r, createdAt: u.createdAt, userId: u.id, name: u.name, email: u.email, twoFactorEnabled: u.twoFactorEnabled }; }),
    invites: t.invites.map(i => ({ ...i, link: `https://studio.${DOMAIN}/invite/${i.id}` })), projects: S.projects.filter(p => p.organizationId === t.organizationId).map(p => ({ id: p.id, name: p.name, slug: p.slug })) };
}));

route('GET', '/api/admin/users', () => S.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, banned: u.banned ? 1 : 0, banReason: u.banned ? 'Suspended by an admin' : null, twoFactorEnabled: u.twoFactorEnabled ? 1 : 0,
  createdAt: u.createdAt, lastSeen: u.lastSeen, teams: S.teams.filter(t => t.members.some(m => m[0] === u.id)).map(t => ({ name: t.name, role: t.members.find(m => m[0] === u.id)[1] })), claude: u.claude })));
route('POST', '/api/admin/users/:id/reset-link', ({ params }) => ({ emailed: false, link: `https://studio.${DOMAIN}/reset-password?token=preview-${params.id}` }));
route('POST', '/api/admin/users/:id/reset-mfa', ({ params }) => { const u = S.users.find(x => x.id === params.id); if (u) u.twoFactorEnabled = false; return { ok: true }; });
route('GET', '/api/admin/audit', ({ url }) => { const before = Number(url.searchParams.get('before')) || Date.now() + 1; return S.audit.filter(a => a.at < before).slice(0, 25); });
route('GET', '/api/admin/mail', () => S.mail);
route('PUT', '/api/admin/mail', ({ body }) => { if (!body.host || !body.user) throw err(400, 'Fill in the mail server and user name.'); S.mail = { source: 'studio', host: body.host, port: body.port, secure: body.secure, user: body.user, from: body.from, hasPassword: true }; return S.mail; });
route('DELETE', '/api/admin/mail', () => { S.mail = { source: 'none' }; return S.mail; });
route('POST', '/api/admin/mail/test', () => ({ ok: true, to: me().email }));
route('GET', '/api/admin/settings', () => S.settings);
route('PUT', '/api/admin/settings', ({ body }) => { if (typeof body.scopeCheck === 'boolean') S.settings.scopeCheck = body.scopeCheck; return S.settings; });
route('GET', '/api/admin/github-backup', () => S.backup);
route('PUT', '/api/admin/github-backup', ({ body }) => { const m = String(body.url || '').match(/github\.com[/:]([^/]+\/[^/.\s]+)/); if (!m) throw err(400, 'Paste the repo’s GitHub address, like https://github.com/you/ztd-projects'); S.backup = { ...S.backup, url: `git@github.com:${m[1]}.git`, last: null }; return S.backup; });
route('POST', '/api/admin/github-backup/run', () => {
  S.backup.running = true;
  setTimeout(() => { S.backup.running = false; S.backup.last = { ok: true, message: `Backed up ${S.projects.length} projects`, at: new Date().toISOString() }; }, 3500);
  return S.backup;
});
route('DELETE', '/api/admin/github-backup', () => { S.backup = { url: '', publicKey: S.backup.publicKey, running: false, last: null }; return S.backup; });

function studioVersion(){
  const log = realLog();
  const head = log[0] || { hash: '0000000', subject: 'Preview', author: 'Studio', date: new Date().toISOString() };
  const installed = S.studio.updated ? head : log[2] || head;
  return { installed: { commit: installed.hash, subject: installed.subject, installedAt: S.studio.updated ? new Date(S.studio.updateStarted).toISOString() : S.studio.installedAt },
    source: { project: 'studio-src', path: '.', head, pending: S.studio.updated ? [] : log.slice(0, 2), dirty: ['design-preview/ztd/app.css'], updating: false }, sourceError: null };
}
route('GET', '/api/admin/studio', () => studioVersion());
route('POST', '/api/admin/studio/update', () => { S.studio.updateStarted = Date.now(); return { commit: studioVersion().source.head.hash, at: Date.now() }; });
route('GET', '/api/admin/studio/log', () => {
  const t0 = S.studio.updateStarted, s = (Date.now() - t0) / 1000;
  const lines = [[0, 'studio-update started'], [1, 'Unpacking the latest commit…'], [3, 'npm ci --omit=dev'], [5, 'added 61 packages in 4s'], [6, 'Installing to /opt/studio'], [8, 'Restarting studio.service']]
    .filter(([at]) => s >= at).map(([at, l]) => `${new Date(t0 + at * 1000).toISOString()} ${l}`);
  const done = s >= 10;
  if (done){ lines.push(`${new Date(t0 + 10000).toISOString()} studio-update finished: 0`); S.studio.updated = true; }
  return { log: lines.join('\n'), updating: !done };
});

// Better Auth's endpoints, as far as the pages use them.
const CODES = ['7KQ2-M9XD', 'P4TR-2WZL', 'H8NB-6QEC', 'Y3JF-KV7A', 'D5LS-9RMU', 'W2XG-H4PE', 'B6CT-N8YQ', 'R9VK-3ZDJ', 'E7MW-5LHS', 'U4AP-Q2FN'];
const signedIn = ['pv_out=; Max-Age=0; ' + cookieOpts, 'pv_mfa=; Max-Age=0; ' + cookieOpts];
const auth = {
  'sign-in/email': ({ body }) => { if (body.password === 'wrong') throw err(401, 'Invalid email or password'); return { twoFactorRedirect: true }; },
  'two-factor/verify-totp': ({ body }, res) => { if (body.code === '000000') throw err(400, 'Invalid code'); res.setHeader('Set-Cookie', signedIn); return { ok: true }; },
  'two-factor/verify-backup-code': (_, res) => { res.setHeader('Set-Cookie', signedIn); return { ok: true }; },
  'two-factor/enable': ({ body }) => { if (body.password === 'wrong') throw err(400, 'Invalid password'); return { totpURI: `otpauth://totp/ZTD%20Devs%20Studio:${me().email}?secret=JBSWY3DPEHPK3PXP&issuer=ZTD%20Devs%20Studio`, backupCodes: CODES }; },
  'two-factor/generate-backup-codes': () => ({ backupCodes: CODES.map(c => c.split('').reverse().join('')) }),
  'sign-out': (_, res) => { res.setHeader('Set-Cookie', 'pv_out=1; ' + cookieOpts); return { success: true }; },
  'sign-up/email': (_, res) => { res.setHeader('Set-Cookie', signedIn); return { ok: true }; },
  'request-password-reset': () => ({ status: true }),
  'reset-password': ({ body }) => { if (String(body.token).includes('expired')) throw err(400, 'Invalid token'); return { status: true }; },
  'update-user': ({ body }) => { me().name = body.name || me().name; return { status: true }; },
  'change-password': ({ body }) => { if (body.currentPassword === 'wrong') throw err(400, 'Invalid password'); return { ok: true }; },
  'revoke-session': ({ body }) => { S.sessions = S.sessions.filter(s => s.token !== body.token); return { status: true }; },
  'organization/accept-invitation': (_, res) => { res.setHeader('Set-Cookie', signedIn); return { ok: true }; },
  'organization/invite-member': ({ body }) => { S.teams.find(t => t.organizationId === body.organizationId)?.invites.unshift({ id: 'inv' + Date.now().toString(36), email: body.email, role: body.role, status: 'pending', expiresAt: Date.now() + 7 * 864e5 }); return { ok: true }; },
  'organization/cancel-invitation': ({ body }) => { for (const t of S.teams) t.invites = t.invites.filter(i => i.id !== body.invitationId); return { ok: true }; },
  'organization/remove-member': ({ body }) => { for (const t of S.teams) t.members = t.members.filter((m, i) => `m-${t.organizationId}-${i}` !== body.memberIdOrEmail); return { ok: true }; },
  'organization/update-member-role': () => ({ ok: true }),
  'organization/create': ({ body }) => { S.teams.push({ organizationId: 'o' + Date.now().toString(36), name: body.name, slug: body.slug, members: [[me().id, 'owner']], invites: [] }); return { ok: true }; },
  'admin/ban-user': ({ body }) => { const u = S.users.find(x => x.id === body.userId); if (u) u.banned = true; return { ok: true }; },
  'admin/unban-user': ({ body }) => { const u = S.users.find(x => x.id === body.userId); if (u) u.banned = false; return { ok: true }; },
  'admin/set-role': ({ body }) => { const u = S.users.find(x => x.id === body.userId); if (u) u.role = body.role; return { ok: true }; },
  'admin/remove-user': ({ body }) => { S.users = S.users.filter(x => x.id !== body.userId); return { ok: true }; },
};
route('GET', '/api/auth/list-sessions', () => S.sessions);

export async function handleApi(req, res, url, cookies){
  try {
    if (url.pathname.startsWith('/api/auth/') && req.method === 'POST'){
      const fn = auth[url.pathname.slice('/api/auth/'.length)];
      if (!fn) return send(res, 200, { ok: true });
      const out = await fn({ body: await readBody(req), url, cookies }, res);
      return send(res, 200, out);
    }
    for (const r of routes){
      if (r.method !== req.method) continue;
      const m = url.pathname.match(r.re);
      if (!m) continue;
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      const body = req.method === 'GET' ? {} : await readBody(req);
      const out = await r.fn({ req, url, params, body, cookies }, res);
      if (!res.headersSent && out !== undefined) send(res, 200, out);
      return;
    }
    send(res, 404, { error: 'Not found' });
  } catch (e){
    if (!e.status) console.error(e);
    if (!res.headersSent) send(res, e.status || 500, { error: e.status ? e.message : 'Something went wrong in the preview.', message: e.message, code: e.code });
  }
}
