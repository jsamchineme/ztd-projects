// Projects and their running services. A project is a git repo in /srv/projects/<slug>/repo with
// one or more services; each service is a systemd unit that Studio can start, stop and restart.
import { db, now, audit } from './db.mjs';
import { randomId, encrypt, decrypt } from './crypto.mjs';
import { ctl, ctlOk, ctlJson } from './ctl.mjs';
import { credentialsFor } from './claude.mjs';
import { DOMAIN, PORT, STUDIO_URL, FIRST_SERVICE_PORT } from './config.mjs';
import { notify } from './notify.mjs';

export const SLUG = /^[a-z][a-z0-9-]{0,30}[a-z0-9]$/;
const RESERVED = new Set(['studio', 'www', 'mail', 'smtp', 'imap', 'ftp', 'admin', 'api', 'ns1', 'ns2', 'webmail', 'cpanel']);
const bad = (msg, status = 400) => Object.assign(new Error(msg), { status });

export const getProject = id => db.prepare('SELECT * FROM project WHERE id = ?').get(id);
export const listServices = projectId => db.prepare('SELECT * FROM service WHERE projectId = ? ORDER BY port').all(projectId);
export const serviceBySubdomain = sub => db.prepare('SELECT s.*, p.organizationId, p.slug AS projectSlug FROM service s JOIN project p ON p.id = s.projectId WHERE s.subdomain = ?').get(sub);

export function projectsFor(user, orgIds){
  if (user.role === 'admin') return db.prepare('SELECT * FROM project ORDER BY name').all();
  if (!orgIds.length) return [];
  return db.prepare(`SELECT * FROM project WHERE organizationId IN (${orgIds.map(() => '?').join(',')}) ORDER BY name`).all(...orgIds);
}

