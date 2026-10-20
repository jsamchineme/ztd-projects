// Didit: serves the PWA in public/ and sends Web Push reminders that repeat until acknowledged.
// Tasks live on the phone (IndexedDB). The phone syncs a copy of its reminder schedule here
// only so the server can send pushes while the app is closed.
import http from 'node:http';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import webpush from 'web-push';

const PORT = Number(process.env.PORT || 4400);
const ROOT = join(import.meta.dirname, 'public');
const DATA = join(import.meta.dirname, 'data');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

await mkdir(DATA, { recursive: true });

// VAPID keys are generated once and kept in data/ (gitignored).
const VAPID_FILE = join(DATA, 'vapid.json');
let vapid;
if (existsSync(VAPID_FILE)) vapid = JSON.parse(readFileSync(VAPID_FILE, 'utf8'));
else { vapid = webpush.generateVAPIDKeys(); await writeFile(VAPID_FILE, JSON.stringify(vapid), { mode: 0o600 }); }
webpush.setVapidDetails('https://didit.ztddevs.com', vapid.publicKey, vapid.privateKey);

// devices: { [id]: { subscription, tz, tasks, done: {slotKey: ts}, sent: {slotKey: {count, last, snoozeUntil}}, seen } }
const DEVICES_FILE = join(DATA, 'devices.json');
let devices = existsSync(DEVICES_FILE) ? JSON.parse(readFileSync(DEVICES_FILE, 'utf8')) : {};
let saving = null, dirty = false;
async function save() {
  dirty = true;
  if (saving) return;
  while (dirty) {
    dirty = false;
    saving = writeFile(DEVICES_FILE + '.tmp', JSON.stringify(devices)).then(() => rename(DEVICES_FILE + '.tmp', DEVICES_FILE));
    await saving.catch(e => console.error('save failed', e));
  }
  saving = null;
}

// ---- time helpers (all schedule maths happens in the phone's own time zone) ----
function localNow(tz) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}`, dow };
}
const slotKey = (taskId, date, time) => `${taskId}@${date}T${time}`;

const NAGS = [
  'Gentle reminder, Obim ❤️',
  'Little one is counting on you 🍼',
  'Still waiting on this one ✨',
  'Quick sip of water and done? 💧',
  'Tap Done once you\'ve taken it 🌸',
  'You\'ve got this, superstar ⭐',
];

async function sendPush(id, dev, payload) {
  try {
    await webpush.sendNotification(dev.subscription, JSON.stringify(payload), { TTL: 600, urgency: 'high', topic: (payload.tag || 'didit').replace(/[^A-Za-z0-9_-]/g, '').slice(-32) });
    return true;
  } catch (e) {
    if (e.statusCode === 404 || e.statusCode === 410) { console.log('subscription gone, dropping device', id.slice(0, 6)); delete devices[id]; save(); }
    else console.error('push failed', id.slice(0, 6), e.statusCode || '', e.body || e.message);
    return false;
  }
}

async function tick() {
  const now = Date.now();
  for (const [id, dev] of Object.entries(devices)) {
    if (!dev.subscription || !Array.isArray(dev.tasks)) continue;
    let local;
    try { local = localNow(dev.tz || 'UTC'); } catch { local = localNow('UTC'); }
    for (const task of dev.tasks) {
      if (task.paused) continue;
      const days = Array.isArray(task.days) && task.days.length ? task.days : [0, 1, 2, 3, 4, 5, 6];
      if (!days.includes(local.dow)) continue;
      for (const time of task.times || []) {
        if (time > local.time) continue;
        const stamp = `${local.date}T${time}`;
        if (task.since && stamp < task.since) continue;
        const key = slotKey(task.id, local.date, time);
        if (dev.done?.[key]) continue;
        const s = (dev.sent[key] ||= { count: 0, last: 0 });
        if (s.snoozeUntil && now < s.snoozeUntil) continue;
        const every = Math.max(1, Number(task.nag) || 10) * 60000;
        if (s.last && now - s.last < every && !(s.snoozeUntil && s.last < s.snoozeUntil)) continue;
        s.count++; s.last = now; delete s.snoozeUntil;
        save();
        const first = s.count === 1;
        await sendPush(id, dev, {
          title: `${task.emoji || '💊'} ${task.name}`,
          body: first ? `It's ${fmt12(time)}, time for this one${task.note ? ' · ' + task.note : ''}` : `${NAGS[(s.count - 2) % NAGS.length]} · reminder ${s.count}`,
          tag: key, key, taskId: task.id, deviceId: id,
        });
      }
    }
    // forget bookkeeping older than 3 days
    const cutoff = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
    for (const map of [dev.done, dev.sent]) for (const k of Object.keys(map || {})) if (k.split('@')[1].slice(0, 10) < cutoff) delete map[k];
  }
}
function fmt12(t) { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; }

