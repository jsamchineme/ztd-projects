// ZTD Studio front end: routing, sign-in screens and the app shell.
import { h, $, api, authApi, toast, fail, busy, dialog, field, initials, ApiError } from './ui.js';
import { renderProject, newProjectDialog } from './project.js';
import { renderAccount, renderTeams, renderAdmin } from './people.js';

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
  const main = $('#main');
  main.replaceChildren();
  const pm = path.match(/^\/p\/([^/]+)(?:\/([a-z]+))?(?:\/([^/]+))?/);
  markNav(path);
  if (pm) return renderProject(main, pm[1], pm[2] || 'chat', pm[3]);
  if (path === '/account') return renderAccount(main);
  if (path === '/team') return renderTeams(main);
  if (path === '/admin') return renderAdmin(main);
  // Home: open the most recent project, or welcome.
  if (!state.projects.length) await refreshProjects();
  const last = localStorageGet('lastProject');
  const p = state.projects.find(x => x.id === last) || state.projects[0];
  if (p) return go(`/p/${p.id}`, true);
  main.append(h('div', { class: 'page' }, h('div', { class: 'page-inner' },
    h('h1', null, `Welcome, ${state.me.user.name.split(' ')[0]}`),
    h('p', { class: 'muted' }, 'There are no projects yet.'),
    canCreateProjects() ? h('button', { class: 'btn primary', onclick: () => newProjectDialog() }, 'New project')
      : h('p', null, 'Ask a team admin to add you to a team with projects.'))));
}

export function localStorageGet(k){ try { return localStorage.getItem('studio.' + k); } catch { return null; } }
export function localStorageSet(k, v){ try { localStorage.setItem('studio.' + k, v); } catch {} }
export const canCreateProjects = () => state.me?.user.role === 'admin' || state.me?.teams.some(t => ['owner', 'admin'].includes(t.role));

// ---------- shell ----------
function shell(){
  if ($('.shell')) return;
  const me = state.me.user;
  app.replaceChildren(h('div', { class: 'shell' },
    h('aside', { class: 'side', 'aria-label': 'Studio navigation' },
      h('div', { class: 'side-top' },
        h('div', { class: 'brand' }, h('img', { src: '/icon.svg', alt: '' }), state.me.appName || 'Studio'),
        canCreateProjects() ? h('button', { class: 'btn block', onclick: () => newProjectDialog() }, '+ New project') : null),
      h('nav', null,
        h('h2', null, 'Projects'),
        h('div', { id: 'side-projects' }),
        h('h2', null, 'Studio'),
        h('a', { class: 'nav-item', href: '/team', 'data-link': '' }, h('span', { class: 'name' }, 'Teams and people')),
        me.role === 'admin' ? h('a', { class: 'nav-item', href: '/admin', 'data-link': '' }, h('span', { class: 'name' }, 'Admin')) : null),
      h('div', { class: 'side-bottom' },
        h('a', { class: 'nav-item', href: '/account', 'data-link': '' },
          h('span', { class: 'avatar' }, initials(me.name)),
          h('span', { class: 'name' }, me.name, h('br'), h('span', { class: 'small muted', id: 'side-claude' }, claudeLabel()))),
        h('button', { class: 'nav-item', onclick: signOut }, h('span', { class: 'name muted' }, 'Sign out')))),
    h('div', { class: 'main' },
      h('div', { class: 'topbar' },
        h('button', { class: 'btn ghost small', 'aria-label': 'Menu', onclick: () => $('.shell').classList.toggle('menu-open') }, '☰'),
        h('strong', { id: 'topbar-title' }, state.me.appName || 'Studio')),
      h('div', { id: 'main', class: 'main', style: { flex: '1' } }))));
  $('.shell').addEventListener('click', e => {
    if (e.target.closest('.nav-item') || (e.target === $('.shell'))) $('.shell').classList.remove('menu-open');
  });
  refreshProjects().catch(fail);
}
export const claudeLabel = () => state.me.claude?.connected ? (state.me.claude.kind === 'subscription' ? 'Claude subscription' : 'Claude API key') : 'Claude not connected';

export function renderSideProjects(){
  const el = $('#side-projects');
  if (!el) return;
  el.replaceChildren(...state.projects.map(p => {
    const states = p.services.map(s => s.status.state);
    const dot = p.running ? 'busy' : states.includes('crashed') ? 'crashed' : states.includes('running') ? 'running' : states.includes('starting') ? 'starting' : '';
    return h('a', { class: 'nav-item', href: `/p/${p.id}`, 'data-link': '', 'data-project': p.id, title: p.running ? 'Claude is working' : '' },
      h('span', { class: 'dot ' + dot }), h('span', { class: 'name' }, p.name));
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
export function setTitle(t){ document.title = t ? `${t} · ${state.me?.appName || 'Studio'}` : (state.me?.appName || 'Studio'); const tt = $('#topbar-title'); if (tt) tt.textContent = t || 'Studio'; }

async function signOut(){
  try { await authApi('/sign-out'); } catch {}
  state.me = null; state.projects = [];
  location.href = '/login';
}

// ---------- sign-in screens ----------
function authPage(...children){
  app.replaceChildren(h('main', { class: 'auth' }, h('div', { class: 'auth-card' },
    h('div', { class: 'brand' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Studio'), ...children)));
}
const errBox = () => h('div', { class: 'error-box', role: 'alert', hidden: true });
function showErr(box, e){ box.hidden = false; box.textContent = e.message || String(e); }

function loginScreen(){
  document.title = 'Sign in · ZTD Studio';
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
    h('p', { class: 'muted' }, 'Open your authenticator app and enter the 6-digit code for ZTD Studio.'),
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
  document.title = 'Reset password · ZTD Studio';
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
  document.title = 'Choose a password · ZTD Studio';
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
  document.title = 'Invitation · ZTD Studio';
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
  document.title = 'Set up two-step sign-in · ZTD Studio';
  const pw = h('input', { type: 'password', autocomplete: 'current-password', required: true, autofocus: true });
  const box = errBox();
  const btn = h('button', { class: 'btn primary block', type: 'submit', style: { marginTop: '16px' } }, 'Continue');
  app.replaceChildren(h('main', { class: 'auth' }, h('div', { class: 'auth-card wide', id: 'mfa-card' })));
  const card = $('#mfa-card');
  card.append(h('div', { class: 'brand' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Studio'),
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
    card.replaceChildren(h('div', { class: 'brand' }, h('img', { src: '/icon.svg', alt: '' }), 'ZTD Studio'),
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
  app.replaceChildren(h('main', { class: 'auth' }, h('div', { class: 'auth-card' }, h('h1', null, 'Studio isn’t responding'), h('p', null, e.message),
    h('button', { class: 'btn', onclick: () => location.reload() }, 'Try again'))));
});
// Keep the side list fresh (status dots, Claude activity).
setInterval(() => { if (state.me?.user.twoFactorEnabled && document.visibilityState === 'visible') refreshProjects().catch(() => {}); }, 8000);
