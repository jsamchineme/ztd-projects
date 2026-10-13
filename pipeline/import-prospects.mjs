#!/usr/bin/env node
// Loads graded prospects (data/*.json + grades/*.json from a prospects folder) into the Pipeline,
// straight into the bucket for each grade. Practices that share one website become one card.
// Usage: node pipeline/import-prospects.mjs <prospects dir> [--grades Bad,Average] [--dry-run]
// env: PIPELINE_URL (default http://localhost:4390), PIPELINE_AGENT
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const dir = args.find(a => !a.startsWith('--'));
if (!dir) { console.error('Usage: node pipeline/import-prospects.mjs <prospects dir> [--grades Bad,Average] [--dry-run]'); process.exit(1); }
const gi = args.indexOf('--grades');
const wanted = (gi >= 0 ? args[gi + 1] : 'Bad,Average').split(',').map(s => s.trim().toLowerCase());
const dry = args.includes('--dry-run');
const BASE = (process.env.PIPELINE_URL || 'http://localhost:4390').replace(/\/$/, '');
// NoSite (nurseries with no website found) goes in as a new-site prospect; ask for it with --grades NoSite.
const STAGE = { bad: 'bad', average: 'average', good: 'good', nosite: 'bad' };

const readAll = sub => readdirSync(join(dir, sub)).filter(f => f.endsWith('.json')).sort()
  .flatMap(f => JSON.parse(readFileSync(join(dir, sub, f), 'utf8')));
const records = new Map(readAll('data').map(r => [r.id, r]));
const grades = readAll('grades');

// Facebook "login?next=<page>" links all look alike once the query is dropped, so use the page they point to.
function siteUrl(r){
  let u = r.website;
  if (!u) return null;
  try {
    const p = new URL(u);
    if (/(^|\.)facebook\.com$/.test(p.hostname) && p.pathname.startsWith('/login')){
      const next = p.searchParams.get('next');
      if (next) u = next;
    }
  } catch {}
  return u;
}
const key = u => u.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '').replace(/\/+$/, '');

function signals(s){
  if (!s) return [];
  return [
    s.copyrightYear && `© ${s.copyrightYear}`,
    s.bookingCta === false ? 'No booking button' : s.bookingCta && 'Booking button',
    s.telLink === false ? 'No tap-to-call' : s.telLink && 'Tap-to-call',
    s.mobileOverflowPx > 0 && `Scrolls sideways on phone (${s.mobileOverflowPx}px)`,
    s.mobileLoadS && `Mobile load ${s.mobileLoadS}s`,
    s.builder && `Built with ${s.builder}`,
    s.status && s.status >= 400 && `HTTP ${s.status}`
  ].filter(Boolean);
}

const cards = new Map();
let skipped = 0;
for (const g of grades){
  const grade = String(g.grade).toLowerCase();
  if (!wanted.includes(grade)) { skipped++; continue; }
  const r = records.get(g.id);
  if (!r) { console.warn(`No record for ${g.id}`); continue; }
  const site = siteUrl(r);
  // GP and dental records link to their NHS listing; nursery records to their Care Inspectorate search.
  const nhs = r.nhsUrl && r.nhsUrl.replace(/ /g, '%20');
  const listing = nhs || r.ciUrl;
  const listingName = nhs ? 'NHS listing' : 'Care Inspectorate';
  const url = site || listing;
  if (!url) { console.warn(`No website or ${listingName} for ${r.name}`); continue; }
  const k = key(url);
  const shot = r.shot ? resolve(dir, r.shot) : null;
  const where = [r.name, r.address].filter(Boolean).join(', ');
  const phone = r.site?.phone || r.phone;
  const gr = r.grades;
  const noteLines = [
    `${where}${phone ? ` · ${phone}` : ''}${r.email ? ` · ${r.email}` : ''}`,
    r.csNumber && `Care Inspectorate ${r.csNumber}: ${r.sector}, ${r.places || '?'} places${r.under3s ? ', takes under 3s' : ''}${r.manager ? `, manager ${r.manager}` : ''}`,
    gr?.min && `Care Inspectorate grades (published ${gr.published}): ${[['care, play and learning', gr.careAndPlay], ['setting', gr.setting], ['staff team', gr.staffTeam], ['leadership', gr.leadership]].filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ')} (6 = excellent)`,
    !site && `No website: card links to the ${listingName}.`,
    listing && site && `${listingName}: ${listing}`,
    shot && `Screenshot: ${shot}`
  ].filter(Boolean);
  const analysis = [`${g.grade}: ${g.reason}`, ...signals(r.site).map(s => `- ${s}`)].join('\n');
  const existing = cards.get(k);
  if (existing){
    // Same website for another location: one redesign, one pitch.
    existing.notes += `\n\nAlso uses this site: ${noteLines.join('\n')}`;
    existing.name += ` + ${r.name}`;
    if (grade === 'bad' && existing.stage !== 'bad') { existing.stage = 'bad'; existing.fields.rating = 'bad'; }
    continue;
  }
  cards.set(k, {
    url, name: r.name, stage: STAGE[grade], notes: noteLines.join('\n'),
    fields: { rating: STAGE[grade], analysis, ...(phone && { contact: phone }) }
  });
}

const list = [...cards.values()];
const by = list.reduce((o, c) => (o[c.stage] = (o[c.stage] || 0) + 1, o), {});
console.log(`${list.length} cards from ${grades.length - skipped} graded practices (${Object.entries(by).map(([s, n]) => `${n} ${s}`).join(', ')})`);
if (dry) { console.log(JSON.stringify(list.slice(0, 2), null, 2)); process.exit(0); }

let res;
try {
  res = await fetch(BASE + '/api/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ by: process.env.PIPELINE_AGENT || 'prospect-import', cards: list }) });
} catch { console.error(`Can't reach the Pipeline server at ${BASE}. Start it with: make pipeline`); process.exit(1); }
const out = await res.json();
if (!res.ok) { console.error(out.error); process.exit(1); }
console.log(`Added ${out.added.length}, skipped ${out.duplicates.length} already on the board${out.errors.length ? `, ${out.errors.length} errors` : ''}.`);
for (const e of out.errors) console.log(`  ${e.url}: ${e.error}`);
