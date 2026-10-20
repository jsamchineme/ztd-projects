// Stalwart admin client: JMAP with the `urn:stalwart:jmap` admin objects (x:Domain, x:Account,
// x:MailingList). Transports chosen by STALWART_MODE:
//   http — direct HTTPS to STALWART_URL with STALWART_API_KEY (the panel VPS reaches the mail
//          server over a private tunnel; this is how production runs).
//   ssh  — run curl on the mail server over SSH (used during development from the Studio server).
//   fake — in-memory, for tests and offline development (default, or STALWART_MODE=fake).
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';

const env = process.env;
const sshKey = env.STALWART_SSH_KEY || `${homedir()}/.ssh/ztdoffice-vps-studio`;
const sshHost = env.STALWART_SSH || 'root@62.238.17.8';
const remoteKeyFile = env.STALWART_REMOTE_KEYFILE || '/opt/ztdmail/.admin-apikey';
const remoteUrl = env.STALWART_REMOTE_URL || 'http://127.0.0.1:8080';

export const mode: 'http' | 'ssh' | 'fake' =
  (env.STALWART_MODE as 'http' | 'ssh' | 'fake') || (env.STALWART_URL ? 'http' : 'fake');

const USING = ['urn:ietf:params:jmap:core', 'urn:stalwart:jmap'];
const SUSPENDED_AT = '2000-01-01T00:00:00Z';
const GB = 1024 ** 3;

export class MailError extends Error {
  status: number;
  constructor(message: string, status = 502) { super(message); this.status = status; }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;
type Call = [string, Json, string];

// ---------------------------------------------------------------- transports
function viaSsh(path: string, body: Json): Promise<Json> {
  const data = body == null ? '' : '--data-binary @- -H "Content-Type: application/json"';
  const cmd = `K=$(cat ${remoteKeyFile}); curl -sS -m 30 -H "Authorization: Bearer $K" ${data} ${remoteUrl}${path}`;
  const args = ['-i', sshKey, '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10',
    '-o', 'ControlMaster=auto', '-o', `ControlPath=${homedir()}/.ssh/cm-%C`, '-o', 'ControlPersist=300', sshHost, cmd];
  return new Promise((resolve, reject) => {
    const p = spawn('ssh', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => { p.kill(); reject(new MailError('Mail server timed out')); }, 45_000);
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    p.on('error', (e) => { clearTimeout(timer); reject(new MailError(e.message)); });
    p.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new MailError(`Mail server unreachable (${err.trim().split('\n').pop() || 'ssh exit ' + code})`));
      try { resolve(JSON.parse(out)); } catch { reject(new MailError('Unexpected reply from mail server')); }
    });
    p.stdin.end(body == null ? '' : JSON.stringify(body));
  });
}