let ticking = false;
setInterval(async () => { if (ticking) return; ticking = true; try { await tick(); } catch (e) { console.error('tick', e); } ticking = false; }, 20000);

// ---- API ----
const validId = id => typeof id === 'string' && /^[A-Za-z0-9_-]{20,64}$/.test(id);
function json(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); }
async function body(req) {
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > 200_000) throw new Error('too big'); chunks.push(c); }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}
function cleanTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.slice(0, 100).map(t => ({
    id: String(t.id).slice(0, 40), name: String(t.name || '').slice(0, 80), emoji: String(t.emoji || '💊').slice(0, 8),
    note: String(t.note || '').slice(0, 120),
    times: (Array.isArray(t.times) ? t.times : []).filter(x => /^\d\d:\d\d$/.test(x)).slice(0, 12),
    days: (Array.isArray(t.days) ? t.days : []).map(Number).filter(d => d >= 0 && d <= 6),
    nag: Math.min(240, Math.max(1, Number(t.nag) || 10)), since: typeof t.since === 'string' ? t.since.slice(0, 16) : '', paused: !!t.paused,
  }));
}

async function api(req, res, path) {
  if (path === '/api/vapid' && req.method === 'GET') return json(res, 200, { publicKey: vapid.publicKey });
  const m = path.match(/^\/api\/device\/([^/]+)(?:\/(ack|snooze|test))?$/);
  if (!m || !validId(m[1])) return json(res, 404, { error: 'not found' });
  const [, id, action] = m;
  const dev = devices[id];
  if (!action && req.method === 'PUT') {
    const b = await body(req);
    const d = devices[id] ||= { done: {}, sent: {} };
    if (b.subscription?.endpoint) d.subscription = b.subscription;
    if (typeof b.tz === 'string') d.tz = b.tz.slice(0, 64);
    d.tasks = cleanTasks(b.tasks);
    for (const k of Array.isArray(b.done) ? b.done.slice(0, 2000) : []) if (typeof k === 'string') d.done[k] ||= Date.now();
    // slots un-done on the phone (undo) should start nagging again
    if (Array.isArray(b.undone)) for (const k of b.undone) { delete d.done[k]; delete d.sent[k]; }
    d.seen = Date.now();
    save();
    return json(res, 200, { ok: true, push: !!d.subscription });
  }
  if (!action && req.method === 'DELETE') { delete devices[id]; save(); return json(res, 200, { ok: true }); }
  if (!dev) return json(res, 404, { error: 'unknown device' });
  if (action === 'ack' && req.method === 'POST') {
    const { key } = await body(req);
    if (typeof key === 'string') { dev.done[key] = Date.now(); save(); }
    return json(res, 200, { ok: true });
  }
  if (action === 'snooze' && req.method === 'POST') {
    const { key, minutes } = await body(req);
    if (typeof key === 'string') { const s = (dev.sent[key] ||= { count: 1, last: Date.now() }); s.snoozeUntil = Date.now() + Math.min(120, Math.max(1, Number(minutes) || 15)) * 60000; save(); }
    return json(res, 200, { ok: true });
  }
  if (action === 'test' && req.method === 'POST') {
    if (!dev.subscription) return json(res, 400, { error: 'no subscription' });
    const ok = await sendPush(id, dev, { title: '🌸 Didit is all set', body: 'This is how your reminders will look. They keep coming until you tap Done.', tag: 'test', test: true });
    return json(res, ok ? 200 : 502, { ok });
  }
  return json(res, 405, { error: 'method not allowed' });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    try { return await api(req, res, url.pathname); } catch (e) { return json(res, 400, { error: 'bad request' }); }
  }
  const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
  let file = join(ROOT, path.endsWith('/') ? path + 'index.html' : path);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(file);
    const headers = { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' };
    if (file.endsWith('sw.js')) headers['Service-Worker-Allowed'] = '/';
    res.writeHead(200, headers);
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Listening on ${PORT}`));
