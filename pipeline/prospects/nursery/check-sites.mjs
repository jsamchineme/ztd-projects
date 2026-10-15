#!/usr/bin/env node
// Visits each nursery's website (confirmed `website`, else the email-domain guess) in Chrome at desktop
// and phone width, saves screenshots to shots/ and writes what it finds into data/*.json as `site`.
// A guess only becomes `website` when the page loads and mentions the nursery.
// Usage: node prospects/nursery/check-sites.mjs [--only n001-01,n002-03] [--redo] [--retry-failed] [--workers 6]
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const PIPELINE = join(HERE, '..', '..', 'pipeline');
const pw = await import(pathToFileURL(createRequire(join(PIPELINE, 'package.json')).resolve('playwright-core')).href);
const chromium = pw.chromium || pw.default.chromium;
const { CHROME } = await import(pathToFileURL(join(PIPELINE, 'audit.mjs')).href);

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const only = flag('--only')?.split(',');
const redo = args.includes('--redo');
const retry = args.includes('--retry-failed');
const WORKERS = Number(flag('--workers') || 6);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const DATA = join(HERE, 'data'), SHOTS = join(HERE, 'shots');
mkdirSync(SHOTS, { recursive: true });

const pages = readdirSync(DATA).filter(f => f.endsWith('.json')).sort()
  .map(f => ({ f, recs: JSON.parse(readFileSync(join(DATA, f), 'utf8')) }));
// Re-read the file and change only what this script owns, so other edits to the list survive.
const OWN = ['site', 'shot', 'shotPhone', 'website'];
const save = p => {
  const mine = new Map(p.recs.map(r => [r.id, r]));
  const fresh = JSON.parse(readFileSync(join(DATA, p.f), 'utf8'));
  for (const r of fresh) for (const k of OWN) if (mine.get(r.id)?.[k] !== undefined) r[k] = mine.get(r.id)[k];
  writeFileSync(join(DATA, p.f), JSON.stringify(fresh, null, 1) + '\n');
};
const queue = pages.flatMap(p => p.recs.map(r => ({ p, r })))
  .filter(({ r }) => (r.website || r.websiteGuess) && (only ? only.includes(r.id) : redo || !r.site || retry && r.site.loads === false));

