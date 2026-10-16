// ZTD Devs Studio front end: routing, sign-in screens and the app shell.
import { h, $, onTap, api, authApi, toast, fail, busy, dialog, field, initials, ApiError, ico } from './ui.js';
import { renderProject, newProjectDialog } from './project.js';
import { renderAccount, renderTeams, renderAdmin } from './people.js';
import { startPush, disablePush } from './push.js';

export const state = { me: null, projects: [], menuOpen: false };
const app = document.getElementById('app');

// ---------- routing ----------
export function go(path, replace = false){
  if (location.pathname + location.search !== path) history[replace ? 'replaceState' : 'pushState'](null, '', path);
  route();
}
window.addEventListener('popstate', () => route());
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-link]');
  if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0){ e.preventDefault(); go(a.getAttribute('href')); }
});
const qs = () => new URLSearchParams(location.search);
const safeNext = n => (n && n.startsWith('/') && !n.startsWith('//')) ? n : '/';

let cleanup = [];
export function onLeave(fn){ cleanup.push(fn); }
function leave(){ for (const fn of cleanup.splice(0)) try { fn(); } catch {} }

async function loadMe(){
  try { state.me = await api('GET', '/api/me'); }
  catch (e){ if (e.status === 401) state.me = null; else throw e; }
  return state.me;
}
export async function refreshProjects(){
  if (!state.me?.user.twoFactorEnabled) return [];
  state.projects = await api('GET', '/api/projects');
  renderSideProjects();
  return state.projects;
}

async function route(){
  leave();
  setTopbar(null); hideTopbar(false);
  const path = location.pathname;
  if (path === '/login') return loginScreen();
  if (path === '/forgot') return forgotScreen();
  if (path === '/reset-password') return resetScreen();
  const inv = path.match(/^\/invite\/([^/]+)$/);
  if (inv) return inviteScreen(inv[1]);

  if (!state.me) await loadMe();
  if (!state.me) return go(`/login?next=${encodeURIComponent(path + location.search)}`, true);
  if (!state.me.user.twoFactorEnabled) return mfaSetupScreen();

  shell();
  // Each visit draws into its own view. If another visit starts while this one still waits for the server, it
  // replaces the view, so the slower one can't add a second copy of the page (see isCurrent in project.js).
  const main = h('div', { class: 'view' });
  $('#main').replaceChildren(main);
  const pm = path.match(/^\/p\/([^/]+)(?:\/([a-z]+))?(?:\/([^/]+))?/);
  if (!pm || sideChats.dataset.project !== pm[1]) sideChats.replaceChildren();   // no stale chats while another project loads
  sideChats.dataset.project = pm?.[1] || '';
  renderSideProjects();   // moves the chat list under the open project, and marks where we are
  if (pm) return renderProject(main, pm[1], pm[2] || 'chat', pm[3]);
  if (path === '/account') return renderAccount(main);
  if (path === '/team') return renderTeams(main);
  if (path === '/admin') return renderAdmin(main);
  return renderHome(main);
}

