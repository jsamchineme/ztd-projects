// Server-side composition: combine the mail-server snapshot with client records into the shapes
// the pages render. Read-only helpers; mutations live in the route/action modules.
import 'server-only';
import * as stalwart from './stalwart';
import type { Snapshot } from './stalwart';
import { clients, requests, activity, dnsCache } from './store';
import type { Client } from './store';
import { PLANS, PLAN_ORDER, limitsFor, listPrice, monthlyPrice } from './plans';

export const LICENCE_SEATS = Number(process.env.LICENCE_SEATS || 25);
export const LICENCE_RENEWS = process.env.LICENCE_RENEWS || '2026-11-19';
const INTERNAL_DOMAIN = process.env.PANEL_INTERNAL_DOMAIN || 'ztdoffice.com';

export const seatsUsed = (s: Snapshot) => s.users.length + s.sharedInboxes.length;

// First run: create the internal "ZTD Office" client and give it the platform domain.
export async function ensureSeed(s: Snapshot) {
  if ((await clients.list()).length) return;
  const c = await clients.create({ name: 'ZTD Office', contactName: 'Samuel', plan: 'business', customPrice: 0, internal: true });
  if (s.domains.some((d) => d.name === INTERNAL_DOMAIN)) await clients.addDomain(c.id, INTERNAL_DOMAIN);
}

export interface Usage {
  doms: Set<string>;
  inboxes: stalwart.MailUser[];
  shared: stalwart.SharedInbox[];
  lists: stalwart.MailList[];
  aliases: { address: string; enabled: boolean; inboxId: string; to: string; toName: string }[];
  inboxCount: number;
  aliasCount: number;
  usedBytes: number;
  quotaBytes: number;
}

export async function usage(c: Client, s: Snapshot): Promise<Usage> {
  const doms = new Set(await clients.domains(c.id));
  const inboxes = s.users.filter((u) => u.domain && doms.has(u.domain) && !u.admin);
  const shared = s.sharedInboxes.filter((g) => g.domain && doms.has(g.domain));
  const lists = s.lists.filter((l) => l.domain && doms.has(l.domain));
  const aliases = inboxes.flatMap((u) => u.aliases.map((a) => ({ address: a.address, enabled: a.enabled, inboxId: u.id, to: u.email, toName: u.description || u.name })));
  return {
    doms, inboxes, shared, lists, aliases,
    inboxCount: inboxes.length + shared.length,
    aliasCount: lists.length + aliases.length,
    usedBytes: [...inboxes, ...shared].reduce((a, x) => a + x.used, 0),
    quotaBytes: [...inboxes, ...shared].reduce((a, x) => a + x.quota, 0),
  };
}

export interface ClientSummary {
  id: string; name: string; contactName: string; contactEmail: string;
  plan: string; planName: string; internal: boolean; status: string;
  customPrice: number | null; listPrice: number; monthly: number;
  extraInboxes: number; extraAliases: number; notes: string; createdAt: string;
  limits: ReturnType<typeof limitsFor>;
  usage: { inboxes: number; aliases: number; usedBytes: number; quotaBytes: number };
  domains: { name: string; onMailServer: boolean; createdAt: string | null; dns: { verified: boolean; missingRequired: string[]; checkedAt: string } | null }[];
  openRequests: number;
}

