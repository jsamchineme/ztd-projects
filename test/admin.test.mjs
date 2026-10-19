import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, makeClient, setupAndLogin, resend, signWebhook, WEBHOOK_SECRET, BASE, uniqueEmail } from './helpers.mjs';

const ADMIN_EMAIL = 'admin@businessmail.ztddevs.com';
// util.parseAddress in the inbound handler only parses "<addr>"/"Name <addr>" correctly.
const ADMIN_RCPT = `<${ADMIN_EMAIL}>`;

let admin;        // admin client
const memberEmail = uniqueEmail('member');
const memberPassword = 'member-password-123';

before(async () => {
  await startServer();
  admin = makeClient();
  await setupAndLogin(admin);
});

test('admin creates a user and that user can log in with a fresh client', async () => {
  const create = await admin.post('/api/admin/users', {
    email: memberEmail, name: 'Member One', password: memberPassword, role: 'member',
  });
  assert.equal(create.status, 200);
  assert.ok(create.body.id, 'created user id returned');

  // Appears in the admin users list.
  const list = await admin.get('/api/admin/users');
  assert.equal(list.status, 200);
  assert.ok(list.body.some((u) => u.email === memberEmail), 'new user listed');

  // The new user can authenticate.
  const memberClient = makeClient();
  const login = await memberClient.post('/api/auth/login', { email: memberEmail, password: memberPassword });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.email, memberEmail);
  assert.equal(login.body.user.role, 'member');
});

test('a non-admin hitting /api/admin/users gets 403', async () => {
  const memberClient = makeClient();
  await memberClient.post('/api/auth/login', { email: memberEmail, password: memberPassword });
  const res = await memberClient.get('/api/admin/users');
  assert.equal(res.status, 403);
});

test('admin routes require authentication at all', async () => {
  const anon = makeClient();
  const res = await anon.get('/api/admin/users');
  assert.equal(res.status, 401);
});

test('a user cannot download another user\'s attachment (404)', async () => {
  // Deliver an inbound email with an attachment to the admin.
  const emailId = 'eml_att_' + Math.random().toString(36).slice(2);
  resend.__fakeReceive({
    id: emailId, from: 'sender@acme.com', to: [ADMIN_EMAIL],
    subject: 'Has Attachment', html: '<p>see file</p>', text: 'see file',
    message_id: '<att@x>', headers: {},
    attachments: [{ filename: 'secret.pdf', content_type: 'application/pdf', size: 42 }],
  });
  const payloadString = JSON.stringify({
    type: 'email.received', data: { email_id: emailId, received_for: [ADMIN_RCPT] },
  });
  const sid = 'msg_att_' + Math.random().toString(36).slice(2);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signWebhook(WEBHOOK_SECRET, sid, ts, payloadString);
  const wh = await fetch(BASE + '/api/webhooks/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'svix-id': sid, 'svix-timestamp': ts, 'svix-signature': sig },
    body: payloadString,
  });
  assert.equal(wh.status, 200);

  // Find the attachment id on the admin's thread.
  const inbox = await admin.get('/api/threads?label=inbox');
  const thread = inbox.body.threads.find((t) => t.subject === 'Has Attachment');
  assert.ok(thread, 'inbound attachment thread exists');
  const full = await admin.get(`/api/threads/${thread.id}`);
  const withAtt = full.body.messages.find((m) => m.attachments && m.attachments.length);
  assert.ok(withAtt, 'message has an attachment');
  const attId = withAtt.attachments[0].id;
  assert.ok(attId, 'attachment id present');

  // Admin (owner) can access it (not a 404 ownership failure).
  const ownerGet = await admin.get(`/api/attachments/${attId}`);
  assert.notEqual(ownerGet.status, 404, 'owner is not blocked by ownership check');

  // Member logs in on a fresh client and is denied the admin's attachment.
  const memberClient = makeClient();
  await memberClient.post('/api/auth/login', { email: memberEmail, password: memberPassword });
  const other = await memberClient.get(`/api/attachments/${attId}`);
  assert.equal(other.status, 404, 'another user cannot access the attachment');
});
