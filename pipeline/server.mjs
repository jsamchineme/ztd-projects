// Pipeline: a board of buckets that people and AI agents pull website projects through.
// Serves the board UI plus a small JSON API that cli.mjs (and any agent) uses to add, claim, update and complete cards.
// Usage: node server.mjs [port]   (env: PIPELINE_DATA to store cards somewhere else, CLAUDE_BIN)
import http from 'node:http';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRunner } from './workers.mjs';

const PORT = Number(process.argv[2] || process.env.PORT || 4390);
const HOST = '127.0.0.1';
const ROOT = dirname(fileURLToPath(import.meta.url));
const DATA = process.env.PIPELINE_DATA || join(ROOT, 'data', 'cards.json');
const WORK = join(dirname(DATA), 'work'); // per-card folders for AI workers; <card>/site is served as its preview

// ---------- config ----------
const config = JSON.parse(readFileSync(join(ROOT, 'config.json'), 'utf8'));
const stages = new Map();
for (const p of config.pipelines) for (const s of p.stages){
  if (stages.has(s.id)) throw new Error(`Duplicate stage id "${s.id}" in config.json`);
  if (!s.outcomes && s.next) s.outcomes = [{ id: 'done', label: 'Done', to: s.next }];
  s.outcomes ||= [];
  s.pipeline = p.id;
  stages.set(s.id, s);
}
for (const s of stages.values()) for (const ref of [...s.outcomes.map(o => o.to), ...(s.pullFrom || []), ...(s.feeds ? [s.feeds] : [])])
  if (!stages.has(ref)) throw new Error(`Stage "${s.id}" refers to unknown stage "${ref}"`);
if (config.attentionStage && !stages.has(config.attentionStage)) throw new Error(`attentionStage "${config.attentionStage}" isn't a stage`);
const firstStage = config.pipelines[0].stages[0].id;
const fieldKeys = new Set(config.fields.map(f => f.key));
const claimMs = (config.claimMinutes || 90) * 60000;

// ---------- store ----------
let db = { nextId: 1, cards: [] };
if (existsSync(DATA)) db = JSON.parse(await readFile(DATA, 'utf8'));
db.workflows ||= [];
db.nextWorkflowId ||= 1;
// Workers die with the server, so give back any cards they were holding.
for (const c of db.cards) if (c.claim?.run){ c.claim = null; c.history.push({ at: new Date().toISOString(), by: 'server', action: 'release', note: 'Server restarted while an AI worker had it' }); }
let version = 0, saving = Promise.resolve();
// Tell open boards something changed (cards, or just worker status).
function broadcast(){ version++; for (const res of listeners) res.write(`data: ${version}\n\n`); }
function save(){
  const body = JSON.stringify(db, null, 1);
  // Write to a temp file then rename, so a crash mid-write never leaves a half-written store.
  saving = saving.then(async () => {
    await mkdir(dirname(DATA), { recursive: true });
    await writeFile(DATA + '.tmp', body);
    await rename(DATA + '.tmp', DATA);
  }).catch(e => console.error('Save failed:', e.message));
  broadcast();
}

