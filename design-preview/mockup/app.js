// The redesign mock-up: a hash router over every screen, plus dialogs, the ⌘K palette, menus, toasts and light/dark.
import { ico, DOMAIN } from './kit.js';
import { authScreens } from './screens-auth.js';
import { projectScreens } from './screens-project.js';
import { studioScreens } from './screens-studio.js';

// Every screen, as the Preview menu lists them.
const SCREENS = [
  ['Sign-in screens', [['login', 'Sign in'], ['login-error', 'Sign in: wrong password'], ['two-step', 'Two-step check'], ['forgot', 'Forgotten password'], ['forgot-sent', 'Reset link sent'], ['reset', 'Choose a password'], ['invite', 'Invitation: new account'], ['mfa', 'Set up two-step sign-in']]],
  ['Studio', [['home', 'Projects home'], ['home-empty', 'Projects home: no projects yet'], ['account', 'Account'], ['account-connect', 'Account: connect Claude'], ['teams', 'Teams and people'], ['admin', 'Admin']]],
  ['Project', [['p/studio/chat', 'Chat: a finished run'], ['p/studio/chat/files', 'Chat: files, plan only, notices'], ['p/studio/chat/flag', 'Chat: teammate, flag, error, archived'], ['p/pipeline/chat/working', 'Chat: Claude working'], ['p/dental/new', 'New chat'], ['p/pipeline/services', 'Services'], ['p/studio/changes', 'Changes'], ['p/studio/files', 'Files'], ['p/studio/settings', 'Settings']]],
];
const DIALOGS = [['newProject', 'New project'], ['editServices', 'Edit services'], ['chatOptions', 'Archive or delete chat'], ['update', 'Update and restart Studio'], ['deleteProject', 'Delete project'], ['backupCodes', 'New backup codes'], ['apiKey', 'Use an API key'], ['newTeam', 'New team'], ['resetLink', 'Password reset link'], ['palette', 'Search (⌘K)'], ['toast', 'Toast'], ['toastErr', 'Error toast']];

