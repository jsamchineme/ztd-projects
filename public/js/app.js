// App bootstrap, chrome (topbar + sidebar), and hash router.
// Views register with registerView(name, mountFn) and are mounted into #view.
import { api } from './api.js';
import { h, icon, avatar, toast } from './ui.js';

const views = new Map();
export function registerView(name, mountFn) { views.set(name, mountFn); }
window.registerView = registerView;

export const app = {
  state: { user: null, labels: [], counts: {} },
  navigate(hash) { if (location.hash === hash) route(); else location.hash = hash; },
  refresh() { route(); },
  renderSidebar,
  async refreshSidebar() {
    try { app.state.labels = await api.get('/api/labels'); } catch {}
    renderSidebar();
  },
  async boot() { await boot(); },
  async logout() { try { await api.post('/api/auth/logout'); } catch {} location.hash = ''; location.reload(); },
};
window.app = app;

// theme
const savedTheme = localStorage.getItem('bm-theme');
if (savedTheme === 'dark') document.documentElement.classList.add('dark');
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('bm-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// ---- routing ----
// Returns {view, params}
function parseRoute() {
  const raw = location.hash.replace(/^#/, '') || '/inbox';
  const [path, qs] = raw.split('?');
  const q = new URLSearchParams(qs || '');
  const segs = path.split('/').filter(Boolean);
  const SYS = ['inbox', 'sent', 'drafts', 'trash', 'spam', 'starred', 'archive'];
  if (segs[0] === 'settings') return { view: 'settings', params: {} };
  if (segs[0] === 'admin') return { view: 'admin', params: {} };
  if (segs[0] === 'search') return { view: 'mailbox', params: { label: 'inbox', search: q.get('q') || '' } };
  if (segs[0] === 'thread') return { view: 'mailbox', params: { threadId: segs[1] } };
  if (segs[0] === 'label') return { view: 'mailbox', params: { label: segs[1] } };
  if (SYS.includes(segs[0])) return { view: 'mailbox', params: { label: segs[0] } };
  return { view: 'mailbox', params: { label: 'inbox' } };
}

let activeKey = '';
function route() {
  if (!app.state.user) return;
  const { view, params } = parseRoute();
  highlightSidebar();
  const mount = views.get(view);
  const viewEl = document.getElementById('view');
  if (!viewEl) return;
  viewEl.innerHTML = '';
  if (mount) mount(viewEl, params, app);
  else viewEl.append(h('div', { style: { padding: '40px' }, class: 'muted' }, `View "${view}" not available.`));
}
window.addEventListener('hashchange', route);

// ---- chrome ----
function renderChrome() {
  const root = document.getElementById('app');
  root.innerHTML = '';
  const u = app.state.user;
  const search = h('input', { class: 'input', placeholder: 'Search mail — from:jane has:attachment',
    onKeydown: (e) => { if (e.key === 'Enter') app.navigate('#/search?q=' + encodeURIComponent(e.target.value)); } });
  root.append(h('div', { class: 'app' },
    h('header', { class: 'topbar' },
      h('div', { class: 'brand' }, h('span', { class: 'mark' }, icon('mail')), 'Businessmail'),
      h('div', { class: 'searchwrap' }, icon('search'), search),
      h('div', { class: 'grow' }),
      h('button', { class: 'btn btn-ghost btn-icon', title: 'Toggle theme', onClick: toggleTheme }, icon('moon')),
      h('button', { class: 'btn btn-ghost btn-icon', title: 'Settings', onClick: () => app.navigate('#/settings') }, icon('settings')),
      u.role === 'admin' ? h('button', { class: 'btn btn-ghost btn-icon', title: 'Admin', onClick: () => app.navigate('#/admin') }, icon('users')) : null,
      h('button', { class: 'btn btn-ghost btn-icon', title: 'Sign out', onClick: () => app.logout() }, icon('logout')),
      avatar(u.name || u.email, 32),
    ),
    h('div', { class: 'body' },
      h('aside', { class: 'sidebar', id: 'sidebar' }),
      h('main', { id: 'view' }),
    ),
  ));
  renderSidebar();
}

const SYSTEM_NAV = [
  ['inbox', 'Inbox', 'inbox'], ['starred', 'Starred', 'star'], ['sent', 'Sent', 'send'],
  ['drafts', 'Drafts', 'draft'], ['archive', 'Archive', 'archive'], ['spam', 'Spam', 'spam'], ['trash', 'Trash', 'trash'],
];
function renderSidebar() {
  const el = document.getElementById('sidebar');
  if (!el) return;
  el.innerHTML = '';
  el.append(h('button', { class: 'btn btn-primary', style: { marginBottom: '8px' },
    onClick: () => window.openCompose && window.openCompose() }, icon('compose'), 'Compose'));
  const counts = app.state.counts || {};
  for (const [sys, label, ic] of SYSTEM_NAV) {
    const c = counts[sys];
    const unread = c && c.unread ? c.unread : 0;
    el.append(h('button', { class: 'navbtn', dataset: { nav: sys }, onClick: () => app.navigate('#/' + sys) },
      icon(ic), label, unread ? h('span', { class: 'count' }, String(unread)) : null));
  }
  const custom = (app.state.labels || []).filter(l => !l.system);
  if (custom.length) {
    el.append(h('div', { class: 'navlabel' }, 'Labels'));
    for (const l of custom) {
      el.append(h('button', { class: 'navbtn', dataset: { nav: 'label:' + l.id }, onClick: () => app.navigate('#/label/' + l.id) },
        h('span', { class: 'swatch', style: { background: l.color || '#64748b' } }), l.name));
    }
  }
  highlightSidebar();
}
function highlightSidebar() {
  const { params } = parseRoute();
  const key = params.label ? (app.state.labels.find(l => l.id === params.label)?.system ? params.label : 'label:' + params.label) : '';
  const sys = params.label && !('threadId' in params) ? params.label : '';
  document.querySelectorAll('.navbtn[data-nav]').forEach(b => {
    b.classList.toggle('active', b.dataset.nav === sys || b.dataset.nav === 'label:' + params.label);
  });
}

// ---- boot ----
async function boot() {
  const root = document.getElementById('app');
  try {
    const state = await api.get('/api/auth/state');
    if (!state.authed) {
      app.state.user = null;
      const mount = views.get('auth');
      root.innerHTML = '';
      if (mount) mount(root, { needsSetup: state.needsSetup }, app);
      else root.append(h('div', { class: 'center-screen' }, 'Auth view unavailable'));
      return;
    }
    app.state.user = state.user;
    try { app.state.labels = await api.get('/api/labels'); } catch {}
    renderChrome();
    if (!location.hash) location.hash = '#/inbox';
    route();
  } catch (e) {
    root.innerHTML = '';
    root.append(h('div', { class: 'center-screen muted' }, 'Could not reach server. ' + (e.message || '')));
  }
}

// dynamically load views, then boot
await Promise.all([
  import('./views/auth.js').catch(e => console.error('auth view', e)),
  import('./views/mailbox.js').catch(e => console.error('mailbox view', e)),
  import('./views/compose.js').catch(e => console.error('compose view', e)),
  import('./views/settings.js').catch(e => console.error('settings view', e)),
  import('./views/admin.js').catch(e => console.error('admin view', e)),
]);
boot();
