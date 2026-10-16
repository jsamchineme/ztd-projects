// Studio's service worker: shows web push notifications (lib/webpush.mjs) while Studio is closed, and opens the page a
// notification is about when it's tapped. It doesn't cache anything: Studio needs the server anyway.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let m = {};
  try { m = e.data ? e.data.json() : {}; } catch { m = { title: e.data?.text() }; }
  // Every push must show a notification (iPhones stop sending them to sites that don't).
  e.waitUntil(self.registration.showNotification(m.title || 'Studio', {
    body: m.body || '', icon: '/icon-192.png', badge: '/icon-192.png', data: { url: m.url || '/', id: m.id }, requireInteraction: true,
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || '/', self.location.origin);
  if (url.origin !== self.location.origin) return;
  e.waitUntil((async () => {
    // Seen: Studio stops the reminders. (Opening Studio says so too, but the tap shouldn't depend on it loading.)
    fetch('/api/me/push/seen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).catch(() => {});
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const win = wins.find(w => new URL(w.url).origin === self.location.origin);
    if (win){ await win.focus(); return win.navigate(url.href).catch(() => self.clients.openWindow(url.href)); }
    return self.clients.openWindow(url.href);
  })());
});
