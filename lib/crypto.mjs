import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { SECRET } from './config.mjs';

const KEY = createHash('sha256').update('studio-enc:' + SECRET).digest();
const MAC = createHash('sha256').update('studio-mac:' + SECRET).digest();

export const randomId = (bytes = 16) => randomBytes(bytes).toString('base64url');

export function encrypt(text){
  if (!text) return '';
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', KEY, iv);
  const body = Buffer.concat([c.update(text, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64');
}
export function decrypt(blob){
  if (!blob) return '';
  const b = Buffer.from(blob, 'base64');
  const d = createDecipheriv('aes-256-gcm', KEY, b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8');
}

// Signed values for host-only cookies on project subdomains.
export function sign(value){
  return value + '.' + createHmac('sha256', MAC).update(value).digest('base64url');
}
export function unsign(signed){
  const i = String(signed || '').lastIndexOf('.');
  if (i < 1) return null;
  const value = signed.slice(0, i), mac = Buffer.from(signed.slice(i + 1));
  const want = Buffer.from(createHmac('sha256', MAC).update(value).digest('base64url'));
  return mac.length === want.length && timingSafeEqual(mac, want) ? value : null;
}
