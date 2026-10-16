// ZTD Devs Studio: build and run projects with Claude. Serves the Studio app on STUDIO_HOST and proxies every
// other <sub>.<DOMAIN> to the project that owns it, after checking the visitor may see it.
import http from 'node:http';
import { readFileSync, existsSync, createReadStream } from 'node:fs';
import { join, extname } from 'node:path';
import { toNodeHandler } from 'better-auth/node';
import QRCode from 'qrcode';
import { PORT, STUDIO_HOST, STUDIO_URL, DOMAIN, APP_DIR, SECURE, APP_NAME } from './lib/config.mjs';
import { db, audit, now, getSetting, setSetting } from './lib/db.mjs';
import { auth, migrate, sessionFrom, recentLinks, pendingInvitation } from './lib/auth.mjs';
import { mailEnabled, mailSettings, saveMailSettings, clearMailSettings, sendTestMail, sendTemplate } from './lib/mail.mjs';
import { emailPrefs, setEmailPrefs, phonePrefs, setPhonePrefs } from './lib/notify.mjs';
import { listPhones, pairPhone, removePhone, testPhones, handlePhoneUpgrade, PHONE_APP_URL } from './lib/phone.mjs';
import * as P from './lib/projects.mjs';
import * as A from './lib/agent.mjs';
import * as C from './lib/claude.mjs';
import * as U from './lib/uploads.mjs';
import { requestEmailChange, confirmEmailChange } from './lib/account.mjs';
import { ctl, ctlOk, ctlJson, spawnCtl } from './lib/ctl.mjs';
import { subdomainOf, handleProjectRequest, handleProjectUpgrade, issueGateToken, canAccessOrg } from './lib/gate.mjs';

await migrate();
const authHandler = toNodeHandler(auth);
const PUBLIC = join(APP_DIR, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const SECURITY = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',   // the chat's 🎤 dictation needs the mic
  ...(SECURE ? { 'Strict-Transport-Security': 'max-age=31536000' } : {})
};

// ---------- helpers ----------
const err = (status, message, code) => Object.assign(new Error(message), { status, code });
function send(res, status, body, type = 'application/json'){
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', ...SECURITY });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
function readBody(req, limit = 1_000_000){
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit){ reject(err(413, 'Too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch { reject(err(400, 'Invalid JSON')); } });
    req.on('error', reject);
  });
}
const ipOf = req => String(req.headers['x-real-ip'] || req.socket.remoteAddress || '').trim();
function sse(res){
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.write(': ok\n\n');
  // A named event, so pages can tell a quiet but working connection from a dead one (see the chat's connect()).
  const ping = setInterval(() => res.write('event: ping\ndata: \n\n'), 20000);
  res.on('close', () => clearInterval(ping));
}

function memberships(userId){
  return db.prepare(`SELECT m.organizationId, m.role, o.name, o.slug FROM member m JOIN organization o ON o.id = m.organizationId WHERE m.userId = ? ORDER BY o.name`).all(userId);
}
// Returns the user's role for a project: 'site-admin', 'owner', 'admin', 'member', or throws.
function projectRole(user, project){
  if (!project) throw err(404, 'Project not found');
  if (user.role === 'admin') return 'site-admin';
  const m = db.prepare('SELECT role FROM member WHERE userId = ? AND organizationId = ?').get(user.id, project.organizationId);
  if (!m) throw err(404, 'Project not found');
  return m.role;
}
const canManage = role => ['site-admin', 'owner', 'admin'].includes(role);
function needManage(user, project){ const r = projectRole(user, project); if (!canManage(r)) throw err(403, 'Only team owners and admins can change project settings.'); return r; }
// The user's role in a team; Studio admins who aren't members count as 'site-admin'.
function orgRole(user, orgId){
  const r = db.prepare('SELECT role FROM member WHERE userId = ? AND organizationId = ?').get(user.id, orgId)?.role;
  return r || (user.role === 'admin' ? 'site-admin' : null);
}

function projectView(project, user){
  const role = projectRole(user, project);
  const org = db.prepare('SELECT id, name FROM organization WHERE id = ?').get(project.organizationId);
  const services = P.listServices(project.id).map(s => ({ ...P.publicService(s), status: P.statusOf(project, s) }));
  const worker = project.workerClaudeUserId ? db.prepare('SELECT id, name FROM user WHERE id = ?').get(project.workerClaudeUserId) : null;
  return { ...project, role, canManage: canManage(role), team: org, services, workerClaude: worker, running: A.runningChats().filter(id => A.getChat(id)?.projectId === project.id).length };
}

// ---------- routes ----------
const routes = [];
const route = (method, pattern, handler, opts = {}) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ method, re, keys, handler, ...opts });
};

