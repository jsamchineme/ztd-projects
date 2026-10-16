// Email notifications each person can turn on or off (Account → Email notifications). Security emails (password
// resets and changes, two-step resets, invitations) aren't listed here: they're always sent.
import { db } from './db.mjs';
import { sendTemplate } from './mail.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS email_pref (
  userId TEXT NOT NULL,
  event TEXT NOT NULL,                  -- a key of EVENTS
  enabled INTEGER NOT NULL,
  PRIMARY KEY (userId, event)
)`);

// key = the template in lib/emails.mjs. on = the setting for people who haven't chosen. admin = Studio admins only.
export const EVENTS = [
  { key: 'runFinished', label: 'Claude finishes a long run', hint: 'When a prompt you sent took over a minute, or stopped with an error. Not when you press Stop.', on: true },
  { key: 'projectReady', label: 'A project you created is ready', hint: 'Or couldn’t be set up.', on: true },
  { key: 'inviteAccepted', label: 'Someone accepts your invitation', hint: 'When a person you invited joins the team.', on: true },
  { key: 'focusFlag', label: 'A prompt is flagged as off-topic', hint: 'Only while focus checks are on (Admin → Project focus).', on: true, admin: true },
];
const byKey = Object.fromEntries(EVENTS.map(e => [e.key, e]));
const getUser = id => db.prepare('SELECT id, name, email, role FROM user WHERE id = ?').get(id);

// What the Account page shows: [{ key, label, hint, on }].
export function emailPrefs(user){
  const saved = Object.fromEntries(db.prepare('SELECT event, enabled FROM email_pref WHERE userId = ?').all(user.id).map(r => [r.event, !!r.enabled]));
  return EVENTS.filter(e => !e.admin || user.role === 'admin').map(({ key, label, hint, on }) => ({ key, label, hint, on: saved[key] ?? on }));
}

// body: { runFinished: false, ... }. Unknown keys are ignored.
export function setEmailPrefs(user, body){
  const save = db.prepare('INSERT INTO email_pref (userId, event, enabled) VALUES (?,?,?) ON CONFLICT(userId, event) DO UPDATE SET enabled = excluded.enabled');
  for (const [key, v] of Object.entries(body || {})) if (byKey[key] && typeof v === 'boolean') save.run(user.id, key, v ? 1 : 0);
  return emailPrefs(user);
}

const wants = (user, key) => emailPrefs(user).find(e => e.key === key)?.on === true;

// Sends template `key` to a user if they want it. data gets the user's name as `name`. Never throws.
export async function notify(userId, key, data){
  const user = userId && getUser(userId);
  if (!user || !wants(user, key)) return false;
  return sendTemplate(user.email, key, { name: user.name, ...data });
}

// Sends to every Studio admin who wants it, except `skipUserId`.
export async function notifyAdmins(key, data, skipUserId){
  for (const { id } of db.prepare("SELECT id FROM user WHERE role = 'admin'").all()) if (id !== skipUserId) await notify(id, key, data);
}
