// Control panel API against the in-memory fake mail server (TEST_MODE=1 → stalwart fake).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.mjs';

const BASE = await startServer();
const { users, invites } = await import('../src/panel/store.mjs');
const stalwart = await import('../src/stalwart.mjs');

function client() {
  let cookie = null;
  async function req(method, path, body) {
    const h = { 'X-Requested-With': 'fetch' };
    if (cookie) h.Cookie = cookie;
    if (body !== undefined) h['Content-Type'] = 'application/json';
    const res = await fetch(BASE + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
    for (const sc of res.headers.getSetCookie()) {
      const m = /^ztd_panel=([^;]*)/.exec(sc);
      if (m) cookie = m[1] && !/Max-Age=0/i.test(sc) ? `ztd_panel=${m[1]}` : null;
    }
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }
  return { get: p => req('GET', p), post: (p, b = {}) => req('POST', p, b), patch: (p, b = {}) => req('PATCH', p, b), del: (p, b = {}) => req('DELETE', p, b) };
}

const tokenOf = url => url.split('/invite/')[1];

const staff = client();
const owner = client();
let clientId, ownerEmail = `ellie-${process.pid}@bloom.test`;

test('staff signs up from an invite link and sees the overview', async () => {
  const u = users.create({ email: `samuel-${process.pid}@ztdoffice.com`, name: 'Samuel', role: 'staff' });
  const t = invites.create(u.id);
  assert.equal((await staff.get(`/api/panel/invite/${t}`)).body.role, 'staff');
  assert.equal((await staff.post(`/api/panel/invite/${t}`, { password: 'short' })).status, 400);
  assert.equal((await staff.post(`/api/panel/invite/${t}`, { password: 'a-long-password-1' })).status, 200);
  assert.equal((await staff.post(`/api/panel/invite/${t}`, { password: 'a-long-password-1' })).status, 404, 'link is single-use');
  const me = await staff.get('/api/panel/me');
  assert.equal(me.body.user.role, 'staff');
  const ov = await staff.get('/api/panel/overview');
  assert.equal(ov.status, 200);
  assert.ok(ov.body.clientsList.some(c => c.internal && c.domains.some(d => d.name === 'ztdoffice.com')), 'internal client seeded');
});

test('wrong password is refused', async () => {
  const c = client();
  assert.equal((await c.post('/api/panel/login', { email: `samuel-${process.pid}@ztdoffice.com`, password: 'nope-nope-nope' })).status, 401);
  assert.equal((await c.get('/api/panel/overview')).status, 401);
});

test('staff creates a client; the domain is added to the mail server', async () => {
  const r = await staff.post('/api/panel/clients', { name: 'Bloom & Co', domain: 'bloom.test', plan: 'lite', contactName: 'Ellie', contactEmail: ownerEmail });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  clientId = r.body.id;
  assert.ok(r.body.invite.includes('/panel/#/invite/'));
  const snap = await stalwart.snapshot({ fresh: true });
  assert.ok(snap.domains.some(d => d.name === 'bloom.test'));
  assert.equal((await staff.post('/api/panel/clients', { name: 'Dup', domain: 'bloom.test', plan: 'lite' })).status, 409);
  // client admin accepts the invite
  assert.equal((await owner.post(`/api/panel/invite/${tokenOf(r.body.invite)}`, { password: 'ellies-password-1' })).status, 200);
});

test('a client admin only sees their own account', async () => {
  assert.equal((await owner.get('/api/panel/overview')).status, 403);
  assert.equal((await owner.get('/api/panel/clients')).status, 403);
  const internal = (await staff.get('/api/panel/clients')).body.clients.find(c => c.internal);
  assert.equal((await owner.get(`/api/panel/clients/${internal.id}`)).status, 404);
  const mine = await owner.get(`/api/panel/clients/${clientId}`);
  assert.equal(mine.body.name, 'Bloom & Co');
  assert.equal((await owner.patch(`/api/panel/clients/${clientId}`, { plan: 'business' })).status, 403, 'clients cannot change their own plan');
});

test('inbox limit is enforced by plan', async () => {
  for (const local of ['ellie', 'orders', 'sam']) {
    const r = await owner.post(`/api/panel/clients/${clientId}/inboxes`, { local, name: local });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.ok(r.body.password && r.body.password.length >= 10, 'generated password returned once');
  }
  const over = await owner.post(`/api/panel/clients/${clientId}/inboxes`, { local: 'extra', name: 'Extra' });
  assert.equal(over.status, 402);
  const d = (await owner.get(`/api/panel/clients/${clientId}`)).body;
  assert.equal(d.usage.inboxes, 3);
  assert.equal(d.inboxes.length, 3);
});

test('groups and aliases: create, duplicates refused, counted against the plan', async () => {
  const d = (await owner.get(`/api/panel/clients/${clientId}`)).body;
  const ellie = d.inboxes.find(i => i.local === 'ellie');
  let r = await owner.post(`/api/panel/clients/${clientId}/groups`, { type: 'group', local: 'hello', recipients: ['ellie@bloom.test', 'sam@bloom.test'] });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  r = await owner.post(`/api/panel/clients/${clientId}/groups`, { type: 'alias', local: 'weddings', inboxId: ellie.id });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  assert.equal((await owner.post(`/api/panel/clients/${clientId}/groups`, { type: 'alias', local: 'sam', inboxId: ellie.id })).status, 409, 'address of an inbox');
  assert.equal((await owner.post(`/api/panel/clients/${clientId}/groups`, { type: 'group', local: 'hello', recipients: ['x@y.com'] })).status, 409);
  const after = (await owner.get(`/api/panel/clients/${clientId}`)).body;
  assert.equal(after.usage.aliases, 2);
  assert.deepEqual(after.groups[0].recipients.sort(), ['ellie@bloom.test', 'sam@bloom.test']);
  assert.equal(after.aliases[0].address, 'weddings@bloom.test');
  // remove the alias again
  assert.equal((await owner.del(`/api/panel/clients/${clientId}/aliases/weddings@bloom.test`)).status, 200);
  assert.equal((await owner.get(`/api/panel/clients/${clientId}`)).body.usage.aliases, 1);
});

test('suspend and resume an inbox; reset its password', async () => {
  const d = (await owner.get(`/api/panel/clients/${clientId}`)).body;
  const sam = d.inboxes.find(i => i.local === 'sam');
  assert.equal((await owner.post(`/api/panel/clients/${clientId}/inboxes/${sam.id}/suspend`, { suspended: true })).status, 200);
  assert.equal((await owner.get(`/api/panel/clients/${clientId}`)).body.inboxes.find(i => i.id === sam.id).suspended, true);
  assert.equal((await owner.post(`/api/panel/clients/${clientId}/inboxes/${sam.id}/password`, {})).status, 409, 'no reset while suspended');
  await owner.post(`/api/panel/clients/${clientId}/inboxes/${sam.id}/suspend`, { suspended: false });
  const r = await owner.post(`/api/panel/clients/${clientId}/inboxes/${sam.id}/password`, {});
  assert.equal(r.status, 200);
  assert.ok(r.body.password);
});

test('upgrade request reaches staff; staff changes the plan and the limit rises', async () => {
  assert.equal((await owner.post(`/api/panel/clients/${clientId}/requests`, { plan: 'premium' })).status, 201);
  const ov = (await staff.get('/api/panel/overview')).body;
  assert.ok(ov.attention.some(a => a.title.includes('Premium')));
  const reqId = (await staff.get(`/api/panel/clients/${clientId}`)).body.requests[0].id;
  const p = await staff.patch(`/api/panel/clients/${clientId}`, { plan: 'premium', customPrice: 60, extraInboxes: 1, resolveRequestId: reqId });
  assert.equal(p.status, 200);
  assert.equal(p.body.limits.inboxes, 8);
  assert.equal(p.body.monthly, 60);
  assert.equal((await staff.get(`/api/panel/clients/${clientId}`)).body.requests.length, 0);
  assert.equal((await owner.post(`/api/panel/clients/${clientId}/inboxes`, { local: 'extra', name: 'Extra' })).status, 201);
});

test('suspending a client blocks their admins and every inbox; resuming restores', async () => {
  assert.equal((await staff.post(`/api/panel/clients/${clientId}/suspend`, { suspended: true })).status, 200);
  assert.equal((await owner.get(`/api/panel/clients/${clientId}`)).status, 401, 'session ended');
  const relog = await client().post('/api/panel/login', { email: ownerEmail, password: 'ellies-password-1' });
  assert.equal(relog.status, 403);
  let d = (await staff.get(`/api/panel/clients/${clientId}?fresh=1`)).body;
  assert.ok(d.inboxes.every(i => i.suspended));
  assert.equal((await staff.post(`/api/panel/clients/${clientId}/suspend`, { suspended: false })).status, 200);
  d = (await staff.get(`/api/panel/clients/${clientId}?fresh=1`)).body;
  assert.ok(d.inboxes.every(i => !i.suspended));
  assert.equal((await owner.post('/api/panel/login', { email: ownerEmail, password: 'ellies-password-1' })).status, 200);
});

test('deleting an inbox needs the address typed, and removes it from groups', async () => {
  const d = (await owner.get(`/api/panel/clients/${clientId}`)).body;
  const sam = d.inboxes.find(i => i.local === 'sam');
  assert.equal((await owner.del(`/api/panel/clients/${clientId}/inboxes/${sam.id}`, { confirm: 'wrong' })).status, 400);
  assert.equal((await owner.del(`/api/panel/clients/${clientId}/inboxes/${sam.id}`, { confirm: 'sam@bloom.test' })).status, 200);
  const after = (await owner.get(`/api/panel/clients/${clientId}`)).body;
  assert.ok(!after.inboxes.some(i => i.local === 'sam'));
  assert.deepEqual(after.groups[0].recipients, ['ellie@bloom.test']);
});

test('mutations need the fetch header (CSRF)', async () => {
  const res = await fetch(BASE + '/api/panel/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(res.status, 403);
});
