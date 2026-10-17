// Small helpers shared by every view: DOM building, API calls, toasts, dialogs and markdown.

// Views pass optional pieces as `cond ? node : null`; skip those everywhere instead of printing "null".
for (const name of ['append', 'prepend', 'replaceChildren']){
  const orig = Element.prototype[name];
  Element.prototype[name] = function(...nodes){ return orig.apply(this, nodes.filter(n => n != null && n !== false)); };
}

export function h(tag, attrs, ...children){
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)){
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;            // only ever given escaped markup (see md())
    else if (k === 'value') el.value = v;
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)){
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}
// Replaces el's contents, taking children the way h() does (lists flattened; null and false skipped). The DOM's own
// replaceChildren prints them as text ("null", "[object HTMLParagraphElement]").
export const fill = (el, ...children) => el.replaceChildren(...h('div', null, ...children).childNodes);
// Runs fn as soon as a finger or mouse presses el, rather than on the click. On phones, the first tap after typing
// often only closes the keyboard and its click is lost, so menus needed a second tap. The click that follows a press
// is swallowed, so it can't land on a backdrop that just appeared. Enter and Space still work through the click.
export function onTap(el, fn){
  el.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    document.activeElement?.blur?.();
    fn(e);
    const swallow = ev => { ev.stopPropagation(); ev.preventDefault(); };
    document.addEventListener('click', swallow, { capture: true, once: true });
    setTimeout(() => document.removeEventListener('click', swallow, { capture: true }), 700);
  });
  el.addEventListener('click', fn);
  return el;
}
export const $ = (sel, root = document) => root.querySelector(sel);

export class ApiError extends Error { constructor(msg, status, code){ super(msg); this.status = status; this.code = code; } }

export async function api(method, path, body){
  const opts = { method, headers: {}, credentials: 'same-origin' };
  if (body !== undefined){ opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  else if (method !== 'GET'){ opts.headers['Content-Type'] = 'application/json'; opts.body = '{}'; }
  let res;
  try { res = await fetch(path, opts); } catch { throw new ApiError('Studio can’t be reached. Check your connection.', 0); }
  const type = res.headers.get('content-type') || '';
  const data = type.includes('json') ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok){
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(typeof msg === 'string' ? msg : JSON.stringify(msg), res.status, data?.code);
  }
  return data;
}
export const authApi = (path, body) => api('POST', '/api/auth' + path, body || {});

