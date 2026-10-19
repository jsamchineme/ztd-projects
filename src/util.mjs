import { randomUUID, randomBytes, scrypt as _scrypt, timingSafeEqual, createHmac } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(_scrypt);

export const id = () => randomUUID();
export const now = () => new Date().toISOString();
export const token = (bytes = 32) => randomBytes(bytes).toString('base64url');

export const json = {
  parse(str, fallback = null) { try { return JSON.parse(str); } catch { return fallback; } },
  stringify(obj) { return JSON.stringify(obj ?? null); },
};

// ---- password hashing (scrypt, salt per password) ----
export async function hashPassword(password) {
  const salt = randomBytes(16);
  const dk = await scrypt(String(password), salt, 64);
  return `scrypt$${salt.toString('hex')}$${dk.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  try {
    const [scheme, saltHex, hashHex] = String(stored).split('$');
    if (scheme !== 'scrypt') return false;
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');
    const dk = await scrypt(String(password), salt, expected.length);
    return expected.length === dk.length && timingSafeEqual(expected, dk);
  } catch { return false; }
}

export const hmacSha256 = (keyBuf, data) =>
  createHmac('sha256', keyBuf).update(data).digest('base64');

// ---- text helpers ----
export function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// crude html -> plain text for snippets
export function htmlToText(html = '') {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}
export function snippet(text = '', n = 180) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n) + '…' : t;
}
// parse "Name <addr@x>" or "addr@x" -> {name, addr}
export function parseAddress(v = '') {
  const m = String(v).match(/^\s*(?:"?([^"<]*?)"?\s*)?<?([^<>\s]+@[^<>\s]+)>?\s*$/);
  if (!m) return { name: '', addr: String(v).trim() };
  return { name: (m[1] || '').trim(), addr: (m[2] || '').trim().toLowerCase() };
}
export const addrListToText = (arr = []) =>
  (arr || []).map(a => (typeof a === 'string' ? a : `${a.name || ''} <${a.addr}>`.trim())).join(', ');
