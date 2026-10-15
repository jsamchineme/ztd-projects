// Runs the root helper (studio-ctl) through sudo.
import { spawn } from 'node:child_process';
import { CTL, CTL_SUDO } from './config.mjs';

// keepOpen leaves stdin open for interactive commands (Claude sign-in).
export function spawnCtl(args, { stdin, keepOpen = false } = {}){
  const [cmd, argv] = CTL_SUDO ? ['sudo', ['-n', CTL, ...args]] : [CTL, args];
  const child = spawn(cmd, argv, { stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdin.on('error', () => {});
  if (!keepOpen) child.stdin.end(stdin ?? '');
  return child;
}

export function ctl(args, { stdin, timeout = 120000 } = {}){
  return new Promise(resolve => {
    const child = spawnCtl(args, { stdin: stdin ?? '' });
    let out = '', err = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    const t = setTimeout(() => child.kill('SIGTERM'), timeout);
    child.on('close', code => { clearTimeout(t); resolve({ code, out, err: err.trim() }); });
    child.on('error', e => { clearTimeout(t); resolve({ code: -1, out, err: e.message }); });
  });
}

export async function ctlOk(args, opts){
  const r = await ctl(args, opts);
  if (r.code !== 0) throw Object.assign(new Error(r.err || `studio-ctl ${args[0]} failed`), { status: 400 });
  return r.out;
}
export async function ctlJson(args, opts){ return JSON.parse(await ctlOk(args, opts) || 'null'); }
