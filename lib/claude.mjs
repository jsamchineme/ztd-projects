// Each Studio user connects their own Claude: a Claude.ai subscription (through Claude Code's own
// `setup-token` sign-in) or an Anthropic API key. Secrets are stored encrypted.
// Someone can also be invited to use the inviter's connection: until they connect their own, theirs is the inviter's.
import { db, now, audit } from './db.mjs';
import { encrypt, decrypt } from './crypto.mjs';
import { spawnCtl } from './ctl.mjs';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR } from './config.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS claude_connection (
  userId TEXT PRIMARY KEY,
  kind TEXT NOT NULL,          -- subscription | apikey
  secret TEXT NOT NULL,        -- encrypted token or key
  hint TEXT NOT NULL DEFAULT '',
  createdAt INTEGER NOT NULL
)`);
db.exec(`CREATE TABLE IF NOT EXISTS claude_share (
  userId TEXT PRIMARY KEY,     -- who uses it
  ownerId TEXT NOT NULL,       -- whose connection
  createdAt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS claude_share_invite (
  invitationId TEXT PRIMARY KEY,
  ownerId TEXT NOT NULL,
  createdAt INTEGER NOT NULL
)`);
if (!db.prepare('SELECT 1 FROM pragma_table_info(?) WHERE name = ?').get('claude_share', 'dailyBudgetUsd'))
  db.exec('ALTER TABLE claude_share ADD COLUMN dailyBudgetUsd REAL');   // set by the person sharing (lib/budget.mjs)

const own = userId => db.prepare('SELECT kind, hint, createdAt FROM claude_connection WHERE userId = ?').get(userId);
// The connection someone without their own uses: the owner of a share, if that owner is connected.
export const lender = userId => {
  if (!userId || own(userId)) return userId;
  const s = db.prepare('SELECT ownerId FROM claude_share WHERE userId = ?').get(userId);
  return s && own(s.ownerId) ? s.ownerId : userId;
};
export function connectionInfo(userId){
  const from = lender(userId);
  const r = own(from);
  if (!r) return { connected: false };
  if (from === userId) return { connected: true, ...r };
  const o = db.prepare('SELECT name FROM user WHERE id = ?').get(from);
  return { connected: true, kind: r.kind, hint: '', createdAt: r.createdAt, sharedBy: o?.name || 'a teammate' };
}
// What to hand Claude Code: { token } or { apiKey }, or null.
export function credentialsFor(userId){
  userId = lender(userId);
  const r = userId && db.prepare('SELECT kind, secret FROM claude_connection WHERE userId = ?').get(userId);
  if (!r) return null;
  const s = decrypt(r.secret);
  return r.kind === 'subscription' ? { token: s } : { apiKey: s };
}
function save(userId, kind, secret){
  db.prepare(`INSERT INTO claude_connection (userId, kind, secret, hint, createdAt) VALUES (?,?,?,?,?)
    ON CONFLICT(userId) DO UPDATE SET kind = excluded.kind, secret = excluded.secret, hint = excluded.hint, createdAt = excluded.createdAt`)
    .run(userId, kind, encrypt(secret), `…${secret.slice(-4)}`, now());
  audit(userId, 'claude.connected', kind);
}
export function disconnect(userId){
  db.prepare('DELETE FROM claude_connection WHERE userId = ?').run(userId);
  audit(userId, 'claude.disconnected');
}
// ----- sharing -----
// Set when the invitation is made; becomes a share when it's accepted (lib/auth.mjs).
export function shareOnInvite(invitationId, ownerId, on){
  if (!on) return void db.prepare('DELETE FROM claude_share_invite WHERE invitationId = ?').run(invitationId);
  if (!own(ownerId)) throw Object.assign(new Error('Connect your own Claude first (Account → Claude), then invite people to share it.'), { status: 400 });
  db.prepare('INSERT OR REPLACE INTO claude_share_invite (invitationId, ownerId, createdAt) VALUES (?,?,?)').run(invitationId, ownerId, now());
  audit(ownerId, 'claude.share-invite', invitationId);
}
export function acceptShare(invitationId, userId){
  const s = db.prepare('SELECT ownerId FROM claude_share_invite WHERE invitationId = ?').get(invitationId);
  if (!s) return;
  db.prepare('DELETE FROM claude_share_invite WHERE invitationId = ?').run(invitationId);
  if (s.ownerId === userId) return;
  db.prepare('INSERT OR REPLACE INTO claude_share (userId, ownerId, createdAt) VALUES (?,?,?)').run(userId, s.ownerId, now());
  audit(s.ownerId, 'claude.shared', userId);
}
export const invitesSharing = () => new Set(db.prepare('SELECT invitationId FROM claude_share_invite').all().map(r => r.invitationId));
export const shareOf = userId => db.prepare('SELECT s.ownerId, u.name AS ownerName FROM claude_share s JOIN user u ON u.id = s.ownerId WHERE s.userId = ?').get(userId);
export function stopShare(userId){
  db.prepare('DELETE FROM claude_share WHERE userId = ?').run(userId);
  audit(userId, 'claude.share-stopped');
}

export function saveApiKey(userId, key){
  key = String(key || '').trim();
  if (!/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(key)) throw Object.assign(new Error("That doesn't look like an Anthropic API key (it starts with sk-ant-)."), { status: 400 });
  save(userId, 'apikey', key);
}

// ----- subscription sign-in -----
// One sign-in at a time per user. `claude setup-token` prints a claude.ai link, waits for the code
// the user copies from that page, then prints a long-lived token.
const flows = new Map();
// Claude Code draws a full-screen interface: words are placed with cursor moves and links are terminal
// hyperlinks. Turn that into plain text, keeping word breaks.
const plain = s => s
  .replace(/\x1b\]8;[^;\x07\x1b]*;([^\x07\x1b]*)(?:\x07|\x1b\\)/g, ' $1 ')   // hyperlinks -> their URL
  .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '')                       // other OSC sequences
  .replace(/\x1b\[\d*[GCD]/g, ' ')                                               // cursor moves within a line
  .replace(/\x1b\[[0-9;?>=]*[ -\/]*[@-~]/g, '\n')                               // everything else breaks lines
  .replace(/\x1b[()][0-9A-Za-z]|\x1b[=>]|[\x0e\x0f]/g, '')
  .replace(/\r/g, '\n');

// Claude Code redraws only the parts of the screen that change and jumps the cursor over the rest, so the
// token never appears in one piece in the raw output. Replay the output on a virtual screen and read it there.
export function renderScreen(raw){
  const rows = [[]];
  let r = 0, c = 0, saved = [0, 0];
  const row = () => (rows[r] ||= []);
  const at = n => Math.max(0, n);
  for (let i = 0; i < raw.length; i++){
    const ch = raw[i];
    if (ch === '\x1b'){
      const next = raw[i + 1];
      if (next === '['){
        let j = i + 2;
        while (j < raw.length && !/[@-~]/.test(raw[j])) j++;
        const body = raw.slice(i + 2, j), fin = raw[j];
        const nums = body.replace(/^[?>=<]/, '').split(';').map(x => parseInt(x, 10));
        const n = Number.isFinite(nums[0]) && nums[0] > 0 ? nums[0] : 1;
        if (!/^[?>=<]/.test(body)) switch (fin){
          case 'G': case '`': c = at(n - 1); break;
          case 'C': c += n; break;
          case 'D': c = at(c - n); break;
          case 'A': r = at(r - n); break;
          case 'B': r += n; break;
          case 'E': r += n; c = 0; break;
          case 'F': r = at(r - n); c = 0; break;
          case 'd': r = at(n - 1); break;
          case 'H': case 'f': r = at((nums[0] || 1) - 1); c = at((nums[1] || 1) - 1); break;
          case 'K': { const line = row(); const mode = nums[0] || 0;
            if (mode === 0) line.length = Math.min(line.length, c); else if (mode === 1) for (let k = 0; k <= c; k++) line[k] = ' '; else line.length = 0; break; }
          case 'J': { const mode = nums[0] || 0;
            if (mode === 0){ row().length = Math.min(row().length, c); rows.length = r + 1; } else if (mode >= 2){ rows.length = 0; rows.push([]); } break; }
          case 's': saved = [r, c]; break;
          case 'u': [r, c] = saved; break;
        }
        i = j;
      } else if (next === ']'){
        let j = i + 2;
        while (j < raw.length && raw[j] !== '\x07' && !(raw[j] === '\x1b' && raw[j + 1] === '\\')) j++;
        i = raw[j] === '\x07' ? j : j + 1;
      } else if (next === '7'){ saved = [r, c]; i++; }
      else if (next === '8'){ [r, c] = saved; i++; }
      else if (next === '(' || next === ')') i += 2;
      else i++;
    } else if (ch === '\r') c = 0;
    else if (ch === '\n') r++;
    else if (ch === '\b') c = at(c - 1);
    else if (ch >= ' ' || ch > '\x7f'){ const line = row(); while (line.length < c) line.push(' '); line[c++] = ch; }
  }
  return rows.map(l => (l || []).join('').trimEnd()).join('\n');
}
function findToken(flow){
  return renderScreen(flow.raw).match(/sk-ant-oat\d+-[A-Za-z0-9_-]{40,}/);
}
// If sign-in finishes without a token, keep the output's shape for debugging with every letter and digit
// masked, so no secret is ever written to disk.
function writeDebug(raw){
  try {
    const masked = raw.replace(/\x1b/g, '<ESC>').replace(/[A-Za-z0-9]/g, c => /[0-9]/.test(c) ? '9' : 'x');
    writeFileSync(join(DATA_DIR, 'claude-signin-debug.txt'), masked.slice(-20000), { mode: 0o600 });
  } catch {}
}

