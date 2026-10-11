#!/usr/bin/env node
// Browser audit of a redesign preview, run locally with Playwright and the installed Chrome.
// Crawls the site's pages at desktop and phone width, clicks its links, runs axe accessibility checks (WCAG 2.1 AA),
// and tests the phone layout, the menu, forms and keyboard navigation. Writes report.json, report.md (for AI reviewers),
// report.html (for people) and screenshots into the output folder.
// Usage: node pipeline/audit.mjs <url> [out dir]
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { mkdir, writeFile, readdir, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const AXE = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

export const CHROME = [process.env.CHROME_BIN, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));

const VIEWPORTS = [
  { name: 'desktop', label: 'desktop', width: 1280, height: 800, isMobile: false, hasTouch: false, slice: 1600, maxSlices: 4 },
  { name: 'mobile', label: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true, slice: 1400, maxSlices: 6 }
];
const MAX_PAGES = 15;
const MAX_CLICKS = 40;
const MAX_EXTERNAL = 60;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const PLACEHOLDER = /lorem ipsum|to be (supplied|confirmed|added|provided)|\b(placeholder|TBC|TBD)\b|\[(insert|add|your)[^\]]*\]|\bexample\.(com|org)\b|\bX{3,}\b/i;
const SEVERITIES = ['blocker', 'major', 'minor', 'info'];

