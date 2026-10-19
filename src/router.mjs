// Tiny dependency-free router for node:http with path params, JSON helpers, cookies, auth ctx.
import { config } from './config.mjs';

export function createRouter() {
  const routes = []; // {method, parts, handler}
  const add = (method, path, handler) => {
    routes.push({ method, parts: path.split('/').filter(Boolean), handler, path });
  };
  const router = {
    get: (p, h) => add('GET', p, h),
    post: (p, h) => add('POST', p, h),
    patch: (p, h) => add('PATCH', p, h),
    put: (p, h) => add('PUT', p, h),
    del: (p, h) => add('DELETE', p, h),
    routes,
  };

  function match(method, pathname) {
    const segs = pathname.split('/').filter(Boolean);
    for (const r of routes) {
      if (r.method !== method) continue;
      if (r.parts.length !== segs.length) continue;
      const params = {};
      let ok = true;
      for (let i = 0; i < r.parts.length; i++) {
        const p = r.parts[i];
        if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(segs[i]);
        else if (p !== segs[i]) { ok = false; break; }
      }
      if (ok) return { handler: r.handler, params };
    }
    return null;
  }

  return { router, match };
}

export function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export async function readBody(req, limit = 25 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw { status: 413, message: 'Payload too large' };
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

// Build the ctx object used by handlers.
export function makeCtx({ req, res, params, query, body, rawBody, cookies }) {
  const ctx = {
    req, res, params, query, body: body || {}, rawBody, cookies,
    user: null, session: null,
    json(status, obj) {
      const s = JSON.stringify(obj ?? null);
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(s);
    },
    text(status, str) {
      res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(str);
    },
    setCookie(name, val, opts = {}) {
      const parts = [`${name}=${encodeURIComponent(val)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
      if (config.cookieSecure) parts.push('Secure');
      if (opts.maxAgeSec) parts.push(`Max-Age=${opts.maxAgeSec}`);
      appendSetCookie(res, parts.join('; '));
    },
    clearCookie(name) {
      appendSetCookie(res, `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    },
    requireAuth() { if (!ctx.user) throw { status: 401, message: 'Not authenticated' }; return ctx.user; },
    requireAdmin() {
      ctx.requireAuth();
      if (ctx.user.role !== 'admin') throw { status: 403, message: 'Admin only' };
      return ctx.user;
    },
  };
  return ctx;
}

function appendSetCookie(res, cookie) {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) res.setHeader('Set-Cookie', [cookie]);
  else res.setHeader('Set-Cookie', [].concat(existing, cookie));
}
