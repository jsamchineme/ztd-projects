// Data access for the control panel's commercial side (Drizzle over Postgres/PGlite).
import { eq, and, isNull, desc, inArray } from 'drizzle-orm';
import { getDb, schema } from './db';
import { id, token, sha256 } from './auth';
import type { PlanId } from './plans';

const DAY = 86400_000;
const s = schema;

export type Client = schema.ClientRow;
export type User = schema.UserRow;

// ---------------------------------------------------------------- clients
export const clients = {
  async list(): Promise<Client[]> {
    const db = await getDb();
    return db.select().from(s.clients).orderBy(s.clients.internal, s.clients.createdAt);
  },
  async get(cid: string): Promise<Client | undefined> {
    const db = await getDb();
    return (await db.select().from(s.clients).where(eq(s.clients.id, cid)).limit(1))[0];
  },
  async create(v: { name: string; contactName?: string; contactEmail?: string; plan?: PlanId; customPrice?: number | null; internal?: boolean }): Promise<Client> {
    const db = await getDb();
    const cid = id();
    await db.insert(s.clients).values({
      id: cid, name: v.name, contactName: v.contactName ?? '', contactEmail: v.contactEmail ?? '',
      plan: v.plan ?? 'lite', customPrice: v.customPrice ?? null, internal: v.internal ?? false,
    });
    return (await clients.get(cid))!;
  },
  async update(cid: string, fields: Partial<{ name: string; contactName: string; contactEmail: string; plan: string; customPrice: number | null; extraInboxes: number; extraAliases: number; status: string; suspendedIds: string[] | null; notes: string }>): Promise<Client> {
    const db = await getDb();
    if (Object.keys(fields).length) await db.update(s.clients).set(fields).where(eq(s.clients.id, cid));
    return (await clients.get(cid))!;
  },
  async domains(cid: string): Promise<string[]> {
    const db = await getDb();
    const rows = await db.select({ domain: s.clientDomains.domain }).from(s.clientDomains).where(eq(s.clientDomains.clientId, cid)).orderBy(s.clientDomains.createdAt);
    return rows.map((r) => r.domain);
  },
  async allDomains(): Promise<Record<string, string>> {
    const db = await getDb();
    const rows = await db.select().from(s.clientDomains);
    return Object.fromEntries(rows.map((r) => [r.domain, r.clientId]));
  },
  async addDomain(cid: string, domain: string) {
    const db = await getDb();
    await db.insert(s.clientDomains).values({ domain, clientId: cid });
  },
};

// ---------------------------------------------------------------- panel logins
export const users = {
  async get(uid: string): Promise<User | undefined> {
    const db = await getDb();
    return (await db.select().from(s.users).where(eq(s.users.id, uid)).limit(1))[0];
  },
  async byEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    return (await db.select().from(s.users).where(eq(s.users.email, email.toLowerCase())).limit(1))[0];
  },
  async staff(): Promise<User[]> {
    const db = await getDb();
    return db.select().from(s.users).where(eq(s.users.role, 'staff')).orderBy(s.users.createdAt);
  },
  async forClient(cid: string): Promise<User[]> {
    const db = await getDb();
    return db.select().from(s.users).where(eq(s.users.clientId, cid)).orderBy(s.users.createdAt);
  },
  async create(v: { email: string; name: string; role: 'staff' | 'client'; clientId?: string | null }): Promise<User> {
    const db = await getDb();
    const uid = id();
    await db.insert(s.users).values({ id: uid, email: v.email.toLowerCase(), name: v.name, role: v.role, clientId: v.clientId ?? null });
    return (await users.get(uid))!;
  },
  async setPassword(uid: string, hash: string) {
    const db = await getDb();
    await db.update(s.users).set({ passwordHash: hash }).where(eq(s.users.id, uid));
  },
  async touchLogin(uid: string) {
    const db = await getDb();
    await db.update(s.users).set({ lastLoginAt: new Date() }).where(eq(s.users.id, uid));
  },
};