export function startSignIn(userId){
  cancelSignIn(userId);
  return new Promise((resolve, reject) => {
    const child = spawnCtl(['claude-token'], { keepOpen: true });
    const flow = { child, raw: '', out: '', url: null, done: false, error: null, waiters: [] };
    flows.set(userId, flow);
    const finish = (err) => {
      for (const w of flow.waiters.splice(0)) err ? w.reject(err) : w.resolve(true);
    };
    const onData = d => {
      flow.raw += String(d);
      flow.out = plain(flow.raw);
      if (!flow.url){
        const m = flow.out.match(/https:\/\/(?:claude\.ai|claude\.com|console\.anthropic\.com|platform\.claude\.com)\/\S*oauth\S*/);
        if (m && /paste\s+code/i.test(flow.out)){ flow.url = m[0]; resolve({ url: flow.url }); }
      }
      const t = findToken(flow);
      if (t && !flow.done){
        flow.done = true;
        save(userId, 'subscription', t[0]);
        finish(null);
        child.kill('SIGTERM');
        return;
      }
      const e = flow.out.match(/OAuth error:[^\n]*/);
      if (e && flow.waiters.length){
        const msg = e[0].replace(/\s+/g, ' ').replace(/Press Enter to retry\.?/i, '').trim();
        finish(Object.assign(new Error(`${msg} Start again and copy the whole code.`), { status: 400 }));
        child.kill('SIGTERM');
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('close', () => {
      if (!flow.done){ const t = findToken(flow); if (t){ flow.done = true; save(userId, 'subscription', t[0]); finish(null); } }
      if (!flow.done && flow.url) writeDebug(flow.raw);
      if (!flow.url) reject(Object.assign(new Error('Claude sign-in did not start: ' + lastLine(flow.out)), { status: 500 }));
      if (!flow.done) finish(new Error(lastLine(flow.out) || 'Sign-in ended without a token. Start again and paste the whole code.'));
      if (flows.get(userId) === flow) flows.delete(userId);
    });
    setTimeout(() => { if (!flow.done) child.kill('SIGTERM'); }, 10 * 60 * 1000);
  });
}
const lastLine = s => s.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => /[a-z]{3}/i.test(l)).slice(-2).join(' ').slice(0, 300);

export function submitCode(userId, code){
  const flow = flows.get(userId);
  if (!flow) throw Object.assign(new Error('Start the sign-in again: it timed out or was cancelled.'), { status: 400 });
  code = String(code || '').trim();
  if (!code || code.length > 2000 || /\s/.test(code)) throw Object.assign(new Error('Paste the code exactly as claude.ai shows it.'), { status: 400 });
  return new Promise((resolve, reject) => {
    flow.waiters.push({ resolve, reject });
    // Claude Code treats a long burst of input as a paste and ignores an Enter inside it, so send Enter separately.
    flow.child.stdin.write(code);
    setTimeout(() => flow.child.stdin.write('\r'), 500);
    setTimeout(() => {
      if (flow.done) return;
      reject(Object.assign(new Error('Claude didn\u2019t accept the code in time. Press Cancel, start again, and paste the newest code.'), { status: 400 }));
    }, 45000);
  });
}
export function cancelSignIn(userId){
  const f = flows.get(userId);
  if (f){ f.child.kill('SIGTERM'); flows.delete(userId); }
}