async function viaHttp(path: string, body: Json): Promise<Json> {
  const res = await fetch(env.STALWART_URL!.replace(/\/$/, '') + path, {
    method: body == null ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${env.STALWART_API_KEY}`, 'Content-Type': 'application/json' },
    body: body == null ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new MailError(`Mail server error ${res.status}`);
  return res.json();
}

const transport = (path: string, body?: Json) =>
  mode === 'ssh' ? viaSsh(path, body ?? null) : viaHttp(path, body ?? null);

let accountIdPromise: Promise<string> | null = null;
function accountId(): Promise<string> {
  if (mode === 'fake') return Promise.resolve('b');
  accountIdPromise ??= transport('/jmap/session')
    .then((s: Json) => s.primaryAccounts?.['urn:stalwart:jmap'] || 'b')
    .catch((e: Error) => { accountIdPromise = null; throw e; });
  return accountIdPromise;
}

export async function jmap(calls: Call[]): Promise<Record<string, Json>> {
  const acct = await accountId();
  const methodCalls = calls.map(([name, args, cid]) => [name, { accountId: acct, ...args }, cid]);
  const req = { using: USING, methodCalls };
  const res = mode === 'fake' ? fake.handle(req) : await transport('/jmap/', req);
  if (!res?.methodResponses) throw new MailError(res?.detail || res?.title || 'Unexpected reply from mail server');
  const out: Record<string, Json> = {};
  for (const [name, args, cid] of res.methodResponses) {
    if (name === 'error') throw new MailError(`Mail server: ${args.description || args.type}`);
    out[cid] = args;
  }
  return out;
}

function checkSet(r: Json, what: string): Json {
  const bad = r.notCreated || r.notUpdated || r.notDestroyed;
  if (bad && Object.keys(bad).length) {
    const e = Object.values(bad)[0] as Json;
    const msg = e.description || e.type || 'rejected';
    throw new MailError(`${what}: ${msg}`, e.type === 'alreadyExists' || /exist/i.test(msg) ? 409 : 400);
  }
  return r;
}

// ---------------------------------------------------------------- snapshot (cached reads)
export interface Alias { name: string; domainId: string; enabled: boolean; address: string; }
export interface MailUser { id: string; type: 'User'; name: string; email: string; domainId: string; domain?: string; description: string; createdAt: string; admin: boolean; quota: number; used: number; suspended: boolean; credentialKeys: string[]; aliases: Alias[]; groupIds: string[]; }
export interface SharedInbox { id: string; type: 'Group'; name: string; email: string; domainId: string; domain?: string; description: string; createdAt: string; used: number; quota: number; aliases: Alias[]; }
export interface MailList { id: string; name: string; email: string; domainId: string; domain?: string; description: string; recipients: string[]; aliases: Alias[]; }
export interface MailDomain { id: string; name: string; createdAt: string; enabled: boolean; }
export interface Snapshot { domains: MailDomain[]; users: MailUser[]; sharedInboxes: SharedInbox[]; lists: MailList[]; }

let cache: { at: number; data: Snapshot } | null = null;
const CACHE_MS = 15_000;
export function invalidate() { cache = null; }

const isSuspended = (creds: Json) => Object.values(creds || {}).some((c: Json) => c['@type'] === 'Password' && c.expiresAt && Date.parse(c.expiresAt) <= Date.now());

export async function snapshot({ fresh = false } = {}): Promise<Snapshot> {
  if (!fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.data;
  const r = await jmap([
    ['x:Domain/get', { ids: null, properties: ['name', 'createdAt', 'isEnabled'] }, 'd'],
    ['x:Account/get', { ids: null }, 'a'],
    ['x:MailingList/get', { ids: null }, 'l'],
  ]);
  const domains: MailDomain[] = r.d.list.map((d: Json) => ({ id: d.id, name: d.name, createdAt: d.createdAt, enabled: d.isEnabled !== false }));
  const dn: Record<string, string> = Object.fromEntries(domains.map((d) => [d.id, d.name]));
  const aliasList = (a: Json): Alias[] => Object.values(a || {}).map((x: Json) => ({ name: x.name, domainId: x.domainId, enabled: x.enabled !== false, address: `${x.name}@${dn[x.domainId] || '?'}` }));
  const accounts = r.a.list.map((a: Json) => ({
    id: a.id, type: a['@type'], name: a.name, email: a.emailAddress, domainId: a.domainId, domain: dn[a.domainId],
    description: a.description || '', createdAt: a.createdAt, admin: a.roles?.['@type'] === 'Admin',
    quota: a.quotas?.maxDiskQuota || 0, used: a.usedDiskQuota || 0,
    suspended: isSuspended(a.credentials), credentialKeys: Object.keys(a.credentials || {}),
    aliases: aliasList(a.aliases), groupIds: Object.keys(a.memberGroupIds || {}),
  }));
  const lists: MailList[] = r.l.list.map((l: Json) => ({ id: l.id, name: l.name, email: l.emailAddress, domainId: l.domainId, domain: dn[l.domainId], description: l.description || '', recipients: Object.keys(l.recipients || {}), aliases: aliasList(l.aliases) }));
  const data: Snapshot = {
    domains,
    users: accounts.filter((a: Json) => a.type === 'User'),
    sharedInboxes: accounts.filter((a: Json) => a.type === 'Group'),
    lists,
  };
  cache = { at: Date.now(), data };
  return data;
}

// ---------------------------------------------------------------- writes
export async function createDomain(name: string): Promise<string> {
  const r = await jmap([['x:Domain/set', { create: { n: {
    name, aliases: {}, certificateManagement: { '@type': 'Manual' }, dkimManagement: { '@type': 'Automatic' },
    dnsManagement: { '@type': 'Manual' }, subAddressing: { '@type': 'Enabled' },
  } } }, 's']]);
  checkSet(r.s, `Adding ${name}`);
  invalidate();
  return r.s.created.n.id;
}

export async function domainZone(domainId: string): Promise<string> {
  const r = await jmap([['x:Domain/get', { ids: [domainId], properties: ['name', 'dnsZoneFile'] }, 'z']]);
  return r.z.list[0]?.dnsZoneFile || '';
}

export async function createUser({ domainId, local, name, quotaGb, password }: { domainId: string; local: string; name: string; quotaGb: number; password: string; }): Promise<string> {
  const r = await jmap([['x:Account/set', { create: { n: {
    '@type': 'User', name: local, domainId, description: name || null,
    roles: { '@type': 'User' }, permissions: { '@type': 'Inherit' }, encryptionAtRest: { '@type': 'Disabled' },
    quotas: { maxDiskQuota: Math.round(quotaGb * GB) }, aliases: {}, credentials: { 0: { '@type': 'Password', secret: password } },
  } } }, 's']]);
  checkSet(r.s, `Creating ${local}@`);
  invalidate();
  return r.s.created.n.id;
}

async function updateAccount(id: string, patch: Json, what: string) {
  const r = await jmap([['x:Account/set', { update: { [id]: patch } }, 's']]);
  checkSet(r.s, what);
  invalidate();
}

export const updateUser = (id: string, { name, quotaGb }: { name?: string; quotaGb?: number }) => updateAccount(id, {
  ...(name !== undefined ? { description: name || null } : {}),
  ...(quotaGb !== undefined ? { 'quotas/maxDiskQuota': Math.round(quotaGb * GB) } : {}),
}, 'Updating inbox');

async function passwordKeys(id: string): Promise<string[]> {
  const u = (await snapshot({ fresh: true })).users.find((x) => x.id === id);
  if (!u) throw new MailError('Inbox not found on the mail server', 404);
  return u.credentialKeys.length ? u.credentialKeys : ['0'];
}

export async function setPassword(id: string, password: string) {
  const keys = await passwordKeys(id);
  await updateAccount(id, { [`credentials/${keys[0]}/secret`]: password, [`credentials/${keys[0]}/expiresAt`]: null }, 'Resetting password');
}

export async function setSuspended(id: string, suspended: boolean) {
  const keys = await passwordKeys(id);
  const patch = Object.fromEntries(keys.map((k) => [`credentials/${k}/expiresAt`, suspended ? SUSPENDED_AT : null]));
  await updateAccount(id, patch, suspended ? 'Suspending inbox' : 'Resuming inbox');
}

export const setAliases = (id: string, aliases: { name: string; domainId: string; enabled?: boolean }[]) => updateAccount(id, {
  aliases: Object.fromEntries(aliases.map((a, i) => [i, { name: a.name, domainId: a.domainId, enabled: a.enabled !== false }])),
}, 'Saving aliases');

export async function destroyUser(id: string) {
  const r = await jmap([['x:Account/set', { destroy: [id] }, 's']]);
  checkSet(r.s, 'Deleting inbox');
  invalidate();
}

export async function createList({ domainId, local, description, recipients }: { domainId: string; local: string; description?: string; recipients: string[]; }): Promise<string> {
  const r = await jmap([['x:MailingList/set', { create: { n: {
    name: local, domainId, description: description || null, aliases: {}, recipients: Object.fromEntries(recipients.map((a) => [a, true])),
  } } }, 's']]);
  checkSet(r.s, `Creating ${local}@`);
  invalidate();
  return r.s.created.n.id;
}

export async function updateList(id: string, { recipients, description }: { recipients?: string[]; description?: string; }) {
  const patch: Json = {};
  if (recipients) patch.recipients = Object.fromEntries(recipients.map((a) => [a, true]));
  if (description !== undefined) patch.description = description || null;
  const r = await jmap([['x:MailingList/set', { update: { [id]: patch } }, 's']]);
  checkSet(r.s, 'Updating group');
  invalidate();
}

export async function destroyList(id: string) {
  const r = await jmap([['x:MailingList/set', { destroy: [id] }, 's']]);
  checkSet(r.s, 'Deleting group');
  invalidate();
}

// ---------------------------------------------------------------- fake (in-memory) server
const fake = (() => {
  let seq = 100;
  const nextId = () => (seq++).toString(36);
  const store = { 'x:Domain': new Map<string, Json>(), 'x:Account': new Map<string, Json>(), 'x:MailingList': new Map<string, Json>() };
  type StoreKey = keyof typeof store;
  const tableOf = (type: string): Map<string, Json> | undefined => (type in store ? store[type as StoreKey] : undefined);
  const now = () => new Date().toISOString();
  store['x:Domain'].set('b', { id: 'b', name: 'ztdoffice.com', createdAt: now(), isEnabled: true, dnsZoneFile:
    'ztdoffice.com. IN MX 10 mx1.ztdoffice.com.\nv1-rsa-20261019._domainkey.ztdoffice.com. IN TXT "v=DKIM1; k=rsa; h=sha256; p=FAKE"\n' });
  store['x:Account'].set('a', { id: 'a', '@type': 'User', name: 'admin', domainId: 'b', roles: { '@type': 'Admin' }, credentials: { 0: { '@type': 'Password', secret: 'x' } } });

  const setPath = (obj: Json, path: string, val: Json) => {
    const parts = path.split('/');
    let o = obj;
    for (const p of parts.slice(0, -1)) o = o[p] ??= {};
    o[parts[parts.length - 1]!] = val;
  };
  const decorate = (type: string, o: Json): Json => {
    if (type === 'x:Domain') return { ...o, dnsZoneFile: o.dnsZoneFile || `${o.name}. IN MX 10 mx1.ztdoffice.com.\nv1-rsa-20261020._domainkey.${o.name}. IN TXT "v=DKIM1; k=rsa; h=sha256; p=FAKE"\n` };
    const d = store['x:Domain'].get(o.domainId);
    const masked = o.credentials ? Object.fromEntries(Object.entries(o.credentials).map(([k, c]: [string, Json]) => [k, { ...c, secret: '****' }])) : undefined;
    return { ...o, ...(masked ? { credentials: masked } : {}), emailAddress: `${o.name}@${d?.name}`, usedDiskQuota: o.usedDiskQuota || 0 };
  };

  function handle(req: Json): Json {
    const methodResponses: Json[] = [];
    for (const [name, args, cid] of req.methodCalls) {
      const [type, op] = name.split('/');
      const tbl = tableOf(type);
      if (!tbl) { methodResponses.push(['error', { type: 'unknownMethod' }, cid]); continue; }
      if (op === 'get') {
        const ids = args.ids || [...tbl.keys()];
        methodResponses.push([name, { list: ids.filter((i: string) => tbl.has(i)).map((i: string) => decorate(type, tbl.get(i))), notFound: ids.filter((i: string) => !tbl.has(i)) }, cid]);
      } else if (op === 'set') {
        const out: Json = {};
        for (const [k, o] of Object.entries(args.create || {}) as [string, Json][]) {
          const key = type === 'x:Domain' ? o.name : `${o.name}@${o.domainId}`;
          const other = type === 'x:Account' ? 'x:MailingList' : 'x:Account';
          const clash = [...tbl.values()].some((x) => (type === 'x:Domain' ? x.name : `${x.name}@${x.domainId}`) === key)
            || (type !== 'x:Domain' && [...(store[other as StoreKey]?.values() ?? [])].some((x) => `${x.name}@${x.domainId}` === key));
          if (clash) { (out.notCreated ??= {})[k] = { type: 'alreadyExists', description: 'Address already in use' }; continue; }
          const id = nextId();
          tbl.set(id, { ...structuredClone(o), id, createdAt: now() });
          (out.created ??= {})[k] = { id };
        }
        for (const [id, patch] of Object.entries(args.update || {}) as [string, Json][]) {
          const o = tbl.get(id);
          if (!o) { (out.notUpdated ??= {})[id] = { type: 'notFound' }; continue; }
          for (const [p, v] of Object.entries(patch)) p.includes('/') ? setPath(o, p, v) : (o[p] = structuredClone(v));
          (out.updated ??= {})[id] = null;
        }
        for (const id of (args.destroy || []) as string[]) {
          if (tbl.delete(id)) (out.destroyed ??= []).push(id);
          else (out.notDestroyed ??= {})[id] = { type: 'notFound' };
        }
        methodResponses.push([name, out, cid]);
      }
    }
    return { methodResponses };
  }
  return { handle, store };
})();

// Test hook: set fake storage use for an account (bytes).
export function _fakeSetUsed(id: string, bytes: number) { const a = fake.store['x:Account']!.get(id); if (a) a.usedDiskQuota = bytes; invalidate(); }
export function _fakeReset() { fake.store['x:MailingList'].clear(); invalidate(); }
