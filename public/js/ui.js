// Shared UI helpers: DOM builder, icons, toast, confirm dialog, avatars.
// Exposed as ES exports AND on window for convenience across views.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

// Minimal lucide-style icon set (stroke paths). icon('inbox') -> <svg>.
const PATHS = {
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z"/>',
  star: '<path d="m12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  archive: '<rect x="2" y="4" width="20" height="5" rx="1"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/>',
  spam: '<path d="m21.7 16.6-9-15.5a.75.75 0 0 0-1.3 0l-9 15.5A.75.75 0 0 0 3 18h18a.75.75 0 0 0 .7-1.4Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  compose: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  reply: '<path d="M9 17 4 12l5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
  replyAll: '<path d="m7 17-5-5 5-5"/><path d="m12 17-5-5 5-5"/><path d="M22 18v-2a4 4 0 0 0-4-4H7"/>',
  forward: '<path d="m15 17 5-5-5-5"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  draft: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  paperclip: '<path d="m21.4 11.1-9.2 9.2a5 5 0 0 1-7-7l9.2-9.2a3 3 0 0 1 4.3 4.3l-9.2 9.2a1 1 0 0 1-1.4-1.4l8.5-8.5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  dots: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l6.4-6.4a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};
export function icon(name, cls = 'icon') {
  const svg = `<svg class="${cls}" viewBox="0 0 24 24">${PATHS[name] || ''}</svg>`;
  const tpl = document.createElement('template');
  tpl.innerHTML = svg.trim();
  return tpl.content.firstChild;
}

const AVATAR_COLORS = ['#2563eb', '#16a34a', '#db2777', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#4f46e5', '#059669'];
export function avatarColor(seed = '') {
  let n = 0; for (const c of String(seed)) n = (n + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[n];
}
export function initials(nameOrAddr = '') {
  const s = String(nameOrAddr).trim();
  if (!s) return '?';
  const parts = s.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || s[0].toUpperCase();
}
export function avatar(nameOrAddr, size = 34) {
  return h('div', { class: 'avatar', style: { width: size + 'px', height: size + 'px', background: avatarColor(nameOrAddr), fontSize: Math.round(size * 0.38) + 'px' } }, initials(nameOrAddr));
}

export function toast(msg, type = '') {
  const box = document.getElementById('toasts');
  const t = h('div', { class: 'toast ' + (type || '') }, msg);
  box.append(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 200); }, 3000);
}

export function confirmDialog(msg, { confirmText = 'Confirm', danger = false } = {}) {
  return new Promise((resolve) => {
    const close = (v) => { overlay.remove(); resolve(v); };
    const overlay = h('div', { class: 'overlay', onClick: (e) => { if (e.target === overlay) close(false); } },
      h('div', { class: 'dialog' },
        h('p', { style: { margin: '0 0 20px' } }, msg),
        h('div', { class: 'row-flex', style: { justifyContent: 'flex-end' } },
          h('button', { class: 'btn btn-ghost', onClick: () => close(false) }, 'Cancel'),
          h('button', { class: 'btn ' + (danger ? 'btn-destructive' : 'btn-primary'), onClick: () => close(true) }, confirmText),
        ),
      ));
    document.body.append(overlay);
  });
}

export function relTime(iso) {
  if (!iso) return '';
  const d = new Date(iso), now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const days = Math.round((now - d) / 86400000);
  if (days < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// expose on window for views that prefer globals
Object.assign(window, { h, icon, avatar, avatarColor, initials, toast, confirmDialog, relTime });