export const sessions = {
  async create(uid: string, userAgent = '', days = 14): Promise<string> {
    const db = await getDb();
    const t = token();
    await db.insert(s.sessions).values({ tokenHash: sha256(t), userId: uid, expiresAt: new Date(Date.now() + days * DAY), userAgent: userAgent.slice(0, 200) });
    return t;
  },
  async lookup(t: string | undefined): Promise<User | null> {
    if (!t) return null;
    const db = await getDb();
    const sess = (await db.select().from(s.sessions).where(eq(s.sessions.tokenHash, sha256(t))).limit(1))[0];
    if (!sess || sess.expiresAt.getTime() < Date.now()) return null;
    const u = await users.get(sess.userId);
    return u && u.status === 'active' ? u : null;
  },
  async destroy(t: string | undefined) {
    if (!t) return;
    const db = await getDb();
    await db.delete(s.sessions).where(eq(s.sessions.tokenHash, sha256(t)));
  },
  async destroyForUser(uid: string) {
    const db = await getDb();
    await db.delete(s.sessions).where(eq(s.sessions.userId, uid));
  },
};

export const invites = {
  async create(uid: string, days = 7): Promise<string> {
    const db = await getDb();
    const t = token();
    await db.insert(s.invites).values({ tokenHash: sha256(t), userId: uid, expiresAt: new Date(Date.now() + days * DAY) });
    return t;
  },
  async lookup(t: string): Promise<{ userId: string; user: User | undefined } | null> {
    const db = await getDb();
    const i = (await db.select().from(s.invites).where(eq(s.invites.tokenHash, sha256(t))).limit(1))[0];
    if (!i || i.usedAt || i.expiresAt.getTime() < Date.now()) return null;
    return { userId: i.userId, user: await users.get(i.userId) };
  },
  async use(t: string) {
    const db = await getDb();
    await db.update(s.invites).set({ usedAt: new Date() }).where(eq(s.invites.tokenHash, sha256(t)));
  },
};

export const requests = {
  async open(cid?: string) {
    const db = await getDb();
    const where = cid ? and(eq(s.requests.clientId, cid), isNull(s.requests.resolvedAt)) : isNull(s.requests.resolvedAt);
    return db.select().from(s.requests).where(where).orderBy(desc(s.requests.createdAt));
  },
  async get(rid: string) {
    const db = await getDb();
    return (await db.select().from(s.requests).where(eq(s.requests.id, rid)).limit(1))[0];
  },
  async create(v: { clientId: string; kind: string; detail: string; createdBy?: string }): Promise<string> {
    const db = await getDb();
    const rid = id();
    await db.insert(s.requests).values({ id: rid, clientId: v.clientId, kind: v.kind, detail: v.detail, createdBy: v.createdBy ?? null });
    return rid;
  },
  async resolve(rid: string) {
    const db = await getDb();
    await db.update(s.requests).set({ resolvedAt: new Date() }).where(eq(s.requests.id, rid));
  },
};

export const activity = {
  async log(clientId: string | null, actor: string, action: string, detail = '') {
    const db = await getDb();
    await db.insert(s.activity).values({ id: id(), clientId, actor, action, detail });
  },
  async list({ clientId = null, limit = 100 }: { clientId?: string | null; limit?: number } = {}) {
    const db = await getDb();
    const q = db.select().from(s.activity);
    const rows = clientId
      ? await q.where(eq(s.activity.clientId, clientId)).orderBy(desc(s.activity.createdAt)).limit(limit)
      : await q.orderBy(desc(s.activity.createdAt)).limit(limit);
    return rows;
  },
};

export const dnsCache = {
  async get(domain: string): Promise<(Record<string, unknown> & { checkedAt: string }) | null> {
    const db = await getDb();
    const r = (await db.select().from(s.dnsChecks).where(eq(s.dnsChecks.domain, domain)).limit(1))[0];
    return r ? { checkedAt: r.checkedAt.toISOString(), ...(r.results as Record<string, unknown>) } : null;
  },
  async set(domain: string, results: unknown) {
    const db = await getDb();
    await db.insert(s.dnsChecks).values({ domain, checkedAt: new Date(), results }).onConflictDoUpdate({ target: s.dnsChecks.domain, set: { checkedAt: new Date(), results } });
  },
  async many(domains: string[]): Promise<Record<string, Record<string, unknown> & { checkedAt: string }>> {
    if (!domains.length) return {};
    const db = await getDb();
    const rows = await db.select().from(s.dnsChecks).where(inArray(s.dnsChecks.domain, domains));
    return Object.fromEntries(rows.map((r) => [r.domain, { checkedAt: r.checkedAt.toISOString(), ...(r.results as Record<string, unknown>) }]));
  },
};