// Account
route('GET', '/api/me', async ({ user, session }) => {
  const claude = C.connectionInfo(user.id);
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, twoFactorEnabled: !!user.twoFactorEnabled, image: user.image || null },
    session: { id: session.id, expiresAt: session.expiresAt },
    teams: memberships(user.id), claude, mailEnabled: mailEnabled(), domain: DOMAIN, appName: APP_NAME
  };
}, { mfa: false });

// Which notification emails this person gets (lib/notify.mjs).
route('GET', '/api/me/email', async ({ user }) => emailPrefs(user));
route('PUT', '/api/me/email', async ({ user, body }) => setEmailPrefs(user, body));
// Phones paired for notifications, and what they ring for (lib/phone.mjs). The phone itself connects to /api/phone/socket.
route('GET', '/api/me/phones', async ({ user }) => ({ phones: listPhones(user.id), prefs: phonePrefs(user), appUrl: PHONE_APP_URL }));
route('POST', '/api/me/phones', async ({ user, body, req }) => pairPhone(user, body.name, ipOf(req)));
route('DELETE', '/api/me/phones/:id', async ({ user, params, req }) => { removePhone(user, params.id, ipOf(req)); return { ok: true }; });
route('POST', '/api/me/phones/test', async ({ user }) => testPhones(user));
route('PUT', '/api/me/phone-prefs', async ({ user, body }) => setPhonePrefs(user, body));
// Opens the phone app in Expo Go: a link that works anywhere an exp:// link isn't clickable.
route('GET', '/api/phone/app', async (_, res) => { res.writeHead(302, { Location: PHONE_APP_URL, 'Cache-Control': 'no-store' }); res.end(); }, { public: true });
// Changing your email (lib/account.mjs). The confirm link is opened from the email, maybe signed out or in another browser.
route('POST', '/api/account/email', async ({ user, body, req }) => requestEmailChange(user, body, ipOf(req)));
route('GET', '/api/account/email/confirm', async ({ url, req }, res) => {
  const result = await confirmEmailChange(url.searchParams.get('token') || '', ipOf(req));
  res.writeHead(302, { Location: `/account?email=${result}`, 'Cache-Control': 'no-store' }); res.end();
}, { public: true });

route('GET', '/api/qr', async ({ url }, res) => {
  const text = url.searchParams.get('text') || '';
  if (!text.startsWith('otpauth://')) throw err(400, 'Only authenticator links');
  send(res, 200, await QRCode.toString(text, { type: 'svg', margin: 1, width: 220 }), 'image/svg+xml');
}, { mfa: false });

// Public: details for an invite link, before the person has an account.
route('GET', '/api/invite/:id', async ({ params }) => {
  const inv = db.prepare(`SELECT i.id, i.email, i.role, i.status, i.expiresAt, o.name AS teamName, u.name AS inviterName
    FROM invitation i JOIN organization o ON o.id = i.organizationId LEFT JOIN user u ON u.id = i.inviterId WHERE i.id = ?`).get(params.id);
  if (!inv) throw err(404, 'This invitation link isn’t valid.');
  const expired = (typeof inv.expiresAt === 'number' ? inv.expiresAt : Date.parse(inv.expiresAt)) < Date.now();
  const hasAccount = !!db.prepare('SELECT 1 FROM user WHERE lower(email) = lower(?)').get(inv.email);
  return { email: inv.email, role: inv.role, teamName: inv.teamName, inviterName: inv.inviterName, status: expired && inv.status === 'pending' ? 'expired' : inv.status, hasAccount };
}, { public: true });

// Hand-off to a project subdomain (see lib/gate.mjs).
route('GET', '/api/gate', async ({ url, user, session }, res) => {
  const host = String(url.searchParams.get('host') || '').toLowerCase();
  const next = url.searchParams.get('next') || '/';
  const sub = subdomainOf(host);
  const svc = sub && P.serviceBySubdomain(sub);
  if (!svc) throw err(404, 'Unknown project address');
  if (!user){ res.writeHead(302, { Location: `/login?next=${encodeURIComponent(url.pathname + url.search)}` }); return res.end(); }
  if (!user.twoFactorEnabled){ res.writeHead(302, { Location: '/account?setup=mfa' }); return res.end(); }
  if (!canAccessOrg(user.id, user.role, svc.organizationId)) return send(res, 403, `<!doctype html><meta charset="utf-8"><p style="font:16px system-ui;margin:20vh auto;max-width:30rem">You're not in the team that owns ${host}. Ask a team admin to invite you. <a href="/">Back to Studio</a></p>`, 'text/html; charset=utf-8');
  res.writeHead(302, { Location: issueGateToken(session, host, next), 'Cache-Control': 'no-store' }); res.end();
}, { public: true, optionalUser: true });

