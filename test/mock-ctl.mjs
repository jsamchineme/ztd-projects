#!/usr/bin/env node
// A stand-in for studio-ctl for local tests: no root, no systemd. Projects live in $MOCK_ROOT/projects,
// services run as plain child processes tracked in $MOCK_ROOT/state.json.
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, rmSync, openSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.MOCK_ROOT;
const HERE = dirname(fileURLToPath(import.meta.url));
const FAKE = join(HERE, '..', 'ops', 'fake-claude.mjs');
const STARTERS = join(HERE, '..', 'ops', 'starters');
const P = join(ROOT, 'projects');
const STATE = join(ROOT, 'state.json');
mkdirSync(P, { recursive: true });
const st = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { units: {} };
const save = () => writeFileSync(STATE, JSON.stringify(st, null, 2));
const repo = p => join(P, p, 'repo');
const readStdin = () => { try { return readFileSync(0, 'utf8'); } catch { return ''; } };
const alive = pid => { try { process.kill(pid, 0); return true; } catch { return false; } };
const [cmd, ...a] = process.argv.slice(2);

function startUnit(u){
  const x = st.units[u]; if (!x) throw new Error('no unit');
  if (x.pid && alive(x.pid)) return;
  const log = openSync(join(ROOT, u + '.log'), 'a');
  const c = spawn('/bin/bash', ['-lc', x.command], { cwd: x.cwd, env: { ...process.env, ...x.env, PORT: String(x.port) }, detached: true, stdio: ['ignore', log, log] });
  c.unref(); x.pid = c.pid; x.since = new Date().toISOString(); save();
}
function stopUnit(u){ const x = st.units[u]; if (x?.pid && alive(x.pid)) try { process.kill(-x.pid, 'SIGTERM'); } catch { process.kill(x.pid, 'SIGTERM'); } if (x) x.pid = null; save(); }

