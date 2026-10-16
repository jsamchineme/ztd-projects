// Web push: Studio added to a phone's Home Screen (or open in a desktop browser) gets notifications while it's closed.
// The browser subscribes with Studio's public key and gives Studio an address at its push service (Apple, Google,
// Mozilla, Microsoft); Studio sends each message there, encrypted (the web-push package). public/sw.js shows it.
// The messages are the phone notifications (lib/phone.mjs calls sendWebPush), with the same choices and reminders.
import webpush from 'web-push';
import { db, now, getSetting, setSetting } from './db.mjs';
import { encrypt, decrypt, randomId } from './crypto.mjs';
import { DOMAIN } from './config.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS web_push (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  device TEXT NOT NULL,                 -- e.g. "iPhone", for the Account page
  createdAt INTEGER NOT NULL,
  lastOkAt INTEGER
);
CREATE TABLE IF NOT EXISTS push_setting (
  userId TEXT PRIMARY KEY,
  repeat INTEGER NOT NULL               -- remind until Studio is opened
);`);

// Studio's VAPID keys, made once. The private one is stored encrypted.
let keys = getSetting('vapid');
if (!keys){
  const k = webpush.generateVAPIDKeys();
  keys = { publicKey: k.publicKey, privateKey: encrypt(k.privateKey) };
  setSetting('vapid', keys);
}
webpush.setVapidDetails(`mailto:notifications@${DOMAIN}`, keys.publicKey, decrypt(keys.privateKey));
export const vapidPublicKey = keys.publicKey;

// Only the browsers' push services, so Studio can't be made to send requests anywhere else.
// STUDIO_PUSH_HOSTS adds hosts (the tests use a local stand-in).
const HOSTS = ['web.push.apple.com', 'fcm.googleapis.com', 'updates.push.services.mozilla.com', 'notify.windows.com', 'push.services.mozilla.com'];
const extraHosts = String(process.env.STUDIO_PUSH_HOSTS || '').split(',').filter(Boolean);
function allowedEndpoint(endpoint){
  let u; try { u = new URL(endpoint); } catch { return false; }
  if (extraHosts.includes(u.host)) return true;
  return u.protocol === 'https:' && HOSTS.some(h => u.hostname === h || u.hostname.endsWith('.' + h));
}
const err = (status, message) => Object.assign(new Error(message), { status });

export function deviceName(ua = ''){
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Device';
  const app = /iPhone|iPad/.test(ua) ? 'Home Screen' : /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'browser';
  return `${os} · ${app}`;
}

export const webRepeat = userId => (db.prepare('SELECT repeat FROM push_setting WHERE userId = ?').get(userId)?.repeat ?? 1) === 1;
export function setWebRepeat(userId, on){
  db.prepare('INSERT INTO push_setting (userId, repeat) VALUES (?,?) ON CONFLICT(userId) DO UPDATE SET repeat = excluded.repeat').run(userId, on ? 1 : 0);
}

export const webSubscriptions = userId => db.prepare('SELECT * FROM web_push WHERE userId = ?').all(userId);
export function listWebPush(userId){
  return db.prepare('SELECT id, endpoint, device, createdAt, lastOkAt FROM web_push WHERE userId = ? ORDER BY createdAt').all(userId);
}

// sub: the browser's PushSubscription as JSON. A browser that subscribes again replaces its old row.
export function subscribe(user, sub, userAgent){
  const endpoint = String(sub?.endpoint || ''), p256dh = String(sub?.keys?.p256dh || ''), auth = String(sub?.keys?.auth || '');
  if (!allowedEndpoint(endpoint) || endpoint.length > 1000 || !/^[\w-]{20,200}$/.test(p256dh) || !/^[\w-]{8,100}$/.test(auth))
    throw err(400, 'That browser’s push subscription isn’t one Studio can use.');
  if (db.prepare('SELECT count(*) AS n FROM web_push WHERE userId = ?').get(user.id).n >= 20 && !db.prepare('SELECT 1 FROM web_push WHERE endpoint = ?').get(endpoint))
    throw err(400, 'You have notifications on 20 devices. Turn one off first.');
  db.prepare('DELETE FROM web_push WHERE endpoint = ?').run(endpoint);
  const id = randomId(9);
  db.prepare('INSERT INTO web_push (id, userId, endpoint, p256dh, auth, device, createdAt) VALUES (?,?,?,?,?,?,?)')
    .run(id, user.id, endpoint, p256dh, auth, deviceName(userAgent), now());
  return { id };
}
export function unsubscribe(user, { id, endpoint }){
  if (id) db.prepare('DELETE FROM web_push WHERE id = ? AND userId = ?').run(String(id), user.id);
  if (endpoint) db.prepare('DELETE FROM web_push WHERE endpoint = ? AND userId = ?').run(String(endpoint), user.id);
}

// m: { id, at, event, title, body, url }. web-push encrypts and signs; fetch sends. A subscription the push service
// says is gone (404, 410) is removed.
export function sendWebPush(subs, m){
  const payload = JSON.stringify({ id: m.id, title: m.title, body: m.body, url: m.url });
  for (const s of subs) (async () => {
    try {
      const r = webpush.generateRequestDetails({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600, urgency: 'high' });
      const res = await fetch(r.endpoint, { method: r.method, headers: r.headers, body: r.body, signal: AbortSignal.timeout(15000) });
      if (res.ok) db.prepare('UPDATE web_push SET lastOkAt = ? WHERE id = ?').run(now(), s.id);
      else if (res.status === 404 || res.status === 410) db.prepare('DELETE FROM web_push WHERE id = ?').run(s.id);
      else console.error('Web push failed', res.status, (await res.text().catch(() => '')).slice(0, 200));
    } catch (e){ console.error('Web push failed', e.message); }
  })();
}