export async function runAudit(url, outDir, { chrome = CHROME } = {}){
  if (!chrome) throw new Error('No Chrome or Chromium found to run the audit');
  await mkdir(outDir, { recursive: true });
  for (const f of await readdir(outDir)) if (/^(preview-.*\.png|report\.(json|md|html))$/.test(f)) await rm(join(outDir, f), { force: true });

  const started = Date.now();
  const base = new URL(url);
  const scope = base.href.replace(/[^/]*([?#].*)?$/, ''); // the folder the site lives in
  const r = { url: base.href, at: new Date().toISOString(), pages: [], screenshots: [], issues: [], passed: [], stats: { links: 0, internal: 0, external: 0, clicked: 0 } };
  const issue = (severity, area, message, extra = {}) => r.issues.push({ severity, area, message, ...extra });

  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  try {
    const links = new Map(); // abs href -> { kinds, pages, texts }
    for (const vp of VIEWPORTS){
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch,
        deviceScaleFactor: 1, bypassCSP: true, ignoreHTTPSErrors: true, userAgent: vp.isMobile ? undefined : UA });
      try { await auditViewport(ctx, vp, base, scope, outDir, r, issue, links); }
      finally { await ctx.close(); }
    }
    await checkExternal(browser, links, r, issue);
  } finally { await browser.close(); }

  r.issues = merge(r.issues);
  r.ms = Date.now() - started;
  r.summary = Object.fromEntries(SEVERITIES.map(s => [s, r.issues.filter(i => i.severity === s).length]));
  Object.assign(r.summary, { pages: r.pages.length, links: r.stats.links, clicked: r.stats.clicked, ms: r.ms });
  await writeFile(join(outDir, 'report.json'), JSON.stringify(r, null, 1));
  await writeFile(join(outDir, 'report.md'), markdown(r));
  await writeFile(join(outDir, 'report.html'), html(r));
  return r;
}

// ---------- one viewport ----------
async function auditViewport(ctx, vp, base, scope, outDir, r, issue, links){
  const desktop = vp.name === 'desktop';
  const page = await ctx.newPage();
  let current = '';
  // "Failed to load resource" repeats a failed request (reported below with its URL), so skip it here.
  page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) issue('major', 'errors', 'Console error', { page: current, viewport: vp.name, detail: m.text().slice(0, 300) }); });
  page.on('pageerror', e => issue('major', 'errors', 'JavaScript error', { page: current, viewport: vp.name, detail: e.message.slice(0, 300) }));
  page.on('response', res => {
    if (res.status() < 400) return;
    const own = res.url().startsWith(scope);
    issue(own ? 'major' : 'minor', 'errors', own ? 'A file on the site failed to load' : 'An external resource failed to load',
      { page: current, viewport: vp.name, detail: `${res.status()} ${res.url()}` });
  });
  page.on('requestfailed', req => {
    if (/ERR_ABORTED/.test(req.failure()?.errorText || '')) return;
    issue(req.url().startsWith(scope) ? 'major' : 'minor', 'errors', 'A request failed', { page: current, viewport: vp.name, detail: `${req.failure()?.errorText} ${req.url()}` });
  });

  // Desktop crawls the site; the phone pass revisits the pages the desktop pass found.
  const queue = desktop ? [base.href.split('#')[0]] : r.pages.map(p => p.abs), seen = new Set(queue.map(pageKey));
  let home = true;
  while (queue.length && (!desktop || r.pages.length < MAX_PAGES)){
    const pageUrl = queue.shift();
    current = rel(pageUrl, scope);
    let res;
    try { res = await page.goto(pageUrl, { waitUntil: 'load', timeout: 20000 }); }
    catch (e){ issue('blocker', 'links', 'Page failed to load', { page: current, viewport: vp.name, detail: e.message.split('\n')[0] }); continue; }
    if (!res || res.status() >= 400){ issue('blocker', 'links', 'Page returns an error', { page: current, viewport: vp.name, detail: String(res?.status()) }); continue; }
    if (!/html/.test(res.headers()['content-type'] || '')) continue;
    await settle(page);

    if (home) await screenshots(page, vp, outDir, r);
    const info = await pageInfo(page);
    if (desktop) r.pages.push({ url: current, abs: pageUrl, title: info.title, h1: info.h1 });

    // content and basics
    if (!info.title) issue('major', 'content', 'Page has no <title>', { page: current });
    if (!info.description) issue('minor', 'content', 'No meta description (the text search engines show)', { page: current });
    if (!info.viewportMeta) issue('major', 'mobile', 'No viewport meta tag, so phones show a zoomed-out desktop page', { page: current });
    if (info.h1 !== 1) issue('minor', 'content', info.h1 ? `${info.h1} <h1> headings; a page should have one` : 'No <h1> heading', { page: current });
    for (const m of info.placeholders) issue('blocker', 'content', 'Placeholder text on the page', { page: current, detail: m });
    for (const src of info.brokenImages) issue('major', 'content', 'Image fails to load', { page: current, viewport: vp.name, detail: src });
    if (info.emptyLinks.length) issue('major', 'links', 'Links that go nowhere (href="#" or empty)', { page: current, detail: info.emptyLinks.slice(0, 8).join(' · ') });

    // accessibility
    for (const v of await axe(page)) issue(v.impact === 'critical' ? 'blocker' : v.impact === 'serious' ? 'major' : 'minor', 'accessibility', v.help,
      { page: current, viewport: vp.name, detail: `${v.id}: ${v.nodes} element${v.nodes > 1 ? 's' : ''}. ${v.summary}`, targets: v.targets, help: v.url });

    if (vp.isMobile){
      if (info.overflow > 0) issue('blocker', 'mobile', `Page is ${info.overflow}px too wide and scrolls sideways on a ${vp.width}px phone`, { page: current, detail: info.widest.join(' · ') });
      const t = await tapTargets(page);
      if (t.tiny.length) issue('major', 'mobile', `${t.tiny.length} tap target${t.tiny.length > 1 ? 's' : ''} smaller than 24×24px`, { page: current, detail: t.tiny.slice(0, 6).join(' · ') });
      if (t.small.length) issue('minor', 'mobile', `${t.small.length} tap target${t.small.length > 1 ? 's' : ''} smaller than the recommended 44×44px`, { page: current, detail: t.small.slice(0, 6).join(' · ') });
      if (t.smallText) issue('minor', 'mobile', `${t.smallText} text element${t.smallText > 1 ? 's' : ''} under 12px, hard to read on a phone`, { page: current });
      if (home){
        if (!info.tel) issue('minor', 'mobile', 'No tap-to-call (tel:) link on the home page', { page: current });
        await mobileMenu(page, current, issue);
      }
    }

    if (desktop){
      for (const l of info.links){
        const e = links.get(l.abs) || { href: l.href, abs: l.abs, pages: new Set(), texts: new Set() };
        e.pages.add(current); if (l.text) e.texts.add(l.text);
        links.set(l.abs, e);
        r.stats.links++;
        const kind = classify(l, scope, pageUrl);
        if (kind === 'page' && !seen.has(pageKey(l.abs))){ seen.add(pageKey(l.abs)); queue.push(l.abs.split('#')[0]); }
        if (kind === 'anchor' && !info.ids.includes(decodeURIComponent(l.abs.split('#')[1] || '')))
          issue('major', 'links', 'Link jumps to a section that doesn’t exist', { page: current, detail: `${l.href} (“${l.text}”)` });
        if (kind === 'tel'){
          const digits = l.href.replace(/^tel:/i, '').replace(/[^\d+]/g, '');
          const bare = digits.replace(/^\+/, '');
          // UK service numbers (111, 999, 112, 101, 119) are short; everything else needs 10 or more digits.
          if (bare.length < 10 && !['111', '999', '112', '101', '119'].includes(bare)) issue('major', 'links', 'Phone link has an invalid number', { page: current, detail: l.href });
        }
        if (kind === 'mailto' && !/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+/i.test(l.href)) issue('major', 'links', 'Email link has an invalid address', { page: current, detail: l.href });
        if (kind === 'javascript') issue('minor', 'links', 'Link uses javascript: instead of a real address', { page: current, detail: l.href });
        if (kind === 'file'){
          const s = await ctx.request.get(l.abs, { timeout: 10000 }).then(x => x.status()).catch(() => 0);
          if (!s || s >= 400) issue('blocker', 'links', 'Broken link to a file on the site', { page: current, detail: `${l.href} → ${s || 'no response'}` });
        }
      }
      if (home){
        await clickLinks(page, pageUrl, info.links, scope, current, r, issue);
        await keyboard(page, pageUrl, current, issue, r);
      }
      await forms(page, current, issue, r);
    }
    home = false;
  }
  if (desktop && queue.length) issue('info', 'links', `Stopped after ${MAX_PAGES} pages; ${queue.length} more weren’t checked`);
  await page.close();
}

