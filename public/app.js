// Didit: gentle reminders for Obim. All data lives in IndexedDB on the phone (see db.js).
const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hm = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmt12 = t => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? 'am' : 'pm'}`; };
const uid = (n = 16) => [...crypto.getRandomValues(new Uint8Array(n))].map(b => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'[b & 63]).join('');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slotKey = (taskId, date, time) => `${taskId}@${date}T${time}`;
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
// iPhone browsers/in-app browsers that can't add to the Home Screen: send them to Safari instead.
const notSafari = isIOS && /CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|FBAN|FBAV|Instagram|Snapchat|LinkedInApp|Twitter|WhatsApp|Line\//i.test(navigator.userAgent);
const safariUrl = `x-safari-https://${location.host}/`;
const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const EMOJIS = ['💊', '🌿', '🍼', '🩷', '💧', '🥛', '🍊', '🐟', '🍎', '☀️', '🥚', '🫐', '🧴', '🩺', '🌸', '⭐', '🧘‍♀️', '🚶‍♀️', '🦶', '😴'];
const PRESETS = [
  { name: 'Prenatal vitamin', emoji: '💊', times: ['08:00'] },
  { name: 'Folic acid', emoji: '🌿', times: ['08:00'] },
  { name: 'Iron', emoji: '🍎', times: ['13:00'], note: 'With orange juice, not tea' },
  { name: 'Vitamin D', emoji: '☀️', times: ['09:00'] },
  { name: 'Omega-3 / DHA', emoji: '🐟', times: ['19:00'] },
  { name: 'Drink water', emoji: '💧', times: ['10:00', '14:00', '18:00'], nag: 15 },
];
const CHEERS = ['Yay! Baby says thank you 💕', 'Gold star, Obim ⭐', 'One more thing done ✨', 'Look at you go 🌸', 'Little kicks of approval 👣', 'So proud of you 🤍', 'Nailed it 💅', 'Growing a human AND organised 👑'];
const SIZES = { 4: ['🌱', 'a poppy seed'], 5: ['🌱', 'a sesame seed'], 6: ['🫘', 'a lentil'], 7: ['🫐', 'a blueberry'], 8: ['🫘', 'a kidney bean'], 9: ['🍇', 'a grape'], 10: ['🍓', 'a strawberry'], 11: ['🍋', 'a lime'], 12: ['🥝', 'a kiwi'], 13: ['🍋', 'a lemon'], 14: ['🍊', 'an orange'], 15: ['🍎', 'an apple'], 16: ['🥑', 'an avocado'], 17: ['🍐', 'a pear'], 18: ['🫑', 'a bell pepper'], 19: ['🥭', 'a mango'], 20: ['🍌', 'a banana'], 21: ['🥕', 'a carrot'], 22: ['🍠', 'a sweet potato'], 23: ['🍊', 'a grapefruit'], 24: ['🌽', 'an ear of corn'], 25: ['🥦', 'a cauliflower'], 26: ['🥬', 'a lettuce'], 27: ['🥬', 'a cabbage'], 28: ['🍆', 'an aubergine'], 29: ['🎃', 'a butternut squash'], 30: ['🥒', 'a big cucumber'], 31: ['🥥', 'a coconut'], 32: ['🥬', 'a napa cabbage'], 33: ['🍍', 'a pineapple'], 34: ['🍈', 'a cantaloupe'], 35: ['🍈', 'a honeydew melon'], 36: ['🥬', 'a romaine lettuce'], 37: ['🥬', 'a bunch of chard'], 38: ['🌿', 'a leek'], 39: ['🍉', 'a mini watermelon'], 40: ['🍉', 'a watermelon'] };

let tasks = [], done = new Map(), settings = { name: '', due: '' }, deviceId = '', pushOn = false;
let tab = 'today';
const alerted = new Set();

// ---------- data ----------
async function load() {
  tasks = (await DB.all('tasks')).sort((a, b) => (a.created || 0) - (b.created || 0));
  done = new Map((await DB.all('done')).map(r => [r.key, r]));
  settings.name = (await DB.meta('name')) || '';
  settings.due = (await DB.meta('due')) || '';
  deviceId = await DB.meta('deviceId');
  if (!deviceId) { deviceId = uid(24); await DB.setMeta('deviceId', deviceId); }
  pushOn = !!(await DB.meta('push')) && pushSupported && Notification.permission === 'granted';
}

