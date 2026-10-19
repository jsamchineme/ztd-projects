// Mailbox view: two-pane layout (thread list + reading pane).
// Safe HTML rendering via sandboxed iframe with CSP that blocks remote content.
import { api } from '../api.js';
import { h, icon, avatar, toast, relTime } from '../ui.js';

const SYS_TITLES = {
  inbox: 'Inbox', sent: 'Sent', drafts: 'Drafts', trash: 'Trash',
  spam: 'Spam', archive: 'Archive', starred: 'Starred',
};

function fmtSize(n) {
  n = Number(n) || 0;
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

// Resolve a label name for the current route (sidebar may hold custom labels by id).
function labelTitle(labelKey) {
  if (!labelKey) return 'Inbox';
  if (SYS_TITLES[labelKey]) return SYS_TITLES[labelKey];
  const found = (window.app?.state?.labels || []).find(l => l.id === labelKey);
  return found ? found.name : labelKey;
}

// Translate a route label param into the API's label query value.
function apiLabelParam(labelKey) {
  if (!labelKey) return 'inbox';
  const found = (window.app?.state?.labels || []).find(l => l.id === labelKey);
  if (found) return found.system || found.name;
  return labelKey;
}

function buildQuote(msg) {
  if (!msg) return '';
  const who = msg.from_name || msg.from_addr || 'someone';
  const when = msg.sort_at || msg.created_at || '';
  const whenStr = when ? new Date(when).toLocaleString() : '';
  const bodyText = msg.text_body || (msg.html_body ? stripHtml(msg.html_body) : '') || '';
  const quoted = bodyText.split('\n').map(l => '> ' + l).join('\n');
  return `\n\nOn ${whenStr}, ${who} wrote:\n${quoted}`;
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = String(html || '');
  return (tmp.textContent || '').trim();
}

registerView('mailbox', async (root, params, app) => {
  const listEl = h('div', { class: 'mail-list' });
  const readerEl = h('div', { class: 'reader' });
  root.append(h('div', { class: 'mailbox' }, listEl, readerEl));

  let threads = [];
  let filter = 'all'; // 'all' | 'unread'

  // ---------- LIST ----------
  async function loadList() {
    listEl.innerHTML = '';
    listEl.append(h('div', { class: 'list-empty' }, h('div', { class: 'spinner' })));
    try {
      if (params.search) {
        const res = await api.get('/api/search?q=' + encodeURIComponent(params.search));
        threads = res.threads || [];
      } else {
        const res = await api.get('/api/threads?label=' + encodeURIComponent(apiLabelParam(params.label || 'inbox')));
        threads = res.threads || [];
        if (res.counts) {
          app.state.counts = res.counts;
          app.renderSidebar();
        }
      }
    } catch (e) {
      listEl.innerHTML = '';
      listEl.append(h('div', { class: 'list-empty' }, 'Failed to load: ' + (e.message || 'error')));
      return;
    }
    renderList();
  }

  function renderList() {
    listEl.innerHTML = '';
    const title = params.search ? 'Search' : labelTitle(params.label);

    const tabs = h('div', { class: 'tabs' },
      h('button', { class: 'tab' + (filter === 'all' ? ' active' : ''), onClick: () => { filter = 'all'; renderList(); } }, 'All mail'),
      h('button', { class: 'tab' + (filter === 'unread' ? ' active' : ''), onClick: () => { filter = 'unread'; renderList(); } }, 'Unread'),
    );
    listEl.append(h('div', { class: 'list-head' }, h('h2', {}, title), tabs));

    const shown = filter === 'unread' ? threads.filter(t => t.unread) : threads;
    const rows = h('div', { class: 'rows' });

    if (!shown.length) {
      rows.append(h('div', { class: 'list-empty' }, 'No conversations'));
      listEl.append(rows);
      return;
    }

    for (const t of shown) {
      const tags = [];
      for (const l of (t.labels || [])) {
        if (l.system) continue;
        tags.push(h('span', { class: 'badge badge-sec' }, l.name));
      }
      if (t.has_attachments) tags.push(h('span', { class: 'badge badge-outline' }, 'attachment'));

      const selected = params.threadId === t.id;
      const row = h('button', {
        class: 'row' + (t.unread ? ' unread' : '') + (selected ? ' selected' : ''),
        onClick: () => app.navigate('#/thread/' + t.id),
      },
        h('div', { class: 'l1' },
          h('span', { class: 'from' }, t.from || '(unknown)'),
          h('span', { class: 'time' }, relTime(t.last_at)),
        ),
        h('div', { class: 'subj' }, t.subject || '(no subject)'),
        t.snippet ? h('div', { class: 'snip' }, t.snippet) : null,
        tags.length ? h('div', { class: 'tags' }, ...tags) : null,
      );
      rows.append(row);
    }
    listEl.append(rows);
  }

  // ---------- READER ----------
  async function loadReader() {
    readerEl.innerHTML = '';
    if (!params.threadId) {
      readerEl.append(h('div', { class: 'reader-empty' }, 'Select a conversation'));
      return;
    }
    readerEl.append(h('div', { class: 'reader-empty' }, h('div', { class: 'spinner' })));

    let data;
    try {
      data = await api.get('/api/threads/' + encodeURIComponent(params.threadId));
    } catch (e) {
      readerEl.innerHTML = '';
      readerEl.append(h('div', { class: 'reader-empty' }, 'Failed to load: ' + (e.message || 'error')));
      return;
    }
    const { thread, messages } = data;
    renderReader(thread, messages || []);

    // Mark as read, then refresh sidebar counts.
    if (thread.unread) {
      try {
        await api.post('/api/threads/' + thread.id + '/read', { read: true });
        // reflect locally
        const lt = threads.find(t => t.id === thread.id);
        if (lt) { lt.unread = 0; renderList(); }
        app.refreshSidebar();
        // refresh counts for current label
        try {
          const res = await api.get('/api/threads?label=' + encodeURIComponent(apiLabelParam(params.label || 'inbox')));
          if (res.counts) { app.state.counts = res.counts; app.renderSidebar(); }
        } catch {}
      } catch {}
    }
  }

  function renderReader(thread, messages) {
    readerEl.innerHTML = '';
    const lastMessage = messages[messages.length - 1];
    const backLabel = params.search ? '#/search?q=' + encodeURIComponent(params.search) : '#/' + (params.label || 'inbox');

    // actions that move the thread out of the list
    async function moveAction(verb, label) {
      try {
        await api.post('/api/threads/' + thread.id + '/' + verb);
        toast(label);
        app.navigate(backLabel);
        app.refreshSidebar();
      } catch (e) {
        toast(e.message || 'Action failed', 'error');
      }
    }

    const customLabels = (app.state.labels || []).filter(l => !l.system);
    const threadLabelNames = new Set((thread.labels || []).filter(l => !l.system).map(l => l.name));

    const tagBtn = h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Labels' }, icon('tag'));
    tagBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLabelMenu(tagBtn, thread, customLabels, threadLabelNames, async (name, add) => {
        try {
          await api.post('/api/threads/' + thread.id + '/labels', add ? { add: [name] } : { remove: [name] });
          if (add) threadLabelNames.add(name); else threadLabelNames.delete(name);
          toast(add ? 'Label added' : 'Label removed');
          loadList();
        } catch (err) {
          toast(err.message || 'Failed', 'error');
        }
      });
    });

    let starred = !!thread.starred;
    const starBtn = h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: starred ? 'Unstar' : 'Star' }, icon('star'));
    if (starred) starBtn.style.color = 'hsl(var(--brand))';
    starBtn.addEventListener('click', async () => {
      starred = !starred;
      starBtn.style.color = starred ? 'hsl(var(--brand))' : '';
      starBtn.title = starred ? 'Unstar' : 'Star';
      try {
        await api.post('/api/threads/' + thread.id + '/star', { starred });
        const lt = threads.find(t => t.id === thread.id);
        if (lt) lt.starred = starred ? 1 : 0;
        app.refreshSidebar();
      } catch (e) {
        toast(e.message || 'Failed', 'error');
      }
    });

    const subject = thread.subject || '(no subject)';
    const replyTo = lastMessage ? [lastMessage.from_addr].filter(Boolean) : [];
    const replyAllTo = lastMessage ? [lastMessage.from_addr].filter(Boolean) : [];
    const replyAllCc = lastMessage ? (safeArr(lastMessage.cc_json)) : [];

    const toolbar = h('div', { class: 'reader-toolbar' },
      h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Archive', onClick: () => moveAction('archive', 'Archived') }, icon('archive')),
      h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Report spam', onClick: () => moveAction('spam', 'Marked as spam') }, icon('spam')),
      h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Delete', onClick: () => moveAction('trash', 'Moved to trash') }, icon('trash')),
      tagBtn,
      starBtn,
      h('div', { class: 'grow' }),
      h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Reply', onClick: () => window.openCompose && window.openCompose({
        mode: 'reply', threadId: thread.id, inReplyTo: lastMessage?.message_id,
        to: replyTo, subject: 'Re: ' + subject, quoted: buildQuote(lastMessage),
      }) }, icon('reply')),
      h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Reply all', onClick: () => window.openCompose && window.openCompose({
        mode: 'replyAll', threadId: thread.id, inReplyTo: lastMessage?.message_id,
        to: replyAllTo, cc: replyAllCc, subject: 'Re: ' + subject, quoted: buildQuote(lastMessage),
      }) }, icon('replyAll')),
      h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Forward', onClick: () => window.openCompose && window.openCompose({
        mode: 'forward', threadId: thread.id, inReplyTo: lastMessage?.message_id,
        subject: 'Fwd: ' + subject, quoted: buildQuote(lastMessage),
      }) }, icon('forward')),
    );

    const scroll = h('div', { class: 'reader-scroll' });
    scroll.append(h('h1', { style: { fontSize: '20px', margin: '0 0 20px' } }, subject));

    for (const m of messages) {
      scroll.append(renderMessage(m));
    }

    readerEl.append(toolbar, scroll);
  }

  function renderMessage(m) {
    const block = h('div', { class: 'msg-block' });
    const name = m.from_name || m.from_addr || '(unknown)';
    block.append(h('div', { class: 'mail-head' },
      avatar(name, 40),
      h('div', {},
        h('div', { class: 'name' }, name),
        h('div', { class: 'muted', style: { fontSize: '13px' } }, m.from_addr || ''),
      ),
      h('div', { class: 'time' }, relTime(m.sort_at || m.created_at)),
    ));

    const bodyWrap = h('div', {});
    if (m.html_body) {
      renderHtmlBody(bodyWrap, m.html_body);
    } else {
      bodyWrap.append(h('div', { class: 'prose' }, m.text_body || ''));
    }
    block.append(bodyWrap);

    // attachments
    const atts = m.attachments || [];
    const visible = atts.filter(a => (a.disposition || 'attachment') !== 'inline' || !a.content_id);
    if (visible.length) {
      const wrap = h('div', { style: { marginTop: '12px' } });
      for (const a of visible) {
        wrap.append(h('a', { class: 'attach-card', href: '/api/attachments/' + a.id, target: '_blank', rel: 'noopener' },
          icon('file'),
          h('span', {}, a.filename || 'attachment'),
          h('span', { class: 'muted' }, fmtSize(a.size)),
        ));
      }
      block.append(wrap);
    }
    return block;
  }

  // Render HTML in a sandboxed iframe (no allow-scripts) with CSP blocking remote content.
  function renderHtmlBody(container, html, showRemote = false) {
    container.innerHTML = '';
    const csp = showRemote
      ? "default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; font-src data:"
      : "default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:";
    const srcdoc = `<!doctype html><html><head>`
      + `<meta http-equiv="Content-Security-Policy" content="${csp}">`
      + `<base target="_blank">`
      + `<style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;font-size:14px;line-height:1.6;color:#111;}img{max-width:100%;height:auto;}a{color:#2563eb;}</style>`
      + `</head><body>${html}</body></html>`;

    if (!showRemote) {
      const notice = h('div', { class: 'notice' },
        icon('shield'),
        h('span', {}, 'Remote images are blocked.'),
        h('a', { href: '#', onClick: (e) => { e.preventDefault(); renderHtmlBody(container, html, true); } }, 'Show images'),
      );
      container.append(notice);
    }

    const frame = h('iframe', { class: 'mail-frame', sandbox: '' });
    frame.setAttribute('srcdoc', srcdoc);
    frame.addEventListener('load', () => {
      try {
        const doc = frame.contentDocument;
        if (doc && doc.body) {
          frame.style.height = (doc.body.scrollHeight + 8) + 'px';
        }
      } catch {}
    });
    container.append(frame);
  }

  // ---------- label menu popover ----------
  function openLabelMenu(anchor, thread, customLabels, activeNames, onToggle) {
    const existing = document.querySelector('.bm-label-menu');
    if (existing) { existing.remove(); return; }

    const menu = h('div', { class: 'bm-label-menu' });
    if (!customLabels.length) {
      menu.append(h('div', { class: 'bm-label-item muted' }, 'No labels yet'));
    } else {
      for (const l of customLabels) {
        const active = activeNames.has(l.name);
        const item = h('button', { class: 'bm-label-item' },
          h('span', { class: 'swatch', style: { background: l.color || '#64748b' } }),
          h('span', { class: 'grow' }, l.name),
          active ? icon('check') : null,
        );
        item.addEventListener('click', () => {
          onToggle(l.name, !active);
          menu.remove();
        });
        menu.append(item);
      }
    }

    document.body.append(menu);
    const r = anchor.getBoundingClientRect();
    menu.style.top = (r.bottom + 4) + 'px';
    menu.style.left = Math.max(8, r.right - 220) + 'px';

    const onDocClick = (e) => {
      if (!menu.contains(e.target) && e.target !== anchor) {
        menu.remove();
        document.removeEventListener('mousedown', onDocClick);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', onDocClick), 0);
  }

  // ---------- go ----------
  await loadList();
  await loadReader();
});

function safeArr(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v) { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

// Scoped styles for the label popover (not present in globals.css).
if (!document.getElementById('bm-mailbox-style')) {
  const s = document.createElement('style');
  s.id = 'bm-mailbox-style';
  s.textContent = `
.bm-label-menu { position: fixed; z-index: 95; width: 220px; background: hsl(var(--popover)); color: hsl(var(--popover-foreground)); border: 1px solid hsl(var(--border)); border-radius: var(--radius); box-shadow: 0 12px 32px rgba(0,0,0,.24); padding: 4px; }
.bm-label-item { display: flex; align-items: center; gap: 10px; width: 100%; height: 34px; padding: 0 10px; border: 0; background: transparent; border-radius: 6px; font-size: 13px; color: inherit; cursor: pointer; text-align: left; }
.bm-label-item:hover { background: hsl(var(--accent)); }
.bm-label-item.muted { cursor: default; }
.bm-label-item.muted:hover { background: transparent; }
`;
  document.head.append(s);
}