async function settle(page){
  // Scroll through once so lazy images load, then back to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight){ scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    scrollTo(0, 0);
  }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
}

function pageInfo(page){
  return page.evaluate(src => {
    const PLACEHOLDER = new RegExp(src, 'i');
    const visible = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const text = document.body?.innerText || '';
    const placeholders = [];
    for (const line of text.split('\n')) if (PLACEHOLDER.test(line) && placeholders.length < 6) placeholders.push(line.trim().slice(0, 140));
    const de = document.documentElement;
    const widest = de.scrollWidth > innerWidth ? [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 1)
      .slice(0, 4).map(el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.classList[0] ? '.' + el.classList[0] : ''}`) : [];
    const links = [...document.querySelectorAll('a[href]')].map(a => ({
      href: a.getAttribute('href').trim(), abs: a.href, visible: visible(a),
      text: (a.innerText || a.getAttribute('aria-label') || a.title || a.querySelector('img')?.alt || '').trim().replace(/\s+/g, ' ').slice(0, 60)
    }));
    return {
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.content?.trim() || '',
      viewportMeta: !!document.querySelector('meta[name="viewport"]'),
      h1: document.querySelectorAll('h1').length,
      placeholders,
      brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.src)).map(i => i.currentSrc || i.src).slice(0, 10),
      emptyLinks: links.filter(l => l.href === '' || l.href === '#').map(l => `“${l.text || 'no text'}”`),
      links: links.filter(l => l.href !== '' && l.href !== '#'),
      ids: [...document.querySelectorAll('[id], a[name]')].map(e => e.id || e.getAttribute('name')),
      tel: links.some(l => /^tel:/i.test(l.href)),
      overflow: Math.max(0, de.scrollWidth - innerWidth),
      widest
    };
  }, PLACEHOLDER.source);
}

function classify(l, scope, pageUrl){
  const h = l.href;
  if (/^tel:/i.test(h)) return 'tel';
  if (/^mailto:/i.test(h)) return 'mailto';
  if (/^javascript:/i.test(h)) return 'javascript';
  if (!/^https?:/i.test(l.abs)) return 'other';
  if (!l.abs.startsWith(scope)) return 'external';
  const [path, hash] = l.abs.split('#');
  if (hash !== undefined && pageKey(path) === pageKey(pageUrl)) return 'anchor'; // a section on this same page
  const last = new URL(path).pathname.split('/').pop();
  return !last.includes('.') || /\.(html?|php)$/i.test(last) ? 'page' : 'file';
}

async function axe(page){
  try {
    await page.addScriptTag({ content: AXE });
    return await page.evaluate(() => window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, resultTypes: ['violations']
    }).then(res => res.violations.map(v => ({
      id: v.id, impact: v.impact, help: v.help, url: v.helpUrl, nodes: v.nodes.length,
      targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')),
      summary: (v.nodes[0]?.failureSummary || '').replace(/\s+/g, ' ').slice(0, 220)
    }))));
  } catch (e){ return [{ id: 'axe', impact: 'minor', help: 'Accessibility scan couldn’t run', nodes: 0, targets: [], summary: e.message.slice(0, 200) }]; }
}

function tapTargets(page){
  return page.evaluate(() => {
    const tiny = [], small = [];
    const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], summary')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width && r.height && getComputedStyle(el).visibility !== 'hidden'; });
    const rects = els.map(el => el.getBoundingClientRect());
    // WCAG 2.5.8 spacing exception: a small target is fine if a 24px circle on its centre doesn't touch another target.
    const spaced = i => { const r = rects[i], cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return rects.every((o, j) => j === i || Math.hypot(Math.max(o.left - cx, 0, cx - o.right), Math.max(o.top - cy, 0, cy - o.bottom)) >= 12); };
    const name = el => `${el.tagName.toLowerCase()} “${(el.innerText || el.getAttribute('aria-label') || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 30)}” ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`;
    els.forEach((el, i) => {
      const r = rects[i];
      if (el.tagName === 'A' && el.closest('p, td, address') && el.closest('p, td, address').innerText.trim().length > el.innerText.trim().length + 10) return; // links inside sentences are exempt
      if ((r.width < 24 || r.height < 24) && !spaced(i)) tiny.push(name(el)); else if (r.width < 44 || r.height < 44) small.push(name(el));
    });
    let smallText = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const counted = new Set();
    while (walker.nextNode()){
      const el = walker.currentNode.parentElement;
      if (!el || counted.has(el) || !walker.currentNode.textContent.trim()) continue;
      counted.add(el);
      const r = el.getBoundingClientRect();
      if (r.width && r.height && parseFloat(getComputedStyle(el).fontSize) < 12) smallText++;
    }
    return { tiny, small, smallText };
  });
}

async function mobileMenu(page, current, issue){
  const state = () => page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && r.bottom > 0 && r.top < innerHeight * 3; };
    // The site's main menu: navigation that starts near the top of the page, not footer links.
    const tops = [...document.querySelectorAll('header, nav, [role=navigation]')].filter(el => el.getBoundingClientRect().top + scrollY < 300 && !el.closest('footer'));
    const navLinks = [...new Set(tops.flatMap(el => [...el.querySelectorAll('a[href]')]))];
    return { total: navLinks.length, visible: navLinks.filter(vis).length };
  });
  const before = await state();
  if (!before.total) return issue('minor', 'menu', 'No navigation menu found on the home page', { page: current });
  const toggle = page.locator('button, [role=button], a[href="#"], label').filter({ visible: true }).filter({
    has: page.locator('xpath=self::*[contains(translate(concat(@class," ",@id," ",@aria-label," ",@aria-controls," ",normalize-space(.)),"MENUNAVBURGERTOGGLE","menunavburgertoggle"),"menu") or contains(translate(concat(@class," ",@id," ",@aria-label," ",@aria-controls),"MENUNAVBURGERTOGGLE","menunavburgertoggle"),"nav") or contains(translate(concat(@class," ",@id," ",@aria-label),"BURGERTOGGLE","burgertoggle"),"burger") or contains(translate(concat(@class," ",@id),"TOGGLE","toggle"),"toggle")]')
  }).first();
  if (!(await toggle.count())){
    if (before.visible < Math.min(3, before.total)) issue('blocker', 'menu', 'The menu is hidden on phones and there’s no button to open it', { page: current, detail: `${before.visible} of ${before.total} menu links visible` });
    return;
  }
  try {
    await toggle.click({ timeout: 3000 });
    await page.waitForTimeout(500);
    const after = await state();
    const expanded = await toggle.getAttribute('aria-expanded');
    if (after.visible <= before.visible && before.visible < before.total) issue('blocker', 'menu', 'Tapping the menu button doesn’t show the menu on phones', { page: current, detail: `${after.visible} of ${after.total} menu links visible after tapping` });
    else if (expanded === null) issue('minor', 'menu', 'Menu button has no aria-expanded, so screen readers can’t tell if it’s open', { page: current });
  } catch (e){ issue('major', 'menu', 'Menu button couldn’t be tapped', { page: current, detail: e.message.split('\n')[0] }); }
}

async function clickLinks(page, pageUrl, list, scope, current, r, issue){
  const targets = [];
  for (const l of list){
    if (!l.visible || targets.some(t => t.href === l.href)) continue;
    if (/^skip\b/i.test(l.text)) continue; // skip links sit off-screen until focused; the keyboard check covers them
    const k = classify(l, scope, pageUrl);
    if (k === 'page' || k === 'anchor') targets.push(l);
  }
  for (const l of targets.slice(0, MAX_CLICKS)){
    try {
      await page.goto(pageUrl, { waitUntil: 'load', timeout: 15000 });
      // Match on text too: several links can share an address (a skip link, the logo and a menu item can all point to #main).
      let link = page.locator(`a[href="${l.href.replace(/(["\\])/g, '\\$1')}"]`).filter({ visible: true });
      if (l.text) link = link.filter({ hasText: l.text.slice(0, 15) }); // the start only: headings and descriptions inside one link may run together
      link = link.first();
      await link.click({ timeout: 3000 });
      await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      // Let smooth scrolling finish before checking where the page landed.
      for (let i = 0, last = -1; i < 20; i++){
        const y = await page.evaluate(() => scrollY);
        if (y === last) break;
        last = y; await page.waitForTimeout(150);
      }
      r.stats.clicked++;
      const hash = l.abs.includes('#') ? decodeURIComponent(l.abs.split('#')[1]) : '';
      const now = page.url();
      if (pageKey(now) !== pageKey(l.abs)) issue('major', 'links', 'Clicking a link went to the wrong place', { page: current, detail: `“${l.text}” → ${rel(now, scope)} (expected ${rel(l.abs, scope)})` });
      else if (hash){
        const inView = await page.evaluate(id => { const el = document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`); if (!el) return null; const b = el.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; }, hash);
        if (inView === false) issue('minor', 'links', 'Clicking a link didn’t scroll to its section', { page: current, detail: `“${l.text}” → #${hash}` });
      }
    } catch (e){ issue('minor', 'links', 'A visible link couldn’t be clicked (covered or not interactive)', { page: current, detail: `“${l.text}” ${l.href}` }); }
  }
  if (targets.length > MAX_CLICKS) issue('info', 'links', `Clicked the first ${MAX_CLICKS} of ${targets.length} links`, { page: current });
  await page.goto(pageUrl, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
}