function slotsFor(date) {
  const dow = new Date(date + 'T12:00').getDay();
  const out = [];
  for (const t of tasks) {
    if (t.paused) continue;
    const days = t.days?.length ? t.days : ALL_DAYS;
    if (!days.includes(dow)) continue;
    for (const time of t.times) {
      const key = slotKey(t.id, date, time);
      if (t.since && `${date}T${time}` < t.since && !done.has(key)) continue;
      out.push({ key, task: t, time, date, done: done.has(key) });
    }
  }
  return out.sort((a, b) => a.time.localeCompare(b.time) || a.task.name.localeCompare(b.task.name));
}

// ---------- sync (only when reminders are switched on) ----------
let syncTimer;
function sync() { clearTimeout(syncTimer); syncTimer = setTimeout(doSync, 300); }
async function doSync() {
  if (!pushOn) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    const since = ymd(new Date(Date.now() - 2 * 864e5));
    const undone = (await DB.meta('undone')) || [];
    const res = await fetch(`/api/device/${deviceId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub?.toJSON(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        tasks: tasks.map(({ id, name, emoji, note, times, days, nag, since, paused }) => ({ id, name, emoji, note, times, days, nag, since, paused })),
        done: [...done.values()].filter(r => r.date >= since).map(r => r.key), undone,
      }),
    });
    if (res.ok && undone.length) await DB.setMeta('undone', []);
  } catch (e) { console.warn('sync later', e); }
}

const post = (path, data) => fetch(`/api/device/${deviceId}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(() => {});

async function enableNotifications() {
  if (isIOS && !standalone) { showTab('me'); toast('First add Didit to your Home Screen 📲'); return; }
  if (!pushSupported) { toast('This browser can’t do reminders. Try Safari or Chrome.'); return; }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { render(); toast('Notifications are blocked. Allow them in Settings.'); return; }
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const { publicKey } = await (await fetch('/api/vapid')).json();
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(publicKey) });
    }
    await DB.setMeta('push', true);
    pushOn = true;
    await doSync();
    render();
    toast('Reminders are on 🔔');
  } catch (e) {
    console.error(e);
    toast('Couldn’t turn on reminders. Please try again.');
  }
}
function b64ToBytes(s) { const b = atob((s + '='.repeat((4 - s.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(b, c => c.charCodeAt(0)); }

// ---------- actions ----------
async function markDone(key, el) {
  const [taskId, rest] = key.split('@');
  const rec = { key, taskId, date: rest.slice(0, 10), time: rest.slice(11), at: Date.now() };
  await DB.put('done', rec);
  done.set(key, rec);
  if (pushOn) post('ack', { key });
  closeNotification(key);
  const r = el?.getBoundingClientRect();
  confetti(r ? r.left + r.width / 2 : innerWidth / 2, r ? r.top + r.height / 2 : innerHeight / 2);
  navigator.vibrate?.(30);
  render();
  const left = slotsFor(ymd(new Date())).filter(s => !s.done).length;
  toast(left ? CHEERS[Math.floor(Math.random() * CHEERS.length)] : 'All done for today! 🎉', () => undoDone(key));
  if (!left) setTimeout(() => confetti(innerWidth / 2, innerHeight / 3, 140), 350);
}
async function undoDone(key) {
  await DB.del('done', key);
  done.delete(key);
  const undone = (await DB.meta('undone')) || [];
  await DB.setMeta('undone', [...new Set([...undone, key])]);
  render(); sync();
}
async function closeNotification(tag) {
  try { const reg = await navigator.serviceWorker.ready; (await reg.getNotifications({ tag })).forEach(n => n.close()); } catch {}
}

// ---------- rendering ----------
function render() {
  renderToday(); renderTasks(); renderMe();
}

function renderToday() {
  const now = new Date(), today = ymd(now), nowHM = hm(now);
  $('#todayDate').textContent = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const h = now.getHours();
  const hello = h < 5 ? 'Sweet dreams' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  $('#greeting').innerHTML = `${hello},<br><em>${esc(settings.name || 'Obim ❤️')}</em>`;

  renderBump(now);
  renderNotices();

  const slots = slotsFor(today);
  const doneCount = slots.filter(s => s.done).length;
  const dueCount = slots.filter(s => !s.done && s.time <= nowHM).length;
  $('#progressCard').hidden = !slots.length;
  $('#week').hidden = $('#weekTitle').hidden = !tasks.length;
  $('#ringText').textContent = `${doneCount}/${slots.length}`;
  $('#ringBar').style.strokeDashoffset = 119.4 * (1 - (slots.length ? doneCount / slots.length : 0));
  $('#progressTitle').textContent = doneCount === slots.length ? 'All done today' : dueCount ? `${dueCount} waiting for you` : 'You’re on track';
  const next = slots.find(s => !s.done && s.time > nowHM);
  $('#progressSub').textContent = doneCount === slots.length ? 'Feet up, Obim ❤️ You earned it' : next ? `Next up: ${next.task.name} at ${fmt12(next.time)}` : 'Tick them off as you go';
  const st = streak();
  $('#streak').hidden = st < 2;
  $('#streak').textContent = `🔥 ${st} days`;

  renderWeek(now);

  $('#emptyToday').hidden = tasks.length > 0;
  const list = $('#slots');
  if (!tasks.length) { list.innerHTML = ''; return; }
  if (!slots.length) { list.innerHTML = `<li class="card allset"><div class="big">🌙</div><h2>Nothing scheduled today</h2><p>Enjoy a free day.</p></li>`; return; }
  list.innerHTML = slots.map(s => {
    const state = s.done ? 'done' : s.time <= nowHM ? 'due' : 'soon';
    const pill = s.done ? `<span class="pill done">Done ${fmt12(hm(new Date(done.get(s.key).at)))}</span>` : state === 'due' ? '<span class="pill due">Now</span>' : `<span class="pill soon">${fmt12(s.time)}</span>`;
    return `<li class="card slot ${state}" data-key="${esc(s.key)}">
      <div class="em">${esc(s.task.emoji)}</div>
      <div class="txt"><div class="name">${esc(s.task.name)}</div><div class="meta">${pill}${state === 'soon' ? '' : fmt12(s.time)}${s.task.note ? ' · ' + esc(s.task.note) : ''}</div></div>
      <button class="check" aria-label="${s.done ? 'Undo' : 'Mark done'}"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>
    </li>`;
  }).join('') + (doneCount === slots.length ? `<li class="card allset"><div class="big">🎉</div><h2>Everything’s done</h2><p>Baby high-five! See you tomorrow.</p></li>` : '');
}

function renderBump(now) {
  const card = $('#bumpCard');
  if (!settings.due) {
    card.className = 'card bump setup';
    card.innerHTML = `<div class="fruit">🍋</div><div><p class="kicker">How big is baby?</p><h2>Add your <em>due date</em></h2><p class="sub">See what fruit the bump is this week.</p></div>`;
    return;
  }
  card.className = 'card bump';
  const due = new Date(settings.due + 'T00:00'), midnight = new Date(ymd(now) + 'T00:00');
  const left = Math.round((due - midnight) / 864e5);
  const preg = 280 - left, week = Math.floor(preg / 7), day = preg % 7;
  if (left <= 0) {
    card.innerHTML = `<div class="fruit">🎀</div><div><p class="kicker">${left === 0 ? 'Due date' : 'Past your due date'}</p><h2>Any day <em>now</em>!</h2><p class="sub">You’ve done amazing, Obim ❤️</p></div>`;
    return;
  }
  if (week < 4) {
    card.innerHTML = `<div class="fruit">✨</div><div><p class="kicker">Early days</p><h2>Something <em>tiny</em> and wonderful</h2><p class="sub">${left} days to go</p></div>`;
    return;
  }
  const [fruit, what] = SIZES[Math.min(week, 40)];
  const tri = week < 14 ? 'First trimester' : week < 28 ? 'Second trimester' : 'Third trimester';
  card.innerHTML = `<div class="fruit">${fruit}</div><div style="flex:1;min-width:0"><p class="kicker">Week ${week}${day ? ` · Day ${day}` : ''}</p><h2>Baby is about the size of <em>${what}</em></h2><p class="sub">${left} day${left === 1 ? '' : 's'} to go · ${tri}</p><div class="bar"><i style="width:${Math.min(100, preg / 2.8).toFixed(1)}%"></i></div></div>`;
}

function renderNotices() {
  const install = $('#installCard'), notify = $('#notifyCard');
  install.innerHTML = notify.innerHTML = '';
  if (notSafari && !standalone) {
    install.innerHTML = `<div class="card notice"><div class="ic">🧭</div><div><h2>Open Didit in Safari</h2><p>To get reminders on iPhone, Didit needs to be added to your Home Screen from Safari.</p><a class="btn" href="${safariUrl}">Open in Safari</a><p style="margin-top:12px">Nothing happened? <button class="linkish" data-copy>Copy the link</button> and paste it into Safari.</p></div></div>`;
    return;
  }
  if (isIOS && !standalone) {
    install.innerHTML = `<div class="card notice"><div class="ic">📲</div><div><h2>Add Didit to your Home Screen</h2><p>iPhone only sends reminders to apps on the Home Screen. It takes 10 seconds.</p><button class="btn" data-guide>Add to Home Screen</button></div></div>`;
    return;
  }
  if (!pushSupported || pushOn) return;
  if (Notification.permission === 'denied') {
    notify.innerHTML = `<div class="card notice"><div class="ic">🔕</div><div><h2>Notifications are blocked</h2><p>Allow notifications for Didit in your phone’s Settings, then come back here.</p></div></div>`;
    return;
  }
  notify.innerHTML = `<div class="card notice"><div class="ic">🔔</div><div><h2>Turn on reminders</h2><p>I’ll nudge you at the right time, and keep nudging until you tap Done.</p><button class="btn" data-enable>Turn on reminders</button></div></div>`;
}
const iosSteps = () => `<li>Tap the Share button <svg class="share-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8"/></svg> in Safari’s toolbar (on newer iPhones it’s inside the <b>•••</b> menu)</li><li>Scroll down and choose <b>Add to Home Screen</b></li><li>Open Didit from your Home Screen and turn on reminders</li>`;

// iPhone has no install button for websites, so walk her through Safari's own one.
function showGuide() {
  const g = document.createElement('div');
  g.id = 'guide';
  // Safari 26 tucks Share inside the ••• menu; older Safari has it right in the toolbar.
  const v26 = Number((navigator.userAgent.match(/Version\/(\d+)/) || [])[1]) >= 26;
  const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const SHARE = ic('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M6 11H5v10h14V11h-1"/>');
  const rows = [['Copy', ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>')],
    ['Add to Reading List', ic('<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14h4"/>')],
    ['Add Bookmark', ic('<path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1z"/><path d="M12 6v14"/>')],
    ['Add to Favourites', ic('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1-4.4-4.3 6.1-.9z"/>')],
    ['Find on Page', ic('<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>')],
    ['Add to Home Screen', ic('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/>'), 'home'],
    ['Markup', ic('<path d="M4 20h4L19 9l-4-4L4 16z"/>')],
    ['Print', ic('<path d="M7 9V4h10v5M7 17H5v-7h14v7h-2M7 14h10v6H7z"/>')]];
  g.innerHTML = `<div class="guide-card">
    <h2>Add Didit to your Home Screen</h2>
    <div class="ph"><div class="ph-screen">
      <div class="ph-status"><b>9:41</b><span>▮▮▮ ◔</span></div>
      <div class="ph-page"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i><i class="e"></i></div>
      ${v26
        ? `<div class="ph-bar v26"><span>‹</span><span class="url">didit.ztddevs.com</span><span id="phMore">•••</span></div>
           <div class="ph-menu"><div id="phShareRow">${SHARE} Share</div><div>${ic('<path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1z"/>')} Add Bookmark</div><div>${ic('<path d="M12 5v14M5 12h14"/>')} New Tab</div></div>`
        : `<div class="ph-url">didit.ztddevs.com</div><div class="ph-bar"><span>‹</span><span>›</span><span id="phShare">${SHARE}</span><span>${ic('<path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1z"/>')}</span><span>${ic('<rect x="4" y="7" width="12" height="12" rx="2"/><path d="M8 4h11a1 1 0 0 1 1 1v11"/>')}</span></div>`}
      <div class="ph-sheet">
        <div class="ph-head"><img src="/icons/apple-touch-icon.png" alt=""><div><b>Didit</b><small>didit.ztddevs.com</small></div><span>✕</span></div>
        <div class="ph-apps"><i style="background:#3b82f6"></i><i style="background:#34c759"></i><i style="background:#2f7cf6"></i><i style="background:#f5c542"></i></div>
        <div class="ph-list-wrap"><div class="ph-list">${rows.map(([t, svg, id]) => `<div${id ? ' id="phHomeRow"' : ''}><span>${t}</span>${svg}</div>`).join('')}</div></div>
      </div>
      <div class="ph-add">
        <div class="ph-add-top"><span>Cancel</span><b>Add to Home Screen</b><span id="phAddBtn">Add</span></div>
        <div class="ph-add-card"><img src="/icons/apple-touch-icon.png" alt=""><div><b>Didit</b><small>didit.ztddevs.com</small></div></div>
        ${v26 ? '<div class="ph-add-card toggle"><span>Open as Web App</span><i></i></div>' : ''}
      </div>
      <div class="ph-home"><div class="ph-grid">${Array.from({ length: 19 }, (_, i) => `<i style="background:hsl(${(i * 47) % 360} 45% 72%)"></i>`).join('')}<figure class="ph-app"><img src="/icons/apple-touch-icon.png" alt=""><figcaption>Didit</figcaption></figure></div></div>
      <div class="ph-finger"></div>
    </div></div>
    <p class="guide-cap" id="guideCap"></p>
    <div class="guide-dots" id="guideDots"></div>
    <p class="guide-tap">Tap anywhere to close</p></div>
    <div class="guide-arrow"><span>${v26 ? '••• is down here' : 'Share is down here'}</span>↓</div>`;
  document.body.append(g);
  runGuide(g, v26);
}

async function runGuide(g, v26) {
  const screen = g.querySelector('.ph-screen'), finger = g.querySelector('.ph-finger'), list = g.querySelector('.ph-list');
  const q = s => g.querySelector(s);
  const caps = v26
    ? ['Tap ••• at the bottom of Safari', 'Then tap Share', 'Scroll down the menu', 'Tap Add to Home Screen', 'Tap Add', 'Open Didit from your Home Screen ❤️']
    : ['Tap Share at the bottom of Safari', 'Scroll down the menu', 'Tap Add to Home Screen', 'Tap Add', 'Open Didit from your Home Screen ❤️'];
  let step = 0;
  const cap = () => { q('#guideCap').textContent = caps[step]; q('#guideDots').innerHTML = caps.map((_, i) => `<i class="${i === step ? 'on' : ''}"></i>`).join(''); step++; };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const alive = () => g.isConnected;
  const moveTo = el => {
    const a = screen.getBoundingClientRect(), b = el.getBoundingClientRect();
    finger.style.left = `${b.left - a.left + b.width / 2}px`;
    finger.style.top = `${b.top - a.top + b.height / 2}px`;
  };
  const tap = async el => { el.classList.add('pressed'); finger.classList.add('tap'); await wait(320); finger.classList.remove('tap'); el.classList.remove('pressed'); };
  while (alive()) {
    step = 0;
    screen.className = 'ph-screen';
    list.style.transform = '';
    finger.style.cssText = 'left:70%;top:110%';
    finger.classList.remove('hide');
    cap();
    await wait(500);
    const first = q(v26 ? '#phMore' : '#phShare');
    moveTo(first); await wait(800); await tap(first);
    if (v26) {
      screen.classList.add('menu'); await wait(600); cap();
      const row = q('#phShareRow'); moveTo(row); await wait(800); await tap(row);
      screen.classList.remove('menu');
    }
    screen.classList.add('sheet'); await wait(900); if (!alive()) return; cap();
    // drag the list up to reveal "Add to Home Screen"
    const wrap = q('.ph-list-wrap'), home = q('#phHomeRow');
    const shift = Math.max(0, home.offsetTop + home.offsetHeight - wrap.clientHeight + 8);
    moveTo(wrap.lastElementChild.lastElementChild); await wait(700);
    finger.classList.add('drag');
    finger.style.top = `${parseFloat(finger.style.top) - shift}px`;
    list.style.transform = `translateY(-${shift}px)`;
    await wait(1200); finger.classList.remove('drag'); cap();
    moveTo(home); await wait(800); await tap(home);
    screen.classList.add('add'); await wait(700); if (!alive()) return; cap();
    const add = q('#phAddBtn'); moveTo(add); await wait(800); await tap(add);
    finger.classList.add('hide');
    screen.classList.add('home'); await wait(500); cap();
    await wait(3200);
  }
}

function renderWeek(now) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const date = ymd(d), slots = slotsFor(date), n = slots.filter(s => s.done).length;
    const cls = [i === 0 ? 'today' : '', slots.length && n === slots.length ? 'full' : n ? 'part' : ''].join(' ');
    days.push(`<div class="${cls}" style="--p:${slots.length ? Math.round(100 * n / slots.length) : 0}%">${d.toLocaleDateString(undefined, { weekday: 'narrow' })}<b>${slots.length && n === slots.length ? '♥' : d.getDate()}</b></div>`);
  }
  $('#week').innerHTML = days.join('');
}

function streak() {
  const earliest = tasks.reduce((m, t) => (t.since && t.since.slice(0, 10) < m ? t.since.slice(0, 10) : m), '9999');
  let count = 0;
  const d = new Date();
  for (let i = 0; i < 400; i++, d.setDate(d.getDate() - 1)) {
    const date = ymd(d);
    if (date < earliest) break;
    const slots = slotsFor(date);
    if (!slots.length) continue;
    const complete = slots.every(s => s.done);
    if (complete) count++;
    else if (i === 0) continue; // today isn't over yet
    else break;
  }
  return count;
}

function daysLabel(days) {
  if (!days?.length || days.length === 7) return 'Every day';
  const s = [...days].sort().join('');
  if (s === '12345') return 'Weekdays';
  if (s === '06') return 'Weekends';
  return [1, 2, 3, 4, 5, 6, 0].filter(d => days.includes(d)).map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ');
}

function renderTasks() {
  $('#emptyTasks').hidden = tasks.length > 0;
  $('#taskList').innerHTML = tasks.map(t => `<li class="card task${t.paused ? ' paused' : ''}" data-id="${esc(t.id)}">
    <div class="em">${esc(t.emoji)}</div>
    <div class="txt"><div class="name">${esc(t.name)}</div><div class="meta">${t.times.map(fmt12).join(', ')} · ${daysLabel(t.days)}</div><div class="meta">Repeats every ${t.nag} min until done${t.note ? ' · ' + esc(t.note) : ''}</div></div>
    <div class="chev">›</div></li>`).join('');
}

function renderMe() {
  const f = $('#meForm');
  if (document.activeElement?.form !== f) { f.name.value = settings.name; f.due.value = settings.due; }
  const status = $('#notifyStatus'), en = $('#enableNotify'), test = $('#testNotify');
  test.hidden = !pushOn;
  en.hidden = pushOn;
  if (isIOS && !standalone) { status.textContent = 'Add Didit to your Home Screen first, then open it from there to turn on reminders.'; en.hidden = true; }
  else if (!pushSupported) status.textContent = 'This browser doesn’t support reminders. On iPhone use Safari (iOS 16.4 or newer); on Android use Chrome.';
  else if (Notification.permission === 'denied') { status.textContent = 'Notifications are blocked. Allow them for Didit in your phone’s Settings.'; en.hidden = true; }
  else if (pushOn) status.textContent = 'Reminders are on 🔔 They repeat until you tap Done, either in the app or on the notification.';
  else status.textContent = 'Reminders are off. Turn them on so Didit can nudge you, even when the app is closed.';

  const help = $('#installHelp');
  if (standalone) { help.hidden = true; return; }
  help.hidden = false;
  help.innerHTML = isIOS
    ? `<h2>Add to Home Screen</h2><ol class="muted" style="padding-left:20px;margin:0">${iosSteps()}</ol>`
    : `<h2>Install the app</h2><p class="muted">Open your browser menu (⋮) and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>${installPrompt ? '<button class="btn primary" id="installBtn">Install Didit</button>' : ''}`;
}

// ---------- editor ----------
let editing = null;
function openEditor(task) {
  const t = task || {};
  editing = { id: t.id, emoji: t.emoji || '💊', times: t.times?.length ? [...t.times] : ['08:00'], days: t.days?.length ? [...t.days] : [...ALL_DAYS], nag: t.nag || 10, orig: t };
  const f = $('#taskForm');
  f.name.value = t.name || '';
  f.note.value = t.note || '';
  $('#sheetTitle').textContent = t.id ? 'Edit reminder' : 'New reminder';
  $('#deleteTask').hidden = !t.id;
  drawEditor();
  $('#sheet').hidden = false;
  if (!t.name) setTimeout(() => f.name.focus(), 350);
}
function drawEditor() {
  const e = editing;
  const emojis = EMOJIS.includes(e.emoji) ? EMOJIS : [e.emoji, ...EMOJIS];
  $('#emojiPick').innerHTML = emojis.map(x => `<button type="button" class="${x === e.emoji ? 'on' : ''}" data-emoji="${x}">${x}</button>`).join('');
  $('#times').innerHTML = e.times.map((t, i) => `<div class="time-row"><input type="time" value="${t}" data-time="${i}" required>${e.times.length > 1 ? `<button type="button" data-rmtime="${i}" aria-label="Remove time">×</button>` : ''}</div>`).join('');
  $('#days').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<button type="button" data-day="${d}" class="${e.days.includes(d) ? 'on' : ''}">${'SMTWTFS'[d]}</button>`).join('');
  $('#nag').innerHTML = [5, 10, 15, 30, 60].map(n => `<button type="button" data-nag="${n}" class="${e.nag === n ? 'on' : ''}">${n === 60 ? '1 hr' : n + ' min'}</button>`).join('');
}
function closeEditor() { $('#sheet').hidden = true; editing = null; }

async function saveEditor(ev) {
  ev.preventDefault();
  const f = $('#taskForm'), e = editing;
  const times = [...new Set(e.times.filter(Boolean))].sort();
  if (!times.length) return toast('Add at least one time ⏰');
  if (!e.days.length) return toast('Pick at least one day 📅');
  const now = new Date(), stamp = `${ymd(now)}T${hm(now)}`;
  const o = e.orig;
  const scheduleChanged = !o.id || o.times.join() !== times.join() || (o.days?.length ? o.days : ALL_DAYS).join() !== [...e.days].sort().join();
  const task = {
    id: o.id || uid(10), created: o.created || Date.now(),
    name: f.name.value.trim(), note: f.note.value.trim(), emoji: e.emoji, times, days: e.days.length === 7 ? [] : e.days, nag: e.nag,
    since: scheduleChanged ? stamp : o.since, paused: false,
  };
  await DB.put('tasks', task);
  tasks = tasks.filter(t => t.id !== task.id).concat(task).sort((a, b) => a.created - b.created);
  closeEditor(); render(); sync();
  toast(o.id ? 'Saved ✨' : `${task.emoji} Added. I’ll remind you!`);
  if (!o.id && !pushOn && pushSupported && !(isIOS && !standalone) && Notification.permission === 'default') setTimeout(enableNotifications, 600);
}
async function deleteEditing() {
  const id = editing?.id;
  if (!id || !confirm('Delete this reminder? Its history will be kept.')) return;
  await DB.del('tasks', id);
  tasks = tasks.filter(t => t.id !== id);
  closeEditor(); render(); sync();
  toast('Deleted');
}

// ---------- little delights ----------
let toastTimer;
function toast(msg, undo) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button>Undo</button>' : ''}`;
  if (undo) el.querySelector('button').onclick = () => { el.classList.remove('show'); undo(); };
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), undo ? 4500 : 2800);
}

const cv = $('#confetti'), cx = cv.getContext('2d');
let parts = [], raf = 0;
function confetti(x, y, n = 60) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#C4686E', '#EFC4BE', '#A9BCA4', '#C8A26A', '#F6D3CD', '#FFFFFF'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 6;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: 4 + Math.random() * 5, c: colors[i % colors.length], heart: Math.random() < .45, life: 1, spin: Math.random() * 6 });
  }
  if (!raf) raf = requestAnimationFrame(step);
}
function step() {
  const dpr = devicePixelRatio || 1;
  if (cv.width !== innerWidth * dpr) { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter(p => p.life > 0);
  for (const p of parts) {
    p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.life -= .012; p.spin += .1;
    cx.globalAlpha = Math.max(0, p.life);
    cx.fillStyle = p.c;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(Math.sin(p.spin) * .6);
    if (p.heart) {
      const s = p.r / 4;
      cx.beginPath(); cx.moveTo(0, 2 * s);
      cx.bezierCurveTo(-6 * s, -2 * s, -3 * s, -7 * s, 0, -3.5 * s);
      cx.bezierCurveTo(3 * s, -7 * s, 6 * s, -2 * s, 0, 2 * s);
      cx.fill();
    } else { cx.beginPath(); cx.arc(0, 0, p.r / 2, 0, Math.PI * 2); cx.fill(); }
    cx.restore();
  }
  raf = parts.length ? requestAnimationFrame(step) : 0;
  if (!raf) cx.clearRect(0, 0, innerWidth, innerHeight);
}

// ---------- navigation & events ----------
function showTab(name) {
  tab = name;
  for (const v of ['today', 'tasks', 'me']) $(`#view-${v}`).hidden = v !== name;
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  $('#fab').hidden = name === 'me';
  scrollTo({ top: 0 });
}

function flashSlot(key) {
  showTab('today');
  const el = document.querySelector(`.slot[data-key="${CSS.escape(key)}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
}

document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-guide]')) return showGuide();
  if (t.closest('#guide')) return $('#guide').remove();
  if (t.closest('[data-copy]')) { navigator.clipboard?.writeText(`https://${location.host}/`).then(() => toast('Link copied 📋'), () => toast(`https://${location.host}/`)); return; }
  if (t.closest('#tabs button')) return showTab(t.closest('button').dataset.tab);
  if (t.closest('[data-add]')) return openEditor();
  if (t.closest('[data-enable]')) return enableNotifications();
  if (t.closest('[data-close]')) return closeEditor();
  if (t.closest('.bump.setup')) { showTab('me'); setTimeout(() => $('#meForm').due.focus(), 200); return; }
  const slot = t.closest('.slot');
  if (slot && t.closest('.check')) {
    const key = slot.dataset.key;
    return done.has(key) ? undoDone(key) : markDone(key, t.closest('.check'));
  }
  const task = t.closest('.task');
  if (task) return openEditor(tasks.find(x => x.id === task.dataset.id));
  const q = t.closest('[data-preset]');
  if (q) return openEditor({ ...PRESETS[q.dataset.preset], id: undefined });
  if (!editing) return;
  const em = t.closest('[data-emoji]');
  if (em) { editing.emoji = em.dataset.emoji; return drawEditor(); }
  const day = t.closest('[data-day]');
  if (day) { const d = Number(day.dataset.day); editing.days = editing.days.includes(d) ? editing.days.filter(x => x !== d) : [...editing.days, d].sort(); return drawEditor(); }
  const nag = t.closest('[data-nag]');
  if (nag) { editing.nag = Number(nag.dataset.nag); return drawEditor(); }
  const rm = t.closest('[data-rmtime]');
  if (rm) { editing.times.splice(Number(rm.dataset.rmtime), 1); return drawEditor(); }
});
$('#addTime').onclick = () => { const last = editing.times.at(-1) || '08:00'; const h = (Number(last.slice(0, 2)) + 4) % 24; editing.times.push(`${pad(h)}:${last.slice(3)}`); drawEditor(); };
$('#times').addEventListener('input', e => { if (e.target.dataset.time != null) editing.times[Number(e.target.dataset.time)] = e.target.value; });
$('#taskForm').addEventListener('submit', saveEditor);
$('#deleteTask').onclick = deleteEditing;
$('#quickAdd').innerHTML = PRESETS.map((p, i) => `<button data-preset="${i}">${p.emoji} ${esc(p.name)}</button>`).join('');

$('#meForm').addEventListener('input', async e => {
  const { name, value } = e.target;
  if (name === 'name') { settings.name = value.trim(); await DB.setMeta('name', settings.name); }
  if (name === 'due') { settings.due = value; await DB.setMeta('due', value); }
  renderToday();
});
$('#meForm').addEventListener('submit', e => e.preventDefault());
$('#enableNotify').onclick = enableNotifications;
$('#testNotify').onclick = async () => {
  await doSync();
  const r = await fetch(`/api/device/${deviceId}/test`, { method: 'POST' }).catch(() => null);
  toast(r?.ok ? 'Test sent. Check your notifications 💌' : 'Couldn’t send a test. Try turning reminders on again.');
  if (!r?.ok) { pushOn = false; await DB.setMeta('push', false); render(); }
};
$('#eraseAll').onclick = async () => {
  if (!confirm('Erase all reminders, history and settings from this phone?')) return;
  if (pushOn) await fetch(`/api/device/${deviceId}`, { method: 'DELETE' }).catch(() => {});
  try { const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription(); await sub?.unsubscribe(); } catch {}
  for (const s of ['tasks', 'done', 'meta']) await DB.clear(s);
  location.reload();
};

let installPrompt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; renderMe(); });
document.addEventListener('click', async e => { if (e.target.id === 'installBtn' && installPrompt) { installPrompt.prompt(); installPrompt = null; renderMe(); } });

