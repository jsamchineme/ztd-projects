#!/usr/bin/env node
// A stand-in for the claude CLI, for testing Studio without spending money.
// Enable it by setting "fakeClaude" in /etc/studio/ctl.json to this file's path; remove it to use real Claude.
import { writeFileSync, readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const out = o => process.stdout.write(JSON.stringify(o) + '\n');
const sleep = ms => new Promise(r => setTimeout(r, ms));

if (args[0] === 'setup-token'){
  console.log('Opening browser to sign in…');
  console.log('Browser didn\'t open? Use the url below to sign in (c to copy)\n');
  console.log('https://claude.ai/oauth/authorize?code=true&client_id=fake&state=fake\n');
  process.stdout.write('Paste code here if prompted > ');
  const rl = createInterface({ input: process.stdin });
  rl.on('line', line => {
    if (line.trim() === 'bad') { console.log('\nOAuth error: invalid code'); process.exit(1); }
    console.log('\n\n✓ Long-lived authentication token created successfully!\n\nYour OAuth token (valid for 1 year):\n\nsk-ant-oat01-FAKE' + 'x'.repeat(80) + '\n\nStore this token securely.');
    process.exit(0);
  });
} else if (args.includes('--no-session-persistence')){
  // A scope check (studio-ctl scope-check): anything mentioning "unrelated" is off-topic.
  let input = '';
  process.stdin.on('data', d => { input += d; });
  process.stdin.on('end', () => console.log(/<request>[\s\S]*unrelated/i.test(input) ? 'OFF: Asks for an unrelated app, not work on this project.' : 'ON'));
} else {
  let prompt = '';
  process.stdin.on('data', d => { prompt += d; });
  process.stdin.on('end', async () => {
    const i = args.indexOf('--resume');
    const session = i >= 0 ? args[i + 1] : randomUUID();
    const token = process.env.CLAUDE_CODE_OAUTH_TOKEN || process.env.ANTHROPIC_API_KEY || '';
    out({ type: 'system', subtype: 'init', session_id: session, model: args[args.indexOf('--model') + 1], cwd: process.cwd() });
    if (!token){ out({ type: 'result', subtype: 'error', is_error: true, result: 'Not logged in', session_id: session }); return; }
    if (/slow/.test(prompt)) await sleep(15000);
    for (const w of 'Let me look at the project first.'.split(' ')){
      out({ type: 'stream_event', event: { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: w + ' ' } } });
      await sleep(40);
    }
    out({ type: 'assistant', message: { content: [{ type: 'thinking', thinking: 'The user asked: ' + prompt.slice(0, 80) }] } });
    out({ type: 'assistant', message: { content: [{ type: 'text', text: 'Let me look at the project first.' }] } });
    out({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'Bash', input: { command: 'ls', description: 'List files' } }] } });
    out({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'server.mjs\npublic\n', is_error: false }] } });
    // "leave it running": starts a command in the background and ends the turn without waiting for it.
    if (/leave it running/i.test(prompt)){
      out({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'tb', name: 'Bash', input: { command: 'sleep 600', run_in_background: true } }] } });
      out({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'tb', content: 'Command running in background with ID: b1', is_error: false }] } });
    }
    // "print the docs": a command whose output only mentions background work.
    if (/print the docs/i.test(prompt)){
      out({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 'td', name: 'Bash', input: { command: 'cat README.md' } }] } });
      out({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'td', content: 'Notes\nAnything left running in the background is stopped.\nCommand running in background with ID: b2', is_error: false }] } });
    }
    // Like Claude Code, it keeps each session's prompts in a transcript under the config folder, and a resumed session
    // remembers the prompts before (so tests can tell a session moved between machines with its chat).
    const dir = join(process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'projects', process.cwd().replace(/[^a-zA-Z0-9]/g, '-'));
    const transcript = join(dir, session + '.jsonl');
    const remembers = i < 0 ? 0 : existsSync(transcript) ? readFileSync(transcript, 'utf8').split('\n').filter(Boolean).length : 'nothing (no transcript)';
    mkdirSync(dir, { recursive: true });
    appendFileSync(transcript, JSON.stringify({ type: 'user', cwd: process.cwd(), prompt: prompt.slice(0, 200) }) + '\n');
    let edited = false;
    if (/edit|change|write/i.test(prompt)){
      writeFileSync('STUDIO-TEST.md', `Written by the fake Claude.\n\nPrompt: ${prompt}\n`);
      edited = true;
      out({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 't2', name: 'Write', input: { file_path: process.cwd() + '/STUDIO-TEST.md', content: '…' } }] } });
      out({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't2', content: 'File created', is_error: false }] } });
    }
    const reply = `**Fake Claude** got your prompt (${prompt.length} characters) in \`${process.cwd()}\`${edited ? ' and wrote `STUDIO-TEST.md`' : ''}.\n\n- model: ${args[args.indexOf('--model') + 1]}\n- mode: ${args[args.indexOf('--permission-mode') + 1]}\n- resumed: ${i >= 0 ? 'yes' : 'no'}\n- remembers: ${remembers}\n- attached: ${(prompt.match(/^- \//gm) || []).length}`;
    out({ type: 'assistant', message: { content: [{ type: 'text', text: reply }] } });
    out({ type: 'result', subtype: 'success', is_error: false, result: reply, session_id: session, total_cost_usd: 0.0123, duration_ms: 1500, num_turns: 3 });
  });
}
