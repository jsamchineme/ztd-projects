#!/usr/bin/env node
// Adds grades for the nurseries the screenshot graders skip, after they've written grades/*.json:
//   Bad       a website was found but is only a Facebook page, doesn't load or is parked (a new-site prospect)
//   NoSite    no website found, or none looked for yet (search.kind "unsearched")
//   Excluded  a chain, college or university nursery, or a placeholder site (see `exclude`)
// Re-running is safe: it only fills in ids that have no grade yet.
// Usage: node prospects/nursery/grade-rest.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(HERE, 'grades'), { recursive: true });
const count = {};
for (const f of readdirSync(join(HERE, 'data')).filter(f => f.endsWith('.json')).sort()){
  const recs = JSON.parse(readFileSync(join(HERE, 'data', f), 'utf8'));
  const gfile = join(HERE, 'grades', f);
  const grades = existsSync(gfile) ? JSON.parse(readFileSync(gfile, 'utf8')) : [];
  const have = new Set(grades.map(g => g.id));
  for (const r of recs){
    if (have.has(r.id)) continue;
    const s = r.site, kind = r.search?.kind;
    let grade, reason;
    if (r.exclude) [grade, reason] = ['Excluded', r.exclude];
    else if (r.website && /facebook\.com/.test(r.website)) [grade, reason] = ['Bad', 'Facebook page only: no website'];
    else if (r.website && s && !s.loads) [grade, reason] = ['Bad', `Website doesn't load (${s.error})`];
    else if (r.website && s?.parked) [grade, reason] = ['Bad', 'Website is parked or empty'];
    else if (r.website && !s) [grade, reason] = ['NoSite', 'Website found but not checked yet: run check-sites.mjs'];
    else if (kind === 'unsearched' || !kind && !r.websiteGuess) [grade, reason] = ['NoSite', 'No website from the email domain; not searched for yet'];
    else if (r.website) continue; // a working site the screenshot graders should have graded
    else [grade, reason] = ['NoSite', r.websiteGuess ? `Email domain ${new URL(r.websiteGuess).hostname} has no working nursery website` : 'Searched: no website found'];
    grades.push({ id: r.id, grade, reason });
    count[grade] = (count[grade] || 0) + 1;
  }
  const order = new Map(recs.map((r, i) => [r.id, i]));
  grades.sort((a, b) => order.get(a.id) - order.get(b.id));
  writeFileSync(gfile, JSON.stringify(grades, null, 1) + '\n');
}
console.log('Added', count);