// Claude connection
// Projects whose own AI workers borrow this user's connection get the new credentials written into their
// service settings; they take effect the next time those services restart.
async function reapplyWorkerProjects(userId){
  for (const p of db.prepare('SELECT * FROM project WHERE workerClaudeUserId = ?').all(userId)) await P.applyServices(p).catch(e => console.error(e.message));
}
route('GET', '/api/claude', async ({ user }) => C.connectionInfo(user.id));
route('POST', '/api/claude/connect', async ({ user }) => C.startSignIn(user.id));
route('POST', '/api/claude/code', async ({ user, body }) => { await C.submitCode(user.id, body.code); await reapplyWorkerProjects(user.id); return C.connectionInfo(user.id); });
route('POST', '/api/claude/cancel', async ({ user }) => { C.cancelSignIn(user.id); return { ok: true }; });
route('POST', '/api/claude/apikey', async ({ user, body }) => { C.saveApiKey(user.id, body.key); await reapplyWorkerProjects(user.id); return C.connectionInfo(user.id); });
route('DELETE', '/api/claude', async ({ user }) => { C.disconnect(user.id); await reapplyWorkerProjects(user.id); return { ok: true }; });

// Projects
route('GET', '/api/projects', async ({ user }) => {
  await P.allStatus();
  const orgIds = memberships(user.id).map(m => m.organizationId);
  return P.projectsFor(user, orgIds).map(p => projectView(p, user));
});
route('POST', '/api/projects', async ({ user, body }) => {
  const role = orgRole(user, body.organizationId);
  if (user.role !== 'admin' && !['owner', 'admin'].includes(role)) throw err(403, 'Only team owners and admins can create projects in that team.');
  return projectView(await P.createProject(body, user), user);
});
route('GET', '/api/projects/:id', async ({ user, params }) => { await P.allStatus(); return projectView(P.getProject(params.id), user); });
route('PATCH', '/api/projects/:id', async ({ user, params, body }) => {
  const p = P.getProject(params.id); needManage(user, p);
  if (body.name !== undefined) db.prepare('UPDATE project SET name = ? WHERE id = ?').run(String(body.name).trim().slice(0, 80) || p.name, p.id);
  if (body.description !== undefined) db.prepare('UPDATE project SET description = ? WHERE id = ?').run(String(body.description).slice(0, 500), p.id);
  if (body.workerClaudeUserId !== undefined){
    const uid = body.workerClaudeUserId || null;
    if (uid && uid !== user.id && user.role !== 'admin') throw err(403, 'You can only lend your own Claude connection to a project.');
    db.prepare('UPDATE project SET workerClaudeUserId = ? WHERE id = ?').run(uid, p.id);
    await P.applyServices(P.getProject(p.id));
  }
  if (body.organizationId !== undefined && body.organizationId !== p.organizationId){
    if (user.role !== 'admin' && !['owner', 'admin'].includes(orgRole(user, body.organizationId))) throw err(403, 'You must be an admin of the team you move it to.');
    db.prepare('UPDATE project SET organizationId = ? WHERE id = ?').run(body.organizationId, p.id);
  }
  audit(user.id, 'project.update', p.slug, Object.keys(body).join(','));
  return projectView(P.getProject(p.id), user);
});
route('DELETE', '/api/projects/:id', async ({ user, params, body }) => {
  const p = P.getProject(params.id); needManage(user, p);
  if (body.confirm !== p.slug) throw err(400, `Type the project's short name (${p.slug}) to delete it.`);
  await P.deleteProject(p, user);
  return { ok: true };
});

