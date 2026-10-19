// Admin routes: user management, domains, aliases. All require admin role.
export function register(router, { store, accounts, resend, util }) {
  const safeUser = (u) => u && {
    id: u.id, email: u.email, name: u.name, role: u.role, status: u.status, created_at: u.created_at,
  };

  // ---- users ----
  router.get('/api/admin/users', async (ctx) => {
    const admin = ctx.requireAdmin();
    const users = accounts.listUsers(admin.org_id).map(safeUser);
    ctx.json(200, users);
  });

  router.post('/api/admin/users', async (ctx) => {
    const admin = ctx.requireAdmin();
    const { email, name, password, role } = ctx.body;
    if (!email || !password) throw { status: 400, message: 'email and password required' };
    if (accounts.getUserByEmail(email)) throw { status: 409, message: 'Email exists' };
    const hash = await util.hashPassword(password);
    const uid = accounts.createUser({
      orgId: admin.org_id, email, name, passwordHash: hash,
      role: role === 'admin' ? 'admin' : 'member',
    });
    store.ensureSystemLabels(uid);
    accounts.audit(admin.id, 'user.create', email);
    ctx.json(200, { id: uid });
  });

  router.get('/api/admin/users/:id', async (ctx) => {
    ctx.requireAdmin();
    const u = accounts.getUserById(ctx.params.id);
    if (!u) throw { status: 404, message: 'Not found' };
    ctx.json(200, safeUser(u));
  });

  router.patch('/api/admin/users/:id', async (ctx) => {
    const admin = ctx.requireAdmin();
    const id = ctx.params.id;
    const target = accounts.getUserById(id);
    if (!target) throw { status: 404, message: 'Not found' };
    const { name, role, status, password } = ctx.body;
    if (password) accounts.setUserPassword(id, await util.hashPassword(password));
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (role !== undefined) fields.role = role;
    if (status !== undefined) fields.status = status;
    accounts.updateUser(id, fields);
    accounts.audit(admin.id, 'user.update', id);
    ctx.json(200, { ok: true });
  });

  // ---- domains ----
  router.get('/api/admin/domains', async (ctx) => {
    const admin = ctx.requireAdmin();
    const domains = accounts.listDomains(admin.org_id).map((d) => ({
      ...d, records: util.json.parse(d.records_json, []),
    }));
    ctx.json(200, domains);
  });

  router.post('/api/admin/domains', async (ctx) => {
    const admin = ctx.requireAdmin();
    const { domain } = ctx.body;
    if (!domain) throw { status: 400, message: 'domain required' };
    const rd = await resend.createDomain(domain, { receiving: true });
    const did = accounts.createDomain(admin.org_id, {
      domain, resend_domain_id: rd.id, records: rd.records, status: rd.status || 'pending', receiving: 1,
    });
    accounts.audit(admin.id, 'domain.create', domain);
    const stored = accounts.getDomain(did);
    ctx.json(200, { ...stored, records: util.json.parse(stored.records_json, []) });
  });

  router.post('/api/admin/domains/:id/verify', async (ctx) => {
    const admin = ctx.requireAdmin();
    const d = accounts.getDomain(ctx.params.id);
    if (!d) throw { status: 404, message: 'Not found' };
    const rd = await resend.verifyDomain(d.resend_domain_id);
    accounts.updateDomain(d.id, { status: rd.status, records: rd.records });
    accounts.audit(admin.id, 'domain.verify', d.domain);
    const updated = accounts.getDomain(d.id);
    ctx.json(200, { ...updated, records: util.json.parse(updated.records_json, []) });
  });

  // ---- aliases ----
  router.get('/api/admin/aliases', async (ctx) => {
    const admin = ctx.requireAdmin();
    ctx.json(200, accounts.listAliases(admin.org_id));
  });

  router.post('/api/admin/aliases', async (ctx) => {
    const admin = ctx.requireAdmin();
    const { address, userId } = ctx.body;
    if (!address || !userId) throw { status: 400, message: 'address and userId required' };
    accounts.createAlias(address, userId);
    accounts.audit(admin.id, 'alias.create', address);
    ctx.json(200, { ok: true });
  });

  router.del('/api/admin/aliases/:id', async (ctx) => {
    const admin = ctx.requireAdmin();
    accounts.deleteAlias(ctx.params.id);
    accounts.audit(admin.id, 'alias.delete', ctx.params.id);
    ctx.json(200, { ok: true });
  });
}
