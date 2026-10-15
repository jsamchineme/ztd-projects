// Server-side admin commands. Run as root on the server:
//   studio-admin bootstrap <email> "<name>" "<team name>"   first owner account and team
//   studio-admin reset-link <email> [hours]               a password link (default 48 hours)
//   studio-admin import-project <slug> "<name>" <team slug> <services.json>
//   studio-admin make-admin <email>
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { auth, migrate } from '../lib/auth.mjs';
import { db, now, audit } from '../lib/db.mjs';
import { randomId } from '../lib/crypto.mjs';
import { STUDIO_URL } from '../lib/config.mjs';
import * as P from '../lib/projects.mjs';

await migrate();
const [cmd, ...a] = process.argv.slice(2);

async function resetLink(email, hours = 48){
  const user = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?)').get(email);
  if (!user) throw new Error(`No account for ${email}`);
  await auth.api.requestPasswordReset({ body: { email, redirectTo: '/reset-password' } });
  const row = db.prepare("SELECT id, identifier FROM verification WHERE value = ? AND identifier LIKE 'reset-password:%' ORDER BY createdAt DESC LIMIT 1").get(user.id);
  if (!row) throw new Error('No reset token was created');
  const exp = new Date(Date.now() + hours * 3600 * 1000);
  db.prepare('UPDATE verification SET expiresAt = ? WHERE id = ?').run(typeof row.expiresAt === 'number' ? exp.getTime() : exp.toISOString(), row.id);
  const token = row.identifier.slice('reset-password:'.length);
  audit(null, 'admin.cli.reset-link', email);
  return `${STUDIO_URL}/reset-password?token=${encodeURIComponent(token)}`;
}

if (cmd === 'bootstrap'){
  const [email, name, team] = a;
  if (!email || !name || !team) throw new Error('usage: bootstrap <email> <name> <team>');
  let user = db.prepare('SELECT * FROM user WHERE lower(email) = lower(?)').get(email);
  if (!user){
    if (db.prepare('SELECT count(*) AS n FROM user').get().n) throw new Error('Studio already has accounts; invite people from the app instead.');
    // A random password nobody knows: the owner sets their own through the link below.
    await auth.api.signUpEmail({ body: { email, name, password: randomBytes(24).toString('base64url') } });
    user = db.prepare('SELECT * FROM user WHERE lower(email) = lower(?)').get(email);
    db.prepare('UPDATE user SET emailVerified = 1 WHERE id = ?').run(user.id);
  }
  let org = db.prepare('SELECT o.* FROM organization o JOIN member m ON m.organizationId = o.id WHERE m.userId = ? LIMIT 1').get(user.id);
  if (!org){
    const slug = team.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await auth.api.createOrganization({ body: { name: team, slug, userId: user.id } });
    org = db.prepare('SELECT * FROM organization WHERE slug = ?').get(slug);
  }
  console.log(JSON.stringify({ user: user.email, team: org.name, teamSlug: org.slug, setPasswordLink: await resetLink(email) }, null, 2));
} else if (cmd === 'reset-link'){
  console.log(await resetLink(a[0], Number(a[1]) || 48));
} else if (cmd === 'add-user'){
  // add-user <email> <name> <password> [admin] [team slug] — mainly for tests; people normally join by invitation.
  const [email, name, password, role, teamSlug] = a;
  await auth.api.createUser({ body: { email, name, password, role: role === 'admin' ? 'admin' : 'user' } });
  const u = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?)').get(email);
  db.prepare('UPDATE user SET emailVerified = 1 WHERE id = ?').run(u.id);
  if (teamSlug){
    const org = db.prepare('SELECT id FROM organization WHERE slug = ?').get(teamSlug);
    if (org) await auth.api.addMember({ body: { userId: u.id, organizationId: org.id, role: 'member' } });
  }
  console.log(JSON.stringify({ ok: true, id: u.id }));
} else if (cmd === 'delete-user'){
  const u = db.prepare('SELECT id FROM user WHERE lower(email) = lower(?)').get(a[0]);
  if (!u) throw new Error('No such user');
  db.prepare('DELETE FROM session WHERE userId = ?').run(u.id);
  db.prepare('DELETE FROM member WHERE userId = ?').run(u.id);
  db.prepare('DELETE FROM twoFactor WHERE userId = ?').run(u.id);
  db.prepare('DELETE FROM account WHERE userId = ?').run(u.id);
  db.prepare('DELETE FROM claude_connection WHERE userId = ?').run(u.id);
  db.prepare('DELETE FROM user WHERE id = ?').run(u.id);
  console.log('deleted');
} else if (cmd === 'make-admin'){
  db.prepare("UPDATE user SET role = 'admin' WHERE lower(email) = lower(?)").run(a[0]);
  console.log('ok');
} else if (cmd === 'import-project'){
  // For a project folder that already exists in /srv/projects/<slug>/repo.
  const [slug, name, teamSlug, file] = a;
  const org = db.prepare('SELECT * FROM organization WHERE slug = ?').get(teamSlug);
  if (!org) throw new Error(`No team ${teamSlug}`);
  const owner = db.prepare("SELECT userId FROM member WHERE organizationId = ? AND role = 'owner' LIMIT 1").get(org.id);
  let p = db.prepare('SELECT * FROM project WHERE slug = ?').get(slug);
  if (!p){
    db.prepare('INSERT INTO project (id, slug, name, organizationId, workerClaudeUserId, createdBy, createdAt, status) VALUES (?,?,?,?,?,?,?,?)')
      .run(randomId(9), slug, name, org.id, owner?.userId || null, owner?.userId || null, now(), 'ready');
    p = db.prepare('SELECT * FROM project WHERE slug = ?').get(slug);
  }
  const spec = JSON.parse(readFileSync(file, 'utf8'));
  for (const s of spec.services){
    const existing = db.prepare('SELECT id FROM service WHERE projectId = ? AND name = ?').get(p.id, s.name);
    P.upsertService(p.id, { ...s, id: existing?.id });
  }
  if (spec.description) db.prepare('UPDATE project SET description = ? WHERE id = ?').run(spec.description, p.id);
  await P.applyServices(p);
  console.log(JSON.stringify({ project: p.slug, services: P.listServices(p.id).map(s => `${s.name}:${s.port}:${s.subdomain || '-'}`) }));
} else {
  console.log('Commands: bootstrap, reset-link, make-admin, import-project');
}
process.exit(0);
