// Settings routes: profile (name, signature), preferences, and optional filters.
export function register(router, deps) {
  const { db, accounts, util } = deps;

  // Build the GET /api/settings payload for a user.
  function settingsPayload(user) {
    const prefs = accounts.getSettings(user.id) || {};
    return {
      name: user.name,
      email: user.email,
      signature: user.signature || '',
      prefs: {
        blockRemoteImages: prefs.blockRemoteImages !== false,
        theme: prefs.theme || 'system',
        ...prefs,
      },
    };
  }

  router.get('/api/settings', async (ctx) => {
    const user = ctx.requireAuth();
    ctx.json(200, settingsPayload(user));
  });

  router.patch('/api/settings', async (ctx) => {
    const user = ctx.requireAuth();
    const { name, signature, prefs } = ctx.body || {};

    const fields = {};
    if (name !== undefined) fields.name = name;
    if (signature !== undefined) fields.signature = signature;
    if (Object.keys(fields).length) accounts.updateUser(user.id, fields);

    if (prefs && typeof prefs === 'object') {
      for (const key of Object.keys(prefs)) accounts.setSetting(user.id, key, prefs[key]);
    }

    // Re-read user so updated name/signature are reflected.
    const fresh = accounts.getUserById(user.id) || user;
    ctx.json(200, settingsPayload(fresh));
  });

  // ---- Filters (stretch) ----
  router.get('/api/settings/filters', async (ctx) => {
    const user = ctx.requireAuth();
    const rows = db.prepare('SELECT id, match_json, action_json FROM filters WHERE user_id = ? ORDER BY created_at').all(user.id);
    const filters = rows.map(r => ({
      id: r.id,
      match: util.json.parse(r.match_json, r.match_json),
      action: util.json.parse(r.action_json, r.action_json),
    }));
    ctx.json(200, { filters });
  });

  router.post('/api/settings/filters', async (ctx) => {
    const user = ctx.requireAuth();
    const { match, action } = ctx.body || {};
    if (!match || !action) throw { status: 400, message: 'match and action are required' };
    const fid = util.id();
    db.prepare('INSERT INTO filters (id, user_id, match_json, action_json, created_at) VALUES (?,?,?,?,?)')
      .run(fid, user.id, util.json.stringify(match), util.json.stringify(action), util.now());
    ctx.json(201, { id: fid, match, action });
  });

  router.del('/api/settings/filters/:id', async (ctx) => {
    const user = ctx.requireAuth();
    db.prepare('DELETE FROM filters WHERE id = ? AND user_id = ?').run(ctx.params.id, user.id);
    ctx.json(200, { ok: true });
  });
}
