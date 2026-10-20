// ZTD Office control panel (Design E). Hash routes; data from /api/panel/*.
//   staff:  #/  #/clients  #/clients/:id  #/domains  #/activity  #/plans  #/settings  #/as/:id/<page>
//   client: #/  #/inboxes  #/groups  #/domain  #/plan
//   public: #/login  #/invite/:token

/* ================================================================ basics */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const gbp = n => '£' + (Math.round(n * 100) / 100).toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const fmtBytes = b => b >= 1024 ** 3 ? `${(b / 1024 ** 3).toFixed(b >= 10 * 1024 ** 3 ? 0 : 1)} GB` : b >= 1024 ** 2 ? `${Math.round(b / 1024 ** 2)} MB` : b >= 1024 ? `${Math.round(b / 1024)} KB` : `${b} B`;
const gbOf = b => Math.round((b / 1024 ** 3) * 10) / 10;
const COLORS = ['#7c3aed', '#0f766e', '#b45309', '#be185d', '#2563eb', '#4d7c0f', '#9f1239', '#0e7490', '#6d28d9', '#c2410c'];
const color = s => COLORS[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const initials = n => String(n).split(/[\s@.]+/).filter(w => /[A-Za-z0-9]/.test(w[0] || '')).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
const avatar = (name, cls = '') => `<span class="avatar ${cls}" style="background:${color(name)}">${esc(initials(name))}</span>`;
const firstName = n => String(n || '').split(/\s+/)[0];

function ago(iso) {
  if (!iso) return '—';
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
const dateTime = iso => iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) : '—';

async function api(method, path, body) {
  const res = await fetch('/api/panel' + path, {
    method, credentials: 'same-origin',
    headers: { 'X-Requested-With': 'fetch', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not json */ }
  if (!res.ok) throw { status: res.status, message: data?.error || `Something went wrong (${res.status})` };
  return data;
}
const GET = p => api('GET', p), POST = (p, b = {}) => api('POST', p, b), PATCH = (p, b = {}) => api('PATCH', p, b), DEL = (p, b = {}) => api('DELETE', p, b);

/* ================================================================ icons */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  play: '<path d="m6 3 14 9-14 9z"/>',
  trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
  video: '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  chevd: '<path d="m6 9 6 6 6-6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pound: '<path d="M18 7c0-5.33-8-5.33-8 0v12M6 13h8M6 19h12"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8M21 3v5h-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};
const icon = n => `<svg class="i" viewBox="0 0 24 24">${ICONS[n] || ''}</svg>`;

/* ================================================================ ui kit */
// Inline handlers: on(fn) registers a closure and returns an onclick string.
let acts = [];
window.__a = (i, ev) => acts[i]?.(ev);
const on = fn => { acts.push(fn); return `__a(${acts.length - 1}, event)`; };

function toast(msg, kind = 'ok') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = (kind === 'err' ? `<span style="color:var(--red-pill-tx)">${icon('alert')}</span>` : icon('check')) + `<span>${esc(msg)}</span>`;
  $('#toasts').append(el);
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, kind === 'err' ? 5000 : 3200);
}
const fail = e => toast(e?.message || 'Something went wrong', 'err');

function modal(html, { wide } = {}) {
  closeModal();
  const s = document.createElement('div');
  s.className = 'scrim'; s.id = 'scrim';
  s.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div>`;
  s.addEventListener('mousedown', e => { if (e.target === s) closeModal(); });
  document.body.append(s);
  s.querySelector('input:not([type=checkbox]):not([type=radio]):not([readonly]), select, textarea')?.focus();
  return s;
}
function closeModal() { $('#scrim')?.remove(); }
const modalHead = (t, p) => `<div class="modal-h"><div><h3>${t}</h3>${p ? `<p>${p}</p>` : ''}</div><button class="icon-btn" onclick="${on(closeModal)}" aria-label="Close">${icon('x')}</button></div>`;

// Busy state for a submit button while a request runs.
async function busy(btn, fn) {
  const label = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = `<span class="spin" style="width:14px;height:14px"></span>`;
  try { return await fn(); } finally { if (btn.isConnected) { btn.disabled = false; btn.innerHTML = label; } }
}

function menu(anchor, items) {
  closeMenu();
  const m = document.createElement('div');
  m.className = 'menu'; m.id = 'menu';
  m.innerHTML = items.map((it, i) => it === '-' ? '<hr>' : `<button data-i="${i}" class="${it.danger ? 'danger' : ''}">${icon(it.icon)}${esc(it.label)}</button>`).join('');
  document.body.append(m);
  const r = anchor.getBoundingClientRect();
  m.style.top = Math.min(r.bottom + 6, innerHeight - m.offsetHeight - 10) + 'px';
  m.style.left = Math.max(10, r.right - m.offsetWidth) + 'px';
  m.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; closeMenu(); items[+b.dataset.i].run(); });
  setTimeout(() => document.addEventListener('mousedown', function out(e) { if (!m.contains(e.target)) { closeMenu(); document.removeEventListener('mousedown', out); } }), 0);
}
function closeMenu() { $('#menu')?.remove(); }

async function copy(text, what = 'Copied') {
  try { await navigator.clipboard.writeText(text); toast(what); }
  catch { prompt('Copy this:', text); }
}
const copyRow = (text, big) => `<div class="copyrow ${big ? 'big' : ''}"><code>${esc(text)}</code><button class="icon-btn" onclick="${on(() => copy(text))}" aria-label="Copy">${icon('copy')}</button></div>`;

const meterCls = (u, l) => u >= l ? 'full' : l && u / l >= 0.8 ? 'warn' : '';
const meter = (u, l, lg) => `<div class="meter ${lg ? 'lg' : ''} ${meterCls(u, l)}"><i style="width:${l ? Math.min(100, (u / l) * 100) : 0}%"></i></div>`;
const mini = (u, l) => `<div class="mini"><span class="t">${u} <span class="faint">of ${l}</span></span>${meter(u, l)}</div>`;
const planBadge = (id, name) => `<span class="badge ${esc(id)}">${esc(name || id)}</span>`;
function dnsBadge(dns) {
  if (!dns) return `<span class="badge"><span class="dot"></span>Not checked</span>`;
  return dns.verified ? `<span class="badge ok"><span class="dot"></span>Verified</span>` : `<span class="badge warn"><span class="dot"></span>${dns.missingRequired?.length ? `${dns.missingRequired.length} missing` : 'Pending'}</span>`;
}
const field = (label, inner, hint) => `<div class="field"><label>${label}</label>${inner}${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
const errLine = () => `<div class="errline" data-err></div>`;
const showErr = (root, e) => { const el = root.querySelector('[data-err]'); if (el) el.textContent = e?.message || 'Something went wrong'; else fail(e); };

/* ================================================================ state + router */
let me = null;          // {user, mailServer}
let renderSeq = 0;
const isStaff = () => me?.user.role === 'staff';

function parse() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'login') return { pub: 'login' };
  if (parts[0] === 'invite') return { pub: 'invite', token: parts[1] };
  if (parts[0] === 'as') return { area: 'client', clientId: parts[1], page: parts[2] || 'overview' };
  return { area: isStaff() ? 'staff' : 'client', page: parts[0] || 'overview', id: parts[1] };
}
const go = h => { if (location.hash === h) render(); else location.hash = h; };
window.addEventListener('hashchange', () => render());

async function boot() {
  try { me = await GET('/me'); } catch { me = null; }
  render();
}

async function render() {
  const seq = ++renderSeq;
  closeMenu(); closeModal(); closeCmdk();
  acts = [];
  document.body.classList.remove('nav-open');
  const r = parse();
  if (r.pub === 'invite') return inviteView(r.token);
  if (!me) { if (r.pub !== 'login') sessionStorage.setItem('ztd-after-login', location.hash); return loginView(); }
  if (r.pub === 'login') return go('#/');

  const clientId = r.area === 'client' ? (r.clientId || me.user.clientId) : null;
  const base = r.clientId ? `#/as/${r.clientId}/` : '#/';
  $('#root').innerHTML = shell(r.area === 'staff' ? staffSide(r.page) : `<div id="cside">${clientSideSkeleton()}</div>`, `<div class="loading"><span class="spin"></span></div>`);
  try {
    let html;
    if (r.area === 'staff') {
      html = await ({ overview: staffOverview, clients: () => r.id ? staffClient(r.id) : staffClients(), domains: staffDomains, activity: staffActivity, plans: staffPlans, settings: staffSettings }[r.page] || staffOverview)();
    } else {
      const c = await GET(`/clients/${clientId}`);
      if (seq !== renderSeq) return;
      $('#cside').innerHTML = clientSide(c, r.page, base);
      html = await ({ overview: clientOverview, inboxes: clientInboxes, groups: clientGroups, domain: clientDomain, plan: clientPlan }[r.page] || clientOverview)(c, base);
    }
    if (seq !== renderSeq) return;
    $('#view').innerHTML = `<div class="view">${html}</div>`;
  } catch (e) {
    if (seq !== renderSeq) return;
    if (e.status === 401) { me = null; return render(); }
    $('#view').innerHTML = `<div class="view"><div class="banner warn"><span class="ic warn">${icon('alert')}</span><div class="grow"><b>Couldn't load this page.</b> <span class="muted">${esc(e.message)}</span></div><button class="btn sm" onclick="${on(() => render())}">${icon('refresh')}Try again</button></div></div>`;
  }
}
const refresh = () => render();

function shell(side, view) {
  return `<div class="mobile-top"><button class="icon-btn" onclick="document.body.classList.toggle('nav-open')" aria-label="Menu">${icon('menu')}</button><span class="wsa" style="background:linear-gradient(145deg,var(--ws-a),var(--ws-b))">Z</span><b>ZTD Office</b></div>
    <div class="app"><aside id="side">${side}</aside><main id="view">${view}</main></div>
    <button class="askbar" onclick="${on(openCmdk)}">${icon('spark')}<span class="lbl2">Ask anything</span> <kbd style="margin-left:4px">⌘K</kbd></button>`;
}

/* ================================================================ sidebars */
const navLink = (href, ic, label, on_, count) => `<a href="${href}" class="${on_ ? 'on' : ''}">${icon(ic)}${label}${count != null ? `<span class="count">${count}</span>` : ''}</a>`;
const wsHead = () => `<div class="ws"><span class="wsa">Z</span><div style="min-width:0"><div class="t">ZTD Office</div></div></div>`;
function sideFoot() {
  const dark = document.documentElement.classList.contains('dark');
  return `<div class="side-foot">${avatar(me.user.name)}<div class="who2"><div class="n">${esc(me.user.name)}</div><div class="d">${esc(me.user.email)}</div></div>
    <span class="sp"><span class="ib" title="Light / dark" onclick="${on(toggleTheme)}">${icon(dark ? 'sun' : 'moon')}</span><span class="ib" title="Sign out" onclick="${on(logout)}">${icon('logout')}</span></span></div>`;
}
function staffSide(p) {
  return `${wsHead()}<nav>
    ${navLink('#/', 'home', 'Overview', p === 'overview')}
    ${navLink('#/clients', 'users', 'Clients', p === 'clients')}
    ${navLink('#/domains', 'globe', 'Domains', p === 'domains')}
    ${navLink('#/activity', 'activity', 'Activity', p === 'activity')}
    ${navLink('#/plans', 'layers', 'Plans', p === 'plans')}
    ${navLink('#/settings', 'gear', 'Settings', p === 'settings')}
    <div class="nav-label">Services</div>
    <a href="https://mail.ztdoffice.com" target="_blank" rel="noopener">${icon('mail')}Webmail<span class="count">${icon('ext')}</span></a>
    <a href="https://mx1.ztdoffice.com/admin" target="_blank" rel="noopener">${icon('shield')}Mail server<span class="count">${icon('ext')}</span></a>
  </nav>${sideFoot()}`;
}
const clientSideSkeleton = () => `${wsHead()}<div class="sk" style="height:46px;margin:2px 0 10px"></div>`;
function clientSide(c, p, base) {
  const back = isStaff() ? `<a href="#/clients/${esc(c.id)}" class="btn sm ghost" style="justify-content:flex-start;margin-bottom:8px;width:100%">${icon('back')} Back to staff view</a>` : '';
  return `${wsHead()}${back}<div class="tenant">${avatar(c.name, 'sq')}<div style="min-width:0"><div class="n">${esc(c.name)}</div><div class="d">${esc(c.domains[0]?.name || '')}</div></div></div>
    <nav>
      ${navLink(base, 'home', 'Overview', p === 'overview')}
      ${navLink(base + 'inboxes', 'inbox', 'Inboxes', p === 'inboxes', `${c.usage.inboxes}/${c.limits.inboxes}`)}
      ${navLink(base + 'groups', 'at', 'Groups & aliases', p === 'groups', `${c.usage.aliases}/${c.limits.aliases}`)}
      ${navLink(base + 'domain', 'globe', 'Domain', p === 'domain')}
      ${navLink(base + 'plan', 'card', 'Plan', p === 'plan')}
      <div class="nav-label">Apps</div>
      <a href="https://mail.ztdoffice.com" target="_blank" rel="noopener">${icon('mail')}Open webmail<span class="count">${icon('ext')}</span></a>
    </nav>${isStaff() ? '' : sideFoot()}`;
}

function toggleTheme() {
  const dark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', dark);
  try { localStorage.setItem('ztd-panel-theme', dark ? 'dark' : 'light'); } catch { /* private mode */ }
  document.querySelectorAll('.side-foot [title="Light / dark"]').forEach(el => { el.innerHTML = icon(dark ? 'sun' : 'moon'); });
}
async function logout() { try { await POST('/logout'); } catch { /* ignore */ } me = null; location.hash = '#/login'; render(); }

/* ================================================================ public: sign in, invite */
function authPage(inner) {
  $('#root').innerHTML = `<div class="auth-wrap"><div class="auth"><div class="ws"><span class="wsa">Z</span><div><div class="t">ZTD Office</div></div></div>${inner}</div></div>`;
}
function loginView() {
  authPage(`<h1>Sign in</h1><div class="sub">Manage your business email.</div>
    <form class="card form" id="lf">
      ${field('Email', '<input class="input" name="email" type="email" autocomplete="username" required>')}
      ${field('Password', '<input class="input" name="password" type="password" autocomplete="current-password" required>')}
      ${errLine()}
      <button class="btn primary" type="submit">Sign in</button>
    </form>
    <p class="faint small" style="margin-top:14px">Forgotten your password? Ask ZTD Office for a new sign-in link.</p>`);
  const f = $('#lf');
  f.email.focus();
  f.onsubmit = async e => {
    e.preventDefault();
    const btn = f.querySelector('button');
    try {
      await busy(btn, () => POST('/login', { email: f.email.value, password: f.password.value }));
      me = await GET('/me');
      const next = sessionStorage.getItem('ztd-after-login'); sessionStorage.removeItem('ztd-after-login');
      location.hash = next && !next.includes('login') ? next : '#/';
      render();
    } catch (err) { showErr(f, err); }
  };
}
async function inviteView(token) {
  authPage(`<div class="loading"><span class="spin"></span></div>`);
  let info;
  try { info = await GET(`/invite/${encodeURIComponent(token)}`); }
  catch (e) { return authPage(`<h1>Link expired</h1><div class="sub">${esc(e.message)}</div><a class="btn" style="margin-top:18px" href="#/login">Go to sign in</a>`); }
  authPage(`<h1>Welcome, ${esc(firstName(info.name))}</h1><div class="sub">Choose a password for <b>${esc(info.email)}</b>.</div>
    <form class="card form" id="if">
      ${field('Password', '<input class="input" name="pw" type="password" autocomplete="new-password" minlength="10" required>', 'At least 10 characters.')}
      ${field('Repeat password', '<input class="input" name="pw2" type="password" autocomplete="new-password" required>')}
      ${errLine()}
      <button class="btn primary" type="submit">Set password and continue</button>
    </form>`);
  const f = $('#if');
  f.onsubmit = async e => {
    e.preventDefault();
    if (f.pw.value !== f.pw2.value) return showErr(f, { message: "The passwords don't match" });
    try {
      await busy(f.querySelector('button'), () => POST(`/invite/${encodeURIComponent(token)}`, { password: f.pw.value }));
      me = await GET('/me');
      location.hash = '#/'; render();
    } catch (err) { showErr(f, err); }
  };
}

/* ================================================================ staff: overview */
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }

