// Core library tests against the in-memory PGlite DB and the fake mail server.
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './auth';
import { PLANS, limitsFor, listPrice, monthlyPrice } from './plans';
import * as stalwart from './stalwart';
import { clients, users, sessions, invites } from './store';

describe('plans', () => {
  it('limits combine plan + extras', () => {
    expect(limitsFor({ plan: 'premium', custom_price: null, extra_inboxes: 2, extra_aliases: 5 })).toMatchObject({ inboxes: 9, aliases: 15 });
  });
  it('list price adds extras; custom price wins', () => {
    expect(listPrice({ plan: 'lite', custom_price: null, extra_inboxes: 1, extra_aliases: 0 })).toBe(PLANS.lite.price + 5);
    expect(monthlyPrice({ plan: 'business', custom_price: 11000, extra_inboxes: 0, extra_aliases: 0 })).toBe(110);
  });
});

describe('passwords', () => {
  it('round-trips and rejects wrong', async () => {
    const h = await hashPassword('correct-horse-battery');
    expect(await verifyPassword('correct-horse-battery', h)).toBe(true);
    expect(await verifyPassword('wrong', h)).toBe(false);
    expect(await verifyPassword('x', null)).toBe(false);
  });
});

describe('stalwart fake', () => {
  it('creates, suspends, aliases and deletes an account', async () => {
    const d = (await stalwart.snapshot({ fresh: true })).domains.find((x) => x.name === 'ztdoffice.com')!;
    const uid = await stalwart.createUser({ domainId: d.id, local: 'jane', name: 'Jane', quotaGb: 5, password: 'pw-1234567890' });
    let snap = await stalwart.snapshot({ fresh: true });
    const u = snap.users.find((x) => x.id === uid)!;
    expect(u.email).toBe('jane@ztdoffice.com');
    expect(u.suspended).toBe(false);
    await stalwart.setAliases(uid, [{ name: 'info', domainId: d.id }]);
    await stalwart.setSuspended(uid, true);
    snap = await stalwart.snapshot({ fresh: true });
    expect(snap.users.find((x) => x.id === uid)!.suspended).toBe(true);
    expect(snap.users.find((x) => x.id === uid)!.aliases[0]!.address).toBe('info@ztdoffice.com');
    await stalwart.destroyUser(uid);
    expect((await stalwart.snapshot({ fresh: true })).users.find((x) => x.id === uid)).toBeUndefined();
  });
  it('refuses a duplicate address', async () => {
    const d = (await stalwart.snapshot({ fresh: true })).domains[0]!;
    await stalwart.createUser({ domainId: d.id, local: 'dup', name: 'Dup', quotaGb: 5, password: 'pw-1234567890' });
    await expect(stalwart.createUser({ domainId: d.id, local: 'dup', name: 'Dup2', quotaGb: 5, password: 'pw-1234567890' })).rejects.toMatchObject({ status: 409 });
  });
  it('mailing lists hold recipients', async () => {
    const d = (await stalwart.snapshot({ fresh: true })).domains[0]!;
    const lid = await stalwart.createList({ domainId: d.id, local: 'team', recipients: ['a@x.com', 'b@x.com'] });
    const list = (await stalwart.snapshot({ fresh: true })).lists.find((l) => l.id === lid)!;
    expect(list.recipients.sort()).toEqual(['a@x.com', 'b@x.com']);
    await stalwart.destroyList(lid);
  });
});

describe('store (PGlite)', () => {
  it('creates a client, an invite and a session', async () => {
    const c = await clients.create({ name: 'Bloom & Co', contactEmail: 'ellie@bloom.test', plan: 'lite' });
    await clients.addDomain(c.id, 'bloom.test');
    expect(await clients.domains(c.id)).toEqual(['bloom.test']);
    expect(await clients.allDomains()).toMatchObject({ 'bloom.test': c.id });

    const u = await users.create({ email: 'ellie@bloom.test', name: 'Ellie', role: 'client', clientId: c.id });
    const inviteToken = await invites.create(u.id);
    const looked = await invites.lookup(inviteToken);
    expect(looked?.user?.email).toBe('ellie@bloom.test');
    await invites.use(inviteToken);
    expect(await invites.lookup(inviteToken)).toBeNull(); // single use

    await users.setPassword(u.id, await hashPassword('ellies-password-1'));
    const sess = await sessions.create(u.id, 'test');
    expect((await sessions.lookup(sess))?.id).toBe(u.id);
    await sessions.destroy(sess);
    expect(await sessions.lookup(sess)).toBeNull();
  });
});