// ---------- projects home ----------
// What a project is doing, from its services and chats: [dot class, words].
export function projectState(p){
  const states = p.services.map(s => s.status.state);
  if (p.status === 'creating') return ['starting', 'Setting up'];
  if (p.status === 'error') return ['crashed', 'Setup failed'];
  if (p.running) return ['busy', 'Claude working'];
  if (states.includes('crashed')) return ['crashed', 'Needs a look'];
  if (states.includes('running')) return ['running', 'Running'];
  if (states.includes('starting')) return ['starting', 'Starting'];
  return ['', 'Stopped'];
}
async function renderHome(main){
  setTitle('');
  const first = state.me.user.name.split(' ')[0];
  const page = h('div', { class: 'page', style: { flex: 1 } });
  main.append(page);
  const projects = await refreshProjects();
  if (!page.isConnected) return;   // left before the projects arrived
  if (!projects.length){
    page.append(h('div', { class: 'page-inner narrow welcome' },
      h('img', { src: '/icon.svg', alt: '', width: 56, height: 56 }),
      h('h1', { class: 'hello' }, `Welcome, ${first}`),
      h('p', { class: 'muted' }, 'There are no projects yet.', canCreateProjects() ? ' Start one from a blank website or a copy of a Git repo, and Claude can build it with you.' : ''),
      canCreateProjects() ? h('div', { class: 'row center' }, h('button', { class: 'btn primary', onclick: () => newProjectDialog() }, ico('plus'), 'New project'),
        h('a', { class: 'btn', href: '/team', 'data-link': '' }, ico('users'), 'Invite your team'))
        : h('p', null, 'Ask a team admin to add you to a team with projects.')));
    return;
  }
  const hour = new Date().getHours();
  const services = projects.flatMap(p => p.services);
  const up = services.filter(s => s.status.state === 'running').length;
  const working = projects.reduce((n, p) => n + (p.running || 0), 0);
  const crashed = projects.flatMap(p => p.services.filter(s => s.status.state === 'crashed').map(s => ({ p, s })));
  const look = [
    ...crashed.map(({ p, s }) => h('div', null, ico('alert'), h('span', { class: 'small' }, h('strong', null, s.label || s.name), ` in ${p.name} has stopped unexpectedly. `, h('a', { href: `/p/${p.id}/services`, 'data-link': '' }, 'See its logs')))),
    !state.me.claude?.connected ? h('div', null, ico('sparkle'), h('span', { class: 'small' }, h('strong', null, 'Claude isn’t connected'), ', so you can’t send prompts yet. ', h('a', { href: '/account#claude', 'data-link': '' }, 'Connect Claude'))) : null,
  ].filter(Boolean);
  const card = p => {
    const [dot, words] = projectState(p);
    const live = p.services.find(s => s.url);
    return h('a', { class: 'pcard', href: `/p/${p.id}`, 'data-link': '' },
      h('div', { class: 'thumb' }, p.name.split(/\s+/).slice(0, 2).join(' '),
        live ? h('span', { class: 'pill live' }, h('span', { class: 'dot ' + live.status.state }), `${live.subdomain}.${state.me.domain}`) : null),
      h('h3', null, p.name),
      h('p', null, p.description?.trim() || 'No description yet.'),
      h('div', { class: 'pcard-foot' }, h('span', { class: 'dot ' + dot }), words, h('span', null, '·'), `${p.services.length} service${p.services.length === 1 ? '' : 's'}`,
        h('span', { class: 'spacer' }), p.team ? h('span', { class: 'pill' }, p.team.name) : null));
  };
  page.append(h('div', { class: 'page-inner' },
    h('div', { class: 'page-head' }, h('div', null,
      h('h1', { class: 'hello' }, `Good ${hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'}, ${first}`),
      h('p', null, `${projects.length} project${projects.length === 1 ? '' : 's'}`, working ? `, ${working} chat${working === 1 ? '' : 's'} with Claude working now` : '', '.')),
      h('div', { class: 'spacer' }), canCreateProjects() ? h('button', { class: 'btn primary', onclick: () => newProjectDialog() }, ico('plus'), 'New project') : null),
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', null, projects.length), h('span', null, ico('grid'), 'Projects')),
      h('div', { class: 'stat' }, h('b', null, `${up}`, h('small', null, ` of ${services.length}`)), h('span', null, ico('server'), 'Services running')),
      h('div', { class: 'stat' + (working ? ' gold' : '') }, h('b', null, working), h('span', null, working ? h('span', { class: 'dot busy' }) : ico('chat'), 'Chats working now')),
      h('div', { class: 'stat' }, h('b', null, state.me.teams.length), h('span', null, ico('users'), state.me.teams.length === 1 ? 'Team' : 'Teams'))),
    look.length ? h('section', { class: 'card look' }, h('div', { class: 'card-head' }, h('h3', null, 'Needs a look')), h('div', { class: 'list' }, look)) : null,
    h('div', { class: 'pgrid' }, projects.map(card),
      canCreateProjects() ? h('button', { class: 'pcard add', type: 'button', onclick: () => newProjectDialog() },
        h('div', null, h('div', { class: 'plus' }, ico('plus')), h('strong', null, 'New project'), h('p', null, 'A blank website, or a copy of a public Git repo'))) : null)));
}