async function keyboard(page, pageUrl, current, issue, r){
  await page.goto(pageUrl, { waitUntil: 'load', timeout: 15000 }).catch(() => {});
  const total = await page.evaluate(() => [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => { const b = el.getBoundingClientRect(); return b.width && b.height && !el.disabled; }).length);
  const seenEls = new Set(), noFocus = [];
  let last = '', repeats = 0, trapped = false;
  for (let i = 0; i < Math.min(total + 5, 120); i++){
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none');
      const id = `${el.tagName.toLowerCase()} “${(el.innerText || el.getAttribute('aria-label') || el.title || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 30)}”`;
      el.dataset.auditTab ||= String(Math.random()).slice(2); // tells look-alike controls (six "Learn more" links) apart
      return { key: el.dataset.auditTab, id, ring, frame: el.tagName === 'IFRAME' };
    });
    if (!f) { if (seenEls.size) break; continue; }
    if (f.key === last){
      if (!f.frame && ++repeats >= 3){ trapped = true; break; } // Tab moves inside an embedded map, so focus sits on its iframe a while
      continue;
    }
    repeats = 0;
    last = f.key;
    if (seenEls.has(f.key)) break; // wrapped round to the start
    seenEls.add(f.key);
    if (!f.ring) noFocus.push(f.id);
  }
  r.stats.keyboard = { controls: total, reached: seenEls.size };
  if (trapped) issue('blocker', 'keyboard', 'Keyboard focus gets stuck (a keyboard trap)', { page: current, detail: last });
  if (seenEls.size < total * 0.8) issue('major', 'keyboard', `Tab reaches only ${seenEls.size} of ${total} controls`, { page: current });
  if (noFocus.length) issue('major', 'keyboard', `${noFocus.length} control${noFocus.length > 1 ? 's' : ''} show no visible focus when tabbed to`, { page: current, detail: noFocus.slice(0, 6).join(' · ') });
}

