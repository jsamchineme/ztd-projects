// Design preview for Studio. / is the redesign mock-up (mockup/). The app's own addresses (/p/…, /login…) run Studio's
// real front end (../public) against a fake API (mock.mjs), recoloured by ztd/app.css. /options compares six styles.
// /emails/ shows every email Studio sends (lib/emails.mjs), with sample data, in light and dark.
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
// The email gallery. Templates are re-imported on every request so edits show on reload.
async function emails(res, path, url){
  const { templates, samples, LIVE, esc } = await import(`../lib/emails.mjs?v=${Date.now()}`);
  const name = path.slice('/emails/'.length).replace(/\/$/, '');
  const send = (type, body) => { res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); };
  if (name){
    if (!templates[name]) { res.writeHead(404); return res.end('No such email'); }
    const mail = templates[name](samples[name]);
    if (url.searchParams.get('format') === 'text') return send('text/plain; charset=utf-8', `Subject: ${mail.subject}\n\n${mail.text}`);
    let html = mail.html.replace(/cid:logo/g, '/icon.svg');
    // Email clients follow the reader's setting; here ?theme= forces one so both can sit side by side.
    if (url.searchParams.get('theme') === 'dark') html = html.replace('@media (prefers-color-scheme: dark)', '@media all');
    if (url.searchParams.get('theme') === 'light') html = html.replace('@media (prefers-color-scheme: dark)', '@media not all');
    return send(TYPES['.html'], html);
  }
  const card = n => {
    const mail = templates[n](samples[n]);
    return `<section id="${n}"><header><h2>${esc(mail.subject)}</h2><span class="tag ${LIVE.includes(n) ? 'live' : ''}">${LIVE.includes(n) ? 'Sent today' : 'Ready, not sent yet'}</span>
      <a href="/emails/${n}?theme=light" target="_blank">Open</a> <a href="/emails/${n}?format=text" target="_blank">Plain text</a></header>
      <div class="pair"><figure><figcaption>Light</figcaption><iframe src="/emails/${n}?theme=light" loading="lazy"></iframe></figure>
      <figure><figcaption>Dark</figcaption><iframe src="/emails/${n}?theme=dark" loading="lazy"></iframe></figure>
      <figure class="phone"><figcaption>Phone</figcaption><iframe src="/emails/${n}?theme=light" loading="lazy"></iframe></figure></div></section>`;
  };
  send(TYPES['.html'], `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Studio emails</title>
<style>
  body { margin:0; font:15px/1.5 system-ui, sans-serif; background:#f1f0eb; color:#111; }
  .top { position:sticky; top:0; z-index:1; background:#00427c; color:#fff; padding:14px 24px; display:flex; gap:16px; align-items:center; flex-wrap:wrap; }
  .top b { font-size:17px; } .top a { color:#fff; opacity:.85; font-size:13px; } .top nav { display:flex; gap:12px; flex-wrap:wrap; }
  main { padding:24px; max-width:1500px; margin:0 auto; }
  section { margin:0 0 40px; } header { display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin:0 0 12px; }
  h2 { font:600 18px/1.3 Georgia, serif; margin:0; } header a { color:#00427c; font-size:13px; }
  .tag { font-size:12px; padding:2px 8px; border-radius:99px; background:#fff4d9; color:#8a5b00; } .tag.live { background:#e4f2e9; color:#2f7d4f; }
  .pair { display:flex; gap:16px; overflow-x:auto; } figure { margin:0; flex:0 0 auto; }
  figcaption { font-size:12px; color:#5f6368; margin:0 0 4px; }
  iframe { width:640px; height:760px; border:1px solid #e4e3dc; border-radius:10px; background:#fff; } .phone iframe { width:375px; }
</style></head><body>
<div class="top"><b>Studio emails</b><nav>${Object.keys(templates).map(n => `<a href="#${n}">${n}</a>`).join('')}</nav><a href="/" style="margin-left:auto">← Mock-up</a></div>
<main>${Object.keys(templates).map(card).join('')}</main></body></html>`);
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
    if (path === '/emails' || path.startsWith('/emails/')) return emails(res, path === '/emails' ? '/emails/' : path, url);
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