async function staffOverview() {
  const o = await GET('/overview');
  const plans = ['lite', 'premium', 'business'];
  const totalUsed = o.storage.reduce((a, s) => a + s.usedBytes, 0);
  const maxUsed = Math.max(1, ...o.storage.map(s => s.usedBytes));
  const levelIcon = { bad: 'key', warn: 'alert', brand: 'spark' };
  return `
    <div class="head"><div><h1>${greeting()}, ${esc(firstName(me.user.name))}</h1><div class="sub">Here's how ZTD Office is doing today.</div></div>
      <div class="actions"><button class="btn primary" onclick="${on(newClient)}">${icon('plus')}New client</button></div></div>
    <div class="grid g4" style="margin-bottom:16px">
      <div class="card card-b stat"><div class="k">${icon('pound')}Monthly revenue</div><div class="v">${gbp(o.mrr)}</div><div class="f">${gbp(o.mrr * 12)} a year</div></div>
      <div class="card card-b stat"><div class="k">${icon('users')}Clients</div><div class="v">${o.clients.total}</div><div class="f">${plans.map(p => `${o.clients.byPlan[p]} ${p[0].toUpperCase() + p.slice(1)}`).join(' · ')}</div></div>
      <div class="card card-b stat"><div class="k">${icon('key')}Licence seats</div><div class="v">${o.seats.used}<small> / ${o.seats.total}</small></div><div style="margin-top:12px">${meter(o.seats.used, o.seats.total)}</div></div>
      <div class="card card-b stat"><div class="k">${icon('globe')}Domains verified</div><div class="v">${o.domains.verified}<small> / ${o.domains.total}</small></div><div class="f">Mail, DKIM, DMARC and relay records</div></div>
    </div>
    <div class="card card-b" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
        <div><div class="eyebrow">Storage used</div><div style="font-size:26px;font-weight:600;letter-spacing:-.03em;margin-top:7px" class="num">${fmtBytes(totalUsed)}<span class="faint" style="font-size:13.5px;font-weight:450;letter-spacing:0"> &middot; across ${o.storage.length} account${o.storage.length === 1 ? '' : 's'}</span></div></div>
        <a class="dd" href="#/clients">All clients ${icon('chev')}</a>
      </div>
      <div class="chart-legend">${o.storage.map(s => `
        <a class="lr" href="#/clients/${esc(s.id)}" style="display:grid;grid-template-columns:minmax(120px,220px) 1fr auto;gap:16px">
          <span class="nm" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.name)}</span>
          <span class="meter" style="height:6px;align-self:center"><i style="width:${Math.max(1, s.usedBytes / maxUsed * 100)}%"></i></span>
          <span class="pct">${fmtBytes(s.usedBytes)} <span class="faint">of ${fmtBytes(s.quotaBytes)}</span></span></a>`).join('') || '<div class="empty">No mailboxes yet.</div>'}</div>
    </div>
    <div class="grid g2">
      <div class="stack">
        <div class="card"><div class="card-h"><div><h2>Needs attention</h2><div class="sub muted">Things that cost money or mail if ignored</div></div></div>
          <div class="list" style="margin-top:10px">${o.attention.length ? o.attention.map(a => `
            <${a.clientId ? `a href="#/clients/${esc(a.clientId)}"` : 'div'} class="li"><span class="ic ${a.level}">${icon(levelIcon[a.level] || 'alert')}</span><div class="grow"><div class="n">${esc(a.title)}</div><div class="d">${esc(a.detail)}</div></div>${a.clientId ? `<span class="faint">${icon('chev')}</span>` : ''}</${a.clientId ? 'a' : 'div'}>`).join('')
            : `<div class="empty">${icon('check')} All clear</div>`}</div></div>
        <div class="card"><div class="card-h"><h2>Clients</h2><a class="btn sm ghost" href="#/clients">View all ${icon('arrow')}</a></div>
          <div class="table-wrap" style="margin-top:12px">${clientTable(o.clientsList.filter(c => !c.internal), true)}</div></div>
      </div>
      <div class="stack">
        <div class="card card-b"><h2>Mail licence</h2><div class="sub muted small">Stalwart Enterprise · ztdoffice.com</div>
          <div class="usage" style="margin-top:16px"><div class="row"><span class="muted">Mailboxes</span><b>${o.seats.used} of ${o.seats.total}</b></div>${meter(o.seats.used, o.seats.total, true)}</div>
          <dl class="kv" style="margin-top:16px"><dt>Renews</dt><dd>${new Date(o.seats.renews).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</dd><dt>Groups & aliases</dt><dd>Free, not counted</dd></dl></div>
        <div class="card"><div class="card-h"><h2>Recent activity</h2><a class="btn sm ghost" href="#/activity">All ${icon('arrow')}</a></div>
          <div class="list" style="margin-top:8px">${o.activity.length ? o.activity.map(activityRow).join('') : '<div class="empty">Nothing yet.</div>'}</div></div>
      </div>
    </div>`;
}

