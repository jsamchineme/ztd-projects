// DNS records a client domain needs, and a live check of each one (Google DNS-over-HTTPS).
// DKIM keys come from the mail server's zone for the domain; the Resend records are needed while
// outgoing mail is relayed through Resend.
import * as stalwart from './stalwart';
import { dnsCache } from './store';

const MX_HOST = process.env.MAIL_HOST || 'mx1.ztdoffice.com';
const TYPE: Record<string, number> = { A: 1, CNAME: 5, MX: 15, TXT: 16 };
const FRESH_MS = 10 * 60_000;

const unquote = (s: string) => s.replace(/"\s*"/g, '').replace(/^"|"$/g, '').trim();
const dot = (s: string) => s.trim().toLowerCase().replace(/\.?$/, '.');

interface RecordSpec { key: string; group: string; label: string; type: string; host: string; value: string; required: boolean; test: (got: string[]) => boolean; }
export interface CheckedRecord { key: string; group: string; label: string; type: string; host: string; value: string; required: boolean; name: string; ok: boolean; found: string[]; error: string | null; }
export interface DomainCheck { checkedAt: string; records: CheckedRecord[]; verified: boolean; missingRequired: string[]; dkimKnown: boolean; }

function dkimFromZone(zone: string, domain: string) {
  const out: { selector: string; value: string; rsa: boolean }[] = [];
  const re = /^(\S+)\._domainkey\.\S+\s+IN\s+TXT\s+(\([\s\S]*?\)|"[^\n]*")/gm;
  for (const m of zone.matchAll(re)) {
    const value = [...m[2]!.matchAll(/"([^"]*)"/g)].map((x) => x[1]).join('');
    out.push({ selector: m[1]!, value, rsa: /k=rsa/.test(value) });
  }
  return out.filter((d) => !d.selector.includes(domain));
}

export async function expectedRecords(domainName: string, domainId?: string | null): Promise<{ recs: RecordSpec[]; dkimKnown: boolean }> {
  let dkim: { selector: string; value: string; rsa: boolean }[] = [];
  if (domainId) {
    try { dkim = dkimFromZone(await stalwart.domainZone(domainId), domainName); } catch { /* shown as unknown */ }
  }
  const recs: RecordSpec[] = [
    { key: 'mx', group: 'Receiving', label: 'MX', type: 'MX', host: '@', value: `10 ${MX_HOST}`, required: true, test: (got) => got.some((g) => dot(g.split(/\s+/).pop()!) === dot(MX_HOST)) },
    { key: 'spf', group: 'Authentication', label: 'SPF', type: 'TXT', host: '@', value: 'v=spf1 mx include:amazonses.com ~all', required: true, test: (got) => { const spf = got.filter((g) => g.startsWith('v=spf1')); return spf.length === 1 && /include:amazonses\.com/.test(spf[0]!) && /\bmx\b/.test(spf[0]!); } },
    ...dkim.map((d) => ({ key: `dkim-${d.selector}`, group: 'Authentication', label: d.rsa ? 'DKIM (RSA)' : 'DKIM (Ed25519)', type: 'TXT', host: `${d.selector}._domainkey`, value: d.value, required: d.rsa, test: (got: string[]) => { const p = (d.value.match(/p=([^;\s]+)/) || [])[1]; return got.some((g) => !!p && g.replace(/\s/g, '').includes(p)); } })),
    { key: 'dmarc', group: 'Authentication', label: 'DMARC', type: 'TXT', host: '_dmarc', value: 'v=DMARC1; p=none', required: true, test: (got) => got.some((g) => g.startsWith('v=DMARC1')) },
    { key: 'resend-dkim', group: 'Outgoing mail', label: 'Resend DKIM', type: 'TXT', host: 'resend._domainkey', value: 'Copy from Resend → Domains', required: true, test: (got) => got.some((g) => g.startsWith('p=')) },
    { key: 'send-mx', group: 'Outgoing mail', label: 'Bounce MX', type: 'MX', host: 'send', value: '10 feedback-smtp.eu-west-1.amazonses.com', required: true, test: (got) => got.some((g) => /amazonses\.com\.?$/.test(g)) },
    { key: 'send-spf', group: 'Outgoing mail', label: 'Bounce SPF', type: 'TXT', host: 'send', value: 'v=spf1 include:amazonses.com ~all', required: true, test: (got) => got.some((g) => g.startsWith('v=spf1') && g.includes('amazonses.com')) },
    { key: 'autoconfig', group: 'App setup', label: 'Auto-setup', type: 'CNAME', host: 'autoconfig', value: `${MX_HOST}.`, required: false, test: (got) => got.some((g) => dot(g) === dot(MX_HOST)) },
    { key: 'autodiscover', group: 'App setup', label: 'Outlook setup', type: 'CNAME', host: 'autodiscover', value: `${MX_HOST}.`, required: false, test: (got) => got.some((g) => dot(g) === dot(MX_HOST)) },
  ];
  return { recs, dkimKnown: dkim.length > 0 };
}

async function resolve(name: string, type: string): Promise<string[]> {
  const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, { signal: AbortSignal.timeout(8000) });
  const j = await res.json();
  return (j.Answer || []).filter((a: { type: number }) => a.type === TYPE[type]).map((a: { data: string }) => (type === 'TXT' ? unquote(a.data) : a.data.trim()));
}

export async function checkDomain(domainName: string, domainId?: string | null, { refresh = false } = {}): Promise<DomainCheck> {
  const cached = await dnsCache.get(domainName);
  if (!refresh && cached && Date.now() - Date.parse(cached.checkedAt) < FRESH_MS) return cached as unknown as DomainCheck;
  const { recs, dkimKnown } = await expectedRecords(domainName, domainId);
  const records: CheckedRecord[] = await Promise.all(recs.map(async (r) => {
    const name = r.host === '@' ? domainName : `${r.host}.${domainName}`;
    let found: string[] = [], ok = false, error: string | null = null;
    try { found = await resolve(name, r.type); ok = r.test(found); } catch { error = 'lookup failed'; }
    const { test, ...rest } = r;
    void test;
    return { ...rest, name, ok, found: found.slice(0, 3).map((f) => f.slice(0, 120)), error };
  }));
  const missingRequired = records.filter((r) => r.required && !r.ok).map((r) => r.label);
  const result: Omit<DomainCheck, 'checkedAt'> = { records, verified: dkimKnown && missingRequired.length === 0, missingRequired, dkimKnown };
  await dnsCache.set(domainName, result);
  return { checkedAt: new Date().toISOString(), ...result };
}
