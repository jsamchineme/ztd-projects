// Visa Plan front end: checklist of documents with uploads, timeline, details and the invitation letter.
const $ = s => document.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k);
  return el;
};
async function api(path, opts = {}) {
  const res = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, body: opts.json ? JSON.stringify(opts.json) : opts.body });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !path.match(/login|setup|passcode/)) { location.reload(); throw new Error('signed out'); }
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2800); }

const NEED = { required: 'Required', strong: 'Strongly advised', helpful: 'Helpful', if: 'If it applies' };
const DEFAULT_DUE = '2027-01-15';
let S = null, filter = 'all', query = '';

// ---- dates ----
const D = s => s ? new Date(s.slice(0, 10) + 'T12:00:00') : null;
const iso = d => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const today = () => D(iso(new Date()));
const daysTo = d => Math.round((d - today()) / 864e5);
const long = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const short = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const rel = d => { const n = daysTo(d); return n === 0 ? 'today' : n === 1 ? 'tomorrow' : n > 0 ? `in ${n} days` : n === -1 ? 'yesterday' : `${-n} days ago`; };
const sizeOf = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

function plan() {
  const p = S.profile;
  const due = D(p.dueDate || DEFAULT_DUE);
  const arrive = D(p.travelDate) || addDays(due, -14);
  const guessed = !p.travelDate;
  return {
    due, arrive, guessed,
    leave: D(p.returnDate),
    earliest: addMonths(arrive, -3),
    applyBy: addDays(arrive, -42),
    maxStay: addDays(addMonths(arrive, 6), -1),
    appt: p.appointment ? new Date(p.appointment) : null,
  };
}

// ---- boot / gate ----
async function boot() {
  const s = await api('/api/session');
  if (s.authed) return start();
  const gate = $('#gate'); gate.hidden = false;
  const setup = s.setup;
  if (setup) {
    $('#gate-title').textContent = 'Set up Visa Plan';
    $('#gate-sub').textContent = 'Choose a passcode. You’ll share it with anyone who should see these documents (like Mum).';
    $('#gate-pass').autocomplete = 'new-password';
    $('#gate-pass2').hidden = false; $('#gate-pass2').required = true;
    $('#gate-btn').textContent = 'Create passcode';
  }
  $('#gate-pass').focus();
  $('#gate-form').onsubmit = async e => {
    e.preventDefault();
    const err = $('#gate-err'); err.hidden = true;
    const passcode = $('#gate-pass').value;
    if (setup && passcode !== $('#gate-pass2').value) { err.textContent = 'The two passcodes don’t match'; err.hidden = false; return; }
    try { await api(setup ? '/api/setup' : '/api/login', { method: 'POST', json: { passcode } }); gate.hidden = true; start(); }
    catch (x) { err.textContent = x.message; err.hidden = false; }
  };
}

async function start() {
  S = await api('/api/state');
  if (!S.profile.dueDate) S.profile = (await api('/api/profile', { method: 'PATCH', json: { dueDate: DEFAULT_DUE } })).profile;
  $('#app').hidden = false;
  renderAll();
  wireChrome();
}

function renderAll() { renderHero(); renderDocs(); renderPlan(); fillDetails(); }

