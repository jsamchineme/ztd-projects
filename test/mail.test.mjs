import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, makeClient, setupAndLogin, resend } from './helpers.mjs';

let c;

before(async () => {
  await startServer();
  c = makeClient();
  await setupAndLogin(c);
});

test('send via /api/send creates a Sent thread (fake resend records it)', async () => {
  const before = resend.__sent().length;
  const res = await c.post('/api/send', {
    to: ['jane@acme.com'],
    subject: 'Hello Jane',
    text: 'Hi there Jane',
    html: '<p>Hi there Jane</p>',
  });
  assert.equal(res.status, 200);
  assert.ok(res.body.threadId, 'send returns a threadId');
  assert.ok(res.body.id, 'send returns a resend id');

  // Fake resend captured the outbound email.
  const sent = resend.__sent();
  assert.equal(sent.length, before + 1);
  const last = sent[sent.length - 1];
  assert.deepEqual(last.to, ['jane@acme.com']);
  assert.equal(last.subject, 'Hello Jane');

  // Thread shows up under the sent label.
  const list = await c.get('/api/threads?label=sent');
  assert.equal(list.status, 200);
  const found = list.body.threads.find((t) => t.id === res.body.threadId);
  assert.ok(found, 'sent thread appears in label=sent');
  assert.equal(found.subject, 'Hello Jane');
  assert.equal(found.unread, false, 'sent threads are not unread');
});

test('star / read / archive / trash change flags and labels', async () => {
  const send = await c.post('/api/send', { to: ['bob@acme.com'], subject: 'Flags test', text: 'body' });
  const tid = send.body.threadId;

  // Star.
  let r = await c.post(`/api/threads/${tid}/star`, { starred: true });
  assert.equal(r.status, 200);
  let t = (await c.get(`/api/threads/${tid}`)).body.thread;
  assert.equal(t.starred, true);

  // Unstar.
  await c.post(`/api/threads/${tid}/star`, { starred: false });
  t = (await c.get(`/api/threads/${tid}`)).body.thread;
  assert.equal(t.starred, false);

  // Mark unread then read.
  await c.post(`/api/threads/${tid}/read`, { read: false });
  t = (await c.get(`/api/threads/${tid}`)).body.thread;
  assert.equal(t.unread, true);
  await c.post(`/api/threads/${tid}/read`, { read: true });
  t = (await c.get(`/api/threads/${tid}`)).body.thread;
  assert.equal(t.unread, false);

  // Archive.
  await c.post(`/api/threads/${tid}/archive`, {});
  const arch = await c.get('/api/threads?label=archive');
  assert.ok(arch.body.threads.some((x) => x.id === tid), 'thread is in archive');

  // Trash.
  await c.post(`/api/threads/${tid}/trash`, {});
  const trash = await c.get('/api/threads?label=trash');
  assert.ok(trash.body.threads.some((x) => x.id === tid), 'thread is in trash');
  const archAfter = await c.get('/api/threads?label=archive');
  assert.ok(!archAfter.body.threads.some((x) => x.id === tid), 'trash removes archive label');
});

test('labels CRUD and applying a custom label to a thread', async () => {
  const create = await c.post('/api/labels', { name: 'Project X', color: '#ff0000' });
  assert.equal(create.status, 200);
  const lid = create.body.id;
  assert.ok(lid);

  const labels = await c.get('/api/labels');
  assert.ok(labels.body.some((l) => l.id === lid && l.name === 'Project X'));

  // Apply the custom label to a thread and confirm it lists under that label id.
  const send = await c.post('/api/send', { to: ['x@acme.com'], subject: 'Labelled', text: 'b' });
  const tid = send.body.threadId;
  const apply = await c.post(`/api/threads/${tid}/labels`, { add: [lid] });
  assert.equal(apply.status, 200);
  const underLabel = await c.get(`/api/threads?label=${lid}`);
  assert.ok(underLabel.body.threads.some((x) => x.id === tid), 'thread appears under custom label');

  // Remove it.
  await c.post(`/api/threads/${tid}/labels`, { remove: [lid] });
  const after = await c.get(`/api/threads?label=${lid}`);
  assert.ok(!after.body.threads.some((x) => x.id === tid), 'label removed from thread');

  // Delete the label.
  const del = await c.del(`/api/labels/${lid}`);
  assert.equal(del.status, 200);
  const labels2 = await c.get('/api/labels');
  assert.ok(!labels2.body.some((l) => l.id === lid), 'label deleted');
});

test('drafts upsert, list, get, and delete', async () => {
  // Create a draft.
  const create = await c.post('/api/drafts', {
    to: ['draft@acme.com'], subject: 'Draft subject', text: 'draft body',
  });
  assert.equal(create.status, 200);
  const did = create.body.id;
  assert.ok(did);

  // List includes it.
  let list = await c.get('/api/drafts');
  assert.ok(list.body.some((d) => d.id === did));

  // Upsert (update) the same draft id.
  const upd = await c.post('/api/drafts', { id: did, subject: 'Edited subject', text: 'edited' });
  assert.equal(upd.body.id, did, 'upsert keeps same id');
  const got = await c.get(`/api/drafts/${did}`);
  assert.equal(got.body.subject, 'Edited subject');

  // Delete.
  const del = await c.del(`/api/drafts/${did}`);
  assert.equal(del.status, 200);
  list = await c.get('/api/drafts');
  assert.ok(!list.body.some((d) => d.id === did), 'draft removed from list');
  const gone = await c.get(`/api/drafts/${did}`);
  assert.equal(gone.status, 404);
});

test('send with draftId deletes the draft after sending', async () => {
  const create = await c.post('/api/drafts', { to: ['z@acme.com'], subject: 'From draft', text: 'b' });
  const did = create.body.id;
  const send = await c.post('/api/send', {
    to: ['z@acme.com'], subject: 'From draft', text: 'b', draftId: did,
  });
  assert.equal(send.status, 200);
  const gone = await c.get(`/api/drafts/${did}`);
  assert.equal(gone.status, 404, 'draft deleted after send');
});

test('mail routes require authentication', async () => {
  const anon = makeClient();
  const res = await anon.get('/api/threads?label=inbox');
  assert.equal(res.status, 401);
});
