// A project: chat with Claude, running services, changes, files and settings.
import { h, $, fill, onTap, api, toast, fail, busy, dialog, confirmDialog, field, ago, md, copy } from './ui.js';
import { state, go, onLeave, refreshProjects, setTitle, setTopbar, hideTopbar, localStorageSet, localStorageGet, renderSideProjects } from './app.js';
import { runStudioUpdate } from './people.js';

const MODELS = [['opus', 'Opus'], ['fable', 'Fable'], ['sonnet', 'Sonnet'], ['haiku', 'Haiku']];
const MAX_FILES = 10, MAX_BYTES = 20 * 1024 * 1024;
const fileIcon = kind => ({ image: '🖼', pdf: '📄', notebook: '📓', text: '📝' })[kind] || '📦';
const sizeText = n => n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
// A line icon in the style of Claude.ai's composer (drawn here; they take the button's text colour).
const icon = paths => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const MIC_ICON = icon('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>');
const TABS = [['chat', 'Chat'], ['services', 'Services'], ['changes', 'Changes'], ['files', 'Files'], ['settings', 'Settings']];

export async function renderProject(main, id, tab, sub){
  let project;
  try { project = await api('GET', `/api/projects/${id}`); }
  catch (e){ main.append(h('div', { class: 'page' }, h('div', { class: 'error-box' }, e.message))); return; }
  localStorageSet('lastProject', id);
  setTitle(project.name);
  if (!TABS.some(t => t[0] === tab)) tab = 'chat';

  const changeCount = h('span', { class: 'count', hidden: true });
  const head = h('div', { class: 'proj-head' },
    h('div', { class: 'proj-title' },
      h('h1', null, project.name),
      project.status === 'creating' ? h('span', { class: 'pill' }, h('span', { class: 'dot starting' }), 'Setting up…') : null,
      project.status === 'error' ? h('span', { class: 'pill', title: project.statusDetail }, h('span', { class: 'dot crashed' }), 'Setup failed') : null,
      h('div', { class: 'spacer' }),
      h('div', { class: 'svc-links', id: 'svc-links' })),
    h('nav', { class: 'tabs', 'aria-label': 'Project sections' }, TABS.map(([k, label]) =>
      h('a', { class: 'tab' + (k === tab ? ' active' : ''), href: `/p/${id}/${k}`, 'data-link': '', 'aria-current': k === tab ? 'page' : null }, label, k === 'changes' ? changeCount : null))));
  const body = h('div', { class: 'proj-body' });

  // Phones: the header above is hidden, and its tabs and web addresses live in a sheet opened from the top bar's title.
  const sheetCount = h('span', { class: 'count', hidden: true });
  const sheetLinks = h('div', { class: 'sheet-links' });
  const sheet = h('div', { class: 'proj-sheet', hidden: true, role: 'dialog', 'aria-label': `${project.name} sections` },
    h('nav', { 'aria-label': 'Project sections' }, TABS.map(([k, label]) =>
      h('a', { class: 'nav-item' + (k === tab ? ' active' : ''), href: `/p/${id}/${k}`, 'data-link': '' }, h('span', { class: 'name' }, label, k === 'changes' ? sheetCount : null), k === tab ? '✓' : null))),
    sheetLinks);
  const sheetBackdrop = h('div', { class: 'sheet-backdrop', hidden: true, onclick: () => showSheet(false) });
  const subLine = h('span', { class: 'topbar-sub' });
  const titleBtn = h('button', { type: 'button', class: 'topbar-proj', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' },
    h('span', { class: 'topbar-name' }, project.name, h('span', { class: 'caret', 'aria-hidden': 'true' }, ' ▾')), subLine);
  function showSheet(open){
    if (open){ hideTopbar(false); sheet.style.top = ($('.topbar')?.offsetHeight || 0) + 'px'; }   // the bar sits at the top once shown
    sheet.hidden = sheetBackdrop.hidden = !open;
    titleBtn.setAttribute('aria-expanded', String(open));
  }
  onTap(titleBtn, () => showSheet(sheet.hidden));
  sheet.addEventListener('click', e => { if (e.target.closest('a')) showSheet(false); });
  const onKey = e => { if (e.key === 'Escape') showSheet(false); };
  document.addEventListener('keydown', onKey);
  onLeave(() => document.removeEventListener('keydown', onKey));
  setTopbar(titleBtn);
  main.append(head, body, sheetBackdrop, sheet);

  const svcLink = (s, full) => h('a', { class: full ? 'nav-item' : 'svc-link', href: s.url, target: '_blank', rel: 'noopener', title: `${s.label}: ${s.status.state} · ${s.subdomain}.${state.me.domain}` },
    h('span', { class: 'dot ' + s.status.state.replace(' ', '-') }), h('span', { class: full ? 'name' : null }, s.subdomain + '.' + state.me.domain), ' ↗');
  const paintLinks = p => {
    const live = p.services.filter(s => s.url);
    $('#svc-links')?.replaceChildren(...live.map(s => svcLink(s)));
    sheetLinks.replaceChildren(...live.map(s => svcLink(s, true)));
  };
  paintLinks(project);
  api('GET', `/api/projects/${id}/git/status`).then(s => { if (s.files?.length){ for (const c of [changeCount, sheetCount]){ c.hidden = false; c.textContent = s.files.length; } } }).catch(() => {});
  const setSub = t => { subLine.textContent = t || ''; };
  const topbarActions = (...actions) => setTopbar(titleBtn, ...actions);
  const ctx = { project, id, body, paintLinks, setSub, topbarActions, reload: async () => { ctx.project = await api('GET', `/api/projects/${id}`); paintLinks(ctx.project); return ctx.project; } };

  if (tab === 'chat') return chatTab(ctx, sub);
  if (tab === 'services') return servicesTab(ctx);
  if (tab === 'changes') return changesTab(ctx);
  if (tab === 'files') return filesTab(ctx);
  if (tab === 'settings') return settingsTab(ctx);
}

// =====================================================================
// Chat
// =====================================================================
async function chatTab(ctx, chatId){
  const { id, body } = ctx;
  const listEl = h('div', { class: 'chat-list', id: 'chat-list' });
  const chatEl = h('div', { class: 'chat' });
  // Phones: the chat list is a drawer, opened from the top bar, which also shows the open chat's title.
  const showList = open => { body.classList.toggle('chats-open', open); if (open) hideTopbar(false); };
  const backdrop = h('div', { class: 'chat-list-backdrop', onclick: () => showList(false) });
  ctx.topbarActions(
    onTap(h('button', { type: 'button', class: 'btn ghost topbar-icon', 'aria-label': 'Show chats', title: 'Chats' }, '💬'), () => showList(true)),
    h('button', { type: 'button', class: 'btn ghost topbar-icon', 'aria-label': 'New chat', title: 'New chat', onclick: () => go(`/p/${id}/chat/new`) }, '＋'));
  listEl.addEventListener('click', e => {
    const a = e.target.closest('a, button');
    if (!a || a.closest('.chat-more, .archived-toggle')) return;
    // The open chat: just close the drawer, rather than reloading the conversation.
    if (a.getAttribute('href') === location.pathname){ e.preventDefault(); e.stopPropagation(); }
    showList(false);
  });
  const onKey = e => { if (e.key === 'Escape') showList(false); };
  document.addEventListener('keydown', onKey);
  onLeave(() => document.removeEventListener('keydown', onKey));
  body.append(listEl, backdrop, chatEl);
  let chats = [], showArchived = false;
  const openId = () => location.pathname.split('/').pop();   // a new chat gets its id in the address after the first message
  const chatLink = (c, open) => h('div', { class: 'chat-row' },
    h('a', { class: 'nav-item' + (c.id === open ? ' active' : ''), href: `/p/${id}/chat/${c.id}`, title: c.prompt || c.title, 'data-link': '' },
      c.running ? h('span', { class: 'dot busy' }) : null,
      h('span', { class: 'name' }, c.title, h('br'), h('span', { class: 'sub' }, `${c.mine ? 'You' : 'Teammate'} · ${ago(c.updatedAt)}`))),
    c.mine || ctx.project.canManage ? h('button', { type: 'button', class: 'btn ghost small chat-more', 'aria-label': `Options for ${c.title}`, title: 'Archive or delete', onclick: () => chatOptions(c) }, '⋯') : null);
  async function loadList(){
    chats = await api('GET', `/api/projects/${id}/chats`);
    const open = openId();
    ctx.setSub(chats.find(c => c.id === open)?.title || 'New chat');
    const active = chats.filter(c => !c.archivedAt), archived = chats.filter(c => c.archivedAt);
    listEl.replaceChildren(...[
      h('button', { class: 'btn block', style: { marginBottom: '8px' }, onclick: () => go(`/p/${id}/chat/new`) }, '+ New chat'),
      ...active.map(c => chatLink(c, open)),
      active.length ? null : h('p', { class: 'small muted', style: { margin: '6px 10px' } }, archived.length ? 'No open chats.' : 'Chats you start appear here.'),
      archived.length ? h('button', { type: 'button', class: 'btn ghost small block archived-toggle', 'aria-expanded': String(showArchived), onclick: () => { showArchived = !showArchived; loadList().catch(fail); } },
        `${showArchived ? '▾' : '▸'} Archived (${archived.length})`) : null,
      ...(showArchived ? archived.map(c => chatLink(c, open)) : [])].filter(Boolean));
  }
  // Archive (hidden under "Archived", and back in the list once someone sends it a message) or delete for good.
  function chatOptions(c){
    const leave = () => { if (c.id === openId()) go(`/p/${id}/chat/new`); else loadList().catch(fail); };
    dialog(close => h('div', { class: 'dialog-body' },
      h('h2', null, c.archivedAt ? 'Archived chat' : 'Archive or delete chat'),
      h('p', { class: 'chat-quote', title: c.title }, c.title),
      h('p', { class: 'muted' }, c.archivedAt ? 'Unarchive it to put it back in the chat list.' : 'Archiving moves it under “Archived” at the bottom of the list, where you can still open it.'),
      h('div', { class: 'row end', style: { marginTop: '18px', flexWrap: 'wrap' } },
        h('button', { class: 'btn', onclick: () => close() }, 'Cancel'),
        h('button', { class: 'btn danger', onclick: async () => {
          close();
          if (!await confirmDialog('Delete this chat?', `“${c.title}” and its whole conversation are deleted for everyone. This can’t be undone. Changes Claude made to files stay.`, 'Delete chat', true)) return;
          try { await api('DELETE', `/api/chats/${c.id}`); toast('Chat deleted'); leave(); } catch (e){ fail(e); }
        } }, 'Delete'),
        h('button', { class: 'btn primary', onclick: async e => busy(e.target, async () => {
          await api('POST', `/api/chats/${c.id}/archive`, { archived: !c.archivedAt });
          close(); toast(c.archivedAt ? 'Chat restored' : 'Chat archived');
          if (c.archivedAt) loadList().catch(fail); else leave();
        }).catch(() => {}) }, c.archivedAt ? 'Unarchive' : 'Archive'))));
  }
  await loadList().catch(fail);
  if (!chatId){
    const recent = chats.find(c => c.mine && !c.archivedAt);
    if (recent) return go(`/p/${id}/chat/${recent.id}`, true);
    chatId = 'new';
  }
  const listTimer = setInterval(() => loadList().catch(() => {}), 10000);
  onLeave(() => clearInterval(listTimer));
  renderChat(ctx, chatEl, chatId === 'new' ? null : chatId, loadList);
}

function renderChat(ctx, el, chatId, loadList){
  const { project, id } = ctx;
  let chat = null, running = false, es = null, live = null, liveThinking = null;
  const pendingTools = new Map();
  const inner = h('div', { class: 'transcript-inner' });
  const transcript = h('div', { class: 'transcript', role: 'log', 'aria-label': 'Conversation' }, inner);
  const working = h('div', { class: 'working', hidden: true }, h('span', { class: 'dot busy' }), h('span', null, 'Claude is working…'));

  // Phones: model and mode sit in a small panel behind ⚙, whose label shows any choice other than Opus and Edit.
  const phone = matchMedia('(max-width: 860px)');
  const gear = h('button', { type: 'button', class: 'btn ghost small gear only-phone', 'aria-label': 'Model and mode', 'aria-expanded': 'false' });
  const paintGear = () => {
    const bits = [model.value !== 'opus' && MODELS.find(m => m[0] === model.value)?.[1], mode === 'plan' && 'Plan'].filter(Boolean);
    gear.textContent = bits.length ? `⚙ ${bits.join(' · ')}` : '⚙';
  };
  const model = h('select', { 'aria-label': 'Model' }, MODELS.map(([v, l]) => h('option', { value: v }, l)));
  model.value = localStorageGet('model') || 'opus';
  model.onchange = () => { localStorageSet('model', model.value); paintGear(); };
  let mode = localStorageGet('mode') || 'edit';
  const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Mode' });
  const paintSeg = () => { paintGear(); seg.replaceChildren(
    h('button', { type: 'button', class: mode === 'edit' ? 'on' : '', 'aria-pressed': String(mode === 'edit'), title: 'Claude edits files and runs commands', onclick: () => { mode = 'edit'; localStorageSet('mode', mode); paintSeg(); } }, 'Edit'),
    h('button', { type: 'button', class: mode === 'plan' ? 'on' : '', 'aria-pressed': String(mode === 'plan'), title: 'Claude reads and plans, but changes nothing', onclick: () => { mode = 'plan'; localStorageSet('mode', mode); paintSeg(); } }, 'Plan only')); };
  paintSeg();
  const ta = h('textarea', { rows: phone.matches ? 1 : 2, placeholder: `Tell Claude what to build or change in ${project.name}…`, 'aria-label': 'Prompt' });
  const draftKey = `draft.${id}.${chatId || 'new'}`;
  ta.value = localStorageGet(draftKey) || '';
  const send = h('button', { class: 'send', type: 'submit', 'aria-label': 'Send', title: 'Send (Enter)' }, '↑');
  const autosize = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, window.innerHeight * 0.4) + 'px'; };
  // Attached files: each uploads as soon as it's added; the message carries their ids.
  let files = [];
  const chips = h('div', { class: 'attach-list', hidden: true });
  const canSend = () => !!ta.value.trim() || files.some(f => f.id);
  const paintSend = () => { send.disabled = !running && !canSend(); };
  const picker = h('input', { type: 'file', multiple: true, hidden: true, onchange: () => { addFiles(picker.files); picker.value = ''; } });
  const attachBtn = h('button', { type: 'button', class: 'btn ghost small attach-btn', title: 'Attach files: images, PDFs, notebooks, text or code (or paste or drop them)', 'aria-label': 'Attach files', onclick: () => picker.click() }, '📎');
  function paintChips(){
    chips.hidden = !files.length;
    chips.replaceChildren(...files.map(f => h('div', { class: 'attach-chip' + (f.error ? ' err' : '') },
      f.id && f.kind === 'image' ? h('img', { src: `/api/uploads/${f.id}`, alt: '' }) : h('span', { class: 'attach-icon', 'aria-hidden': 'true' }, f.id ? fileIcon(f.kind) : '…'),
      h('span', { class: 'attach-name', title: f.name }, f.name),
      h('span', { class: 'attach-meta' }, f.error || (f.id ? sizeText(f.size) : 'Uploading…')),
      h('button', { type: 'button', class: 'attach-x', 'aria-label': `Remove ${f.name}`, onclick: () => { files = files.filter(x => x !== f); paintChips(); } }, '×'))));
    paintSend();
  }
  function addFiles(list){
    for (const file of [...list]){
      if (files.length >= MAX_FILES){ toast(`Attach ${MAX_FILES} files at most per message.`, true); break; }
      const f = { name: file.name || 'pasted file', size: file.size };
      if (file.size > MAX_BYTES) f.error = 'Too large (max 20 MB)';
      files.push(f);
      if (!f.error) upload(file).then(u => Object.assign(f, u), e => { f.error = e.message || 'Upload failed'; }).finally(paintChips);
    }
    paintChips();
  }
  const upload = file => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(api('POST', `/api/projects/${id}/uploads`, { name: file.name || 'pasted file', data: String(r.result).split(',')[1] || '' }));
    r.onerror = () => reject(new Error('Couldn’t read that file'));
    r.readAsDataURL(file);
  });
  // Voice: the mic dictates into the box, using the browser's own speech recognition.
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  const micBtn = Recognition ? h('button', { type: 'button', class: 'btn ghost small mic-btn', title: 'Speak your prompt', 'aria-label': 'Speak your prompt', 'aria-pressed': 'false', html: MIC_ICON }) : null;
  const paintMic = () => { micBtn.classList.toggle('on', !!rec); micBtn.setAttribute('aria-pressed', String(!!rec)); micBtn.title = rec ? 'Stop listening' : 'Speak your prompt'; };
  function listen(){
    if (rec){ rec.stop(); return; }
    const base = ta.value.replace(/\s*$/, '');
    rec = new Recognition();
    rec.lang = navigator.language || 'en-GB';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = e => {
      const said = [...e.results].map(r => r[0].transcript).join('').trim();
      ta.value = base && said ? `${base} ${said}` : base || said;
      autosize(); localStorageSet(draftKey, ta.value); paintSend();
    };
    rec.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') toast('Allow the microphone for this site to speak your prompts.', true);
      else if (e.error !== 'no-speech' && e.error !== 'aborted') toast(`Voice input stopped: ${e.error}`, true);
    };
    rec.onend = () => { rec = null; paintMic(); };
    try { rec.start(); } catch (e){ rec = null; fail(e); }
    paintMic();
  }
  if (micBtn) onTap(micBtn, listen);
  onLeave(() => rec?.abort());
  ta.addEventListener('paste', e => { if (e.clipboardData?.files.length){ e.preventDefault(); addFiles(e.clipboardData.files); } });
  ta.addEventListener('input', () => { autosize(); localStorageSet(draftKey, ta.value); paintSend(); });
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !matchMedia('(max-width: 860px)').matches){ e.preventDefault(); form.requestSubmit(); }
  });
  const noClaude = !state.me.claude?.connected ? h('div', { class: 'note', style: { maxWidth: '780px', margin: '0 auto 8px' } },
    'Connect your Claude account before sending prompts. ', h('a', { href: '/account#claude', 'data-link': '' }, 'Connect Claude')) : null;
  const form = h('form', { class: 'composer', onsubmit: e => { e.preventDefault(); running ? stop() : submit(); } },
    chips, ta, picker, h('div', { class: 'composer-bar' }, attachBtn, model, seg,
      h('div', { class: 'spacer' }), gear, micBtn, send));
  const modelRow = h('label', { class: 'opts-row' }, h('span', null, 'Model'));
  const modeRow = h('div', { class: 'opts-row' }, h('span', null, 'Mode'));
  const opts = h('div', { class: 'composer-opts', hidden: true }, modelRow, modeRow);
  form.append(opts);
  const placeOpts = () => { if (phone.matches){ modelRow.append(model); modeRow.append(seg); } else { attachBtn.after(model, seg); showOpts(false); } };
  function showOpts(open){ opts.hidden = !open; gear.setAttribute('aria-expanded', String(open)); }
  onTap(gear, () => showOpts(opts.hidden));
  const outside = e => { if (!opts.hidden && !opts.contains(e.target) && !gear.contains(e.target)) showOpts(false); };
  const optsKey = e => { if (e.key === 'Escape') showOpts(false); };
  document.addEventListener('pointerdown', outside);
  document.addEventListener('keydown', optsKey);
  phone.addEventListener('change', placeOpts);
  onLeave(() => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', optsKey); phone.removeEventListener('change', placeOpts); });
  placeOpts();
  const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');
  form.addEventListener('dragover', e => { if (hasFiles(e)){ e.preventDefault(); form.classList.add('drop'); } });
  form.addEventListener('dragleave', e => { if (!form.contains(e.relatedTarget)) form.classList.remove('drop'); });
  form.addEventListener('drop', e => { form.classList.remove('drop'); if (e.dataTransfer?.files.length){ e.preventDefault(); addFiles(e.dataTransfer.files); } });
  // In the Studio source project, admins get a one-click update once committed work is waiting to be installed.
  const updateBar = h('div', { class: 'update-bar', hidden: true });
  async function checkStudioUpdate(){
    if (state.me.user.role !== 'admin') return;
    const { installed, source } = await api('GET', '/api/admin/studio');
    if (!source || source.project !== project.slug || source.updating || installed?.commit === source.head.hash){ updateBar.hidden = true; return; }
    const n = source.pending?.length;
    const btn = h('button', { type: 'button', class: 'btn primary small', onclick: () => runStudioUpdate(btn, log) }, 'Update and restart Studio');
    const log = h('pre', { class: 'update-log', hidden: true });
    fill(updateBar,
      h('div', { class: 'update-bar-row' },
        h('span', null, n ? `${n} new commit${n > 1 ? 's' : ''} ready to install` : 'A new commit is ready to install',
          source.dirty?.length ? h('span', { class: 'muted' }, ` · ${source.dirty.length} uncommitted file${source.dirty.length > 1 ? 's' : ''} won’t be included`) : null),
        h('div', { class: 'spacer' }), btn),
      log);
    updateBar.hidden = false;
  }
  checkStudioUpdate().catch(() => {});
  const archivedNote = h('div', { class: 'note', hidden: true, style: { maxWidth: '780px', margin: '0 auto 8px' } },
    'This chat is archived. Sending a message brings it back to the list. ',
    h('button', { type: 'button', class: 'btn small', onclick: e => busy(e.target, async () => {
      await api('POST', `/api/chats/${chat.id}/archive`, { archived: false });
      archivedNote.hidden = true; toast('Chat restored'); loadList?.().catch(() => {});
    }).catch(() => {}) }, 'Unarchive'));
  el.append(transcript, h('div', { class: 'composer-wrap' }, updateBar, noClaude, archivedNote, form,
    h('div', { class: 'composer-hint' }, 'Enter to send · Shift+Enter for a new line · Paste or drop files to attach' + (micBtn ? ' · Tap the mic to speak' : '') + ' · Claude works in this project’s folder on the server')));
  autosize();
  paintSend();

  const atBottom = () => transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight < 120;
  let autoUntil = 0;   // scrolls made by the code (following new output) don't count as the reader scrolling
  const scroll = (force) => { if (force || atBottom()){ autoUntil = Date.now() + 200; transcript.scrollTop = transcript.scrollHeight; } };
  // Phones: the top bar slides away while reading on through a long conversation, and comes back when scrolling back.
  let lastTop = 0, moved = 0, touchedAt = 0;
  for (const type of ['touchstart', 'touchmove', 'wheel']) transcript.addEventListener(type, () => { touchedAt = Date.now(); }, { passive: true });
  transcript.addEventListener('scroll', () => {
    const t = transcript.scrollTop, d = t - lastTop;
    lastTop = t;
    // Only the reader's own scrolling (including the glide after a swipe) counts.
    if (!d || !phone.matches || Date.now() < autoUntil || Date.now() - touchedAt > 3000) return;
    moved = Math.sign(d) === Math.sign(moved) ? moved + d : d;
    if (t < 20 || moved < -40) hideTopbar(false);
    else if (moved > 40) hideTopbar(true);
  }, { passive: true });

  function setRunning(r){
    if (running && !r) checkStudioUpdate().catch(() => {});   // a run just finished: it may have committed something
    running = r;
    working.hidden = !r;
    send.classList.toggle('stop', r);
    send.textContent = r ? '■' : '↑';
    send.setAttribute('aria-label', r ? 'Stop' : 'Send');
    send.title = r ? 'Stop Claude' : 'Send (Enter)';
    paintSend();
    if (!r){ live?.remove(); live = null; liveThinking?.remove(); liveThinking = null; }
    inner.append(working);
  }

  function emptyState(){
    const ideas = project.slug === 'pipeline'
      ? ['Explain how this project is laid out and how the pipeline board works', 'Show me what changed recently and what is unfinished', 'Make the board easier to use on a phone', 'Add a stage to the pipeline for follow-up calls']
      : ['Explain what this project does and how it is set up', 'Build a simple landing page for a local dental practice', 'Add a contact form that emails the practice', 'Check the site for accessibility problems and fix them'];
    return h('div', { class: 'empty-chat' },
      h('h2', null, 'What should we build?'),
      h('p', null, `Claude works directly in ${project.name}. It can read and change the code, run commands and restart the project's services.`),
      h('div', { class: 'suggestions' }, ideas.map(t => h('button', { class: 'suggestion', type: 'button', onclick: () => { ta.value = t; autosize(); send.disabled = false; ta.focus(); } }, t))));
  }

  function toolSummary(name, input = {}){
    const rel = p => String(p || '').replace(`/srv/projects/${project.slug}/repo/`, '');
    switch (name){
      case 'Bash': return input.description || input.command;
      case 'Read': case 'Write': case 'Edit': case 'MultiEdit': case 'NotebookEdit': return rel(input.file_path || input.notebook_path);
      case 'Glob': case 'Grep': return `${input.pattern || ''}${input.path ? ' in ' + rel(input.path) : ''}`;
      case 'WebFetch': return input.url;
      case 'WebSearch': return input.query;
      case 'Task': case 'Agent': return input.description || input.prompt?.slice(0, 80);
      case 'TodoWrite': return (input.todos || []).map(t => (t.status === 'completed' ? '✓ ' : '· ') + t.content).join('  ');
      default: return Object.values(input).filter(v => typeof v === 'string').join(' ').slice(0, 120);
    }
  }
  function toolDetail(name, input = {}){
    if (name === 'Bash') return '$ ' + input.command;
    if (name === 'Edit') return `--- old\n${input.old_string || ''}\n+++ new\n${input.new_string || ''}`;
    if (name === 'Write') return String(input.content || '').slice(0, 6000);
    if (name === 'TodoWrite') return (input.todos || []).map(t => `[${t.status === 'completed' ? 'x' : t.status === 'in_progress' ? '~' : ' '}] ${t.content}`).join('\n');
    return JSON.stringify(input, null, 2);
  }

  function addEvent(ev){
    if (ev.type === 'delta'){
      if (!live){ live = h('div', { class: 'msg md' }); inner.insertBefore(live, working); live._text = ''; }
      live._text += ev.text; live.innerHTML = md(live._text); scroll(); return;
    }
    if (ev.type === 'thinking_delta'){
      if (!liveThinking){ liveThinking = h('div', { class: 'thinking' }, 'Thinking…'); inner.insertBefore(liveThinking, working); }
      return;
    }
    if (ev.type === 'state'){ setRunning(ev.running); if (!ev.running) loadList?.().catch(() => {}); return; }
    let node = null;
    if (ev.type === 'user'){
      const mine = ev.userId === state.me.user.id;
      node = h('div', null, mine ? null : h('div', { class: 'who' }, ev.userName),
        ev.attachments?.length ? h('div', { class: 'msg user' }, h('div', { class: 'sent-files' }, ev.attachments.map(a => a.kind === 'image'
          ? h('a', { class: 'sent-image', href: `/api/uploads/${a.id}`, target: '_blank', rel: 'noopener', title: a.name }, h('img', { src: `/api/uploads/${a.id}`, alt: a.name, loading: 'lazy' }))
          : h('a', { class: 'attach-chip', href: `/api/uploads/${a.id}`, title: `Download ${a.name}` }, h('span', { class: 'attach-icon', 'aria-hidden': 'true' }, fileIcon(a.kind)),
            h('span', { class: 'attach-name' }, a.name), h('span', { class: 'attach-meta' }, sizeText(a.size)))))) : null,
        ev.text ? h('div', { class: 'msg user' }, h('div', { class: 'bubble' }, ev.text)) : null);
    } else if (ev.type === 'text'){
      live?.remove(); live = null; liveThinking?.remove(); liveThinking = null;
      node = h('div', { class: 'msg md', html: md(ev.text) });
    } else if (ev.type === 'thinking'){
      liveThinking?.remove(); liveThinking = null;
      node = h('details', { class: 'thinking' }, h('summary', null, 'Thought for a moment'), h('div', null, ev.text));
    } else if (ev.type === 'tool'){
      live?.remove(); live = null;
      const st = h('span', { class: 'tstate' }, running ? '…' : '');
      const pre = h('pre', null, toolDetail(ev.name, ev.input));
      node = h('details', { class: 'tool' }, h('summary', null, h('span', { class: 'tname' }, ev.name), h('span', { class: 'tdesc' }, toolSummary(ev.name, ev.input)), st), pre);
      pendingTools.set(ev.id, { st, node });
    } else if (ev.type === 'tool_result'){
      const t = pendingTools.get(ev.id);
      if (t){
        t.st.textContent = ev.isError ? 'error' : '✓';
        t.st.classList.toggle('err', ev.isError);
        if (ev.text) t.node.append(h('pre', null, ev.text));
      }
      return;
    } else if (ev.type === 'result'){
      const secs = ev.durationMs ? Math.round(ev.durationMs / 1000) : null;
      if (!ev.ok && ev.text) inner.insertBefore(h('div', { class: 'chat-error' }, ev.text), working);
      node = h('div', { class: 'result-line' }, [secs != null ? `${secs < 60 ? secs + ' s' : Math.round(secs / 60) + ' min'}` : null, ev.turns ? `${ev.turns} steps` : null, ev.costUsd ? `$${ev.costUsd.toFixed(2)} if billed by usage` : null].filter(Boolean).join(' · '));
      for (const t of pendingTools.values()) if (t.st.textContent === '…') t.st.textContent = '';
      api('GET', `/api/projects/${id}/git/status`).then(s => { for (const c of document.querySelectorAll('.tab .count, .proj-sheet .count')){ c.hidden = !s.files?.length; c.textContent = s.files?.length || ''; } }).catch(() => {});
    } else if (ev.type === 'error'){
      node = h('div', { class: 'chat-error' }, ev.text);
    } else if (ev.type === 'flag'){
      node = h('div', { class: 'flag-note' }, h('strong', null, 'Flagged as off-topic for this project. '), ev.text, ' Admins can see this in the Activity log.');
    } else if (ev.type === 'notice'){
      node = h('div', { class: 'notice' }, ev.text);
    }
    if (node){ inner.insertBefore(node, working); scroll(); }
  }

  // Live events. Each connection asks for everything after the last event this page has, so reconnecting never
  // loses anything. Phones can leave a connection dead without an error (asleep, changing networks), so the page
  // reconnects when the server's 20-second ping stops arriving, and whenever the page comes back into view.
  let lastSeq = -1, heard = 0, retry = null;
  function connect(){
    es?.close(); clearTimeout(retry);
    if (!chat || !document.body.contains(el)) return;
    heard = Date.now();
    es = new EventSource(`/api/chats/${chat.id}/stream?after=${lastSeq}`);
    es.onmessage = m => {
      heard = Date.now();
      const ev = JSON.parse(m.data);
      if (ev.seq != null){ if (ev.seq <= lastSeq) return; lastSeq = ev.seq; }
      addEvent(ev);
    };
    es.addEventListener('ping', () => { heard = Date.now(); });
    es.onerror = () => { es.close(); retry = setTimeout(connect, 2000); };
  }
  const watchdog = setInterval(() => { if (chat && Date.now() - heard > 50000) connect(); }, 10000);
  const wake = () => { if (chat && document.visibilityState === 'visible') connect(); };
  document.addEventListener('visibilitychange', wake);
  addEventListener('online', wake);
  onLeave(() => { es?.close(); clearTimeout(retry); clearInterval(watchdog); document.removeEventListener('visibilitychange', wake); removeEventListener('online', wake); });

  async function load(){
    if (!chatId){ inner.append(emptyState(), working); setRunning(false); return; }
    try {
      const r = await api('GET', `/api/chats/${chatId}`);
      chat = r.chat;
      if (chat.model){ model.value = chat.model; paintGear(); }
      if (chat.archivedAt) archivedNote.hidden = false;
      inner.replaceChildren(working);
      for (const ev of r.events){ lastSeq = ev.seq; addEvent(ev); }
      if (!r.events.length) inner.insertBefore(emptyState(), working);
      setRunning(chat.running);
      scroll(true);
      connect();
    } catch (e){ inner.append(h('div', { class: 'chat-error' }, e.message)); }
  }

  async function submit(){
    const prompt = ta.value.trim();
    if (files.some(f => !f.id && !f.error)) return toast('Wait for the files to finish uploading.', true);
    const attachments = files.filter(f => f.id).map(f => f.id);
    if (!prompt && !attachments.length) return;
    if (!state.me.claude?.connected) return toast('Connect your Claude account first (Account page).', true);
    rec?.stop();
    send.disabled = true;
    try {
      if (!chat){
        chat = await api('POST', `/api/projects/${id}/chats`, { model: model.value, mode });
        history.replaceState(null, '', `/p/${id}/chat/${chat.id}`);
        inner.replaceChildren(working);
        connect();   // it replays from the start, so it doesn't matter whether it's open before the message is sent
      }
      $('.empty-chat', inner)?.remove();
      const before = lastSeq;
      await api('POST', `/api/chats/${chat.id}/messages`, { prompt, model: model.value, mode, attachments });
      // The message is saved: if it hasn't come back over the connection soon, that connection is stuck.
      setTimeout(() => { if (lastSeq === before) connect(); }, 3000);
      ta.value = ''; localStorageSet(draftKey, ''); autosize();
      files = []; paintChips(); archivedNote.hidden = true;
      loadList?.().catch(() => {});
      scroll(true);
    } catch (e){
      fail(e);
      if (e.code === 'no_claude') go('/account#claude');
    } finally { paintSend(); }
  }
  async function stop(){ if (chat) await api('POST', `/api/chats/${chat.id}/stop`).catch(fail); }

  load().then(() => ta.focus());
}