// Line icons (24 × 24, drawn in the text colour). ico('name') returns an <svg> element for h().
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-11 5.5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  external: '<path d="M7 17 17 7M8 7h9v9"/>',
  play: '<path d="M7 5v14l11-7z"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  restart: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  terminal: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 9 3 3-3 3M12 15h6"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  check: '<path d="m5 12 5 5L20 7"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chev: '<path d="m9 6 6 6-6 6"/>', chevdown: '<path d="m6 9 6 6 6-6"/>',
  clip: '<path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  more: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M16 7l3 3M18 5l2 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  laptop: '<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>', download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
};
export function ico(name, cls = ''){
  const t = document.createElement('template');
  t.innerHTML = `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  return t.content.firstChild;
}

export function toast(msg, isError = false){
  const t = h('div', { class: 'toast' + (isError ? ' err' : '') }, ico(isError ? 'alert' : 'check'), h('span', null, msg));
  document.getElementById('toasts').append(t);
  setTimeout(() => t.remove(), isError ? 7000 : 3500);
}
export const fail = e => toast(e.message || String(e), true);

// Runs an async action from a button, disabling it meanwhile and showing errors.
export async function busy(btn, fn, label){
  const old = btn?.textContent;
  if (btn){ btn.disabled = true; if (label) btn.textContent = label; }
  try { return await fn(); }
  catch (e){ fail(e); throw e; }
  finally { if (btn){ btn.disabled = false; if (label) btn.textContent = old; } }
}

export function dialog(build){
  const d = h('dialog');
  const close = () => { d.close(); d.remove(); };
  d.append(build(close));
  d.addEventListener('close', () => d.remove());
  document.body.append(d);
  d.showModal();
  return { el: d, close };
}
export function confirmDialog(title, text, okLabel = 'Confirm', danger = false){
  return new Promise(resolve => {
    dialog(close => h('div', { class: 'dialog-body' },
      h('h2', null, title), h('p', { class: 'muted' }, text),
      h('div', { class: 'row end', style: { marginTop: '18px' } },
        h('button', { class: 'btn', onclick: () => { close(); resolve(false); } }, 'Cancel'),
        h('button', { class: 'btn ' + (danger ? 'danger' : 'primary'), onclick: () => { close(); resolve(true); } }, okLabel))));
  });
}

export function field(label, input, hint){
  const id = input.id || ('f' + Math.random().toString(36).slice(2, 8));
  input.id = id;
  return h('div', null, h('label', { for: id }, label, hint ? h('span', { class: 'hint' }, ' ', hint) : null), input);
}

export const initials = name => String(name || '?').trim().split(/\s+/).map(s => s[0]).slice(0, 2).join('').toUpperCase();

export function ago(t){
  if (!t) return '';
  const ms = Date.now() - (typeof t === 'number' ? t : Date.parse(t));
  if (!Number.isFinite(ms)) return '';
  const m = Math.round(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const hrs = Math.round(m / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const d = Math.round(hrs / 24);
  return d < 30 ? `${d} d ago` : new Date(typeof t === 'number' ? t : Date.parse(t)).toLocaleDateString('en-GB');
}

export async function copy(text){
  try { await navigator.clipboard.writeText(text); toast('Copied'); }
  catch { toast('Copy failed. Select the text and copy it yourself.', true); }
}

// Adds a click-to-copy button to each fenced code block (<pre><code>) inside a rendered markdown node.
// Safe to call again on the same node: blocks that already have a button are skipped.
export function enhanceCode(root){
  for (const pre of root.querySelectorAll('pre')){
    const code = pre.querySelector('code');
    if (!code || pre.querySelector(':scope > .copy-code')) continue;
    const btn = h('button', { class: 'copy-code', type: 'button', title: 'Copy', 'aria-label': 'Copy to clipboard' }, ico('copy'));
    btn.onclick = async e => {
      e.stopPropagation();
      await copy(code.textContent);
      btn.replaceChildren(ico('check')); btn.classList.add('ok');
      setTimeout(() => { btn.replaceChildren(ico('copy')); btn.classList.remove('ok'); }, 1400);
    };
    pre.appendChild(btn);
  }
}

// ---------- markdown (escapes everything first, so output is safe to insert) ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export { esc };
function inline(s){
  const codes = [];
  s = s.replace(/`([^`\n]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s)
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}
export function md(src){
  const lines = String(src || '').replace(/\r/g, '').split('\n');
  let out = '', i = 0;
  while (i < lines.length){
    const line = lines[i];
    const fence = line.match(/^\s*```(\S*)/);
    if (fence){
      const buf = []; i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out += `<pre><code>${esc(buf.join('\n'))}</code></pre>`; continue;
    }
    const hd = line.match(/^(#{1,4})\s+(.*)/);
    if (hd){ out += `<h${hd[1].length + 1}>${inline(hd[2])}</h${hd[1].length + 1}>`; i++; continue; }
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] || '')){
      const row = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      out += '<table><thead><tr>' + row(line).map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
      i += 2;
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) out += '<tr>' + row(lines[i++]).map(c => `<td>${inline(c)}</td>`).join('') + '</tr>';
      out += '</tbody></table>'; continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)){
      const ordered = /^\s*\d+\./.test(line);
      out += ordered ? '<ol>' : '<ul>';
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])){
        out += `<li>${inline(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''))}</li>`; i++;
      }
      out += ordered ? '</ol>' : '</ul>'; continue;
    }
    if (/^>\s?/.test(line)){
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      out += `<blockquote>${inline(buf.join(' '))}</blockquote>`; continue;
    }
    if (!line.trim()){ i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(```|#{1,4}\s|[-*]\s|\d+\.\s|>)/.test(lines[i])) buf.push(lines[i++]);
    if (!buf.length){ buf.push(lines[i++]); }
    out += `<p>${buf.map(inline).join('<br>')}</p>`;
  }
  return out;
}
