#!/usr/bin/env node
// Builds the nursery prospect list from the Care Inspectorate datastore CSV.
// Keeps active private and voluntary daycare services that run a nursery or playgroup, and drops
// providers with more than 3 services (chains have their own web teams). Council nurseries can't buy.
// The website is a guess from the service's email domain; check-sites.mjs confirms it.
// Usage: node prospects/nursery/build-list.mjs <datastore.csv>
// The CSV: https://www.careinspectorate.scot/resources-data/data-and-statistics/datastore (updated monthly)
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) { console.error('Usage: node prospects/nursery/build-list.mjs <datastore.csv>'); process.exit(1); }

function parseCsv(text){
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++){
    const ch = text[i];
    if (q){
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h.replace(/^﻿/, ''), r[i] ?? ''])));
}

const FREE_MAIL = /(^|\.)(gmail|googlemail|hotmail|yahoo|outlook|live|msn|btinternet|btopenworld|btconnect|virgin|ymail|rocketmail|fsmail|freeuk|care4free|tesco|orange|icloud|me|mac|aol|sky|talktalk|virginmedia|blueyonder|tiscali|ntlworld|mail|protonmail|gmx|zoho|onmicrosoft|glow\.sch|sch)\.|\.gov\.uk$|\.sch\.uk$|(^|\.)nhs\.(net|uk)$/i;
const NOT_NURSERY = /after.?school|out of school|breakfast club|holiday club|play ?scheme|\bosc\b|school care|crèche|creche/i;

const all = parseCsv(readFileSync(file, 'utf8'));
const daycare = all.filter(r => r.CareService === 'Day Care of Children' && r.ServiceStatus === 'Active'
  && (r.ServiceType === 'Private' || r.ServiceType === 'Voluntary or Not for Profit'));
const perProvider = daycare.reduce((m, r) => m.set(r.ServiceProvider, (m.get(r.ServiceProvider) || 0) + 1), new Map());
const keep = daycare.filter(r => /Nursery|Playgroup/.test(r.AdditionalSubtypes) && !NOT_NURSERY.test(r.ServiceName)
  && perProvider.get(r.ServiceProvider) <= 3 && r.Council_Area_Name !== 'outside Scotland');
keep.sort((a, b) => a.ServiceName.localeCompare(b.ServiceName));

const grade = v => v === '' ? null : Number(v);
const records = keep.map((r, i) => {
  const page = Math.floor(i / 10) + 1, pos = i % 10 + 1;
  const email = r.Eforms_email_address.trim();
  const domain = (email.split('@')[1] || '').toLowerCase().trim();
  const address = [r.Address_line_1, r.Address_line_2, r.Address_line_3, r.Address_line_4, r.Service_town, r.Service_Postcode]
    .map(s => s.trim()).filter(Boolean).join(', ');
  return {
    id: `n${String(page).padStart(3, '0')}-${String(pos).padStart(2, '0')}`, page, pos,
    name: r.ServiceName.trim(),
    csNumber: r.CSNumber,
    ciUrl: `https://www.careinspectorate.scot/find-care?search=${encodeURIComponent(r.ServiceName.trim())}`,
    website: null,
    websiteGuess: domain && !FREE_MAIL.test(domain) ? `https://${domain}/` : null,
    address, town: r.Service_town.trim(), postcode: r.Service_Postcode.trim(), council: r.Council_Area_Name,
    phone: r.Service_Phone_Number.trim() || null, email: email || null, manager: r.Manager_Name.trim() || null,
    provider: r.ServiceProvider.trim(), sector: r.ServiceType === 'Private' ? 'Private' : 'Voluntary',
    providerServices: perProvider.get(r.ServiceProvider),
    kinds: r.AdditionalSubtypes, under3s: /under 3s/.test(r.Subtype), places: Number(r.Registered_Places) || null,
    simdDecile: Number(r.SIMD2020_Decile) || null, registered: r.DateReg,
    grades: {
      min: grade(r.MinGrade), max: grade(r.MaxGrade), published: r.Publication_of_Latest_Grading || null,
      careAndPlay: grade(r.KQ_Care_Play_and_Learning), setting: grade(r.KQ_Setting),
      staffTeam: grade(r.KQ_Staff_Team), leadership: grade(r.KQ_Leadership)
    },
    lastInspection: r.Last_inspection_Date || null
  };
});

const out = join(HERE, 'data');
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
for (let p = 0; p * 10 < records.length; p++)
  writeFileSync(join(out, `page-${String(p + 1).padStart(3, '0')}.json`), JSON.stringify(records.slice(p * 10, p * 10 + 10), null, 1) + '\n');
console.log(`${records.length} nurseries (${records.filter(r => r.websiteGuess).length} with a website guess from email) in ${Math.ceil(records.length / 10)} pages`);