// ---- hero ----
const prog = id => S.progress[id] || { status: 'todo', note: '', files: [] };
function renderHero() {
  const counted = S.items.filter(i => prog(i.id).status !== 'na');
  const ready = counted.filter(i => prog(i.id).status === 'ready').length;
  const pct = counted.length ? Math.round(ready / counted.length * 100) : 0;
  $('#ring-pct').textContent = pct + '%';
  $('#ring-sub').textContent = `${ready} of ${counted.length} ready`;
  $('#ring-bar').style.strokeDashoffset = 326.7 * (1 - pct / 100);

  const p = S.profile, P = plan();
  const mum = p.mumName ? p.mumName.split(' ')[0] : 'Mum';
  $('#brand-sub').textContent = `${p.mumName ? mum + '’s' : 'Mum’s'} UK visit`;
  $('#hero-title').textContent = `Getting ${p.mumName ? mum : 'Mum'} here for the baby`;
  const missing = S.items.filter(i => ['required', 'strong'].includes(i.need) && prog(i.id).status === 'todo');
  const nextStep = S.steps.find(s => !S.done[s.id]);
  let next;
  if (S.done.decision) next = 'The decision is in. Book flights and insurance, and check the visa dates match the trip.';
  else if (missing.length) next = `Next: ${missing.slice(0, 3).map(i => i.title.toLowerCase()).join(', ')}${missing.length > 3 ? ` and ${missing.length - 3} more key documents` : ''}.`;
  else if (nextStep) next = `All the key documents are in. Next step: ${nextStep.title.toLowerCase()}.`;
  $('#hero-next').textContent = next || '';

  const chips = [h('span', { class: 'chip' }, '👶 Baby due ', h('b', {}, short(P.due)), ` · ${rel(P.due)}`)];
  chips.push(h('span', { class: 'chip' }, '✈︎ Arrives ', h('b', {}, (P.guessed ? '~' : '') + short(P.arrive))));
  if (!S.done.attend) {
    const n = daysTo(P.applyBy);
    const before = daysTo(P.earliest) > 0;
    chips.push(h('span', { class: 'chip' + (n < 21 ? ' warn' : '') }, before ? `Can apply from ${short(P.earliest)}` : n >= 0 ? `Apply by ${short(P.applyBy)} · ${n} days` : `Apply now (aim was ${short(P.applyBy)})`));
  }
  if (P.appt && P.appt > new Date()) chips.push(h('span', { class: 'chip' }, '🗓 Biometrics ', h('b', {}, short(P.appt))));
  $('#hero-chips').replaceChildren(...chips);
}

// ---- documents ----
function matches(i) {
  const st = prog(i.id).status;
  if (filter === 'todo' && st !== 'todo') return false;
  if (filter === 'ready' && st !== 'ready') return false;
  if (query && !(i.title + ' ' + i.hint + ' ' + prog(i.id).note + ' ' + prog(i.id).files.map(f => f.name).join(' ')).toLowerCase().includes(query)) return false;
  return true;
}
function renderDocs() {
  const wrap = $('#sections');
  const out = [];
  for (const s of S.sections) {
    const all = S.items.filter(i => i.section === s.id);
    const shown = all.filter(matches);
    if (!shown.length && (filter !== 'all' || query)) continue;
    const ready = all.filter(i => prog(i.id).status === 'ready').length;
    const needed = all.filter(i => prog(i.id).status !== 'na').length;
    out.push(h('section', { class: 'section', 'data-sid': s.id },
      h('div', { class: 'section-head' }, h('h2', {}, s.title), h('span', { class: 'count' }, `${ready}/${needed} ready`)),
      h('p', {}, s.blurb),
      h('div', { class: 'docs' }, shown.map(card), filter === 'all' && !query ? addCard(s) : null),
    ));
  }
  wrap.replaceChildren(...(out.length ? out : [h('p', { class: 'empty' }, 'Nothing matches.')]));
}

function card(item) {
  const p = prog(item.id);
  const input = h('input', { type: 'file', multiple: true, accept: 'image/*,application/pdf,.doc,.docx,.heic', hidden: true, onchange: e => { upload(item, [...e.target.files], el); e.target.value = ''; } });
  const files = h('div', { class: 'files' }, p.files.map(f => fileRow(item, f)));
  const bar = h('div', { class: 'progress', hidden: true }, h('i'));
  let noteT;
  const note = h('textarea', { class: 'note', rows: 1, placeholder: 'Add a note…', oninput: e => { autosize(e.target); clearTimeout(noteT); noteT = setTimeout(() => saveItem(item, { note: e.target.value }, false), 600); } });
  note.value = p.note || '';
  const el = h('article', { class: `doc is-${p.status}`, 'data-id': item.id },
    h('div', { class: 'doc-top' },
      h('button', { class: 'check', title: p.status === 'ready' ? 'Mark as still needed' : 'Mark as ready', onclick: () => saveItem(item, { status: p.status === 'ready' ? 'todo' : 'ready' }) }, p.status === 'ready' ? '✓' : p.status === 'na' ? '–' : ''),
      h('div', { class: 'doc-title' },
        h('h3', {}, item.title),
        h('p', {}, item.hint),
        h('span', { class: 'tag ' + item.need }, p.status === 'na' ? 'Not needed' : NEED[item.need] || 'Added by you'),
      ),
      h('button', { class: 'doc-more', title: 'More', onclick: e => { e.stopPropagation(); docMenu(item, el); } }, '⋯'),
    ),
    files, bar,
    h('div', { class: 'drop', onclick: () => input.click() }, h('b', {}, 'Upload'), ' or drop files here'),
    note, input,
  );
  setTimeout(() => autosize(note));
  for (const ev of ['dragenter', 'dragover']) el.addEventListener(ev, e => { if (e.dataTransfer?.types.includes('Files')) { e.preventDefault(); el.classList.add('drag'); } });
  el.addEventListener('dragleave', e => { if (!el.contains(e.relatedTarget)) el.classList.remove('drag'); });
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('drag'); $('#drop-hint').hidden = true; upload(item, [...e.dataTransfer.files], el); });
  return el;
}
function autosize(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; }

