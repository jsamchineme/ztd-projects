// Checks every ztdoffice.com DNS record against its expected value (see docs/dns.md).
// Usage: node scripts/check-dns.mjs   — uses Google's public DNS-over-HTTPS, no dependencies.
const DOMAIN = 'ztdoffice.com';
const IP = '62.238.17.8';
const MX = 'mx1.ztdoffice.com.';

const expected = [
  ['A', 'mail', IP],
  ['A', 'mx1', IP],
  ['MX', '@', `10 ${MX}`],
  ['CNAME', 'autoconfig', MX],
  ['CNAME', 'autodiscover', MX],
  ['CNAME', 'mta-sts', MX],
  ['CNAME', 'ua-auto-config', MX],
  ['TXT', '@', 'v=spf1 mx include:amazonses.com ~all'],
  ['TXT', 'mx1', 'v=spf1 a -all'],
  ['TXT', 'v1-ed25519-20261019._domainkey', 'v=DKIM1; k=ed25519; h=sha256; p=Z1ojTv8hY5wA2BUMBKR6ownzyTONYM6qKQVqw8zuJXs='],
  ['TXT', 'v1-rsa-20261019._domainkey', 'v=DKIM1; k=rsa; h=sha256; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8AdaCy1Fs0FgrIMBlGyyCGfeYMVtlpZGjUN1qB5qU/Q4ANn+Gc11Eii9ItvLN2TB5jiNTmoaq/elDypntbH9fj4SvOhb8p2J27sLjpH1j4Pdishq3R4kewC6zbjaxabtdBLXaMoH/L/WJzw8VTCZUYhKEeBkGs61AQxOSXMkhbwNAg7QbaL1wGep0t3rGyTxEohQvp+GfKuiH2Gu5kyOrHmdytaU8UHhsCVeeAvEQ9IYqaKD54hYKIc8LnMmed39V5f5a9K0IMKh0nCELl+K2959xhAhIr5u4LOp0NlW6PYGgT6EHaAaxyuYotvDD0UEQS0R+4EisDUhUttHMz0pwIDAQAB'],
  ['TXT', '_dmarc', 'v=DMARC1; p=none; rua=mailto:postmaster@ztdoffice.com'],
  ['TXT', '_mta-sts', 'v=STSv1; id=15493749311995301526'],
  ['TXT', '_smtp._tls', 'v=TLSRPTv1; rua=mailto:postmaster@ztdoffice.com'],
  ['TXT', '_ua-auto-config', 'v=UAAC1; a=sha256; d=4Lv01Tn6bmd5c4mE/WUWfALxUH0X5WAXAzXdXyD1I2A='],
  ['SRV', '_imaps._tcp', `0 1 993 ${MX}`],
  ['SRV', '_submissions._tcp', `0 1 465 ${MX}`],
  ['SRV', '_jmap._tcp', `0 1 443 ${MX}`],
  ['SRV', '_caldavs._tcp', `0 1 443 ${MX}`],
  ['SRV', '_carddavs._tcp', `0 1 443 ${MX}`],
];

const TYPE = { A: 1, CNAME: 5, MX: 15, TXT: 16, SRV: 33 };
const norm = (type, s) =>
  type === 'TXT' ? s.replace(/"\s*"/g, '').replace(/^"|"$/g, '').trim()
  : type === 'A' ? s.trim()
  : s.trim().toLowerCase().replace(/\.?$/, '.');

let failed = 0;
for (const [type, host, value] of expected) {
  const name = host === '@' ? DOMAIN : `${host}.${DOMAIN}`;
  const res = await (await fetch(`https://dns.google/resolve?name=${name}&type=${type}`)).json();
  const got = (res.Answer || []).filter(a => a.type === TYPE[type]).map(a => norm(type, a.data));
  const ok = got.includes(norm(type, value));
  if (!ok) failed++;
  const spfCount = type === 'TXT' && host === '@' ? got.filter(g => g.startsWith('v=spf1')).length : 0;
  let note = ok ? '' : got.length ? `got: ${got.join(' | ').slice(0, 100)}` : 'not found';
  if (spfCount > 1) { note += ` (WARNING: ${spfCount} SPF records — there must be only one)`; failed++; }
  console.log(`${ok ? '✓' : '✗'}  ${type.padEnd(5)} ${host.padEnd(32)} ${note}`);
}
console.log(failed ? `\n${failed} problem(s)` : `\nAll ${expected.length} records OK`);
process.exitCode = failed ? 1 : 0;