export function localStorageGet(k){ try { return localStorage.getItem('studio.' + k); } catch { return null; } }
export function localStorageSet(k, v){ try { localStorage.setItem('studio.' + k, v); } catch {} }
export const canCreateProjects = () => state.me?.user.role === 'admin' || state.me?.teams.some(t => ['owner', 'admin'].includes(t.role));

// ---------- shell ----------
function shell(){
  if ($('.shell')) return;
  startPush();
  const me = state.me.user;
  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  app.replaceChildren(h('div', { class: 'shell' },
    h('aside', { class: 'side', 'aria-label': 'Studio navigation' },
      h('a', { class: 'brand', href: '/', 'data-link': '' }, h('img', { src: '/icon.svg', alt: '' }), state.me.appName || 'Studio'),
      h('button', { type: 'button', class: 'search', onclick: () => openPalette() }, ico('search'), h('span', null, 'Search or jump to…'), h('span', { class: 'kbd' }, mac ? '⌘K' : 'Ctrl K')),
      h('nav', null,
        h('a', { class: 'nav-item', href: '/', 'data-link': '' }, ico('grid'), h('span', { class: 'name' }, 'Projects')),
        h('a', { class: 'nav-item', href: '/team', 'data-link': '' }, ico('users'), h('span', { class: 'name' }, 'Teams and people')),
        me.role === 'admin' ? h('a', { class: 'nav-item', href: '/admin', 'data-link': '' }, ico('shield'), h('span', { class: 'name' }, 'Admin')) : null,
        h('h2', null, 'Projects', canCreateProjects() ? h('button', { type: 'button', class: 'side-add', title: 'New project', 'aria-label': 'New project', onclick: () => newProjectDialog() }, ico('plus')) : null),
        h('div', { id: 'side-projects' })),
      h('div', { class: 'side-foot' },
        h('a', { class: 'me', href: '/account', 'data-link': '' },
          h('span', { class: 'avatar' }, initials(me.name)),
          h('span', { class: 'me-text' }, h('strong', null, me.name), h('small', { id: 'side-claude' }, claudeLabel()))),
        h('button', { type: 'button', class: 'btn ghost icon', title: 'Light or dark', 'aria-label': 'Switch between light and dark', onclick: toggleTheme }, ico('moon')),
        h('button', { type: 'button', class: 'btn ghost icon', title: 'Sign out', 'aria-label': 'Sign out', onclick: signOut }, ico('logout')))),
    h('div', { class: 'main' },
      h('div', { class: 'topbar' },
        onTap(h('button', { class: 'btn ghost menu-btn', 'aria-label': 'Menu' }, h('span', { class: 'bars', 'aria-hidden': 'true' })), () => $('.shell').classList.toggle('menu-open')),
        h('strong', { id: 'topbar-title' }, state.me.appName || 'Studio'),
        h('div', { id: 'topbar-slot', class: 'topbar-slot' }),
        h('div', { id: 'topbar-actions', class: 'topbar-actions' })),
      h('div', { id: 'main', class: 'main', style: { flex: '1' } }))));
  $('.shell').addEventListener('click', e => {
    if (e.target.closest('.nav-item') || (e.target === $('.shell'))) $('.shell').classList.remove('menu-open');
  });
  refreshProjects().catch(fail);
}
export const claudeLabel = () => state.me.claude?.connected ? (state.me.claude.kind === 'subscription' ? 'Claude subscription' : 'Claude API key') : 'Claude not connected';

