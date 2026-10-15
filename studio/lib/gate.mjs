// Project subdomains (pipeline.<domain> and so on) all reach Studio, which checks the visitor is signed in,
// has MFA and belongs to the project's team, then proxies to the project's port.
// Each subdomain gets its own host-only cookie through a one-time hand-off from Studio, so Studio's
// session cookie is never sent to project code.
import http from 'node:http';
import net from 'node:net';
import { db, now } from './db.mjs';
import { randomId, sign, unsign } from './crypto.mjs';
import { serviceBySubdomain } from './projects.mjs';
import { DOMAIN, STUDIO_URL, SECURE } from './config.mjs';

const COOKIE = SECURE ? '__Host-studio_gate' : 'studio_gate';
const WEEK = 60 * 60 * 24 * 7;
// Sandboxed pages (pipeline previews and templates) have an opaque origin, so the browser treats their stylesheet,
// script, font and image requests as cross-site and never sends the SameSite=Lax cookie (private windows and Safari
// block every cross-site cookie anyway). So a signed-in navigation to a sandboxed page is sent on to
// /__studio_res/<token>/<path>: its relative links then carry the token instead of a cookie. The token is tied to the
// session and host, expires, and only reads files: GET and HEAD, never /api/.
const RES_PREFIX = '/__studio_res/';
const RES_TTL = 12 * 60 * 60 * 1000;
const resToken = (sid, host) => sign(Buffer.from(`${sid}|${host}|${Date.now() + RES_TTL}`).toString('base64url'));
function readResToken(token, host){
  const v = unsign(token);
  const [sid, h, exp] = v ? Buffer.from(v, 'base64url').toString().split('|') : [];
  return sid && h === host && Number(exp) > Date.now() ? sid : null;
}
const isNavigation = req => ['document', 'iframe', 'frame'].includes(req.headers['sec-fetch-dest'])
  || (!req.headers['sec-fetch-dest'] && /text\/html/.test(req.headers.accept || ''));
const isSandboxed = csp => /(^|;)\s*sandbox\b/.test(String(csp || '')) && !/allow-same-origin/.test(String(csp));
const cache = new Map(); // `${sessionId}|${orgId}` -> { ok, until, user }

export function subdomainOf(host){
  const h = String(host || '').toLowerCase().replace(/:\d+$/, '');
  const suffix = '.' + DOMAIN;
  if (!h.endsWith(suffix)) return null;
  const sub = h.slice(0, -suffix.length);
  return /^[a-z0-9-]+$/.test(sub) ? sub : null;
}

export function canAccessOrg(userId, role, orgId){
  if (role === 'admin') return true;
  return !!db.prepare('SELECT 1 FROM member WHERE userId = ? AND organizationId = ?').get(userId, orgId);
}

function sessionAccess(sessionId, orgId){
  const key = `${sessionId}|${orgId}`;
  const c = cache.get(key);
  if (c && c.until > Date.now()) return c;
  const row = db.prepare(`SELECT s.userId, s.expiresAt, u.role, u.twoFactorEnabled, u.banned, u.name, u.email
    FROM session s JOIN user u ON u.id = s.userId WHERE s.id = ?`).get(sessionId);
  const expires = row && (typeof row.expiresAt === 'number' ? row.expiresAt : Date.parse(row.expiresAt));
  const ok = !!row && expires > Date.now() && row.twoFactorEnabled && !row.banned && canAccessOrg(row.userId, row.role, orgId);
  const v = { ok, until: Date.now() + 20000, user: row ? { id: row.userId, name: row.name, email: row.email } : null };
  cache.set(key, v);
  if (cache.size > 5000) cache.clear();
  return v;
}

