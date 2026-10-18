// Files attached to chat messages, saved to UPLOADS_DIR/<slug>/<id>/<name>. On the server that folder is owned by
// studio with the project's user as group (setgid; ztd for older projects), so Claude can read the files but not
// change them, and they stay out of git.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { db, now, audit } from './db.mjs';
import { randomId } from './crypto.mjs';
import { UPLOADS_DIR } from './config.mjs';

export const MAX_BYTES = 100 * 1024 * 1024;
export const MAX_PER_MESSAGE = 10;
mkdirSync(UPLOADS_DIR, { recursive: true });

const bad = (message, status = 400) => Object.assign(new Error(message), { status });

export function safeName(name){
  const n = String(name || '').split(/[\\/]/).pop().replace(/[^\w.\- ()]/g, '_').replace(/^[^\w(]+/, '').trim().slice(0, 120);
  return n || 'file';
}

// What the file really is, from its bytes (never trusting the browser's type). SVG counts as text.
function sniff(buf, name){
  const hex = buf.subarray(0, 12).toString('hex');
  if (hex.startsWith('89504e470d0a1a0a')) return ['image', 'image/png'];
  if (hex.startsWith('ffd8ff')) return ['image', 'image/jpeg'];
  if (hex.startsWith('474946383')) return ['image', 'image/gif'];
  if (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') return ['image', 'image/webp'];
  if (hex.startsWith('25504446')) return ['pdf', 'application/pdf'];
  let text = !buf.subarray(0, 8192).includes(0);
  if (text) try { new TextDecoder('utf-8', { fatal: true }).decode(buf); } catch { text = false; }
  if (text && /\.ipynb$/i.test(name)) return ['notebook', 'application/x-ipynb+json'];
  return text ? ['text', 'text/plain'] : ['file', 'application/octet-stream'];
}

export async function saveUpload(project, user, { name, data }){
  if (typeof data !== 'string' || !data) throw bad('No file data');
  const buf = Buffer.from(data, 'base64');
  if (!buf.length) throw bad('That file is empty.');
  if (buf.length > MAX_BYTES) throw bad('That file is too large (100 MB at most).', 413);
  name = safeName(name);
  const [kind, mime] = sniff(buf, name);
  const id = randomId(12);
  const dir = join(UPLOADS_DIR, project.slug, id), path = join(dir, name);
  mkdirSync(dir, { recursive: true, mode: 0o750 });
  writeFileSync(path, buf, { mode: 0o640 });
  const row = { id, projectId: project.id, userId: user.id, name, kind, mime, size: buf.length, path, createdAt: now() };
  db.prepare('INSERT INTO upload (id, projectId, userId, name, kind, mime, size, path, createdAt) VALUES (@id,@projectId,@userId,@name,@kind,@mime,@size,@path,@createdAt)').run(row);
  audit(user.id, 'chat.upload', project.slug, { id, name, size: buf.length });
  return publicUpload(row);
}

export const getUpload = id => db.prepare('SELECT * FROM upload WHERE id = ?').get(id);
export const publicUpload = u => ({ id: u.id, name: u.name, kind: u.kind, mime: u.mime, size: u.size });

// The uploads named in a message, checked to belong to the project.
export function uploadsFor(project, ids){
  if (ids == null) return [];
  if (!Array.isArray(ids)) throw bad('Invalid attachments');
  if (ids.length > MAX_PER_MESSAGE) throw bad(`Attach ${MAX_PER_MESSAGE} files at most per message.`);
  return [...new Set(ids)].map(id => {
    const u = typeof id === 'string' && getUpload(id);
    if (!u || u.projectId !== project.id) throw bad('An attached file is missing. Attach it again.');
    return u;
  });
}

export const sizeText = n => n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