// The open project's chats, listed under it in the sidebar (filled in by project.js).
export const sideChats = h('div', { class: 'proj-chats chat-list', id: 'chat-list' });
export function renderSideProjects(){
  const el = $('#side-projects');
  if (!el) return;
  const open = location.pathname.match(/^\/p\/([^/]+)/)?.[1];
  el.replaceChildren(...state.projects.flatMap(p => {
    const [dot, words] = projectState(p);
    const row = h('a', { class: 'nav-item', href: `/p/${p.id}`, 'data-link': '', 'data-project': p.id, title: words },
      h('span', { class: 'dot ' + dot }), h('span', { class: 'name' }, p.name));
    return p.id === open ? [row, sideChats] : [row];
  }));
  if (!state.projects.length) el.append(h('p', { class: 'small muted', style: { margin: '4px 10px' } }, 'No projects yet.'));
  markNav(location.pathname);
}
function markNav(path){
  document.querySelectorAll('.side .nav-item').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', !!href && (path === href || (href.startsWith('/p/') && path.startsWith(href + '/')) || (href.startsWith('/p/') && path === href)));
  });
}
// Phones: a page can put its own title control (e.g. the project switcher) and buttons in the top bar. Reset on every route.
export function setTopbar(titleNode, ...actions){
  const t = $('#topbar-title'), slot = $('#topbar-slot'), act = $('#topbar-actions');
  if (!t) return;
  t.hidden = !!titleNode;
  slot.replaceChildren(...(titleNode ? [titleNode] : []));
  act.replaceChildren(...actions.filter(Boolean));
}
// Slides the phone top bar out of the way (e.g. while reading a long chat) and back.
export function hideTopbar(hidden){
  const bar = $('.topbar');
  if (!bar || bar.classList.contains('away') === hidden) return;
  bar.style.marginTop = hidden ? `-${bar.offsetHeight}px` : '';
  bar.classList.toggle('away', hidden);
}
export function setTitle(t){ document.title = t ? `${t} · ${state.me?.appName || 'Studio'}` : (state.me?.appName || 'Studio'); const tt = $('#topbar-title'); if (tt) tt.textContent = t || 'Studio'; }

// ---------- light and dark ----------
function toggleTheme(){
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorageSet('theme', next);
}