async function forms(page, current, issue, r){
  const list = await page.evaluate(() => [...document.forms].map((f, i) => ({
    i, action: f.getAttribute('action') || '', fields: [...f.elements].filter(e => !['hidden', 'submit', 'button', 'reset'].includes(e.type) && e.tagName !== 'BUTTON' && e.tagName !== 'FIELDSET').length,
    required: [...f.elements].filter(e => e.required).length,
    submit: !!f.querySelector('button:not([type=button]):not([type=reset]), input[type=submit]')
  })));
  r.stats.forms = (r.stats.forms || 0) + list.length;
  for (const f of list){
    const where = `form ${f.i + 1}${list.length > 1 ? ` of ${list.length}` : ''}`;
    if (!f.submit) issue('major', 'forms', 'Form has no submit button', { page: current, detail: where });
    if (!f.required) issue('minor', 'forms', 'Form has no required fields, so it can be sent empty', { page: current, detail: where });
    else {
      const emptyOk = await page.evaluate(i => document.forms[i].checkValidity(), f.i);
      if (emptyOk) issue('major', 'forms', 'Form accepts an empty submission despite required fields', { page: current, detail: where });
    }
    const bad = await page.evaluate(i => {
      const sample = { email: 'patient@gmail.com', tel: '07700 900123', number: '1', date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10), url: 'https://www.nhs.uk', time: '10:30' };
      const f = document.forms[i];
      for (const e of f.elements){
        if (['hidden', 'submit', 'button', 'reset', 'file'].includes(e.type) || e.disabled) continue;
        if (e.type === 'checkbox' || e.type === 'radio'){ if (e.required) e.checked = true; continue; }
        if (e.tagName === 'SELECT'){ const o = [...e.options].find(o => o.value); if (o) e.value = o.value; continue; }
        e.value = sample[e.type] || (e.tagName === 'TEXTAREA' ? 'I would like to book a check-up, please.' : /name/i.test(e.name + e.id) ? 'Alex Morgan' : 'Test');
        e.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const invalid = [...f.elements].filter(e => e.willValidate && !e.checkValidity()).map(e => `${e.name || e.id || e.type}: ${e.validationMessage}`);
      f.reset();
      return invalid;
    }, f.i);
    if (bad.length) issue('major', 'forms', 'Form rejects valid answers', { page: current, detail: `${where}: ${bad.slice(0, 3).join('; ')}` });
    if (!f.action || f.action === '#' || /^javascript:/i.test(f.action)) issue('info', 'forms', 'Form doesn’t send anywhere yet; it needs a real destination before going live', { page: current, detail: where });
  }
}

