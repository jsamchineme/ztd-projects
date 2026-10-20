// List prices and limits for the plans sold on the website. Each client can also have a custom
// monthly price (stored in pence) and extra inboxes / aliases on top.
export type PlanId = 'lite' | 'premium' | 'business';

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // £/month
  inboxes: number;
  aliases: number;
  storageGb: number;
  domains: number;
  sharedInboxes: number;
  meetings: string | null;
  blurb: string;
}

export const PLANS: Record<PlanId, Plan> = {
  lite: { id: 'lite', name: 'Lite', price: 40, inboxes: 3, aliases: 5, storageGb: 5, domains: 1, sharedInboxes: 0, meetings: null, blurb: 'Website and business email for sole traders and small teams.' },
  premium: { id: 'premium', name: 'Premium', price: 70, inboxes: 7, aliases: 10, storageGb: 10, domains: 1, sharedInboxes: 1, meetings: 'Meetings up to 1 hour', blurb: 'For growing teams that meet clients online.' },
  business: { id: 'business', name: 'Business', price: 125, inboxes: 15, aliases: 25, storageGb: 25, domains: 3, sharedInboxes: 3, meetings: 'Unlimited meetings', blurb: 'For established firms with several departments.' },
};
export const PLAN_ORDER: PlanId[] = ['lite', 'premium', 'business'];
export const isPlan = (v: unknown): v is PlanId => typeof v === 'string' && v in PLANS;

export const ADDONS = {
  inbox: { name: 'Extra inbox', price: 5, unit: 'per inbox / month' },
  aliases: { name: 'Extra 5 groups & aliases', price: 2, unit: 'per 5 / month' },
  storage: { name: 'Extra storage', price: 3, unit: 'per 10 GB / month' },
  domain: { name: 'Extra domain', price: 5, unit: 'per domain / month' },
} as const;

export interface ClientPricing {
  plan: PlanId;
  custom_price: number | null; // pence
  extra_inboxes: number;
  extra_aliases: number;
}

export function limitsFor(c: ClientPricing) {
  const p = PLANS[c.plan] ?? PLANS.lite;
  return {
    inboxes: p.inboxes + (c.extra_inboxes || 0),
    aliases: p.aliases + (c.extra_aliases || 0),
    storageGb: p.storageGb,
    domains: p.domains,
  };
}

export function listPrice(c: ClientPricing): number {
  const p = PLANS[c.plan] ?? PLANS.lite;
  return p.price + (c.extra_inboxes || 0) * ADDONS.inbox.price + Math.ceil((c.extra_aliases || 0) / 5) * ADDONS.aliases.price;
}

export const monthlyPrice = (c: ClientPricing): number => (c.custom_price != null ? c.custom_price / 100 : listPrice(c));