// ---------- search and jump (⌘K) ----------
export function openPalette(){
  if (!state.me?.user.twoFactorEnabled || $('dialog.palette')) return;
  const open = location.pathname.match(/^\/p\/([^/]+)/)?.[1];
  const openProject = state.projects.find(p => p.id === open);
  const items = [
    ...state.projects.map(p => ({ group: 'Projects', icon: 'grid', label: p.name, hint: p.team?.name, go: `/p/${p.id}` })),
    ...[...document.querySelectorAll('#chat-list .chat-row a.nav-item')].map(a => ({ group: `Chats in ${openProject?.name || 'this project'}`, icon: 'chat', label: a.querySelector('.name')?.firstChild?.textContent || a.title, go: a.getAttribute('href') })),
    openProject ? { group: 'Actions', icon: 'plus', label: `New chat in ${openProject.name}`, go: `/p/${openProject.id}/chat/new` } : null,
    canCreateProjects() ? { group: 'Actions', icon: 'plus', label: 'New project', run: () => newProjectDialog() } : null,
    { group: 'Actions', icon: 'moon', label: 'Switch between light and dark', run: toggleTheme },
    ...(openProject ? [['Services', 'server', 'services'], ['Changes', 'git', 'changes'], ['Files', 'folder', 'files'], ['Settings', 'sliders', 'settings']].map(([l, i, t]) => ({ group: `Go to in ${openProject.name}`, icon: i, label: l, go: `/p/${openProject.id}/${t}` })) : []),
    { group: 'Go to', icon: 'grid', label: 'Projects home', go: '/' },
    { group: 'Go to', icon: 'users', label: 'Teams and people', go: '/team' },
    state.me.user.role === 'admin' ? { group: 'Go to', icon: 'shield', label: 'Admin', go: '/admin' } : null,
    { group: 'Go to', icon: 'user', label: 'Account', go: '/account' },
  ].filter(Boolean);
  const input = h('input', { type: 'text', placeholder: 'Search projects, chats and pages…', 'aria-label': 'Search', autocomplete: 'off', spellcheck: false });
  const list = h('div', { class: 'palette-list', role: 'listbox' });
  let sel = 0, shown = [];
  const d = dialog(close => {
    const run = it => { close(); if (it.go) go(it.go); else it.run(); };
    const paint = () => {
      const q = input.value.trim().toLowerCase();
      shown = items.filter(it => !q || it.label.toLowerCase().includes(q) || it.group.toLowerCase().includes(q));
      sel = Math.max(0, Math.min(sel, shown.length - 1));
      let last = '';
      list.replaceChildren(...shown.flatMap((it, i) => [it.group !== last ? h('h4', null, last = it.group) : null,
        h('button', { type: 'button', class: 'palette-item' + (i === sel ? ' on' : ''), role: 'option', 'aria-selected': String(i === sel), onclick: () => run(it), onmousemove: () => { if (sel !== i){ sel = i; paint(); } } },
          ico(it.icon), h('span', null, it.label), it.hint ? h('span', { class: 'hint' }, it.hint) : null)]).filter(Boolean),
        shown.length ? null : h('p', { class: 'muted small', style: { padding: '10px 12px', margin: 0 } }, 'Nothing matches.'));
      list.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
    };
    input.oninput = () => { sel = 0; paint(); };
    input.onkeydown = e => {
      if (e.key === 'ArrowDown'){ e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); paint(); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); sel = Math.max(sel - 1, 0); paint(); }
      else if (e.key === 'Enter' && shown[sel]){ e.preventDefault(); run(shown[sel]); }
    };
    paint();
    return h('div', { class: 'palette-body' }, h('div', { class: 'palette-in' }, ico('search'), input, h('span', { class: 'kbd' }, 'esc')), list,
      h('div', { class: 'palette-foot' }, h('span', null, h('span', { class: 'kbd' }, '↑'), ' ', h('span', { class: 'kbd' }, '↓'), ' to move'), h('span', null, h('span', { class: 'kbd' }, '↵'), ' to open')));
  });
  d.el.classList.add('palette');
  d.el.addEventListener('click', e => { if (e.target === d.el) d.close(); });   // a click on the backdrop
  input.focus();
}
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPalette(); }
});

async function signOut(){
  await disablePush().catch(() => {});   // a signed-out browser shouldn't keep getting someone's notifications
  try { await authApi('/sign-out'); } catch {}
  state.me = null; state.projects = [];
  location.href = '/login';
}