async function screenshots(page, vp, outDir, r){
  const { h } = await page.evaluate(() => ({ h: document.documentElement.scrollHeight }));
  const total = Math.min(Math.max(h, vp.height), vp.slice * vp.maxSlices);
  const files = [];
  for (let y = 0, i = 1; y < total; y += vp.slice, i++){
    const file = `preview-${vp.name}-${i}.png`;
    await page.screenshot({ path: join(outDir, file), fullPage: true, clip: { x: 0, y, width: vp.width, height: Math.min(vp.slice, total - y) } });
    files.push(file);
  }
  r.screenshots.push({ viewport: vp.label, width: vp.width, files, pageHeight: h, shownHeight: total });
}

async function checkExternal(browser, links, r, issue){
  const ext = [...links.values()].filter(l => /^https?:/i.test(l.abs) && !l.abs.startsWith(r.url.replace(/[^/]*$/, '')));
  r.stats.external = ext.length;
  r.stats.internal = links.size - ext.length;
  const ctx = await browser.newContext({ userAgent: UA, ignoreHTTPSErrors: true });
  const queue = ext.slice(0, MAX_EXTERNAL);
  const one = async l => {
    let status = 0, err = '';
    try { status = (await ctx.request.get(l.abs, { timeout: 10000, maxRedirects: 5, failOnStatusCode: false })).status(); }
    catch (e){ err = e.message.split('\n')[0]; }
    const label = `${l.abs} (“${[...l.texts][0] || ''}” on ${[...l.pages].join(', ')})`;
    if (status === 404 || status === 410) issue('major', 'links', 'Broken external link', { detail: `${status} ${label}` });
    else if ([401, 403, 429, 999].includes(status)) issue('info', 'links', 'External link couldn’t be verified (the site blocks automated checks)', { detail: label });
    else if (status >= 400) issue('minor', 'links', 'External link returns an error', { detail: `${status} ${label}` });
    else if (!status) issue('minor', 'links', 'External link didn’t respond', { detail: `${err} ${label}` });
  };
  const workers = Array.from({ length: 6 }, async () => { while (queue.length) await one(queue.shift()); });
  await Promise.all(workers);
  if (ext.length > MAX_EXTERNAL) issue('info', 'links', `Checked the first ${MAX_EXTERNAL} of ${ext.length} external links`);
  await ctx.close();
}

// ---------- results ----------
// "/" and "/index.html" are the same page.
const pageKey = u => u.split('#')[0].replace(/\/index\.html?$/i, '/');
const rel = (u, scope) => { const s = String(u); return s.startsWith(scope) ? '/' + s.slice(scope.length) : s; };

