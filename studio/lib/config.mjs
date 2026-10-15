// Studio settings come from the environment. On the server they live in /etc/studio/studio.env.
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

export const APP_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const env = process.env;

export const PORT = Number(env.PORT || 4300);
export const DOMAIN = env.STUDIO_DOMAIN || 'localhost';               // projects live at <sub>.<DOMAIN>
export const STUDIO_HOST = env.STUDIO_HOST || `studio.${DOMAIN}`;      // the Studio app itself
export const STUDIO_URL = env.STUDIO_URL || `https://${STUDIO_HOST}`;
export const SECURE = STUDIO_URL.startsWith('https://');
export const DATA_DIR = env.STUDIO_DATA || join(APP_DIR, 'data');
export const SECRET = env.STUDIO_SECRET || '';
export const CTL = env.STUDIO_CTL || '/usr/local/sbin/studio-ctl';    // root helper, run through sudo
export const CTL_SUDO = env.STUDIO_CTL_SUDO !== '0';
export const APP_NAME = env.STUDIO_NAME || 'ZTD Studio';

if (!SECRET || SECRET.length < 32) throw new Error('STUDIO_SECRET must be set to at least 32 random characters');
mkdirSync(DATA_DIR, { recursive: true });

// Email (password resets and invites). Without SMTP, Studio shows the links to admins instead.
export const SMTP = env.SMTP_HOST ? {
  host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 465), secure: env.SMTP_SECURE !== '0',
  user: env.SMTP_USER, pass: env.SMTP_PASS, from: env.SMTP_FROM || env.SMTP_USER
} : null;