// ---------- sign-in screens ----------
// Sign-in screens: a navy brand panel beside the form (phones show only the form).
function authFrame(card, quote = ['Build, run and ship your projects ', 'with Claude', '.'], line = 'Every project gets its own folder, web address and chats. Your team works on them together.'){
  app.replaceChildren(h('main', { class: 'auth' },
    h('aside', { class: 'auth-side' }, h('div', { class: 'brand' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Devs Studio'),
      h('blockquote', null, quote[0], h('em', null, quote[1]), quote[2]), h('p', null, line)),
    h('div', { class: 'auth-main' }, card)));
}
function authPage(...children){
  authFrame(h('div', { class: 'auth-card' }, h('div', { class: 'brand only-phone' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Devs Studio'), ...children));
}
const errBox = () => h('div', { class: 'error-box', role: 'alert', hidden: true });
function showErr(box, e){ box.hidden = false; box.textContent = e.message || String(e); }

function loginScreen(){
  document.title = 'Sign in · ZTD Devs Studio';
  const next = safeNext(qs().get('next'));
  const email = h('input', { type: 'email', autocomplete: 'username', required: true, autofocus: true });
  const pw = h('input', { type: 'password', autocomplete: 'current-password', required: true });
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '18px' } }, 'Sign in');
  authPage(
    h('h1', null, 'Sign in'),
    h('form', { onsubmit: async e => {
      e.preventDefault(); box.hidden = true;
      try {
        await busy(btn, async () => {
          const r = await authApi('/sign-in/email', { email: email.value.trim(), password: pw.value, rememberMe: true });
          if (r.twoFactorRedirect) return totpScreen(next);
          state.me = null; afterSignIn(next);
        }, 'Signing in…');
      } catch (e){ showErr(box, e.status === 401 || /invalid/i.test(e.message) ? new Error('That email and password don’t match.') : e); }
    } }, box, field('Email', email), field('Password', pw), btn),
    h('p', { class: 'small', style: { marginTop: '16px' } }, h('a', { href: '/forgot', 'data-link': '' }, 'Forgotten your password?')));
}

function afterSignIn(next){
  // Project subdomains hand back through /api/gate, which is a server route, not an app page.
  if (next.startsWith('/api/gate')) location.href = next; else go(next, true);
}

function totpScreen(next){
  let backup = false;
  const code = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', required: true, autofocus: true, maxlength: 20 });
  const trust = h('input', { type: 'checkbox' });
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '14px' } }, 'Verify');
  const label = h('label', { for: 'code' }, 'Code from your authenticator app');
  code.id = 'code';
  const toggle = h('button', { type: 'button', class: 'btn ghost small', onclick: () => {
    backup = !backup;
    label.textContent = backup ? 'One of your backup codes' : 'Code from your authenticator app';
    code.inputMode = backup ? 'text' : 'numeric';
    toggle.textContent = backup ? 'Use your authenticator app instead' : 'Use a backup code instead';
    code.focus();
  } }, 'Use a backup code instead');
  authPage(
    h('h1', null, 'Two-step check'),
    h('p', { class: 'muted' }, 'Open your authenticator app and enter the 6-digit code for ZTD Devs Studio.'),
    h('form', { onsubmit: async e => {
      e.preventDefault(); box.hidden = true;
      try {
        await busy(btn, async () => {
          await authApi(backup ? '/two-factor/verify-backup-code' : '/two-factor/verify-totp', { code: code.value.replace(/\s/g, ''), trustDevice: trust.checked });
          state.me = null; afterSignIn(next);
        }, 'Checking…');
      } catch (e){ showErr(box, /invalid/i.test(e.message) ? new Error('That code didn’t work. Codes change every 30 seconds, so try the newest one.') : e); }
    } }, box, label, code, h('label', { class: 'check' }, trust, 'Trust this device for 30 days'), btn),
    h('div', { style: { marginTop: '10px' } }, toggle));
}

function forgotScreen(){
  document.title = 'Reset password · ZTD Devs Studio';
  const email = h('input', { type: 'email', autocomplete: 'username', required: true, autofocus: true });
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '16px' } }, 'Send reset link');
  const form = h('form', { onsubmit: async e => {
    e.preventDefault(); box.hidden = true;
    try {
      await busy(btn, () => authApi('/request-password-reset', { email: email.value.trim(), redirectTo: '/reset-password' }), 'Sending…');
      form.replaceWith(h('div', { class: 'ok-box' }, 'If that email has an account, a reset link is on its way. It works for one hour. If no email arrives, ask a Studio admin: they can give you a link from the Admin page.'));
    } catch (e){ showErr(box, e); }
  } }, box, field('Your email', email), btn);
  authPage(h('h1', null, 'Reset your password'), form, h('p', { class: 'small', style: { marginTop: '16px' } }, h('a', { href: '/login', 'data-link': '' }, 'Back to sign in')));
}

function passwordFields(){
  const pw = h('input', { type: 'password', autocomplete: 'new-password', required: true, minlength: 12 });
  const pw2 = h('input', { type: 'password', autocomplete: 'new-password', required: true, minlength: 12 });
  return { pw, pw2, nodes: [field('New password', pw, 'at least 12 characters'), field('Type it again', pw2)],
    check(){ if (pw.value.length < 12) throw new Error('Use at least 12 characters. A short sentence works well.'); if (pw.value !== pw2.value) throw new Error('The two passwords don’t match.'); return pw.value; } };
}