// Services
route('PUT', '/api/projects/:id/services', async ({ user, params, body }) => {
  const p = P.getProject(params.id); needManage(user, p);
  const list = Array.isArray(body.services) ? body.services : [];
  const keep = new Set(), provision = [], removeSubs = [];
  const tx = db.transaction(() => {
    for (const s of list){ const r = P.upsertService(p.id, s); keep.add(r.id); if (r.subdomainChanged){ provision.push(r.id); if (r.oldSubdomain) removeSubs.push(r.oldSubdomain); } }
    for (const s of P.listServices(p.id)) if (!keep.has(s.id)){ if (s.subdomain) removeSubs.push(s.subdomain); db.prepare('DELETE FROM service WHERE id = ?').run(s.id); }
  });
  tx();
  await P.applyServices(p);
  audit(user.id, 'services.update', p.slug, list.map(s => s.name).join(','));
  for (const sub of removeSubs) ctl(['vhost-remove', sub]);
  for (const id of provision) P.provisionSubdomain(id);
  await P.allStatus(true);
  return projectView(p, user);
});
route('POST', '/api/projects/:id/services/:sid/:action', async ({ user, params }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const s = P.listServices(p.id).find(x => x.id === params.sid);
  if (!s) throw err(404, 'Service not found');
  if (!['start', 'stop', 'restart'].includes(params.action)) throw err(400, 'Unknown action');
  await P.serviceAction(p, s, params.action);
  audit(user.id, `service.${params.action}`, `${p.slug}/${s.name}`);
  await new Promise(r => setTimeout(r, 800));
  await P.allStatus(true);
  return projectView(p, user);
});
route('POST', '/api/projects/:id/services/:sid/certificate', async ({ user, params }) => {
  const p = P.getProject(params.id); needManage(user, p);
  const s = P.listServices(p.id).find(x => x.id === params.sid);
  if (!s?.subdomain) throw err(400, 'This service has no web address');
  return { ok: await P.provisionSubdomain(s.id) };
});
route('GET', '/api/projects/:id/services/:sid/logs', async ({ user, params, url }, res) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const s = P.listServices(p.id).find(x => x.id === params.sid);
  if (!s) throw err(404, 'Service not found');
  sse(res);
  const child = spawnCtl(['logs', p.slug, s.name, url.searchParams.get('lines') || '300', 'follow']);
  let buf = '';
  const flush = d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0){ res.write(`data: ${JSON.stringify(buf.slice(0, i))}\n\n`); buf = buf.slice(i + 1); } };
  child.stdout.on('data', flush); child.stderr.on('data', flush);
  res.on('close', () => child.kill('SIGTERM'));
});

// Git
route('GET', '/api/projects/:id/git/status', async ({ user, params }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const r = await ctl(['git', p.slug, 'status']);
  if (r.code === 3) return { repo: false, files: [] };
  if (r.code !== 0) throw err(500, r.err);
  const lines = r.out.split('\n').filter(Boolean);
  const branch = (lines[0] || '').replace(/^## /, '');
  const files = lines.slice(1).map(l => ({ code: l.slice(0, 2), path: l.slice(3).replace(/^"|"$/g, '').replace(/^.* -> /, '') }));
  return { repo: true, branch, files };
});
route('GET', '/api/projects/:id/git/diff', async ({ user, params }, res) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const r = await ctl(['git', p.slug, 'diff'], { timeout: 60000 });
  send(res, 200, r.out.length > 3_000_000 ? r.out.slice(0, 3_000_000) + '\n… diff truncated …\n' : r.out, 'text/plain; charset=utf-8');
});
route('GET', '/api/projects/:id/git/log', async ({ user, params }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const r = await ctl(['git', p.slug, 'log', '40']);
  if (r.code !== 0) return [];
  return r.out.split('\n').filter(Boolean).map(l => { const [hash, author, date, subject] = l.split('\x1f'); return { hash, author, date, subject }; });
});
route('POST', '/api/projects/:id/git/commit', async ({ user, params, body }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  await ctlOk(['git', p.slug, 'commit'], { stdin: JSON.stringify({ message: body.message, name: user.name, email: user.email }) });
  audit(user.id, 'git.commit', p.slug, String(body.message || '').slice(0, 200));
  return { ok: true };
});
route('POST', '/api/projects/:id/git/discard', async ({ user, params, body }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  await ctlOk(['git', p.slug, 'discard'], { stdin: JSON.stringify({ files: body.files }) });
  audit(user.id, 'git.discard', p.slug, (body.files || []).join(', ').slice(0, 500));
  return { ok: true };
});
route('POST', '/api/projects/:id/git/revert-last', async ({ user, params }) => {
  const p = P.getProject(params.id); needManage(user, p);
  await ctlOk(['git', p.slug, 'revert-last']);
  audit(user.id, 'git.revert', p.slug);
  return { ok: true };
});