// Words that identify the nursery on its own page ("Little Acorns Childcare" -> little, acorns).
const STOP = new Set(['nursery', 'nurseries', 'childcare', 'children', 'childrens', "children's", 'the', 'and', 'ltd', 'limited', 'school', 'early', 'years', 'learning', 'centre', 'center', 'day', 'care', 'kindergarten', 'playgroup', 'family', 'of', 'at', 'club', 'pre', 'preschool']);
const nameWords = n => n.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).map(w => w.replace(/'s$/, '')).filter(w => w.length > 2 && !STOP.has(w));

const BUILDERS = [
  ['Wix', /static\.wixstatic\.com|wix\.com/i], ['Squarespace', /squarespace/i], ['GoDaddy', /godaddy|img1\.wsimg\.com/i],
  ['Weebly', /weebly/i], ['Jimdo', /jimdo/i], ['Webflow', /webflow/i], ['Duda', /dudaone|multiscreensite/i],
  ['Yell', /yellsites|yell\.com/i], ['Shopify', /cdn\.shopify/i], ['Moonfruit', /moonfruit/i], ['Mr Site', /mrsite/i],
  ['1&1 IONOS', /ionos|1and1|homepagedesigner/i], ['Google Sites', /sites\.google/i], ['WordPress', /wp-content|wp-includes/i]
];

async function visit(browser, url, width, height, shot){
  const ctx = await browser.newContext({ viewport: { width, height }, userAgent: UA, isMobile: width < 500, hasTouch: width < 500, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  let errors = 0, refused = 0;
  page.on('pageerror', () => errors++);
  page.on('requestfailed', () => refused++);
  const t0 = Date.now();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const loadS = Math.round((Date.now() - t0) / 100) / 10;
    await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      const text = document.body?.innerText || '';
      const years = [...text.matchAll(/(?:©|&copy;|copyright)\s*(?:[^\d\n]{0,40})?((?:19|20)\d\d)(?:\s*[-–]\s*((?:19|20)\d\d))?/gi)].flatMap(m => [m[1], m[2]]).filter(Boolean).map(Number);
      const tel = document.querySelector('a[href^="tel:"]');
      const gen = document.querySelector('meta[name="generator"]')?.content || '';
      return {
        title: document.title.trim().slice(0, 160), html: html.slice(0, 400000) + gen, text: text.slice(0, 20000), textLength: text.length,
        copyrightYear: years.length ? Math.max(...years) : null,
        telLink: !!tel, phone: tel ? decodeURIComponent(tel.getAttribute('href').slice(4)).trim() : null,
        viewportMeta: !!document.querySelector('meta[name="viewport"]'),
        overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        forms: document.querySelectorAll('form').length,
        images: document.images.length
      };
    });
    await page.screenshot({ path: shot, type: 'jpeg', quality: 60 }).catch(() => {});
    return { ok: true, status: res?.status() ?? null, finalUrl: page.url(), loadS, errors, refused, ...info };
  } catch (e) {
    return { ok: false, error: e.message.split('\n')[0].slice(0, 160) };
  } finally { await ctx.close(); }
}

async function check(browser, { p, r }){
  const url = r.website || r.websiteGuess;
  const d = await visit(browser, url, 1280, 800, join(SHOTS, `${r.id}-desktop.jpg`));
  if (!d.ok){
    r.site = { url, checked: new Date().toISOString(), loads: false, error: d.error };
    return `${r.id} ${url} — doesn't load (${d.error})`;
  }
  const m = await visit(browser, d.finalUrl, 390, 844, join(SHOTS, `${r.id}-phone.jpg`));
  const words = nameWords(r.name);
  const hay = (d.title + ' ' + d.text + ' ' + d.finalUrl).toLowerCase();
  const matched = words.filter(w => hay.includes(w));
  const matchesName = words.length ? matched.length >= Math.min(2, words.length) : /nursery|childcare|playgroup|kindergarten/.test(hay);
  const parked = /domain (is )?for sale|buy this domain|parked|coming soon|under construction|account suspended|default web site page|it works!/i.test(d.title + ' ' + d.text.slice(0, 2000)) || d.textLength < 80;
  const text = d.text.toLowerCase();
  r.site = {
    url, checked: new Date().toISOString(), loads: true, status: d.status, finalUrl: d.finalUrl, title: d.title,
    matchesName, parked,
    builder: BUILDERS.find(([, re]) => re.test(d.html))?.[0] || null,
    copyrightYear: d.copyrightYear, telLink: d.telLink || !!m.telLink, phone: d.phone || m.phone || null,
    viewportMeta: d.viewportMeta, textLength: d.textLength,
    mentions: {
      fundedHours: /1140|1,140|funded (hours|place|entitlement)|partner provider|elc funding/.test(text),
      careInspectorate: /care inspectorate/.test(text),
      fees: /fees|£\s?\d/.test(text),
      visit: /book (a )?(visit|viewing|tour|show ?round)|arrange (a )?(visit|viewing)|come and (see|visit)/.test(text),
      waitingList: /waiting list|register (your )?interest|enrol|apply for a place|registration form/.test(text)
    },
    forms: d.forms, images: d.images,
    desktopLoadS: d.loadS, desktopErrors: d.errors, desktopRefused: d.refused,
    mobileLoadS: m.ok ? m.loadS : null, mobileOverflowPx: m.ok ? m.overflowPx : null, mobileErrors: m.ok ? m.errors : null
  };
  r.shot = `shots/${r.id}-desktop.jpg`; r.shotPhone = m.ok ? `shots/${r.id}-phone.jpg` : null;
  if (!r.website && matchesName && !parked) r.website = d.finalUrl;
  return `${r.id} ${url} — ${r.website ? 'ok' : parked ? 'parked' : 'not this nursery?'}${r.site.builder ? ` (${r.site.builder})` : ''}`;
}

const browser = await chromium.launch({ executablePath: CHROME });
let done = 0;
const dirty = new Set();
await Promise.all(Array.from({ length: WORKERS }, async () => {
  while (queue.length){
    const job = queue.shift();
    const line = await check(browser, job).catch(e => `${job.r.id} failed: ${e.message}`);
    dirty.add(job.p);
    console.log(`[${++done}] ${line}`);
    if (done % 20 === 0) for (const p of dirty) save(p);
  }
}));
for (const p of dirty) save(p);
await browser.close();