const ACTION_ICON = { 'inbox-created': 'inbox', 'inbox-deleted': 'trash', 'inbox-suspended': 'pause', 'inbox-resumed': 'play', 'password-reset': 'key', 'group-created': 'users', 'group-updated': 'users', 'group-deleted': 'trash', 'alias-created': 'at', 'alias-deleted': 'trash', 'client-created': 'plus', 'plan-changed': 'card', 'client-suspended': 'pause', 'client-resumed': 'play', 'domain-added': 'globe', 'admin-invited': 'mail', 'staff-invited': 'mail', request: 'spark', 'request-done': 'check', 'signed-up': 'check', 'inbox-renamed': 'edit' };
const ACTION_TEXT = { 'inbox-created': 'Inbox created', 'inbox-deleted': 'Inbox deleted', 'inbox-suspended': 'Inbox suspended', 'inbox-resumed': 'Inbox resumed', 'password-reset': 'Password reset', 'group-created': 'Group created', 'group-updated': 'Group members changed', 'group-deleted': 'Group deleted', 'alias-created': 'Alias created', 'alias-deleted': 'Alias deleted', 'client-created': 'Client added', 'plan-changed': 'Plan changed', 'client-suspended': 'Account suspended', 'client-resumed': 'Account resumed', 'domain-added': 'Domain added', 'admin-invited': 'Admin invited', 'staff-invited': 'Staff invited', request: 'Change requested', 'request-done': 'Request done', 'signed-up': 'Signed in for the first time', 'inbox-renamed': 'Inbox renamed' };
const activityRow = a => `<div class="li"><span class="tile" style="width:32px;height:32px">${icon(ACTION_ICON[a.action] || 'activity')}</span><div class="grow"><div style="font-size:13.5px">${esc(ACTION_TEXT[a.action] || a.action)}${a.client ? ` · <span class="muted">${esc(a.client)}</span>` : ''}</div><div class="d">${esc(a.detail)} · ${esc(a.actor)} · ${ago(a.at)}</div></div></div>`;

function clientTable(list, compact) {
  if (!list.length) return `<div class="empty">No clients yet. Add your first with “New client”.</div>`;
  const wide = compact ? 'hidden-col' : 'hide-sm';
  return `<table><thead><tr><th>Client</th><th>Plan</th><th class="hide-sm">Inboxes</th><th class="${wide}">Groups & aliases</th><th class="${wide}">Domain</th><th class="r">Price</th></tr></thead><tbody>
    ${list.map(c => `<tr class="click ${c.status === 'suspended' ? 'suspended' : ''}" onclick="${on(() => go(`#/clients/${c.id}`))}">
      <td><div class="who">${avatar(c.name, 'sq')}<div style="min-width:0"><div class="n">${esc(c.name)}</div><div class="d">${esc(c.domains[0]?.name || 'no domain')}</div></div></div></td>
      <td>${planBadge(c.plan, c.planName)}${c.status === 'suspended' ? ' <span class="badge bad">Suspended</span>' : ''}${c.openRequests ? ' <span class="badge premium">Request</span>' : ''}</td>
      <td class="hide-sm">${mini(c.usage.inboxes, c.limits.inboxes)}</td>
      <td class="${wide}">${mini(c.usage.aliases, c.limits.aliases)}</td>
      <td class="${wide}">${dnsBadge(c.domains[0]?.dns)}</td>
      <td class="r num"><b>${gbp(c.monthly)}</b><span class="faint">/mo</span>${c.customPrice != null ? '<span class="tag">CUSTOM</span>' : ''}</td></tr>`).join('')}
  </tbody></table>`;
}

/* ================================================================ staff: clients */
let clientFilter = 'all', clientQuery = '';
async function staffClients() {
  const { clients } = await GET('/clients');
  const draw = () => {
    const list = clients.filter(c => !c.internal)
      .filter(c => clientFilter === 'all' || c.plan === clientFilter)
      .filter(c => !clientQuery || `${c.name} ${c.contactName} ${c.contactEmail} ${c.domains.map(d => d.name).join(' ')}`.toLowerCase().includes(clientQuery.toLowerCase()));
    $('#ctable').innerHTML = clientTable(list);
  };
  setTimeout(() => {
    const q = $('#cq'); if (!q) return;
    q.oninput = () => { clientQuery = q.value; draw(); };
    document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { clientFilter = b.dataset.f; document.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
    draw();
  });
  const internal = clients.find(c => c.internal);
  return `
    <div class="head"><div><h1>Clients</h1><div class="sub">Every business you host, their plan and what they've used.</div></div>
      <div class="actions"><button class="btn primary" onclick="${on(newClient)}">${icon('plus')}New client</button></div></div>
    <div class="card">
      <div class="toolbar">
        <div class="search">${icon('search')}<input class="input" id="cq" placeholder="Search clients, domains, contacts" value="${esc(clientQuery)}"></div>
        <div class="chips">${['all', 'lite', 'premium', 'business'].map(f => `<button class="chip ${clientFilter === f ? 'on' : ''}" data-f="${f}">${f === 'all' ? 'All plans' : f[0].toUpperCase() + f.slice(1)}</button>`).join('')}</div>
      </div>
      <div class="table-wrap" id="ctable"></div>
    </div>
    ${internal ? `<p class="faint small" style="margin-top:14px">Your own mailboxes are under <a class="tablink" href="#/clients/${esc(internal.id)}">${esc(internal.name)}</a>.</p>` : ''}`;
}

async function staffClient(id) {
  const c = await GET(`/clients/${id}`);
  const l = c.limits;
  const planForm = `
    <div class="card"><div class="card-h"><div><h2>Plan & price</h2><div class="sub muted">Only ZTD staff can change this</div></div></div>
      <form class="card-b form" id="pf">
        ${field('Plan', `<select class="input" name="plan">${c.plans.map(p => `<option value="${p.id}" ${p.id === c.plan ? 'selected' : ''}>${esc(p.name)} — ${gbp(p.price)}/mo · ${p.inboxes} inboxes · ${p.aliases} groups</option>`).join('')}</select>`)}
        <div class="two">
          ${field('Extra inboxes', `<input class="input" name="extraInboxes" type="number" min="0" max="100" value="${c.extraInboxes}">`, `+${gbp(c.addons.inbox.price)} each`)}
          ${field('Extra groups & aliases', `<input class="input" name="extraAliases" type="number" min="0" max="500" value="${c.extraAliases}">`, `+${gbp(c.addons.aliases.price)} per 5`)}
        </div>
        ${field('Monthly price', `<div class="addon pre"><span>£</span><input class="input" name="customPrice" inputmode="decimal" placeholder="${c.listPrice}" value="${c.customPrice ?? ''}"></div>`, `Leave empty to charge the list price (${gbp(c.listPrice)}).`)}
        ${errLine()}
        <button class="btn primary" type="submit">Save changes</button>
      </form></div>`;
  setTimeout(() => {
    const f = $('#pf'); if (!f) return;
    f.onsubmit = async e => {
      e.preventDefault();
      try {
        await busy(f.querySelector('button'), () => PATCH(`/clients/${c.id}`, { plan: f.plan.value, extraInboxes: f.extraInboxes.value, extraAliases: f.extraAliases.value, customPrice: f.customPrice.value.trim() }));
        toast('Plan saved'); refresh();
      } catch (err) { showErr(f, err); }
    };
  });
  const more = el => menu(el, [
    { icon: 'globe', label: 'Add a domain', run: () => addDomain(c) },
    { icon: 'mail', label: 'Invite an administrator', run: () => inviteAdmin(c) },
    ...(c.internal ? [] : ['-', c.status === 'suspended'
      ? { icon: 'play', label: 'Resume account', run: () => suspendClient(c, false) }
      : { icon: 'pause', label: 'Suspend account', danger: true, run: () => suspendClient(c, true) }]),
  ]);
  return `
    <div class="crumbs"><a href="#/clients">Clients</a>${icon('chev')}<span>${esc(c.name)}</span></div>
    <div class="head">
      <div class="who">${avatar(c.name, 'lg')}<div><h1>${esc(c.name)}</h1><div class="sub">${planBadge(c.plan, c.planName)} &nbsp;${esc(c.domains.map(d => d.name).join(', ') || 'no domain')}${c.contactName ? ` · ${esc(c.contactName)}` : ''} · since ${ago(c.createdAt)}</div></div></div>
      <div class="actions"><a class="btn" href="#/as/${esc(c.id)}/">${icon('ext')}Open client view</a>
        <button class="btn iconbox" onclick="${on(ev => more(ev.currentTarget))}" aria-label="More">${icon('more')}</button></div>
    </div>
    ${c.status === 'suspended' ? `<div class="banner warn"><span class="ic warn">${icon('pause')}</span><div class="grow"><b>Account suspended.</b> <span class="muted">Mail is still received, but nobody can sign in to their inbox or this panel.</span></div><button class="btn sm" onclick="${on(() => suspendClient(c, false))}">Resume</button></div>` : ''}
    ${c.requests.map(r => `<div class="banner brand"><span class="ic brand">${icon('spark')}</span><div class="grow"><b>Request:</b> ${esc(r.detail)} <span class="muted">· ${ago(r.createdAt)}</span></div><button class="btn sm" onclick="${on(async () => { try { await POST(`/requests/${r.id}/resolve`); toast('Marked as done'); refresh(); } catch (e) { fail(e); } })}">Mark done</button></div>`).join('')}
    <div class="grid g4" style="margin-bottom:16px">
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">Inboxes</span><b>${c.usage.inboxes} / ${l.inboxes}</b></div>${meter(c.usage.inboxes, l.inboxes, true)}</div></div>
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">Groups & aliases</span><b>${c.usage.aliases} / ${l.aliases}</b></div>${meter(c.usage.aliases, l.aliases, true)}</div></div>
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">Storage</span><b>${fmtBytes(c.usage.usedBytes)}</b></div>${meter(c.usage.usedBytes, c.usage.quotaBytes || 1, true)}<span class="faint small">${l.storageGb} GB per inbox</span></div></div>
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">Price</span><b>${gbp(c.monthly)}/mo</b></div><span class="faint small">${c.customPrice != null ? `Custom · list price ${gbp(c.listPrice)}` : 'List price'}</span></div></div>
    </div>
    <div class="grid g2">
      <div class="stack">${inboxCard(c, `#/as/${c.id}/`)}${groupsCard(c, `#/as/${c.id}/`)}
        <div class="card"><div class="card-h"><h2>Activity</h2></div><div class="list" style="margin-top:8px">${c.activity.length ? c.activity.map(activityRow).join('') : '<div class="empty">Nothing yet.</div>'}</div></div>
      </div>
      <div class="stack">${planForm}
        <div class="card"><div class="card-h"><div><h2>Domains</h2><div class="sub muted">${c.domains.length} of ${l.domains} on this plan</div></div><button class="btn sm" onclick="${on(() => addDomain(c))}">${icon('plus')}Add</button></div>
          <div class="list" style="margin-top:10px">${c.domains.map(d => `<a class="li" href="#/as/${esc(c.id)}/domain"><span class="tile">${icon('globe')}</span><div class="grow"><div class="n">${esc(d.name)}</div><div class="d">${d.dns ? `Checked ${ago(d.dns.checkedAt)}` : 'Not checked yet'}</div></div>${dnsBadge(d.dns)}</a>`).join('') || '<div class="empty">No domain yet.</div>'}</div></div>
        <div class="card"><div class="card-h"><div><h2>Panel logins</h2><div class="sub muted">People who manage this account</div></div><button class="btn sm" onclick="${on(() => inviteAdmin(c))}">${icon('plus')}Invite</button></div>
          <div class="list" style="margin-top:10px">${c.admins.map(a => `<div class="li">${avatar(a.name)}<div class="grow"><div class="n">${esc(a.name)}</div><div class="d">${esc(a.email)} · ${a.hasPassword ? `last sign-in ${ago(a.lastLoginAt)}` : 'invite not accepted yet'}</div></div><button class="btn sm ghost" onclick="${on(() => newLink(a))}">New link</button></div>`).join('') || '<div class="empty">No logins yet.</div>'}</div></div>
      </div>
    </div>`;
}

async function suspendClient(c, suspended) {
  if (suspended) {
    const s = modal(`${modalHead(`Suspend ${esc(c.name)}?`, 'Every inbox stops signing in and their administrators are signed out. Mail is still received and kept. You can resume at any time.')}
      <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" style="background:var(--red-pill-tx);border-color:var(--red-pill-tx);color:#fff" id="go">Suspend</button></div>`);
    s.querySelector('#go').onclick = async ev => { try { await busy(ev.currentTarget, () => POST(`/clients/${c.id}/suspend`, { suspended: true })); closeModal(); toast(`${c.name} suspended`); refresh(); } catch (e) { fail(e); } };
  } else {
    try { await POST(`/clients/${c.id}/suspend`, { suspended: false }); toast(`${c.name} resumed`); refresh(); } catch (e) { fail(e); }
  }
}