export async function clientSummary(c: Client, s: Snapshot, dns: Record<string, { verified: boolean; missingRequired: string[]; checkedAt: string }>): Promise<ClientSummary> {
  const u = await usage(c, s);
  const sd = Object.fromEntries(s.domains.map((d) => [d.name, d]));
  const pricing = { plan: c.plan as keyof typeof PLANS, custom_price: c.customPrice, extra_inboxes: c.extraInboxes, extra_aliases: c.extraAliases };
  return {
    id: c.id, name: c.name, contactName: c.contactName, contactEmail: c.contactEmail,
    plan: c.plan, planName: PLANS[c.plan as keyof typeof PLANS]?.name || c.plan, internal: c.internal, status: c.status,
    customPrice: c.customPrice == null ? null : c.customPrice / 100, listPrice: listPrice(pricing), monthly: monthlyPrice(pricing),
    extraInboxes: c.extraInboxes, extraAliases: c.extraAliases, notes: c.notes, createdAt: c.createdAt.toISOString(),
    limits: limitsFor(pricing),
    usage: { inboxes: u.inboxCount, aliases: u.aliasCount, usedBytes: u.usedBytes, quotaBytes: u.quotaBytes },
    domains: [...u.doms].map((name) => {
      const d = dns[name];
      return { name, onMailServer: !!sd[name], createdAt: sd[name]?.createdAt || null, dns: d ? { verified: d.verified, missingRequired: d.missingRequired, checkedAt: d.checkedAt } : null };
    }),
    openRequests: (await requests.open(c.id)).length,
  };
}

export interface Attention { level: 'bad' | 'warn' | 'brand'; title: string; detail: string; clientId?: string }

export async function overviewData() {
  const s = await stalwart.snapshot();
  await ensureSeed(s);
  const all = await clients.list();
  const dnsMap = await dnsCache.many((await clients.allDomains() && Object.keys(await clients.allDomains())));
  const sums = await Promise.all(all.map((c) => clientSummary(c, s, dnsMap as never)));
  const paying = sums.filter((c) => !c.internal && c.status === 'active');
  const used = seatsUsed(s);

  const attention: Attention[] = [];
  if (LICENCE_SEATS - used <= 5) attention.push({ level: 'bad', title: `Only ${LICENCE_SEATS - used} mail licence seats left`, detail: `${used} of ${LICENCE_SEATS} used. Add seats in the Stalwart portal before the next client.` });
  for (const r of await requests.open()) {
    const c = all.find((x) => x.id === r.clientId);
    attention.push({ level: 'brand', title: `${c?.name || 'A client'} asked: ${r.detail}`, detail: 'Change their plan on the client page, then mark the request done.', clientId: r.clientId });
  }
  for (const c of sums) {
    if (c.status === 'suspended') attention.push({ level: 'warn', title: `${c.name} is suspended`, detail: 'Nobody can sign in. Mail is still received.', clientId: c.id });
    if (!c.internal && c.usage.inboxes >= c.limits.inboxes) attention.push({ level: 'warn', title: `${c.name} is at their inbox limit`, detail: `${c.usage.inboxes} of ${c.limits.inboxes} on ${c.planName}`, clientId: c.id });
    for (const d of c.domains) if (d.dns && !d.dns.verified) attention.push({ level: 'warn', title: `${d.name} isn't fully set up`, detail: `Missing: ${d.dns.missingRequired.join(', ') || 'DKIM keys'}`, clientId: c.id });
  }
  const allDomains = sums.flatMap((c) => c.domains);
  const acts = await activity.list({ limit: 8 });
  return {
    mrr: paying.reduce((a, c) => a + c.monthly, 0),
    clients: { total: sums.filter((c) => !c.internal).length, byPlan: Object.fromEntries(PLAN_ORDER.map((p) => [p, paying.filter((c) => c.plan === p).length])) as Record<string, number> },
    seats: { used, total: LICENCE_SEATS, renews: LICENCE_RENEWS },
    domains: { verified: allDomains.filter((d) => d.dns?.verified).length, total: allDomains.length },
    storage: sums.map((c) => ({ id: c.id, name: c.name, usedBytes: c.usage.usedBytes, quotaBytes: c.usage.quotaBytes })).sort((a, b) => b.usedBytes - a.usedBytes),
    attention,
    clientsList: sums,
    activity: acts.map((a) => ({ action: a.action, detail: a.detail, actor: a.actor, at: a.createdAt.toISOString(), client: all.find((c) => c.id === a.clientId)?.name || null })),
  };
}

export async function clientsList() {
  const s = await stalwart.snapshot();
  await ensureSeed(s);
  const all = await clients.list();
  const dnsMap = await dnsCache.many(Object.keys(await clients.allDomains()));
  return Promise.all(all.map((c) => clientSummary(c, s, dnsMap as never)));
}
