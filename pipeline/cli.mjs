#!/usr/bin/env node
// Command line for the Pipeline board, for people and AI agents. Needs the server running (node pipeline/server.mjs).
// env: PIPELINE_URL (default http://localhost:4390), PIPELINE_AGENT (your name on claims and history)
import { readFileSync } from 'node:fs';
import { userInfo } from 'node:os';

const BASE = (process.env.PIPELINE_URL || 'http://localhost:4390').replace(/\/$/, '');

const HELP = `Pipeline CLI

  stages                                 List buckets, who works them, and card counts
  add <url> [--name N] [--priority P]    Add a website to Targets (duplicates are skipped)
  import <file|->  [--priority P]        Add many: one per line, "url" or "url, name"
  list [stage] [--json]                  List cards, optionally in one bucket
  show <id> [--json]                     Show a card with its fields, history and the stage instructions
  claim <stage> [--id N] [--json]        Take the next card for a stage (exit code 3 if there's none)
  set <id> key=value ...                 Set fields (value @path reads a file; key= clears it)
  complete <id> [outcome] [key=value ...] [--note T]
                                         Finish the current stage and move the card on
  release <id> [--note T]                Give a claimed card back without finishing it
  move <id> <stage> [--note T]           Move a card to any bucket
  comment <id> <text>                    Add a note to the card's history
  delete <id>                            Delete a card

  --as NAME   who you are (default: $PIPELINE_AGENT or your user name)
  --force     complete a card someone else has claimed`;

// ---------- args ----------
const argv = process.argv.slice(2);
const flags = {}, pos = [];
for (let i = 0; i < argv.length; i++){
  const a = argv[i];
  if (a === '--json' || a === '--force' || a === '-h' || a === '--help') flags[a.replace(/^-+/, '')] = true;
  else if (a.startsWith('--')) flags[a.slice(2)] = argv[++i];
  else pos.push(a);
}
const by = flags.as || process.env.PIPELINE_AGENT || userInfo().username;
const [cmd, ...rest] = pos;

function die(msg, code = 1){ console.error(msg); process.exit(code); }

async function call(method, path, body){
  let res;
  try {
    res = await fetch(BASE + '/api' + path, {
      method, headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify({ by, ...body }) : undefined
    });
  } catch { die(`Can't reach the Pipeline server at ${BASE}. Start it with: node pipeline/server.mjs`); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) die(`Error: ${data.error || res.status}`);
  return data;
}

function fieldArgs(list){
  const fields = {};
  for (const kv of list){
    const i = kv.indexOf('=');
    if (i < 1) die(`Expected key=value, got "${kv}"`);
    const k = kv.slice(0, i); let v = kv.slice(i + 1);
    if (v.startsWith('@')) v = readFileSync(v.slice(1), 'utf8').trim();
    else v = v.replace(/\\n/g, '\n');
    fields[k] = v;
  }
  return fields;
}

// ---------- output ----------
let stageNames = null;
async function names(){
  if (!stageNames){
    const cfg = await call('GET', '/config');
    stageNames = Object.fromEntries(cfg.pipelines.flatMap(p => p.stages.map(s => [s.id, s.name])));
  }
  return stageNames;
}
const ago = t => { const m = Math.round((Date.now() - Date.parse(t)) / 60000); return m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`; };
const line = c => [`#${c.id}`.padEnd(6), c.name.slice(0, 32).padEnd(33), c.fields.score ? `${c.fields.score}/10 ${c.fields.rating || ''}`.padEnd(12) : ''.padEnd(12),
  c.claim ? `[${c.claim.by} · ${ago(c.claim.at)}]` : ''].join(' ').trimEnd();

async function printCard(c){
  if (flags.json) return console.log(JSON.stringify(c, null, 2));
  const n = await names();
  console.log(`#${c.id}  ${c.name}\n${c.url}\nStage: ${n[c.stage]} (${c.stage})${c.claim ? `  ·  claimed by ${c.claim.by} ${ago(c.claim.at)} ago` : ''}${c.priority ? `  ·  priority ${c.priority}` : ''}`);
  if (c.notes) console.log(`\nNotes: ${c.notes}`);
  const f = Object.entries(c.fields);
  if (f.length){ console.log('\nFields:'); for (const [k, v] of f) console.log(`  ${k}: ${String(v).includes('\n') ? '\n    ' + String(v).replace(/\n/g, '\n    ') : v}`); }
  const s = c.stageInfo;
  if (s){
    if (s.instructions) console.log(`\nWhat to do in ${s.name}:\n  ${s.instructions}`);
    if (s.requires?.length) console.log(`Required before completing: ${s.requires.join(', ')}`);
    if (s.outcomes?.length) console.log(`Outcomes: ${s.outcomes.map(o => `${o.id} → ${n[o.to]}`).join(', ')}`);
    if (s.requires?.includes('template')) console.log(`Templates: ${c.templates.join(', ')}`);
  }
  console.log('\nHistory:');
  for (const h of c.history.slice(-12)){
    const what = h.action === 'move' ? `moved ${n[h.from]} → ${n[h.to]}${h.outcome ? ` (${h.outcome})` : ''}` : h.action === 'update' ? `updated ${h.fields.join(', ')}` : h.action;
    console.log(`  ${h.at.slice(0, 16).replace('T', ' ')}  ${h.by}: ${what}${h.note ? ` — ${h.note}` : ''}`);
  }
}

