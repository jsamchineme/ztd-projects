// Control panel API (/api/panel/*). Two kinds of login:
//   staff  — ZTD Office: every client, plans, prices, domains, licence.
//   client — a client's administrator: only their own inboxes, groups, aliases and domain.
// Mailboxes, aliases and groups are created on the mail server (src/stalwart.mjs); plan limits
// are enforced here before anything is sent there.
import * as stalwart from '../stalwart.mjs';
import { clients, users, sessions, invites, requests, activity } from './store.mjs';
import { PLANS, PLAN_ORDER, ADDONS, limitsFor, listPrice, monthlyPrice } from './plans.mjs';
import { checkDomain, cachedStatus } from './dns.mjs';

const COOKIE = 'ztd_panel';
const LICENCE_SEATS = Number(process.env.LICENCE_SEATS || 25);
const LICENCE_RENEWS = process.env.LICENCE_RENEWS || '2026-11-19';
const INTERNAL_DOMAIN = process.env.PANEL_INTERNAL_DOMAIN || 'ztdoffice.com';
const GB = 1024 ** 3;
const LOCAL_RE = /^[a-z0-9](?:[a-z0-9._-]{0,62}[a-z0-9])?$/;
const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (status, message) => { throw { status, message }; };

export function register(router, { util, config }) {
  // ------------------------------------------------------------ helpers
  const inviteUrl = t => `${config.appUrl.replace(/\/$/, '')}/panel/#/invite/${t}`;
  const actorOf = u => `${u.name} (${u.role === 'staff' ? 'ZTD' : 'client'})`;

  // Wrap mail-server calls so failures come back as a readable 502.
  async function mail(fn) {
    try { return await fn(); } catch (e) {
      if (e && e.status) throw e;
      fail(502, e?.message || 'Mail server error');
    }
  }
  const snap = (fresh = false) => mail(() => stalwart.snapshot({ fresh }));

  // Keep every client domain's DNS status current: check never-checked domains when a page
  // loads, and everything hourly. One run at a time; failures are retried next round.
  let checking = null;
  function checkStaleDomains({ all = false } = {}) {
    if (checking) return checking;
    checking = (async () => {
      try {
        const s = await stalwart.snapshot();
        for (const name of Object.keys(clients.allDomains())) {
          const cached = cachedStatus(name);
          if (!all && cached) continue;
          const d = s.domains.find(x => x.name === name);
          try { await checkDomain(name, d?.id, { refresh: true }); } catch { /* next round */ }
        }
      } catch { /* mail server unreachable: next round */ } finally { checking = null; }
    })();
    return checking;
  }
  if (stalwart.mode !== 'fake') {
    setTimeout(() => checkStaleDomains({ all: true }), 20_000).unref();
    setInterval(() => checkStaleDomains({ all: true }), 60 * 60_000).unref();
  }

  // First run: create the internal "ZTD Office" client and give it the platform domain.
  async function ensureSeed(s) {
    if (clients.list().length) return;
    const c = clients.create({ name: 'ZTD Office', contactName: 'Samuel', plan: 'business', customPrice: 0, internal: 1 });
    if (s.domains.some(d => d.name === INTERNAL_DOMAIN)) clients.addDomain(c.id, INTERNAL_DOMAIN);
  }

  function auth(ctx) {
    const u = sessions.lookup(ctx.cookies?.[COOKIE]);
    if (!u) fail(401, 'Please sign in');
    if (u.role === 'client') {
      const c = clients.get(u.client_id);
      if (!c) fail(401, 'Please sign in');
      if (c.status === 'suspended') fail(403, 'This account is suspended. Please contact ZTD Office.');
    }
    return u;
  }
  const staffOnly = ctx => { const u = auth(ctx); if (u.role !== 'staff') fail(403, 'ZTD staff only'); return u; };
  function clientAccess(ctx) {
    const u = auth(ctx);
    const c = clients.get(ctx.params.id);
    if (!c || (u.role === 'client' && u.client_id !== c.id)) fail(404, 'Client not found');
    return { u, c };
  }

  // Everything on the mail server that belongs to a client (matched by domain).
  function usage(c, s) {
    const doms = new Set(clients.domains(c.id));
    const inboxes = s.users.filter(u => doms.has(u.domain) && !u.admin);
    const shared = s.sharedInboxes.filter(g => doms.has(g.domain));
    const lists = s.lists.filter(l => doms.has(l.domain));
    const aliases = inboxes.flatMap(u => u.aliases.map(a => ({ address: a.address, enabled: a.enabled, inboxId: u.id, to: u.email, toName: u.description || u.name })));
    return {
      doms, inboxes, shared, lists, aliases,
      inboxCount: inboxes.length + shared.length,
      aliasCount: lists.length + aliases.length,
      usedBytes: [...inboxes, ...shared].reduce((a, x) => a + x.used, 0),
      quotaBytes: [...inboxes, ...shared].reduce((a, x) => a + x.quota, 0),
    };
  }

  function clientSummary(c, s) {
    const u = usage(c, s);
    const sd = Object.fromEntries(s.domains.map(d => [d.name, d]));
    return {
      id: c.id, name: c.name, contactName: c.contact_name, contactEmail: c.contact_email,
      plan: c.plan, planName: PLANS[c.plan]?.name || c.plan, internal: !!c.internal, status: c.status,
      customPrice: c.custom_price == null ? null : c.custom_price / 100, listPrice: listPrice(c), monthly: monthlyPrice(c),
      extraInboxes: c.extra_inboxes, extraAliases: c.extra_aliases, notes: c.notes, createdAt: c.created_at,
      limits: limitsFor(c),
      usage: { inboxes: u.inboxCount, aliases: u.aliasCount, usedBytes: u.usedBytes, quotaBytes: u.quotaBytes },
      domains: [...u.doms].map(name => {
        const dns = cachedStatus(name);
        return { name, id: sd[name]?.id || null, onMailServer: !!sd[name], createdAt: sd[name]?.createdAt || null,
          dns: dns ? { verified: dns.verified, missingRequired: dns.missingRequired, checkedAt: dns.checkedAt } : null };
      }),
      openRequests: requests.open(c.id).length,
    };
  }

  function clientDetail(c, s) {
    const u = usage(c, s);
    return {
      ...clientSummary(c, s),
      inboxes: u.inboxes.map(x => ({ id: x.id, email: x.email, local: x.name, domain: x.domain, name: x.description || '',
        quotaBytes: x.quota, usedBytes: x.used, suspended: x.suspended, createdAt: x.createdAt,
        aliases: x.aliases.map(a => a.address) })),
      sharedInboxes: u.shared.map(x => ({ id: x.id, email: x.email, name: x.description || x.name, usedBytes: x.used, quotaBytes: x.quota })),
      groups: u.lists.map(l => ({ id: l.id, email: l.email, local: l.name, description: l.description, recipients: l.recipients })),
      aliases: u.aliases,
      admins: users.forClient(c.id).map(a => ({ id: a.id, name: a.name, email: a.email, hasPassword: !!a.password_hash, lastLoginAt: a.last_login_at })),
      requests: requests.open(c.id).map(r => ({ id: r.id, kind: r.kind, detail: r.detail, createdAt: r.created_at })),
      activity: activity.list({ clientId: c.id, limit: 25 }).map(a => ({ action: a.action, detail: a.detail, actor: a.actor, at: a.created_at })),
      plans: PLAN_ORDER.map(id => PLANS[id]),
      addons: ADDONS,
    };
  }

  const addressInUse = (s, address) => {
    const a = address.toLowerCase();
    return s.users.some(u => u.email === a || u.aliases.some(x => x.address === a))
      || s.sharedInboxes.some(g => g.email === a) || s.lists.some(l => l.email === a || l.aliases.some(x => x.address === a));
  };
  const seatsUsed = s => s.users.length + s.sharedInboxes.length;

  function pickDomain(c, s, requested) {
    const doms = clients.domains(c.id);
    const name = (requested || doms[0] || '').toLowerCase();
    if (!doms.includes(name)) fail(400, 'Choose one of your domains');
    const d = s.domains.find(x => x.name === name);
    if (!d) fail(409, `${name} is not on the mail server yet`);
    return d;
  }

  const newPassword = () => util.token(12).replace(/[-_]/g, 'x');
  const checkPassword = p => { if (String(p).length < 10) fail(400, 'Passwords need at least 10 characters'); return String(p); };

  // ------------------------------------------------------------ sign-in
  const attempts = new Map(); // ip|email -> {n, at}
  router.post('/api/panel/login', async ctx => {
    const email = String(ctx.body.email || '').trim().toLowerCase();
    const key = `${ctx.req.socket.remoteAddress}|${email}`;
    const a = attempts.get(key);
    if (a && a.n >= 8 && Date.now() - a.at < 15 * 60_000) fail(429, 'Too many attempts. Try again in 15 minutes.');
    const u = users.byEmail(email);
    const ok = u && u.status === 'active' && u.password_hash && await util.verifyPassword(String(ctx.body.password || ''), u.password_hash);
    if (!ok) {
      attempts.set(key, { n: (a && Date.now() - a.at < 15 * 60_000 ? a.n : 0) + 1, at: a?.at && Date.now() - a.at < 15 * 60_000 ? a.at : Date.now() });
      fail(401, 'Wrong email or password');
    }
    attempts.delete(key);
    if (u.role === 'client' && clients.get(u.client_id)?.status === 'suspended') fail(403, 'This account is suspended. Please contact ZTD Office.');
    ctx.setCookie(COOKIE, sessions.create(u.id, ctx.req.headers['user-agent']), { maxAgeSec: 14 * 86400 });
    users.touchLogin(u.id);
    ctx.json(200, { ok: true });
  });

  router.post('/api/panel/logout', async ctx => {
    sessions.destroy(ctx.cookies?.[COOKIE]);
    ctx.clearCookie(COOKIE);
    ctx.json(200, { ok: true });
  });

  router.get('/api/panel/me', async ctx => {
    const u = auth(ctx);
    ctx.json(200, { user: { id: u.id, name: u.name, email: u.email, role: u.role, clientId: u.client_id }, mailServer: stalwart.mode });
  });

  router.get('/api/panel/invite/:token', async ctx => {
    const i = invites.lookup(ctx.params.token);
    if (!i) fail(404, 'This link has expired or was already used. Ask ZTD Office for a new one.');
    ctx.json(200, { name: i.user.name, email: i.user.email, role: i.user.role });
  });

  router.post('/api/panel/invite/:token', async ctx => {
    const i = invites.lookup(ctx.params.token);
    if (!i) fail(404, 'This link has expired or was already used. Ask ZTD Office for a new one.');
    const pw = checkPassword(ctx.body.password || '');
    users.setPassword(i.user.id, await util.hashPassword(pw));
    invites.use(ctx.params.token);
    sessions.destroyForUser(i.user.id);
    ctx.setCookie(COOKIE, sessions.create(i.user.id, ctx.req.headers['user-agent']), { maxAgeSec: 14 * 86400 });
    users.touchLogin(i.user.id);
    activity.log(i.user.client_id, actorOf(i.user), 'signed-up', 'Set a password and signed in');
    ctx.json(200, { ok: true });
  });

  // ------------------------------------------------------------ staff: overview, clients, domains
  router.get('/api/panel/overview', async ctx => {
    staffOnly(ctx);
    const s = await snap();
    await ensureSeed(s);
    if (stalwart.mode !== 'fake') checkStaleDomains();
    const all = clients.list();
    const sums = all.map(c => clientSummary(c, s));
    const paying = sums.filter(c => !c.internal && c.status === 'active');
    const attention = [];
    const used = seatsUsed(s);
    if (LICENCE_SEATS - used <= 5) attention.push({ level: 'bad', title: `Only ${LICENCE_SEATS - used} mail licence seats left`, detail: `${used} of ${LICENCE_SEATS} used. Add seats in the Stalwart portal before the next client.` });
    for (const r of requests.open()) {
      const c = all.find(x => x.id === r.client_id);
      attention.push({ level: 'brand', title: `${c?.name || 'A client'} asked: ${r.detail}`, detail: 'Change their plan on the client page, then mark the request done.', clientId: r.client_id });
    }
    for (const c of sums) {
      if (c.status === 'suspended') attention.push({ level: 'warn', title: `${c.name} is suspended`, detail: 'Nobody can sign in. Mail is still received.', clientId: c.id });
      if (!c.internal && c.usage.inboxes >= c.limits.inboxes) attention.push({ level: 'warn', title: `${c.name} is at their inbox limit`, detail: `${c.usage.inboxes} of ${c.limits.inboxes} on ${c.planName}`, clientId: c.id });
      for (const d of c.domains) {
        if (d.dns && !d.dns.verified) attention.push({ level: 'warn', title: `${d.name} isn't fully set up`, detail: `Missing: ${d.dns.missingRequired.join(', ') || 'DKIM keys'}`, clientId: c.id });
      }
    }
    const allDomains = sums.flatMap(c => c.domains);
    ctx.json(200, {
      mrr: paying.reduce((a, c) => a + c.monthly, 0),
      clients: { total: sums.filter(c => !c.internal).length, byPlan: Object.fromEntries(PLAN_ORDER.map(p => [p, paying.filter(c => c.plan === p).length])) },
      seats: { used, total: LICENCE_SEATS, renews: LICENCE_RENEWS },
      domains: { verified: allDomains.filter(d => d.dns?.verified).length, total: allDomains.length },
      storage: sums.map(c => ({ id: c.id, name: c.name, usedBytes: c.usage.usedBytes, quotaBytes: c.usage.quotaBytes })).sort((a, b) => b.usedBytes - a.usedBytes),
      attention,
      clientsList: sums,
      activity: activity.list({ limit: 8 }).map(a => ({ action: a.action, detail: a.detail, actor: a.actor, at: a.created_at, client: all.find(c => c.id === a.client_id)?.name || null })),
    });
  });

  router.get('/api/panel/clients', async ctx => {
    staffOnly(ctx);
    const s = await snap();
    await ensureSeed(s);
    ctx.json(200, { clients: clients.list().map(c => clientSummary(c, s)), plans: PLAN_ORDER.map(p => PLANS[p]) });
  });

  router.post('/api/panel/clients', async ctx => {
    const me = staffOnly(ctx);
    const b = ctx.body;
    const name = String(b.name || '').trim();
    const domain = String(b.domain || '').trim().toLowerCase();
    const contactName = String(b.contactName || '').trim();
    const contactEmail = String(b.contactEmail || '').trim().toLowerCase();
    if (!name) fail(400, 'Enter the business name');
    if (!DOMAIN_RE.test(domain)) fail(400, 'Enter a valid domain, like acme.co.uk');
    if (contactEmail && !EMAIL_RE.test(contactEmail)) fail(400, 'Enter a valid contact email');
    if (!PLANS[b.plan]) fail(400, 'Choose a plan');
    if (clients.allDomains()[domain]) fail(409, `${domain} already belongs to a client`);
    if (contactEmail && users.byEmail(contactEmail)) fail(409, `${contactEmail} already has a panel login`);
    const customPrice = b.customPrice === '' || b.customPrice == null ? null : Math.round(Number(b.customPrice) * 100);
    if (customPrice != null && !(customPrice >= 0)) fail(400, 'Enter a valid price');

    const s = await snap(true);
    await ensureSeed(s);
    if (!s.domains.some(d => d.name === domain)) await mail(() => stalwart.createDomain(domain));
    const c = clients.create({ name, contactName, contactEmail, plan: b.plan, customPrice });
    clients.addDomain(c.id, domain);
    activity.log(c.id, actorOf(me), 'client-created', `${name} on ${PLANS[b.plan].name} with ${domain}`);
    let invite = null;
    if (contactEmail) {
      const admin = users.create({ email: contactEmail, name: contactName || contactEmail, role: 'client', clientId: c.id });
      invite = inviteUrl(invites.create(admin.id));
      activity.log(c.id, actorOf(me), 'admin-invited', `${contactEmail} invited to manage the account`);
    }
    ctx.json(201, { id: c.id, invite });
  });

  router.get('/api/panel/clients/:id', async ctx => {
    const { c } = clientAccess(ctx);
    const s = await snap(ctx.query.fresh === '1');
    ctx.json(200, clientDetail(c, s));
  });

  router.patch('/api/panel/clients/:id', async ctx => {
    const me = staffOnly(ctx);
    const c = clients.get(ctx.params.id) || fail(404, 'Client not found');
    const b = ctx.body, f = {}, changes = [];
    if (b.name !== undefined) { f.name = String(b.name).trim() || c.name; }
    if (b.contactName !== undefined) f.contact_name = String(b.contactName).trim();
    if (b.contactEmail !== undefined) f.contact_email = String(b.contactEmail).trim().toLowerCase();
    if (b.notes !== undefined) f.notes = String(b.notes).slice(0, 2000);
    if (b.plan !== undefined) { if (!PLANS[b.plan]) fail(400, 'Unknown plan'); if (b.plan !== c.plan) changes.push(`plan ${PLANS[c.plan].name} → ${PLANS[b.plan].name}`); f.plan = b.plan; }
    if (b.extraInboxes !== undefined) { const n = Math.max(0, Math.min(100, Math.floor(Number(b.extraInboxes) || 0))); if (n !== c.extra_inboxes) changes.push(`extra inboxes ${c.extra_inboxes} → ${n}`); f.extra_inboxes = n; }
    if (b.extraAliases !== undefined) { const n = Math.max(0, Math.min(500, Math.floor(Number(b.extraAliases) || 0))); if (n !== c.extra_aliases) changes.push(`extra groups/aliases ${c.extra_aliases} → ${n}`); f.extra_aliases = n; }
    if (b.customPrice !== undefined) {
      const p = b.customPrice === '' || b.customPrice === null ? null : Math.round(Number(b.customPrice) * 100);
      if (p != null && !(p >= 0)) fail(400, 'Enter a valid price');
      if (p !== c.custom_price) changes.push(p == null ? 'back to list price' : `price £${(p / 100).toFixed(2)}/mo`);
      f.custom_price = p;
    }
    const updated = clients.update(c.id, f);
    if (changes.length) activity.log(c.id, actorOf(me), 'plan-changed', changes.join(', '));
    if (b.resolveRequestId) { requests.resolve(b.resolveRequestId); }
    const s = await snap();
    ctx.json(200, clientSummary(updated, s));
  });

  router.post('/api/panel/clients/:id/suspend', async ctx => {
    const me = staffOnly(ctx);
    const c = clients.get(ctx.params.id) || fail(404, 'Client not found');
    if (c.internal) fail(400, "The ZTD Office account can't be suspended");
    const suspend = !!ctx.body.suspended;
    const s = await snap(true);
    const { inboxes } = usage(c, s);
    if (suspend && c.status !== 'suspended') {
      const ids = inboxes.filter(i => !i.suspended).map(i => i.id);
      for (const id of ids) await mail(() => stalwart.setSuspended(id, true));
      clients.update(c.id, { status: 'suspended', suspended_ids: JSON.stringify(ids) });
      users.forClient(c.id).forEach(a => sessions.destroyForUser(a.id));
      activity.log(c.id, actorOf(me), 'client-suspended', `${ids.length} inbox sign-ins blocked`);
    } else if (!suspend && c.status === 'suspended') {
      const ids = JSON.parse(c.suspended_ids || '[]').filter(id => inboxes.some(i => i.id === id));
      for (const id of ids) await mail(() => stalwart.setSuspended(id, false));
      clients.update(c.id, { status: 'active', suspended_ids: null });
      activity.log(c.id, actorOf(me), 'client-resumed', `${ids.length} inbox sign-ins restored`);
    }
    ctx.json(200, { ok: true });
  });

  router.post('/api/panel/clients/:id/domains', async ctx => {
    const me = staffOnly(ctx);
    const c = clients.get(ctx.params.id) || fail(404, 'Client not found');
    const domain = String(ctx.body.domain || '').trim().toLowerCase();
    if (!DOMAIN_RE.test(domain)) fail(400, 'Enter a valid domain');
    if (clients.allDomains()[domain]) fail(409, `${domain} already belongs to a client`);
    const s = await snap(true);
    if (!s.domains.some(d => d.name === domain)) await mail(() => stalwart.createDomain(domain));
    clients.addDomain(c.id, domain);
    activity.log(c.id, actorOf(me), 'domain-added', domain);
    ctx.json(201, { ok: true });
  });

  router.post('/api/panel/clients/:id/admins', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const email = String(ctx.body.email || '').trim().toLowerCase();
    const name = String(ctx.body.name || '').trim();
    if (!EMAIL_RE.test(email)) fail(400, 'Enter a valid email');
    if (users.byEmail(email)) fail(409, `${email} already has a panel login`);
    const a = users.create({ email, name: name || email, role: 'client', clientId: c.id });
    activity.log(c.id, actorOf(me), 'admin-invited', `${email} invited to manage the account`);
    ctx.json(201, { invite: inviteUrl(invites.create(a.id)) });
  });

  router.post('/api/panel/users/:uid/invite', async ctx => {
    const me = auth(ctx);
    const target = users.get(ctx.params.uid) || fail(404, 'Login not found');
    if (me.role !== 'staff' && target.client_id !== me.client_id) fail(404, 'Login not found');
    if (target.role === 'staff' && me.role !== 'staff') fail(403, 'ZTD staff only');
    ctx.json(200, { invite: inviteUrl(invites.create(target.id)) });
  });

  router.post('/api/panel/requests/:rid/resolve', async ctx => {
    const me = staffOnly(ctx);
    const r = requests.get(ctx.params.rid) || fail(404, 'Request not found');
    requests.resolve(r.id);
    activity.log(r.client_id, actorOf(me), 'request-done', r.detail);
    ctx.json(200, { ok: true });
  });

  router.get('/api/panel/domains', async ctx => {
    staffOnly(ctx);
    const s = await snap();
    await ensureSeed(s);
    const owner = clients.allDomains();
    const names = Object.fromEntries(clients.list().map(c => [c.id, c.name]));
    ctx.json(200, { domains: s.domains.map(d => {
      const dns = cachedStatus(d.name);
      return { name: d.name, id: d.id, createdAt: d.createdAt, clientId: owner[d.name] || null, clientName: names[owner[d.name]] || null,
        inboxes: s.users.filter(u => u.domain === d.name && !u.admin).length,
        dns: dns ? { verified: dns.verified, missingRequired: dns.missingRequired, checkedAt: dns.checkedAt } : null };
    }), clients: clients.list().map(c => ({ id: c.id, name: c.name })) });
  });

  router.post('/api/panel/domains/assign', async ctx => {
    const me = staffOnly(ctx);
    const domain = String(ctx.body.domain || '').toLowerCase();
    const c = clients.get(ctx.body.clientId) || fail(404, 'Client not found');
    if (clients.allDomains()[domain]) fail(409, `${domain} already belongs to a client`);
    const s = await snap();
    if (!s.domains.some(d => d.name === domain)) fail(404, 'Domain not on the mail server');
    clients.addDomain(c.id, domain);
    activity.log(c.id, actorOf(me), 'domain-added', `${domain} assigned`);
    ctx.json(200, { ok: true });
  });

  router.get('/api/panel/clients/:id/dns', async ctx => {
    const { c } = clientAccess(ctx);
    const s = await snap();
    const out = [];
    for (const name of clients.domains(c.id)) {
      const d = s.domains.find(x => x.name === name);
      const r = await checkDomain(name, d?.id, { refresh: ctx.query.refresh === '1' });
      out.push({ name, createdAt: d?.createdAt || null, onMailServer: !!d, ...r });
    }
    ctx.json(200, { domains: out });
  });

  router.get('/api/panel/activity', async ctx => {
    staffOnly(ctx);
    const names = Object.fromEntries(clients.list().map(c => [c.id, c.name]));
    ctx.json(200, { activity: activity.list({ limit: 200 }).map(a => ({ action: a.action, detail: a.detail, actor: a.actor, at: a.created_at, clientId: a.client_id, client: names[a.client_id] || null })) });
  });

  router.get('/api/panel/settings', async ctx => {
    staffOnly(ctx);
    const s = await snap();
    ctx.json(200, {
      licence: { seats: LICENCE_SEATS, used: seatsUsed(s), renews: LICENCE_RENEWS },
      mailServer: { mode: stalwart.mode, domains: s.domains.length },
      staff: users.staff().map(u => ({ id: u.id, name: u.name, email: u.email, hasPassword: !!u.password_hash, lastLoginAt: u.last_login_at })),
      plans: PLAN_ORDER.map(p => PLANS[p]), addons: ADDONS,
    });
  });

  router.post('/api/panel/staff', async ctx => {
    const me = staffOnly(ctx);
    const email = String(ctx.body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) fail(400, 'Enter a valid email');
    if (users.byEmail(email)) fail(409, `${email} already has a panel login`);
    const u = users.create({ email, name: String(ctx.body.name || '').trim() || email, role: 'staff' });
    activity.log(null, actorOf(me), 'staff-invited', email);
    ctx.json(201, { invite: inviteUrl(invites.create(u.id)) });
  });

  router.get('/api/panel/plans', async ctx => { auth(ctx); ctx.json(200, { plans: PLAN_ORDER.map(p => PLANS[p]), addons: ADDONS }); });

  // ------------------------------------------------------------ client (or staff): inboxes, groups, aliases
  router.post('/api/panel/clients/:id/requests', async ctx => {
    const { u, c } = clientAccess(ctx);
    const plan = ctx.body.plan;
    let detail;
    if (plan) { if (!PLANS[plan]) fail(400, 'Unknown plan'); detail = `switch to ${PLANS[plan].name} (£${PLANS[plan].price}/mo)`; }
    else if (ctx.body.kind === 'extra-inbox') detail = `one extra inbox (+£${ADDONS.inbox.price}/mo)`;
    else if (ctx.body.kind === 'extra-aliases') detail = `5 more groups & aliases (+£${ADDONS.aliases.price}/mo)`;
    else fail(400, 'What would you like to change?');
    requests.create({ clientId: c.id, kind: plan ? 'plan' : ctx.body.kind, detail, createdBy: u.id });
    activity.log(c.id, actorOf(u), 'request', detail);
    ctx.json(201, { ok: true });
  });

  router.post('/api/panel/clients/:id/inboxes', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const local = String(ctx.body.local || '').trim().toLowerCase();
    const name = String(ctx.body.name || '').trim();
    if (!name) fail(400, 'Enter the person’s name');
    if (!LOCAL_RE.test(local)) fail(400, 'Use letters, numbers, dots or dashes for the address');
    const s = await snap(true);
    const d = pickDomain(c, s, ctx.body.domain);
    const l = limitsFor(c);
    if (usage(c, s).inboxCount >= l.inboxes) fail(402, `Your ${PLANS[c.plan].name} plan includes ${l.inboxes} inboxes. Upgrade or add an extra inbox to create more.`);
    if (seatsUsed(s) >= LICENCE_SEATS) fail(503, 'The mail server is full. ZTD Office has been told — please try again later.');
    const address = `${local}@${d.name}`;
    if (addressInUse(s, address)) fail(409, `${address} is already in use`);
    const generated = !ctx.body.password;
    const password = generated ? newPassword() : checkPassword(ctx.body.password);
    const id = await mail(() => stalwart.createUser({ domainId: d.id, local, name, quotaGb: l.storageGb, password }));
    activity.log(c.id, actorOf(me), 'inbox-created', address);
    ctx.json(201, { id, email: address, password: generated ? password : null });
  });

  async function findInbox(c, uid) {
    const s = await snap(true);
    const i = usage(c, s).inboxes.find(x => x.id === uid);
    if (!i) fail(404, 'Inbox not found');
    return { s, i };
  }

  router.patch('/api/panel/clients/:id/inboxes/:uid', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const { i } = await findInbox(c, ctx.params.uid);
    const name = String(ctx.body.name ?? '').trim();
    if (!name) fail(400, 'Enter a name');
    await mail(() => stalwart.updateUser(i.id, { name }));
    activity.log(c.id, actorOf(me), 'inbox-renamed', `${i.email} → ${name}`);
    ctx.json(200, { ok: true });
  });

  router.post('/api/panel/clients/:id/inboxes/:uid/password', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const { i } = await findInbox(c, ctx.params.uid);
    if (i.suspended) fail(409, 'Resume this inbox before resetting its password');
    const generated = !ctx.body.password;
    const password = generated ? newPassword() : checkPassword(ctx.body.password);
    await mail(() => stalwart.setPassword(i.id, password));
    activity.log(c.id, actorOf(me), 'password-reset', i.email);
    ctx.json(200, { email: i.email, password: generated ? password : null });
  });

  router.post('/api/panel/clients/:id/inboxes/:uid/suspend', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const { i } = await findInbox(c, ctx.params.uid);
    const suspend = !!ctx.body.suspended;
    await mail(() => stalwart.setSuspended(i.id, suspend));
    activity.log(c.id, actorOf(me), suspend ? 'inbox-suspended' : 'inbox-resumed', i.email);
    ctx.json(200, { ok: true });
  });

  router.del('/api/panel/clients/:id/inboxes/:uid', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const { s, i } = await findInbox(c, ctx.params.uid);
    if (String(ctx.body.confirm || '').trim().toLowerCase() !== i.email) fail(400, `Type ${i.email} to confirm`);
    // Take the address out of this client's groups first, so they don't bounce.
    for (const l of usage(c, s).lists.filter(l => l.recipients.includes(i.email))) {
      const rest = l.recipients.filter(r => r !== i.email);
      await mail(() => rest.length ? stalwart.updateList(l.id, { recipients: rest }) : stalwart.destroyList(l.id));
    }
    await mail(() => stalwart.destroyUser(i.id));
    activity.log(c.id, actorOf(me), 'inbox-deleted', i.email);
    ctx.json(200, { ok: true });
  });

  router.post('/api/panel/clients/:id/groups', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const type = ctx.body.type === 'alias' ? 'alias' : 'group';
    const local = String(ctx.body.local || '').trim().toLowerCase();
    if (!LOCAL_RE.test(local)) fail(400, 'Use letters, numbers, dots or dashes for the address');
    const s = await snap(true);
    const d = pickDomain(c, s, ctx.body.domain);
    const u = usage(c, s);
    const l = limitsFor(c);
    if (u.aliasCount >= l.aliases) fail(402, `Your ${PLANS[c.plan].name} plan includes ${l.aliases} groups & aliases. Upgrade or remove one to add more.`);
    const address = `${local}@${d.name}`;
    if (addressInUse(s, address)) fail(409, `${address} is already in use`);
    if (type === 'alias') {
      const target = u.inboxes.find(x => x.id === ctx.body.inboxId) || fail(400, 'Choose whose inbox it goes to');
      const next = [...target.aliases.map(a => ({ name: a.name, domainId: a.domainId, enabled: a.enabled })), { name: local, domainId: d.id }];
      await mail(() => stalwart.setAliases(target.id, next));
      activity.log(c.id, actorOf(me), 'alias-created', `${address} → ${target.email}`);
    } else {
      const recipients = [...new Set((ctx.body.recipients || []).map(r => String(r).trim().toLowerCase()).filter(Boolean))];
      if (!recipients.length) fail(400, 'Choose at least one person');
      if (recipients.length > 50) fail(400, 'A group can have up to 50 people');
      const badAddr = recipients.find(r => !EMAIL_RE.test(r));
      if (badAddr) fail(400, `${badAddr} isn't a valid email address`);
      await mail(() => stalwart.createList({ domainId: d.id, local, description: ctx.body.description, recipients }));
      activity.log(c.id, actorOf(me), 'group-created', `${address} (${recipients.length} people)`);
    }
    ctx.json(201, { email: address });
  });

  router.patch('/api/panel/clients/:id/groups/:gid', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const s = await snap(true);
    const g = usage(c, s).lists.find(l => l.id === ctx.params.gid) || fail(404, 'Group not found');
    const recipients = [...new Set((ctx.body.recipients || []).map(r => String(r).trim().toLowerCase()).filter(Boolean))];
    if (!recipients.length) fail(400, 'A group needs at least one person');
    const badAddr = recipients.find(r => !EMAIL_RE.test(r));
    if (badAddr) fail(400, `${badAddr} isn't a valid email address`);
    await mail(() => stalwart.updateList(g.id, { recipients }));
    activity.log(c.id, actorOf(me), 'group-updated', `${g.email} (${recipients.length} people)`);
    ctx.json(200, { ok: true });
  });

  router.del('/api/panel/clients/:id/groups/:gid', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const s = await snap(true);
    const g = usage(c, s).lists.find(l => l.id === ctx.params.gid) || fail(404, 'Group not found');
    await mail(() => stalwart.destroyList(g.id));
    activity.log(c.id, actorOf(me), 'group-deleted', g.email);
    ctx.json(200, { ok: true });
  });

  router.del('/api/panel/clients/:id/aliases/:address', async ctx => {
    const { u: me, c } = clientAccess(ctx);
    const address = ctx.params.address.toLowerCase();
    const s = await snap(true);
    const owner = usage(c, s).inboxes.find(i => i.aliases.some(a => a.address === address)) || fail(404, 'Alias not found');
    await mail(() => stalwart.setAliases(owner.id, owner.aliases.filter(a => a.address !== address)));
    activity.log(c.id, actorOf(me), 'alias-deleted', address);
    ctx.json(200, { ok: true });
  });
}