function resetScreen(){
  document.title = 'Choose a password · ZTD Devs Studio';
  const token = qs().get('token') || location.pathname.split('/').pop();
  const f = passwordFields();
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '16px' } }, 'Save password');
  authPage(h('h1', null, 'Choose a password'),
    h('p', { class: 'muted' }, 'After saving, sign in with your new password. You’ll be signed out everywhere else.'),
    h('form', { onsubmit: async e => {
      e.preventDefault(); box.hidden = true;
      try {
        const pw = f.check();
        await busy(btn, () => authApi('/reset-password', { newPassword: pw, token }), 'Saving…');
        toast('Password saved. Sign in now.');
        go('/login', true);
      } catch (e){ showErr(box, /invalid|expired/i.test(e.message) ? new Error('This link has expired or was already used. Ask for a new one.') : e); }
    } }, box, ...f.nodes, btn));
}

async function inviteScreen(id){
  document.title = 'Invitation · ZTD Devs Studio';
  let inv;
  try { inv = await api('GET', `/api/invite/${encodeURIComponent(id)}`); }
  catch (e){ return authPage(h('h1', null, 'Invitation'), h('div', { class: 'error-box' }, e.message)); }
  if (inv.status !== 'pending') return authPage(h('h1', null, 'Invitation'), h('div', { class: 'note' },
    inv.status === 'accepted' ? 'This invitation has already been accepted. Sign in instead.' : inv.status === 'expired' ? 'This invitation has expired. Ask for a new one.' : 'This invitation is no longer valid.'),
    h('a', { class: 'btn', href: '/login', 'data-link': '' }, 'Sign in'));
  await loadMe();
  const accept = async () => { await authApi('/organization/accept-invitation', { invitationId: id }); state.me = null; toast(`You've joined ${inv.teamName}.`); go('/', true); };
  const intro = h('p', null, `${inv.inviterName || 'Someone'} invited `, h('strong', null, inv.email), ` to join `, h('strong', null, inv.teamName), ` as ${inv.role === 'member' ? 'a member' : 'an ' + inv.role}.`);
  if (state.me){
    if (state.me.user.email.toLowerCase() !== inv.email.toLowerCase())
      return authPage(h('h1', null, 'Invitation'), intro, h('div', { class: 'note' }, `You're signed in as ${state.me.user.email}. Sign out, then open this link again.`),
        h('button', { class: 'btn', onclick: async () => { await authApi('/sign-out').catch(() => {}); location.reload(); } }, 'Sign out'));
    const btn = h('button', { class: 'btn primary block' }, `Join ${inv.teamName}`);
    btn.onclick = () => busy(btn, accept, 'Joining…');
    return authPage(h('h1', null, 'Join the team'), intro, btn);
  }
  if (inv.hasAccount) return authPage(h('h1', null, 'Join the team'), intro, h('p', null, 'You already have an account. Sign in, then open this link again.'),
    h('a', { class: 'btn primary block', href: `/login?next=${encodeURIComponent('/invite/' + id)}`, 'data-link': '' }, 'Sign in'));
  const name = h('input', { type: 'text', autocomplete: 'name', required: true, autofocus: true, maxlength: 80 });
  const f = passwordFields();
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '16px' } }, 'Create account and join');
  authPage(h('h1', null, 'Create your account'), intro,
    h('form', { onsubmit: async e => {
      e.preventDefault(); box.hidden = true;
      try {
        const pw = f.check();
        await busy(btn, async () => {
          await authApi('/sign-up/email', { email: inv.email, password: pw, name: name.value.trim() });
          await authApi('/organization/accept-invitation', { invitationId: id });
          state.me = null;
          go('/', true);
        }, 'Creating…');
      } catch (e){ showErr(box, e); }
    } }, box, field('Email', h('input', { type: 'email', value: inv.email, disabled: true })), field('Your name', name), ...f.nodes,
    h('p', { class: 'small muted' }, 'Next you’ll set up two-step sign-in with an authenticator app. Studio requires it for everyone.'), btn));
}