// =====================================================================
// Services
// =====================================================================
function servicesTab(ctx){
  const page = h('div', { class: 'page', style: { flex: 1 } });
  const inner = h('div', { class: 'page-inner' });
  page.append(inner);
  ctx.body.append(page);
  let logES = null;
  onLeave(() => logES?.close());

  function paint(p){
    ctx.paintLinks(p);
    fill(inner,
      h('div', { class: 'row' }, h('div', null, h('h1', null, 'Services'), h('p', { class: 'muted', style: { margin: 0 } }, 'The programs this project runs. Restart one to load new code.')),
        h('div', { class: 'spacer' }), p.canManage ? h('button', { class: 'btn', onclick: () => editServices(p) }, 'Edit services') : null),
      p.services.length ? null : h('div', { class: 'card' }, 'No services yet.', p.canManage ? ' Use “Edit services” to add one.' : ''),
      ...p.services.map(s => {
        const st = s.status;
        const act = (a, label, cls = '') => h('button', { class: 'btn small ' + cls, onclick: e => busy(e.currentTarget, async () => { paint(await api('POST', `/api/projects/${ctx.id}/services/${s.id}/${a}`)); toast(`${s.label}: ${a === 'stop' ? 'stopped' : a === 'start' ? 'started' : 'restarted'}`); refreshProjects().catch(() => {}); }, label + '…') }, label);
        return h('div', { class: 'card svc-card' },
          h('div', { class: 'head' }, h('span', { class: 'dot ' + st.state.replace(' ', '-') }), h('h3', { style: { margin: 0 } }, s.label || s.name),
            h('span', { class: 'pill' }, st.state), h('div', { class: 'spacer' }),
            st.state === 'running' ? act('restart', 'Restart') : act('start', 'Start', 'primary'),
            st.state === 'running' || st.state === 'starting' ? act('stop', 'Stop', 'danger') : null,
            h('button', { class: 'btn small', onclick: () => showLogs(s) }, 'Logs')),
          h('div', { class: 'meta' },
            s.url ? h('span', null, h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.url), s.publicAccess ? ' (public)' : ' (team only)', s.certStatus === 'failed' ? h('span', { style: { color: 'var(--bad)' } }, ' · HTTPS certificate failed ', p.canManage ? h('button', { class: 'btn small', onclick: e => busy(e.currentTarget, async () => { const r = await api('POST', `/api/projects/${ctx.id}/services/${s.id}/certificate`); toast(r.ok ? 'Certificate ready' : 'Still failing. Check DNS points here.', !r.ok); }, 'Trying…') }, 'Retry') : null) : s.certStatus === 'pending' ? ' · getting HTTPS certificate…' : '') : 'No web address (internal only)'),
          h('div', { class: 'meta mono' }, `$ ${s.command}`, h('span', { class: 'muted' }, `  · port ${s.port}`)),
          h('div', { class: 'meta' }, [st.since && st.state === 'running' ? `Up since ${new Date(st.since).toLocaleString('en-GB')}` : null, st.memoryMB != null ? `${st.memoryMB} MB of ${s.memoryMB} MB` : null, st.restarts ? `${st.restarts} automatic restarts` : null, s.autostart ? 'Starts with the server' : 'Manual start', s.envKeys.length ? `Settings: ${s.envKeys.join(', ')}` : null].filter(Boolean).join(' · ')),
          h('div', { id: 'logs-' + s.id }));
      }));
  }

  function showLogs(s){
    logES?.close();
    document.querySelectorAll('.logs').forEach(x => x.parentElement.replaceChildren());
    const box = h('pre', { class: 'logs', 'aria-label': `${s.label} logs` });
    const holder = $('#logs-' + s.id);
    holder.replaceChildren(h('div', { class: 'row', style: { marginTop: '10px' } }, h('strong', { class: 'small' }, 'Live logs'), h('div', { class: 'spacer' }), h('button', { class: 'btn small ghost', onclick: () => { logES?.close(); holder.replaceChildren(); } }, 'Close')), box);
    logES = new EventSource(`/api/projects/${ctx.id}/services/${s.id}/logs?lines=300`);
    logES.onmessage = m => {
      const stick = box.scrollHeight - box.scrollTop - box.clientHeight < 40;
      box.append(JSON.parse(m.data).replace(/^\S+ \S+ \S+: /, '') + '\n');
      if (box.childNodes.length > 4000) box.firstChild.remove();
      if (stick) box.scrollTop = box.scrollHeight;
    };
  }

  function editServices(p){
    const rows = p.services.map(s => ({ ...s, envText: s.envKeys.map(k => `${k}=`).join('\n') }));
    const list = h('div');
    const paintRows = () => list.replaceChildren(...rows.map((s, i) => {
      const inp = (k, attrs = {}) => { const el = h('input', { type: 'text', value: s[k] ?? '', ...attrs }); el.oninput = () => { s[k] = attrs.type === 'number' ? Number(el.value) : el.value; }; return el; };
      const env = h('textarea', { rows: 3, value: s.envText || '', placeholder: 'NAME=value, one per line', class: 'mono' }); env.oninput = () => { s.envText = env.value; };
      const auto = h('input', { type: 'checkbox', checked: s.autostart !== 0 && s.autostart !== false }); auto.onchange = () => { s.autostart = auto.checked; };
      const pub = h('input', { type: 'checkbox', checked: !!s.publicAccess }); pub.onchange = () => { s.publicAccess = pub.checked; };
      return h('div', { class: 'svc-edit' },
        h('div', { class: 'grid2' }, field('Name', inp('name'), 'short id, like web'), field('Label', inp('label'))),
        field('Start command', inp('command', { class: 'mono' }), 'runs in the project folder; $PORT is set'),
        h('div', { class: 'grid2' }, field('Port', inp('port', { type: 'number', min: 4301, max: 4999 })), field('Memory limit (MB)', inp('memoryMB', { type: 'number', min: 128, max: 3072 }))),
        field('Web address', inp('subdomain', { placeholder: 'leave empty for none' }), `becomes <name>.${state.me.domain}`),
        field('Settings (environment variables)', env, 'values are hidden; leave a value empty to keep it'),
        h('label', { class: 'check' }, auto, 'Start automatically when the server starts'),
        h('label', { class: 'check' }, pub, 'Public: anyone with the link can open it, no Studio sign-in (for client previews)'),
        h('button', { class: 'btn small danger', type: 'button', onclick: () => { rows.splice(i, 1); paintRows(); } }, 'Remove service'));
    }));
    paintRows();
    dialog(close => h('form', { onsubmit: async e => {
      e.preventDefault();
      const btn = e.submitter;
      await busy(btn, async () => {
        const r = await api('PUT', `/api/projects/${ctx.id}/services`, { services: rows.map(s => ({ id: s.id, name: s.name, label: s.label, command: s.command, port: s.port, subdomain: s.subdomain || null, memoryMB: s.memoryMB, autostart: s.autostart !== 0 && s.autostart !== false, publicAccess: !!s.publicAccess, envText: s.envText })) });
        close(); paint(r); toast('Services saved. Restart them to apply new settings.');
      }, 'Saving…').catch(() => {});
    } },
      h('h2', null, 'Edit services'),
      h('p', { class: 'muted small' }, 'New web addresses get an HTTPS certificate automatically, which takes about a minute.'),
      list,
      h('button', { class: 'btn small', type: 'button', onclick: async () => { rows.push({ name: '', label: '', command: 'node server.mjs', port: 4400 + Math.floor(Math.random() * 500), memoryMB: 800, autostart: true, envText: '' }); paintRows(); } }, '+ Add a service'),
      h('div', { class: 'row end', style: { marginTop: '18px' } }, h('button', { class: 'btn', type: 'button', onclick: () => close() }, 'Cancel'), h('button', { class: 'btn primary', type: 'submit' }, 'Save'))));
  }

  paint(ctx.project);
  const t = setInterval(async () => { if ($('.svc-edit')) return; try { const p = await ctx.reload(); if (!document.querySelector('.logs')) paint(p); } catch {} }, 6000);
  onLeave(() => clearInterval(t));
}

