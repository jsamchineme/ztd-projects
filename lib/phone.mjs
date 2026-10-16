// Phone notifications: the Studio phone app (mobile/) keeps a WebSocket open to /api/phone/socket and shows each
// message as a notification that rings. A phone is paired on the Account page, which shows a pairing code (and its
// QR code) once; Studio keeps only a hash of it. Messages are kept for a day, so a phone that was offline catches up.
// The app also gives Studio its Expo push token, and every message goes through Expo's push service too, so the phone
// shows it while the app is closed. The app drops the copy it already has.
import { createHash } from 'node:crypto';
import { WebSocketServer } from 'ws';
import QRCode from 'qrcode';
import { db, now, audit } from './db.mjs';
import { randomId } from './crypto.mjs';
import { STUDIO_URL } from './config.mjs';
import { webSubscriptions, sendWebPush, webRepeat } from './webpush.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS phone (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  tokenHash TEXT NOT NULL UNIQUE,
  createdAt INTEGER NOT NULL,
  lastSeenAt INTEGER
);
CREATE TABLE IF NOT EXISTS phone_message (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  at INTEGER NOT NULL,
  data TEXT NOT NULL                    -- { event, title, body, url }
);
CREATE INDEX IF NOT EXISTS phone_message_user ON phone_message (userId, id);`);
const addColumn = (table, col, type) => { if (!db.prepare('SELECT 1 FROM pragma_table_info(?) WHERE name = ?').get(table, col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`); };
addColumn('phone', 'pushToken', 'TEXT');
addColumn('phone', 'repeat', 'INTEGER NOT NULL DEFAULT 1');   // push again until seen (the app's "keep ringing" switch)
addColumn('phone_message', 'seenAt', 'INTEGER');              // the person opened the app on a phone after it came

// The phone app in Expo Go (mobile/README.md). /api/phone/app sends phones here: chat and email only make http(s) links
// clickable. Change it after an Expo SDK upgrade, or set STUDIO_PHONE_APP_URL.
export const PHONE_APP_URL = process.env.STUDIO_PHONE_APP_URL
  || 'exp://u.expo.dev/13ca0973-4369-458f-b5da-dbaeb85ef01c?channel-name=expo-go&runtime-version=exposdk:57.0.0';
// Expo's push service (STUDIO_EXPO_PUSH_URL is for tests). It passes notifications on to Apple and Google.
const PUSH_URL = process.env.STUDIO_EXPO_PUSH_URL || 'https://exp.host/--/api/v2/push/send';
const PUSH_TOKEN = /^Expo(nent)?PushToken\[[\w-]{10,100}\]$/;
// Until a message is seen, phones that want it get the push again this often, this many more times (like an alarm).
const REPEAT_EVERY = Number(process.env.STUDIO_PUSH_REPEAT_MS) || 30000;
const REPEATS = 4;
const KEEP = 24 * 3600 * 1000;          // how far back a reconnecting phone catches up
const MAX_PHONES = 10;
const hash = token => createHash('sha256').update('studio-phone:' + token).digest('hex');
const sockets = new Map();              // phone id -> Set(ws)
const err = (status, message) => Object.assign(new Error(message), { status });

export function listPhones(userId){
  return db.prepare('SELECT id, name, createdAt, lastSeenAt, pushToken IS NOT NULL AS push FROM phone WHERE userId = ? ORDER BY createdAt').all(userId)
    .map(p => ({ ...p, push: !!p.push, connected: (sockets.get(p.id)?.size || 0) > 0 }));
}

// The code is "<Studio address>#<token>": the app needs both, and it's shown only now.
export async function pairPhone(user, name, ip){
  name = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'My phone';
  if (db.prepare('SELECT count(*) AS n FROM phone WHERE userId = ?').get(user.id).n >= MAX_PHONES) throw err(400, `You can pair up to ${MAX_PHONES} phones. Remove one first.`);
  const id = randomId(9), token = randomId(32);
  db.prepare('INSERT INTO phone (id, userId, name, tokenHash, createdAt) VALUES (?,?,?,?,?)').run(id, user.id, name, hash(token), now());
  audit(user.id, 'phone.pair', name, '', ip);
  const code = `${STUDIO_URL}#${token}`;
  return { id, name, code, qr: await QRCode.toString(code, { type: 'svg', margin: 1, width: 220 }) };
}

