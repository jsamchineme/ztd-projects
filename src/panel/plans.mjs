// List prices and limits for the plans sold on the website. Each client can also have a custom
// monthly price and extra inboxes / aliases on top (stored on the client row).
export const PLANS = {
  lite: { id: 'lite', name: 'Lite', price: 40, inboxes: 3, aliases: 5, storageGb: 5, domains: 1, sharedInboxes: 0, meetings: null,
    blurb: 'Website and business email for sole traders and small teams.' },
  premium: { id: 'premium', name: 'Premium', price: 70, inboxes: 7, aliases: 10, storageGb: 10, domains: 1, sharedInboxes: 1, meetings: 'Meetings up to 1 hour',
    blurb: 'For growing teams that meet clients online.' },
  business: { id: 'business', name: 'Business', price: 125, inboxes: 15, aliases: 25, storageGb: 25, domains: 3, sharedInboxes: 3, meetings: 'Unlimited meetings',
    blurb: 'For established firms with several departments.' },
};
export const PLAN_ORDER = ['lite', 'premium', 'business'];

export const ADDONS = {
  inbox: { name: 'Extra inbox', price: 5, unit: 'per inbox / month' },
  aliases: { name: 'Extra 5 groups & aliases', price: 2, unit: 'per 5 / month' },
  storage: { name: 'Extra storage', price: 3, unit: 'per 10 GB / month' },
  domain: { name: 'Extra domain', price: 5, unit: 'per domain / month' },
};

export function limitsFor(client) {
  const p = PLANS[client.plan] || PLANS.lite;
  return {
    inboxes: p.inboxes + (client.extra_inboxes || 0),
    aliases: p.aliases + (client.extra_aliases || 0),
    storageGb: p.storageGb,
    domains: p.domains,
  };
}

export function listPrice(client) {
  const p = PLANS[client.plan] || PLANS.lite;
  return p.price + (client.extra_inboxes || 0) * ADDONS.inbox.price + Math.ceil((client.extra_aliases || 0) / 5) * ADDONS.aliases.price;
}

export const monthlyPrice = client => client.custom_price != null ? client.custom_price / 100 : listPrice(client);
