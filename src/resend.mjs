// Resend client. In TEST_MODE (no API key) an in-memory fake stands in so the whole app
// runs offline and in tests. Public surface is identical in both modes.
import { config, TEST_MODE } from './config.mjs';
import { hmacSha256, id, now } from './util.mjs';
import { timingSafeEqual, createHmac } from 'node:crypto';

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(config.resendApiBase + path, {
    method,
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw { status: res.status, message: data?.message || `Resend ${res.status}`, data };
  return data;
}

// ---------------- Svix signature verification (shared by both modes) ----------------
// secret: "whsec_<base64>"; signed content: "<id>.<timestamp>.<rawBody>"
export function verifyWebhookSignature(secret, { svixId, svixTimestamp, svixSignature }, rawBody) {
  if (!secret || !svixId || !svixTimestamp || !svixSignature) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const signed = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expected = createHmac('sha256', key).update(signed).digest(); // Buffer
  // header is space-separated "v1,<sig> v1a,<sig> ..."
  for (const part of String(svixSignature).split(' ')) {
    const [, sig] = part.split(',');
    if (!sig) continue;
    let given;
    try { given = Buffer.from(sig, 'base64'); } catch { continue; }
    if (given.length === expected.length && timingSafeEqual(given, expected)) return true;
  }
  return false;
}

// ---------------- real client ----------------
const real = {
  async sendEmail(msg) {
    const payload = {
      from: msg.from,
      to: msg.to, cc: msg.cc, bcc: msg.bcc,
      subject: msg.subject,
      html: msg.html, text: msg.text,
      reply_to: msg.reply_to,
      headers: msg.headers,
      attachments: msg.attachments, // [{filename, content(base64)}]
    };
    return api('/emails', { method: 'POST', body: payload });
  },
  getReceivedEmail(id, { htmlFormat } = {}) {
    const q = htmlFormat ? `?html_format=${htmlFormat}` : '';
    return api(`/emails/receiving/${id}${q}`);
  },
  async listAttachments(emailId) {
    const r = await api(`/emails/receiving/${emailId}/attachments`);
    return r.data || r.attachments || [];
  },
  createDomain(name, { receiving = true } = {}) {
    return api('/domains', {
      method: 'POST',
      body: { name, capabilities: { sending: 'enabled', receiving: receiving ? 'enabled' : 'disabled' } },
    });
  },
  getDomain(domainId) { return api(`/domains/${domainId}`); },
  verifyDomain(domainId) { return api(`/domains/${domainId}/verify`, { method: 'POST' }); },
  async listDomains() { const r = await api('/domains'); return r.data || []; },
};

// ---------------- fake client (TEST_MODE) ----------------
const _received = new Map();   // emailId -> full email
const _attachments = new Map();// emailId -> [attachments]
const _sent = [];              // sent payloads
const _domains = new Map();

const fake = {
  async sendEmail(msg) {
    const eid = id();
    _sent.push({ id: eid, ...msg });
    return { id: eid };
  },
  async getReceivedEmail(eid) {
    const e = _received.get(eid);
    if (!e) throw { status: 404, message: 'not found' };
    return e;
  },
  async listAttachments(eid) { return _attachments.get(eid) || []; },
  async createDomain(name, { receiving = true } = {}) {
    const did = id();
    const rec = [
      { record: 'DKIM', type: 'TXT', name: `resend._domainkey.${name}`, value: 'p=FAKEKEY', status: 'not_started', ttl: 'Auto' },
      { record: 'SPF', type: 'MX', name: `send.${name}`, value: 'feedback-smtp.us-east-1.amazonses.com', priority: 10, status: 'not_started', ttl: 'Auto' },
      { record: 'Receiving', type: 'MX', name, value: 'inbound-smtp.resend.com', priority: 10, status: 'not_started', ttl: 'Auto' },
    ];
    const d = { id: did, name, status: 'not_started', capabilities: { sending: 'enabled', receiving: receiving ? 'enabled' : 'disabled' }, records: rec };
    _domains.set(did, d);
    return d;
  },
  async getDomain(did) { return _domains.get(did) || { id: did, status: 'not_started', records: [] }; },
  async verifyDomain(did) { const d = _domains.get(did); if (d) { d.status = 'verified'; d.records.forEach(r => r.status = 'verified'); } return d || { status: 'verified' }; },
  async listDomains() { return [..._domains.values()]; },

  // test helpers (TEST_MODE only)
  __fakeReceive(email) {
    const eid = email.id || id();
    const full = { object: 'email', id: eid, created_at: now(), ...email };
    _received.set(eid, full);
    if (email.attachments) _attachments.set(eid, email.attachments);
    return full;
  },
  __sent() { return _sent; },
  __reset() { _received.clear(); _attachments.clear(); _sent.length = 0; _domains.clear(); },
};

export const resend = TEST_MODE ? { ...fake, verifyWebhookSignature } : { ...real, verifyWebhookSignature };
export { verifyWebhookSignature as _verify };
