// Visa Plan: a private, passcode-protected place to collect every document for Mum's UK visitor visa.
// Files live on disk in data/visa/files (gitignored); everything else in data/visa/state.json.
import http from 'node:http';
import { readFile, writeFile, rename, mkdir, unlink, stat } from 'node:fs/promises';
import { createWriteStream, existsSync, readFileSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { crc32 } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { SECTIONS, ITEMS, STEPS } from './checklist.mjs';

const scrypt = promisify(_scrypt);
const PORT = Number(process.env.PORT || 4801);
const ROOT = join(import.meta.dirname, 'public');
const DATA = process.env.VISA_DATA || join(import.meta.dirname, '..', 'data', 'visa');
const FILES = join(DATA, 'files');
const MAX_FILE = 30 * 1024 * 1024;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

await mkdir(FILES, { recursive: true });

// ---- state ----
const STATE_FILE = join(DATA, 'state.json');
const blank = () => ({ auth: null, sessions: {}, profile: {}, items: {}, custom: [], steps: {} });
let state = existsSync(STATE_FILE) ? { ...blank(), ...JSON.parse(readFileSync(STATE_FILE, 'utf8')) } : blank();
let saving = null, dirty = false;
async function save() {
  dirty = true;
  if (saving) return saving;
  saving = (async () => {
    while (dirty) {
      dirty = false;
      await writeFile(STATE_FILE + '.tmp', JSON.stringify(state), { mode: 0o600 }).then(() => rename(STATE_FILE + '.tmp', STATE_FILE)).catch(e => console.error('save failed', e));
    }
    saving = null;
  })();
  return saving;
}
const allItems = () => [...ITEMS, ...state.custom.map(c => ({ ...c, custom: true }))];
const itemState = id => (state.items[id] ||= { status: 'todo', note: '', files: [] });

// ---- auth ----
async function hash(pass, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: (await scrypt(pass, salt, 64)).toString('hex') };
}
async function check(pass) {
  if (!state.auth) return false;
  const h = await scrypt(pass, state.auth.salt, 64);
  return timingSafeEqual(h, Buffer.from(state.auth.hash, 'hex'));
}
const SESSION_DAYS = 90;
function cookies(req) { return Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean).map(c => { const i = c.indexOf('='); return [c.slice(0, i), c.slice(i + 1)]; })); }
function authed(req) {
  const t = cookies(req).vp;
  const s = t && state.sessions[t];
  return !!(s && s.exp > Date.now());
}
function newSession(res) {
  const t = randomBytes(32).toString('base64url');
  state.sessions[t] = { exp: Date.now() + SESSION_DAYS * 864e5 };
  for (const [k, v] of Object.entries(state.sessions)) if (v.exp < Date.now()) delete state.sessions[k];
  save();
  res.setHeader('Set-Cookie', `vp=${t}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`);
}
// slow down guessing: 8 wrong tries per IP per 15 minutes
const fails = new Map();
function ipOf(req) { return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress; }
function limited(req) { const f = fails.get(ipOf(req)); return f && f.n >= 8 && Date.now() - f.t < 15 * 60000; }
function failed(req) { const ip = ipOf(req), f = fails.get(ip); fails.set(ip, f && Date.now() - f.t < 15 * 60000 ? { n: f.n + 1, t: f.t } : { n: 1, t: Date.now() }); }

// ---- helpers ----
function json(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); }
async function body(req) {
  let size = 0; const chunks = [];
  for await (const c of req) { size += c.length; if (size > 100_000) throw new Error('too big'); chunks.push(c); }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}
const str = (v, n) => String(v ?? '').slice(0, n);
const PROFILE_FIELDS = { mumName: 200, mumCountry: 80, mumCity: 80, mumDob: 10, mumPassport: 40, sponsorName: 200, wifeName: 200, address: 400, phone: 40, email: 120,
  travelDate: 10, returnDate: 10, dueDate: 10, gwf: 40, appointment: 16, centre: 120, notes: 4000, letter: 20000 };