class ApiError extends Error { constructor(status, msg){ super(msg); this.status = status; } }
const now = () => new Date().toISOString();
const normUrl = u => String(u || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
const fullUrl = u => /^https?:\/\//i.test(u.trim()) ? u.trim() : 'https://' + u.trim();
const isClaimed = c => !!(c.claim && Date.now() - Date.parse(c.claim.at) < claimMs);

function card(id){
  const c = db.cards.find(c => String(c.id) === String(id));
  if (!c) throw new ApiError(404, `No card #${id}`);
  return c;
}
function log(c, by, action, extra = {}){
  c.history.push({ at: now(), by: by || 'someone', action, ...extra });
  c.updatedAt = now();
}
function enter(c, to, by, note, outcome){
  const from = c.stage;
  c.stage = to; c.enteredAt = now(); c.claim = null;
  log(c, by, 'move', { from, to, ...(outcome && { outcome }), ...(note && { note }) });
}

function ratingFor(score){
  for (const [name, [lo, hi]] of Object.entries(config.ratingBands)) if (score >= lo && score <= hi) return name;
}
function setFields(c, fields = {}, by){
  // Validate everything first so a bad field never leaves the card half-updated.
  for (const k of Object.keys(fields)) if (!fieldKeys.has(k)) throw new ApiError(400, `Unknown field "${k}". Fields: ${[...fieldKeys].join(', ')}`);
  if (fields.score !== '' && fields.score != null){
    const n = Number(fields.score);
    if (!Number.isFinite(n) || n < 1 || n > 10) throw new ApiError(400, 'score must be a number from 1 to 10');
  }
  const changed = [];
  for (const [k, v] of Object.entries(fields)){
    const val = k === 'score' && v !== '' && v != null ? Number(v) : v;
    if (val === '' || val == null){ if (k in c.fields){ delete c.fields[k]; changed.push(k); } continue; }
    if (c.fields[k] !== val){ c.fields[k] = val; changed.push(k); }
  }
  // A score sets the rating unless someone chose one explicitly in the same update.
  if (changed.includes('score') && !('rating' in fields) && c.fields.score) c.fields.rating = ratingFor(c.fields.score);
  if (changed.length) log(c, by, 'update', { fields: changed });
  return changed;
}

function addCard({ url, name, priority = 0, notes, fields, stage = firstStage }, by){
  if (!url || !String(url).trim()) throw new ApiError(400, 'url is required');
  if (!stages.has(stage)) throw new ApiError(400, `Unknown stage "${stage}"`);
  const key = normUrl(url);
  const dup = db.cards.find(c => normUrl(c.url) === key);
  if (dup) return { duplicate: true, card: dup };
  const c = {
    id: db.nextId++, name: String(name || '').trim() || key.split('/')[0], url: fullUrl(String(url)),
    stage, priority: Number(priority) || 0, notes: notes || '', fields: {}, claim: null,
    createdAt: now(), updatedAt: now(), enteredAt: now(), history: []
  };
  log(c, by, 'add', { to: stage });
  if (fields) setFields(c, fields, by);
  db.cards.push(c);
  return { card: c };
}

// Higher priority first, then the worst-scoring site (the biggest redesign win), then whoever has waited longest.
const queueOrder = (a, b) => b.priority - a.priority || (a.fields.score || 11) - (b.fields.score || 11) || a.enteredAt.localeCompare(b.enteredAt);

// The next free card for a stage: cards already in it (e.g. sent back from review), then each pullFrom bucket in order.
function nextFor(stageId, exclude){
  const s = stages.get(stageId);
  for (const src of [stageId, ...(s.pullFrom || [])]){
    const pick = db.cards.filter(c => c.stage === src && !isClaimed(c) && !exclude?.has(c.id))
      .sort(queueOrder)[0];
    if (pick) return pick;
  }
}

function claim(stageId, by, id, { exclude, run } = {}){
  if (!by) throw new ApiError(400, 'Say who is claiming (by / --as)');
  const s = stages.get(stageId);
  if (!s) throw new ApiError(400, `Unknown stage "${stageId}"`);
  if (s.parking) throw new ApiError(400, `"${s.name}" is for a person to sort out. Move its cards to the right bucket by hand.`);
  if (s.terminal || !s.outcomes.length && !s.feeds) throw new ApiError(400, `"${s.name}" is a final bucket; there's no work to claim`);
  if (s.feeds) throw new ApiError(400, `"${s.name}" is a holding bucket. Claim "${s.feeds}" to take its next card.`);
  let c;
  if (id != null){
    c = card(id);
    if (isClaimed(c) && c.claim.by !== by) throw new ApiError(409, `#${c.id} is claimed by ${c.claim.by}`);
    if (c.stage !== stageId && !(s.pullFrom || []).includes(c.stage)) throw new ApiError(400, `#${c.id} is in "${stages.get(c.stage).name}", which "${s.name}" doesn't pull from`);
  } else {
    c = nextFor(stageId, exclude);
    if (!c) return null;
  }
  if (c.stage !== stageId) enter(c, stageId, by);
  c.claim = { by, at: now(), ...(run && { run }) };
  log(c, by, 'claim');
  return c;
}

// `to` lets a workflow send an outcome somewhere other than the stage's default bucket.
function complete(c, { outcome, note, fields, by, force, to }){
  const s = stages.get(c.stage);
  if (!s.outcomes.length) throw new ApiError(400, s.feeds ? `Cards in "${s.name}" wait to be pulled by "${stages.get(s.feeds).name}"`
    : s.parking ? `Move cards out of "${s.name}" by hand once they're sorted` : `"${s.name}" is a final bucket`);
  if (isClaimed(c) && !force && c.claim.by !== by) throw new ApiError(409, `#${c.id} is claimed by ${c.claim.by}`);
  if (fields) setFields(c, fields, by);
  const missing = (s.requires || []).filter(k => c.fields[k] == null || c.fields[k] === '');
  if (missing.length) throw new ApiError(400, `Fill in ${missing.join(', ')} before completing "${s.name}"`);
  outcome ||= s.outcomeField ? c.fields[s.outcomeField] : s.outcomes.length === 1 ? s.outcomes[0].id : null;
  const o = s.outcomes.find(o => o.id === outcome);
  if (!o) throw new ApiError(400, `Choose an outcome for "${s.name}": ${s.outcomes.map(o => o.id).join(', ')}`);
  enter(c, to && stages.has(to) ? to : o.to, by, note, o.id);
  return c;
}

// ---------- workflows ----------
const MODELS = ['sonnet', 'opus', 'haiku'];
const workable = s => s && s.outcomes.length && !s.feeds && !s.terminal && !s.parking && s.who !== 'human';
function cleanWorkflow(b){
  const name = String(b.name || '').trim().slice(0, 60);
  if (!name) throw new ApiError(400, 'Give the workflow a name');
  if (!Array.isArray(b.steps) || !b.steps.length) throw new ApiError(400, 'Add at least one step');
  const seen = new Set();
  const steps = b.steps.slice(0, 12).map(st => {
    const s = stages.get(st.stage);
    if (!workable(s)) throw new ApiError(400, `"${s ? s.name : st.stage}" can't be worked by AI`);
    if (seen.has(s.id)) throw new ApiError(400, `"${s.name}" is in the workflow twice`);
    seen.add(s.id);
    const routes = {};
    for (const o of s.outcomes){
      const to = st.routes?.[o.id];
      if (to && to !== o.to){ if (!stages.has(to)) throw new ApiError(400, `Unknown stage "${to}"`); routes[o.id] = to; }
    }
    const budget = Number(st.budget);
    return {
      stage: s.id,
      workers: Math.min(5, Math.max(1, Math.round(Number(st.workers) || 1))),
      limit: Math.max(0, Math.round(Number(st.limit) || 0)),
      model: MODELS.includes(st.model) ? st.model : 'sonnet',
      tools: st.tools === 'files' ? 'files' : 'research',
      budget: budget > 0 ? Math.min(budget, 50) : null,
      instructions: String(st.instructions || '').slice(0, 4000),
      routes
    };
  });
  return { name, steps };
}
const workflow = id => {
  const w = db.workflows.find(w => String(w.id) === String(id));
  if (!w) throw new ApiError(404, `No workflow ${id}`);
  return w;
};
const runner = createRunner({
  stages, config, claim, complete, setFields, log, save, broadcast, nextFor, enter,
  workDir: id => join(WORK, String(id)),
  previewUrl: id => `http://localhost:${PORT}/preview/${id}/`
});

// ---------- http ----------
const listeners = new Set();
function send(res, status, body, type = 'application/json'){
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
// Only this machine may call the API: blocks other websites (and DNS rebinding) from editing the board.
const allowedHosts = new Set([`localhost:${PORT}`, `127.0.0.1:${PORT}`, `[::1]:${PORT}`]);
const sameOrigin = req => allowedHosts.has(req.headers.host) &&
  (!req.headers.origin || req.headers.origin === `http://${req.headers.host}`);

function readJson(req, limit = 2e6){
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', d => { s += d; if (s.length > limit){ reject(new ApiError(413, 'Request is too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { reject(new ApiError(400, 'Body must be JSON')); } });
    req.on('error', reject);
  });
}

