import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, makeClient } from './helpers.mjs';

const ADMIN = {
  orgName: 'Acme Inc',
  name: 'Admin User',
  email: 'admin@businessmail.ztddevs.com',
  password: 'correct-horse-battery',
};

before(async () => { await startServer(); });

test('setup creates admin, authenticates, and flips needsSetup to false', async () => {
  const c = makeClient();

  // Before setup, state reports needsSetup true and not authed.
  const pre = await c.get('/api/auth/state');
  assert.equal(pre.status, 200);
  assert.equal(pre.body.needsSetup, true);
  assert.equal(pre.body.authed, false);

  // Perform first-run setup.
  const setup = await c.post('/api/auth/setup', ADMIN);
  assert.equal(setup.status, 200);
  assert.ok(setup.body.user, 'setup returns a user');
  assert.equal(setup.body.user.email, ADMIN.email);
  assert.equal(setup.body.user.role, 'admin');
  assert.ok(c.cookie, 'session cookie was set');

  // State now: no setup needed, authed as admin.
  const post = await c.get('/api/auth/state');
  assert.equal(post.body.needsSetup, false);
  assert.equal(post.body.authed, true);
  assert.equal(post.body.user.email, ADMIN.email);

  // /api/auth/me returns the user while authed.
  const me = await c.get('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, ADMIN.email);
});

test('setup is rejected once completed', async () => {
  const c = makeClient();
  const res = await c.post('/api/auth/setup', {
    orgName: 'X', name: 'Y', email: 'y@businessmail.ztddevs.com', password: 'zzzzzzzzzz',
  });
  assert.equal(res.status, 403);
});

test('login with wrong password returns 401', async () => {
  const c = makeClient();
  const res = await c.post('/api/auth/login', { email: ADMIN.email, password: 'wrong-password' });
  assert.equal(res.status, 401);
  assert.ok(!c.cookie, 'no session set on failed login');
});

test('login with correct password sets a session and me works', async () => {
  const c = makeClient();
  const res = await c.post('/api/auth/login', { email: ADMIN.email, password: ADMIN.password });
  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, ADMIN.email);
  const me = await c.get('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, ADMIN.email);
});

test('logout clears the session so me returns 401', async () => {
  const c = makeClient();
  await c.post('/api/auth/login', { email: ADMIN.email, password: ADMIN.password });
  const out = await c.post('/api/auth/logout', {});
  assert.equal(out.status, 200);
  const me = await c.get('/api/auth/me');
  assert.equal(me.status, 401);
});

test('me requires authentication', async () => {
  const c = makeClient();
  const me = await c.get('/api/auth/me');
  assert.equal(me.status, 401);
});

test('CSRF: a mutating POST without X-Requested-With is rejected 403', async () => {
  const c = makeClient();
  await c.post('/api/auth/login', { email: ADMIN.email, password: ADMIN.password });
  // Send login again but suppress the CSRF header.
  const res = await c.post('/api/auth/login',
    { email: ADMIN.email, password: ADMIN.password }, { csrf: false });
  assert.equal(res.status, 403);
});