export function removePhone(user, id, ip){
  const p = db.prepare('SELECT * FROM phone WHERE id = ? AND userId = ?').get(id, user.id);
  if (!p) throw err(404, 'That phone isn’t paired.');
  db.prepare('DELETE FROM phone WHERE id = ?').run(id);
  for (const ws of sockets.get(id) || []) ws.close(4001, 'Removed in Studio');
  audit(user.id, 'phone.remove', p.name, '', ip);
}

// Saves a message and sends it to each of the person's phones: over its connection if it's open, and as a push if
// the app gave Studio a push token; and to each browser with web push on (lib/webpush.mjs). Returns how many devices
// it went to.
export function sendToPhones(userId, { event, title, body = '', url = '' }){
  const phones = db.prepare('SELECT id, pushToken FROM phone WHERE userId = ?').all(userId);
  const webs = webSubscriptions(userId);
  if (!phones.length && !webs.length) return 0;
  const at = now(), data = { event, title: String(title).slice(0, 200), body: String(body).slice(0, 600), url };
  const id = Number(db.prepare('INSERT INTO phone_message (userId, at, data) VALUES (?,?,?)').run(userId, at, JSON.stringify(data)).lastInsertRowid);
  db.prepare('DELETE FROM phone_message WHERE at < ?').run(at - KEEP);
  const msg = JSON.stringify({ type: 'message', id, at, ...data });
  let n = 0;
  for (const p of phones){
    let sent = false;
    for (const ws of sockets.get(p.id) || []) if (ws.readyState === ws.OPEN){ ws.send(msg); sent = true; }
    if (p.pushToken) sent = true;
    if (sent) n++;
  }
  const pushes = phones.filter(p => p.pushToken);
  if (pushes.length) push(pushes, { id, at, ...data });
  if (webs.length) sendWebPush(webs, { id, at, ...data });
  if (pushes.length || webs.length) repeatUntilSeen(userId, { id, at, ...data });
  return n + webs.length;
}

// Opening Studio or the app counts as seeing everything up to now (or up to `upTo`), which stops the reminders.
export function markSeen(userId, upTo = Number.MAX_SAFE_INTEGER){
  db.prepare('UPDATE phone_message SET seenAt = ? WHERE userId = ? AND id <= ? AND seenAt IS NULL').run(now(), userId, upTo);
}

// Pushes the message again every REPEAT_EVERY until it's seen on any phone (see 'seen' below), to phones whose app has
// "keep ringing" on. Reminders say which one they are. Timers only: a Studio restart stops them.
function repeatUntilSeen(userId, m, round = 1){
  if (round > REPEATS) return;
  setTimeout(() => {
    if (db.prepare('SELECT seenAt FROM phone_message WHERE id = ?').get(m.id)?.seenAt !== null) return;   // seen, or gone
    const phones = db.prepare('SELECT id, pushToken FROM phone WHERE userId = ? AND pushToken IS NOT NULL AND repeat = 1').all(userId);
    const webs = webRepeat(userId) ? webSubscriptions(userId) : [];
    if (!phones.length && !webs.length) return;
    const again = { ...m, body: `Reminder ${round} of ${REPEATS}${m.body ? ' · ' + m.body : ''}` };
    if (phones.length) push(phones, again);
    if (webs.length) sendWebPush(webs, again);
    repeatUntilSeen(userId, m, round + 1);
  }, REPEAT_EVERY).unref();
}

// One request for all of the person's phones. A phone whose token Expo no longer knows (the app was deleted) loses it.
async function push(phones, m){
  try {
    const res = await fetch(PUSH_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, signal: AbortSignal.timeout(15000),
      body: JSON.stringify(phones.map(p => ({ to: p.pushToken, title: m.title, body: m.body || undefined, sound: 'default', priority: 'high',
        data: { studio: true, id: m.id, at: m.at, event: m.event, title: m.title, body: m.body, url: m.url } })))
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok){ console.error('Expo push failed', res.status, JSON.stringify(out).slice(0, 300)); return; }
    (out.data || []).forEach((t, i) => {
      if (t.status === 'error' && t.details?.error === 'DeviceNotRegistered') db.prepare('UPDATE phone SET pushToken = NULL WHERE id = ?').run(phones[i].id);
      else if (t.status === 'error') console.error('Expo push failed', t.message);
    });
  } catch (e){ console.error('Expo push failed', e.message); }
}

