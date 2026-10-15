// Sends Studio's emails. Without SMTP settings nothing is sent, and callers show the link to an admin instead.
import nodemailer from 'nodemailer';
import { SMTP, APP_NAME } from './config.mjs';

const transport = SMTP ? nodemailer.createTransport({
  host: SMTP.host, port: SMTP.port, secure: SMTP.secure, auth: { user: SMTP.user, pass: SMTP.pass }
}) : null;

export const mailEnabled = () => !!transport;

export async function sendMail(to, subject, text){
  if (!transport){ console.log(`[mail disabled] to=${to} subject="${subject}"`); return false; }
  try {
    await transport.sendMail({ from: `${APP_NAME} <${SMTP.from}>`, to, subject, text });
    return true;
  } catch (e){
    console.error('Email failed:', e.message);
    return false;
  }
}
