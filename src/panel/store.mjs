// Control panel data: clients (with plan and price), their domains, panel logins, sessions,
// invite links, upgrade requests, activity and cached DNS checks. Mailboxes, aliases and groups
// themselves live on the mail server (src/stalwart.mjs); this only holds the commercial side.
import { createHash } from 'node:crypto';
import { db } from '../db.mjs';
import { id, now, token } from '../util.mjs';

db.exec(`
CREATE TABLE IF NOT EXISTS panel_clients (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, contact_name TEXT NOT NULL DEFAULT '', contact_email TEXT NOT NULL DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'lite', custom_price INTEGER, extra_inboxes INTEGER NOT NULL DEFAULT 0,
  extra_aliases INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active', suspended_ids TEXT,
  internal INTEGER NOT NULL DEFAULT 0, notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS panel_client_domains (
  domain TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES panel_clients(id) ON DELETE CASCADE, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS panel_users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role TEXT NOT NULL,
  client_id TEXT REFERENCES panel_clients(id) ON DELETE CASCADE, password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS panel_sessions (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES panel_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL, user_agent TEXT
);
CREATE TABLE IF NOT EXISTS panel_invites (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES panel_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL, used_at TEXT
);
CREATE TABLE IF NOT EXISTS panel_requests (
  id TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES panel_clients(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, detail TEXT NOT NULL, created_by TEXT, created_at TEXT NOT NULL, resolved_at TEXT
);
CREATE TABLE IF NOT EXISTS panel_activity (
  id TEXT PRIMARY KEY, client_id TEXT, actor TEXT NOT NULL, action TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS panel_activity_at ON panel_activity(created_at);
CREATE TABLE IF NOT EXISTS panel_dns (
  domain TEXT PRIMARY KEY, checked_at TEXT NOT NULL, results TEXT NOT NULL
);
`);

const sha = s => createHash('sha256').update(s).digest('hex');
const DAY = 86400_000;

