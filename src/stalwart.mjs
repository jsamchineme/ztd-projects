// Stalwart admin client: JMAP with the `urn:stalwart:jmap` admin objects (x:Domain, x:Account,
// x:MailingList). Three transports, picked by STALWART_MODE (or automatically):
//   ssh  — run curl on the mail server over SSH. The admin API key only works from the server
//          itself and never leaves it. Default when the SSH key file exists.
//   http — direct fetch to STALWART_URL with STALWART_API_KEY.
//   fake — in-memory, for tests and offline development (TEST_MODE=1 or nothing configured).
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

const env = process.env;
const sshKey = env.STALWART_SSH_KEY || `${homedir()}/.ssh/ztdoffice-vps-studio`;
const sshHost = env.STALWART_SSH || 'root@62.238.17.8';
const remoteKeyFile = env.STALWART_REMOTE_KEYFILE || '/opt/ztdmail/.admin-apikey';
const remoteUrl = env.STALWART_REMOTE_URL || 'http://127.0.0.1:8080';

export const mode = env.STALWART_MODE
  || (env.TEST_MODE === '1' ? 'fake' : env.STALWART_URL ? 'http' : existsSync(sshKey) ? 'ssh' : 'fake');

const USING = ['urn:ietf:params:jmap:core', 'urn:stalwart:jmap'];
const SUSPENDED_AT = '2000-01-01T00:00:00Z'; // a password that "expired" in 2000 can't sign in
const GB = 1024 ** 3;

// ---------------------------------------------------------------- transports
function viaSsh(path, body) {
  const data = body == null ? '' : '--data-binary @- -H "Content-Type: application/json"';
  const cmd = `K=$(cat ${remoteKeyFile}); curl -sS -m 30 -H "Authorization: Bearer $K" ${data} ${remoteUrl}${path}`;
  const args = ['-i', sshKey, '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10',
    '-o', 'ControlMaster=auto', '-o', `ControlPath=${homedir()}/.ssh/cm-%C`, '-o', 'ControlPersist=300',
    sshHost, cmd];
  return new Promise((resolve, reject) => {
    const p = spawn('ssh', args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => { p.kill(); reject(new Error('Mail server timed out')); }, 45_000);
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('error', e => { clearTimeout(timer); reject(e); });
    p.on('close', code => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`Mail server unreachable (${err.trim().split('\n').pop() || 'ssh exit ' + code})`));
      try { resolve(JSON.parse(out)); } catch { reject(new Error('Unexpected reply from mail server')); }
    });
    p.stdin.end(body == null ? '' : JSON.stringify(body));
  });
}

