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

export function toast(msg, isError = false){
  const t = h('div', { class: 'toast' + (isError ? ' err' : '') }, msg);
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
