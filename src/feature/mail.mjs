// Mail routes: threads, labels, send, drafts, search, attachments.
// Every route requires authentication. See SPEC.md "HTTP API > Mail".
import { createReadStream, existsSync } from 'node:fs';

export function register(router, deps) {
  const { config, store, resend, util } = deps;

  const asBool = (v) => v === '1' || v === 'true' || v === true;

  // Normalize a recipient field (string | array of "Name <addr>" | string) into
  // two shapes: a plain string array for Resend, and [{name,addr}] for storage.
  function normAddrs(v) {
    if (v == null || v === '') return { strings: undefined, objs: [] };
    const arr = Array.isArray(v) ? v : [v];
    const strings = arr.map((x) => String(x)).filter(Boolean);
    const objs = strings.map((s) => util.parseAddress(s));
    return { strings: strings.length ? strings : undefined, objs };
  }

  // ---------------- threads ----------------
  router.get('/api/threads', async (ctx) => {
    const user = ctx.requireAuth();
    const { label = 'inbox', q, starred, unread, limit, offset } = ctx.query;
    const threads = store.listThreads(user.id, {
      label,
      q,
      starred: asBool(starred),
      unread: asBool(unread),
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    });
    ctx.json(200, { threads, counts: store.countsByLabel(user.id) });
  });

  router.get('/api/threads/:id', async (ctx) => {
    const user = ctx.requireAuth();
    const r = store.getThread(user.id, ctx.params.id);
    if (!r) throw { status: 404, message: 'Not found' };
    ctx.json(200, r);
  });

  router.post('/api/threads/:id/read', async (ctx) => {
    const user = ctx.requireAuth();
    store.markThreadRead(user.id, ctx.params.id, ctx.body.read !== false);
    ctx.json(200, { ok: true });
  });

  router.post('/api/threads/:id/star', async (ctx) => {
    const user = ctx.requireAuth();
    store.starThread(user.id, ctx.params.id, ctx.body.starred !== false);
    ctx.json(200, { ok: true });
  });

  router.post('/api/threads/:id/archive', async (ctx) => {
    const user = ctx.requireAuth();
    store.archiveThread(user.id, ctx.params.id);
    ctx.json(200, { ok: true });
  });

  router.post('/api/threads/:id/trash', async (ctx) => {
    const user = ctx.requireAuth();
    store.trashThread(user.id, ctx.params.id);
    ctx.json(200, { ok: true });
  });

  router.post('/api/threads/:id/spam', async (ctx) => {
    const user = ctx.requireAuth();
    store.spamThread(user.id, ctx.params.id);
    ctx.json(200, { ok: true });
  });

  router.post('/api/threads/:id/labels', async (ctx) => {
    const user = ctx.requireAuth();
    const { add = [], remove = [] } = ctx.body;
    store.setThreadLabels(user.id, ctx.params.id, { add, remove });
    ctx.json(200, { ok: true });
  });

  // ---------------- labels ----------------
  router.get('/api/labels', async (ctx) => {
    const user = ctx.requireAuth();
    ctx.json(200, store.listLabels(user.id));
  });

  router.post('/api/labels', async (ctx) => {
    const user = ctx.requireAuth();
    const { name, color } = ctx.body;
    if (!name || !String(name).trim()) throw { status: 400, message: 'Name required' };
    ctx.json(200, { id: store.createLabel(user.id, { name: String(name).trim(), color }) });
  });

  router.del('/api/labels/:id', async (ctx) => {
    const user = ctx.requireAuth();
    store.deleteLabel(user.id, ctx.params.id);
    ctx.json(200, { ok: true });
  });

  // ---------------- send ----------------
  router.post('/api/send', async (ctx) => {
    const user = ctx.requireAuth();
    const b = ctx.body;
    const { subject, html, text, inReplyTo, threadId, references, draftId } = b;

    const from = user.name ? `${user.name} <${user.email}>` : user.email;
    const msgId = `<${util.id()}@${config.platformDomain}>`;

    const headers = {
      'Message-ID': msgId,
      ...(inReplyTo
        ? {
            'In-Reply-To': inReplyTo,
            'References': [...(references || []), inReplyTo].join(' '),
          }
        : {}),
    };

    const to = normAddrs(b.to);
    const cc = normAddrs(b.cc);
    const bcc = normAddrs(b.bcc);

    if (!to.strings && !cc.strings && !bcc.strings) {
      throw { status: 400, message: 'At least one recipient is required' };
    }

    const sent = await resend.sendEmail({
      from,
      to: to.strings,
      cc: cc.strings,
      bcc: bcc.strings,
      subject,
      html,
      text,
      reply_to: user.email,
      headers,
    });

    const result = store.insertOutgoingMessage(user.id, {
      threadId,
      inReplyTo,
      references,
      from: util.parseAddress(from),
      to: to.objs,
      cc: cc.objs,
      bcc: bcc.objs,
      subject,
      html,
      text,
      messageId: msgId,
      resendId: sent.id,
    });

    if (draftId) store.deleteDraft(user.id, draftId);

    ctx.json(200, { ok: true, threadId: result.threadId, id: sent.id });
  });

  // ---------------- drafts ----------------
  router.get('/api/drafts', async (ctx) => {
    const user = ctx.requireAuth();
    ctx.json(200, store.listDrafts(user.id));
  });

  router.get('/api/drafts/:id', async (ctx) => {
    const user = ctx.requireAuth();
    const d = store.getDraft(user.id, ctx.params.id);
    if (!d) throw { status: 404, message: 'Not found' };
    ctx.json(200, d);
  });

  router.post('/api/drafts', async (ctx) => {
    const user = ctx.requireAuth();
    ctx.json(200, { id: store.saveDraft(user.id, ctx.body) });
  });

  router.del('/api/drafts/:id', async (ctx) => {
    const user = ctx.requireAuth();
    store.deleteDraft(user.id, ctx.params.id);
    ctx.json(200, { ok: true });
  });

  // ---------------- search ----------------
  router.get('/api/search', async (ctx) => {
    const user = ctx.requireAuth();
    ctx.json(200, { threads: store.search(user.id, ctx.query.q || '', { limit: 50 }) });
  });

  // ---------------- attachments ----------------
  router.get('/api/attachments/:id', async (ctx) => {
    const user = ctx.requireAuth();
    const a = store.getAttachment(user.id, ctx.params.id);
    if (!a) throw { status: 404, message: 'Not found' };

    const filename = a.filename || 'attachment';
    if (a.storage_path && existsSync(a.storage_path)) {
      ctx.res.writeHead(200, {
        'Content-Type': a.content_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
      });
      createReadStream(a.storage_path).pipe(ctx.res);
      return;
    }
    // Raw download not stored in MVP.
    ctx.json(200, { unavailable: true, filename });
  });
}