switch (cmd){
  case 'apply': {
    const spec = JSON.parse(readStdin());
    for (const s of spec.services) st.units[`ztd-${a[0]}-${s.name}`] = { ...(st.units[`ztd-${a[0]}-${s.name}`] || {}), command: s.command, port: s.port, env: s.env, cwd: repo(a[0]) };
    save(); console.log('{"ok":true}'); break;
  }
  case 'svc': {
    const u = `ztd-${a[0]}-${a[1]}`;
    if (a[2] === 'start') startUnit(u); else if (a[2] === 'stop') stopUnit(u); else if (a[2] === 'restart'){ stopUnit(u); await new Promise(r => setTimeout(r, 300)); startUnit(u); }
    console.log('ok'); break;
  }
  case 'status': {
    const out = {};
    for (const [u, x] of Object.entries(st.units)) out[u] = { ActiveState: x.pid && alive(x.pid) ? 'active' : 'inactive', SubState: 'x', MainPID: String(x.pid || 0), MemoryCurrent: '31457280', ActiveEnterTimestamp: x.since || '', NRestarts: '0', UnitFileState: 'enabled' };
    console.log(JSON.stringify(out)); break;
  }
  case 'logs': {
    const f = join(ROOT, `ztd-${a[0]}-${a[1]}.log`);
    if (existsSync(f)) process.stdout.write(readFileSync(f, 'utf8').split('\n').slice(-50).map(l => `2026-01-01T00:00:00 host x[1]: ${l}`).join('\n') + '\n');
    if (a[3] === 'follow') setInterval(() => {}, 1e6);
    break;
  }
  case 'project-create': {
    const url = readStdin().trim();
    mkdirSync(join(P, a[0]), { recursive: true });
    if (url) { const r = spawnSync('git', ['clone', '--depth', '20', url, repo(a[0])]); if (r.status) { console.error(String(r.stderr)); process.exit(1); } }
    else { cpSync(join(STARTERS, a[1]), repo(a[0]), { recursive: true }); spawnSync('git', ['init', '-q', '-b', 'main'], { cwd: repo(a[0]) }); spawnSync('git', ['add', '-A'], { cwd: repo(a[0]) }); spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'Start project'], { cwd: repo(a[0]) }); }
    console.log('{"ok":true}'); break;
  }
  case 'project-delete': {
    for (const u of Object.keys(st.units)) if (u.startsWith(`ztd-${a[0]}-`)){ stopUnit(u); delete st.units[u]; }
    save(); rmSync(join(P, a[0]), { recursive: true, force: true }); console.log('{"ok":true}'); break;
  }
  case 'git': {
    const cwd = repo(a[0]);
    if (!existsSync(join(cwd, '.git'))){ console.error('Not a git repository'); process.exit(3); }
    // Without the identity of whoever runs the tests (a Studio chat sets GIT_AUTHOR_* etc.), as studio-ctl's clean env is.
    const gitEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^GIT_(AUTHOR|COMMITTER)_/.test(k)));
    const g = (...x) => spawnSync('git', x, { cwd, encoding: 'utf8', env: gitEnv });
    const act = a[1];
    if (act === 'status') process.stdout.write(g('status', '--porcelain=v1', '-b', '--untracked-files=all').stdout);
    else if (act === 'diff'){ process.stdout.write(g('diff', 'HEAD').stdout); for (const f of g('ls-files', '--others', '--exclude-standard').stdout.split('\n').filter(Boolean)) process.stdout.write(g('diff', '--no-index', '/dev/null', f).stdout); }
    else if (act === 'log') process.stdout.write(g('log', '-n', '30', '--date=iso-strict', '--pretty=format:%H%x1f%an%x1f%ad%x1f%s').stdout);
    else if (act === 'commit'){ const c = JSON.parse(readStdin()); g('add', '-A'); const r = g('-c', `user.name=${c.name}`, '-c', `user.email=${c.email}`, 'commit', '-qm', c.message); if (r.status){ console.error(r.stderr || r.stdout); process.exit(1); } }
    else if (act === 'discard'){ const c = JSON.parse(readStdin()); for (const f of c.files){ if (g('ls-files', '--error-unmatch', '--', f).status === 0) g('checkout', 'HEAD', '--', f); else g('clean', '-fq', '--', f); } console.log('{"ok":true}'); }
    else if (act === 'revert-last') process.stdout.write(g('revert', '--no-edit', 'HEAD').stdout);
    break;
  }
  case 'ls': process.stdout.write(spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: repo(a[0]), encoding: 'utf8' }).stdout); break;
  case 'cat': process.stdout.write(readFileSync(join(repo(a[0]), readStdin().trim()), 'utf8')); break;
  // Studio self-update: pretend there is one new commit; "updating" finishes at once.
  case 'studio-source': console.log(JSON.stringify({ project: 'pipeline', path: 'studio', head: { hash: 'b'.repeat(40), author: 'Test', date: new Date().toISOString(), subject: 'New Studio feature' },
    pending: a[0] && a[0] !== '-' ? [{ hash: 'b'.repeat(40), author: 'Test', date: new Date().toISOString(), subject: 'New Studio feature' }] : null, dirty: ['studio/README.md'], updating: false })); break;
  case 'studio-update': writeFileSync(join(ROOT, 'update.log'), `${new Date().toISOString()} host bash[1]: studio-update finished: 0\n`); console.log(JSON.stringify({ ok: true, commit: 'b'.repeat(40) })); break;
  case 'studio-update-log': console.log(JSON.stringify({ updating: false, log: existsSync(join(ROOT, 'update.log')) ? readFileSync(join(ROOT, 'update.log'), 'utf8') : '' })); break;
  case 'agent': {
    const req = JSON.parse(readStdin());
    if (!req.token && !req.apiKey){ console.error('No Claude connection'); process.exit(4); }
    const args = ['-p', '--output-format', 'stream-json', '--verbose', '--model', a[1], '--permission-mode', a[2] === 'plan' ? 'plan' : 'bypassPermissions'];
    if (a[3] && a[3] !== '-') args.push('--resume', a[3]);
    const c = spawn('node', [FAKE, ...args], { cwd: repo(a[0]), env: { ...process.env, CLAUDE_CODE_OAUTH_TOKEN: req.token || '', ANTHROPIC_API_KEY: req.apiKey || '', ...(req.email ? { GIT_AUTHOR_NAME: req.name, GIT_COMMITTER_NAME: req.name, GIT_AUTHOR_EMAIL: req.email, GIT_COMMITTER_EMAIL: req.email } : {}) }, stdio: ['pipe', 'inherit', 'inherit'] });
    c.stdin.end(req.prompt);
    process.on('SIGTERM', () => c.kill('SIGTERM'));
    c.on('exit', code => process.exit(code ?? 1));
    break;
  }
  case 'github-backup': {
    // The real ops/github-backup.sh, pushing to a local bare repo that stands in for GitHub.
    const cfg = join(ROOT, 'github-backup.json'), gh = join(ROOT, 'github.git'), last = join(ROOT, 'github-backup', 'last.json');
    let url = existsSync(cfg) ? JSON.parse(readFileSync(cfg, 'utf8')).shown : '';
    if (a[0] === 'set'){
      url = String(JSON.parse(readStdin()).url || '').replace(/^https:\/\/github\.com\/(.+?)\/?$/, 'git@github.com:$1.git');
      if (!/^git@github\.com:[\w.-]+\/[\w.-]+\.git$/.test(url)){ console.error('Use the repo’s address from GitHub'); process.exit(2); }
      if (!existsSync(gh)) spawnSync('git', ['init', '-q', '--bare', gh]);
      writeFileSync(cfg, JSON.stringify({ url: gh, shown: url }));
    } else if (a[0] === 'off'){ rmSync(cfg, { force: true }); url = ''; }
    else if (a[0] === 'run'){
      const r = spawnSync('bash', [join(HERE, '..', 'ops', 'github-backup.sh')], { encoding: 'utf8',
        env: { ...process.env, PROJECTS_DIR: P, STATE_DIR: join(ROOT, 'github-backup'), CONFIG_FILE: cfg, KEY_FILE: '/dev/null' } });
      if (r.status !== 0 && !existsSync(last)){ console.error(r.stderr || r.stdout); process.exit(1); }
    }
    console.log(JSON.stringify({ url, publicKey: url ? 'ssh-ed25519 AAAAFAKEKEY ztd-studio-backup@localhost' : '', last: existsSync(last) ? JSON.parse(readFileSync(last, 'utf8')) : null, running: false }));
    break;
  }
  case 'project-user': console.log(JSON.stringify(st.ownUsers?.[a[0]] ? { user: st.ownUsers[a[0]], own: true } : { user: 'ztd', own: false })); break;
  case 'project-own-user': {
    if (st.ownUsers?.[a[0]]){ console.error('This project already runs as its own user'); process.exit(2); }
    const running = Object.entries(st.units).filter(([u, x]) => u.startsWith(`ztd-${a[0]}-`) && x.pid && alive(x.pid)).map(([u]) => u);
    for (const u of running) stopUnit(u);
    st.ownUsers = { ...st.ownUsers, [a[0]]: `zp-${a[0]}` }; save();
    console.log(JSON.stringify({ user: `zp-${a[0]}`, running: running.map(u => u.slice(`ztd-${a[0]}-`.length)) }));
    break;
  }
  case 'scope-check': {
    const req = JSON.parse(readStdin());
    const r = spawnSync('node', [FAKE, '-p', '--model', 'haiku', '--no-session-persistence'], { encoding: 'utf8', input: `<purpose>\n${req.purpose}\n</purpose>\n<request>\n${req.prompt}\n</request>` });
    process.stdout.write(r.stdout); process.exit(r.status ?? 1);
  }
  case 'claude-token': {
    const c = spawn('node', [FAKE, 'setup-token'], { stdio: 'inherit' });
    process.on('SIGTERM', () => c.kill('SIGTERM'));
    c.on('exit', code => process.exit(code ?? 1));
    break;
  }
  case 'vhost': console.log(JSON.stringify({ ok: true, host: a[0] })); break;
  case 'vhost-remove': console.log('{"ok":true}'); break;
  default: console.error('unknown ' + cmd); process.exit(2);
}