// Files (read-only)
route('GET', '/api/projects/:id/files', async ({ user, params }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const r = await ctl(['ls', p.slug], { timeout: 30000 });
  return r.out.split('\n').filter(Boolean).slice(0, 20000);
});
route('GET', '/api/projects/:id/file', async ({ user, params, url }, res) => {
  const p = P.getProject(params.id); projectRole(user, p);
  const r = await ctl(['cat', p.slug], { stdin: url.searchParams.get('path') || '' });
  if (r.code !== 0) throw err(404, r.err || 'Cannot read that file');
  send(res, 200, r.out, 'text/plain; charset=utf-8');
});

// Chats
route('GET', '/api/projects/:id/chats', async ({ user, params }) => { const p = P.getProject(params.id); projectRole(user, p); return A.listChats(p.id, user.id); });
route('POST', '/api/projects/:id/chats', async ({ user, params, body }) => { const p = P.getProject(params.id); projectRole(user, p); return A.createChat(p.id, user.id, body); });
function chatFor(user, id){
  const c = A.getChat(id);
  if (!c) throw err(404, 'Chat not found');
  const p = P.getProject(c.projectId); projectRole(user, p);
  return { c, p };
}
route('GET', '/api/chats/:id', async ({ user, params }) => {
  const { c } = chatFor(user, params.id);
  return { chat: { ...c, running: A.isRunning(c.id) }, events: A.chatEvents(c.id) };
});
route('PATCH', '/api/chats/:id', async ({ user, params, body }) => {
  const { c } = chatFor(user, params.id);
  if (body.title) db.prepare('UPDATE chat SET title = ? WHERE id = ?').run(String(body.title).slice(0, 120), c.id);
  return A.getChat(c.id);
});
// Archiving or deleting a chat: the person who started it, or a team admin.
function chatOwnerFor(user, id, verb){
  const r = chatFor(user, id);
  if (r.c.userId !== user.id && !canManage(projectRole(user, r.p))) throw err(403, `Only the person who started a chat, or a team admin, can ${verb} it.`);
  return r;
}
route('POST', '/api/chats/:id/archive', async ({ user, params, body }) => {
  const { c } = chatOwnerFor(user, params.id, 'archive');
  A.archiveChat(c.id, body.archived !== false);
  audit(user.id, body.archived !== false ? 'chat.archive' : 'chat.unarchive', c.id, c.title);
  return A.getChat(c.id);
});
route('DELETE', '/api/chats/:id', async ({ user, params }) => {
  const { c } = chatOwnerFor(user, params.id, 'delete');
  A.deleteChat(c.id);
  audit(user.id, 'chat.delete', c.id, c.title);
  return { ok: true };
});
route('POST', '/api/chats/:id/messages', async ({ user, params, body }) => {
  const { c, p } = chatFor(user, params.id);
  await A.sendPrompt(c, p, user, body);
  return { ok: true };
});
// Files attached to chat messages (see lib/uploads.mjs). Sent as base64 JSON, so allow a bigger body here.
route('POST', '/api/projects/:id/uploads', async ({ user, params, body }) => {
  const p = P.getProject(params.id); projectRole(user, p);
  return U.saveUpload(p, user, body);
}, { limit: 28_000_000 });
route('GET', '/api/uploads/:id', async ({ user, params }, res) => {
  const u = U.getUpload(params.id);
  if (!u) throw err(404, 'File not found');
  projectRole(user, P.getProject(u.projectId));
  const image = u.kind === 'image';
  res.writeHead(200, { ...SECURITY, 'Content-Type': image ? u.mime : 'application/octet-stream', 'Content-Length': u.size, 'Cache-Control': 'private, max-age=86400',
    'Content-Disposition': `${image ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(u.name)}` });
  createReadStream(u.path).on('error', () => res.destroy()).pipe(res);
});
route('POST', '/api/chats/:id/stop', async ({ user, params }) => { const { c } = chatFor(user, params.id); return { stopped: A.stop(c.id) }; });
route('GET', '/api/chats/:id/stream', async ({ user, params, url }, res) => {
  const { c } = chatFor(user, params.id);
  sse(res);
  // First what the tab missed since the last event it saw (?after=seq), then live events. Both happen in one go, so
  // nothing can fall between them: a message sent while the page was connecting, or asleep, still shows up.
  const after = Number(url.searchParams.get('after'));
  if (Number.isInteger(after)) for (const ev of A.chatEvents(c.id, after)) res.write(`data: ${JSON.stringify(ev)}\n\n`);
  const off = A.watch(c.id, res);
  res.on('close', off);
});