const findFile = fid => { for (const [itemId, it] of Object.entries(state.items)) { const f = it.files?.find(f => f.id === fid); if (f) return { itemId, it, f }; } return null; };
const safeName = n => str(n, 160).replace(/[\/\\\0<>:"|?*\x00-\x1f]/g, '_').trim() || 'file';
const publicState = () => ({ sections: SECTIONS, items: allItems(), steps: STEPS, profile: state.profile, progress: state.items, done: state.steps, custom: state.custom });

// ---- zip (stored, no compression: scans and PDFs are already compressed) ----
function dosTime(d) {
  return { time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() };
}
async function sendZip(res, entries) {
  res.writeHead(200, { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="visa-documents-${new Date().toISOString().slice(0, 10)}.zip"`, 'Cache-Control': 'no-store' });
  const central = []; let offset = 0;
  const write = buf => new Promise(r => { offset += buf.length; res.write(buf) ? r() : res.once('drain', r); });
  for (const e of entries) {
    const data = await readFile(join(FILES, e.fid)).catch(() => null);
    if (!data) continue;
    const name = Buffer.from(e.path, 'utf8'), crc = crc32(data), { time, date } = dosTime(new Date(e.when || Date.now()));
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(0, 8);
    h.writeUInt16LE(time, 10); h.writeUInt16LE(date, 12); h.writeUInt32LE(crc, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(data.length, 22);
    h.writeUInt16LE(name.length, 26); h.writeUInt16LE(0, 28);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(0, 10);
    c.writeUInt16LE(time, 12); c.writeUInt16LE(date, 14); c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(data.length, 24);
    c.writeUInt16LE(name.length, 28); c.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([c, name]));
    await write(Buffer.concat([h, name])); await write(data);
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(central.length, 8); end.writeUInt16LE(central.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  await write(cd); res.end(end);
}

// ---- API ----
async function api(req, res, path, url) {
  const M = req.method;
  if (path === '/api/session' && M === 'GET') return json(res, 200, { setup: !state.auth, authed: authed(req) });
  if (path === '/api/setup' && M === 'POST') {
    if (state.auth) return json(res, 409, { error: 'Already set up' });
    const { passcode } = await body(req);
    if (typeof passcode !== 'string' || passcode.length < 6) return json(res, 400, { error: 'Use at least 6 characters' });
    state.auth = await hash(passcode); newSession(res); await save();
    return json(res, 200, { ok: true });
  }
  if (path === '/api/login' && M === 'POST') {
    if (limited(req)) return json(res, 429, { error: 'Too many tries. Wait 15 minutes.' });
    const { passcode } = await body(req);
    if (typeof passcode === 'string' && await check(passcode)) { fails.delete(ipOf(req)); newSession(res); return json(res, 200, { ok: true }); }
    failed(req); return json(res, 401, { error: 'That passcode isn’t right' });
  }
  if (!authed(req)) return json(res, 401, { error: 'Sign in first' });

  if (path === '/api/logout' && M === 'POST') {
    delete state.sessions[cookies(req).vp]; save();
    res.setHeader('Set-Cookie', 'vp=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    return json(res, 200, { ok: true });
  }
  if (path === '/api/passcode' && M === 'POST') {
    const { current, next } = await body(req);
    if (!(typeof current === 'string' && await check(current))) return json(res, 401, { error: 'Current passcode isn’t right' });
    if (typeof next !== 'string' || next.length < 6) return json(res, 400, { error: 'Use at least 6 characters' });
    state.auth = await hash(next); state.sessions = {}; newSession(res); await save();
    return json(res, 200, { ok: true });
  }
  if (path === '/api/state' && M === 'GET') return json(res, 200, publicState());
  if (path === '/api/profile' && M === 'PATCH') {
    const b = await body(req);
    for (const [k, n] of Object.entries(PROFILE_FIELDS)) if (k in b) state.profile[k] = str(b[k], n);
    await save(); return json(res, 200, { profile: state.profile });
  }
  if (path.startsWith('/api/step/') && M === 'POST') {
    const id = path.slice(10);
    if (!STEPS.some(s => s.id === id)) return json(res, 404, { error: 'not found' });
    const { done } = await body(req);
    if (done) state.steps[id] = Date.now(); else delete state.steps[id];
    await save(); return json(res, 200, { done: state.steps });
  }
  if (path === '/api/custom' && M === 'POST') {
    const b = await body(req);
    if (!SECTIONS.some(s => s.id === b.section) || !str(b.title, 120).trim()) return json(res, 400, { error: 'Give it a name' });
    if (state.custom.length >= 60) return json(res, 400, { error: 'Too many custom items' });
    state.custom.push({ id: 'c-' + randomBytes(5).toString('hex'), section: b.section, need: 'helpful', title: str(b.title, 120).trim(), hint: str(b.hint, 300).trim() });
    await save(); return json(res, 200, publicState());
  }
  let m;
  if ((m = path.match(/^\/api\/custom\/(c-[a-f0-9]+)$/)) && M === 'DELETE') {
    const it = state.items[m[1]];
    for (const f of it?.files || []) await unlink(join(FILES, f.id)).catch(() => {});
    delete state.items[m[1]];
    state.custom = state.custom.filter(c => c.id !== m[1]);
    await save(); return json(res, 200, publicState());
  }
  if ((m = path.match(/^\/api\/item\/([a-z0-9-]+)$/)) && M === 'PATCH') {
    if (!allItems().some(i => i.id === m[1])) return json(res, 404, { error: 'not found' });
    const b = await body(req), it = itemState(m[1]);
    if (['todo', 'ready', 'na'].includes(b.status)) it.status = b.status;
    if ('note' in b) it.note = str(b.note, 2000);
    await save(); return json(res, 200, { item: it });
  }
  if ((m = path.match(/^\/api\/item\/([a-z0-9-]+)\/files$/)) && M === 'POST') {
    if (!allItems().some(i => i.id === m[1])) return json(res, 404, { error: 'not found' });
    const len = Number(req.headers['content-length'] || 0);
    if (!len) return json(res, 400, { error: 'Empty file' });
    if (len > MAX_FILE) return json(res, 413, { error: 'Files can be up to 30 MB' });
    const fid = randomBytes(12).toString('hex'), tmp = join(FILES, fid + '.part');
    let size = 0;
    try {
      await pipeline(req, async function* (src) { for await (const c of src) { size += c.length; if (size > MAX_FILE) throw new Error('too big'); yield c; } }, createWriteStream(tmp, { mode: 0o600 }));
      await rename(tmp, join(FILES, fid));
    } catch (e) { await unlink(tmp).catch(() => {}); return json(res, 400, { error: 'Upload failed' }); }
    let name; try { name = decodeURIComponent(req.headers['x-file-name'] || 'file'); } catch { name = 'file'; }
    const file = { id: fid, name: safeName(name), size, type: str(req.headers['content-type'] || 'application/octet-stream', 100), at: Date.now() };
    const it = itemState(m[1]);
    it.files.push(file);
    if (it.status === 'todo') it.status = 'ready';
    await save(); return json(res, 200, { item: it, file });
  }
  if ((m = path.match(/^\/api\/file\/([a-f0-9]{24})$/))) {
    const hit = findFile(m[1]);
    if (!hit) return json(res, 404, { error: 'not found' });
    if (M === 'DELETE') {
      hit.it.files = hit.it.files.filter(f => f.id !== m[1]);
      if (!hit.it.files.length && hit.it.status === 'ready') hit.it.status = 'todo';
      await unlink(join(FILES, m[1])).catch(() => {});
      await save(); return json(res, 200, { item: hit.it });
    }
    if (M === 'PATCH') {
      const b = await body(req);
      if (b.name) hit.f.name = safeName(b.name);
      await save(); return json(res, 200, { item: hit.it });
    }
    if (M === 'GET') {
      const st = await stat(join(FILES, m[1])).catch(() => null);
      if (!st) return json(res, 404, { error: 'missing' });
      const inline = !url.searchParams.has('dl') && /^(image\/(png|jpeg|gif|webp)|application\/pdf)$/.test(hit.f.type);
      res.writeHead(200, {
        'Content-Type': inline ? hit.f.type : 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'private, no-store',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(hit.f.name)}`,
        'X-Content-Type-Options': 'nosniff',
      });
      return res.end(await readFile(join(FILES, m[1])));
    }
  }
  if (path === '/api/pack.zip' && M === 'GET') {
    const entries = [];
    SECTIONS.forEach((s, si) => {
      allItems().filter(i => i.section === s.id).forEach((i, ii) => {
        const files = state.items[i.id]?.files || [];
        const dir = `${si + 1} ${safeName(s.title)}/${String(ii + 1).padStart(2, '0')} ${safeName(i.title)}`.replace(/’/g, "'");
        const used = new Set();
        for (const f of files) {
          let n = f.name, k = 2;
          while (used.has(n)) n = f.name.replace(/(\.[^.]*)?$/, ` (${k++})$1`);
          used.add(n);
          entries.push({ fid: f.id, path: `${dir}/${n}`, when: f.at });
        }
      });
    });
    return sendZip(res, entries);
  }
  return json(res, 404, { error: 'not found' });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (url.pathname.startsWith('/api/')) {
    try { return await api(req, res, url.pathname, url); }
    catch (e) { console.error(e); if (!res.headersSent) return json(res, 400, { error: 'Bad request' }); return res.end(); }
  }
  const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, '');
  const file = join(ROOT, path.endsWith('/') ? path + 'index.html' : path);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}).listen(PORT, process.env.HOST || '127.0.0.1', () => console.log(`Visa Plan listening on ${PORT}`));