// =====================================================================
// Changes (git)
// =====================================================================
async function changesTab(ctx){
  const page = h('div', { class: 'page', style: { flex: 1 } });
  const inner = h('div', { class: 'page-inner' });
  page.append(inner);
  ctx.body.append(page);
  async function load(){
    inner.replaceChildren(h('p', { class: 'muted' }, 'Loading changes…'));
    const [status, log] = await Promise.all([api('GET', `/api/projects/${ctx.id}/git/status`), api('GET', `/api/projects/${ctx.id}/git/log`)]);
    if (!status.repo){ inner.replaceChildren(h('h1', null, 'Changes'), h('p', null, 'This project folder isn’t a git repository yet. Ask Claude to run “git init”.')); return; }
    const msg = h('textarea', { rows: 2, placeholder: 'Describe the change, e.g. “Make the board work on phones”' });
    const diffBox = h('div', { class: 'diff', 'aria-label': 'Changes' });
    inner.replaceChildren(
      h('h1', null, 'Changes'),
      h('p', { class: 'muted' }, `Branch ${status.branch}. Review what Claude changed, then save it as a commit, or undo files you don’t want.`),
      status.files.length ? h('div', null,
        h('div', { class: 'card' },
          h('ul', { class: 'files' }, status.files.slice(0, 300).map(f => h('li', null, h('span', { class: 'code' }, f.code.trim() === '??' ? 'new' : f.code.trim()), h('span', { class: 'path' }, f.path),
            h('button', { class: 'btn small ghost', onclick: async e => { if (await confirmDialog('Undo this file?', `${f.path} goes back to the last commit. New files are deleted.`, 'Undo file', true)) busy(e.target, async () => { await api('POST', `/api/projects/${ctx.id}/git/discard`, { files: [f.path] }); load(); }); } }, 'Undo')))),
          status.files.length > 300 ? h('p', { class: 'small muted' }, `…and ${status.files.length - 300} more`) : null,
          h('label', null, 'Commit message'), msg,
          h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary', onclick: e => busy(e.target, async () => {
            if (!msg.value.trim()) throw new Error('Write a short commit message first.');
            await api('POST', `/api/projects/${ctx.id}/git/commit`, { message: msg.value.trim() }); toast('Committed'); load();
          }, 'Committing…').catch(() => {}) }, `Commit ${status.files.length} file${status.files.length === 1 ? '' : 's'}`))),
        h('h2', null, 'What changed'), diffBox)
        : h('div', { class: 'card' }, 'No uncommitted changes.'),
      h('h2', null, 'Recent commits'),
      h('div', { class: 'card table-wrap' }, log.length ? h('table', { class: 'list' }, h('tbody', null, log.map(c => h('tr', null, h('td', { class: 'mono small' }, c.hash.slice(0, 7)), h('td', null, c.subject), h('td', { class: 'small muted' }, c.author), h('td', { class: 'small muted' }, ago(c.date))))))
        : h('p', { class: 'muted' }, 'No commits yet.'),
        log.length && ctx.project.canManage ? h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn small danger', onclick: async e => {
          if (await confirmDialog('Undo the last commit?', `This adds a new commit that reverses “${log[0].subject}”. Nothing is lost from history.`, 'Undo last commit', true))
            busy(e.target, async () => { await api('POST', `/api/projects/${ctx.id}/git/revert-last`); toast('Reverted'); load(); });
        } }, 'Undo last commit')) : null));
    if (status.files.length){
      const text = await fetch(`/api/projects/${ctx.id}/git/diff`).then(r => r.text());
      const lines = text.split('\n').slice(0, 8000);
      diffBox.replaceChildren(...lines.map(l => h('div', { class: l.startsWith('diff --git') ? 'file' : l.startsWith('@@') ? 'hunk' : l.startsWith('+') && !l.startsWith('+++') ? 'add' : l.startsWith('-') && !l.startsWith('---') ? 'del' : '' }, l.startsWith('diff --git') ? l.replace(/^diff --git a\/(.*) b\/.*$/, '$1') : l || ' ')));
      if (!text.trim()) diffBox.replaceChildren(h('div', null, 'Only binary or permission changes.'));
    }
  }
  load().catch(e => inner.replaceChildren(h('div', { class: 'error-box' }, e.message)));
}

