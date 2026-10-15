// End-to-end test of Studio in a real browser, against a throwaway local instance (see test/README.md).
//   node studio/test/e2e.mjs http://studio.localhost:4310 localhost:4310 <screenshot dir>
import { chromium } from '../../pipeline/node_modules/playwright-core/index.mjs';
import { createHmac } from 'node:crypto';
import { mkdirSync } from 'node:fs';

const [BASE, DOMAIN_PORT, SHOTS] = process.argv.slice(2);
mkdirSync(SHOTS, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36';

function totp(secret, offset = 0){
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of secret.replace(/=+$/, '').toUpperCase()) bits += alphabet.indexOf(c).toString(2).padStart(5, '0');
  const key = Buffer.from(bits.match(/.{8}/g).map(b => parseInt(b, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000) + offset));
  const hm = createHmac('sha1', key).update(counter).digest();
  const o = hm[hm.length - 1] & 15;
  return String((hm.readUInt32BE(o) & 0x7fffffff) % 1e6).padStart(6, '0');
}

let step = 0;
const results = [];
async function check(name, fn, page){
  step++;
  try { await fn(); results.push(`ok   ${step}. ${name}`); console.log(`ok   ${step}. ${name}`); }
  catch (e){
    results.push(`FAIL ${step}. ${name}: ${e.message.split('\n')[0]}`); console.log(`FAIL ${step}. ${name}: ${e.message.split('\n').slice(0, 3).join(' | ')}`);
    if (page) await page.screenshot({ path: `${SHOTS}/fail-${step}.png`, fullPage: true }).catch(() => {});
  }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 860 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('  [page error]', e.message));
const PW = 'correct horse battery staple 1';
let secret = '';