// ---------------------------------------------------------------- clients
export const clients = {
  list: () => db.prepare('SELECT * FROM panel_clients ORDER BY internal, created_at').all(),
  get: cid => db.prepare('SELECT * FROM panel_clients WHERE id = ?').get(cid),
  create({ name, contactName = '', contactEmail = '', plan = 'lite', customPrice = null, internal = 0 }) {
    const cid = id();
    db.prepare(`INSERT INTO panel_clients (id, name, contact_name, contact_email, plan, custom_price, internal, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(cid, name, contactName, contactEmail, plan, customPrice, internal ? 1 : 0, now());
    return clients.get(cid);
  },
  update(cid, fields) {
    const cols = ['name', 'contact_name', 'contact_email', 'plan', 'custom_price', 'extra_inboxes', 'extra_aliases', 'status', 'suspended_ids', 'notes'];
    const sets = Object.keys(fields).filter(k => cols.includes(k));
    if (!sets.length) return clients.get(cid);
    db.prepare(`UPDATE panel_clients SET ${sets.map(k => `${k} = ?`).join(', ')} WHERE id = ?`).run(...sets.map(k => fields[k]), cid);
    return clients.get(cid);
  },
  domains: cid => db.prepare('SELECT domain FROM panel_client_domains WHERE client_id = ? ORDER BY created_at').all(cid).map(r => r.domain),
  allDomains: () => Object.fromEntries(db.prepare('SELECT domain, client_id FROM panel_client_domains').all().map(r => [r.domain, r.client_id])),
  addDomain(cid, domain) { db.prepare('INSERT INTO panel_client_domains (domain, client_id, created_at) VALUES (?, ?, ?)').run(domain, cid, now()); },
};

// ---------------------------------------------------------------- panel logins
export const users = {
  get: uid => db.prepare('SELECT * FROM panel_users WHERE id = ?').get(uid),
  byEmail: email => db.prepare('SELECT * FROM panel_users WHERE email = ?').get(String(email).toLowerCase()),
  staff: () => db.prepare("SELECT * FROM panel_users WHERE role = 'staff' ORDER BY created_at").all(),
  forClient: cid => db.prepare('SELECT * FROM panel_users WHERE client_id = ? ORDER BY created_at').all(cid),
  create({ email, name, role, clientId = null }) {
    const uid = id();
    db.prepare('INSERT INTO panel_users (id, email, name, role, client_id, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(uid, String(email).toLowerCase(), name, role, clientId, now());
    return users.get(uid);
  },
  setPassword: (uid, hash) => db.prepare('UPDATE panel_users SET password_hash = ? WHERE id = ?').run(hash, uid),
  touchLogin: uid => db.prepare('UPDATE panel_users SET last_login_at = ? WHERE id = ?').run(now(), uid),
};

export const sessions = {
  create(uid, userAgent = '', days = 14) {
    const t = token();
    db.prepare('INSERT INTO panel_sessions (token_hash, user_id, created_at, expires_at, user_agent) VALUES (?, ?, ?, ?, ?)')
      .run(sha(t), uid, now(), new Date(Date.now() + days * DAY).toISOString(), String(userAgent).slice(0, 200));
    return t;
  },
  lookup(t) {
    if (!t) return null;
    const s = db.prepare('SELECT * FROM panel_sessions WHERE token_hash = ?').get(sha(t));
    if (!s || s.expires_at < now()) return null;
    const u = users.get(s.user_id);
    return u && u.status === 'active' ? u : null;
  },
  destroy: t => t && db.prepare('DELETE FROM panel_sessions WHERE token_hash = ?').run(sha(t)),
  destroyForUser: uid => db.prepare('DELETE FROM panel_sessions WHERE user_id = ?').run(uid),
};

export const invites = {
  create(uid, days = 7) {
    const t = token();
    db.prepare('INSERT INTO panel_invites (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
      .run(sha(t), uid, now(), new Date(Date.now() + days * DAY).toISOString());
    return t;
  },
  lookup(t) {
    const i = t && db.prepare('SELECT * FROM panel_invites WHERE token_hash = ?').get(sha(t));
    if (!i || i.used_at || i.expires_at < now()) return null;
    return { ...i, user: users.get(i.user_id) };
  },
  use: t => db.prepare('UPDATE panel_invites SET used_at = ? WHERE token_hash = ?').run(now(), sha(t)),
};

// ---------------------------------------------------------------- requests, activity, dns cache
export const requests = {
  open: (cid = null) => cid
    ? db.prepare('SELECT * FROM panel_requests WHERE client_id = ? AND resolved_at IS NULL ORDER BY created_at DESC').all(cid)
    : db.prepare('SELECT * FROM panel_requests WHERE resolved_at IS NULL ORDER BY created_at DESC').all(),
  get: rid => db.prepare('SELECT * FROM panel_requests WHERE id = ?').get(rid),
  create({ clientId, kind, detail, createdBy }) {
    const rid = id();
    db.prepare('INSERT INTO panel_requests (id, client_id, kind, detail, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(rid, clientId, kind, detail, createdBy, now());
    return rid;
  },
  resolve: rid => db.prepare('UPDATE panel_requests SET resolved_at = ? WHERE id = ?').run(now(), rid),
};

export const activity = {
  log(clientId, actor, action, detail = '') {
    db.prepare('INSERT INTO panel_activity (id, client_id, actor, action, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id(), clientId, actor, action, detail, now());
  },
  list: ({ clientId = null, limit = 100 } = {}) => clientId
    ? db.prepare('SELECT * FROM panel_activity WHERE client_id = ? ORDER BY created_at DESC LIMIT ?').all(clientId, limit)
    : db.prepare('SELECT * FROM panel_activity ORDER BY created_at DESC LIMIT ?').all(limit),
};

export const dnsCache = {
  get(domain) {
    const r = db.prepare('SELECT * FROM panel_dns WHERE domain = ?').get(domain);
    return r ? { checkedAt: r.checked_at, ...JSON.parse(r.results) } : null;
  },
  set(domain, results) {
    db.prepare('INSERT OR REPLACE INTO panel_dns (domain, checked_at, results) VALUES (?, ?, ?)').run(domain, now(), JSON.stringify(results));
  },
};
