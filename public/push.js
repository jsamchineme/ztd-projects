// Web push on this browser (lib/webpush.mjs, public/sw.js): turning it on and off, and telling Studio that the person
// has Studio open, which stops the reminders. On iPhone it works once Studio is added to the Home Screen.
import { api } from './ui.js';

const supported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const ios = () => /iPhone|iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// 'ok', 'home-screen' (an iPhone or iPad not opened from the Home Screen), 'denied' or 'unsupported'.
export function pushState(){
  if (ios() && !standalone()) return 'home-screen';
  if (!supported()) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return 'ok';
}

const registration = () => navigator.serviceWorker.register('/sw.js').then(() => navigator.serviceWorker.ready);

// This browser's push subscription, if it has one.
export async function currentSubscription(){
  if (!supported()) return null;
  const reg = await navigator.serviceWorker.getRegistration('/');
  return reg ? reg.pushManager.getSubscription() : null;
}

// Must run from a tap or click: browsers only ask for permission then.
export async function enablePush(vapidKey){
  if (await Notification.requestPermission() !== 'granted') throw new Error('Notifications weren’t allowed. You can allow them in this browser’s settings.');
  const reg = await registration();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64url(vapidKey) });
  await api('POST', '/api/me/push', { subscription: sub.toJSON() });
  return sub;
}

export async function disablePush(){
  const sub = await currentSubscription();
  if (!sub) return;
  await api('DELETE', '/api/me/push', { endpoint: sub.endpoint }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}

// Called once Studio has a signed-in page: keeps the worker up to date, and while Studio is on screen, says what's
// been seen (at most every 15 seconds).
let started = false, lastSeen = 0;
export function startPush(){
  if (started || !supported()) return;
  started = true;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
  const seen = () => {
    if (document.visibilityState !== 'visible' || Notification.permission !== 'granted' || Date.now() - lastSeen < 15000) return;
    lastSeen = Date.now();
    api('POST', '/api/me/push/seen').catch(() => {});
  };
  seen();
  document.addEventListener('visibilitychange', seen);
  addEventListener('focus', seen);
}

function base64url(s){
  const b = atob((s + '='.repeat((4 - s.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(b, c => c.charCodeAt(0));
}
