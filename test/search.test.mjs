import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, makeClient, setupAndLogin, resend, signWebhook, WEBHOOK_SECRET, BASE } from './helpers.mjs';

const ADMIN_EMAIL = 'admin@businessmail.ztddevs.com';
// util.parseAddress in the inbound handler only parses "<addr>"/"Name <addr>" correctly,
// so deliver to the angle-bracket form.
const ADMIN_RCPT = `<${ADMIN_EMAIL}>`;

let c;

async function deliver(email, receivedFor = [ADMIN_RCPT]) {
  resend.__fakeReceive(email);
  const payloadString = JSON.stringify({
    type: 'email.received', data: { email_id: email.id, received_for: receivedFor },
  });
  const id = 'msg_' + Math.random().toString(36).slice(2);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signWebhook(WEBHOOK_SECRET, id, ts, payloadString);
  const res = await fetch(BASE + '/api/webhooks/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': sig },
    body: payloadString,
  });
  assert.equal(res.status, 200);
}

before(async () => {
  await startServer();
  c = makeClient();
  await setupAndLogin(c);

  // Seed: an inbound message with a distinctive body and an attachment.
  await deliver({
    id: 'srch_1',
    from: 'Pineapple Person <pineapple@fruit.com>',
    to: [ADMIN_EMAIL],
    subject: 'Quarterly numbers',
    html: '<p>The watermelon metrics look great.</p>',
    text: 'The watermelon metrics look great.',
    message_id: '<srch1@x>',
    headers: {},
    attachments: [{ filename: 'report.pdf', content_type: 'application/pdf', size: 1234 }],
  });

  // Seed: an inbound message, different sender, no attachment.
  await deliver({
    id: 'srch_2',
    from: 'Orange Owner <orange@fruit.com>',
    to: [ADMIN_EMAIL],
    subject: 'Lunch plans',
    html: '<p>Lets get tacos for lunch.</p>',
    text: 'Lets get tacos for lunch.',
    message_id: '<srch2@x>',
    headers: {},
  });
});

test('search finds by body term', async () => {
  const res = await c.get('/api/search?q=watermelon');
  assert.equal(res.status, 200);
  assert.ok(res.body.threads.some((t) => t.subject === 'Quarterly numbers'),
    'body term matches the right thread');
  assert.ok(!res.body.threads.some((t) => t.subject === 'Lunch plans'),
    'unrelated thread not matched');
});

test('search supports the from: operator', async () => {
  const res = await c.get('/api/search?q=' + encodeURIComponent('from:pineapple'));
  assert.equal(res.status, 200);
  assert.ok(res.body.threads.some((t) => t.subject === 'Quarterly numbers'));
  assert.ok(!res.body.threads.some((t) => t.subject === 'Lunch plans'));
});

test('search supports the subject: operator', async () => {
  const res = await c.get('/api/search?q=' + encodeURIComponent('subject:Lunch'));
  assert.equal(res.status, 200);
  assert.ok(res.body.threads.some((t) => t.subject === 'Lunch plans'));
  assert.ok(!res.body.threads.some((t) => t.subject === 'Quarterly numbers'));
});

test('search supports has:attachment', async () => {
  const res = await c.get('/api/search?q=' + encodeURIComponent('has:attachment'));
  assert.equal(res.status, 200);
  assert.ok(res.body.threads.some((t) => t.subject === 'Quarterly numbers'),
    'thread with attachment is returned');
  assert.ok(!res.body.threads.some((t) => t.subject === 'Lunch plans'),
    'thread without attachment is excluded');
});

test('combining a term with has:attachment narrows results', async () => {
  const res = await c.get('/api/search?q=' + encodeURIComponent('watermelon has:attachment'));
  assert.equal(res.status, 200);
  assert.ok(res.body.threads.some((t) => t.subject === 'Quarterly numbers'));
});
