#!/usr/bin/env node
// Takes a thumbnail of each template's worked example (top of the page at desktop width) for the board's template picker.
// Writes templates/<group>/<name>/thumb.jpg. Re-run after changing a template.
// Usage: node pipeline/template-thumbs.mjs [folder ...]   (e.g. nursery/make-waves, or a group like nursery; none: every template)
import http from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { CHROME } from './audit.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), 'templates');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

// A tiny static server, so fonts and relative paths load exactly as they do on the board.
const server = http.createServer(async (req, res) => {
  let file = resolve(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname.slice(1)));
  if (!file.startsWith(ROOT + sep)) { res.writeHead(403); return res.end(); }
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ executablePath: CHROME });
try {
  const only = process.argv.slice(2).map(d => d.replace(/^(pipeline\/)?templates\//, '').replace(/\/+$/, ''));
  // Templates sit in group folders (practice/, nursery/); a template is any folder with example/index.html.
  const dirs = [];
  for (const group of (await readdir(ROOT, { withFileTypes: true })).filter(d => d.isDirectory()))
    for (const t of await readdir(join(ROOT, group.name), { withFileTypes: true }))
      if (t.isDirectory()) dirs.push(`${group.name}/${t.name}`);
  for (const dir of dirs.sort().filter(d => !only.length || only.some(o => d === o || d.startsWith(o + '/')))){
    try { await stat(join(ROOT, dir, 'example', 'index.html')); } catch { continue; }
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.5 });
    await page.goto(`${base}/${dir}/example/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(ROOT, dir, 'thumb.jpg'), type: 'jpeg', quality: 72 });
    await page.close();
    console.log(`${dir}/thumb.jpg`);
  }
} finally { await browser.close(); server.close(); }
