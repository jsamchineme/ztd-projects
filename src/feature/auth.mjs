// Authentication: setup (first-run), login, logout, me, state, and optional TOTP 2FA.
// See SPEC.md > HTTP API > Auth.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// Return a user object safe to send to the client (never the password hash or totp secret).
function safeUser(u) {
  if (!u) return undefined;
  return { id: u.id, email: u.email, name: u.name, role: u.role, signature: u.signature || '' };
}

// ---- Base32 (RFC 4648, no padding) for TOTP secrets ----
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function base32Encode(buf) {
  let bits = 0, value = 0, out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32_ALPHABET[(value << (5 - bits)) & 31];
  return out;
}
function base32Decode(str) {
  const clean = String(str).toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0, value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

// RFC 4226 HOTP
function hotp(secretBuf, counter) {
  const buf = Buffer.alloc(8);
  // big-endian 64-bit counter
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const hmac = createHmac('sha1', secretBuf).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const bin = ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (bin % 1_000_000).toString().padStart(6, '0');
}

// RFC 6238 TOTP verify (±1 step window, 30s steps).
function verifyTotp(secretBase32, code, { window = 1, step = 30 } = {}) {
  const clean = String(code || '').replace(/\s+/g, '');
  if (!/^\d{6}$/.test(clean)) return false;
  const secretBuf = base32Decode(secretBase32);
  if (!secretBuf.length) return false;
  const counter = Math.floor(Date.now() / 1000 / step);
  const target = Buffer.from(clean);
  for (let w = -window; w <= window; w++) {
    const candidate = Buffer.from(hotp(secretBuf, counter + w));
    if (candidate.length === target.length && timingSafeEqual(candidate, target)) return true;
  }
  return false;
}

function otpauthUrl(secret, { email, issuer = 'Businessmail' }) {
  const label = encodeURIComponent(`${issuer}:${email}`);
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: '6', period: '30' });
  return `otpauth://totp/${label}?${params.toString()}`;
}

export function register(router, deps) {
  const { config, accounts, store, util } = deps;

  const sessionCookieOpts = { maxAgeSec: config.sessionTtlDays * 86400 };

  // GET /api/auth/state — public; drives first-run setup vs login vs app.
  router.get('/api/auth/state', async (ctx) => {
    const needsSetup = accounts.getUserCount() === 0;
    ctx.json(200, {
      needsSetup,
      authed: !!ctx.user,
      user: ctx.user ? safeUser(ctx.user) : undefined,
    });
  });

  // POST /api/auth/setup — only when there are zero users. Creates org + admin, logs in.
  router.post('/api/auth/setup', async (ctx) => {
    if (accounts.getUserCount() !== 0) throw { status: 403, message: 'Setup already completed' };
    const { orgName, name, email, password } = ctx.body || {};
    if (!orgName || !name || !email || !password) {
      throw { status: 400, message: 'orgName, name, email and password are required' };
    }
    const orgId = accounts.createOrg(String(orgName).trim());
    const passwordHash = await util.hashPassword(password);
    const userId = accounts.createUser({
      orgId,
      email: String(email).trim(),
      name: String(name).trim(),
      passwordHash,
      role: 'admin',
    });
    store.ensureSystemLabels(userId);
    accounts.audit(userId, 'auth.setup', { orgId, email });

    const tkn = accounts.createSession(userId, ctx.req.headers['user-agent'] || '', config.sessionTtlDays);
    ctx.setCookie('bm_session', tkn, sessionCookieOpts);
    const user = accounts.getUserById(userId);
    ctx.json(200, { user: safeUser(user) });
  });

  // POST /api/auth/login — password (+ optional TOTP). Sets session cookie.
  router.post('/api/auth/login', async (ctx) => {
    const { email, password, totp } = ctx.body || {};
    const INVALID = { status: 401, message: 'Invalid credentials' };
    if (!email || !password) throw INVALID;

    const user = accounts.getUserByEmail(String(email).trim());
    if (!user || user.status === 'suspended') throw INVALID;

    const ok = await util.verifyPassword(password, user.password_hash);
    if (!ok) throw INVALID;

    // 2FA gate: if enabled, require a valid code. Without a code, tell client to prompt.
    if (user.totp_secret) {
      if (!totp) { ctx.json(200, { need2fa: true }); return; }
      if (!verifyTotp(user.totp_secret, totp)) throw { status: 401, message: 'Invalid 2FA code' };
    }

    const tkn = accounts.createSession(user.id, ctx.req.headers['user-agent'] || '', config.sessionTtlDays);
    ctx.setCookie('bm_session', tkn, sessionCookieOpts);
    accounts.audit(user.id, 'auth.login', { email: user.email });
    ctx.json(200, { user: safeUser(user) });
  });

  // POST /api/auth/logout — destroy session + clear cookie.
  router.post('/api/auth/logout', async (ctx) => {
    if (ctx.session?.id) accounts.deleteSession(ctx.session.id);
    ctx.clearCookie('bm_session');
    ctx.json(200, { ok: true });
  });

  // GET /api/auth/me — current user (auth required).
  router.get('/api/auth/me', async (ctx) => {
    ctx.requireAuth();
    ctx.json(200, { user: safeUser(ctx.user) });
  });

  // ---- Optional 2FA (TOTP) ----

  // POST /api/auth/2fa/enable — generate a secret (not yet persisted until verified).
  router.post('/api/auth/2fa/enable', async (ctx) => {
    const user = ctx.requireAuth();
    const secret = base32Encode(randomBytes(20)); // 160-bit secret
    ctx.json(200, {
      secret,
      otpauth: otpauthUrl(secret, { email: user.email }),
    });
  });

  // POST /api/auth/2fa/verify { secret, code } — confirm and persist the secret.
  router.post('/api/auth/2fa/verify', async (ctx) => {
    const user = ctx.requireAuth();
    const { secret, code } = ctx.body || {};
    if (!secret || !code) throw { status: 400, message: 'secret and code are required' };
    if (!verifyTotp(secret, code)) throw { status: 400, message: 'Invalid 2FA code' };
    accounts.setUserTotp(user.id, secret);
    accounts.audit(user.id, 'auth.2fa.enable', {});
    ctx.json(200, { ok: true });
  });

  // POST /api/auth/2fa/disable { code? } — turn off 2FA (verify current code if set).
  router.post('/api/auth/2fa/disable', async (ctx) => {
    const user = ctx.requireAuth();
    if (user.totp_secret) {
      const { code } = ctx.body || {};
      if (!code || !verifyTotp(user.totp_secret, code)) throw { status: 400, message: 'Invalid 2FA code' };
    }
    accounts.setUserTotp(user.id, null);
    accounts.audit(user.id, 'auth.2fa.disable', {});
    ctx.json(200, { ok: true });
  });
}
