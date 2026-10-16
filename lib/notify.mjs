// Notifications each person can turn on or off, by email (Account → Email notifications) and on their phone
// (Account → Phone notifications, lib/phone.mjs). Security emails (password resets and changes, two-step resets,
// invitations) aren't listed here: they're always sent.
import { db } from './db.mjs';
import { sendTemplate } from './mail.mjs';
import { sendToPhones } from './phone.mjs';

db.exec(`CREATE TABLE IF NOT EXISTS email_pref (
  userId TEXT NOT NULL,
  event TEXT NOT NULL,                  -- a key of EVENTS
  enabled INTEGER NOT NULL,
  PRIMARY KEY (userId, event)
);
CREATE TABLE IF NOT EXISTS phone_pref (
  userId TEXT NOT NULL,
  event TEXT NOT NULL,                  -- a key of PHONE_EVENTS
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
// The phone rings for every finished run, not only long ones, and can also follow teammates' chats.
// text(data) is what the notification says.
const done = d => d.ok ? 'done' : 'stopped with an error';
const said = d => d.ok ? d.summary || 'Claude finished.' : d.error;
export const PHONE_EVENTS = [
  { key: 'runFinished', label: 'Claude finishes in your chat', hint: 'Every run, done or stopped with an error. Not when you press Stop.', on: true,
    text: d => ({ title: `${d.chatTitle}: ${done(d)}`, body: `${d.projectName} · ${said(d)}` }) },
  { key: 'teamRun', label: 'Claude finishes in a teammate’s chat', hint: 'Chats other people run in your teams’ projects.', on: false,
    text: d => ({ title: `${d.userName}’s chat ${d.ok ? 'is done' : 'stopped with an error'}: ${d.chatTitle}`, body: `${d.projectName} · ${said(d)}` }) },
  { key: 'projectReady', label: 'A project you created is ready', hint: 'Or couldn’t be set up.', on: true,
    text: d => d.status === 'ready' ? { title: `${d.projectName} is ready`, body: 'Open it to start a chat.' } : { title: `${d.projectName} couldn’t be set up`, body: d.detail || '' } },
  { key: 'inviteAccepted', label: 'Someone accepts your invitation', hint: 'When a person you invited joins the team.', on: true,
    text: d => ({ title: `${d.memberName} joined ${d.orgName}`, body: `${d.memberEmail} accepted your invitation.` }) },
  { key: 'focusFlag', label: 'A prompt is flagged as off-topic', hint: 'Only while focus checks are on (Admin → Project focus).', on: true, admin: true,
    text: d => ({ title: `Off-topic prompt in ${d.projectName}`, body: `${d.userName}: ${d.reason}` }) },
];
const CHANNELS = {
  email: { table: 'email_pref', events: EVENTS },
  phone: { table: 'phone_pref', events: PHONE_EVENTS },
};
const getUser = id => db.prepare('SELECT id, name, email, role FROM user WHERE id = ?').get(id);

// What the Account page shows: [{ key, label, hint, on }].
function prefs(channel, user){
  const { table, events } = CHANNELS[channel];
  const saved = Object.fromEntries(db.prepare(`SELECT event, enabled FROM ${table} WHERE userId = ?`).all(user.id).map(r => [r.event, !!r.enabled]));
  return events.filter(e => !e.admin || user.role === 'admin').map(({ key, label, hint, on }) => ({ key, label, hint, on: saved[key] ?? on }));
}
// body: { runFinished: false, ... }. Unknown keys are ignored.
function setPrefs(channel, user, body){
  const { table, events } = CHANNELS[channel];
  const save = db.prepare(`INSERT INTO ${table} (userId, event, enabled) VALUES (?,?,?) ON CONFLICT(userId, event) DO UPDATE SET enabled = excluded.enabled`);
  for (const [key, v] of Object.entries(body || {})) if (events.some(e => e.key === key) && typeof v === 'boolean') save.run(user.id, key, v ? 1 : 0);
  return prefs(channel, user);
}
export const emailPrefs = user => prefs('email', user);
export const setEmailPrefs = (user, body) => setPrefs('email', user, body);
export const phonePrefs = user => prefs('phone', user);
export const setPhonePrefs = (user, body) => setPrefs('phone', user, body);

const wants = (channel, user, key) => prefs(channel, user).find(e => e.key === key)?.on === true;

// Tells a user about `key` on their phone and by email (template `key`), each if they want it. data gets the user's
// name as `name`. email: false skips the email (a short run, or an event with no email). Never throws.
export async function notify(userId, key, data, { email = true } = {}){
  const user = userId && getUser(userId);
  if (!user) return false;
  const phone = PHONE_EVENTS.find(e => e.key === key);
  if (phone && wants('phone', user, key)){
    try { sendToPhones(user.id, { event: key, url: data.url, ...phone.text(data) }); } catch (e){ console.error('phone notification failed', e); }
  }
  if (!email || !EVENTS.some(e => e.key === key) || !wants('email', user, key)) return false;
  return sendTemplate(user.email, key, { name: user.name, ...data });
}

// Sends to every Studio admin who wants it, except `skipUserId`.
export async function notifyAdmins(key, data, skipUserId){
  for (const { id } of db.prepare("SELECT id FROM user WHERE role = 'admin'").all()) if (id !== skipUserId) await notify(id, key, data);
}

// Phones only: everyone in the project's team except `skipUserId`.
export async function notifyTeam(organizationId, key, data, skipUserId){
  for (const { userId } of db.prepare('SELECT userId FROM member WHERE organizationId = ?').all(organizationId)) if (userId !== skipUserId) await notify(userId, key, data, { email: false });
}