function fileRow(item, f) {
  const isImg = /^image\/(png|jpeg|gif|webp)$/.test(f.type), isPdf = f.type === 'application/pdf';
  const ext = (f.name.split('.').pop() || '').slice(0, 4).toUpperCase();
  const open = () => view(f);
  return h('div', { class: 'file' },
    h('button', { class: 'thumb' + (isPdf ? ' pdf' : ''), style: isImg ? `background-image:url(/api/file/${f.id})` : '', onclick: open, title: 'Open' }, isImg ? '' : isPdf ? 'PDF' : ext),
    h('div', { class: 'file-name', onclick: open }, h('b', { title: f.name }, f.name), h('small', {}, `${sizeOf(f.size)} · added ${new Date(f.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`)),
    h('button', { class: 'x', title: 'Rename', onclick: () => renameFile(item, f) }, '✎'),
    h('button', { class: 'x', title: 'Delete', onclick: () => deleteFile(item, f) }, '✕'),
  );
}

function replaceCard(item) {
  const old = document.querySelector(`.doc[data-id="${item.id}"]`);
  if (old) old.replaceWith(card(item));
  renderHero();
  refreshCounts();
}
function refreshCounts() {
  document.querySelectorAll('.section').forEach(sec => {
    const all = S.items.filter(i => i.section === sec.dataset.sid);
    sec.querySelector('.count').textContent = `${all.filter(i => prog(i.id).status === 'ready').length}/${all.filter(i => prog(i.id).status !== 'na').length} ready`;
  });
}

async function saveItem(item, patch, rerender = true) {
  try {
    const { item: it } = await api(`/api/item/${item.id}`, { method: 'PATCH', json: patch });
    S.progress[item.id] = it;
    if (rerender) { if (filter !== 'all') renderDocs(); else replaceCard(item); renderHero(); }
  } catch (e) { toast(e.message); }
}

function upload(item, files, el) {
  files = files.filter(f => f.size);
  if (!files.length) return;
  const bar = el.querySelector('.progress'), fill = bar.querySelector('i');
  const total = files.reduce((n, f) => n + f.size, 0);
  let doneBytes = 0;
  bar.hidden = false;
  (async () => {
    for (const f of files) {
      if (f.size > 30 * 1024 * 1024) { toast(`${f.name} is over 30 MB`); doneBytes += f.size; continue; }
      try {
        const res = await new Promise((ok, fail) => {
          const x = new XMLHttpRequest();
          x.open('POST', `/api/item/${item.id}/files`);
          x.setRequestHeader('Content-Type', f.type || 'application/octet-stream');
          x.setRequestHeader('X-File-Name', encodeURIComponent(f.name));
          x.upload.onprogress = e => fill.style.width = ((doneBytes + e.loaded) / total * 100) + '%';
          x.onload = () => { let d = {}; try { d = JSON.parse(x.responseText); } catch {} x.status < 300 ? ok(d) : fail(new Error(d.error || 'Upload failed')); };
          x.onerror = () => fail(new Error('Upload failed. Check your connection.'));
          x.send(f);
        });
        S.progress[item.id] = res.item;
      } catch (e) { toast(`${f.name}: ${e.message}`); }
      doneBytes += f.size;
    }
    toast(files.length > 1 ? `${files.length} files added to ${item.title}` : `Added to ${item.title}`);
    replaceCard(item);
  })();
}