// =====================================================================
// Files (read-only)
// =====================================================================
async function filesTab(ctx){
  const page = h('div', { class: 'page', style: { flex: 1 } });
  const inner = h('div', { class: 'page-inner', style: { maxWidth: '1200px' } });
  page.append(inner);
  ctx.body.append(page);
  const filter = h('input', { type: 'text', placeholder: 'Filter files…', 'aria-label': 'Filter files' });
  const tree = h('div', { class: 'file-tree' });
  const view = h('pre', { class: 'file-view' }, 'Choose a file to view it. To change files, ask Claude in the Chat tab.');
  inner.append(h('h1', null, 'Files'), h('div', { class: 'file-browser' }, h('div', null, filter, h('div', { style: { height: '8px' } }), tree), view));
  let files = [];
  try { files = await api('GET', `/api/projects/${ctx.id}/files`); } catch (e){ tree.textContent = e.message; return; }
  const paint = () => {
    const q = filter.value.toLowerCase();
    const shown = files.filter(f => f.toLowerCase().includes(q)).slice(0, 1500);
    tree.replaceChildren(...shown.map(f => h('button', { onclick: async e => {
      tree.querySelectorAll('.on').forEach(b => b.classList.remove('on')); e.target.classList.add('on');
      view.textContent = 'Loading…';
      try {
        if (/\.(png|jpe?g|gif|webp|ico|woff2?|ttf|pdf|zip|gz)$/i.test(f)) view.textContent = 'This is a binary file.';
        else view.textContent = await (await fetch(`/api/projects/${ctx.id}/file?path=${encodeURIComponent(f)}`)).text();
      } catch (err){ view.textContent = err.message; }
    } }, f)), files.length > shown.length ? h('p', { class: 'small muted', style: { padding: '6px 10px' } }, `${files.length - shown.length} more; filter to find them`) : null);
  };
  filter.oninput = paint;
  paint();
}

