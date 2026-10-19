// Shared test harness. Sets TEST_MODE + deterministic env BEFORE importing the server,
// boots the server once (singleton), and provides a cookie-keeping HTTP client, a Svix
// signer mirroring src/resend.mjs, and a setup+login helper.

import { createHmac } from 'node:crypto';

// ---- Env must be set before any app module is imported ----
process.env.TEST_MODE = '1';
process.env.RESEND_WEBHOOK_SECRET = 'whsec_' + Buffer.from('testsecret-testsecret-123456').toString('base64');
process.env.COOKIE_SECURE = 'false';
process.env.PORT = '0'; // ephemeral — avoids EADDRINUSE when node --test runs files concurrently
process.env.DB_PATH = '/tmp/bm-test-' + process.pid + '.db';
process.env.ATTACHMENTS_DIR = '/tmp/bm-test-att-' + process.pid;

export let BASE = 'http://127.0.0.1:0'; // set to the real address once the server is listening
export const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

let _serverPromise = null;

// Import the server exactly once; wait until it is listening. Returns the base URL.
export async function startServer() {
  if (!_serverPromise) {
    _serverPromise = (async () => {
      const { server } = await import('../server.mjs');
      if (!server.listening) {
        await new Promise((resolve) => server.once('listening', resolve));
      }
      const addr = server.address();
      BASE = `http://127.0.0.1:${addr.port}`;
      // Don't let the listening socket keep the test process alive after the run.
      server.unref();
      return server;
    })();
  }
  await _serverPromise;
  return BASE;
}

// Shared fake Resend instance (same module the server uses, since tests run in-process).
// NOTE: imported dynamically, AFTER the env above is set, so config.mjs reads TEST_MODE,
// the test PORT, DB_PATH, etc. (A static `export ... from` would evaluate the import — and
// therefore config.mjs — before the top-level env assignments run.)
const { resend } = await import('../src/resend.mjs');
export { resend };

// ---- Svix signature helper (mirrors src/resend.mjs verifyWebhookSignature) ----
// Produces the svix-signature header value: "v1,<base64 HMAC-SHA256 of `${id}.${ts}.${payload}`>"
// using the base64-decoded webhook key.
export function signWebhook(secret, svixId, timestamp, payloadString) {
  const key = Buffer.from(String(secret).replace(/^whsec_/, ''), 'base64');
  const signed = `${svixId}.${timestamp}.${payloadString}`;
  const sig = createHmac('sha256', key).update(signed).digest('base64');
  return `v1,${sig}`;
}

// ---- Cookie-keeping HTTP client ----
// Returns { get, post, patch, del }. Each returns { status, body }.
// Sends JSON, sets X-Requested-With: fetch, captures & resends the bm_session cookie.
export function makeClient(base = null) {
  let cookie = null; // "bm_session=<token>"

  function captureCookie(res) {
    // Node's fetch exposes Set-Cookie via getSetCookie().
    const setCookies = typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
    for (const sc of setCookies) {
      const m = /^bm_session=([^;]*)/.exec(sc);
      if (m) {
        if (m[1] === '' || /Max-Age=0/i.test(sc)) cookie = null;
        else cookie = 'bm_session=' + m[1];
      }
    }
  }

  async function request(method, path, body, { headers = {}, csrf = true } = {}) {
    const h = { ...headers };
    if (csrf) h['X-Requested-With'] = 'fetch';
    if (cookie) h['Cookie'] = cookie;
    let payload;
    if (body !== undefined) {
      h['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    const res = await fetch((base || BASE) + path, { method, headers: h, body: payload });
    captureCookie(res);
    const text = await res.text();
    let parsed;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
    return { status: res.status, body: parsed };
  }

  return {
    get: (path, opts) => request('GET', path, undefined, opts),
    post: (path, body, opts) => request('POST', path, body ?? {}, opts),
    patch: (path, body, opts) => request('PATCH', path, body ?? {}, opts),
    del: (path, body, opts) => request('DELETE', path, body, opts),
    // expose cookie state for assertions
    get cookie() { return cookie; },
  };
}

let _setupCounter = 0;

// POST /api/auth/setup for the very first run; afterwards create users as admin and log
// the provided client in. Returns the authenticated user object.
// The first caller performs real setup (admin@businessmail.ztddevs.com). Because the DB
// is shared across the in-process server, only one setup can succeed; later callers that
// pass a fresh client will fall back to logging in the admin.
export async function setupAndLogin(client, opts = {}) {
  const admin = {
    orgName: opts.orgName || 'Acme Inc',
    name: opts.name || 'Admin User',
    email: opts.email || 'admin@businessmail.ztddevs.com',
    password: opts.password || 'correct-horse-battery',
  };

  const state = await client.get('/api/auth/state');
  if (state.body && state.body.needsSetup) {
    const res = await client.post('/api/auth/setup', admin);
    if (res.status !== 200) throw new Error('setup failed: ' + JSON.stringify(res.body));
    return res.body.user;
  }
  // Already set up: log the admin in on this client.
  const login = await client.post('/api/auth/login', { email: admin.email, password: admin.password });
  if (login.status !== 200 || !login.body.user) {
    throw new Error('admin login failed: ' + JSON.stringify(login.body));
  }
  return login.body.user;
}

// Generate a unique-ish email for created users so tests remain independent.
export function uniqueEmail(local = 'user') {
  _setupCounter += 1;
  return `${local}${_setupCounter}-${process.pid}@businessmail.ztddevs.com`;
}