// Teams (reads; changes go through Better Auth's organization endpoints from the browser)
route('GET', '/api/teams', async ({ user }) => {
  const teams = user.role === 'admin'
    ? db.prepare('SELECT id AS organizationId, name, slug FROM organization ORDER BY name').all().map(t => ({ ...t, role: orgRole(user, t.organizationId) }))
    : memberships(user.id);
  return teams.map(t => {
    const members = db.prepare(`SELECT m.id, m.role, m.createdAt, u.id AS userId, u.name, u.email, u.twoFactorEnabled FROM member m JOIN user u ON u.id = m.userId WHERE m.organizationId = ? ORDER BY u.name`).all(t.organizationId);
    const canAdmin = ['site-admin', 'owner', 'admin'].includes(t.role);
    const invites = canAdmin ? db.prepare(`SELECT id, email, role, status, expiresAt FROM invitation WHERE organizationId = ? AND status = 'pending' ORDER BY createdAt DESC`).all(t.organizationId)
      .map(i => ({ ...i, link: `${STUDIO_URL}/invite/${i.id}` })) : [];
    const projects = db.prepare('SELECT id, name, slug FROM project WHERE organizationId = ? ORDER BY name').all(t.organizationId);
    return { ...t, canAdmin, members, invites, projects };
  });
});

// Site admin
const needAdmin = user => { if (user.role !== 'admin') throw err(403, 'Admins only'); };
route('GET', '/api/admin/users', async ({ user }) => {
  needAdmin(user);
  return db.prepare(`SELECT id, name, email, role, banned, banReason, twoFactorEnabled, createdAt,
    (SELECT max(updatedAt) FROM session s WHERE s.userId = user.id) AS lastSeen FROM user ORDER BY createdAt`).all()
    .map(u => ({ ...u, teams: memberships(u.id).map(m => ({ name: m.name, role: m.role })), claude: C.connectionInfo(u.id).connected }));
});
route('POST', '/api/admin/users/:id/reset-link', async ({ user, params, req }) => {
  needAdmin(user);
  const target = db.prepare('SELECT id, email FROM user WHERE id = ?').get(params.id);
  if (!target) throw err(404, 'User not found');
  await auth.api.requestPasswordReset({ body: { email: target.email, redirectTo: '/reset-password' } });
  audit(user.id, 'admin.reset-link', target.email, '', ipOf(req));
  const l = recentLinks.get(target.email.toLowerCase());
  return { emailed: mailEnabled(), link: l?.kind === 'reset' ? l.url : null };
});
route('POST', '/api/admin/users/:id/reset-mfa', async ({ user, params, req }) => {
  needAdmin(user);
  if (params.id === user.id) throw err(400, 'Use your own account page to change your MFA.');
  db.prepare('DELETE FROM twoFactor WHERE userId = ?').run(params.id);
  db.prepare('UPDATE user SET twoFactorEnabled = 0 WHERE id = ?').run(params.id);
  db.prepare('DELETE FROM session WHERE userId = ?').run(params.id);
  audit(user.id, 'admin.reset-mfa', params.id, '', ipOf(req));
  const target = db.prepare('SELECT name, email FROM user WHERE id = ?').get(params.id);
  if (target) sendTemplate(target.email, 'mfaReset', { name: target.name, email: target.email, adminName: user.name, url: `${STUDIO_URL}/login` });
  return { ok: true };
});
route('GET', '/api/admin/audit', async ({ user, url }) => {
  needAdmin(user);
  const before = Number(url.searchParams.get('before')) || Date.now() + 1;
  return db.prepare(`SELECT a.*, u.name AS userName FROM audit a LEFT JOIN user u ON u.id = a.userId WHERE a.at < ? ORDER BY a.at DESC LIMIT 200`).all(before);
});
route('GET', '/api/admin/system', async ({ user }) => {
  needAdmin(user);
  const r = await ctl(['status']);
  return { services: r.code === 0 ? JSON.parse(r.out) : {}, mail: mailEnabled(), domain: DOMAIN };
});