function cookies(header){
  const out = {};
  for (const part of String(header || '').split(';')){
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function stripGateCookie(header){
  return String(header || '').split(';').map(s => s.trim()).filter(s => s && !s.startsWith(COOKIE + '=') && !/^(__Secure-|__Host-)?studio\./.test(s)).join('; ');
}

// Called on Studio: /api/gate?host=…&next=… once the user is signed in there.
export function issueGateToken(session, host, next){
  const token = randomId(24);
  db.prepare('DELETE FROM gate_token WHERE expiresAt < ?').run(now());
  db.prepare('INSERT INTO gate_token (token, sessionToken, host, next, expiresAt) VALUES (?,?,?,?,?)')
    .run(token, session.id, host, next, now() + 60000);
  return `${SECURE ? 'https' : 'http'}://${host}/__studio_gate?t=${token}`;
}

function redirect(res, url){ res.writeHead(302, { Location: url, 'Cache-Control': 'no-store' }); res.end(); }
function page(res, status, title, body){
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<body style="font:16px/1.5 system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 16px;color:#222"><h1 style="font-size:1.4rem">${title}</h1><p>${body}</p>
<p><a href="${STUDIO_URL}">Go to Studio</a></p></body>`);
}

export function handleProjectRequest(req, res, sub){
  const svc = serviceBySubdomain(sub);
  const host = String(req.headers.host || `${sub}.${DOMAIN}`).toLowerCase();   // keeps a port, for local testing
  if (!svc) return page(res, 404, 'Nothing here yet', `No project uses ${host}.`);
  const url = new URL(req.url, `http://${host}`);

  if (url.pathname === '/__studio_gate'){
    const t = url.searchParams.get('t') || '';
    const row = db.prepare('SELECT * FROM gate_token WHERE token = ?').get(t);
    if (row) db.prepare('DELETE FROM gate_token WHERE token = ?').run(t);
    if (!row || row.expiresAt < now() || row.host !== host) return redirect(res, `${STUDIO_URL}/api/gate?host=${encodeURIComponent(host)}&next=/`);
    const next = row.next.startsWith('/') && !row.next.startsWith('//') ? row.next : '/';
    res.writeHead(302, {
      Location: next, 'Cache-Control': 'no-store',
      'Set-Cookie': `${COOKIE}=${encodeURIComponent(sign(row.sessionToken))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${WEEK}${SECURE ? '; Secure' : ''}`
    });
    return res.end();
  }

  // Files for a sandboxed page, authorised by the token in the path rather than the cookie.
  if (url.pathname.startsWith(RES_PREFIX)){
    const [token, ...path] = url.pathname.slice(RES_PREFIX.length).split('/');
    const inner = '/' + path.join('/');
    if (req.method !== 'GET' && req.method !== 'HEAD') return page(res, 405, 'Not allowed', 'This address only shows files.');
    if (/^\/api\//.test(inner)) return page(res, 403, 'Not allowed', 'This address only shows files.');
    const sid = readResToken(token, host);
    const a = sid && sessionAccess(sid, svc.organizationId);
    if (!a || !a.ok){
      // An expired link to a page goes back through the normal sign-in check, which issues a fresh token.
      if (isNavigation(req)) return redirect(res, inner + url.search);
      res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'Sign in to Studio first' }));
    }
    req.url = inner + url.search;
    return proxy(req, res, svc, host, a.user, RES_PREFIX + token);
  }

  let user = null, sid = null;
  if (!svc.publicAccess){
    sid = unsign(cookies(req.headers.cookie)[COOKIE]);
    const a = sid && sessionAccess(sid, svc.organizationId);
    if (!a || !a.ok){
      if (req.method !== 'GET' || /^\/api\//.test(url.pathname) || req.headers.accept === 'text/event-stream'){
        res.writeHead(401, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'Sign in to Studio first' }));
      }
      return redirect(res, `${STUDIO_URL}/api/gate?host=${encodeURIComponent(host)}&next=${encodeURIComponent(url.pathname + url.search)}`);
    }
    user = a.user;
  }
  proxy(req, res, svc, host, user, null, sid && req.method === 'GET' && isNavigation(req) ? sid : null);
}

function upstreamHeaders(req, svc, host, user){
  const h = { ...req.headers };
  h.host = `localhost:${svc.port}`;
  // The project checks Origin against its own host; translate our public origin to the one it expects.
  const pub = `${SECURE ? 'https' : 'http'}://${host}`;
  if (h.origin === pub) h.origin = `http://localhost:${svc.port}`;
  if (h.referer?.startsWith(pub)) h.referer = `http://localhost:${svc.port}` + h.referer.slice(pub.length);
  const c = stripGateCookie(h.cookie); if (c) h.cookie = c; else delete h.cookie;
  delete h['x-studio-user']; delete h['x-studio-email'];
  if (user){ h['x-studio-user'] = encodeURIComponent(user.name || ''); h['x-studio-email'] = user.email || ''; }
  h['x-forwarded-host'] = host;
  h['x-forwarded-proto'] = SECURE ? 'https' : 'http';
  return h;
}

