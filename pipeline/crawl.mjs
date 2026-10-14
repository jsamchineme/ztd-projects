#!/usr/bin/env node
// Studies a practice's current public website so a redesign keeps everything worth keeping.
// Crawls the site with Playwright and the installed Chrome (same stack as audit.mjs), following every internal link,
// and writes a content inventory a person or an AI worker can read:
//   SITE.md            navigation tree, page list, contact details, external services, images, documents, gaps
//   site.json          the same, machine-readable
//   pages/NN-slug.md   each page's headings, text, lists, tables and links, in reading order
//   img/               the site's own content images, with img/INDEX.md (page, alt text, size)
//   docs/              PDFs and leaflets linked from the site
//   shots/NN-slug.jpg  a small screenshot of the top of each page
// Usage: node pipeline/crawl.mjs <url> <out dir> [max pages]
import { chromium } from 'playwright-core';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { CHROME } from './audit.mjs';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const DEFAULT_MAX_PAGES = 60;
const MAX_IMAGES = 120, MAX_IMAGE_BYTES = 25e6, MAX_DOCS = 15, MAX_DOC_BYTES = 8e6;
const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|odt|rtf)$/i;
const SKIP_PATH = /\/(wp-json|wp-admin|wp-login|feed|comments\/feed|xmlrpc|cart|checkout|my-account|login|logout|search)(\/|$)|\/author\/|\/tag\/|\/category\/.*\/page\/|\/page\/\d+\/?$|\.(xml|rss|json|txt|css|js|zip|jpe?g|png|gif|webp|svg|ico|mp4|mp3|mov)$/i;
// Blogging-platform chrome and ad links, not the practice's own outside services.
const PLATFORM_HOST = /(^|\.)(wordpress\.com|wp\.me|gravatar\.com|wix\.com|squarespace\.com|godaddy\.com|jimdo\.com|weebly\.com|ionos\.co\.uk|1and1\.co\.uk)$/i;
const PLATFORM_PATH = /facebook\.com\/(ad_center|sharer|dialog|plugins)|twitter\.com\/(intent|share)|pinterest\.[^/]+\/pin\/create|linkedin\.com\/share/i;
const MAX_IMAGES_PER_PAGE = 16;
// Image "attachment" pages (WordPress makes one per photo): a slug that's a uuid or a file name.
const ATTACHMENT = /\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[^/]+-(jpe?g|png|gif|webp))\/?$|[?&]attachment_id=/i;
const SKIP_QUERY = /^(share|replytocom|like_comment|ref|utm_|fbclid|gclid|amp|print|preview|s)$/i;
// Sites whose pages we read but never follow: directories and social networks, not the practice's own site.
const SINGLE_PAGE_HOSTS = /(^|\.)(nhsinform\.scot|nhs\.uk|facebook\.com|instagram\.com|google\.com|business\.site|yell\.com)$/i;
const SERVICES = [
  [/facebook\.com/i, 'Facebook'], [/instagram\.com/i, 'Instagram'], [/(twitter|x)\.com/i, 'X (Twitter)'], [/youtube\.com|youtu\.be/i, 'YouTube'],
  [/linkedin\.com/i, 'LinkedIn'], [/tiktok\.com/i, 'TikTok'], [/google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i, 'Google Maps'],
  [/g\.page|google\.com\/search.*review|search\.google\.com\/local/i, 'Google reviews'],
  [/identportal|dentally|software of excellence|exact|pearl|portal|booking|book|appointment|calendly|setmore|nhsapp|patchs|accurx|engage|klinik|emis|vision|systmonline|myvisiononline/i, 'Booking or patient portal'],
  [/denplan|practiceplan|membership|plan/i, 'Dental plan'], [/nhsinform\.scot|nhs\.uk/i, 'NHS information'],
  [/gdc-uk\.org/i, 'GDC register'], [/careinspectorate|hiscotland|healthcareimprovementscotland/i, 'Regulator'],
];