const publicConfig = () => ({ ...config, pipelines: config.pipelines.map(p => ({ ...p, stages: p.stages.map(s => stages.get(s.id)) })), claimMinutes: claimMs / 60000 });
const withInstructions = c => c && ({ ...c, stageInfo: (({ id, name, who, requires, outcomes, feeds, instructions }) => ({ id, name, who, requires, outcomes, feeds, instructions }))(stages.get(c.stage)), templates: config.templates });

async function api(req, res, url){
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // after "api"
  const m = req.method;
  const body = m === 'POST' || m === 'PATCH' ? await readJson(req) : {};
  const by = body.by || url.searchParams.get('by') || '';

  if (parts[0] === 'config' && m === 'GET') return send(res, 200, publicConfig());
  if (parts[0] === 'events' && m === 'GET'){
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write(`data: ${version}\n\n`);
    listeners.add(res);
    const ping = setInterval(() => res.write(': ping\n\n'), 25000);
    req.on('close', () => { clearInterval(ping); listeners.delete(res); });
    return;
  }
  if (parts[0] === 'workflows'){
    const withRun = w => ({ ...w, run: runner.status(w.id) });
    if (parts.length === 1){
      if (m === 'GET') return send(res, 200, { workflows: db.workflows.map(withRun) });
      if (m === 'POST'){
        const w = { id: db.nextWorkflowId++, ...cleanWorkflow(body), createdAt: now(), updatedAt: now() };
        db.workflows.push(w); save();
        return send(res, 200, { workflow: withRun(w) });
      }
    }
    const w = workflow(parts[1]);
    if (!parts[2]){
      if (m === 'PATCH'){ Object.assign(w, cleanWorkflow(body), { updatedAt: now() }); save(); return send(res, 200, { workflow: withRun(w) }); }
      if (m === 'DELETE'){
        runner.stop(w.id);
        db.workflows = db.workflows.filter(x => x !== w); save();
        return send(res, 200, { deleted: w.id });
      }
    }
    if (parts[2] === 'run' && m === 'POST'){
      try { runner.start(w); } catch (e){ throw new ApiError(409, e.message); }
      return send(res, 200, { workflow: withRun(w) });
    }
    if (parts[2] === 'stop' && m === 'POST'){ runner.stop(w.id); save(); return send(res, 200, { workflow: withRun(w) }); }
    throw new ApiError(404, 'Not found');
  }
  if (parts[0] === 'claim' && m === 'POST'){
    const c = claim(body.stage, by, body.id);
    if (c) save();
    return send(res, 200, { card: withInstructions(c) });
  }
  if (parts[0] !== 'cards') throw new ApiError(404, 'Not found');

  if (parts.length === 1){
    if (m === 'GET'){
      const stage = url.searchParams.get('stage'), q = (url.searchParams.get('q') || '').toLowerCase();
      let list = db.cards;
      if (stage) list = list.filter(c => c.stage === stage);
      if (q) list = list.filter(c => (c.name + ' ' + c.url).toLowerCase().includes(q));
      return send(res, 200, { version, cards: list });
    }
    if (m === 'POST'){
      const items = Array.isArray(body.cards) ? body.cards : [body];
      if (items.length > 5000) throw new ApiError(400, 'Add at most 5000 cards at a time');
      const results = items.map(it => { try { return addCard(it, by); } catch (e){ return { error: e.message, url: it.url }; } });
      if (results.some(r => r.card && !r.duplicate)) save();
      return send(res, 200, {
        added: results.filter(r => r.card && !r.duplicate).map(r => r.card),
        duplicates: results.filter(r => r.duplicate).map(r => ({ id: r.card.id, url: r.card.url, stage: r.card.stage })),
        errors: results.filter(r => r.error)
      });
    }
  }

  const c = card(parts[1]);
  const action = parts[2];
  if (!action){
    if (m === 'GET') return send(res, 200, { card: withInstructions(c) });
    if (m === 'PATCH'){
      const { name, url: u, priority, notes, fields } = body;
      if (name != null && name !== c.name){ c.name = String(name); log(c, by, 'update', { fields: ['name'] }); }
      if (u != null && u !== c.url){ c.url = fullUrl(String(u)); log(c, by, 'update', { fields: ['url'] }); }
      if (priority != null && Number(priority) !== c.priority){ c.priority = Number(priority) || 0; log(c, by, 'update', { fields: ['priority'] }); }
      if (notes != null && notes !== c.notes){ c.notes = String(notes); log(c, by, 'update', { fields: ['notes'] }); }
      if (fields) setFields(c, fields, by);
      save();
      return send(res, 200, { card: c });
    }
    if (m === 'DELETE'){
      db.cards = db.cards.filter(x => x !== c);
      save();
      return send(res, 200, { deleted: c.id });
    }
  }
  if (m !== 'POST') throw new ApiError(405, 'Method not allowed');
  if (action === 'move'){
    if (!stages.has(body.to)) throw new ApiError(400, `Unknown stage "${body.to}"`);
    if (body.to !== c.stage) enter(c, body.to, by, body.note);
  } else if (action === 'complete'){
    complete(c, { ...body, by });
  } else if (action === 'release'){
    if (c.claim){ c.claim = null; log(c, by, 'release', body.note ? { note: body.note } : {}); }
  } else if (action === 'comment'){
    if (!String(body.text || '').trim()) throw new ApiError(400, 'Comment text is required');
    log(c, by, 'comment', { note: String(body.text).trim() });
  } else throw new ApiError(404, 'Not found');
  save();
  return send(res, 200, { card: withInstructions(c) });
}