export function testPhones(user){
  return { delivered: sendToPhones(user.id, { event: 'test', title: 'Test from Studio', body: 'If your phone rang, notifications work.', url: `${STUDIO_URL}/account` }) };
}

// ---------- the socket ----------
// The app sends { type: 'hello', token, after } first: after is the last message id it has (null on a new phone, which
// gets nothing old). Then Studio sends { type: 'ready' }, any missed messages, and new ones as they happen.
// { type: 'ping' } gets { type: 'pong' }, so the app can tell a dead connection; { type: 'test' } sends a test message;
// { type: 'push-token', token } saves where pushes go (token null: none); { type: 'repeat', on } whether pushes repeat
// until seen; { type: 'seen', upTo } marks messages up to that id seen (the app is open), which stops the repeats.
const wss = new WebSocketServer({ noServer: true, maxPayload: 4096 });

export function handlePhoneUpgrade(req, socket, head){
  wss.handleUpgrade(req, socket, head, ws => welcome(ws));
}

function welcome(ws){
  let phone = null;
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  const helloTimer = setTimeout(() => ws.close(4000, 'Say hello first'), 10000);
  ws.on('message', raw => {
    let m; try { m = JSON.parse(String(raw)); } catch { return; }
    ws.isAlive = true;
    if (!phone){
      if (m.type !== 'hello') return;
      clearTimeout(helloTimer);
      const p = db.prepare(`SELECT phone.*, user.name AS userName, user.banned AS banned FROM phone JOIN user ON user.id = phone.userId WHERE tokenHash = ?`).get(hash(String(m.token || '')));
      if (!p || p.banned){
        ws.send(JSON.stringify({ type: 'unpaired', error: 'This phone isn’t paired with Studio any more. Pair it again from your Account page.' }));
        return ws.close(4001, 'Not paired');
      }
      phone = p;
      if (!sockets.has(p.id)) sockets.set(p.id, new Set());
      sockets.get(p.id).add(ws);
      db.prepare('UPDATE phone SET lastSeenAt = ? WHERE id = ?').run(now(), p.id);
      const last = db.prepare('SELECT max(id) AS m FROM phone_message WHERE userId = ?').get(p.userId).m || 0;
      ws.send(JSON.stringify({ type: 'ready', phone: p.name, user: p.userName, studio: STUDIO_URL, last }));
      const after = Number(m.after);
      if (m.after != null && Number.isFinite(after))
        for (const r of db.prepare('SELECT id, at, data FROM phone_message WHERE userId = ? AND id > ? AND at > ? ORDER BY id LIMIT 30').all(p.userId, after, now() - KEEP))
          ws.send(JSON.stringify({ type: 'message', id: r.id, at: r.at, missed: true, ...JSON.parse(r.data) }));
      return;
    }
    if (m.type === 'ping') ws.send(JSON.stringify({ type: 'pong' }));
    else if (m.type === 'push-token'){
      const t = m.token == null ? null : String(m.token);
      if (t === null || PUSH_TOKEN.test(t)) db.prepare('UPDATE phone SET pushToken = ? WHERE id = ?').run(t, phone.id);
      ws.send(JSON.stringify({ type: 'push-token', saved: t === null || PUSH_TOKEN.test(t) }));
    }
    else if (m.type === 'repeat') db.prepare('UPDATE phone SET repeat = ? WHERE id = ?').run(m.on ? 1 : 0, phone.id);
    else if (m.type === 'seen' && Number.isFinite(Number(m.upTo))) markSeen(phone.userId, Number(m.upTo));
    else if (m.type === 'test') sendToPhones(phone.userId, { event: 'test', title: 'Test from Studio', body: 'If your phone rang, notifications work.', url: `${STUDIO_URL}/account` });
  });
  ws.on('close', () => {
    clearTimeout(helloTimer);
    if (!phone) return;
    sockets.get(phone.id)?.delete(ws);
    if (!sockets.get(phone.id)?.size) sockets.delete(phone.id);
    if (db.prepare('SELECT 1 FROM phone WHERE id = ?').get(phone.id)) db.prepare('UPDATE phone SET lastSeenAt = ? WHERE id = ?').run(now(), phone.id);
  });
  ws.on('error', () => {});
}

// Drops connections that stopped answering (a phone that lost signal doesn't say goodbye).
setInterval(() => {
  for (const ws of wss.clients){
    if (!ws.isAlive){ ws.terminate(); continue; }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000).unref();
