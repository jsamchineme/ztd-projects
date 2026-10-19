// Identity data access: orgs, users, sessions, domains, aliases, settings, audit.
import { db } from './db.mjs';
import { id, now, token, json } from './util.mjs';
import { config } from './config.mjs';

const q = (sql) => db.prepare(sql);

// ---- orgs ----
export function getOrgCount() { return q('SELECT COUNT(*) c FROM orgs').get().c; }
export function getUserCount() { return q('SELECT COUNT(*) c FROM users').get().c; }
export function createOrg(name) {
  const oid = id();
  q('INSERT INTO orgs (id,name,created_at) VALUES (?,?,?)').run(oid, name, now());
  return oid;
}
export function firstOrgId() { const r = q('SELECT id FROM orgs ORDER BY created_at LIMIT 1').get(); return r?.id || null; }

// ---- users ----
export function getUserByEmail(email) {
  return q('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase()) || null;
}
export function getUserById(id) { return q('SELECT * FROM users WHERE id = ?').get(id) || null; }
export function listUsers(orgId) { return q('SELECT * FROM users WHERE org_id = ? ORDER BY created_at').all(orgId); }
export function createUser({ orgId, email, name, passwordHash, role = 'member' }) {
  const uid = id();
  q(`INSERT INTO users (id,org_id,email,name,password_hash,role,status,signature,created_at)
     VALUES (?,?,?,?,?,?,'active','',?)`)
    .run(uid, orgId, String(email).toLowerCase(), name, passwordHash, role, now());
  return uid;
}
export function setUserStatus(id, status) { q('UPDATE users SET status=? WHERE id=?').run(status, id); }
export function setUserPassword(id, hash) { q('UPDATE users SET password_hash=? WHERE id=?').run(hash, id); }
export function setUserTotp(id, secret) { q('UPDATE users SET totp_secret=? WHERE id=?').run(secret, id); }
export function updateUser(id, fields) {
  const allowed = ['name', 'role', 'status', 'signature'];
  const sets = [], vals = [];
  for (const k of allowed) if (k in fields) { sets.push(`${k}=?`); vals.push(fields[k]); }
  if (!sets.length) return;
  vals.push(id);
  q(`UPDATE users SET ${sets.join(',')} WHERE id=?`).run(...vals);
}

// Resolve an inbound address to a local user (direct email or alias). Returns user row or null.
export function findUserForAddress(address) {
  const a = String(address || '').toLowerCase().trim();
  if (!a) return null;
  const u = q('SELECT * FROM users WHERE email = ?').get(a);
  if (u) return u;
  const al = q('SELECT user_id FROM aliases WHERE address = ?').get(a);
  if (al) return getUserById(al.user_id);
  return null;
}

// ---- sessions ----
export function createSession(userId, userAgent = '', ttlDays = config.sessionTtlDays) {
  const sid = token(32);
  const created = new Date();
  const expires = new Date(created.getTime() + ttlDays * 86400_000);
  q('INSERT INTO sessions (id,user_id,created_at,expires_at,user_agent) VALUES (?,?,?,?,?)')
    .run(sid, userId, created.toISOString(), expires.toISOString(), userAgent);
  return sid;
}
export function getSession(sid) {
  if (!sid) return null;
  const s = q('SELECT * FROM sessions WHERE id = ?').get(sid);
  if (!s) return null;
  if (new Date(s.expires_at).getTime() < Date.now()) { deleteSession(sid); return null; }
  const user = getUserById(s.user_id);
  if (!user || user.status !== 'active') return null;
  return { session: s, user };
}
export function deleteSession(sid) { q('DELETE FROM sessions WHERE id = ?').run(sid); }
export function purgeExpired() { q('DELETE FROM sessions WHERE expires_at < ?').run(now()); }

// ---- domains ----
export function listDomains(orgId) { return q('SELECT * FROM domains WHERE org_id = ? ORDER BY created_at').all(orgId); }
export function getDomain(id) { return q('SELECT * FROM domains WHERE id = ?').get(id) || null; }
export function createDomain(orgId, { domain, resend_domain_id, records, status = 'pending', receiving = 1 }) {
  const did = id();
  q(`INSERT INTO domains (id,org_id,domain,resend_domain_id,status,records_json,receiving,created_at)
     VALUES (?,?,?,?,?,?,?,?)`)
    .run(did, orgId, String(domain).toLowerCase(), resend_domain_id || null, status, json.stringify(records || []), receiving ? 1 : 0, now());
  return did;
}
export function updateDomain(id, fields) {
  const map = { status: 'status', resend_domain_id: 'resend_domain_id', receiving: 'receiving' };
  const sets = [], vals = [];
  for (const k in map) if (k in fields) { sets.push(`${map[k]}=?`); vals.push(fields[k]); }
  if ('records' in fields) { sets.push('records_json=?'); vals.push(json.stringify(fields.records)); }
  if (!sets.length) return;
  vals.push(id);
  q(`UPDATE domains SET ${sets.join(',')} WHERE id=?`).run(...vals);
}

// ---- aliases ----
export function listAliases(orgId) {
  return q(`SELECT a.* FROM aliases a JOIN users u ON u.id=a.user_id WHERE u.org_id=? ORDER BY a.created_at`).all(orgId);
}
export function createAlias(address, userId) {
  const aid = id();
  q('INSERT INTO aliases (id,address,user_id,created_at) VALUES (?,?,?,?)')
    .run(aid, String(address).toLowerCase(), userId, now());
  return aid;
}
export function deleteAlias(id) { q('DELETE FROM aliases WHERE id = ?').run(id); }

// ---- settings (per-user key/value) ----
export function getSettings(userId) {
  const rows = q('SELECT key,value FROM settings WHERE user_id=?').all(userId);
  const out = {};
  for (const r of rows) out[r.key] = json.parse(r.value, r.value);
  return out;
}
export function setSetting(userId, key, value) {
  q(`INSERT INTO settings (user_id,key,value) VALUES (?,?,?)
     ON CONFLICT(user_id,key) DO UPDATE SET value=excluded.value`)
    .run(userId, key, json.stringify(value));
}

// ---- audit ----
export function audit(actorId, action, detail = '') {
  q('INSERT INTO audit_log (id,actor_id,action,detail,created_at) VALUES (?,?,?,?,?)')
    .run(id(), actorId, action, typeof detail === 'string' ? detail : json.stringify(detail), now());
}

export const accounts = {
  getOrgCount, getUserCount, createOrg, firstOrgId,
  getUserByEmail, getUserById, listUsers, createUser, setUserStatus, setUserPassword, setUserTotp, updateUser,
  findUserForAddress,
  createSession, getSession, deleteSession, purgeExpired,
  listDomains, getDomain, createDomain, updateDomain,
  listAliases, createAlias, deleteAlias,
  getSettings, setSetting, audit,
};
