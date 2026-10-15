// Sends Studio's emails. Settings saved on the Admin page (password encrypted in the database) win over the
// SMTP_* lines in /etc/studio/studio.env. Without either, nothing is sent and callers show the link to an admin.
import nodemailer from 'nodemailer';
import { SMTP, APP_NAME } from './config.mjs';
import { getSetting, setSetting, db } from './db.mjs';
import { encrypt, decrypt } from './crypto.mjs';

const bad = message => Object.assign(new Error(message), { status: 400 });
let cache = null;   // { smtp, transport }

function current(){
  if (cache) return cache;
  const saved = getSetting('smtp');
  const smtp = saved ? { ...saved, pass: decrypt(saved.pass), source: 'studio' } : SMTP ? { ...SMTP, source: 'server' } : null;
  cache = { smtp, transport: smtp && transportFor(smtp) };
  return cache;
}
const transportFor = s => nodemailer.createTransport({ host: s.host, port: s.port, secure: s.secure, auth: { user: s.user, pass: s.pass },
  connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 30000 });

export const mailEnabled = () => !!current().transport;

// What the Admin page shows. Never includes the password.
export function mailSettings(){
  const s = current().smtp;
  return s ? { source: s.source, host: s.host, port: s.port, secure: s.secure, user: s.user, from: s.from, hasPassword: !!s.pass } : { source: 'none' };
}

// Checks the settings by signing in to the mail server, then saves them. An empty password keeps the saved one.
export async function saveMailSettings(body){
  const host = String(body.host || '').trim(), user = String(body.user || '').trim(), from = String(body.from || '').trim() || user;
  const port = Number(body.port) || 465, secure = body.secure !== false;
  if (!/^[a-z0-9.-]+$/i.test(host)) throw bad('Enter the mail server, for example smtp.gmail.com');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw bad('The port must be a number, usually 465 or 587');
  if (!user) throw bad('Enter the user name, usually the email address');
  if (!/^[^\s<>@]+@[^\s<>@]+$/.test(from)) throw bad('The From address must be an email address');
  const pass = String(body.pass || '') || (current().smtp?.source === 'studio' ? current().smtp.pass : '');
  if (!pass) throw bad('Enter the password (for Gmail, an app password)');
  const smtp = { host, port, secure, user, pass, from };
  try { await transportFor(smtp).verify(); }
  catch (e){ throw bad(`The mail server refused these settings: ${e.message}`); }
  setSetting('smtp', { ...smtp, pass: encrypt(pass) });
  cache = null;
}

export function clearMailSettings(){
  db.prepare("DELETE FROM setting WHERE key = 'smtp'").run();
  cache = null;
}

async function deliver(to, subject, text){
  const { smtp, transport } = current();
  if (!transport) throw bad('Email isn’t set up');
  await transport.sendMail({ from: `${APP_NAME} <${smtp.from}>`, to, subject, text });
}
export async function sendTestMail(to){
  try { await deliver(to, `Test email from ${APP_NAME}`, `This is a test. ${APP_NAME} can send password reset links and invitations.`); }
  catch (e){ throw bad(`Sending failed: ${e.message}`); }
}

export async function sendMail(to, subject, text){
  if (!mailEnabled()){ console.log(`[mail disabled] to=${to} subject="${subject}"`); return false; }
  try { await deliver(to, subject, text); return true; }
  catch (e){ console.error('Email failed:', e.message); return false; }
}