// AI-built preview sites. Sandboxed so their scripts run in an opaque origin and can't call this API.
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
async function preview(res, pathname){
  const [, , id, ...rest] = pathname.split('/');
  if (!/^\d+$/.test(id || '')) return send(res, 404, 'Not found', 'text/plain');
  if (!rest.length) { res.writeHead(301, { Location: `/preview/${id}/` }); return res.end(); }
  const root = join(WORK, id, 'site');
  let file;
  try { file = resolve(root, decodeURIComponent(rest.join('/')) || 'index.html'); } catch { return send(res, 400, 'Bad path', 'text/plain'); }
  if (file !== root && !file.startsWith(root + sep)) return send(res, 403, 'Forbidden', 'text/plain');
  if (file.endsWith(sep) || file === root) file = join(file, 'index.html');
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store',
      'Content-Security-Policy': 'sandbox allow-scripts allow-forms allow-popups', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch { send(res, 404, 'Not found', 'text/plain'); }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${HOST}`);
  if (url.pathname.startsWith('/api/')){
    if (!sameOrigin(req)) return send(res, 403, { error: 'Forbidden' });
    try { await api(req, res, url); }
    catch (e){ send(res, e.status || 500, { error: e.message }); if (!e.status) console.error(e); }
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain');
  if (url.pathname.startsWith('/preview/')) return preview(res, url.pathname);
  if (url.pathname !== '/' && url.pathname !== '/index.html') return send(res, 404, 'Not found', 'text/plain');
  try { send(res, 200, await readFile(join(ROOT, 'index.html')), 'text/html; charset=utf-8'); }
  catch { send(res, 500, 'index.html is missing', 'text/plain'); }
});

server.on('error', e => {
  console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} is already in use. Stop the other server or run: node pipeline/server.mjs 4391` : e.message);
  process.exit(1);
});
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { runner.stopAll(); setTimeout(() => process.exit(0), 300); });
server.listen(PORT, HOST, () => {
  // Browsers try ::1 first for "localhost"; claim it too so nothing else answers on IPv6.
  http.createServer(server.listeners('request')[0]).on('error', () => {}).listen(PORT, '::1');
  console.log(`Pipeline is running at http://localhost:${PORT}  (press Ctrl+C to stop)`);
  console.log(`Cards are stored in ${DATA}`);
});