// Refresh when coming back to the app, and every 30s while open.
document.addEventListener('visibilitychange', async () => { if (!document.hidden) { await load(); render(); sync(); } });
setInterval(() => {
  if (document.hidden) return;
  renderToday();
  // in-app nudge when something becomes due while the app is open
  const nowHM = hm(new Date());
  for (const s of slotsFor(ymd(new Date()))) {
    if (!s.done && s.time === nowHM && !alerted.has(s.key)) { alerted.add(s.key); toast(`${s.task.emoji} Time for ${s.task.name}`); navigator.vibrate?.([120, 60, 120]); }
  }
}, 30000);

// ---------- boot ----------
(async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(e => console.warn('sw', e));
    navigator.serviceWorker.addEventListener('message', async e => {
      if (e.data?.type === 'changed') { await load(); render(); }
      if (e.data?.type === 'open' && e.data.key) flashSlot(e.data.key);
      if (e.data?.type === 'push') renderToday();
    });
  }
  await load();
  render();
  showTab('today');
  const slot = new URLSearchParams(location.search).get('slot');
  if (slot) { history.replaceState(null, '', '/'); setTimeout(() => flashSlot(slot), 300); }
  // keep the subscription alive and the server's copy of the schedule fresh
  if (pushSupported && Notification.permission === 'granted' && (await DB.meta('push'))) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (!(await reg.pushManager.getSubscription())) {
        const { publicKey } = await (await fetch('/api/vapid')).json();
        await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(publicKey) });
      }
    } catch (e) { console.warn('resubscribe', e); }
    doSync();
  }
})();