async function deleteFile(item, f) {
  if (!confirm(`Delete “${f.name}”?`)) return;
  try { const { item: it } = await api(`/api/file/${f.id}`, { method: 'DELETE' }); S.progress[item.id] = it; replaceCard(item); }
  catch (e) { toast(e.message); }
}
async function renameFile(item, f) {
  const name = prompt('File name', f.name);
  if (!name || name === f.name) return;
  try { const { item: it } = await api(`/api/file/${f.id}`, { method: 'PATCH', json: { name } }); S.progress[item.id] = it; replaceCard(item); }
  catch (e) { toast(e.message); }
}

function docMenu(item, el) {
  document.querySelector('.doc-menu')?.remove();
  const p = prog(item.id);
  const m = h('div', { class: 'doc-menu' },
    p.status !== 'na' ? h('button', { onclick: () => saveItem(item, { status: 'na' }) }, 'Mark as not needed') : h('button', { onclick: () => saveItem(item, { status: p.files.length ? 'ready' : 'todo' }) }, 'Mark as needed again'),
    p.status !== 'ready' ? h('button', { onclick: () => saveItem(item, { status: 'ready' }) }, 'Mark as ready') : h('button', { onclick: () => saveItem(item, { status: 'todo' }) }, 'Mark as still needed'),
    item.id === 'invite' ? h('button', { onclick: () => showTab('letter') }, 'Draft the letter') : null,
    item.custom ? h('button', { class: 'btn danger', style: 'border:0', onclick: () => removeCustom(item) }, 'Remove this item') : null,
  );
  el.append(m);
  setTimeout(() => document.addEventListener('click', () => m.remove(), { once: true }));
}

function addCard(section) {
  return h('button', { class: 'add-doc', onclick: async () => {
    const title = prompt(`Add another document to “${section.title}”`, '');
    if (!title?.trim()) return;
    try { S = { ...S, ...(await api('/api/custom', { method: 'POST', json: { section: section.id, title } })) }; renderDocs(); renderHero(); }
    catch (e) { toast(e.message); }
  } }, h('span', {}, '+'), 'Add another document');
}
async function removeCustom(item) {
  if (!confirm(`Remove “${item.title}” and its files?`)) return;
  try { S = { ...S, ...(await api(`/api/custom/${item.id}`, { method: 'DELETE' })) }; renderDocs(); renderHero(); }
  catch (e) { toast(e.message); }
}