// Email settings (lib/mail.mjs). The password is never sent back to the browser.
route('GET', '/api/admin/mail', async ({ user }) => { needAdmin(user); return mailSettings(); });
// Which Linux user a project runs as, and moving an older project off the shared user onto its own (Studio admins).
route('GET', '/api/projects/:id/user', async ({ user, params }) => {
  needAdmin(user);
  return ctlJson(['project-user', P.getProject(params.id).slug]);
});
route('POST', '/api/projects/:id/own-user', async ({ user, params, req }) => {
  needAdmin(user);
  const p = P.getProject(params.id);
  if (A.runningChats().some(id => A.getChat(id)?.projectId === p.id)) throw err(409, 'Claude is working in this project. Wait for its chats to finish (or stop them), then try again.');
  const r = await ctlJson(['project-own-user', p.slug], { timeout: 900000 });
  audit(user.id, 'project.own-user', p.slug, r.user, ipOf(req));
  await P.applyServices(p);   // the units now run as the new user
  const failed = [];
  for (const name of r.running) await ctlOk(['svc', p.slug, name, 'start'], { timeout: 60000 }).catch(() => failed.push(name));
  return { ...r, failed };
});
// Backing up every project to one GitHub repo, a branch per project (see ops/github-backup.sh).
route('GET', '/api/admin/github-backup', async ({ user }) => { needAdmin(user); return ctlJson(['github-backup', 'status']); });
route('PUT', '/api/admin/github-backup', async ({ user, body, req }) => {
  needAdmin(user);
  const r = await ctlJson(['github-backup', 'set'], { stdin: JSON.stringify({ url: String(body.url || '') }) });
  audit(user.id, 'admin.github-backup', r.url, '', ipOf(req));
  return r;
});
route('POST', '/api/admin/github-backup/run', async ({ user, req }) => {
  needAdmin(user); audit(user.id, 'admin.github-backup-run', '', '', ipOf(req));
  return ctlJson(['github-backup', 'run']);
});
route('DELETE', '/api/admin/github-backup', async ({ user, req }) => {
  needAdmin(user); audit(user.id, 'admin.github-backup-off', '', '', ipOf(req));
  return ctlJson(['github-backup', 'off']);
});
// Studio-wide switches that admins can flip on the Admin page.
const adminSettings = () => ({ scopeCheck: getSetting('scopeCheck', false) });
route('GET', '/api/admin/settings', async ({ user }) => { needAdmin(user); return adminSettings(); });
route('PUT', '/api/admin/settings', async ({ user, body, req }) => {
  needAdmin(user);
  if (typeof body.scopeCheck === 'boolean'){ setSetting('scopeCheck', body.scopeCheck); audit(user.id, 'admin.focus-check', body.scopeCheck ? 'on' : 'off', '', ipOf(req)); }
  return adminSettings();
});
route('PUT', '/api/admin/mail', async ({ user, body, req }) => {
  needAdmin(user);
  await saveMailSettings(body);
  audit(user.id, 'admin.mail', mailSettings().host, '', ipOf(req));
  return mailSettings();
});
route('DELETE', '/api/admin/mail', async ({ user, req }) => { needAdmin(user); clearMailSettings(); audit(user.id, 'admin.mail-clear', '', '', ipOf(req)); return mailSettings(); });
route('POST', '/api/admin/mail/test', async ({ user }) => { needAdmin(user); await sendTestMail(user.email); return { ok: true, to: user.email }; });

// Updating Studio itself: installs the last commit of studio/ in the source project (see studio-ctl studio-update).
const installedVersion = () => { try { return JSON.parse(readFileSync(join(APP_DIR, '.version'), 'utf8')); } catch { return null; } };
route('GET', '/api/admin/studio', async ({ user }) => {
  needAdmin(user);
  const installed = installedVersion();
  const r = await ctl(['studio-source', installed?.commit || '-']);
  return { installed, source: r.code === 0 ? JSON.parse(r.out) : null, sourceError: r.code === 0 ? null : r.err };
});
route('GET', '/api/admin/studio/log', async ({ user }) => { needAdmin(user); return ctlJson(['studio-update-log']); });
route('POST', '/api/admin/studio/update', async ({ user, req }) => {
  needAdmin(user);
  const r = JSON.parse(await ctlOk(['studio-update']));
  audit(user.id, 'studio.update', r.commit, '', ipOf(req));
  return { ...r, at: Date.now() };   // server time, so the page can tell this run's log from earlier ones
});