function screenFor(path){
  if (authScreens[path]) return authScreens[path];
  if (studioScreens[path]) return studioScreens[path];
  const m = path.match(/^p\/([a-z]+)\/(chat|new|services|changes|files|settings)(?:\/([a-z]+))?$/);
  if (m){
    const [, , tab, sub] = m;
    if (tab === 'chat') return projectScreens[{ files: 'chat-files', flag: 'chat-flag', working: 'chat-working' }[sub] || 'chat'];
    if (tab === 'new') return projectScreens['new-chat'];
    return projectScreens[tab];
  }
  return studioScreens.home;
}
const root = document.getElementById('root');
function route(){
  const path = location.hash.replace(/^#\/?/, '') || 'home';
  closeAll();
  root.innerHTML = screenFor(path)();
  document.title = `${path} · Studio redesign`;
  paintPanel();
}
addEventListener('hashchange', route);

// ---------- dialogs ----------
const modal = (icon, title, sub, body, foot, { wide = false, bad = false } = {}) => `<div class="modal${wide ? ' wide' : ''}" role="dialog" aria-modal="true">
  <div class="modal-head">${icon ? `<span class="modal-icon${bad ? ' bad' : ''}">${ico(icon)}</span>` : ''}<div style="flex:1"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div><button class="btn ghost icon sm" type="button" data-close aria-label="Close">${ico('x')}</button></div>
  ${body ? `<div class="modal-body">${body}</div>` : ''}<div class="modal-foot">${foot}</div></div>`;
const f = (label, input, hint = '') => `<label class="field"><span>${label}${hint ? ` <em>${hint}</em>` : ''}</span>${input}</label>`;
const cancel = '<button class="btn" type="button" data-close>Cancel</button>';
const MODALS = {
  newProject: () => modal('plus', 'New project', 'It gets its own folder, web address and chats. Ready in under a minute.', `
    ${f('Name', '<input class="input" value="GP Pipeline" autofocus>')}
    ${f('Short name', `<div class="input-wrap"><input class="input mono" value="gp-pipeline"><span class="addon">.${DOMAIN}</span></div>`, 'lowercase; also its web address')}
    <div class="grid2">${f('Team', '<select class="select"><option>ZTD Devs</option><option>Nurseries</option></select>')}${f('Start from', '<select class="select"><option>A blank website</option><option>A public Git repo</option></select>')}</div>
    ${f('Description', '<textarea class="textarea" placeholder="What is it for?"></textarea>', 'Claude reads this at the start of every chat')}`,
    `${cancel}<button class="btn primary" type="button" data-close data-toast="Creating the project. It’s ready in under a minute.">Create project</button>`),
  editServices: () => modal('server', 'Edit services', 'New web addresses get an HTTPS certificate automatically, in about a minute.', `
    <details class="svc-edit" open><summary>${ico('server')} Board <span class="faint small">· board · port 4402</span><span class="spacer"></span><button class="btn ghost sm danger" type="button">Remove</button></summary><div>
      <div class="grid2">${f('Name', '<input class="input mono" value="board">', 'short id')}${f('Label', '<input class="input" value="Board">')}</div>
      ${f('Start command', '<input class="input mono" value="node server.mjs">', 'runs in the project folder; $PORT is set')}
      <div class="grid2">${f('Port', '<input class="input" value="4402">')}${f('Memory limit', '<div class="input-wrap"><input class="input" value="800"><span class="addon">MB</span></div>')}</div>
      ${f('Web address', `<div class="input-wrap"><input class="input mono" value="pipeline"><span class="addon">.${DOMAIN}</span></div>`, 'leave empty for none')}
      ${f('Settings', '<textarea class="textarea mono" style="font-size:12.5px">DATABASE_URL=\nMAPS_KEY=</textarea>', 'values are hidden; leave one empty to keep it')}
      <label class="check"><input type="checkbox" checked><span>Start automatically when the server starts</span></label>
      <label class="check"><input type="checkbox"><span>Public<small>Anyone with the link can open it, no Studio sign-in. For client previews.</small></span></label></div></details>
    <details class="svc-edit"><summary>${ico('server')} Map board <span class="faint small">· mapboard · port 4403</span></summary></details>
    <details class="svc-edit"><summary>${ico('server')} Nurseries sync <span class="faint small">· nurseries · port 4404</span></summary></details>
    <button class="btn ghost" type="button" style="justify-self:start">${ico('plus')} Add a service</button>`,
    `${cancel}<button class="btn primary" type="button" data-close data-toast="Services saved. Restart them to apply new settings.">Save</button>`, { wide: true }),
  chatOptions: () => modal('archive', 'Archive or delete chat', '', `<div class="quote">Hovering a chat shows the full prompt</div><p class="muted" style="margin:0">Archiving moves it under “Archived” at the bottom of the list, where you can still open it.</p>`,
    `<button class="btn danger" type="button" data-open="deleteChat">Delete</button><span class="spacer"></span>${cancel}<button class="btn primary" type="button" data-close data-toast="Chat archived">Archive</button>`),
  deleteChat: () => modal('trash', 'Delete this chat?', '“Hovering a chat shows the full prompt” and its whole conversation are deleted for everyone. This can’t be undone. Changes Claude made to files stay.', '',
    `${cancel}<button class="btn danger solid" type="button" data-close data-toast="Chat deleted">Delete chat</button>`, { bad: true }),
  update: () => modal('download', 'Update and restart Studio?', 'Studio installs the latest committed code and restarts. Running chats stop, and Studio is unavailable for about a minute.', `<div class="callout info">${ico('info')}<span>2 commits: <b>fb17c87</b>, <b>2383c6d</b></span></div>`,
    `${cancel}<button class="btn primary" type="button" data-close data-toast="Studio updated. Reloading…">Update and restart</button>`),
  undoFile: () => modal('undo', 'Undo this file?', 'public/app.css goes back to the last commit. New files are deleted.', '', `${cancel}<button class="btn danger solid" type="button" data-close data-toast="Undone">Undo file</button>`, { bad: true }),
  undoCommit: () => modal('undo', 'Undo the last commit?', 'This adds a new commit that reverses “Design preview: add Paper in the ztddevs.com navy and gold”. Nothing is lost from history.', '', `${cancel}<button class="btn danger solid" type="button" data-close data-toast="Reverted">Undo last commit</button>`, { bad: true }),
  ownUser: () => modal('user', 'Move Studio to its own user?', 'Its services stop while its files move, then start again. Don’t start chats in it until this finishes.', '', `${cancel}<button class="btn primary" type="button" data-close data-toast="Moved: Studio now runs as ztd-studio-src">Move it</button>`),
  deleteProject: () => modal('trash', 'Delete Studio?', 'Its services stop and its web addresses are removed. An admin can recover the folder from the trash.', f('Type studio-src to confirm', '<input class="input mono" value="studio-src">'),
    `${cancel}<button class="btn danger solid" type="button" data-close data-toast="Project deleted">Delete project</button>`, { bad: true }),
  disconnect: () => modal('alert', 'Disconnect Claude?', 'You won’t be able to send prompts until you connect again. Projects that lend your connection to their AI workers stop being able to run them.', '', `${cancel}<button class="btn danger solid" type="button" data-close data-toast="Claude disconnected">Disconnect</button>`, { bad: true }),
  backupCodes: () => modal('key', 'Your new backup codes', 'Save them somewhere safe. Each works once. The old ones have stopped working.', `<div class="codes">${['9XDM-2QK7', 'LZW2-RT4P', 'CEQ6-BN8H', 'A7VK-FJ3Y', 'UMR9-SL5D', 'EP4H-GX2W', 'QY8N-TC6B', 'JDZ3-KV9R'].map(c => `<span>${c}</span>`).join('')}</div>`,
    `<button class="btn" type="button" data-toast="Copied">${ico('copy')} Copy</button><button class="btn" type="button">${ico('download')} Download</button><button class="btn primary" type="button" data-close>Done</button>`),
  apiKey: () => modal('key', 'Use an Anthropic API key', 'Create one at console.anthropic.com. Usage is billed to that Console account, so set a monthly limit there.', f('API key', '<input class="input mono" type="password" placeholder="sk-ant-…">'),
    `${cancel}<button class="btn primary" type="button" data-close data-toast="API key saved">Save key</button>`),
  newTeam: () => modal('users', 'New team', 'People in a team share its projects.', f('Team name', '<input class="input" placeholder="e.g. Nurseries">'), `${cancel}<button class="btn primary" type="button" data-close data-toast="Team created">Create team</button>`),
  removeMember: () => modal('alert', 'Remove Tom Reid?', 'They lose access to ZTD Devs’ projects straight away.', '', `${cancel}<button class="btn danger solid" type="button" data-close data-toast="Tom Reid removed">Remove</button>`, { bad: true }),
  resetLink: () => modal('link', 'Password reset link', 'Send this to tom@ztddevs.com. It works once, for one hour.', `<div class="keybox">https://studio.${DOMAIN}/reset-password?token=8f3c…a91e</div>`, `<button class="btn" type="button" data-toast="Copied">${ico('copy')} Copy</button><button class="btn primary" type="button" data-close>Done</button>`),
};
function openModal(name){
  closeAll();
  if (name === 'palette') return openPalette();
  if (name === 'toast') return toast('Services saved. Restart them to apply new settings.');
  if (name === 'toastErr') return toast('That code didn’t work. Codes change every 30 seconds, so try the newest one.', true);
  const o = document.createElement('div');
  o.className = 'overlay'; o.innerHTML = MODALS[name]();
  document.body.append(o);
  o.querySelector('input, select, textarea, .btn.primary')?.focus();
}
function closeAll(){ document.querySelectorAll('.overlay, .menu').forEach(x => x.remove()); }

// ---------- ⌘K palette ----------
function openPalette(){
  const items = [['Projects', [['grid', 'Studio', '#/p/studio/chat'], ['grid', 'Pipeline', '#/p/pipeline/chat'], ['grid', 'Bright Smile Dental', '#/p/dental/chat'], ['grid', 'Design templates', '#/p/templates/chat']]],
    ['Chats', [['chat', 'Hovering a chat shows the full prompt', '#/p/studio/chat'], ['chat', 'Make the board easier to use on a phone', '#/p/pipeline/chat/working']]],
    ['Actions', [['plus', 'New chat in Studio', '#/p/studio/new', 'N'], ['plus', 'New project', 'modal:newProject'], ['restart', 'Restart Board', 'toast:Board restarted'], ['download', 'Update and restart Studio', 'modal:update'], ['moon', 'Switch light / dark', 'mode', 'D']]],
    ['Go to', [['users', 'Teams and people', '#/teams'], ['shield', 'Admin', '#/admin'], ['user', 'Account', '#/account']]]];
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="palette" role="dialog" aria-label="Search"><div class="palette-in">${ico('search')}<input placeholder="Search projects, chats and actions…" aria-label="Search"><span class="kbd">esc</span></div>
    <div class="palette-list"></div><div class="palette-foot"><span><span class="kbd">↑</span> <span class="kbd">↓</span> to move</span><span><span class="kbd">↵</span> to open</span></div></div>`;
  document.body.append(o);
  const input = o.querySelector('input'), list = o.querySelector('.palette-list');
  let sel = 0, flat = [];
  const paint = () => {
    const q = input.value.toLowerCase();
    flat = [];
    list.innerHTML = items.map(([g, xs]) => { const ys = xs.filter(x => x[1].toLowerCase().includes(q)); flat.push(...ys); return ys.length ? `<h4>${g}</h4>` + ys.map(([i, l, go, k]) => `<a href="#" data-go="${go}">${ico(i)}${l}${k ? `<span class="kbd">${k}</span>` : ''}</a>`).join('') : ''; }).join('') || '<p class="muted" style="padding:10px">Nothing matches.</p>';
    sel = Math.min(sel, flat.length - 1);
    list.querySelectorAll('a').forEach((a, i) => a.classList.toggle('on', i === sel));
  };
  input.oninput = () => { sel = 0; paint(); };
  input.onkeydown = e => {
    if (e.key === 'ArrowDown'){ sel = Math.min(sel + 1, flat.length - 1); paint(); e.preventDefault(); }
    if (e.key === 'ArrowUp'){ sel = Math.max(sel - 1, 0); paint(); e.preventDefault(); }
    if (e.key === 'Enter' && flat[sel]) run(flat[sel][2]);
  };
  list.onclick = e => { const a = e.target.closest('a'); if (a){ e.preventDefault(); run(a.dataset.go); } };
  paint(); input.focus();
}
function run(go){
  closeAll();
  if (go.startsWith('#')) location.hash = go;
  else if (go.startsWith('modal:')) openModal(go.slice(6));
  else if (go.startsWith('toast:')) toast(go.slice(6));
  else if (go === 'mode') setMode(document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark');
}

// ---------- menus ----------
const MENUS = {
  models: () => ['Opus', 'Fable', 'Sonnet', 'Haiku'].map((m, i) => `<button type="button">${i === 0 ? ico('check') : '<span style="width:16px"></span>'} ${m}<span class="spacer"></span><span class="faint tiny">${['Most capable', 'Fast and capable', 'Balanced', 'Quickest'][i]}</span></button>`).join(''),
  person: () => `<button type="button" data-open="resetLink">${ico('link')} Password reset link</button><button type="button" data-toast="Two-step reset">${ico('shield')} Reset two-step</button><button type="button">${ico('shield')} Make admin</button><hr><button class="bad" type="button" data-toast="Suspended">${ico('lock')} Suspend</button><button class="bad" type="button">${ico('trash')} Delete account</button>`,
};
function openMenu(btn, name){
  closeAll();
  const m = document.createElement('div');
  m.className = 'menu'; m.innerHTML = MENUS[name]();
  document.body.append(m);
  const r = btn.getBoundingClientRect();
  const top = r.bottom + 6 + m.offsetHeight > innerHeight ? r.top - m.offsetHeight - 6 : r.bottom + 6;
  m.style.top = top + scrollY + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 10) + 'px';
}

// ---------- toasts and light/dark ----------
function toast(text, err = false){
  let box = document.querySelector('.toasts');
  if (!box){ box = document.createElement('div'); box.className = 'toasts'; document.body.append(box); }
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.innerHTML = `${ico(err ? 'alert' : 'check')}<span>${text}</span>${err ? '' : '<button class="btn sm" type="button">Undo</button>'}`;
  box.append(t); setTimeout(() => t.remove(), err ? 6000 : 3500);
}
function setMode(m){ document.documentElement.dataset.mode = m; try { localStorage.setItem('mock.mode', m); } catch {} paintPanel(); }

// ---------- one listener for everything clickable ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-modal],[data-open],[data-close],[data-toast],[data-menu],[data-palette],[data-mode-toggle],[data-menu-open],.seg button,.switch,[data-idea],[data-send-btn]');
  if (e.target.classList?.contains('overlay')) return closeAll();
  if (!t){ if (!e.target.closest('.menu')) document.querySelectorAll('.menu').forEach(x => x.remove()); return; }
  if (t.matches('[data-modal]')){ e.preventDefault(); e.stopPropagation(); return openModal(t.dataset.modal); }
  if (t.matches('[data-open]')) return openModal(t.dataset.open);
  if (t.matches('[data-toast]')){ const msg = t.dataset.toast; if (t.matches('[data-close]')) closeAll(); return toast(msg); }
  if (t.matches('[data-close]')) return closeAll();
  if (t.matches('[data-menu]')){ e.preventDefault(); return openMenu(t, t.dataset.menu); }
  if (t.matches('[data-palette]')) return openPalette();
  if (t.matches('[data-mode-toggle]')) return setMode(document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark');
  if (t.matches('[data-menu-open]')) return document.querySelector('.app')?.classList.toggle('menu-open');
  if (t.matches('.seg button')) return t.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === t));
  if (t.matches('.switch')) return t.classList.toggle('on');
  if (t.matches('[data-idea]')){ const ta = document.querySelector('[data-send]'); ta.value = t.textContent.trim(); ta.focus(); return; }
  if (t.matches('[data-send-btn]')) return send();
});
document.addEventListener('click', e => { if (e.target.classList?.contains('app') || (e.target.closest('.side .nav-item') && !e.target.closest('[data-modal]'))) document.querySelector('.app')?.classList.remove('menu-open'); });
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPalette(); return; }
  if (e.key === 'Escape') closeAll();
  if (e.target.closest('input, textarea, select')){ if (e.key === 'Enter' && !e.shiftKey && e.target.matches('[data-send]')){ e.preventDefault(); send(); } return; }
  if (e.key === 'd') setMode(document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark');
});
// Sending a message: the bubble goes in, Claude "works" for a moment, then answers.
function send(){
  const ta = document.querySelector('[data-send]'), inner = document.querySelector('.thread-inner') || (() => { const t = document.querySelector('.thread'); t.innerHTML = '<div class="thread-inner"></div>'; return t.firstChild; })();
  if (!ta?.value.trim()) return;
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  inner.insertAdjacentHTML('beforeend', `<div class="msg-user"><div class="bubble">${esc(ta.value.trim())}</div></div><div class="working" id="w"><span class="dot busy"></span> Claude is working <span class="bar"></span></div>`);
  ta.value = '';
  inner.parentNode.scrollTop = 1e6;
  setTimeout(() => { document.getElementById('w')?.remove(); inner.insertAdjacentHTML('beforeend', `<div class="ai"><div class="ai-head"><span class="logo" style="width:20px;height:20px">${document.querySelector('.brand .logo')?.innerHTML || ''}</span> Claude <span>· Opus · Edit</span></div><div class="md"><p>This is the design mock-up, so nothing really changed. In Studio, Claude would now read the files, make the change and tell you what to check.</p></div></div><div class="result"><span>${ico('clock')} 3 s</span><span>${ico('bolt')} 2 steps</span></div>`); inner.parentNode.scrollTop = 1e6; }, 2200);
}

// ---------- the Preview menu (not part of the design) ----------
const pvBtn = document.createElement('button');
pvBtn.className = 'pv-btn'; pvBtn.type = 'button'; pvBtn.innerHTML = '<i></i><span>Screens</span>';
const pv = document.createElement('div'); pv.className = 'pv-panel'; pv.hidden = true;
pvBtn.onclick = () => { pv.hidden = !pv.hidden; paintPanel(); };
document.addEventListener('pointerdown', e => { if (!pv.hidden && !pv.contains(e.target) && !pvBtn.contains(e.target)) pv.hidden = true; });
function paintPanel(){
  if (pv.hidden) return;
  const here = location.hash.replace(/^#\/?/, '') || 'home', mode = document.documentElement.dataset.mode;
  pv.innerHTML = `<h4>Look</h4><div class="pv-seg"><button type="button" data-m="light" class="${mode !== 'dark' ? 'on' : ''}">Light</button><button type="button" data-m="dark" class="${mode === 'dark' ? 'on' : ''}">Dark</button></div>` +
    SCREENS.map(([g, xs]) => `<h4>${g}</h4>` + xs.map(([p, l]) => `<a href="#/${p}" class="${p === here ? 'on' : ''}">${l}</a>`).join('')).join('') +
    `<h4>Dialogs and messages</h4>${DIALOGS.map(([k, l]) => `<a href="#" data-d="${k}">${l}</a>`).join('')}<h4>Emails</h4><a href="/emails/">Every email Studio sends</a><p>Press ⌘K or Ctrl+K anywhere to search. D switches light and dark. Narrow the window below 860 px for phones.</p>`;
}
pv.addEventListener('click', e => {
  const m = e.target.closest('[data-m]'); if (m) return setMode(m.dataset.m);
  const d = e.target.closest('[data-d]'); if (d){ e.preventDefault(); pv.hidden = true; openModal(d.dataset.d); return; }
  if (e.target.closest('a')) pv.hidden = true;
});
document.body.append(pv, pvBtn);
route();
