// Didit service worker: offline shell, push reminders, and Done/Snooze straight from the notification.
importScripts('/db.js');

const CACHE = 'didit-v1';
const SHELL = ['/', '/index.html', '/styles.css', '/app.js', '/db.js', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/apple-touch-icon.png', '/icons/badge-96.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first so updates arrive straight away; fall back to the cache when offline.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('/')))
  );
});

const tellPages = msg => self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.forEach(c => c.postMessage(msg)));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch { d = { title: 'Didit', body: e.data?.text() || '' }; }
  e.waitUntil((async () => {
    await self.registration.showNotification(d.title || 'Didit', {
      body: d.body || '',
      tag: d.tag || 'didit',
      renotify: true,
      requireInteraction: !d.test,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-96.png',
      vibrate: [120, 60, 120],
      data: d,
      actions: d.key ? [{ action: 'done', title: '✓ Done' }, { action: 'snooze', title: 'Snooze 15 min' }] : [],
    });
    tellPages({ type: 'push', key: d.key });
  })());
});

async function deviceId() { return DB.meta('deviceId'); }

self.addEventListener('notificationclick', e => {
  const n = e.notification, d = n.data || {};
  n.close();
  e.waitUntil((async () => {
    const id = d.deviceId || await deviceId();
    if (e.action === 'done' && d.key) {
      const [taskId, rest] = d.key.split('@');
      await DB.put('done', { key: d.key, taskId, date: rest.slice(0, 10), time: rest.slice(11), at: Date.now() });
      await fetch(`/api/device/${id}/ack`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: d.key }) }).catch(() => {});
      return tellPages({ type: 'changed' });
    }
    if (e.action === 'snooze' && d.key) {
      return fetch(`/api/device/${id}/snooze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: d.key, minutes: 15 }) }).catch(() => {});
    }
    // Plain tap: open the app on the right reminder.
    const url = d.key ? `/?slot=${encodeURIComponent(d.key)}` : '/';
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if ('focus' in w) { await w.focus(); w.postMessage({ type: 'open', key: d.key }); return; }
    }
    return self.clients.openWindow(url);
  })());
});
