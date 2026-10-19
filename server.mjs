import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { config, TEST_MODE } from './src/config.mjs';
import { db } from './src/db.mjs';
import { createRouter, makeCtx, parseCookies, readBody } from './src/router.mjs';
import { store } from './src/store.mjs';
import { accounts } from './src/accounts.mjs';
import { resend } from './src/resend.mjs';
import * as util from './src/util.mjs';

import { register as registerAuth } from './src/feature/auth.mjs';
import { register as registerMail } from './src/feature/mail.mjs';
import { register as registerInbound } from './src/feature/inbound.mjs';
import { register as registerAdmin } from './src/feature/admin.mjs';
import { register as registerSettings } from './src/feature/settings.mjs';

const PUBLIC = new URL('./public', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const { router, match } = createRouter();
const deps = { config, db, store, accounts, resend, util };
registerAuth(router, deps);
registerMail(router, deps);
registerInbound(router, deps);
registerAdmin(router, deps);
registerSettings(router, deps);

async function serveStatic(req, res, pathname) {
  let rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  let file = join(PUBLIC, rel.endsWith('/') ? rel + 'index.html' : rel);
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    // SPA fallback: serve index.html for unknown non-asset routes
    if (!extname(file)) {
      try {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(await readFile(join(PUBLIC, 'index.html')));
      } catch { /* fall through */ }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const pathname = url.pathname;

  if (!pathname.startsWith('/api/')) return serveStatic(req, res, pathname);

  try {
    const m = match(req.method, pathname);
    if (!m) { res.writeHead(404, { 'Content-Type': 'application/json' }); return res.end('{"error":"Not found"}'); }

    const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const rawBody = mutating ? await readBody(req) : Buffer.alloc(0);
    const isWebhook = pathname.startsWith('/api/webhooks/');
    let body = {};
    if (rawBody.length && !isWebhook) body = util.json.parse(rawBody.toString('utf8'), {}) || {};

    // CSRF: mutating same-origin API calls must carry the fetch header (webhooks exempt).
    if (!isWebhook && mutating && req.headers['x-requested-with'] !== 'fetch') {
      throw { status: 403, message: 'Bad request origin' };
    }

    const query = Object.fromEntries(url.searchParams.entries());
    const cookies = parseCookies(req);
    const ctx = makeCtx({ req, res, params: m.params, query, body, rawBody, cookies });

    const sess = accounts.getSession(cookies.bm_session);
    if (sess) { ctx.user = sess.user; ctx.session = sess.session; }

    await m.handler(ctx);
    if (!res.writableEnded) { res.writeHead(204); res.end(); }
  } catch (err) {
    const status = err?.status || 500;
    if (status >= 500) console.error('API error:', err);
    if (!res.writableEnded) {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Server error' }));
    }
  }
});

server.listen(config.port, '127.0.0.1', () => {
  console.log(`Businessmail listening on ${config.port}  (TEST_MODE=${TEST_MODE})`);
});

export { server };
