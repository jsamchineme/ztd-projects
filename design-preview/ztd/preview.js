// The floating "Preview" menu: jumps to every screen of Studio, opens dialogs and toasts, and switches light/dark.
// Only part of the design preview; Studio itself never loads this.
import { toast, confirmDialog } from '/ui.js';

const SCREENS = [
  ['Sign-in screens', [
    ['Sign in', '/login', 'out', 'Any email and password. Type “wrong” as the password to see the error.'],
    ['Two-step check', '/login', 'out', 'Sign in first; the code screen follows. 000000 shows the error.'],
    ['Forgotten password', '/forgot', 'out'],
    ['Choose a new password', '/reset-password?token=preview', 'out'],
    ['Invitation: new account', '/invite/inv1', 'out'],
    ['Set up two-step sign-in', '/', 'mfa', 'Any password continues to the QR code.'],
  ]],
  ['Project', [
    ['Chat: a finished run', '/p/p1/chat/c1', 'Tools, thinking, markdown, a table, the update bar'],
    ['Chat: files and notices', '/p/p1/chat/c2'],
    ['Chat: teammate, flag, error', '/p/p1/chat/c4'],
    ['Chat: Claude working', '/p/p2/chat/c6', 'Plays a live run'],
    ['New chat (empty)', '/p/p3/chat/new', 'Send a message to watch a fake run'],
    ['Services', '/p/p2/services', 'Running, crashed, internal; Logs and Edit services'],
    ['Services: certificate failed', '/p/p4/services'],
    ['Changes', '/p/p1/changes', 'Files, diff, commit, recent commits'],
    ['Files', '/p/p1/files', 'This repo’s real files'],
    ['Settings', '/p/p1/settings'],
  ]],
  ['Studio', [
    ['Account', '/account'],
    ['Teams and people', '/team'],
    ['Admin', '/admin', 'Update, email, focus, backup, people, activity'],
  ]],
];
const ACTIONS = [
  ['New project dialog', async () => (await import('/project.js')).newProjectDialog()],
  ['Confirm dialog', () => confirmDialog('Delete this chat?', '“Make the board easier to use on a phone” and its whole conversation are deleted for everyone. This can’t be undone.', 'Delete chat', true)],
  ['Toast', () => toast('Services saved. Restart them to apply new settings.')],
  ['Error toast', () => toast('That code didn’t work. Codes change every 30 seconds, so try the newest one.', true)],
];

const css = `
.pv-btn { position: fixed; right: 16px; bottom: 16px; z-index: 1000; display: flex; align-items: center; gap: 8px; padding: 8px 14px 8px 10px; border-radius: 999px; border: 1px solid #2c3a4d;
  background: #0b1220; color: #fff; font: 600 13px/1 "DM Sans", system-ui, sans-serif; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
.pv-btn i { width: 8px; height: 8px; border-radius: 50%; background: #ffc349; }
.pv-panel { position: fixed; right: 16px; bottom: 60px; z-index: 1000; width: 330px; max-height: calc(100dvh - 90px); overflow: auto; padding: 14px; border-radius: 16px;
  background: #0b1220; color: #dfe6ef; font: 13px/1.4 "DM Sans", system-ui, sans-serif; box-shadow: 0 20px 60px rgba(0,0,0,.4); border: 1px solid #23324a; }
.pv-panel h4 { margin: 12px 4px 6px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #8494a9; font-weight: 600; }
.pv-panel h4:first-child { margin-top: 0; }
.pv-panel a, .pv-panel button.pv-act { display: block; width: 100%; text-align: left; padding: 6px 8px; border-radius: 8px; color: #fff; text-decoration: none; background: none; border: 0; font: inherit; cursor: pointer; }
.pv-panel a:hover, .pv-panel button.pv-act:hover { background: #17233a; }
.pv-panel a small { display: block; color: #8494a9; }
.pv-panel a.on { background: #17233a; box-shadow: inset 3px 0 0 #ffc349; }
.pv-seg { display: flex; gap: 4px; background: #17233a; padding: 3px; border-radius: 10px; }
.pv-seg button { flex: 1; border: 0; border-radius: 8px; padding: 6px; background: none; color: #c3cfdd; font: inherit; cursor: pointer; }
.pv-seg button.on { background: #fff; color: #0b1220; font-weight: 600; }
.pv-foot { display: flex; gap: 6px; margin-top: 12px; }
.pv-foot a, .pv-foot button { flex: 1; text-align: center; padding: 7px; border-radius: 8px; border: 1px solid #2c3a4d; background: none; color: #fff; font: inherit; cursor: pointer; text-decoration: none; }
.pv-note { color: #8494a9; margin: 2px 4px 0; }
@media (max-width: 860px) { .pv-btn { top: 70px; bottom: auto; right: 8px; padding: 8px; } .pv-btn span { display: none; } .pv-panel { top: 112px; bottom: auto; right: 8px; left: 8px; width: auto; max-height: calc(100dvh - 130px); } }
`;
document.head.append(Object.assign(document.createElement('style'), { textContent: css }));

const el = (tag, attrs = {}, ...kids) => { const e = Object.assign(document.createElement(tag), attrs); e.append(...kids); return e; };
const panel = el('div', { className: 'pv-panel', hidden: true, role: 'dialog', ariaLabel: 'Design preview' });
const btn = el('button', { className: 'pv-btn', type: 'button', title: 'Design preview: every screen, light and dark' }, el('i'), el('span', {}, 'Preview'));
btn.onclick = () => { panel.hidden = !panel.hidden; if (!panel.hidden) paint(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') panel.hidden = true; });
document.addEventListener('pointerdown', e => { if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) panel.hidden = true; });

const setCookie = (k, v) => { document.cookie = v ? `${k}=${v}; path=/; SameSite=Lax` : `${k}=; Max-Age=0; path=/`; };
function open(path, as){
  setCookie('pv_out', as === 'out' ? '1' : ''); setCookie('pv_mfa', as === 'mfa' ? '1' : '');
  location.href = path;
}
function theme(t){
  try { t ? localStorage.setItem('pv.theme', t) : localStorage.removeItem('pv.theme'); } catch {}
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  paint();
}
function paint(){
  const cur = document.documentElement.dataset.theme || '';
  const here = location.pathname + location.search;
  panel.replaceChildren(
    el('h4', {}, 'Look'),
    el('div', { className: 'pv-seg' }, ...[['', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => el('button', { type: 'button', className: cur === v ? 'on' : '', onclick: () => theme(v) }, l))),
    ...SCREENS.flatMap(([group, items]) => [el('h4', {}, group), ...items.map(([label, path, as, hint]) => {
      if (as && as !== 'out' && as !== 'mfa'){ hint = as; as = null; }
      const a = el('a', { href: path, className: here === path ? 'on' : '' }, label, hint ? el('small', {}, hint) : '');
      a.onclick = e => { e.preventDefault(); open(path, as); };
      return a;
    })]),
    el('h4', {}, 'Dialogs and messages'),
    ...ACTIONS.map(([label, fn]) => el('button', { type: 'button', className: 'pv-act', onclick: () => { panel.hidden = true; fn(); } }, label)),
    el('p', { className: 'pv-note' }, 'Phone layout: make the window narrower than 860 px. Everything here is made-up data.'),
    el('div', { className: 'pv-foot' },
      el('button', { type: 'button', onclick: async () => { await fetch('/__preview/reset', { method: 'POST' }); location.href = '/p/p1/chat/c1'; } }, 'Reset data'),
      el('a', { href: '/options' }, 'Style options')));
}
document.body.append(panel, btn);
