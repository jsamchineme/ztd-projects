// Daily Claude budgets. Two kinds, and whichever runs out first stops new work until midnight (server time):
// - a person's, set by whoever shares their Claude with them (or a Studio admin); it only counts spend on that
//   shared connection, so it stops mattering once they connect their own;
// - a project's, set by its team owners and admins; it counts its chats and its own AI workers.
// Chats report their cost when they finish (lib/agent.mjs). Project workers call Claude through proxyClaude below,
// which counts the tokens of every response, so a prompt that crosses a limit still finishes.
import http from 'node:http';
import https from 'node:https';
import { db, now, audit } from './db.mjs';
import { lender } from './claude.mjs';
import { ANTHROPIC_URL } from './config.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS claude_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,           -- YYYY-MM-DD, server time
  at INTEGER NOT NULL,
  projectId TEXT,
  userId TEXT,                 -- who sent the prompt, or whose Claude the project's workers use
  lenderId TEXT,               -- whose connection paid for it (differs from userId when shared)
  source TEXT NOT NULL,        -- chat | worker
  model TEXT,
  costUsd REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS claude_usage_project ON claude_usage(day, projectId);
CREATE INDEX IF NOT EXISTS claude_usage_user ON claude_usage(day, userId)`);

export const today = () => new Date().toLocaleDateString('en-CA');
export const money = n => '$' + (Number(n) || 0).toFixed(2);

// $ per million tokens: input, output, cache read. First match wins. Cache writes cost 1.25× input (2× for 1-hour
// ones), and fast mode doubles everything. Unknown models are priced as Opus 5.5.
const PRICES = [
  [/fable-5-1|mythos-5-1/, 10, 50, 0.25],
  [/fable|mythos/, 10, 50, 1],
  [/opus-5-5/, 4, 20, 0.2],
  [/opus-4-[01]\b|opus-4-20|3-opus/, 15, 75, 1.5],
  [/opus/, 5, 25, 0.5],
  [/sonnet-5/, 2, 10, 0.2],
  [/sonnet/, 3, 15, 0.3],
  [/haiku-5/, 0.1, 0.5, 0.01],
  [/haiku-4/, 1, 5, 0.1],
  [/haiku/, 0.8, 4, 0.08]
];
export function costOf(model, u){
  if (!u) return 0;
  const [, inp, out, read] = PRICES.find(([re]) => re.test(String(model || ''))) || [null, 4, 20, 0.2];
  const write = Number(u.cache_creation_input_tokens) || 0;
  const hour = Math.min(write, Number(u.cache_creation?.ephemeral_1h_input_tokens) || 0);
  const usd = ((Number(u.input_tokens) || 0) * inp + (Number(u.output_tokens) || 0) * out
    + (Number(u.cache_read_input_tokens) || 0) * read + (write - hour) * inp * 1.25 + hour * inp * 2) / 1e6;
  return u.speed === 'fast' ? usd * 2 : usd;
}

export function record({ projectId = null, userId = null, lenderId = null, source, model = null, costUsd }){
  if (!(costUsd > 0)) return;
  db.prepare('INSERT INTO claude_usage (day, at, projectId, userId, lenderId, source, model, costUsd) VALUES (?,?,?,?,?,?,?,?)')
    .run(today(), now(), projectId, userId, lenderId, source, model, costUsd);
}

export const projectSpent = projectId => db.prepare('SELECT coalesce(sum(costUsd), 0) AS s FROM claude_usage WHERE day = ? AND projectId = ?').get(today(), projectId).s;
// What someone spent today on other people's Claude.
export const personSpent = userId => db.prepare('SELECT coalesce(sum(costUsd), 0) AS s FROM claude_usage WHERE day = ? AND userId = ? AND lenderId IS NOT NULL AND lenderId != userId').get(today(), userId).s;

// Their budget, if they're using someone else's Claude right now and that person set one.
export function shareBudget(userId){
  if (!userId) return null;
  const from = lender(userId);
  if (from === userId) return null;
  const s = db.prepare('SELECT s.dailyBudgetUsd, u.name AS ownerName FROM claude_share s JOIN user u ON u.id = s.ownerId WHERE s.userId = ? AND s.ownerId = ?').get(userId, from);
  return s && s.dailyBudgetUsd != null ? s : null;
}
// For showing: { dailyBudgetUsd, spentToday } for a person on a share.
export const personToday = userId => {
  const s = db.prepare('SELECT dailyBudgetUsd FROM claude_share WHERE userId = ?').get(userId);
  return { dailyBudgetUsd: s?.dailyBudgetUsd ?? null, spentToday: personSpent(userId) };
};

// Why new Claude work for this project, on this person's (or their lender's) Claude, can't start; null if it can.
// worker: the project's own AI workers rather than a chat prompt.
export function blocked(project, userId, { worker = false } = {}){
  if (project.dailyBudgetUsd != null && projectSpent(project.id) >= project.dailyBudgetUsd)
    return `${project.name} has used its daily Claude budget of ${money(project.dailyBudgetUsd)}. It resets at midnight, or a team admin can raise it in the project’s Settings.`;
  const s = shareBudget(userId);
  if (s && personSpent(userId) >= s.dailyBudgetUsd){
    if (worker){
      const name = db.prepare('SELECT name FROM user WHERE id = ?').get(userId)?.name || 'Its worker Claude';
      return `${project.name}’s AI workers run on ${name}’s share of ${s.ownerName}’s Claude, which has used its daily budget of ${money(s.dailyBudgetUsd)}. It resets at midnight.`;
    }
    return `You’ve used your daily budget of ${money(s.dailyBudgetUsd)} on ${s.ownerName}’s Claude. It resets at midnight, or connect your own Claude in Account settings.`;
  }
  return null;
}

const amount = v => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 100000) throw Object.assign(new Error('Enter an amount in dollars, or leave it empty for no limit.'), { status: 400 });
  return Math.round(n * 100) / 100;
};
export function setShareBudget(byUserId, userId, value){
  const v = amount(value);
  db.prepare('UPDATE claude_share SET dailyBudgetUsd = ? WHERE userId = ?').run(v, userId);
  audit(byUserId, 'claude.share-budget', userId, v === null ? 'none' : money(v));
}
export function setProjectBudget(byUserId, project, value){
  const v = amount(value);
  db.prepare('UPDATE project SET dailyBudgetUsd = ? WHERE id = ?').run(v, project.id);
  audit(byUserId, 'project.budget', project.slug, v === null ? 'none' : money(v));
}

// ----- the proxy for projects' own AI workers -----
// Their services get ANTHROPIC_BASE_URL = http://127.0.0.1:<port>/claude-proxy/<project usageToken> (lib/projects.mjs).
// Claude Code and the Anthropic SDKs send everything there; it's passed on to Anthropic unchanged, and the usage
// in each Messages response is priced and counted. Only reachable from this machine, not through the web server.
const loopback = req => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress) && !req.headers['x-real-ip'] && !req.headers['x-forwarded-for'];
const apiError = (res, status, message) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ type: 'error', error: { type: status === 404 ? 'not_found_error' : 'invalid_request_error', message } }));
};

export function proxyClaude(req, res){
  if (!loopback(req)) return apiError(res, 404, 'Not found');
  const m = req.url.match(/^\/claude-proxy\/([^/?]+)(\/[^?]*)?(\?.*)?$/);
  const project = m && db.prepare('SELECT * FROM project WHERE usageToken = ?').get(m[1]);
  if (!project) return apiError(res, 404, 'Unknown project');
  const path = m[2] || '/';
  const metered = req.method === 'POST' && /^\/v1\/messages\/?$/.test(path);
  const userId = project.workerClaudeUserId;
  if (metered){
    const why = blocked(project, userId, { worker: true });
    if (why) return apiError(res, 400, `Studio: ${why}`);
  }
  const target = new URL(path + (m[3] || ''), ANTHROPIC_URL);
  const headers = { ...req.headers, host: target.host };
  for (const h of ['accept-encoding', 'connection', 'x-real-ip', 'x-forwarded-for']) delete headers[h];
  const up = (target.protocol === 'https:' ? https : http).request(target, { method: req.method, headers }, ur => {
    res.writeHead(ur.statusCode, ur.headers);
    const counting = metered && ur.statusCode < 300;
    const sse = /event-stream/.test(ur.headers['content-type'] || '');
    let buf = '', model = null, usage = null, done = false;
    const line = l => {
      if (!l.startsWith('data:')) return;
      let d; try { d = JSON.parse(l.slice(5)); } catch { return; }
      if (d.type === 'message_start'){ model = d.message?.model; usage = { ...d.message?.usage }; }
      else if (d.type === 'message_delta' && d.usage) for (const [k, v] of Object.entries(d.usage)) if (v !== null && v !== undefined) (usage ||= {})[k] = v;
    };
    ur.on('data', c => {
      res.write(c);
      if (!counting) return;
      buf += c;
      if (sse){ let i; while ((i = buf.indexOf('\n')) >= 0){ line(buf.slice(0, i).trim()); buf = buf.slice(i + 1); } }
    });
    const finish = () => {
      if (done) return; done = true;
      res.end();
      if (!counting) return;
      if (sse) line(buf.trim());
      else try { const j = JSON.parse(buf); model = j.model; usage = j.usage; } catch {}
      const lenderId = userId ? lender(userId) : null;
      record({ projectId: project.id, userId, lenderId, source: 'worker', model, costUsd: costOf(model, usage) });
    };
    ur.on('end', finish);
    ur.on('close', finish);
  });
  up.on('error', e => { if (!res.headersSent) apiError(res, 502, `Studio couldn’t reach Claude: ${e.message}`); else res.destroy(); });
  res.on('close', () => { if (!res.writableFinished) up.destroy(); });
  req.pipe(up);
}