await check('first account can be created (becomes admin)', async () => {
  const r = await page.request.post(`${BASE}/api/auth/sign-up/email`, { headers: { Origin: BASE }, data: { email: 'owner@example.com', password: PW, name: 'Olu Owner' } });
  if (!r.ok()) throw new Error(await r.text());
  await page.request.post(`${BASE}/api/auth/sign-out`, { headers: { Origin: BASE }, data: {} });
});
await check('second sign-up without an invitation is refused', async () => {
  const r = await page.request.post(`${BASE}/api/auth/sign-up/email`, { headers: { Origin: BASE }, data: { email: 'random@example.com', password: PW, name: 'Random' } });
  if (r.ok()) throw new Error('sign-up was allowed');
});
await check('signed-out visit redirects to sign in', async () => {
  await page.goto(BASE + '/');
  await page.waitForURL(/\/login/);
}, page);
await check('wrong password shows an error', async () => {
  await page.fill('input[type=email]', 'owner@example.com');
  await page.fill('input[type=password]', 'wrong password here');
  await page.click('button[type=submit]');
  await page.getByText('don’t match').waitFor({ timeout: 5000 });
}, page);
await check('sign in leads to required two-step setup', async () => {
  await page.fill('input[type=password]', PW);
  await page.click('button[type=submit]');
  await page.getByRole('heading', { name: 'Set up two-step sign-in' }).waitFor();
  await page.screenshot({ path: `${SHOTS}/01-mfa-required.png` });
}, page);
await check('API refuses project calls before two-step is on', async () => {
  const r = await page.request.get(`${BASE}/api/projects`);
  if (r.status() !== 403) throw new Error('status ' + r.status());
});
await check('two-step setup with QR, key and backup codes', async () => {
  await page.fill('input[type=password]', PW);
  await page.click('button[type=submit]');
  await page.getByRole('heading', { name: 'Scan this code' }).waitFor();
  secret = (await page.locator('.secret').textContent()).trim();
  const qrOk = await page.locator('.qr img').evaluate(img => img.complete && img.naturalWidth > 0);
  if (!qrOk) throw new Error('QR image did not load');
  if (await page.locator('.codes span').count() !== 10) throw new Error('expected 10 backup codes');
  await page.screenshot({ path: `${SHOTS}/02-mfa-scan.png`, fullPage: true });
  await page.fill('input[inputmode=numeric]', totp(secret));
  await page.click('button[type=submit]');
  await page.getByText('Welcome, Olu').waitFor();
}, page);
await check('admin creates a team', async () => {
  await page.click('text=Teams and people');
  await page.click('text=+ New team');
  await page.fill('dialog input', 'Pipeline Team');
  await page.click('dialog button[type=submit]');
  await page.getByText('Team created').waitFor();
  await page.getByRole('heading', { name: 'Pipeline Team' }).waitFor();
}, page);
let projectUrl = '';
await check('create a project from the blank starter', async () => {
  await page.reload();
  await page.click('text=+ New project');
  await page.fill('dialog input[placeholder="e.g. GP Pipeline"]', 'Demo Site');
  const slug = await page.inputValue('dialog input[placeholder="gp-pipeline"]');
  if (slug !== 'demo-site') throw new Error('slug was ' + slug);
  await page.click('dialog button[type=submit]');
  await page.waitForURL(/\/p\/[^/]+\/chat/);
  projectUrl = page.url().replace(/\/chat.*$/, '');
  await page.getByText('What should we build?').waitFor();
  await page.screenshot({ path: `${SHOTS}/03-new-chat.png` });
}, page);
await check('prompting without Claude connected is blocked with a pointer', async () => {
  await page.getByText('Connect your Claude account before sending prompts').waitFor();
}, page);
await check('connect Claude subscription (sign-in link + code)', async () => {
  await page.click('text=Connect Claude');
  await page.click('text=Connect my Claude subscription');
  const link = page.getByRole('link', { name: /Open claude.ai/ });
  await link.waitFor();
  if (!(await link.getAttribute('href')).startsWith('https://claude.ai/oauth')) throw new Error('bad link');
  await page.screenshot({ path: `${SHOTS}/04-connect-claude.png` });
  await page.fill('input[placeholder="Paste the code from claude.ai"]', 'fake-code-123');
  await page.click('button:has-text("Connect")');
  await page.getByText('Connected to your Claude subscription').waitFor();
}, page);
await check('send a prompt and see Claude stream, tools and result', async () => {
  await page.goto(projectUrl + '/chat/new');
  await page.fill('textarea', 'Please edit the homepage to say hello');
  await page.keyboard.press('Enter');
  await page.getByText('Fake Claude').waitFor({ timeout: 15000 });
  await page.locator('.tool .tname', { hasText: 'Write' }).waitFor();
  await page.locator('.result-line').waitFor();
  await page.waitForFunction(() => !document.querySelector('.send.stop'));
  await page.screenshot({ path: `${SHOTS}/05-chat.png`, fullPage: false });
}, page);
await check('follow-up prompt resumes the same Claude session', async () => {
  await page.fill('textarea', 'and another thing');
  await page.keyboard.press('Enter');
  await page.getByText('resumed: yes').waitFor({ timeout: 15000 });
}, page);
await check('chat survives a reload and is listed', async () => {
  await page.reload();
  await page.getByText('resumed: yes').waitFor();
  await page.locator('.chat-list .nav-item', { hasText: 'Please edit the homepage' }).waitFor();
}, page);
await check('Changes tab shows the new file and diff, then commits', async () => {
  await page.click('.tab:has-text("Changes")');
  await page.getByText('STUDIO-TEST.md').first().waitFor();
  await page.locator('.diff .add', { hasText: 'Written by the fake Claude' }).waitFor();
  await page.screenshot({ path: `${SHOTS}/06-changes.png`, fullPage: true });
  await page.fill('textarea', 'Add test file');
  await page.click('button:has-text("Commit 1 file")');
  await page.getByText('No uncommitted changes.').waitFor();
  await page.locator('td', { hasText: 'Add test file' }).waitFor();
}, page);
await check('Services tab: service is running; restart; logs stream', async () => {
  await page.click('.tab:has-text("Services")');
  await page.locator('.pill', { hasText: 'running' }).first().waitFor({ timeout: 15000 });
  await page.click('button:has-text("Restart")');
  await page.getByText('Website: restarted').waitFor();
  await page.click('button:has-text("Logs")');
  await page.locator('.logs', { hasText: 'Listening on' }).waitFor({ timeout: 10000 });
  await page.screenshot({ path: `${SHOTS}/07-services.png`, fullPage: true });
}, page);
await check('Files tab lists and shows a file', async () => {
  await page.click('.tab:has-text("Files")');
  await page.click('.file-tree button:has-text("server.mjs")');
  await page.locator('.file-view', { hasText: 'createServer' }).waitFor();
}, page);
await check('project web address goes through the login gate', async () => {
  const r = await page.goto(`http://demo-site.${DOMAIN_PORT}/`);
  await page.getByText('Your new project is running').waitFor();
  const cookies = await ctx.cookies(`http://demo-site.${DOMAIN_PORT}/`);
  if (!cookies.some(c => c.name === 'studio_gate')) throw new Error('no gate cookie');
  if (cookies.some(c => c.name.startsWith('studio.'))) throw new Error('studio session cookie leaked to project');
});
await check('a stranger is sent to sign in by the project address', async () => {
  const c2 = await browser.newContext({ userAgent: UA });
  const p2 = await c2.newPage();
  await p2.goto(`http://demo-site.${DOMAIN_PORT}/`);
  await p2.waitForURL(/studio\.localhost.*\/login/);
  await c2.close();
});
let inviteLink = '';
await check('invite a teammate (link shown when email is off)', async () => {
  await page.goto(BASE + '/team');
  await page.getByText('Email isn’t set up').waitFor();
  await page.fill('input[aria-label="Email to invite"]', 'mia@example.com');
  await page.click('button:has-text("Invite")');
  await page.getByText('mia@example.com').waitFor();
  const teams = await (await page.request.get(`${BASE}/api/teams`)).json();
  inviteLink = teams[0].invites[0].link;
  await page.screenshot({ path: `${SHOTS}/08-team.png`, fullPage: true });
}, page);
await check('teammate accepts invite, creates account, sets up two-step, sees project', async () => {
  const c2 = await browser.newContext({ userAgent: UA });
  const p2 = await c2.newPage();
  await p2.goto(inviteLink);
  await p2.getByRole('heading', { name: 'Create your account' }).waitFor();
  await p2.screenshot({ path: `${SHOTS}/09-invite.png` });
  await p2.fill('input[autocomplete=name]', 'Mia Member');
  const pws = p2.locator('input[type=password]');
  await pws.nth(0).fill(PW); await pws.nth(1).fill(PW);
  await p2.click('button[type=submit]');
  await p2.getByRole('heading', { name: 'Set up two-step sign-in' }).waitFor();
  await p2.fill('input[type=password]', PW);
  await p2.click('button[type=submit]');
  const s2 = (await p2.locator('.secret').textContent()).trim();
  await p2.fill('input[inputmode=numeric]', totp(s2));
  await p2.click('button[type=submit]');
  await p2.locator('.side .nav-item', { hasText: 'Demo Site' }).waitFor();
  // A member can't change settings
  await p2.click('.side .nav-item:has-text("Demo Site")');
  await p2.click('.tab:has-text("Settings")');
  await p2.getByText('Only team owners and admins').waitFor();
  await c2.close();
});
await check('sign out, then sign in again needs the authenticator code', async () => {
  await page.goto(BASE + '/');
  await page.click('text=Sign out');
  await page.waitForURL(/\/login/);
  await page.fill('input[type=email]', 'owner@example.com');
  await page.fill('input[type=password]', PW);
  await page.click('button[type=submit]');
  await page.getByRole('heading', { name: 'Two-step check' }).waitFor();
  await page.fill('#code', '000000');
  await page.click('button[type=submit]');
  await page.getByText('didn’t work').waitFor();
  await page.fill('#code', totp(secret));
  await page.click('button[type=submit]');
  await page.locator('.side').waitFor();
}, page);
await check('admin page: people and activity log; reset link for teammate', async () => {
  await page.goto(BASE + '/admin');
  await page.getByText('mia@example.com').waitFor();
  await page.locator('tr', { hasText: 'mia@example.com' }).locator('button:has-text("Reset link")').click();
  await page.getByText('Password reset link').waitFor();
  const link = (await page.locator('dialog .secret').textContent()).trim();
  if (!link.includes('/reset-password?token=')) throw new Error('bad link ' + link);
  await page.click('dialog button:has-text("Done")');
  await page.locator('td.mono', { hasText: 'chat.prompt' }).first().waitFor();
  await page.screenshot({ path: `${SHOTS}/10-admin.png`, fullPage: true });
  // Use the link in a fresh browser
  const c2 = await browser.newContext({ userAgent: UA });
  const p2 = await c2.newPage();
  await p2.goto(link);
  const pws = p2.locator('input[type=password]');
  await pws.nth(0).fill('a brand new password 2'); await pws.nth(1).fill('a brand new password 2');
  await p2.click('button[type=submit]');
  await p2.waitForURL(/\/login/);
  await p2.fill('input[type=email]', 'mia@example.com');
  await p2.fill('input[type=password]', 'a brand new password 2');
  await p2.click('button[type=submit]');
  await p2.getByRole('heading', { name: 'Two-step check' }).waitFor();
  await c2.close();
}, page);
await check('phone layout: chat usable at 390px', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(projectUrl + '/chat');
  await page.locator('textarea').waitFor();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) throw new Error('horizontal scroll at 390px');
  await page.screenshot({ path: `${SHOTS}/11-phone.png` });
  await page.setViewportSize({ width: 1280, height: 860 });
}, page);
await check('stop button interrupts a long run', async () => {
  await page.goto(projectUrl + '/chat/new');
  await page.fill('textarea', 'slow task please');
  await page.keyboard.press('Enter');
  await page.locator('.send.stop').waitFor();
  await page.click('.send.stop');
  await page.getByText('Stopped.').waitFor({ timeout: 15000 });
}, page);
await check('delete project needs the short name', async () => {
  await page.goto(projectUrl + '/settings');
  await page.click('button:has-text("Delete project")');
  await page.getByText('Type the project’s short name').or(page.getByText("Type the project's short name")).waitFor();
  await page.fill('input[aria-label="Type the short name to confirm"]', 'demo-site');
  await page.click('button:has-text("Delete project")');
  await page.getByText('Project deleted').waitFor();
}, page);

await browser.close();
console.log('\n' + results.filter(r => r.startsWith('FAIL')).length + ' failed of ' + results.length);