// The same problem on several pages or both viewports becomes one entry that lists where it happens.
function merge(list){
  const out = new Map();
  const tag = m => m.replace(/^\d+ /, 'N '); // "15 tap targets…" and "8 tap targets…" are the same problem
  for (const i of list){
    const key = [i.severity, i.area, tag(i.message), i.area === 'links' || i.area === 'forms' || i.area === 'content' ? i.detail || '' : ''].join('|');
    const e = out.get(key);
    if (e){
      if (i.viewport && !e.viewports.includes(i.viewport)) e.viewports.push(i.viewport);
      if (i.page && !e.pages.includes(i.page)) e.pages.push(i.page);
      if (i.detail && !e.details.includes(i.detail) && e.details.length < 3) e.details.push(i.detail);
      for (const t of i.targets || []) if (!e.targets.includes(t) && e.targets.length < 5) e.targets.push(t);
      e.count++; continue;
    }
    out.set(key, { ...i, viewports: i.viewport ? [i.viewport] : [], pages: i.page ? [i.page] : [], details: i.detail ? [i.detail] : [], targets: [...(i.targets || [])], count: 1, viewport: undefined, page: undefined, detail: undefined });
  }
  return [...out.values()].sort((a, b) => SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) || a.area.localeCompare(b.area));
}

function passes(r){
  const has = area => r.issues.some(i => i.area === area && i.severity !== 'info');
  const p = [];
  if (!r.issues.some(i => i.area === 'links' && ['blocker', 'major'].includes(i.severity))) p.push(`All ${r.stats.internal} internal links and anchors work (${r.stats.clicked} clicked)`);
  if (!r.issues.some(i => i.area === 'mobile' && i.severity === 'blocker')) p.push('No sideways scrolling on a 390px phone');
  if (!has('menu')) p.push('Phone menu opens');
  if (!has('accessibility')) p.push('No axe accessibility violations (WCAG 2.1 AA)');
  if (!has('errors')) p.push('No console errors or failed requests');
  if (!has('keyboard') && r.stats.keyboard) p.push(`Keyboard reaches all ${r.stats.keyboard.reached} controls with visible focus`);
  if (r.stats.forms && !has('forms')) p.push('Forms validate correctly');
  if (!r.issues.some(i => i.message.startsWith('Placeholder'))) p.push('No placeholder text');
  return p;
}

function markdown(r){
  const s = r.summary;
  const where = i => [i.pages.length ? `on ${i.pages.length > 4 ? `${i.pages.length} pages` : i.pages.join(', ')}` : '', i.viewports.length === 1 ? `${i.viewports[0]} only` : ''].filter(Boolean).join(', ');
  const line = i => `- **${i.area}**: ${i.message}${where(i) ? ` (${where(i)})` : ''}${i.details.length ? `. ${i.details.join(' | ')}` : ''}${i.targets.length ? ` [${i.targets.join(', ')}]` : ''}`;
  const sec = (title, sev, max) => {
    const l = r.issues.filter(i => i.severity === sev);
    return l.length ? `\n## ${title} (${l.length})\n${l.slice(0, max).map(line).join('\n')}${l.length > max ? `\n- …and ${l.length - max} more in report.json` : ''}\n` : '';
  };
  return `# Browser audit
${r.url}
Ran ${r.at} in ${Math.round(r.ms / 1000)}s. Checked ${s.pages} page${s.pages === 1 ? '' : 's'} at desktop (1280px) and phone (390px): ${r.stats.links} links (${r.stats.clicked} clicked, ${r.stats.external} external), axe accessibility (WCAG 2.1 AA), phone layout and tap targets, the phone menu, ${r.stats.forms || 0} form${r.stats.forms === 1 ? '' : 's'} and keyboard navigation.

**Result: ${s.blocker} blocker${s.blocker === 1 ? '' : 's'}, ${s.major} major, ${s.minor} minor.**
${sec('Blockers: must fix', 'blocker', 40)}${sec('Major: should fix', 'major', 40)}${sec('Minor', 'minor', 25)}${sec('For information', 'info', 15)}
## Passed
${passes(r).map(p => `- ${p}`).join('\n') || '- (nothing fully passed)'}

## Screenshots (top to bottom)
${r.screenshots.map(x => `- ${x.viewport}, ${x.width}px wide${x.shownHeight < x.pageHeight ? ` (top ${x.shownHeight}px of ${x.pageHeight}px)` : ''}: ${x.files.join(', ')}`).join('\n')}
`;
}

