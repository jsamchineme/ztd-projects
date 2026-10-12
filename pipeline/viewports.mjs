#!/usr/bin/env node
// Screenshots a page at phone, tablet and desktop widths, and reports layout problems a person should look at:
// sideways scrolling, elements poking past the screen edge, and text that overlaps or is clipped.
// Usage: node pipeline/viewports.mjs <url> <out dir> [width,width,...]
import { chromium } from 'playwright-core';
import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { CHROME } from './audit.mjs';

export const VIEWPORTS = [
  { name: 'phone-360', width: 360, height: 780, mobile: true },
  { name: 'phone-390', width: 390, height: 844, mobile: true },
  { name: 'phone-430', width: 430, height: 932, mobile: true },
  { name: 'tablet-600', width: 600, height: 960, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'tablet-834', width: 834, height: 1194, mobile: true },
  { name: 'tablet-1024', width: 1024, height: 768, mobile: true },
  { name: 'desktop-1280', width: 1280, height: 800, mobile: false },
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false }
];
const SLICE = 1600;

export async function shoot(url, outDir, widths){
  await mkdir(outDir, { recursive: true });
  for (const f of await readdir(outDir)) if (/\.(png|json)$/.test(f)) await rm(join(outDir, f));
  const list = widths ? VIEWPORTS.filter(v => widths.includes(v.width)) : VIEWPORTS;
  const browser = await chromium.launch({ executablePath: CHROME });
  const report = [];
  try {
    for (const vp of list){
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'load' });
      // Load lazy images, then return to the top.
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight){ scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } scrollTo(0, 0); });
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(400);
      const issues = await page.evaluate(() => {
        const out = [], W = innerWidth, de = document.documentElement;
        if (de.scrollWidth > W) out.push(`Page scrolls sideways: ${de.scrollWidth - W}px wider than the screen`);
        const name = el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.classList[0] ? '.' + [...el.classList].slice(0, 2).join('.') : ''}`;
        // Screen-reader-only text (1px boxes, clipped) and off-screen skip links are hidden on purpose.
        const srOnly = el => { for (let e = el; e && e !== document.body; e = e.parentElement){ const r = e.getBoundingClientRect(), s = getComputedStyle(e); if ((r.width <= 2 && r.height <= 2) || s.clipPath === 'inset(50%)' || (s.clip && s.clip !== 'auto') || r.right < -500) return true; } return false; };
        const visible = el => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.getBoundingClientRect().width > 0 && !srOnly(el); };
        // Elements past the right edge (ignoring ones inside their own horizontal scroller).
        const scrollerOf = el => { for (let p = el.parentElement; p; p = p.parentElement){ const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return p; } return null; };
        let past = 0;
        for (const el of document.querySelectorAll('body *')){
          if (!visible(el)) continue;
          const r = el.getBoundingClientRect();
          if ((r.right > W + 1 || r.left < -1) && !scrollerOf(el) && past++ < 6) out.push(`Past the screen edge: ${name(el)} (${Math.round(r.left)}–${Math.round(r.right)}px)`);
        }
        // Text clipped inside its own box.
        let clipped = 0;
        for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,dt,dd,td,th,span,label')){
          if (!visible(el) || !el.textContent.trim()) continue;
          const s = getComputedStyle(el);
          if ((s.overflow === 'hidden' || s.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 2 && s.textOverflow !== 'ellipsis' && clipped++ < 6)
            out.push(`Text cut off: ${name(el)} “${el.textContent.trim().slice(0, 40)}”`);
        }
        // Headings and buttons that overlap each other.
        const boxes = [...document.querySelectorAll('h1,h2,h3,a.btn,button,.button,[class*="btn"]')].filter(visible).map(el => ({ el, r: el.getBoundingClientRect() }));
        let overlaps = 0;
        for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++){
          const a = boxes[i], b = boxes[j];
          if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
          const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
          if (x > 4 && y > 4 && overlaps++ < 6) out.push(`Overlapping: ${name(a.el)} and ${name(b.el)}`);
        }
        return { issues: out, height: de.scrollHeight };
      });
      const files = [], total = Math.min(issues.height, SLICE * 8);
      for (let y = 0, i = 1; y < total; y += SLICE, i++){
        const file = `${vp.name}-${i}.png`;
        await page.screenshot({ path: join(outDir, file), fullPage: true, clip: { x: 0, y, width: vp.width, height: Math.min(SLICE, total - y) } });
        files.push(file);
      }
      report.push({ viewport: vp.name, width: vp.width, height: issues.height, issues: issues.issues, files });
      await ctx.close();
    }
  } finally { await browser.close(); }
  await writeFile(join(outDir, 'viewports.json'), JSON.stringify(report, null, 1));
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname){
  const [url, out, w] = process.argv.slice(2);
  if (!url || !out){ console.error('Usage: node pipeline/viewports.mjs <url> <out dir> [360,768,...]'); process.exit(1); }
  const r = await shoot(url, resolve(out), w && w.split(',').map(Number));
  for (const v of r) console.log(`${v.viewport.padEnd(13)} ${v.issues.length ? v.issues.length + ' to look at' : 'no layout flags'} · ${v.files.length} shot${v.files.length > 1 ? 's' : ''}${v.issues.length ? '\n   - ' + v.issues.join('\n   - ') : ''}`);
}
