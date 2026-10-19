// Compose / reply / forward window. Floating card, autosave drafts, send.
import { api } from '../api.js';
import { h, icon, toast } from '../ui.js';

let activeCard = null; // only one compose card at a time

function parseAddrs(str) {
  return String(str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

window.openCompose = (prefill = {}) => {
  // Only one compose card at a time — focus existing instead of opening another.
  if (activeCard && document.body.contains(activeCard)) {
    const existing = activeCard.querySelector('.compose-field input');
    if (existing) existing.focus();
    return activeCard;
  }

  let currentDraftId = prefill.id || null;
  let saveTimer = null;
  let ccVisible = !!(prefill.cc || prefill.bcc);

  const mode = prefill.mode || 'new';
  const title = mode === 'reply' ? 'Reply' : mode === 'forward' ? 'Forward' : 'New message';

  // ---- fields ----
  const toInput = h('input', { type: 'text', value: prefill.to || '', placeholder: 'Recipients' });
  const ccInput = h('input', { type: 'text', value: prefill.cc || '', placeholder: 'Cc' });
  const bccInput = h('input', { type: 'text', value: prefill.bcc || '', placeholder: 'Bcc' });
  const subjectInput = h('input', { type: 'text', value: prefill.subject || '', placeholder: 'Subject' });
  const body = h('div', { class: 'compose-body', contenteditable: 'true' });
  if (prefill.html) body.innerHTML = prefill.html;
  else if (prefill.text) body.textContent = prefill.text;

  const ccRow = h('div', { class: 'compose-field', style: { display: ccVisible ? 'flex' : 'none' } },
    h('label', {}, 'Cc'), ccInput);
  const bccRow = h('div', { class: 'compose-field', style: { display: ccVisible ? 'flex' : 'none' } },
    h('label', {}, 'Bcc'), bccInput);

  const ccToggle = h('button', {
    class: 'btn btn-ghost btn-sm', type: 'button', title: 'Cc / Bcc',
    onClick: () => {
      ccVisible = !ccVisible;
      ccRow.style.display = ccVisible ? 'flex' : 'none';
      bccRow.style.display = ccVisible ? 'flex' : 'none';
      if (ccVisible) ccInput.focus();
    },
  }, 'Cc/Bcc');

  const savedHint = h('span', { class: 'muted', style: { fontSize: '12px', marginLeft: '8px' } }, '');

  // ---- autosave ----
  function collect() {
    return {
      to: parseAddrs(toInput.value),
      cc: parseAddrs(ccInput.value),
      bcc: parseAddrs(bccInput.value),
      subject: subjectInput.value.trim(),
      html: body.innerHTML,
      text: body.innerText,
    };
  }

  async function saveNow() {
    const { to, cc, bcc, subject, html, text } = collect();
    // Skip saving a completely empty draft.
    if (!to.length && !cc.length && !bcc.length && !subject && !text.trim() && !currentDraftId) return;
    try {
      const res = await api.post('/api/drafts', {
        id: currentDraftId,
        threadId: prefill.threadId,
        to, cc, bcc, subject, html, text,
        inReplyTo: prefill.inReplyTo,
      });
      if (res && res.id) currentDraftId = res.id;
      savedHint.textContent = 'Saved';
    } catch {
      savedHint.textContent = '';
    }
  }

  function scheduleSave() {
    savedHint.textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 1500);
  }

  for (const el of [toInput, ccInput, bccInput, subjectInput]) el.addEventListener('input', scheduleSave);
  body.addEventListener('input', scheduleSave);

  // ---- actions ----
  function closeCard() {
    clearTimeout(saveTimer);
    card.remove();
    if (activeCard === card) activeCard = null;
  }

  async function discard() {
    clearTimeout(saveTimer);
    if (currentDraftId) {
      try { await api.del('/api/drafts/' + currentDraftId); } catch {}
    }
    closeCard();
  }

  async function send() {
    const { to, cc, bcc, subject, html, text } = collect();
    if (!to.length && !cc.length && !bcc.length) {
      toast('Add at least one recipient', 'error');
      toInput.focus();
      return;
    }
    clearTimeout(saveTimer);
    sendBtn.disabled = true;
    try {
      await api.post('/api/send', {
        to, cc, bcc, subject,
        html, text,
        inReplyTo: prefill.inReplyTo,
        threadId: prefill.threadId,
        draftId: currentDraftId,
      });
      toast('Sent');
      closeCard();
      const onMail = /^#\/(inbox|sent|drafts|trash|spam|starred|archive|thread|label|search)/.test(location.hash);
      if (onMail && window.app) window.app.refresh();
    } catch (e) {
      sendBtn.disabled = false;
      toast((e && e.message) || 'Failed to send', 'error');
    }
  }

  // ---- head ----
  let minimized = false;
  const minBtn = h('button', { class: 'btn btn-ghost btn-icon btn-sm compose-headbtn', type: 'button', title: 'Minimize' }, '–');
  const sendBtn = h('button', { class: 'btn btn-primary btn-sm', type: 'button', onClick: send }, icon('send'), 'Send');

  const bodyWrap = h('div', { class: 'compose-collapse' },
    h('div', { class: 'compose-field' }, h('label', {}, 'To'), toInput, ccToggle),
    ccRow,
    bccRow,
    h('div', { class: 'compose-field' }, h('label', {}, 'Subject'), subjectInput),
    body,
    h('div', { class: 'compose-foot' },
      sendBtn,
      h('button', { class: 'btn btn-ghost btn-icon', type: 'button', title: 'Attach',
        onClick: () => toast('Attachments coming soon') }, icon('paperclip')),
      savedHint,
      h('div', { class: 'grow' }),
      h('button', { class: 'btn btn-ghost btn-sm', type: 'button', title: 'Discard', onClick: discard }, icon('trash')),
    ),
  );

  minBtn.addEventListener('click', () => {
    minimized = !minimized;
    bodyWrap.style.display = minimized ? 'none' : 'block';
    minBtn.textContent = minimized ? '▢' : '–';
    minBtn.title = minimized ? 'Expand' : 'Minimize';
  });

  const closeBtn = h('button', { class: 'btn btn-ghost btn-icon btn-sm compose-headbtn', type: 'button', title: 'Close',
    onClick: () => { saveNow(); closeCard(); } }, icon('x'));

  const head = h('div', { class: 'compose-head' },
    h('span', {}, title),
    h('div', { class: 'grow' }),
    minBtn,
    closeBtn,
  );
  // Clicking the head toggles minimize (except on the buttons themselves).
  head.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    minBtn.click();
  });

  const card = h('div', { class: 'compose-card' }, head, bodyWrap);

  // scoped style for bits not in globals.css
  if (!document.getElementById('compose-style')) {
    document.head.append(h('style', { id: 'compose-style', html: `
      .compose-headbtn { color: hsl(var(--primary-foreground)); height: 26px; width: 26px; }
      .compose-headbtn:hover { background: hsl(var(--primary-foreground) / .15); }
      .compose-collapse { display: block; }
      .compose-card .compose-field label { flex: none; }
    ` }));
  }

  document.body.append(card);
  activeCard = card;
  (toInput.value ? subjectInput : toInput).focus();
  return card;
};

window.registerView('compose', (root, params, app) => {
  window.openCompose();
  app.navigate('#/inbox');
});