// =====================================================================
// Settings
// =====================================================================
function settingsTab(ctx){
  const p = ctx.project;
  const page = h('div', { class: 'page', style: { flex: 1 } });
  const inner = h('div', { class: 'page-inner', style: { maxWidth: '680px' } });
  page.append(inner);
  ctx.body.append(page);
  if (!p.canManage){
    inner.append(h('h1', null, 'Settings'), h('p', null, `Team: ${p.team?.name}. Only team owners and admins can change project settings.`));
    return;
  }
  const name = h('input', { type: 'text', value: p.name, maxlength: 80 });
  const desc = h('textarea', { rows: 3, value: p.description || '' });
  const team = h('select', null, state.me.teams.filter(t => ['owner', 'admin'].includes(t.role) || state.me.user.role === 'admin').map(t => h('option', { value: t.organizationId }, t.name)));
  if (![...team.options].some(o => o.value === p.organizationId)) team.prepend(h('option', { value: p.organizationId }, p.team?.name || 'Current team'));
  team.value = p.organizationId;
  const worker = h('select', null,
    h('option', { value: '' }, 'Nobody (project AI workers can’t run)'),
    p.workerClaude && p.workerClaude.id !== state.me.user.id ? h('option', { value: p.workerClaude.id }, `${p.workerClaude.name}'s Claude`) : null,
    h('option', { value: state.me.user.id }, `My Claude (${state.me.claude?.connected ? state.me.claude.kind === 'subscription' ? 'subscription' : 'API key' : 'not connected yet'})`));
  worker.value = p.workerClaudeUserId || '';
  const confirm = h('input', { type: 'text', placeholder: p.slug, 'aria-label': 'Type the short name to confirm' });
  // Studio admins: older projects share the ztd user; this moves one onto its own user, as new projects get.
  const userCard = h('div', { class: 'card' }, h('p', { class: 'muted', style: { margin: 0 } }, 'Checking…'));
  const paintUser = u => fill(userCard, u.own
    ? h('p', { style: { margin: 0 } }, 'Runs as its own Linux user, ', h('span', { class: 'mono' }, u.user), '. Other projects’ chats and services can’t open its folder.')
    : [h('p', { style: { marginTop: 0 } }, 'Runs as ', h('span', { class: 'mono' }, u.user), ', a Linux user shared with other older projects, so their chats can read and change its folder, and its chats can do the same to theirs. New projects get their own user.'),
      h('p', { class: 'small muted' }, 'Moving it gives it its own user, like new projects. Its running services stop for a minute or two and start again; chats keep their history, and nothing else changes.'),
      h('button', { class: 'btn primary', onclick: e => busy(e.target, async () => {
        if (!await confirmDialog(`Move ${p.name} to its own user?`, 'Its services stop while its files move, then start again. Don’t start chats in it until this finishes.', 'Move it')) return;
        const r = await api('POST', `/api/projects/${ctx.id}/own-user`);
        toast(r.failed.length ? `Moved, but ${r.failed.join(', ')} didn’t start again: see Services.` : `Moved: ${p.name} now runs as ${r.user}`, !!r.failed.length);
        paintUser({ user: r.user, own: true });
      }, 'Moving…').catch(() => {}) }, 'Move to its own user')]);
  if (state.me.user.role === 'admin') api('GET', `/api/projects/${ctx.id}/user`).then(paintUser, e => fill(userCard, h('div', { class: 'error-box' }, e.message)));
  inner.append(
    h('h1', null, 'Settings'),
    h('form', { onsubmit: async e => {
      e.preventDefault();
      await busy(e.submitter, async () => {
        await api('PATCH', `/api/projects/${ctx.id}`, { name: name.value, description: desc.value, organizationId: team.value, workerClaudeUserId: worker.value || null });
        toast('Saved'); refreshProjects().catch(() => {});
      }, 'Saving…').catch(() => {});
    } },
      field('Name', name), field('Description', desc, 'Claude reads this at the start of every chat. If an admin turns on focus checks, prompts are compared with it'), field('Team', team, 'everyone in this team can open and work on it'),
      field('Claude for the project’s own AI workers', worker, 'some projects (like the pipeline) run Claude themselves; they use this connection'),
      h('p', { class: 'small muted' }, `Folder on the server: /srv/projects/${p.slug}/repo`),
      h('button', { class: 'btn primary', type: 'submit', style: { marginTop: '8px' } }, 'Save')),
    ...(state.me.user.role === 'admin' ? [h('h2', null, 'Who it runs as'), userCard] : []),
    h('h2', { style: { color: 'var(--bad)' } }, 'Delete project'),
    h('div', { class: 'card' },
      h('p', null, 'Stops its services and removes its web addresses. The folder is moved to /srv/projects/.trash on the server, so an admin can still recover it.'),
      field(`Type ${p.slug} to confirm`, confirm),
      h('button', { class: 'btn danger', style: { marginTop: '10px' }, onclick: e => busy(e.target, async () => {
        await api('DELETE', `/api/projects/${ctx.id}`, { confirm: confirm.value.trim() });
        toast('Project deleted'); await refreshProjects(); go('/', true);
      }, 'Deleting…').catch(() => {}) }, 'Delete project')));
}