async function viaHttp(path, body) {
  const res = await fetch(env.STALWART_URL.replace(/\/$/, '') + path, {
    method: body == null ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${env.STALWART_API_KEY}`, 'Content-Type': 'application/json' },
    body: body == null ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Mail server error ${res.status}`);
  return res.json();
}

let accountIdPromise = null;
function accountId() {
  if (mode === 'fake') return Promise.resolve('b');
  accountIdPromise ||= (mode === 'ssh' ? viaSsh('/jmap/session') : viaHttp('/jmap/session'))
    .then(s => s.primaryAccounts?.['urn:stalwart:jmap'] || 'b')
    .catch(e => { accountIdPromise = null; throw e; });
  return accountIdPromise;
}

// Run JMAP method calls; returns the method responses keyed by call id. Throws on method errors.
export async function jmap(calls) {
  const acct = await accountId();
  const methodCalls = calls.map(([name, args, cid]) => [name, { accountId: acct, ...args }, cid]);
  const req = { using: USING, methodCalls };
  const res = mode === 'fake' ? fake.handle(req) : mode === 'ssh' ? await viaSsh('/jmap/', req) : await viaHttp('/jmap/', req);
  if (!res?.methodResponses) throw new Error(res?.detail || res?.title || 'Unexpected reply from mail server');
  const out = {};
  for (const [name, args, cid] of res.methodResponses) {
    if (name === 'error') throw { status: 502, message: `Mail server: ${args.description || args.type}` };
    out[cid] = args;
  }
  return out;
}

// Turn a /set response into created ids, or throw a readable error.
function checkSet(r, what) {
  const bad = r.notCreated || r.notUpdated || r.notDestroyed;
  if (bad && Object.keys(bad).length) {
    const e = Object.values(bad)[0];
    const msg = e.description || e.type || 'rejected';
    throw { status: e.type === 'alreadyExists' || /exist/i.test(msg) ? 409 : 400, message: `${what}: ${msg}` };
  }
  return r;
}

// ---------------------------------------------------------------- snapshot (cached reads)
let cache = null;
const CACHE_MS = 15_000;
export function invalidate() { cache = null; }

const isSuspended = creds => Object.values(creds || {})
  .some(c => c['@type'] === 'Password' && c.expiresAt && Date.parse(c.expiresAt) <= Date.now());

export async function snapshot({ fresh = false } = {}) {
  if (!fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.data;
  const r = await jmap([
    ['x:Domain/get', { ids: null, properties: ['name', 'createdAt', 'isEnabled'] }, 'd'],
    ['x:Account/get', { ids: null }, 'a'],
    ['x:MailingList/get', { ids: null }, 'l'],
  ]);
  const domains = r.d.list.map(d => ({ id: d.id, name: d.name, createdAt: d.createdAt, enabled: d.isEnabled !== false }));
  const dn = Object.fromEntries(domains.map(d => [d.id, d.name]));
  const aliasList = a => Object.values(a || {}).map(x => ({ name: x.name, domainId: x.domainId, enabled: x.enabled !== false, address: `${x.name}@${dn[x.domainId] || '?'}` }));
  const accounts = r.a.list.map(a => ({
    id: a.id, type: a['@type'], name: a.name, email: a.emailAddress, domainId: a.domainId, domain: dn[a.domainId],
    description: a.description || '', createdAt: a.createdAt, admin: a.roles?.['@type'] === 'Admin',
    quota: a.quotas?.maxDiskQuota || 0, used: a.usedDiskQuota || 0,
    suspended: isSuspended(a.credentials), credentialKeys: Object.keys(a.credentials || {}),
    aliases: aliasList(a.aliases), groupIds: Object.keys(a.memberGroupIds || {}),
  }));
  const lists = r.l.list.map(l => ({
    id: l.id, name: l.name, email: l.emailAddress, domainId: l.domainId, domain: dn[l.domainId],
    description: l.description || '', recipients: Object.keys(l.recipients || {}), aliases: aliasList(l.aliases),
  }));
  const data = {
    domains,
    users: accounts.filter(a => a.type === 'User'),
    sharedInboxes: accounts.filter(a => a.type === 'Group'),
    lists,
  };
  cache = { at: Date.now(), data };
  return data;
}

// ---------------------------------------------------------------- writes
export async function createDomain(name) {
  const r = await jmap([['x:Domain/set', { create: { n: {
    name, aliases: {},
    // Client domains use mx1.ztdoffice.com for every service, so no certificate is requested for them.
    certificateManagement: { '@type': 'Manual' },
    dkimManagement: { '@type': 'Automatic' },
    dnsManagement: { '@type': 'Manual' },
    subAddressing: { '@type': 'Enabled' },
  } } }, 's']]);
  checkSet(r.s, `Adding ${name}`);
  invalidate();
  return r.s.created.n.id;
}

export async function domainZone(domainId) {
  const r = await jmap([['x:Domain/get', { ids: [domainId], properties: ['name', 'dnsZoneFile'] }, 'z']]);
  return r.z.list[0]?.dnsZoneFile || '';
}

export async function createUser({ domainId, local, name, quotaGb, password }) {
  const r = await jmap([['x:Account/set', { create: { n: {
    '@type': 'User', name: local, domainId, description: name || null,
    roles: { '@type': 'User' }, permissions: { '@type': 'Inherit' }, encryptionAtRest: { '@type': 'Disabled' },
    quotas: { maxDiskQuota: Math.round(quotaGb * GB) }, aliases: {},
    credentials: { 0: { '@type': 'Password', secret: password } },
  } } }, 's']]);
  checkSet(r.s, `Creating ${local}@`);
  invalidate();
  return r.s.created.n.id;
}

async function updateAccount(id, patch, what) {
  const r = await jmap([['x:Account/set', { update: { [id]: patch } }, 's']]);
  checkSet(r.s, what);
  invalidate();
}

export const updateUser = (id, { name, quotaGb }) => updateAccount(id, {
  ...(name !== undefined ? { description: name || null } : {}),
  ...(quotaGb !== undefined ? { 'quotas/maxDiskQuota': Math.round(quotaGb * GB) } : {}),
}, 'Updating inbox');

async function passwordKeys(id) {
  const u = (await snapshot({ fresh: true })).users.find(x => x.id === id);
  if (!u) throw { status: 404, message: 'Inbox not found on the mail server' };
  return u.credentialKeys.length ? u.credentialKeys : ['0'];
}

export async function setPassword(id, password) {
  const keys = await passwordKeys(id);
  await updateAccount(id, { [`credentials/${keys[0]}/secret`]: password, [`credentials/${keys[0]}/expiresAt`]: null }, 'Resetting password');
}

export async function setSuspended(id, suspended) {
  const keys = await passwordKeys(id);
  const patch = Object.fromEntries(keys.map(k => [`credentials/${k}/expiresAt`, suspended ? SUSPENDED_AT : null]));
  await updateAccount(id, patch, suspended ? 'Suspending inbox' : 'Resuming inbox');
}

export const setAliases = (id, aliases) => updateAccount(id, {
  aliases: Object.fromEntries(aliases.map((a, i) => [i, { name: a.name, domainId: a.domainId, enabled: a.enabled !== false }])),
}, 'Saving aliases');

export async function destroyUser(id) {
  const r = await jmap([['x:Account/set', { destroy: [id] }, 's']]);
  checkSet(r.s, 'Deleting inbox');
  invalidate();
}

export async function createList({ domainId, local, description, recipients }) {
  const r = await jmap([['x:MailingList/set', { create: { n: {
    name: local, domainId, description: description || null, aliases: {},
    recipients: Object.fromEntries(recipients.map(a => [a, true])),
  } } }, 's']]);
  checkSet(r.s, `Creating ${local}@`);
  invalidate();
  return r.s.created.n.id;
}

export async function updateList(id, { recipients, description }) {
  const patch = {};
  if (recipients) patch.recipients = Object.fromEntries(recipients.map(a => [a, true]));
  if (description !== undefined) patch.description = description || null;
  const r = await jmap([['x:MailingList/set', { update: { [id]: patch } }, 's']]);
  checkSet(r.s, 'Updating group');
  invalidate();
}

export async function destroyList(id) {
  const r = await jmap([['x:MailingList/set', { destroy: [id] }, 's']]);
  checkSet(r.s, 'Deleting group');
  invalidate();
}

// ---------------------------------------------------------------- fake (in-memory) server
const fake = (() => {
  let seq = 100;
  const nextId = () => (seq++).toString(36);
  const store = { 'x:Domain': new Map(), 'x:Account': new Map(), 'x:MailingList': new Map() };
  const now = () => new Date().toISOString();
  store['x:Domain'].set('b', { id: 'b', name: 'ztdoffice.com', createdAt: now(), isEnabled: true, dnsZoneFile:
    'ztdoffice.com. IN MX 10 mx1.ztdoffice.com.\nv1-rsa-20261019._domainkey.ztdoffice.com. IN TXT "v=DKIM1; k=rsa; h=sha256; p=FAKE"\n' });
  store['x:Account'].set('a', { id: 'a', '@type': 'User', name: 'admin', domainId: 'b', roles: { '@type': 'Admin' }, credentials: { 0: { '@type': 'Password', secret: 'x' } } });

  const setPath = (obj, path, val) => {
    const parts = path.split('/');
    let o = obj;
    for (const p of parts.slice(0, -1)) o = o[p] ??= {};
    o[parts.at(-1)] = val;
  };
  const decorate = (type, o) => {
    if (type === 'x:Domain') return { ...o, dnsZoneFile: o.dnsZoneFile ||
      `${o.name}. IN MX 10 mx1.ztdoffice.com.\nv1-rsa-20261020._domainkey.${o.name}. IN TXT "v=DKIM1; k=rsa; h=sha256; p=FAKE"\n` };
    const d = store['x:Domain'].get(o.domainId);
    const masked = o.credentials ? Object.fromEntries(Object.entries(o.credentials).map(([k, c]) => [k, { ...c, secret: '****' }])) : undefined;
    return { ...o, ...(masked ? { credentials: masked } : {}), emailAddress: `${o.name}@${d?.name}`, usedDiskQuota: o.usedDiskQuota || 0 };
  };

  function handle(req) {
    const methodResponses = [];
    for (const [name, args, cid] of req.methodCalls) {
      const [type, op] = name.split('/');
      const tbl = store[type];
      if (!tbl) { methodResponses.push(['error', { type: 'unknownMethod' }, cid]); continue; }
      if (op === 'get') {
        const ids = args.ids || [...tbl.keys()];
        methodResponses.push([name, { list: ids.filter(i => tbl.has(i)).map(i => decorate(type, tbl.get(i))), notFound: ids.filter(i => !tbl.has(i)) }, cid]);
      } else if (op === 'set') {
        const out = {};
        for (const [k, o] of Object.entries(args.create || {})) {
          const key = type === 'x:Domain' ? o.name : `${o.name}@${o.domainId}`;
          const clash = [...tbl.values()].some(x => (type === 'x:Domain' ? x.name : `${x.name}@${x.domainId}`) === key)
            || (type !== 'x:Domain' && [...store[type === 'x:Account' ? 'x:MailingList' : 'x:Account'].values()].some(x => `${x.name}@${x.domainId}` === key));
          if (clash) { (out.notCreated ||= {})[k] = { type: 'alreadyExists', description: 'Address already in use' }; continue; }
          const id = nextId();
          tbl.set(id, { ...structuredClone(o), id, createdAt: now() });
          (out.created ||= {})[k] = { id };
        }
        for (const [id, patch] of Object.entries(args.update || {})) {
          const o = tbl.get(id);
          if (!o) { (out.notUpdated ||= {})[id] = { type: 'notFound' }; continue; }
          for (const [p, v] of Object.entries(patch)) p.includes('/') ? setPath(o, p, v) : (o[p] = structuredClone(v));
          (out.updated ||= {})[id] = null;
        }
        for (const id of args.destroy || []) {
          if (tbl.delete(id)) (out.destroyed ||= []).push(id);
          else (out.notDestroyed ||= {})[id] = { type: 'notFound' };
        }
        methodResponses.push([name, out, cid]);
      }
    }
    return { methodResponses };
  }
  return { handle, store };
})();

// Test hook: set fake storage use for an account (bytes).
export function _fakeSetUsed(id, bytes) { const a = fake.store['x:Account'].get(id); if (a) a.usedDiskQuota = bytes; invalidate(); }
