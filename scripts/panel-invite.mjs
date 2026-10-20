// Creates a control panel login and prints a one-time link to set its password (valid 7 days).
// Usage: node scripts/panel-invite.mjs staff <email> "<name>"
//        node scripts/panel-invite.mjs again <email>          — new link for an existing login
import { config } from '../src/config.mjs';
import { users, invites } from '../src/panel/store.mjs';

const [kind, email, name] = process.argv.slice(2);
if (!['staff', 'again'].includes(kind) || !email) {
  console.error('Usage: node scripts/panel-invite.mjs staff <email> "<name>"  |  again <email>');
  process.exit(1);
}
let u = users.byEmail(email);
if (kind === 'staff') {
  if (u) { console.error(`${email} already has a login — use "again" for a new link`); process.exit(1); }
  u = users.create({ email, name: name || email, role: 'staff' });
} else if (!u) { console.error(`No login for ${email}`); process.exit(1); }
const t = invites.create(u.id);
console.log(`${config.appUrl.replace(/\/$/, '')}/panel/#/invite/${t}`);