export async function crawlSite(startUrl, outDir, { maxPages = DEFAULT_MAX_PAGES, chrome = CHROME } = {}){
  if (!chrome) throw new Error('No Chrome or Chromium found to crawl the site');
  await rm(outDir, { recursive: true, force: true });
  for (const d of ['pages', 'img', 'docs', 'shots']) await mkdir(join(outDir, d), { recursive: true });
  const started = Date.now();
  const start = new URL(startUrl);
  const singlePage = SINGLE_PAGE_HOSTS.test(start.hostname);
  const host = start.hostname.replace(/^www\./, '');
  const sameSite = u => { try { return new URL(u).hostname.replace(/^www\./, '') === host; } catch { return false; } };
  const key = u => {
    const x = new URL(u); x.hash = '';
    for (const k of [...x.searchParams.keys()]) if (SKIP_QUERY.test(k)) x.searchParams.delete(k);
    x.pathname = x.pathname.replace(/\/index\.(html?|php|aspx?)$/i, '/').replace(/\/+$/, '') || '/';
    return (x.hostname.replace(/^www\./, '') + x.pathname + x.search).toLowerCase();
  };

  const site = { url: start.href, crawledAt: new Date().toISOString(), singlePage, nav: [], pages: [], images: [], documents: [], contacts: { phones: [], emails: [], addresses: [] }, services: [], skipped: [], errors: [] };
  const browser = await chromium.launch({ executablePath: chrome, args: ['--disable-blink-features=AutomationControlled'] });
  // Use the browser's own user agent minus "Headless": bot checks compare it with the real version the browser reports.
  const probe = await browser.newPage(); const realUA = (await probe.evaluate(() => navigator.userAgent)).replace('HeadlessChrome', 'Chrome'); await probe.close();
  const ctx = await browser.newContext({ userAgent: realUA || UA, viewport: { width: 1280, height: 900 }, ignoreHTTPSErrors: true });
  const disallow = singlePage ? [] : await robots(ctx, start);
  const seen = new Set(), queue = [{ url: start.href, depth: 0, from: null }];
  seen.add(key(start.href));
  const imgSeen = new Map(), docSeen = new Set(), serviceSeen = new Map();
  let imgBytes = 0;

  try {
    while (queue.length && site.pages.length < maxPages){
      const { url, depth, from } = queue.shift();
      if (disallow.some(re => re.test(new URL(url).pathname + new URL(url).search))){ site.skipped.push({ url, why: 'robots.txt asks crawlers not to visit' }); continue; }
      const page = await ctx.newPage();
      let res;
      try { res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); }
      catch (e){ site.errors.push({ url, from, error: e.message.split('\n')[0] }); await page.close(); continue; }
      const status = res?.status() || 0, type = res?.headers()['content-type'] || '';
      if (status >= 400){ site.errors.push({ url, from, error: `HTTP ${status}` }); await page.close(); continue; }
      if (!/html/.test(type)){ await page.close(); continue; }
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      if (/checking your browser|just a moment|verify you are human/i.test(await page.title())){
        await page.waitForFunction(() => !/checking your browser|just a moment|verify you are human/i.test(document.title), null, { timeout: 15000 }).catch(() => {});
        if (/checking your browser|just a moment|verify you are human/i.test(await page.title())){ site.errors.push({ url, from, error: 'blocked by a bot check' }); await page.close(); continue; }
      }
      // Some sites (cookie walls, consent banners) hide content until accepted; read it anyway, and scroll so lazy images load.
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight && y < 20000; y += innerHeight){ scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); }).catch(() => {});
      await page.waitForTimeout(400);
      const finalUrl = page.url();
      if (!sameSite(finalUrl) && site.pages.length){ site.skipped.push({ url, why: `redirects off the site to ${finalUrl}` }); await page.close(); continue; }
      const data = await page.evaluate(extract).catch(e => ({ error: e.message }));
      if (data.error){ site.errors.push({ url, from, error: data.error }); await page.close(); continue; }
      // The same content under two addresses (e.g. /blog/ and /2018/02/06/b/) is read once.
      const sig = data.blocks.map(b => b.text || (b.items || []).join('|')).join('\n');
      const contentSig = sig.length > 200 ? createHash('sha1').update(sig).digest('hex') : null;
      const wordSet = new Set(sig.toLowerCase().match(/[a-z0-9']{3,}/g) || []);
      const similar = (a, b) => { if (!a || !b || a.size < 40 || b.size < 40) return false; let both = 0; for (const w of a) if (b.has(w)) both++; return both / Math.max(a.size, b.size) > 0.92; };
      const dup = contentSig && (site.pages.find(p => p.sig === contentSig) || site.pages.find(p => similar(p.words_, wordSet)));
      if (dup){ site.skipped.push({ url: finalUrl, why: `same content as ${dup.slug}` }); await page.close(); continue; }

      const n = site.pages.length + 1;
      const slug = String(n).padStart(2, '0') + '-' + (new URL(finalUrl).pathname.replace(/\/+$/, '').split('/').pop() || 'home').replace(/\.(html?|php|aspx?)$/i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 50);
      await page.screenshot({ path: join(outDir, 'shots', slug + '.jpg'), type: 'jpeg', quality: 60, clip: { x: 0, y: 0, width: 1280, height: 1600 }, fullPage: true }).catch(() => {});
      if (!site.nav.length && data.nav.length) site.nav = data.nav;

      // images: the site's own content photos and logo
      const pageImages = [];
      let newOnPage = 0;
      for (const im of data.images){
        if (!imgSeen.has(im.src) && newOnPage >= MAX_IMAGES_PER_PAGE){ (site.imagesNotSaved ||= []).push({ src: im.src, page: slug }); continue; }
        if (site.images.length >= MAX_IMAGES || imgBytes >= MAX_IMAGE_BYTES) break;
        const existing = imgSeen.get(im.src);
        if (existing){ existing.pages.includes(slug) || existing.pages.push(slug); pageImages.push(existing.file); continue; }
        try {
          const r = await ctx.request.get(im.src, { timeout: 20000 });
          if (!r.ok()) continue;
          const body = await r.body();
          if (body.length < 3000) continue; // spacers and icons
          const ext = (extname(new URL(im.src).pathname).toLowerCase().match(/^\.(jpe?g|png|webp|gif|avif|svg)$/) || ['.jpg'])[0];
          const file = String(site.images.length + 1).padStart(3, '0') + '-' + createHash('sha1').update(im.src).digest('hex').slice(0, 6) + ext;
          await writeFile(join(outDir, 'img', file), body);
          imgBytes += body.length;
          const rec = { file, src: im.src, alt: im.alt, caption: im.caption, width: im.width, height: im.height, kind: im.kind, bytes: body.length, pages: [slug] };
          site.images.push(rec); imgSeen.set(im.src, rec); pageImages.push(file); newOnPage++;
        } catch {}
      }

      // links: queue internal pages, collect documents and outside services
      for (const l of data.links){
        let u; try { u = new URL(l.href, finalUrl); } catch { continue; }
        if (/^(tel|mailto):/i.test(u.protocol)) continue;
        if (!/^https?:$/.test(u.protocol)) continue;
        if (DOC_EXT.test(u.pathname)){
          if (!docSeen.has(u.href) && site.documents.length < MAX_DOCS){
            docSeen.add(u.href);
            const rec = { url: u.href, text: l.text, page: slug, file: null };
            try {
              const r = await ctx.request.get(u.href, { timeout: 30000 });
              const body = r.ok() ? await r.body() : null;
              if (body && body.length <= MAX_DOC_BYTES){ rec.file = String(site.documents.length + 1).padStart(2, '0') + '-' + (u.pathname.split('/').pop() || 'document').replace(/[^a-z0-9.\-]+/gi, '-').slice(-60); await writeFile(join(outDir, 'docs', rec.file), body); }
            } catch {}
            site.documents.push(rec);
          }
          continue;
        }
        if (sameSite(u.href)){
          if (singlePage) continue;
          const k = key(u.href);
          if (seen.has(k)) continue;
          seen.add(k);
          if (l.imageOnly || ATTACHMENT.test(u.pathname + u.search)){ site.skipped.push({ url: u.href, why: 'image attachment page' }); continue; }
          if (SKIP_PATH.test(u.pathname) || [...u.searchParams.keys()].some(q => /^(p|page_id|s|replytocom)$/i.test(q) && !/^\d+$/.test(u.searchParams.get(q)))){ site.skipped.push({ url: u.href, why: 'not a content page' }); continue; }
          queue.push({ url: u.href, depth: depth + 1, from: slug });
        } else {
          if (PLATFORM_HOST.test(u.hostname) || PLATFORM_PATH.test(u.href)) continue;
          const label = SERVICES.find(([re]) => re.test(u.href))?.[1] || 'Other outside link';
          const k = u.href.replace(/[?#].*$/, '');
          if (!serviceSeen.has(k)) serviceSeen.set(k, { kind: label, url: u.href, text: l.text, pages: [slug] });
          else if (!serviceSeen.get(k).pages.includes(slug)) serviceSeen.get(k).pages.push(slug);
        }
      }
      for (const p of data.phones) if (!site.contacts.phones.some(x => x.value === p.value)) site.contacts.phones.push({ ...p, page: slug });
      for (const e of data.emails) if (!site.contacts.emails.some(x => x.value === e)) site.contacts.emails.push({ value: e, page: slug });
      for (const a of data.postcodes) if (!site.contacts.addresses.some(x => x.value === a)) site.contacts.addresses.push({ value: a, page: slug });

      const words = data.blocks.reduce((n, b) => n + (b.text || '').split(/\s+/).filter(Boolean).length, 0);
      site.pages.push({ n, slug, sig: contentSig, words_: wordSet, url: finalUrl, title: data.title, h1: data.h1, depth, from, words, images: pageImages, forms: data.forms, iframes: data.iframes, overlays: data.overlays, lastModified: res.headers()['last-modified'] || null, copyright: data.copyright });
      await writeFile(join(outDir, 'pages', slug + '.md'), pageMarkdown(site.pages.at(-1), data, pageImages));
      await page.close();
    }
    for (const q of queue) site.skipped.push({ url: q.url, why: `page limit of ${maxPages} reached` });
  } finally { await browser.close(); }

  site.services = [...serviceSeen.values()].sort((a, b) => a.kind.localeCompare(b.kind));
  site.ms = Date.now() - started;
  await writeFile(join(outDir, 'site.json'), JSON.stringify(site, (k, v) => k === 'words_' || k === 'sig' ? undefined : v, 1));
  await writeFile(join(outDir, 'SITE.md'), siteMarkdown(site, outDir));
  await writeFile(join(outDir, 'img', 'INDEX.md'), imageIndex(site));
  return site;
}

async function robots(ctx, start){
  try {
    const r = await ctx.request.get(`${start.origin}/robots.txt`, { timeout: 10000 });
    if (!r.ok()) return [];
    const out = []; let applies = false;
    for (const line of (await r.text()).split(/\r?\n/)){
      const [k, ...v] = line.split(':'); const val = v.join(':').trim();
      if (/^user-agent$/i.test(k.trim())) applies = val === '*';
      // Wildcards (*) and end anchors ($) become a pattern, so "/*/admin/" blocks admin folders, not the whole site.
      else if (applies && /^disallow$/i.test(k.trim()) && val && val !== '/') out.push(new RegExp('^' + val.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$')));
    }
    return out;
  } catch { return []; }
}

// Runs inside the page: navigation, main content in reading order, images, links and contact details.
function extract(){
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const visible = el => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden'; };
  // Navigation: the first header or nav menu, kept as a tree (dropdowns included even when they're hidden until hover).
  const navRoot = document.querySelector('header nav, nav[aria-label*="ain" i], nav#site-navigation, .main-navigation, #primary-menu, nav, [role=navigation]');
  const tree = ul => [...ul.children].filter(li => li.tagName === 'LI').map(li => {
    const a = li.querySelector(':scope > a, :scope > span > a, :scope > div > a');
    const sub = li.querySelector(':scope > ul, :scope > div > ul');
    return { text: clean(a?.textContent || li.firstChild?.textContent), href: a?.href || null, children: sub ? tree(sub) : [] };
  }).filter(x => x.text);
  let nav = [];
  if (navRoot){
    const ul = navRoot.matches('ul') ? navRoot : navRoot.querySelector('ul');
    nav = ul ? tree(ul) : [...navRoot.querySelectorAll('a')].map(a => ({ text: clean(a.textContent), href: a.href, children: [] })).filter(x => x.text);
  }
  // Main content: the most specific content container, without site chrome.
  const main = document.querySelector('main, [role=main], article, .entry-content, #content, .content, #main') || document.body;
  const skip = 'script,style,noscript,template,svg,nav,header,footer,form,[aria-hidden="true"],.cookie,#cookie,.cc-window,.sharedaddy,.jp-relatedposts,.comments-area,.widget-area';
  const blocks = [];
  const walk = el => {
    for (const n of el.children){
      if (n.matches(skip) && n !== main) continue;
      if (!visible(n) && !n.closest('details, [role=tabpanel], .accordion, .tab-content')) continue;
      const t = n.tagName;
      if (/^H[1-6]$/.test(t)){ const x = clean(n.textContent); if (x) blocks.push({ type: 'h', level: +t[1], text: x }); continue; }
      if (t === 'P' || t === 'BLOCKQUOTE' || t === 'ADDRESS' || t === 'DT' || t === 'DD' || t === 'FIGCAPTION'){ const x = clean(n.innerText); if (x) blocks.push({ type: t === 'BLOCKQUOTE' ? 'quote' : 'p', text: x }); continue; }
      if (t === 'UL' || t === 'OL'){ const items = [...n.children].filter(li => li.tagName === 'LI').map(li => clean(li.innerText)).filter(Boolean); if (items.length) blocks.push({ type: 'list', items }); continue; }
      if (t === 'TABLE'){ const rows = [...n.rows].map(r => [...r.cells].map(c => clean(c.innerText))).filter(r => r.some(Boolean)); if (rows.length) blocks.push({ type: 'table', rows }); continue; }
      if (t === 'DETAILS'){ const s = n.querySelector('summary'); if (s) blocks.push({ type: 'h', level: 4, text: clean(s.textContent) }); walk(n); continue; }
      if (n.children.length) walk(n);
      else { const x = clean(n.innerText); if (x && x.length > 2 && !/^(read more|more|share|like|loading\.{0,3})$/i.test(x)) blocks.push({ type: 'p', text: x }); }
    }
  };
  walk(main);
  // Footer text often holds hours, address and registration details.
  const footer = document.querySelector('footer, #colophon, .site-footer');
  const footerText = footer ? clean(footer.innerText).slice(0, 1500) : '';
  const imgs = [];
  for (const im of document.images){
    const src = im.currentSrc || im.src; if (!src || src.startsWith('data:')) continue;
    const w = im.naturalWidth, h = im.naturalHeight;
    const brand = im.closest('.site-branding, .custom-logo-link, .site-logo, .logo, #logo, .navbar-brand');
    const isLogo = !!brand || /logo/i.test(im.className + ' ' + (im.closest('a')?.className || '') + ' ' + im.alt) || /logo/i.test(new URL(src, location.href).pathname.split('/').pop());
    if (!isLogo && (w < 150 || h < 150)) continue; // icons, buttons, tracking pixels
    imgs.push({ src, alt: clean(im.alt), caption: clean(im.closest('figure')?.querySelector('figcaption')?.textContent), width: w, height: h, kind: isLogo ? 'logo' : 'content' });
  }
  for (const el of document.querySelectorAll('[style*="background"], .hero, .banner, .wp-block-cover')){
    const m = /url\(["']?([^"')]+)["']?\)/.exec(getComputedStyle(el).backgroundImage || '');
    const r = el.getBoundingClientRect();
    if (m && !m[1].startsWith('data:') && r.width > 400 && r.height > 150) imgs.push({ src: new URL(m[1], location.href).href, alt: '', caption: clean(el.innerText).slice(0, 80), width: Math.round(r.width), height: Math.round(r.height), kind: 'background' });
  }
  const links = [...document.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), text: clean(a.textContent || a.getAttribute('aria-label') || a.title), imageOnly: !clean(a.textContent) && !!a.querySelector('img') })).filter(l => l.href && !l.href.startsWith('#') && !/^javascript:/i.test(l.href));
  const body = document.body.innerText;
  const phones = [...new Set([...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href').replace(/^tel:/i, '').trim())
    .concat((body.match(/(?:\+44\s?\(?0?\)?|\b0)(?:\d[\s-]?){9,10}\b/g) || []).map(clean)))].slice(0, 10).map(v => ({ value: v }));
  const emails = [...new Set([...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.getAttribute('href').replace(/^mailto:/i, '').split('?')[0])
    .concat(body.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []))].filter(e => !/\.(png|jpg|gif)$/i.test(e)).slice(0, 10);
  const postcodes = [...new Set(body.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/g) || [])].slice(0, 5);
  const forms = [...document.forms].map(f => ({ action: f.getAttribute('action') || '', fields: [...f.elements].filter(e => e.name && !['hidden', 'submit'].includes(e.type)).map(e => e.labels?.[0]?.innerText?.trim() || e.placeholder || e.name).slice(0, 15) })).filter(f => f.fields.length);
  const iframes = [...document.querySelectorAll('iframe[src]')].map(f => f.src).filter(s => !/doubleclick|googletagmanager|recaptcha/.test(s)).slice(0, 10);
  const overlays = [...document.querySelectorAll('[role=dialog], .modal, .popup, [class*="popup" i], [id*="popup" i], [class*="cookie" i]')].filter(el => { const r = el.getBoundingClientRect(); return visible(el) && r.width > 200 && r.height > 100; }).map(el => clean(el.innerText).slice(0, 200)).filter(Boolean).slice(0, 3);
  const copyright = (body.match(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/i) || [])[1] || null;
  return { title: clean(document.title), h1: clean(document.querySelector('h1')?.textContent), nav, blocks, footerText, images: imgs.slice(0, 60), links, phones, emails, postcodes, forms, iframes, overlays, copyright };
}

function pageMarkdown(p, data, images){
  const out = [`# ${p.title || p.url}`, '', `- URL: ${p.url}`, `- Found from: ${p.from ? p.from : 'start page'} (depth ${p.depth})`, `- Words: ${p.words}${p.copyright ? ` · © ${p.copyright}` : ''}${p.lastModified ? ` · last modified ${p.lastModified}` : ''}`];
  if (images.length) out.push(`- Images on this page: ${images.map(f => `img/${f}`).join(', ')}`);
  if (data.forms.length) out.push(`- Forms: ${data.forms.map(f => `[${f.fields.join(', ')}] → ${f.action || '(no action)'}`).join('; ')}`);
  if (data.iframes.length) out.push(`- Embeds: ${data.iframes.join(', ')}`);
  if (data.overlays.length) out.push(`- Pop-ups or overlays shown: ${data.overlays.map(o => `“${o}”`).join('; ')}`);
  out.push('', '## Content', '');
  for (const b of data.blocks){
    if (b.type === 'h') out.push('', `${'#'.repeat(Math.min(6, b.level + 1))} ${b.text}`, '');
    else if (b.type === 'p') out.push(b.text, '');
    else if (b.type === 'quote') out.push(`> ${b.text}`, '');
    else if (b.type === 'list') out.push(...b.items.map(i => `- ${i}`), '');
    else if (b.type === 'table') out.push(...b.rows.map((r, i) => `| ${r.join(' | ')} |` + (i === 0 ? `\n|${r.map(() => ' --- ').join('|')}|` : '')), '');
  }
  if (data.footerText) out.push('## Footer', '', data.footerText, '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function siteMarkdown(s, outDir){
  const navLines = (items, d = 0) => items.flatMap(i => [`${'  '.repeat(d)}- ${i.text}${i.href ? ` (${shortUrl(i.href, s.url)})` : ''}`, ...navLines(i.children || [], d + 1)]);
  const totalWords = s.pages.reduce((n, p) => n + p.words, 0);
  const photos = s.images.filter(i => i.kind !== 'logo');
  return `# Source website study: ${s.url}
Crawled ${s.crawledAt} in ${Math.round(s.ms / 1000)}s${s.singlePage ? ' (a directory or social page, so only this one page was read)' : ''}.
${s.pages.length} pages · ${totalWords} words · ${photos.length} photos · ${s.images.length - photos.length} logos · ${s.documents.length} documents · ${s.services.length} outside links.
Files are in ${outDir}: pages/ (text of each page), img/ (images, see img/INDEX.md), docs/ (downloaded documents), shots/ (top of each page).

## Navigation, as it appears on the site
${s.nav.length ? navLines(s.nav).join('\n') : '(no menu found)'}

## Pages
| Page | Title | Words | Photos | File |
| --- | --- | ---: | ---: | --- |
${s.pages.map(p => `| ${shortUrl(p.url, s.url)} | ${(p.h1 || p.title || '').replace(/\|/g, '/').slice(0, 70)} | ${p.words} | ${p.images.length} | pages/${p.slug}.md |`).join('\n')}

## Contact details found
- Phones: ${s.contacts.phones.map(p => `${p.value} (${p.page})`).join(', ') || 'none'}
- Emails: ${s.contacts.emails.map(e => `${e.value} (${e.page})`).join(', ') || 'none'}
- Postcodes: ${s.contacts.addresses.map(a => a.value).join(', ') || 'none'}

## Outside services and links
${s.services.length ? s.services.map(x => `- ${x.kind}: ${x.url}${x.text ? ` (“${x.text.slice(0, 50)}”)` : ''} · on ${x.pages.slice(0, 4).join(', ')}`).join('\n') : '(none)'}

## Images
${photos.length ? photos.map(i => `- img/${i.file} · ${i.width}×${i.height}${i.alt ? ` · alt “${i.alt.slice(0, 60)}”` : ''}${i.caption ? ` · caption “${i.caption.slice(0, 60)}”` : ''} · on ${i.pages.slice(0, 3).join(', ')}`).join('\n') : '(no content photos)'}
${s.images.filter(i => i.kind === 'logo').map(i => `- Logo: img/${i.file} · ${i.width}×${i.height}`).join('\n')}

${s.imagesNotSaved?.length ? `- Plus ${s.imagesNotSaved.length} more photos not saved (galleries are capped at ${MAX_IMAGES_PER_PAGE} per page): ${[...new Set(s.imagesNotSaved.map(i => i.page))].join(', ')}\n` : ''}
## Documents
${s.documents.length ? s.documents.map(d => `- ${d.text || d.url} · ${d.file ? `docs/${d.file}` : 'not downloaded'} · ${d.url}`).join('\n') : '(none)'}

## Pop-ups, forms and embeds
${s.pages.filter(p => p.overlays.length || p.forms.length || p.iframes.length).map(p => `- ${p.slug}: ${[p.overlays.length && `pop-up “${p.overlays[0].slice(0, 100)}”`, p.forms.length && `${p.forms.length} form(s)`, p.iframes.length && `embeds ${p.iframes.map(f => { try { return new URL(f).hostname; } catch { return f; } }).join(', ')}`].filter(Boolean).join('; ')}`).join('\n') || '(none)'}

## Not read
${[...s.errors.map(e => `- ${e.url}: ${e.error}`), ...s.skipped.filter(x => !/not a content page/.test(x.why)).slice(0, 30).map(x => `- ${x.url}: ${x.why}`)].join('\n') || '(nothing)'}
`;
}

function imageIndex(s){
  return `# Images from ${s.url}\n\nOnly use photos of real staff and premises with the practice's consent. Check alt text and captions before reuse.\n\n` +
    s.images.map(i => `- ${i.file} · ${i.kind} · ${i.width}×${i.height} · ${Math.round(i.bytes / 1024)} KB${i.alt ? ` · alt “${i.alt}”` : ''}${i.caption ? ` · caption “${i.caption}”` : ''} · pages: ${i.pages.join(', ')} · ${i.src}`).join('\n') + '\n';
}

const shortUrl = (u, base) => { try { const x = new URL(u), b = new URL(base); return x.hostname.replace(/^www\./, '') === b.hostname.replace(/^www\./, '') ? (x.pathname + x.search || '/') : u; } catch { return u; } };

// ---------- command line ----------
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const [url, out, max] = process.argv.slice(2);
  if (!url || !out){ console.error('Usage: node pipeline/crawl.mjs <url> <out dir> [max pages]'); process.exit(1); }
  const s = await crawlSite(url, resolve(out), { maxPages: Number(max) || DEFAULT_MAX_PAGES });
  console.log(`${s.pages.length} pages, ${s.images.length} images, ${s.documents.length} documents, ${s.errors.length} errors (${Math.round(s.ms / 1000)}s)`);
  console.log(`Read: ${join(resolve(out), 'SITE.md')}`);
}
