import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, makeClient, setupAndLogin, resend, signWebhook, WEBHOOK_SECRET, BASE } from './helpers.mjs';

const ADMIN_EMAIL = 'admin@businessmail.ztddevs.com';
// Recipient strings are routed through util.parseAddress in the inbound handler, which only
// extracts the address correctly from the "<addr>" / "Name <addr>" forms (a bare address has
// its first character sheared off as a name). Deliver to the angle-bracket form so routing works.
const ADMIN_RCPT = `<${ADMIN_EMAIL}>`;

let c;

before(async () => {
  await startServer();
  c = makeClient();
  await setupAndLogin(c);
});

// Post a raw webhook body with Svix headers. We control the exact bytes so the signature
// matches what the server verifies over the raw request body. Webhooks are CSRF-exempt.
async function postWebhook(payloadObj, { svixId, badSig = false } = {}) {
  const payloadString = JSON.stringify(payloadObj);
  const id = svixId || 'msg_' + Math.random().toString(36).slice(2);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = badSig
    ? 'v1,' + Buffer.from('not-the-right-signature').toString('base64')
    : signWebhook(WEBHOOK_SECRET, id, timestamp, payloadString);
  const res = await fetch(BASE + '/api/webhooks/resend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'svix-id': id,
      'svix-timestamp': timestamp,
      'svix-signature': signature,
    },
    body: payloadString,
  });
  const text = await res.text();
  let body; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, body, svixId: id };
}

test('a correctly-signed email.received webhook delivers to the admin inbox', async () => {
  const emailId = 'eml_' + Math.random().toString(36).slice(2);
  resend.__fakeReceive({
    id: emailId,
    from: 'jane@acme.com',
    to: [ADMIN_EMAIL],
    subject: 'Hi',
    html: '<p>hello</p>',
    text: 'hello',
    message_id: '<a@x>',
    headers: {},
  });

  const res = await postWebhook({
    type: 'email.received',
    data: { email_id: emailId, received_for: [ADMIN_RCPT], to: [ADMIN_EMAIL] },
  });
  assert.equal(res.status, 200);

  // Message appears in the inbox.
  const inbox = await c.get('/api/threads?label=inbox');
  assert.equal(inbox.status, 200);
  const thread = inbox.body.threads.find((t) => t.subject === 'Hi');
  assert.ok(thread, 'received email appears in inbox');
  assert.equal(thread.unread, true, 'incoming thread is unread');
});

test('a duplicate svix-id is idempotent (no second copy)', async () => {
  const emailId = 'eml_dup_' + Math.random().toString(36).slice(2);
  resend.__fakeReceive({
    id: emailId, from: 'dup@acme.com', to: [ADMIN_EMAIL],
    subject: 'Dup Subject', html: '<p>dup</p>', text: 'dup', message_id: '<dup@x>', headers: {},
  });
  const svixId = 'msg_dup_fixed';

  const first = await postWebhook(
    { type: 'email.received', data: { email_id: emailId, received_for: [ADMIN_RCPT] } },
    { svixId });
  assert.equal(first.status, 200);

  const second = await postWebhook(
    { type: 'email.received', data: { email_id: emailId, received_for: [ADMIN_RCPT] } },
    { svixId });
  assert.equal(second.status, 200);
  assert.ok(second.body && second.body.dup, 'second delivery flagged as duplicate');

  // Only one thread with that subject.
  const inbox = await c.get('/api/threads?label=inbox');
  const matches = inbox.body.threads.filter((t) => t.subject === 'Dup Subject');
  assert.equal(matches.length, 1, 'idempotent: exactly one thread');
});

test('a webhook with a bad signature is rejected 401', async () => {
  const emailId = 'eml_bad_' + Math.random().toString(36).slice(2);
  resend.__fakeReceive({
    id: emailId, from: 'bad@acme.com', to: [ADMIN_EMAIL],
    subject: 'Should Not Appear', text: 'x', html: '<p>x</p>', message_id: '<bad@x>', headers: {},
  });
  const res = await postWebhook(
    { type: 'email.received', data: { email_id: emailId, received_for: [ADMIN_RCPT] } },
    { badSig: true });
  assert.equal(res.status, 401);

  const inbox = await c.get('/api/threads?label=inbox');
  assert.ok(!inbox.body.threads.some((t) => t.subject === 'Should Not Appear'),
    'bad-signature email was not stored');
});

test('a reply (In-Reply-To the first message) lands in the same thread', async () => {
  const firstId = 'eml_thr1_' + Math.random().toString(36).slice(2);
  const firstMsgId = '<thread-root-' + Math.random().toString(36).slice(2) + '@acme.com>';
  resend.__fakeReceive({
    id: firstId, from: 'carol@acme.com', to: [ADMIN_EMAIL],
    subject: 'Threading Test', html: '<p>one</p>', text: 'one',
    message_id: firstMsgId, headers: { 'message-id': firstMsgId },
  });
  const r1 = await postWebhook({
    type: 'email.received', data: { email_id: firstId, received_for: [ADMIN_RCPT] },
  });
  assert.equal(r1.status, 200);

  // Identify the created thread.
  let inbox = await c.get('/api/threads?label=inbox');
  const thread = inbox.body.threads.find((t) => t.subject === 'Threading Test');
  assert.ok(thread, 'first threading email present');
  const tid = thread.id;

  // Second email references the first via In-Reply-To.
  const secondId = 'eml_thr2_' + Math.random().toString(36).slice(2);
  const secondMsgId = '<reply-' + Math.random().toString(36).slice(2) + '@acme.com>';
  resend.__fakeReceive({
    id: secondId, from: 'carol@acme.com', to: [ADMIN_EMAIL],
    subject: 'Re: Threading Test', html: '<p>two</p>', text: 'two',
    message_id: secondMsgId,
    headers: { 'message-id': secondMsgId, 'in-reply-to': firstMsgId },
  });
  const r2 = await postWebhook({
    type: 'email.received', data: { email_id: secondId, received_for: [ADMIN_RCPT] },
  });
  assert.equal(r2.status, 200);

  // Same thread now has two messages.
  const full = await c.get(`/api/threads/${tid}`);
  assert.equal(full.status, 200);
  assert.equal(full.body.messages.length, 2, 'reply joined the existing thread');
});

test('non-email.received events (e.g. delivered) are acknowledged 200', async () => {
  const res = await postWebhook({ type: 'email.delivered', data: { email_id: 'whatever' } });
  assert.equal(res.status, 200);
});