function linkModal(title, intro, url) {
  modal(`${modalHead(title, intro)}<div class="modal-b form">${copyRow(url)}<span class="hint faint small">Send this link by email or message. It works once and expires in 7 days.</span></div>
    <div class="modal-f"><button class="btn primary" onclick="${on(() => { copy(url, 'Link copied'); })}">${icon('copy')}Copy link</button><button class="btn" onclick="${on(() => { closeModal(); refresh(); })}">Done</button></div>`);
}
async function newLink(a) {
  try { const r = await POST(`/users/${a.id}/invite`); linkModal(`New sign-in link for ${esc(a.name)}`, `${esc(a.email)} can use this to set a new password.`, r.invite); } catch (e) { fail(e); }
}

function newClient() {
  const s = modal(`${modalHead('New client', 'Adds their domain to the mail server and creates a login for their main contact.')}
    <form class="modal-b form" id="nc">
      ${field('Business name', '<input class="input" name="name" placeholder="Acme Ltd" required>')}
      <div class="two">${field('Contact name', '<input class="input" name="contactName" placeholder="Jane Smith">')}${field('Contact email', '<input class="input" name="contactEmail" type="email" placeholder="jane@acme.co.uk">', 'Gets a link to manage their inboxes.')}</div>
      ${field('Their domain', '<input class="input" name="domain" placeholder="acme.co.uk" required autocapitalize="off">')}
      ${field('Plan', `<div class="seg2" style="grid-template-columns:repeat(3,1fr)">${[['lite', 'Lite', 40, 3], ['premium', 'Premium', 70, 7], ['business', 'Business', 125, 15]].map(([id, n, p, i]) => `<button type="button" class="opt ${id === 'premium' ? 'on' : ''}" data-v="${id}"><b>${n}</b><span>${gbp(p)}/mo · ${i} inboxes</span></button>`).join('')}</div>`)}
      ${field('Custom monthly price <span class="faint" style="font-weight:400">(optional)</span>', '<div class="addon pre"><span>£</span><input class="input" name="customPrice" inputmode="decimal" placeholder="List price"></div>')}
      ${errLine()}
    </form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Create client</button></div>`, { wide: true });
  let plan = 'premium';
  s.querySelectorAll('.opt').forEach(o => o.onclick = () => { plan = o.dataset.v; s.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === o)); });
  const f = s.querySelector('#nc');
  const submit = async () => {
    try {
      const r = await busy(s.querySelector('#go'), () => POST('/clients', { name: f.name.value, contactName: f.contactName.value, contactEmail: f.contactEmail.value, domain: f.domain.value, plan, customPrice: f.customPrice.value.trim() }));
      location.hash = `#/clients/${r.id}`;
      if (r.invite) setTimeout(() => linkModal('Client created', `Send this to ${esc(f.contactEmail.value)} so they can set a password and add their inboxes. Next: ask them (or their web person) to add the DNS records on the Domain page.`, r.invite), 400);
      else { closeModal(); toast('Client created'); }
    } catch (e) { showErr(f, e); }
  };
  s.querySelector('#go').onclick = submit;
  f.onsubmit = e => { e.preventDefault(); submit(); };
}