// Project code isn't trusted: it may only set cookies for its own host. A Domain= cookie would reach studio.<domain>
// and every other project, and could shadow Studio's session cookie. Studio's and the gate's cookie names are refused.
function safeCookies(list){
  return [].concat(list)
    .filter(c => { const name = String(c).split('=')[0].trim(); return name !== COOKIE && !/^(__Secure-|__Host-)?studio\./.test(name); })
    .map(c => String(c).replace(/;\s*domain\s*=[^;]*/gi, ''));
}

// resBase: the /__studio_res/<token> prefix this request came through, if any.
// navSid: set on a signed-in page navigation, so a sandboxed page can be moved under a token prefix.
function proxy(req, res, svc, host, user, resBase = null, navSid = null){
  const up = http.request({ host: '127.0.0.1', port: svc.port, method: req.method, path: req.url, headers: upstreamHeaders(req, svc, host, user) }, r => {
    if (navSid && r.statusCode === 200 && isSandboxed(r.headers['content-security-policy'])){
      r.resume();
      return redirect(res, RES_PREFIX + resToken(navSid, host) + req.url);
    }
    const headers = { ...r.headers };
    if (headers['set-cookie']) headers['set-cookie'] = safeCookies(headers['set-cookie']);
    if (headers.location) headers.location = headers.location.replace(new RegExp(`^https?://(localhost|127\\.0\\.0\\.1|\\[::1\\]):${svc.port}`), `${SECURE ? 'https' : 'http'}://${host}`);
    if (resBase){
      // Keep redirects inside the token prefix, and don't leak the token to other sites through Referer.
      if (headers.location?.startsWith('/') && !headers.location.startsWith('//')) headers.location = resBase + headers.location;
      headers['referrer-policy'] = 'no-referrer';
      delete headers['set-cookie'];
    }
    res.writeHead(r.statusCode, r.statusMessage, headers);
    r.pipe(res);
  });
  up.on('error', () => {
    if (res.headersSent) return res.destroy();
    page(res, 502, 'This project isn’t running', `${host} is stopped or still starting. Start it from Studio, or wait a few seconds and reload.`);
  });
  req.pipe(up);
  res.on('close', () => up.destroy());
}

export function handleProjectUpgrade(req, socket, head, sub){
  const svc = serviceBySubdomain(sub);
  if (!svc) return socket.destroy();
  const host = `${sub}.${DOMAIN}`;
  let user = null;
  if (!svc.publicAccess){
    const sid = unsign(cookies(req.headers.cookie)[COOKIE]);
    const a = sid && sessionAccess(sid, svc.organizationId);
    if (!a?.ok){ socket.end('HTTP/1.1 401 Unauthorized\r\n\r\n'); return; }
    user = a.user;
  }
  const upstream = net.connect(svc.port, '127.0.0.1', () => {
    const h = upstreamHeaders(req, svc, host, user);
    let head1 = `${req.method} ${req.url} HTTP/1.1\r\n`;
    for (const [k, v] of Object.entries(h)) for (const val of [].concat(v)) head1 += `${k}: ${val}\r\n`;
    upstream.write(head1 + '\r\n');
    if (head?.length) upstream.write(head);
    socket.pipe(upstream);
    // The project's handshake reply passes through safeCookies too; the frames after it are piped untouched.
    let buf = Buffer.alloc(0);
    const onData = d => {
      buf = Buffer.concat([buf, d]);
      const end = buf.indexOf('\r\n\r\n');
      if (end < 0){ if (buf.length > 65536) socket.destroy(); return; }
      upstream.off('data', onData);
      const lines = buf.subarray(0, end).toString('latin1').split('\r\n');
      const kept = lines.filter((l, i) => i === 0 || !/^set-cookie:/i.test(l));
      const cookies = safeCookies(lines.filter((l, i) => i > 0 && /^set-cookie:/i.test(l)).map(l => l.slice(l.indexOf(':') + 1).trim()));
      socket.write(Buffer.concat([Buffer.from([...kept, ...cookies.map(c => 'Set-Cookie: ' + c)].join('\r\n') + '\r\n\r\n', 'latin1'), buf.subarray(end + 4)]));
      upstream.pipe(socket);
    };
    upstream.on('data', onData);
  });
  upstream.on('error', () => socket.destroy());
  socket.on('error', () => upstream.destroy());
}
