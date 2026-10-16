// Changing your own email. You confirm with your password; when email is set up, the new address must also follow
// a link Studio sends it before the change happens, and the old address gets a notice afterwards.
import { createHash } from 'node:crypto';
import { db, audit, now } from './db.mjs';
import { auth } from './auth.mjs';
import { STUDIO_URL } from './config.mjs';
import { mailEnabled, sendTemplate } from './mail.mjs';
import { randomId } from './crypto.mjs';

const bad = (status, message) => Object.assign(new Error(message), { status });
const hash = t => createHash('sha256').update(t).digest('hex');   // only a hash of the link's token is stored
const LINK_HOURS = 1;

// Password guesses here would sidestep the sign-in limit, so allow 5 tries per 15 minutes per account.
const tries = new Map();
function limit(userId){
  const recent = (tries.get(userId) || []).filter(t => t > now() - 15 * 60 * 1000);
  if (recent.length >= 5) throw bad(429, 'Too many tries. Wait 15 minutes and try again.');
  tries.set(userId, [...recent, now()]);
}

const taken = (email, userId) => !!db.prepare('SELECT 1 FROM user WHERE lower(email) = lower(?) AND id != ?').get(email, userId);

async function apply(user, email, ip){
  if (taken(email, user.id)) throw bad(409, 'Another account already uses that email.');
  await (await auth.$context).internalAdapter.updateUser(user.id, { email, emailVerified: true });
  db.prepare('DELETE FROM email_change WHERE userId = ?').run(user.id);
  audit(user.id, 'account.email-changed', email, user.email, ip);
  sendTemplate(user.email, 'emailChanged', { name: user.name, oldEmail: user.email, email, ip, url: `${STUDIO_URL}/login` });
}

// Returns { changed: true } when done at once (email isn't set up), or { sentTo } when a link is on its way.
export async function requestEmailChange(user, body, ip){
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email) || email.length > 254) throw bad(400, 'Enter a valid email address.');
  if (email === user.email.toLowerCase()) throw bad(400, 'That’s already your email.');
  limit(user.id);
  const ctx = await auth.$context;
  const account = await ctx.internalAdapter.findCredentialAccount(user.id);
  const password = String(body.password || '');
  if (!account?.password || !password || password.length > 256 || !await ctx.password.verify({ hash: account.password, password })) throw bad(400, 'That password isn’t right.');
  if (taken(email, user.id)) throw bad(409, 'Another account already uses that email.');
  if (!mailEnabled()){ await apply(user, email, ip); return { changed: true, email }; }
  const token = randomId(32);
  db.prepare('DELETE FROM email_change WHERE userId = ?').run(user.id);
  db.prepare('INSERT INTO email_change (token, userId, email, expiresAt) VALUES (?,?,?,?)').run(hash(token), user.id, email, now() + LINK_HOURS * 3600 * 1000);
  audit(user.id, 'account.email-change-requested', email, user.email, ip);
  const sent = await sendTemplate(email, 'confirmEmail', { name: user.name, oldEmail: user.email, email, hours: LINK_HOURS,
    url: `${STUDIO_URL}/api/account/email/confirm?token=${token}` });
  if (!sent) throw bad(502, `Studio couldn’t send email to ${email}. Check the address, or ask an admin to check the email settings.`);
  return { sentTo: email };
}

// Follows the link from the confirmation email. Returns 'changed', 'taken' or 'invalid'.
export async function confirmEmailChange(token, ip){
  const row = token && db.prepare('SELECT * FROM email_change WHERE token = ?').get(hash(token));
  if (!row || row.expiresAt < now()){ if (row) db.prepare('DELETE FROM email_change WHERE token = ?').run(row.token); return 'invalid'; }
  const user = db.prepare('SELECT id, name, email FROM user WHERE id = ?').get(row.userId);
  if (!user) return 'invalid';
  try { await apply(user, row.email, ip); return 'changed'; }
  catch (e){ if (e.status === 409) return 'taken'; throw e; }
}