// ---------- server ----------
function serveStatic(req, res, pathname){
  let file = join(PUBLIC, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(PUBLIC + '/') && file !== join(PUBLIC, 'index.html')) return send(res, 404, 'Not found', 'text/plain');
  if (!existsSync(file) || !extname(file)) file = join(PUBLIC, 'index.html');   // app routes
  const type = TYPES[extname(file)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': type.startsWith('text/html') ? 'no-store' : 'no-cache', ...SECURITY });
  res.end(readFileSync(file));
}

async function handleStudio(req, res){
  const url = new URL(req.url, STUDIO_URL);
  if (url.pathname.startsWith('/api/auth/')){
    for (const [k, v] of Object.entries(SECURITY)) res.setHeader(k, v);
    if (req.method !== 'GET' && req.method !== 'OPTIONS'){
      const origin = req.headers.origin;
      if (origin && origin !== STUDIO_URL) return send(res, 403, { error: 'Bad origin' });
    }
    const path = url.pathname.slice('/api/auth'.length);
    res.on('finish', () => {
      if (res.statusCode < 400 && /^\/(sign-in|sign-out|reset-password|two-factor\/(enable|disable|verify)|change-password|organization\/(invite|remove|update-member|accept)|admin\/)/.test(path))
        audit(null, 'auth' + path, '', '', ipOf(req));
    });
    return authHandler(req, res);
  }
  if (!url.pathname.startsWith('/api/')) return serveStatic(req, res, url.pathname);

  for (const r of routes){
    if (r.method !== req.method) continue;
    const m = url.pathname.match(r.re);
    if (!m) continue;
    try {
      if (req.method !== 'GET'){
        if (req.headers.origin !== STUDIO_URL) throw err(403, 'Bad origin');
        if (Number(req.headers['content-length']) > (r.limit || 1_000_000)){
          // Read and drop the rest of the body, so the sender gets this 413 rather than a broken connection
          // (closing at once raced with the upload still arriving). Bodies over 64 MB are cut off.
          let dropped = 0;
          req.on('data', c => { dropped += c.length; if (dropped > 64_000_000) req.destroy(); });
          throw err(413, r.limit ? 'That file is too large (20 MB at most).' : 'Too large');
        }
        if (!String(req.headers['content-type'] || '').includes('application/json') && req.headers['content-length'] !== '0' && req.headers['content-length']) throw err(415, 'Send JSON');
      }
      const s = await sessionFrom(req.headers);
      if (!s && !r.public) throw err(401, 'Sign in first');
      if (s && !r.public && r.mfa !== false && !s.user.twoFactorEnabled) throw err(403, 'Set up two-factor authentication first.', 'mfa_required');
      if (s?.user?.banned) throw err(403, 'This account is suspended.');
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      const body = req.method === 'GET' ? {} : await readBody(req, r.limit);
      const out = await r.handler({ req, url, params, body, user: s?.user, session: s?.session }, res);
      if (!res.headersSent && out !== undefined) send(res, 200, out);
    } catch (e){
      if (!e.status) console.error(e);
      if (!res.headersSent) send(res, e.status || 500, { error: e.status ? e.message : 'Something went wrong. Check the Studio logs.', code: e.code });
    }
    return;
  }
  send(res, 404, { error: 'Not found' });
}

const server = http.createServer((req, res) => {
  const host = String(req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
  if (host === STUDIO_HOST || host === 'localhost' || host === '127.0.0.1') return handleStudio(req, res);
  const sub = subdomainOf(host);
  if (sub) return handleProjectRequest(req, res, sub);
  send(res, 404, 'Unknown host', 'text/plain');
});
server.on('upgrade', (req, socket, head) => {
  const host = String(req.headers.host || '').toLowerCase().replace(/:\d+$/, '');
  const sub = subdomainOf(host);
  if (sub && host !== STUDIO_HOST) return handleProjectUpgrade(req, socket, head, sub);
  if ((host === STUDIO_HOST || host === 'localhost' || host === '127.0.0.1') && req.url.split('?')[0] === '/api/phone/socket') return handlePhoneUpgrade(req, socket, head);
  socket.destroy();
});
server.requestTimeout = 0;
// On the server, systemd holds the port (studio.socket) and passes it in as fd 3, so nothing else can take it while
// Studio restarts.
const fromSystemd = process.env.LISTEN_FDS === '1' && Number(process.env.LISTEN_PID) === process.pid;
if (fromSystemd) server.listen({ fd: 3 }, () => console.log(`${APP_NAME} on the systemd socket (${STUDIO_URL})`));
else server.listen(PORT, '127.0.0.1', () => console.log(`${APP_NAME} on http://127.0.0.1:${PORT} (${STUDIO_URL})`));
setInterval(() => P.allStatus().catch(() => {}), 5000);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { for (const id of A.runningChats()) A.stop(id); setTimeout(() => process.exit(0), 500); });
