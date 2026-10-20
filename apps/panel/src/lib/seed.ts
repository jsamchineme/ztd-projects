// Dev seed: a staff login, sample clients and inboxes, so the panel has something to show.
// Writes to the configured database (file-backed PGlite by default). Mail inboxes are created on
// the mail server — in fake mode they live only in this process, so run `next dev` (same process)
// to see them, or point STALWART at a real server. Prints a session token to log in with.
import { clients, users, sessions, activity } from './store';
import * as stalwart from './stalwart';
import { hashPassword } from './auth';

async function main() {
  const snap = await stalwart.snapshot({ fresh: true });
  if (!(await clients.list()).length) {
    const zc = await clients.create({ name: 'ZTD Office', contactName: 'Samuel', plan: 'business', customPrice: 0, internal: true });
    if (snap.domains.some((d) => d.name === 'ztdoffice.com')) await clients.addDomain(zc.id, 'ztdoffice.com');
  }

  let samuel = await users.byEmail('samuel@ztdoffice.com');
  if (!samuel) samuel = await users.create({ email: 'samuel@ztdoffice.com', name: 'Samuel', role: 'staff' });
  await users.setPassword(samuel.id, await hashPassword('staff-password-123'));

  const existing = new Set((await clients.list()).map((c) => c.name));
  const sample: [string, string, 'lite' | 'premium' | 'business', string, number | null][] = [
    ['Harrow & Lane Solicitors', 'harrowlane.co.uk', 'business', 'Priya Shah', 110],
    ['Bloom & Co Florist', 'bloomandco.co.uk', 'lite', 'Ellie Morgan', null],
    ['Northgate Builders', 'northgatebuild.co.uk', 'premium', 'Mark Reid', 60],
  ];
  for (const [name, domain, plan, contact, custom] of sample) {
    if (existing.has(name)) continue;
    const c = await clients.create({ name, contactName: contact, plan, customPrice: custom == null ? null : custom * 100 });
    try {
      const sn = await stalwart.snapshot({ fresh: true });
      if (!sn.domains.some((d) => d.name === domain)) await stalwart.createDomain(domain);
    } catch { /* fake or offline */ }
    await clients.addDomain(c.id, domain);
    await activity.log(c.id, 'Samuel (ZTD)', 'client-created', `${name} on ${plan}`);
  }

  const token = await sessions.create(samuel.id, 'seed');
  console.log('Staff login: samuel@ztdoffice.com / staff-password-123');
  console.log('Session token (cookie ztd_panel):', token);
  process.exit(0);
}
main();