// ---------- commands ----------
const id = rest[0];
const needId = () => { if (!id) die(`Usage: ${cmd} <id>`); return id; };

switch (cmd){
  case 'stages': {
    const [cfg, { cards }] = await Promise.all([call('GET', '/config'), call('GET', '/cards')]);
    for (const p of cfg.pipelines){
      console.log(`\n${p.name}`);
      for (const s of p.stages){
        const here = cards.filter(c => c.stage === s.id);
        const busy = here.filter(c => c.claim).length;
        console.log(`  ${s.id.padEnd(15)} ${s.name.padEnd(16)} ${String(here.length).padStart(4)} cards${busy ? ` (${busy} claimed)` : ''}   ${s.who === 'ai' ? 'AI' : s.who === 'human' ? 'human' : 'AI or human'}${s.pullFrom ? `, pulls from ${s.pullFrom.join(' then ')}` : ''}`);
      }
    }
    break;
  }
  case 'add': {
    if (!id) die('Usage: add <url> [--name N] [--priority P]');
    const r = await call('POST', '/cards', { url: id, name: flags.name, priority: flags.priority, notes: flags.notes });
    if (r.added.length) console.log(`Added #${r.added[0].id} ${r.added[0].name}`);
    else if (r.duplicates.length) console.log(`Already on the board as #${r.duplicates[0].id} (${r.duplicates[0].stage})`);
    else die(r.errors[0]?.error || 'Not added');
    break;
  }
  case 'import': {
    if (!id) die('Usage: import <file|->');
    const text = readFileSync(id === '-' ? 0 : id, 'utf8');
    const cards = text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'))
      .map(l => { const [url, ...nm] = l.split(/\s*[,\t]\s*/); return { url, name: nm.join(', '), priority: flags.priority }; })
      .filter(c => !/^url$/i.test(c.url));
    const r = await call('POST', '/cards', { cards });
    console.log(`Added ${r.added.length}, skipped ${r.duplicates.length} already on the board${r.errors.length ? `, ${r.errors.length} errors` : ''}.`);
    for (const e of r.errors) console.log(`  ${e.url}: ${e.error}`);
    break;
  }
  case 'list': {
    const { cards } = await call('GET', '/cards' + (id ? `?stage=${encodeURIComponent(id)}` : ''));
    if (flags.json){ console.log(JSON.stringify(cards, null, 2)); break; }
    if (!cards.length){ console.log('No cards.'); break; }
    const n = await names();
    for (const [s, name] of Object.entries(n)){
      const here = cards.filter(c => c.stage === s);
      if (!here.length) continue;
      if (!id) console.log(`\n${name}`);
      for (const c of here) console.log((id ? '' : '  ') + line(c));
    }
    break;
  }
  case 'show': await printCard((await call('GET', `/cards/${needId()}`)).card); break;
  case 'claim': case 'next': {
    if (!id) die('Usage: claim <stage>');
    const { card } = await call('POST', '/claim', { stage: id, id: flags.id });
    if (!card){ if (flags.json) console.log('null'); else console.error(`Nothing waiting for ${id}.`); process.exit(3); }
    await printCard(card);
    break;
  }
  case 'set': {
    const r = await call('PATCH', `/cards/${needId()}`, { fields: fieldArgs(rest.slice(1)), ...(flags.name && { name: flags.name }), ...(flags.priority && { priority: flags.priority }), ...(flags.notes && { notes: flags.notes }) });
    console.log(`Updated #${r.card.id}`);
    break;
  }
  case 'complete': case 'done': {
    const extra = rest.slice(1);
    const outcome = extra[0] && !extra[0].includes('=') ? extra.shift() : undefined;
    const r = await call('POST', `/cards/${needId()}/complete`, { outcome, note: flags.note, fields: fieldArgs(extra), force: flags.force });
    console.log(`#${r.card.id} moved to ${(await names())[r.card.stage]}`);
    break;
  }
  case 'release': await call('POST', `/cards/${needId()}/release`, { note: flags.note }); console.log(`Released #${id}`); break;
  case 'move': {
    if (!rest[1]) die('Usage: move <id> <stage>');
    const r = await call('POST', `/cards/${id}/move`, { to: rest[1], note: flags.note });
    console.log(`#${r.card.id} moved to ${(await names())[r.card.stage]}`);
    break;
  }
  case 'comment': {
    if (!rest[1]) die('Usage: comment <id> <text>');
    await call('POST', `/cards/${id}/comment`, { text: rest.slice(1).join(' ') });
    console.log(`Noted on #${id}`);
    break;
  }
  case 'delete': await call('DELETE', `/cards/${needId()}`); console.log(`Deleted #${id}`); break;
  default: console.log(HELP); if (cmd && cmd !== "help" && !flags.help && !flags.h) process.exit(1);
}