export function publicService(s){
  const { env, ...rest } = s;
  const vars = parseEnv(decrypt(env));
  return { ...rest, url: s.subdomain ? `https://${s.subdomain}.${DOMAIN}` : null, envKeys: Object.keys(vars), unit: null };
}
function parseEnv(text){
  const out = {};
  for (const line of String(text || '').split('\n')){
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
  return out;
}

export function nextPort(){
  const used = new Set(db.prepare('SELECT port FROM service').all().map(r => r.port));
  for (let p = FIRST_SERVICE_PORT; p < 5000; p++) if (!used.has(p) && p !== PORT) return p;
  throw bad('No free ports left');
}

// Writes the systemd units for a project's services.
export async function applyServices(project){
  const services = listServices(project.id).map(s => {
    const env = parseEnv(decrypt(s.env));
    // The project's own AI workers (for example the pipeline's) use the chosen member's Claude connection.
    const cred = credentialsFor(project.workerClaudeUserId);
    if (cred?.token && !env.CLAUDE_CODE_OAUTH_TOKEN) env.CLAUDE_CODE_OAUTH_TOKEN = cred.token;
    if (cred?.apiKey && !env.ANTHROPIC_API_KEY) env.ANTHROPIC_API_KEY = cred.apiKey;
    if (s.subdomain) env.PUBLIC_URL = `https://${s.subdomain}.${DOMAIN}`;
    return { name: s.name, command: s.command, port: s.port, env, memoryMB: s.memoryMB, autostart: !!s.autostart };
  });
  await ctlOk(['apply', project.slug], { stdin: JSON.stringify({ services }) });
}

export async function serviceAction(project, service, action){
  await ctlOk(['svc', project.slug, service.name, action], { timeout: 60000 });
}

// ----- status, polled for everyone -----
let statusCache = {}, statusAt = 0;
export async function allStatus(force = false){
  if (!force && Date.now() - statusAt < 3000) return statusCache;
  const r = await ctl(['status']);
  if (r.code === 0){ try { statusCache = JSON.parse(r.out); statusAt = Date.now(); } catch {} }
  return statusCache;
}
export function statusOf(project, service){
  const s = statusCache[`ztd-${project.slug}-${service.name}`];
  if (!s) return { state: 'not installed' };
  const mem = Number(s.MemoryCurrent);
  return {
    state: s.ActiveState === 'active' ? 'running' : s.ActiveState === 'activating' ? 'starting' : s.ActiveState === 'failed' ? 'crashed' : 'stopped',
    sub: s.SubState, since: s.ActiveEnterTimestamp || null, restarts: Number(s.NRestarts) || 0,
    memoryMB: Number.isFinite(mem) && mem < 1e15 ? Math.round(mem / 1048576) : null, enabled: s.UnitFileState === 'enabled'
  };
}

// ----- create, update, delete -----
export function validateService(s, projectId, existingId){
  const name = String(s.name || '').trim().toLowerCase();
  if (!SLUG.test(name)) throw bad('Service names use lowercase letters, numbers and dashes (at least 2 characters).');
  const command = String(s.command || '').trim();
  if (!command || command.length > 2000 || /[\n\r]/.test(command)) throw bad('Each service needs a one-line start command.');
  const port = Number(s.port);
  if (!Number.isInteger(port) || port < 4300 || port > 4999 || port === PORT) throw bad('Ports must be between 4301 and 4999.');
  const clash = db.prepare('SELECT id FROM service WHERE port = ? AND id != ?').get(port, existingId || '');
  if (clash) throw bad(`Port ${port} is already used by another service.`);
  let subdomain = s.subdomain ? String(s.subdomain).trim().toLowerCase() : null;
  if (subdomain){
    if (!SLUG.test(subdomain) || RESERVED.has(subdomain)) throw bad(`"${subdomain}" can't be used as a web address.`);
    const taken = db.prepare('SELECT id FROM service WHERE subdomain = ? AND id != ?').get(subdomain, existingId || '');
    if (taken) throw bad(`${subdomain}.${DOMAIN} is already used.`);
  }
  const memoryMB = Math.max(128, Math.min(3072, Number(s.memoryMB) || 1200));
  return { name, label: String(s.label || name).slice(0, 80), command, port, subdomain, memoryMB, autostart: s.autostart === false ? 0 : 1, publicAccess: s.publicAccess ? 1 : 0 };
}

export function upsertService(projectId, input){
  const existing = input.id ? db.prepare('SELECT * FROM service WHERE id = ? AND projectId = ?').get(input.id, projectId) : null;
  const v = validateService(input, projectId, existing?.id);
  let env = existing?.env || '';
  if (typeof input.envText === 'string'){
    // Keys with an empty value keep their current value, so the UI never has to see secrets.
    const old = parseEnv(decrypt(env)), next = {};
    for (const line of input.envText.split('\n')){
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      next[m[1]] = m[2] === '' && old[m[1]] !== undefined ? old[m[1]] : m[2];
    }
    env = encrypt(Object.entries(next).map(([k, val]) => `${k}=${val}`).join('\n'));
  }
  if (existing){
    db.prepare('UPDATE service SET name=?, label=?, command=?, port=?, subdomain=?, memoryMB=?, autostart=?, publicAccess=?, env=? WHERE id=?')
      .run(v.name, v.label, v.command, v.port, v.subdomain, v.memoryMB, v.autostart, v.publicAccess, env, existing.id);
    return { id: existing.id, subdomainChanged: existing.subdomain !== v.subdomain, oldSubdomain: existing.subdomain };
  }
  const id = randomId(9);
  db.prepare('INSERT INTO service (id, projectId, name, label, command, port, subdomain, memoryMB, autostart, publicAccess, env) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, projectId, v.name, v.label, v.command, v.port, v.subdomain, v.memoryMB, v.autostart, v.publicAccess, env);
  return { id, subdomainChanged: !!v.subdomain, oldSubdomain: null };
}

// Sets up the Apache site and certificate for a subdomain, in the background.
export async function provisionSubdomain(serviceId){
  const s = db.prepare('SELECT * FROM service WHERE id = ?').get(serviceId);
  if (!s?.subdomain) return;
  db.prepare("UPDATE service SET certStatus = 'pending' WHERE id = ?").run(serviceId);
  const r = await ctl(['vhost', s.subdomain], { timeout: 240000 });
  let ok = false;
  try { ok = JSON.parse(r.out).ok; } catch {}
  db.prepare('UPDATE service SET certStatus = ? WHERE id = ?').run(ok ? 'ok' : 'failed', serviceId);
  if (!ok) console.error(`Certificate for ${s.subdomain} failed:`, r.err || r.out);
  return ok;
}

export async function createProject({ name, slug, organizationId, starter, gitUrl, description }, user){
  name = String(name || '').trim().slice(0, 80);
  slug = String(slug || '').trim().toLowerCase();
  if (!name) throw bad('Give the project a name.');
  if (!SLUG.test(slug) || RESERVED.has(slug)) throw bad('The short name uses lowercase letters, numbers and dashes, like "gp-pipeline".');
  if (db.prepare('SELECT 1 FROM project WHERE slug = ?').get(slug)) throw bad('A project with that short name already exists.');
  if (db.prepare('SELECT 1 FROM service WHERE subdomain = ?').get(slug)) throw bad(`${slug}.${DOMAIN} is already used.`);
  if (gitUrl && !/^https:\/\/[\w.-]+\/[\w./-]+$/.test(gitUrl)) throw bad('Use a public https git address, like https://github.com/owner/repo.git');
  const id = randomId(9);
  db.prepare('INSERT INTO project (id, slug, name, description, organizationId, workerClaudeUserId, createdBy, createdAt, status) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, slug, name, String(description || '').slice(0, 500), organizationId, user.id, user.id, now(), 'creating');
  audit(user.id, 'project.create', slug);
  (async () => {
    try {
      await ctlOk(['project-create', slug, gitUrl ? 'clone' : (starter || 'blank')], { stdin: gitUrl || '', timeout: 320000 });
      const svc = upsertService(id, { name: 'web', label: 'Website', command: gitUrl ? 'npm install --omit=dev && npm start' : 'node server.mjs', port: nextPort(), subdomain: slug });
      const project = getProject(id);
      await applyServices(project);
      await serviceAction(project, { name: 'web' }, 'start').catch(() => {});
      db.prepare("UPDATE project SET status = 'ready', statusDetail = '' WHERE id = ?").run(id);
      notify(user.id, 'projectReady', { projectName: name, status: 'ready', url: `${STUDIO_URL}/p/${id}/chat` });
      await provisionSubdomain(svc.id);
    } catch (e){
      if (getProject(id)?.status === 'ready') return;   // only the certificate failed; the project works
      db.prepare("UPDATE project SET status = 'error', statusDetail = ? WHERE id = ?").run(e.message.slice(0, 500), id);
      notify(user.id, 'projectReady', { projectName: name, status: 'error', detail: e.message.slice(0, 500), url: `${STUDIO_URL}/p/${id}/settings` });
    }
  })();
  return getProject(id);
}

export async function deleteProject(project, user){
  for (const s of listServices(project.id)) if (s.subdomain) await ctl(['vhost-remove', s.subdomain]);
  await ctlOk(['project-delete', project.slug]);
  db.prepare('DELETE FROM project WHERE id = ?').run(project.id);
  audit(user.id, 'project.delete', project.slug);
}