// =====================================================================
// New project
// =====================================================================
export function newProjectDialog(){
  const teams = state.me.teams.filter(t => ['owner', 'admin'].includes(t.role) || state.me.user.role === 'admin');
  if (!teams.length) return toast('Create a team first (Teams and people).', true);
  const name = h('input', { type: 'text', required: true, maxlength: 80, autofocus: true, placeholder: 'e.g. GP Pipeline' });
  const slug = h('input', { type: 'text', required: true, maxlength: 32, pattern: '[a-z][a-z0-9-]*[a-z0-9]', placeholder: 'gp-pipeline' });
  let slugTouched = false;
  name.oninput = () => { if (!slugTouched) slug.value = name.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/^[^a-z]+/, '').slice(0, 32); hint.textContent = `https://${slug.value || 'name'}.${state.me.domain}`; };
  const hint = h('span', { class: 'mono' }, `https://name.${state.me.domain}`);
  slug.oninput = () => { slugTouched = true; hint.textContent = `https://${slug.value || 'name'}.${state.me.domain}`; };
  const team = h('select', null, teams.map(t => h('option', { value: t.organizationId }, t.name)));
  const start = h('select', null, h('option', { value: 'blank' }, 'A blank website (small Node server)'), h('option', { value: 'git' }, 'Copy a public Git repository'));
  const git = h('input', { type: 'url', placeholder: 'https://github.com/owner/repo.git' });
  const gitField = field('Git address', git, 'must be public; it needs an npm start script');
  gitField.hidden = true;
  start.onchange = () => { gitField.hidden = start.value !== 'git'; };
  const desc = h('textarea', { rows: 2, placeholder: 'What is it for? (optional)' });
  dialog(close => h('form', { onsubmit: async e => {
    e.preventDefault();
    await busy(e.submitter, async () => {
      const p = await api('POST', '/api/projects', { name: name.value.trim(), slug: slug.value.trim(), organizationId: team.value, starter: start.value === 'git' ? null : 'blank', gitUrl: start.value === 'git' ? git.value.trim() : null, description: desc.value });
      close(); toast('Creating the project. It’s ready in under a minute.');
      await refreshProjects(); go(`/p/${p.id}/chat/new`);
    }, 'Creating…').catch(() => {});
  } },
    h('h2', null, 'New project'),
    field('Name', name), field('Short name', slug, 'lowercase; also its web address'), h('p', { class: 'small muted', style: { margin: '4px 0 0' } }, hint),
    field('Team', team), field('Start from', start), gitField, field('Description', desc, 'Claude reads this at the start of every chat'),
    h('div', { class: 'row end', style: { marginTop: '18px' } }, h('button', { class: 'btn', type: 'button', onclick: () => close() }, 'Cancel'), h('button', { class: 'btn primary', type: 'submit' }, 'Create project'))));
}