// ---- viewer ----
function view(f) {
  const url = `/api/file/${f.id}`;
  $('#viewer-name').textContent = f.name;
  $('#viewer-dl').href = url + '?dl=1';
  const body = $('#viewer-body');
  if (/^image\//.test(f.type) && f.type !== 'image/heic') body.replaceChildren(h('img', { src: url, alt: f.name }));
  else if (f.type === 'application/pdf') body.replaceChildren(h('iframe', { src: url, title: f.name }));
  else body.replaceChildren(h('div', { class: 'nopreview' }, h('p', {}, 'No preview for this type of file.'), h('a', { class: 'btn', href: url + '?dl=1' }, 'Download it')));
  $('#viewer').hidden = false;
}
function closeViewer() { $('#viewer').hidden = true; $('#viewer-body').replaceChildren(); }

// ---- timeline ----
function renderPlan() {
  const P = plan(), p = S.profile;
  const rows = [
    { d: P.earliest, t: 'Earliest Mum can apply', s: '3 months before she travels' },
    { d: P.applyBy, t: 'Aim to have applied by', s: 'About 6 weeks before travel, leaving time for the ~3 week decision', hot: !S.done.attend },
    P.appt && { d: P.appt, t: 'Biometrics appointment', s: p.centre || 'Visa application centre' },
    { d: P.arrive, t: P.guessed ? 'Mum arrives (suggested)' : 'Mum arrives', s: P.guessed ? 'Two weeks before the due date. Set the real date in Details.' : 'Arrival in the UK' },
    { d: P.due, t: 'Baby due 👶', s: 'Babies keep their own schedule, so build in slack either side', hot: true },
    P.leave && { d: P.leave, t: 'Mum flies home', s: P.leave > P.maxStay ? '⚠️ This is more than 6 months after arrival' : `${Math.round((P.leave - P.arrive) / 864e5)} day visit` },
    { d: P.maxStay, t: 'Latest she can stay until', s: 'Visitors can stay up to 6 months' },
  ].filter(Boolean).sort((a, b) => a.d - b.d);
  $('#dates').replaceChildren(...rows.map(r => h('div', { class: 'date-row' + (r.hot ? ' hot' : '') + (daysTo(r.d) < 0 ? ' past' : '') },
    h('div', { class: 'date-badge' }, h('small', {}, r.d.toLocaleDateString('en-GB', { month: 'short' })), h('b', {}, r.d.getDate())),
    h('div', {}, h('p', {}, r.t), h('span', {}, `${long(r.d)} · ${rel(r.d)} · ${r.s}`)),
  )));
  $('#steps').replaceChildren(...S.steps.map(s => {
    const done = !!S.done[s.id];
    return h('li', { class: done ? 'done' : '' },
      h('button', { class: 'check', title: done ? 'Mark not done' : 'Mark done', onclick: async () => {
        try { S.done = (await api(`/api/step/${s.id}`, { method: 'POST', json: { done: !done } })).done; renderPlan(); renderHero(); } catch (e) { toast(e.message); }
      } }, done ? '✓' : ''),
      h('div', {}, h('p', {}, s.title), h('span', {}, done ? `Done ${new Date(S.done[s.id]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : s.hint)),
    );
  }));
}

// ---- details ----
function fillDetails() {
  const f = $('#details-form');
  for (const el of f.elements) if (el.name) el.value = S.profile[el.name] || '';
}
let detT, pending = {};
function wireDetails() {
  $('#details-form').addEventListener('input', e => {
    if (!e.target.name) return;
    pending[e.target.name] = e.target.value;
    $('#saved-msg').textContent = 'Saving…';
    clearTimeout(detT);
    detT = setTimeout(async () => {
      const patch = pending; pending = {};
      try { S.profile = (await api('/api/profile', { method: 'PATCH', json: patch })).profile; $('#saved-msg').textContent = 'Saved.'; renderHero(); renderPlan(); }
      catch (x) { $('#saved-msg').textContent = x.message; }
    }, 500);
  });
  $('#details-form').addEventListener('submit', e => e.preventDefault());
}

// ---- letter ----
function buildLetter() {
  const p = S.profile, P = plan();
  const v = (x, ph) => x?.trim() || `[${ph}]`;
  const mum = v(p.mumName, 'Mum’s full name');
  const ready = id => prog(id).status === 'ready';
  const encl = [
    ['sponsor-status', 'Copy of my passport / proof of UK status'],
    ['relationship', 'My birth certificate, showing she is my mother'],
    ['marriage', 'My marriage certificate'],
    ['pregnancy', 'Evidence of my wife’s pregnancy and due date'],
    ['payslips', 'My recent payslips'],
    ['sponsor-bank', 'My recent bank statements'],
    ['employment', 'Letter from my employer'],
    ['accommodation', 'Proof of my address (tenancy / mortgage)'],
  ].filter(([id]) => ready(id) || !S.progress[id]).map(([, t]) => '  • ' + t);
  return `${v(p.sponsorName, 'Your full name')}
${v(p.address, 'Your UK address')}
${[p.phone, p.email].filter(Boolean).join(' · ') || '[Phone · Email]'}

${long(today())}

Entry Clearance Officer
UK Visas and Immigration

Dear Sir or Madam,

Re: Invitation and sponsorship for ${mum}${p.mumDob ? `, born ${long(D(p.mumDob))}` : ''}${p.mumPassport ? `, passport number ${p.mumPassport}` : ''}

I am writing to invite my mother, ${mum}, to visit me and my family in the United Kingdom from ${p.travelDate ? long(D(p.travelDate)) : '[arrival date]'} to ${p.returnDate ? long(D(p.returnDate)) : '[return date]'}. I am [your UK status, e.g. a British citizen] and live at the address above.

My wife, ${v(p.wifeName, 'your wife’s full name')}, is expecting our baby, due on ${long(P.due)}. My mother would like to be with us for the birth of her grandchild and to support our family through the first weeks with our newborn. The purpose of her trip is purely a family visit. She will not work or study while she is in the UK.

She will stay with us at the address above for the whole of her visit, at no cost to her. I will pay for [her flights,] her living costs and any other expenses during her stay. My payslips, bank statements and employment letter are enclosed to show I can do this comfortably alongside supporting my own household.

My mother lives in ${v(p.mumCity, 'city')}, ${v(p.mumCountry, 'country')}, where [her home / her work or pension / family and community commitments]. She will return home at the end of her visit${p.returnDate ? `, on ${long(D(p.returnDate))}` : ''}, well within the six months a visitor may stay.

I enclose:
${encl.join('\n')}

Please contact me if you need anything further.

Yours faithfully,



${v(p.sponsorName, 'Your full name')}
`;
}
function renderLetter(rebuild) {
  const el = $('#letter');
  el.innerText = !rebuild && S.profile.letter ? S.profile.letter : buildLetter();
}
let letT;
function wireLetter() {
  $('#letter').addEventListener('input', () => {
    clearTimeout(letT);
    letT = setTimeout(async () => { try { S.profile = (await api('/api/profile', { method: 'PATCH', json: { letter: $('#letter').innerText } })).profile; } catch (e) { toast(e.message); } }, 800);
  });
  $('#letter-reset').onclick = async () => {
    if (S.profile.letter && !confirm('Replace your edits with a fresh letter from the details?')) return;
    S.profile = (await api('/api/profile', { method: 'PATCH', json: { letter: '' } })).profile;
    renderLetter(true);
  };
  $('#letter-print').onclick = () => window.print();
}

// ---- chrome ----
function showTab(name) {
  for (const b of document.querySelectorAll('#tabs button')) b.classList.toggle('on', b.dataset.tab === name);
  for (const t of document.querySelectorAll('.tab')) t.hidden = t.id !== 'tab-' + name;
  if (name === 'letter') renderLetter();
  if (name === 'details') fillDetails();
  history.replaceState(null, '', '#' + name);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function wireChrome() {
  for (const b of document.querySelectorAll('#tabs button')) b.onclick = () => showTab(b.dataset.tab);
  for (const b of document.querySelectorAll('#filter button')) b.onclick = () => {
    filter = b.dataset.f;
    for (const x of document.querySelectorAll('#filter button')) x.classList.toggle('on', x === b);
    renderDocs();
  };
  $('#search').oninput = e => { query = e.target.value.trim().toLowerCase(); renderDocs(); };
  $('#menu-btn').onclick = e => { e.stopPropagation(); $('#menu').hidden = !$('#menu').hidden; };
  document.addEventListener('click', () => $('#menu').hidden = true);
  $('#logout').onclick = async () => { await api('/api/logout', { method: 'POST' }); location.reload(); };
  $('#change-pass').onclick = async () => {
    const current = prompt('Current passcode'); if (!current) return;
    const next = prompt('New passcode (at least 6 characters)'); if (!next) return;
    try { await api('/api/passcode', { method: 'POST', json: { current, next } }); toast('Passcode changed. Other devices will need the new one.'); }
    catch (e) { toast(e.message); }
  };
  $('#viewer-close').onclick = closeViewer;
  $('#viewer').addEventListener('click', e => { if (e.target.id === 'viewer-body') closeViewer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeViewer(); });
  // show a hint while dragging files anywhere; drop outside a card does nothing
  let depth = 0;
  window.addEventListener('dragenter', e => { if (e.dataTransfer?.types.includes('Files')) { depth++; $('#drop-hint').hidden = false; } });
  window.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; $('#drop-hint').hidden = true; } });
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => { e.preventDefault(); depth = 0; $('#drop-hint').hidden = true; });
  wireDetails(); wireLetter();
  const t = location.hash.slice(1);
  if (['docs', 'plan', 'details', 'letter'].includes(t)) showTab(t);
}

boot().catch(e => { document.body.textContent = 'Could not load: ' + e.message; });