// Required for everyone before using Studio.
export function mfaSetupScreen(){
  document.title = 'Set up two-step sign-in · ZTD Devs Studio';
  const pw = h('input', { type: 'password', autocomplete: 'current-password', required: true, autofocus: true });
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '16px' } }, 'Continue');
  authFrame(h('div', { class: 'auth-card wide', id: 'mfa-card' }), ['One more step and ', 'you’re in', '.'], 'Studio can change and run code on the server, so every account signs in with an authenticator app as well as a password.');
  const card = $('#mfa-card');
  card.append(h('div', { class: 'brand only-phone' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Devs Studio'),
    h('div', { class: 'progress' }, h('i', { class: 'on' }), h('i'), h('i')),
    h('h1', null, 'Set up two-step sign-in'),
    h('p', { class: 'muted' }, 'Studio can change and run code on the server, so every account needs an authenticator app such as Google Authenticator, Microsoft Authenticator, 1Password or Authy.'),
    h('form', { onsubmit: async e => {
      e.preventDefault(); box.hidden = true;
      try {
        const r = await busy(btn, () => authApi('/two-factor/enable', { password: pw.value }), 'Starting…');
        step2(r);
      } catch (e){ showErr(box, /password/i.test(e.message) ? new Error('That password isn’t right.') : e); }
    } }, box, field('Your password', pw), btn),
    h('p', { class: 'small', style: { marginTop: '14px' } }, h('a', { href: '#', onclick: e => { e.preventDefault(); signOut(); } }, 'Sign out')));

  function step2({ totpURI, backupCodes }){
    const secret = new URL(totpURI).searchParams.get('secret');
    const code = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', required: true, maxlength: 8 });
    const box2 = errBox();
    const btn2 = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '16px' } }, 'Turn on two-step sign-in');
    card.replaceChildren(h('div', { class: 'brand only-phone' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Devs Studio'),
      h('div', { class: 'progress' }, h('i', { class: 'on' }), h('i', { class: 'on' }), h('i')),
      h('h1', null, 'Scan this code'),
      h('p', { class: 'muted' }, '1. In your authenticator app, add an account and scan the QR code.'),
      h('div', { class: 'qr' }, h('img', { src: '/api/qr?text=' + encodeURIComponent(totpURI), width: 200, height: 200, alt: 'QR code for your authenticator app' })),
      h('p', { class: 'small muted' }, 'Can’t scan? Enter this key instead:'), h('div', { class: 'secret' }, secret),
      h('p', { class: 'muted', style: { marginTop: '16px' } }, '2. Save these backup codes somewhere safe, like a password manager. Each one works once if you lose your phone.'),
      h('div', { class: 'codes' }, backupCodes.map(c => h('span', null, c))),
      h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { type: 'button', class: 'btn small', onclick: () => navigator.clipboard.writeText(backupCodes.join('\n')).then(() => toast('Backup codes copied')) }, 'Copy backup codes')),
      h('form', { onsubmit: async e => {
        e.preventDefault(); box2.hidden = true;
        try {
          await busy(btn2, () => authApi('/two-factor/verify-totp', { code: code.value.replace(/\s/g, '') }), 'Checking…');
          toast('Two-step sign-in is on.');
          state.me = null;
          const next = safeNext(qs().get('next'));
          afterSignIn(next === '/account' ? '/' : next);
        } catch (e){ showErr(box2, /invalid/i.test(e.message) ? new Error('That code didn’t match. Use the newest code in the app.') : e); }
      } }, box2, field('3. Enter the 6-digit code the app shows', code), btn2));
    code.focus();
  }
}

// ---------- start ----------
route().catch(e => {
  authPage(h('h1', null, 'Studio isn’t responding'), h('p', null, e.message), h('button', { class: 'btn', onclick: () => location.reload() }, 'Try again'));
});
// Keep the side list fresh (status dots, Claude activity).
setInterval(() => { if (state.me?.user.twoFactorEnabled && document.visibilityState === 'visible') refreshProjects().catch(() => {}); }, 8000);