function addDomain(c) {
  const s = modal(`${modalHead('Add a domain', `${esc(c.name)} can use ${c.limits.domains} domain${c.limits.domains > 1 ? 's' : ''} on ${esc(c.planName)}. It's added to the mail server straight away.`)}
    <form class="modal-b form" id="ad">${field('Domain', '<input class="input" name="domain" placeholder="acme.com" autocapitalize="off" required>')}${errLine()}</form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Add domain</button></div>`);
  const f = s.querySelector('#ad');
  const submit = async () => { try { await busy(s.querySelector('#go'), () => POST(`/clients/${c.id}/domains`, { domain: f.domain.value })); closeModal(); toast('Domain added'); refresh(); } catch (e) { showErr(f, e); } };
  s.querySelector('#go').onclick = submit; f.onsubmit = e => { e.preventDefault(); submit(); };
}

function inviteAdmin(c) {
  const s = modal(`${modalHead('Invite an administrator', `They'll be able to manage ${esc(c.name)}'s inboxes, groups and aliases.`)}
    <form class="modal-b form" id="ia"><div class="two">${field('Name', '<input class="input" name="name" placeholder="Jane Smith">')}${field('Email', '<input class="input" name="email" type="email" required>')}</div>${errLine()}</form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Create link</button></div>`);
  const f = s.querySelector('#ia');
  const submit = async () => { try { const r = await busy(s.querySelector('#go'), () => POST(`/clients/${c.id}/admins`, { name: f.name.value, email: f.email.value })); linkModal('Invite ready', `Send this to ${esc(f.email.value)}.`, r.invite); } catch (e) { showErr(f, e); } };
  s.querySelector('#go').onclick = submit; f.onsubmit = e => { e.preventDefault(); submit(); };
}

/* ================================================================ staff: domains, activity, plans, settings */
async function staffDomains() {
  const { domains, clients } = await GET('/domains');
  const assign = d => {
    const s = modal(`${modalHead(`Assign ${esc(d.name)}`, 'Pick the client this domain belongs to. Its inboxes will then count against their plan.')}
      <div class="modal-b form">${field('Client', `<select class="input" id="cl">${clients.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select>`)}${errLine()}</div>
      <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Assign</button></div>`);
    s.querySelector('#go').onclick = async ev => { try { await busy(ev.currentTarget, () => POST('/domains/assign', { domain: d.name, clientId: s.querySelector('#cl').value })); closeModal(); toast('Domain assigned'); refresh(); } catch (e) { showErr(s, e); } };
  };
  return `
    <div class="head"><div><h1>Domains</h1><div class="sub">Every domain on the mail server and whether its records are live.</div></div></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>Domain</th><th>Client</th><th class="hide-sm">Inboxes</th><th>Status</th><th class="r hide-sm">Added</th></tr></thead>
      <tbody>${domains.map(d => `<tr class="${d.clientId ? 'click' : ''}" ${d.clientId ? `onclick="${on(() => go(`#/as/${d.clientId}/domain`))}"` : ''}>
        <td><div class="who"><span class="tile">${icon('globe')}</span><div style="min-width:0"><div class="n">${esc(d.name)}</div><div class="d">${d.dns ? `checked ${ago(d.dns.checkedAt)}` : 'not checked yet'}</div></div></div></td>
        <td>${d.clientName ? esc(d.clientName) : `<button class="btn sm" onclick="${on(ev => { ev.stopPropagation(); assign(d); })}">Assign to a client</button>`}</td>
        <td class="hide-sm num">${d.inboxes}</td>
        <td>${dnsBadge(d.dns)}</td>
        <td class="r muted hide-sm">${ago(d.createdAt)}</td></tr>`).join('')}</tbody>
    </table></div></div>`;
}

async function staffActivity() {
  const { activity } = await GET('/activity');
  return `
    <div class="head"><div><h1>Activity</h1><div class="sub">Every change made in the panel, newest first.</div></div></div>
    <div class="card"><div class="table-wrap"><table><thead><tr><th>Event</th><th class="hide-sm">Client</th><th class="hide-sm">By</th><th class="r">When</th></tr></thead>
      <tbody>${activity.map(a => `<tr><td><div class="who"><span class="tile" style="width:32px;height:32px">${icon(ACTION_ICON[a.action] || 'activity')}</span><div style="min-width:0"><div class="n">${esc(ACTION_TEXT[a.action] || a.action)}</div><div class="d">${esc(a.detail)}</div></div></div></td>
        <td class="hide-sm muted">${a.clientId ? `<a class="tablink" href="#/clients/${esc(a.clientId)}">${esc(a.client || '')}</a>` : '—'}</td><td class="hide-sm muted">${esc(a.actor)}</td><td class="r muted" title="${esc(dateTime(a.at))}">${ago(a.at)}</td></tr>`).join('') || `<tr><td colspan="4"><div class="empty">Nothing yet.</div></td></tr>`}</tbody>
    </table></div></div>`;
}

function planFeatures(p) {
  return [
    [true, 'Website hosting & care'], [true, `<b>${p.inboxes}</b> email inboxes`], [true, `<b>${p.aliases}</b> groups & aliases`],
    [true, `<b>${p.storageGb} GB</b> per inbox`], [true, p.domains > 1 ? `<b>${p.domains}</b> domains` : '1 domain'],
    [true, 'Webmail, calendar & contacts'], [!!p.meetings, p.meetings || 'Online meetings (add-on)'],
    [p.sharedInboxes > 0, p.sharedInboxes ? `${p.sharedInboxes} shared inbox${p.sharedInboxes > 1 ? 'es' : ''}` : 'Shared inboxes'],
  ];
}
function planCard(p, { featured, current, action = '' }) {
  return `<div class="card plan ${featured && !current ? 'featured' : ''} ${current ? 'current' : ''}">
    ${featured && !current ? '<span class="flag">Most popular</span>' : ''}${current ? '<span class="flag" style="background:var(--primary);color:var(--primary-ink)">Current plan</span>' : ''}
    <div class="pn">${esc(p.name)}</div><div class="pb">${esc(p.blurb)}</div>
    <div class="pp"><b>${gbp(p.price)}</b><span>/ month</span></div>
    <div class="pa">or ${gbp(p.price * 10)} a year · email included</div>
    <ul>${planFeatures(p).map(([ok, t]) => `<li class="${ok ? '' : 'no'}">${icon(ok ? 'check' : 'x')}<span>${t}</span></li>`).join('')}</ul>${action}</div>`;
}

async function staffPlans() {
  const { plans, addons } = await GET('/plans');
  return `
    <div class="head"><div><h1>Plans</h1><div class="sub">List prices shown to clients. Each client can also have a custom price and extra inboxes.</div></div><span class="badge">Annual billing = 2 months free</span></div>
    <div class="plans" style="margin-top:12px">${plans.map(p => planCard(p, { featured: p.id === 'premium' })).join('')}</div>
    <h2 style="margin:36px 0 14px">Add-ons</h2>
    <div class="grid g4">${Object.values(addons).map(a => `<div class="card card-b"><div style="font-weight:600">${esc(a.name)}</div><div style="margin-top:4px"><b style="font-size:20px;letter-spacing:-.02em">${gbp(a.price)}</b> <span class="faint small">${esc(a.unit)}</span></div></div>`).join('')}</div>
    <p class="faint small" style="margin-top:18px">List prices are set in <span class="mono">src/panel/plans.mjs</span>.</p>`;
}

async function staffSettings() {
  const s = await GET('/settings');
  const inviteStaff = () => {
    const m = modal(`${modalHead('Invite a ZTD staff member', 'Staff can see and change every client.')}
      <form class="modal-b form" id="is"><div class="two">${field('Name', '<input class="input" name="name">')}${field('Email', '<input class="input" name="email" type="email" required>')}</div>${errLine()}</form>
      <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Create link</button></div>`);
    const f = m.querySelector('#is');
    m.querySelector('#go').onclick = async ev => { try { const r = await busy(ev.currentTarget, () => POST('/staff', { name: f.name.value, email: f.email.value })); linkModal('Invite ready', `Send this to ${esc(f.email.value)}.`, r.invite); } catch (e) { showErr(f, e); } };
  };
  return `
    <div class="head"><div><h1>Settings</h1></div></div>
    <div class="stack">
      <div class="card"><div class="card-b"><h2>Subscriptions</h2>
        <div class="list" style="margin:14px -18px -6px">
          <div class="li"><span class="tile">${icon('key')}</span><div class="grow"><div class="n">Stalwart Enterprise licence</div><div class="d">${s.licence.used} of ${s.licence.seats} mailboxes used · renews ${new Date(s.licence.renews).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div><div style="width:140px">${meter(s.licence.used, s.licence.seats)}</div></div>
          <div class="li"><span class="tile">${icon('mail')}</span><div class="grow"><div class="n">Mail server connection</div><div class="d">${s.mailServer.mode === 'ssh' ? 'Connected over SSH to mx1.ztdoffice.com' : s.mailServer.mode === 'http' ? 'Connected over HTTPS' : 'Test mode — changes are not sent to a real mail server'} · ${s.mailServer.domains} domain${s.mailServer.domains === 1 ? '' : 's'}</div></div>${s.mailServer.mode === 'fake' ? '<span class="badge warn">Test mode</span>' : '<span class="badge ok"><span class="dot"></span>Live</span>'}</div>
        </div></div></div>
      <div class="card"><div class="card-h"><div><h2>ZTD staff</h2><div class="sub muted">People who can manage every client</div></div><button class="btn sm" onclick="${on(inviteStaff)}">${icon('plus')}Invite</button></div>
        <div class="list" style="margin-top:10px">${s.staff.map(a => `<div class="li">${avatar(a.name)}<div class="grow"><div class="n">${esc(a.name)}</div><div class="d">${esc(a.email)} · ${a.hasPassword ? `last sign-in ${ago(a.lastLoginAt)}` : 'invite not accepted yet'}</div></div><button class="btn sm ghost" onclick="${on(() => newLink(a))}">New link</button></div>`).join('')}</div></div>
    </div>`;
}

/* ================================================================ shared cards */
function inboxCard(c, base, { full } = {}) {
  const at = c.usage.inboxes >= c.limits.inboxes;
  const list = full ? c.inboxes : c.inboxes.slice(0, 6);
  return `<div class="card">
    <div class="card-h"><div><h2>Inboxes</h2><div class="sub muted">${c.usage.inboxes} of ${c.limits.inboxes} used${at ? ' · limit reached' : ''}</div></div>
      <div class="actions">${!full ? `<a class="btn sm ghost" href="${base}inboxes">View all</a>` : ''}<button class="btn sm ${at ? '' : 'primary'}" onclick="${on(() => newInbox(c))}">${icon('plus')}New inbox</button></div></div>
    ${list.length ? `<div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Person</th><th class="hide-sm">Storage</th><th class="hide-sm">Created</th><th></th></tr></thead><tbody>
      ${list.map(m => `<tr class="${m.suspended ? 'suspended' : ''}">
        <td><div class="who">${avatar(m.name || m.local)}<div style="min-width:0"><div class="n">${esc(m.name || m.local)}${m.suspended ? ' <span class="badge bad" style="height:19px;font-size:11px">Suspended</span>' : ''}</div><div class="d">${esc(m.email)}${m.aliases.length ? ` · also ${esc(m.aliases.join(', '))}` : ''}</div></div></div></td>
        <td class="hide-sm"><div class="mini"><span class="t">${fmtBytes(m.usedBytes)} <span class="faint">of ${gbOf(m.quotaBytes)} GB</span></span>${meter(m.usedBytes, m.quotaBytes)}</div></td>
        <td class="hide-sm muted small">${ago(m.createdAt)}</td>
        <td class="r"><button class="icon-btn" onclick="${on(ev => inboxMenu(ev.currentTarget, c, m))}" aria-label="Actions">${icon('more')}</button></td></tr>`).join('')}
    </tbody></table></div>` : `<div class="empty">No inboxes yet. Add the first person with “New inbox”.</div>`}
    ${!full && c.inboxes.length > list.length ? `<div class="faint small" style="padding:10px 18px 14px">+ ${c.inboxes.length - list.length} more</div>` : ''}
  </div>`;
}

function groupsCard(c) {
  const rows = [
    ...c.groups.map(g => `<div class="li"><span class="ic brand">${icon('users')}</span>
      <div class="grow"><div class="n">${esc(g.email)}</div><div class="d">Group · sends a copy to ${g.recipients.length} ${g.recipients.length === 1 ? 'person' : 'people'}: ${esc(g.recipients.slice(0, 3).join(', '))}${g.recipients.length > 3 ? '…' : ''}</div></div>
      <button class="icon-btn" onclick="${on(ev => menu(ev.currentTarget, [
        { icon: 'edit', label: 'Change members', run: () => editGroup(c, g) }, '-',
        { icon: 'trash', label: 'Delete group', danger: true, run: () => confirmDel(`Delete ${g.email}?`, 'Email sent to this address will bounce.', () => DEL(`/clients/${c.id}/groups/${g.id}`)) },
      ]))}" aria-label="Actions">${icon('more')}</button></div>`),
    ...c.aliases.map(a => `<div class="li"><span class="ic">${icon('at')}</span>
      <div class="grow"><div class="n">${esc(a.address)}</div><div class="d">Alias · delivered to ${esc(a.toName)} (${esc(a.to)})</div></div>
      <button class="icon-btn" onclick="${on(ev => menu(ev.currentTarget, [
        { icon: 'trash', label: 'Delete alias', danger: true, run: () => confirmDel(`Delete ${a.address}?`, 'Email sent to this address will bounce.', () => DEL(`/clients/${c.id}/aliases/${encodeURIComponent(a.address)}`)) },
      ]))}" aria-label="Actions">${icon('more')}</button></div>`),
  ];
  return `<div class="card">
    <div class="card-h"><div><h2>Groups & aliases</h2><div class="sub muted">${c.usage.aliases} of ${c.limits.aliases} used · they don't use an inbox</div></div>
      <button class="btn sm" onclick="${on(() => newGroup(c))}">${icon('plus')}New</button></div>
    <div class="list" style="margin-top:12px">${rows.join('') || `<div class="empty">No groups or aliases yet. Try info@ or support@.</div>`}</div></div>`;
}

function inboxMenu(btn, c, m) {
  menu(btn, [
    { icon: 'edit', label: 'Rename', run: () => renameInbox(c, m) },
    ...(m.suspended ? [] : [{ icon: 'key', label: 'Reset password', run: () => resetPassword(c, m) }]),
    { icon: 'at', label: 'Add an alias for this person', run: () => newGroup(c, { type: 'alias', inboxId: m.id }) },
    '-',
    { icon: m.suspended ? 'play' : 'pause', label: m.suspended ? 'Resume sign-in' : 'Suspend sign-in', run: async () => {
      try { await POST(`/clients/${c.id}/inboxes/${m.id}/suspend`, { suspended: !m.suspended }); toast(`${m.email} ${m.suspended ? 'resumed' : 'suspended'}`); refresh(); } catch (e) { fail(e); }
    } },
    { icon: 'trash', label: 'Delete inbox', danger: true, run: () => deleteInbox(c, m) },
  ]);
}