function html(r){
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const s = r.summary;
  const rows = r.issues.map(i => `<tr class="${i.severity}"><td><span class="sev">${i.severity}</span></td><td>${e(i.area)}</td><td>${e(i.pages.join(', '))}${i.viewports.length === 1 ? `<br><small>${e(i.viewports[0])} only</small>` : ''}</td>
    <td><b>${e(i.message)}</b>${i.details.map(d => `<br><small>${e(d)}</small>`).join('')}${i.targets.length ? `<br><code>${e(i.targets.join(', '))}</code>` : ''}${i.help ? ` <a href="${e(i.help)}" target="_blank" rel="noopener">how to fix</a>` : ''}</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Audit · ${e(r.url)}</title>
<style>
:root{color-scheme:light dark;--bg:#F6F7F9;--fg:#1E232B;--mut:#5F6773;--card:#fff;--edge:#D5DAE1;--b:#B42318;--bb:#FBD3CF;--m:#7A4A06;--mb:#FDE2BF;--n:#3B4350;--nb:#E6E9ED;--ok:#145C33;--okb:#CDEFD9}
@media (prefers-color-scheme:dark){:root{--bg:#16181C;--fg:#E6E8EB;--mut:#9AA2AE;--card:#202329;--edge:#363B44;--b:#FFB4AA;--bb:#4A2522;--m:#FFD59A;--mb:#46351C;--n:#C4CAD3;--nb:#2E333B;--ok:#9BE3B5;--okb:#1E3D2B}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,-apple-system,sans-serif}main{max-width:1100px;margin:auto}
h1{font-size:20px;margin:0 0 4px}p{color:var(--mut);margin:0 0 14px}a{color:inherit}
.tiles{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.tile{background:var(--card);border:1px solid var(--edge);border-radius:12px;padding:10px 14px;min-width:110px}.tile b{display:block;font-size:22px}
.wrap{overflow-x:auto;background:var(--card);border:1px solid var(--edge);border-radius:12px}table{border-collapse:collapse;width:100%;min-width:640px}
td,th{text-align:left;padding:8px 10px;border-bottom:1px solid var(--edge);vertical-align:top}small{color:var(--mut)}code{font-size:12px;color:var(--mut)}
.sev{font-size:11px;font-weight:700;text-transform:uppercase;padding:2px 7px;border-radius:999px;background:var(--nb);color:var(--n)}
.blocker .sev{background:var(--bb);color:var(--b)}.major .sev{background:var(--mb);color:var(--m)}
ul.ok{background:var(--okb);color:var(--ok);border-radius:12px;padding:12px 12px 12px 30px}
.shots{display:flex;gap:12px;overflow-x:auto;padding-bottom:6px}.shots figure{margin:0;flex:none}.shots img{display:block;border:1px solid var(--edge);border-radius:8px;max-height:520px;width:auto}
</style></head><body><main>
<h1>Browser audit</h1><p><a href="${e(r.url)}" target="_blank" rel="noopener">${e(r.url)}</a> · ${e(new Date(r.at).toLocaleString('en-GB'))} · ${Math.round(r.ms / 1000)}s</p>
<div class="tiles"><div class="tile"><b>${s.blocker}</b>blockers</div><div class="tile"><b>${s.major}</b>major</div><div class="tile"><b>${s.minor}</b>minor</div>
<div class="tile"><b>${s.pages}</b>pages</div><div class="tile"><b>${r.stats.links}</b>links (${r.stats.clicked} clicked)</div></div>
<h2>Passed</h2><ul class="ok">${passes(r).map(p => `<li>${e(p)}</li>`).join('') || '<li>Nothing fully passed</li>'}</ul>
<h2>Issues</h2>${r.issues.length ? `<div class="wrap"><table><thead><tr><th>Severity</th><th>Area</th><th>Page</th><th>Issue</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<p>No issues found.</p>'}
<h2>Screenshots</h2>${r.screenshots.map(x => `<p>${e(x.viewport)}, ${x.width}px</p><div class="shots">${x.files.map(f => `<figure><img src="${e(f)}" alt="${e(x.viewport)} screenshot ${e(f)}" loading="lazy"></figure>`).join('')}</div>`).join('')}
</main></body></html>`;
}

// ---------- command line ----------
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const [url, out = 'audit'] = process.argv.slice(2);
  if (!url){ console.error('Usage: node pipeline/audit.mjs <url> [out dir]'); process.exit(1); }
  const r = await runAudit(url, resolve(out));
  console.log(`${r.summary.blocker} blockers, ${r.summary.major} major, ${r.summary.minor} minor (${r.summary.pages} pages, ${r.stats.links} links, ${Math.round(r.ms / 1000)}s)`);
  console.log(`Report: ${join(resolve(out), 'report.md')}`);
}
