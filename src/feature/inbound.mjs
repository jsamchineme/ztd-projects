// Resend inbound webhook. Verifies Svix signature over the RAW body, is idempotent by
// svix-id, and on email.received fetches full content and stores it for the mapped user.
// See SPEC.md > HTTP API > Inbound.

export function register(router, deps) {
  const { config, db, store, accounts, resend, util } = deps;

  router.post('/api/webhooks/resend', async (ctx) => {
    const rawBody = ctx.rawBody.toString('utf8');
    const h = ctx.req.headers;
    const svixId = h['svix-id'];
    const svixTimestamp = h['svix-timestamp'];
    const svixSignature = h['svix-signature'];

    // 1. Signature verification (skipped in dev/TEST_MODE when no secret configured).
    if (config.resendWebhookSecret) {
      if (!resend.verifyWebhookSignature(config.resendWebhookSecret, { svixId, svixTimestamp, svixSignature }, rawBody)) {
        throw { status: 401, message: 'bad signature' };
      }
    }

    // 2. Parse event.
    const event = JSON.parse(rawBody);

    // 3. Idempotency via webhook_events keyed by svix-id.
    if (svixId) {
      const existing = db.prepare('SELECT id FROM webhook_events WHERE id = ?').get(svixId);
      if (existing) return ctx.json(200, { ok: true, dup: true });
      db.prepare('INSERT INTO webhook_events (id,type,received_at,payload,status) VALUES (?,?,?,?,?)')
        .run(svixId, event.type || null, util.now(), rawBody, 'received');
    }

    // 4. Inbound email.
    if (event.type === 'email.received') {
      const full = await resend.getReceivedEmail(event.data.email_id);

      // Map recipient addresses to a local user; first that resolves wins.
      const candidates = [...(event.data.received_for || []), ...(full.to || event.data.to || [])];
      let user = null;
      for (const addr of candidates) {
        const parsed = util.parseAddress(addr);
        user = accounts.findUserForAddress(parsed.addr || addr);
        if (user) break;
      }
      if (!user) return ctx.json(200, { ok: true, ignored: true });

      const headers = full.headers || {};
      const references = String(headers['references'] || '').split(/\s+/).filter(Boolean);
      const parsed = {
        from: util.parseAddress(full.from),
        to: (full.to || []).map(util.parseAddress),
        cc: (full.cc || []).map(util.parseAddress),
        bcc: (full.bcc || []).map(util.parseAddress),
        subject: full.subject,
        html: full.html,
        text: full.text,
        headers,
        messageId: full.message_id || headers['message-id'],
        inReplyTo: headers['in-reply-to'],
        references,
        attachments: full.attachments || [],
        date: full.created_at,
      };

      store.insertIncomingMessage(user.id, parsed);
      return ctx.json(200, { ok: true });
    }

    // 5. Delivery lifecycle events: audit only.
    if (event.type === 'email.bounced' || event.type === 'email.complained' || event.type === 'email.delivered') {
      accounts.audit(null, 'resend.' + event.type, JSON.stringify(event.data || {}));
      return ctx.json(200, { ok: true });
    }

    // 6. Unknown types: acknowledge.
    return ctx.json(200, { ok: true });
  });
}