function secretModal(title, email, password) {
  modal(`${modalHead(title, 'Copy the password now — it won\'t be shown again. Give it to the person by phone or in person, not by email to the same inbox.')}
    <div class="modal-b form">
      ${field('Email address', copyRow(email))}
      ${field('Password', copyRow(password, true))}
      <dl class="kv" style="margin-top:6px"><dt>Webmail</dt><dd>mail.ztdoffice.com</dd><dt>Incoming (IMAP)</dt><dd class="mono">mx1.ztdoffice.com · 993</dd><dt>Outgoing (SMTP)</dt><dd class="mono">mx1.ztdoffice.com · 587</dd></dl>
    </div>
    <div class="modal-f"><button class="btn" onclick="${on(() => copy(`Email: ${email}\nPassword: ${password}\nWebmail: https://mail.ztdoffice.com\nIMAP: mx1.ztdoffice.com:993 (SSL)\nSMTP: mx1.ztdoffice.com:587 (STARTTLS)`, 'Details copied'))}">${icon('copy')}Copy all</button><button class="btn primary" onclick="${on(() => { closeModal(); refresh(); })}">Done</button></div>`);
}

function newInbox(c) {
  if (c.usage.inboxes >= c.limits.inboxes) return upgradePrompt(c, 'inboxes');
  const doms = c.domains.map(d => d.name);
  const s = modal(`${modalHead('Add a person', `Creates an inbox with calendar and contacts. ${c.limits.inboxes - c.usage.inboxes} of ${c.limits.inboxes} left on your plan.`)}
    <form class="modal-b form" id="ni">
      ${field('Full name', '<input class="input" name="name" placeholder="Jane Smith" autocomplete="off" required>')}
      ${field('Email address', `<div class="addon"><input class="input" name="local" placeholder="jane" autocomplete="off" autocapitalize="off" required>${doms.length > 1 ? `<select class="pill-select" name="domain" style="border-radius:0 8px 8px 0">${doms.map(d => `<option>${esc(d)}</option>`).join('')}</select>` : `<span>@${esc(doms[0] || '')}</span>`}</div>`)}
      ${field('Password', `<div class="seg2"><button type="button" class="opt on" data-v="gen"><b>Create one for me</b><span>Shown once, to pass on</span></button><button type="button" class="opt" data-v="set"><b>I'll choose it</b><span>At least 10 characters</span></button></div>`)}
      <div id="pwf" style="display:none">${field('Password', '<input class="input" name="password" type="text" autocomplete="off" minlength="10">')}</div>
      <span class="hint faint small">${c.limits.storageGb} GB storage.</span>
      ${errLine()}
    </form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Create inbox</button></div>`);
  const f = s.querySelector('#ni');
  let mode = 'gen';
  s.querySelectorAll('.opt').forEach(o => o.onclick = () => { mode = o.dataset.v; s.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === o)); s.querySelector('#pwf').style.display = mode === 'set' ? '' : 'none'; });
  f.name.oninput = () => { if (!f.local.dataset.touched) f.local.value = f.name.value.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9.]/g, ''); };
  f.local.oninput = () => { f.local.dataset.touched = 1; };
  const submit = async () => {
    try {
      const r = await busy(s.querySelector('#go'), () => POST(`/clients/${c.id}/inboxes`, { name: f.name.value, local: f.local.value, domain: f.domain?.value, password: mode === 'set' ? f.password.value : undefined }));
      if (r.password) secretModal('Inbox created', r.email, r.password);
      else { closeModal(); toast(`${r.email} created`); refresh(); }
    } catch (e) { showErr(f, e); }
  };
  s.querySelector('#go').onclick = submit; f.onsubmit = e => { e.preventDefault(); submit(); };
}

function upgradePrompt(c, what) {
  const order = ['lite', 'premium', 'business'];
  const next = c.plans.find(p => p.id === order[order.indexOf(c.plan) + 1]);
  const used = what === 'inboxes' ? `all ${c.limits.inboxes} inboxes` : `all ${c.limits.aliases} groups & aliases`;
  if (isStaff()) {
    return modal(`${modalHead(`${esc(c.name)} has used ${used}`, 'Change their plan or add extras on the client page, then try again.')}
      <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Close</button><a class="btn primary" href="#/clients/${esc(c.id)}">Go to plan & price</a></div>`);
  }
  const s = modal(`${modalHead(`You've used ${used}`, `Your ${esc(c.planName)} plan includes ${what === 'inboxes' ? c.limits.inboxes : c.limits.aliases}. Choose how you'd like to add more — ZTD Office will confirm the change.`)}
    <div class="modal-b upg">
      ${next ? `<button class="opt on" data-v="plan"><span class="ic brand">${icon('spark')}</span><span class="grow"><b>Upgrade to ${esc(next.name)}</b><span>${next.inboxes} inboxes, ${next.aliases} groups & aliases, ${next.storageGb} GB each${next.meetings ? ', ' + esc(next.meetings.toLowerCase()) : ''}</span></span><span class="price"><b>${gbp(next.price)}</b><span class="faint small">/mo</span></span></button>` : ''}
      <button class="opt ${next ? '' : 'on'}" data-v="extra"><span class="ic">${icon('plus')}</span><span class="grow"><b>${what === 'inboxes' ? 'Add one inbox' : 'Add 5 groups & aliases'}</b><span>Stay on ${esc(c.planName)}</span></span><span class="price"><b>+${gbp(what === 'inboxes' ? c.addons.inbox.price : c.addons.aliases.price)}</b><span class="faint small">/mo</span></span></button>
    </div>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Not now</button><button class="btn primary" id="go">Send request</button></div>`);
  s.querySelectorAll('.opt').forEach(o => o.onclick = () => s.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === o)));
  s.querySelector('#go').onclick = async ev => {
    const v = s.querySelector('.opt.on').dataset.v;
    try {
      await busy(ev.currentTarget, () => POST(`/clients/${c.id}/requests`, v === 'plan' ? { plan: next.id } : { kind: what === 'inboxes' ? 'extra-inbox' : 'extra-aliases' }));
      closeModal(); toast("Request sent — we'll confirm shortly"); refresh();
    } catch (e) { fail(e); }
  };
}

function renameInbox(c, m) {
  const s = modal(`${modalHead(`Rename ${esc(m.email)}`, 'The name people see on emails from this inbox.')}
    <form class="modal-b form" id="rn">${field('Name', `<input class="input" name="name" value="${esc(m.name)}" required>`)}${errLine()}</form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Save</button></div>`);
  const f = s.querySelector('#rn');
  const submit = async () => { try { await busy(s.querySelector('#go'), () => PATCH(`/clients/${c.id}/inboxes/${m.id}`, { name: f.name.value })); closeModal(); toast('Saved'); refresh(); } catch (e) { showErr(f, e); } };
  s.querySelector('#go').onclick = submit; f.onsubmit = e => { e.preventDefault(); submit(); };
}

function resetPassword(c, m) {
  const s = modal(`${modalHead(`Reset the password for ${esc(m.email)}?`, 'The old password stops working straight away, including in mail apps on their phone and computer.')}
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Reset password</button></div>`);
  s.querySelector('#go').onclick = async ev => {
    try { const r = await busy(ev.currentTarget, () => POST(`/clients/${c.id}/inboxes/${m.id}/password`, {})); secretModal('New password', r.email, r.password); } catch (e) { fail(e); }
  };
}

function deleteInbox(c, m) {
  const s = modal(`${modalHead(`Delete ${esc(m.email)}?`, 'All email, calendars and contacts in this inbox are deleted <b>immediately and permanently</b>. It is also removed from any groups.')}
    <form class="modal-b form" id="di">${field(`Type <span class="mono">${esc(m.email)}</span> to confirm`, '<input class="input" name="confirm" autocomplete="off" autocapitalize="off">')}${errLine()}</form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" style="background:var(--red-pill-tx);border-color:var(--red-pill-tx);color:#fff" id="go">Delete inbox</button></div>`);
  const f = s.querySelector('#di');
  const submit = async () => { try { await busy(s.querySelector('#go'), () => DEL(`/clients/${c.id}/inboxes/${m.id}`, { confirm: f.confirm.value })); closeModal(); toast('Inbox deleted'); refresh(); } catch (e) { showErr(f, e); } };
  s.querySelector('#go').onclick = submit; f.onsubmit = e => { e.preventDefault(); submit(); };
}

function confirmDel(title, text, run) {
  const s = modal(`${modalHead(esc(title), esc(text))}<div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" style="background:var(--red-pill-tx);border-color:var(--red-pill-tx);color:#fff" id="go">Delete</button></div>`);
  s.querySelector('#go').onclick = async ev => { try { await busy(ev.currentTarget, run); closeModal(); toast('Deleted'); refresh(); } catch (e) { fail(e); } };
}

// Member picker: the client's inboxes as checkboxes, plus any other addresses (one per line).
function memberPicker(c, selected = []) {
  const own = new Set(c.inboxes.map(i => i.email));
  const others = selected.filter(a => !own.has(a));
  return `<div class="checks">${c.inboxes.map(i => `<label><input type="checkbox" value="${esc(i.email)}" ${selected.includes(i.email) ? 'checked' : ''}>${avatar(i.name || i.local)}<span>${esc(i.name || i.local)} <span class="faint">${esc(i.email)}</span></span></label>`).join('') || '<div class="faint small" style="padding:8px">No inboxes yet.</div>'}</div>
    <div class="field" style="margin-top:12px"><label>Other addresses <span class="faint" style="font-weight:400">(optional, one per line)</span></label><textarea class="input" name="others" placeholder="someone@gmail.com">${esc(others.join('\n'))}</textarea></div>`;
}
const pickedMembers = root => [...root.querySelectorAll('.checks input:checked')].map(x => x.value)
  .concat((root.querySelector('[name=others]')?.value || '').split(/[\s,;]+/).map(x => x.trim()).filter(Boolean));

function newGroup(c, preset = {}) {
  if (c.usage.aliases >= c.limits.aliases) return upgradePrompt(c, 'aliases');
  const doms = c.domains.map(d => d.name);
  let type = preset.type || 'group';
  const s = modal(`${modalHead('New group or alias', `${c.limits.aliases - c.usage.aliases} of ${c.limits.aliases} left. These don't use an inbox.`)}
    <form class="modal-b form" id="ng">
      <div class="seg2"><button type="button" class="opt ${type === 'group' ? 'on' : ''}" data-v="group"><b>Group</b><span>Sends a copy to several people</span></button><button type="button" class="opt ${type === 'alias' ? 'on' : ''}" data-v="alias"><b>Alias</b><span>Extra address for one inbox</span></button></div>
      ${field('Address', `<div class="addon"><input class="input" name="local" placeholder="${type === 'group' ? 'support' : 'info'}" autocomplete="off" autocapitalize="off" required>${doms.length > 1 ? `<select class="pill-select" name="domain" style="border-radius:0 8px 8px 0">${doms.map(d => `<option>${esc(d)}</option>`).join('')}</select>` : `<span>@${esc(doms[0] || '')}</span>`}</div>`)}
      <div id="g-members">${field('Who gets the email', memberPicker(c))}<span class="hint faint small">Tip: members reply-all to keep the team in the loop.</span></div>
      <div id="a-target">${field('Deliver to', `<select class="input" name="inboxId">${c.inboxes.map(i => `<option value="${esc(i.id)}" ${preset.inboxId === i.id ? 'selected' : ''}>${esc(i.name || i.local)} — ${esc(i.email)}</option>`).join('')}</select>`)}</div>
      ${errLine()}
    </form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Create</button></div>`);
  const f = s.querySelector('#ng');
  const sync = () => { s.querySelector('#g-members').style.display = type === 'group' ? '' : 'none'; s.querySelector('#a-target').style.display = type === 'alias' ? '' : 'none'; };
  s.querySelectorAll('.seg2 .opt').forEach(o => o.onclick = () => { type = o.dataset.v; s.querySelectorAll('.seg2 .opt').forEach(x => x.classList.toggle('on', x === o)); sync(); });
  sync();
  const submit = async () => {
    try {
      const body = type === 'group' ? { type, local: f.local.value, domain: f.domain?.value, recipients: pickedMembers(f) } : { type, local: f.local.value, domain: f.domain?.value, inboxId: f.inboxId.value };
      const r = await busy(s.querySelector('#go'), () => POST(`/clients/${c.id}/groups`, body));
      closeModal(); toast(`${r.email} created`); refresh();
    } catch (e) { showErr(f, e); }
  };
  s.querySelector('#go').onclick = submit; f.onsubmit = e => { e.preventDefault(); submit(); };
}

function editGroup(c, g) {
  const s = modal(`${modalHead(`Members of ${esc(g.email)}`, 'Everyone ticked gets a copy of each email sent to this address.')}
    <form class="modal-b form" id="eg">${memberPicker(c, g.recipients)}${errLine()}</form>
    <div class="modal-f"><button class="btn" onclick="${on(closeModal)}">Cancel</button><button class="btn primary" id="go">Save</button></div>`);
  const f = s.querySelector('#eg');
  s.querySelector('#go').onclick = async ev => { try { await busy(ev.currentTarget, () => PATCH(`/clients/${c.id}/groups/${g.id}`, { recipients: pickedMembers(f) })); closeModal(); toast('Members saved'); refresh(); } catch (e) { showErr(f, e); } };
}

/* ================================================================ client views */
const clientHead = (t, s, act = '') => `<div class="head"><div><h1>${t}</h1><div class="sub">${s}</div></div><div class="actions">${act}</div></div>`;

function mailAppCard() {
  const txt = 'Incoming (IMAP): mx1.ztdoffice.com, port 993, SSL\nOutgoing (SMTP): mx1.ztdoffice.com, port 587, STARTTLS\nUsername: your full email address';
  return `<div class="card card-b"><h2>Set up a mail app</h2><div class="sub muted small">Outlook, iPhone, Android, Mac Mail</div>
    <dl class="kv" style="margin-top:16px"><dt>Incoming (IMAP)</dt><dd class="mono">mx1.ztdoffice.com · 993</dd><dt>Outgoing (SMTP)</dt><dd class="mono">mx1.ztdoffice.com · 587</dd><dt>Security</dt><dd>SSL / STARTTLS</dd><dt>Username</dt><dd>Full email address</dd></dl>
    <hr class="sep"><button class="btn sm" style="width:100%" onclick="${on(() => copy(txt, 'Settings copied'))}">${icon('copy')}Copy settings</button></div>`;
}

function clientOverview(c, base) {
  const at = c.usage.inboxes >= c.limits.inboxes;
  const next = c.plans.find(p => p.id === ['lite', 'premium', 'business'][['lite', 'premium', 'business'].indexOf(c.plan) + 1]);
  const d = c.domains[0];
  const who = isStaff() ? c.contactName || c.name : me.user.name;
  return `
    <div class="card hero card-b" style="padding:28px;margin-bottom:16px">
      <div style="position:relative;z-index:1;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-end">
        <div><div class="eyebrow">${esc(c.name)} · ${esc(c.planName)} plan</div>
          <h1 style="margin-top:8px">Welcome back, ${esc(firstName(who))}</h1>
          <div class="muted" style="margin-top:6px">${d ? `Your email on <b style="color:var(--ink)">${esc(d.name)}</b> ${d.dns?.verified ? 'is fully set up.' : d.dns ? 'still needs some DNS records.' : 'is ready — check your DNS records.'}` : 'No domain yet.'}</div></div>
        <div class="actions"><a class="btn" href="https://mail.ztdoffice.com" target="_blank" rel="noopener">${icon('mail')}Open webmail</a><button class="btn primary" onclick="${on(() => newInbox(c))}">${icon('plus')}Add a person</button></div>
      </div>
    </div>
    ${c.status === 'suspended' ? `<div class="banner warn"><span class="ic warn">${icon('pause')}</span><div class="grow"><b>This account is suspended.</b> <span class="muted">Mail is still received, but nobody can sign in.</span></div></div>` : ''}
    ${c.requests.length ? `<div class="banner brand"><span class="ic brand">${icon('spark')}</span><div class="grow"><b>Request sent:</b> ${esc(c.requests[0].detail)}. <span class="muted">ZTD Office will confirm shortly.</span></div></div>` : ''}
    ${at && next && !c.requests.length ? `<div class="banner brand"><span class="ic brand">${icon('spark')}</span><div class="grow"><b>You're using all ${c.limits.inboxes} inboxes.</b> <span class="muted">${esc(next.name)} gives you ${next.inboxes} inboxes and ${next.aliases} groups & aliases.</span></div><a class="btn sm primary" href="${base}plan">See plans</a></div>` : ''}
    ${d && d.dns && !d.dns.verified ? `<div class="banner warn"><span class="ic warn">${icon('alert')}</span><div class="grow"><b>${esc(d.name)} needs DNS records.</b> <span class="muted">Missing: ${esc(d.dns.missingRequired.join(', '))}.</span></div><a class="btn sm" href="${base}domain">Fix it</a></div>` : ''}
    <div class="grid g3" style="margin-bottom:16px">
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">${icon('inbox')} Inboxes</span><b>${c.usage.inboxes} of ${c.limits.inboxes}</b></div>${meter(c.usage.inboxes, c.limits.inboxes, true)}<span class="faint small">${at ? 'Limit reached' : `${c.limits.inboxes - c.usage.inboxes} left on your plan`}</span></div></div>
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">${icon('at')} Groups & aliases</span><b>${c.usage.aliases} of ${c.limits.aliases}</b></div>${meter(c.usage.aliases, c.limits.aliases, true)}<span class="faint small">${Math.max(0, c.limits.aliases - c.usage.aliases)} left</span></div></div>
      <div class="card card-b"><div class="usage"><div class="row"><span class="muted">${icon('db')} Storage</span><b>${fmtBytes(c.usage.usedBytes)}</b></div>${meter(c.usage.usedBytes, c.usage.quotaBytes || 1, true)}<span class="faint small">${c.limits.storageGb} GB per inbox</span></div></div>
    </div>
    <div class="grid g2">
      <div class="stack">${inboxCard(c, base)}${groupsCard(c)}</div>
      <div class="stack">${mailAppCard()}
        ${c.domains.map(dm => `<a class="card card-b" href="${base}domain" style="display:block"><div style="display:flex;justify-content:space-between;align-items:center"><div class="who"><span class="tile">${icon('globe')}</span><div><div class="n">${esc(dm.name)}</div><div class="d">${dm.dns ? `Checked ${ago(dm.dns.checkedAt)}` : 'Not checked yet'}</div></div></div>${dnsBadge(dm.dns)}</div></a>`).join('')}
        <div class="card card-b"><div style="display:flex;justify-content:space-between;align-items:center"><h2>Your plan</h2>${planBadge(c.plan, c.planName)}</div>
          <dl class="kv" style="margin-top:14px"><dt>Monthly</dt><dd>${gbp(c.monthly)}</dd><dt>Includes</dt><dd>Website + email</dd></dl>
          <hr class="sep"><a class="btn sm" style="width:100%" href="${base}plan">Compare plans</a></div>
      </div>
    </div>`;
}

const clientInboxes = c => clientHead('Inboxes', `Each person gets their own inbox, calendar and contacts. ${c.usage.inboxes} of ${c.limits.inboxes} used.`) + inboxCard(c, '', { full: true });

const clientGroups = c => clientHead('Groups & aliases', "Extra addresses that deliver into existing inboxes. They don't use up an inbox.") + `
  <div class="grid g3" style="margin-bottom:16px">
    <div class="card card-b"><span class="ic">${icon('at')}</span><div style="font-weight:600;margin-top:10px">Alias</div><div class="muted small">info@ goes straight into one person's inbox.</div></div>
    <div class="card card-b"><span class="ic brand">${icon('users')}</span><div style="font-weight:600;margin-top:10px">Group</div><div class="muted small">support@ sends a copy to everyone in the group. Reply-all keeps the team in the loop.</div></div>
    <div class="card card-b"><span class="ic warn">${icon('inbox')}</span><div style="font-weight:600;margin-top:10px">Shared inbox</div><div class="muted small">One inbox the team works from together. Ask ZTD Office to set one up (Premium and up).</div></div>
  </div>` + groupsCard(c);

async function clientDomain(c) {
  const { domains } = await GET(`/clients/${c.id}/dns`);
  const recheck = async ev => { try { await busy(ev.currentTarget, () => GET(`/clients/${c.id}/dns?refresh=1`)); toast('Checked just now'); refresh(); } catch (e) { fail(e); } };
  const one = d => {
    const groups = [...new Set(d.records.map(r => r.group))];
    const recsFound = d.records.filter(r => r.required && r.ok).length, recsReq = d.records.filter(r => r.required).length;
    const nameFor = r => r.host === '@' ? '@' : r.host;
    return `
      <div class="head" style="margin:8px 0 18px;align-items:center">
        <div class="who"><span class="tile lg">${icon('globe')}</span><div><div class="eyebrow">Domain</div><div style="font-size:26px;font-weight:600;letter-spacing:-.025em">${esc(d.name)}</div></div></div>
      </div>
      <div class="grid g4" style="margin-bottom:22px">
        <div><div class="eyebrow">Added</div><div style="margin-top:6px">${ago(d.createdAt)}</div></div>
        <div><div class="eyebrow">Status</div><div style="margin-top:6px">${d.verified ? '<span class="badge ok">Verified</span>' : '<span class="badge warn">Waiting for DNS</span>'}</div></div>
        <div><div class="eyebrow">Records</div><div style="margin-top:6px" class="num">${recsFound} of ${recsReq} required</div></div>
        <div><div class="eyebrow">Last checked</div><div style="margin-top:6px">${ago(d.checkedAt)}</div></div>
      </div>
      <div class="eyebrow" style="margin:4px 0 12px">Domain events</div>
      <div class="tl" style="margin-bottom:22px">
        <div class="node done"><span class="dotbox">${icon('globe')}</span><span class="lbl">Domain added</span><span class="tm">${dateTime(d.createdAt)}</span></div>
        <div class="node ${d.records.find(r => r.key === 'mx')?.ok ? 'done' : ''}"><span class="dotbox">${icon('inbox')}</span><span class="lbl">Receiving mail</span><span class="tm">${d.records.find(r => r.key === 'mx')?.ok ? 'MX record found' : 'Waiting for MX'}</span></div>
        <div class="node ${d.verified ? 'done' : ''}"><span class="dotbox">${icon('shield')}</span><span class="lbl">Domain verified</span><span class="tm">${d.verified ? 'All required records live' : `${recsReq - recsFound} still to add`}</span></div>
      </div>
      ${d.verified ? '' : `<div class="banner warn"><span class="ic warn">${icon('alert')}</span><div class="grow"><b>Add these records where ${esc(d.name)}'s DNS is managed</b> <span class="muted">(often your domain registrar, e.g. Namecheap or GoDaddy). Mail may be rejected or land in spam until the required ones are live. Changes can take up to an hour to show.</span></div></div>`}
      ${groups.map(g => `<div class="eyebrow" style="margin:18px 0 10px">${esc(g)}</div>
        <div class="card table-wrap"><table><thead><tr><th>Record</th><th>Type</th><th>Name</th><th>Value</th><th class="r">Status</th></tr></thead><tbody>
        ${d.records.filter(r => r.group === g).map(r => `<tr>
          <td><b style="font-weight:600">${esc(r.label)}</b>${r.required ? '' : ' <span class="faint small">optional</span>'}</td>
          <td class="mono">${esc(r.type)}</td>
          <td class="mono"><span style="display:inline-flex;align-items:center;gap:4px">${esc(nameFor(r))}<button class="icon-btn" style="width:24px;height:24px" onclick="${on(() => copy(nameFor(r)))}" aria-label="Copy name">${icon('copy')}</button></span></td>
          <td class="mono"><span style="display:inline-flex;align-items:center;gap:4px;max-width:420px"><span class="rec-val" title="${esc(r.value)}">${esc(r.value)}</span>${r.key === 'resend-dkim' ? '' : `<button class="icon-btn" style="width:24px;height:24px;flex:none" onclick="${on(() => copy(r.value))}" aria-label="Copy value">${icon('copy')}</button>`}</span></td>
          <td class="r">${r.ok ? `<span class="badge ok">${icon('check')}Live</span>` : r.error ? '<span class="badge">Unknown</span>' : `<span class="badge ${r.required ? 'warn' : ''}">Missing</span>`}</td></tr>`).join('')}
        </tbody></table></div>`).join('')}
      ${d.records.some(r => r.key === 'resend-dkim' && !r.ok) ? `<p class="faint small" style="margin-top:12px">The Resend DKIM value is unique to each domain. ${isStaff() ? 'Add the domain in Resend (Domains → Add) and copy its value from there.' : 'ZTD Office will send it to you.'}</p>` : ''}`;
  };
  return clientHead('Domain', 'DNS records your email needs. We check them every 10 minutes when you visit.', `<button class="btn" onclick="${on(recheck)}">${icon('refresh')}Check now</button>`)
    + (domains.length ? domains.map(one).join('<hr class="sep" style="margin:40px 0">') : '<div class="empty">No domain yet. Ask ZTD Office to add one.</div>');
}

function clientPlan(c) {
  const order = ['lite', 'premium', 'business'];
  const action = p => {
    if (p.id === c.plan) return `<button class="btn" disabled style="opacity:.6;cursor:default">Your current plan</button>`;
    if (isStaff()) return `<a class="btn" href="#/clients/${esc(c.id)}">Change on staff page</a>`;
    const pending = c.requests.some(r => r.kind === 'plan' && r.detail.includes(p.name));
    return `<button class="btn ${p.id === 'premium' ? 'primary' : ''}" ${pending ? 'disabled' : ''} onclick="${on(async ev => { try { await busy(ev.currentTarget, () => POST(`/clients/${c.id}/requests`, { plan: p.id })); toast("Request sent — we'll confirm shortly"); refresh(); } catch (e) { fail(e); } })}">${pending ? 'Requested' : `${order.indexOf(p.id) > order.indexOf(c.plan) ? 'Upgrade to' : 'Switch to'} ${esc(p.name)}`}</button>`;
  };
  return clientHead('Plan', `You're on <b>${esc(c.planName)}</b> at ${gbp(c.monthly)} a month. Website and email are included.`)
    + `<div class="plans" style="margin-top:12px">${c.plans.map(p => planCard(p, { featured: p.id === 'premium', current: p.id === c.plan, action: action(p) })).join('')}</div>
    ${isStaff() ? '' : `<h2 style="margin:36px 0 14px">Need a little more?</h2>
    <div class="grid g3">${[['extra-inbox', c.addons.inbox], ['extra-aliases', c.addons.aliases]].map(([k, a]) => `<div class="card card-b"><div style="font-weight:600">${esc(a.name)}</div><div style="margin-top:2px"><b>${gbp(a.price)}</b> <span class="faint small">${esc(a.unit)}</span></div><button class="btn sm" style="margin-top:12px;width:100%" onclick="${on(async ev => { try { await busy(ev.currentTarget, () => POST(`/clients/${c.id}/requests`, { kind: k })); toast("Request sent — we'll confirm shortly"); refresh(); } catch (e) { fail(e); } })}">Request</button></div>`).join('')}</div>`}`;
}

/* ================================================================ command palette */
let cmdkItems = [], cmdkSel = 0;
async function cmdkData() {
  const items = [];
  const r = parse();
  if (isStaff()) {
    items.push(...[['Overview', '#/', 'home'], ['Clients', '#/clients', 'users'], ['Domains', '#/domains', 'globe'], ['Activity', '#/activity', 'activity'], ['Plans', '#/plans', 'layers'], ['Settings', '#/settings', 'gear']]
      .map(([n, h, ic]) => ({ grp: 'Go to', ic, n, run: () => go(h) })));
    try { (await GET('/clients')).clients.forEach(c => items.push({ grp: 'Clients', av: c.name, n: c.name, d: `${c.domains.map(d => d.name).join(', ')} · ${c.planName}`, run: () => go(`#/clients/${c.id}`) })); } catch { /* offline */ }
    items.push({ grp: 'Actions', ic: 'plus', n: 'New client', run: newClient });
  }
  if (r.area === 'client') {
    const base = r.clientId ? `#/as/${r.clientId}/` : '#/';
    items.push(...[['Overview', '', 'home'], ['Inboxes', 'inboxes', 'inbox'], ['Groups & aliases', 'groups', 'at'], ['Domain', 'domain', 'globe'], ['Plan', 'plan', 'card']]
      .map(([n, h, ic]) => ({ grp: isStaff() ? 'This client' : 'Go to', ic, n, run: () => go(base + h) })));
  }
  items.push({ grp: 'Actions', ic: 'mail', n: 'Open webmail', run: () => window.open('https://mail.ztdoffice.com', '_blank') });
  items.push({ grp: 'Actions', ic: 'moon', n: 'Switch light / dark', run: toggleTheme });
  items.push({ grp: 'Actions', ic: 'logout', n: 'Sign out', run: logout });
  return items;
}
async function openCmdk() {
  if ($('#cmdk') || !me) return;
  closeMenu();
  const s = document.createElement('div');
  s.className = 'cmdk-scrim'; s.id = 'cmdk';
  s.innerHTML = `<div class="cmdk"><div class="cmdk-in">${icon('spark')}<input id="cmdk-q" placeholder="Jump to a client, page or action…" autocomplete="off" spellcheck="false"></div><div class="cmdk-list" id="cmdk-list"><div class="loading" style="padding:24px"><span class="spin"></span></div></div>
    <div class="cmdk-foot"><span class="k"><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span class="k"><kbd>↵</kbd> open</span><span class="k"><kbd>esc</kbd> close</span></div></div>`;
  s.addEventListener('mousedown', e => { if (e.target === s) closeCmdk(); });
  document.body.append(s);
  const q = s.querySelector('#cmdk-q');
  q.focus();
  const all = await cmdkData();
  const draw = () => { const t = q.value.trim().toLowerCase(); cmdkItems = all.filter(it => !t || `${it.n} ${it.d || ''} ${it.grp}`.toLowerCase().includes(t)); cmdkSel = 0; renderCmdk(); };
  q.oninput = draw;
  q.onkeydown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdkSel = Math.min(cmdkItems.length - 1, cmdkSel + 1); renderCmdk(true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdkSel = Math.max(0, cmdkSel - 1); renderCmdk(true); }
    else if (e.key === 'Enter') { e.preventDefault(); runCmdk(cmdkSel); }
  };
  draw();
}
function renderCmdk(scroll) {
  const list = $('#cmdk-list'); if (!list) return;
  if (!cmdkItems.length) { list.innerHTML = '<div class="empty" style="padding:28px">No matches</div>'; return; }
  let html = '', last = '';
  cmdkItems.forEach((it, i) => {
    if (it.grp !== last) { html += `<div class="cmdk-grp">${esc(it.grp)}</div>`; last = it.grp; }
    html += `<div class="cmdk-it ${i === cmdkSel ? 'on' : ''}" data-i="${i}">${it.av ? avatar(it.av, 'sq') : `<span class="ic">${icon(it.ic)}</span>`}<div class="grow"><div class="n">${esc(it.n)}</div>${it.d ? `<div class="d">${esc(it.d)}</div>` : ''}</div><span class="go">${icon('arrow')}</span></div>`;
  });
  list.innerHTML = html;
  list.querySelectorAll('.cmdk-it').forEach(el => {
    el.onmousemove = () => { cmdkSel = +el.dataset.i; list.querySelectorAll('.cmdk-it').forEach(x => x.classList.toggle('on', x === el)); };
    el.onclick = () => runCmdk(+el.dataset.i);
  });
  if (scroll) list.querySelector('.cmdk-it.on')?.scrollIntoView({ block: 'nearest' });
}
function runCmdk(i) { const it = cmdkItems[i]; if (!it) return; closeCmdk(); it.run(); }
function closeCmdk() { $('#cmdk')?.remove(); }

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#cmdk') ? closeCmdk() : openCmdk(); }
  if (e.key === 'Escape') { closeCmdk(); closeMenu(); closeModal(); }
});

boot();
