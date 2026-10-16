// Design preview for Studio. / is the redesign mock-up (mockup/). The app's own addresses (/p/…, /login…) run Studio's
// real front end (../public) against a fake API (mock.mjs), recoloured by ztd/app.css. /options compares six styles.
// Studio sets PORT. Nothing here talks to the real Studio or its data.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { handleApi, reset } from './mock.mjs';

const PORT = Number(process.env.PORT || 4400);
const HERE = import.meta.dirname;
const STUDIO = join(HERE, '..', 'public');   // the real front end, read fresh on every request
const ZTD = join(HERE, 'ztd');                // the new look: app.css, icon.svg, fonts/, preview.js
const OPTIONS = join(HERE, 'public');
const MOCKUP = join(HERE, 'mockup');          // the full redesign, hand-built screens; served at /
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };

const inside = (root, path) => { const f = join(root, normalize(path).replace(/^(\.\.[/\\])+/, '')); return f.startsWith(root) ? f : null; };
async function file(res, path, type){
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': type || TYPES[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
    return true;
  } catch { return false; }
}
// Studio's index.html, plus the preview menu and the saved light/dark choice (applied before the page paints).
async function appPage(res){
  const html = (await readFile(join(STUDIO, 'index.html'), 'utf8')).replace('</head>',
    `<script>try{var t=localStorage.getItem('pv.theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>\n` +
    `<link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>\n` +
    `<script type="module" src="/__preview/preview.js"></script>\n</head>`);
  res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' });
  res.end(html);
}
const cookiesOf = req => Object.fromEntries(String(req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(([k, v]) => k && v));

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = decodeURIComponent(url.pathname);
  try {
    if (path.startsWith('/api/')) return handleApi(req, res, url, cookiesOf(req));
    if (path === '/__preview/reset' && req.method === 'POST'){ reset(); res.writeHead(200, { 'Set-Cookie': ['pv_out=; Max-Age=0; Path=/', 'pv_mfa=; Max-Age=0; Path=/'] }); return res.end('{}'); }
    if (path === '/' || path === '/mockup' || path === '/mockup/') return file(res, join(MOCKUP, 'index.html'));
    if (path.startsWith('/mockup/')){ const f = inside(MOCKUP, path.slice('/mockup/'.length)); if (f && await file(res, f)) return; }
    if (path === '/options' || path === '/options/') return file(res, join(OPTIONS, 'index.html'));
    if (path.startsWith('/__preview/')){ const f = inside(ZTD, path.slice('/__preview/'.length)); if (f && await file(res, f)) return; }
    if (path === '/app.css') return file(res, join(ZTD, 'app.css'));
    if (path === '/icon.svg') return file(res, join(ZTD, 'icon.svg'));
    if (path.startsWith('/fonts/')){ const f = inside(join(ZTD, 'fonts'), path.slice('/fonts/'.length)); if (f && await file(res, f)) return; }
    if (extname(path) && path !== '/index.html'){ const f = inside(STUDIO, path); if (f && await file(res, f)) return; res.writeHead(404); return res.end('Not found'); }
    return appPage(res);   // every app route (/, /p/…, /login, /account…) is Studio's single page
  } catch (e){
    console.error(e);
    if (!res.headersSent){ res.writeHead(500); res.end('Preview error'); }
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Studio design preview on ${PORT}`));
