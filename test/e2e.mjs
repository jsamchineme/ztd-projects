// End-to-end test of Studio in a real browser, against a throwaway local instance. Run it with npm test (test/run.sh),
// which starts that instance; by hand: node test/e2e.mjs http://studio.localhost:4310 localhost:4310 <screenshot dir>
import { chromium } from 'playwright-core';
import { createHmac, createECDH, createDecipheriv, randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import net from 'node:net';
import http from 'node:http';

const [BASE, DOMAIN_PORT, SHOTS] = process.argv.slice(2);
mkdirSync(SHOTS, { recursive: true });
const CHROME = process.env.CHROME_BIN || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : '/usr/bin/google-chrome');
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

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: process.platform === 'linux' ? ['--no-sandbox'] : [] });
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
  await page.click('button:has-text("New team")');
  await page.fill('dialog input', 'Pipeline Team');
  await page.click('dialog button[type=submit]');
  await page.getByText('Team created').waitFor();
  await page.getByRole('heading', { name: 'Pipeline Team' }).waitFor();
}, page);
let projectUrl = '';
await check('create a project from the blank starter', async () => {
  await page.goto(BASE + '/');
  await page.click('.page button:has-text("New project")');
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
await check('attach an image and a text file and send them', async () => {
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await page.setInputFiles('.composer input[type=file]', [
    { name: 'shot.png', mimeType: 'image/png', buffer: png },
    { name: 'notes.md', mimeType: 'text/markdown', buffer: Buffer.from('# Notes\n') }]);
  await page.locator('.attach-chip img').waitFor();
  await page.locator('.attach-chip', { hasText: 'notes.md' }).getByText('B').waitFor();
  await page.fill('textarea', 'what is in these files');
  await page.keyboard.press('Enter');
  await page.getByText('attached: 2').waitFor({ timeout: 15000 });
  await page.locator('.sent-image img').waitFor();
  if (!(await page.evaluate(() => document.querySelector('.sent-image img').naturalWidth === 1))) throw new Error('thumbnail did not load');
  await page.locator('a.attach-chip', { hasText: 'notes.md' }).waitFor();
  const big = await page.request.post(`${BASE}/api/projects/${projectUrl.split('/p/')[1]}/uploads`, { headers: { Origin: BASE }, data: { name: 'big.bin', data: Buffer.alloc(21 * 1024 * 1024).toString('base64') } });
  if (big.status() !== 413) throw new Error(`21 MB upload gave ${big.status()}`);
  await page.screenshot({ path: `${SHOTS}/05b-attachments.png` });
}, page);
await check('a prompt still shows up when the live connection is stuck (no refresh needed)', async () => {
  // Hold the next chat stream request forever, like a phone's connection that died without an error.
  let held = false;
  await page.route('**/api/chats/*/stream*', route => { if (!held){ held = true; return; } route.continue(); });
  await page.reload();
  await page.locator('.result-line').first().waitFor();
  await page.fill('textarea', 'sent over a stuck connection');
  await page.keyboard.press('Enter');
  await page.locator('.bubble', { hasText: 'sent over a stuck connection' }).waitFor({ timeout: 8000 });
  await page.waitForFunction(() => !document.querySelector('.send.stop'), null, { timeout: 15000 });
  await page.unroute('**/api/chats/*/stream*');
  if (!held) throw new Error('the stream was never held');
}, page);
await check('chat (with its attachments) survives a reload and is listed', async () => {
  await page.reload();
  await page.getByText('resumed: yes').first().waitFor();
  await page.locator('.sent-image img').waitFor();
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
  await page.click('button[aria-label="Sign out"]');
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
  await page.getByRole('heading', { name: 'Password reset link' }).waitFor();
  const link = (await page.locator('dialog .secret').textContent()).trim();
  if (!link.includes('/reset-password?token=')) throw new Error('bad link ' + link);
  await page.click('dialog button:has-text("Done")');
  await page.locator('td.mono', { hasText: 'chat.prompt' }).first().waitFor();
  await page.getByText('Latest commit to studio/').waitFor();
  await page.getByText('uncommitted change in studio/').waitFor();
  await page.click('button:has-text("Update and restart Studio")');
  await page.click('dialog button:has-text("Update and restart")');
  await page.getByText('Studio updated').waitFor({ timeout: 15000 });
  await page.waitForLoadState('load');
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
// A tiny SMTP server: accepts the password "right" only, and keeps what it receives.
const mails = [];
const smtp = net.createServer(sock => {
  let data = null;
  sock.write('220 test\r\n');
  sock.on('data', d => { for (const line of d.toString().split('\r\n').filter((l, i, a) => l || i < a.length - 1)){
    if (data !== null){ if (line === '.'){ mails.push(data); data = null; sock.write('250 ok\r\n'); } else data += line + '\n'; continue; }
    const cmd = line.slice(0, 4).toUpperCase();
    if (cmd === 'EHLO') sock.write('250-test\r\n250 AUTH PLAIN\r\n');
    else if (cmd === 'AUTH') sock.write(Buffer.from(line.split(' ')[2] || '', 'base64').toString().endsWith('\0right') ? '235 ok\r\n' : '535 bad password\r\n');
    else if (cmd === 'DATA'){ data = ''; sock.write('354 go\r\n'); }
    else if (cmd === 'QUIT'){ sock.end('221 bye\r\n'); }
    else sock.write('250 ok\r\n');
  } });
}).listen(2526, '127.0.0.1');
await check('admin sets up email: wrong password refused, test email sent, password never returned', async () => {
  await page.goto(BASE + '/admin');
  await page.getByText('Email isn’t set up').waitFor();
  await page.fill('#' + await page.locator('label:has-text("Mail server")').getAttribute('for'), '127.0.0.1');
  await page.fill('input[type=number]', '2526');
  await page.locator('label.check:has-text("Secure connection") input').uncheck();
  await page.fill('#' + await page.locator('label:has-text("User name")').getAttribute('for'), 'studio@example.com');
  await page.fill('input[type=password]', 'wrong');
  await page.click('button:has-text("Check and save")');
  await page.getByText('refused these settings').waitFor();
  await page.fill('input[type=password]', 'right');
  await page.click('button:has-text("Check and save")');
  await page.getByText('Sending through 127.0.0.1 as studio@example.com').waitFor();
  await page.click('button:has-text("Send a test email")');
  await page.getByText('Test email sent to owner@example.com').waitFor();
  if (!mails.some(m => /To: owner@example.com/i.test(m) && /Test email from/.test(m))) throw new Error('no test email arrived');
  const r = await (await page.request.get(`${BASE}/api/admin/mail`)).text();
  if (r.includes('right')) throw new Error('password was returned');
  await page.screenshot({ path: `${SHOTS}/09-email.png`, fullPage: true });
}, page);
// Mail as the SMTP server saw it, with quoted-printable undone.
const decoded = m => m.replace(/=\n/g, '').replace(/=([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const waitMail = async (test, what) => { for (let i = 0; i < 40; i++){ const m = mails.map(decoded).find(test); if (m) return m; await new Promise(r => setTimeout(r, 100)); } throw new Error(`no ${what} email arrived`); };
await check('emails have HTML and plain text with the logo; reset, password-changed and 2FA-reset notices are sent', async () => {
  const test = await waitMail(m => /Test email from/.test(m), 'test');
  for (const part of ['multipart/alternative', 'text/plain', 'text/html', 'Content-ID: <logo>', 'Email is working'])
    if (!test.includes(part)) throw new Error(`test email is missing ${part}`);
  const users = await (await page.request.get(`${BASE}/api/admin/users`)).json();
  const mia = users.find(u => u.email === 'mia@example.com');
  await page.request.post(`${BASE}/api/admin/users/${mia.id}/reset-link`, { headers: { Origin: BASE }, data: {} });
  const reset = await waitMail(m => /To: mia@example.com/i.test(m) && /Choose a new password/.test(m), 'reset');
  const token = reset.match(/reset-password\?token=([\w%-]+)/)?.[1];
  if (!token) throw new Error('reset email has no link');
  const done = await page.request.post(`${BASE}/api/auth/reset-password`, { headers: { Origin: BASE }, data: { newPassword: 'a third new password 3', token: decodeURIComponent(token) } });
  if (!done.ok()) throw new Error(`reset failed: ${done.status()}`);
  await waitMail(m => /To: mia@example.com/i.test(m) && /Your password was changed/.test(m) && /reset with an emailed link/.test(m), 'password-changed');
  await page.request.post(`${BASE}/api/admin/users/${mia.id}/reset-mfa`, { headers: { Origin: BASE }, data: {} });
  await waitMail(m => /To: mia@example.com/i.test(m) && /Two-step sign-in was reset/.test(m), '2FA-reset');
}, page);
await check('every email template renders, escapes what people typed and never says undefined', async () => {
  const { templates, samples } = await import('../lib/emails.mjs');
  for (const [name, fn] of Object.entries(templates)){
    const m = fn(samples[name]);
    if (!m.subject || !m.html.includes('cid:logo') || !m.text) throw new Error(`${name} is incomplete`);
    if (/undefined|NaN|\[object/.test(m.subject + m.html + m.text)) throw new Error(`${name} shows a missing value`);
  }
  const m = templates.invite({ ...samples.invite, inviterName: '<script>x</script>', orgName: 'A & B' });
  if (m.html.includes('<script>') || !m.html.includes('A &amp; B')) throw new Error('names are not escaped');
}, page);
await check('email notifications: each person chooses; a turned-off one isn’t sent, a turned-on one is', async () => {
  await page.goto(BASE + '/account');
  const card = page.locator('#acc-email');
  for (const label of ['Claude finishes a long run', 'A project you created is ready', 'Someone accepts your invitation', 'A prompt is flagged as off-topic'])
    await card.getByText(label).waitFor();
  const ready = card.locator('label:has-text("A project you created is ready") input');
  if (!await ready.isChecked()) throw new Error('project-ready emails should start on');
  await ready.uncheck();
  await page.locator('.toast', { hasText: 'You won’t get these emails' }).waitFor();
  await page.reload();
  if (await page.locator('#acc-email label:has-text("A project you created is ready") input').isChecked()) throw new Error('the choice wasn’t saved');
  await page.locator('#acc-email').screenshot({ path: `${SHOTS}/09b-email-prefs.png` });
  const me = await (await page.request.get(`${BASE}/api/me`)).json();
  const make = async (name, slug) => {
    const r = await page.request.post(`${BASE}/api/projects`, { headers: { Origin: BASE }, data: { name, slug, organizationId: me.teams[0].organizationId, starter: 'blank' } });
    if (!r.ok()) throw new Error(`creating ${name} failed: ${await r.text()}`);
    const p = await r.json();
    for (let i = 0; i < 100 && (await (await page.request.get(`${BASE}/api/projects/${p.id}`)).json()).status === 'creating'; i++) await new Promise(r => setTimeout(r, 100));
    return p;
  };
  const quiet = await make('Quiet Site', 'quiet-site');
  const r = await page.request.put(`${BASE}/api/me/email`, { headers: { Origin: BASE }, data: { projectReady: true } });
  if (!(await r.json()).find(p => p.key === 'projectReady').on) throw new Error('turning it back on failed');
  const loud = await make('Loud Site', 'loud-site');
  await waitMail(m => /Loud Site is ready/.test(m), 'project-ready');
  if (mails.map(decoded).some(m => /Quiet Site is ready/.test(m))) throw new Error('an email that was turned off was sent');
  for (const p of [quiet, loud]) await page.request.delete(`${BASE}/api/projects/${p.id}`, { headers: { Origin: BASE }, data: { confirm: p.slug } });
}, page);
await check('changing your email: needs your password, and the new address must confirm it; the old one gets a notice', async () => {
  const post = data => page.request.post(`${BASE}/api/account/email`, { headers: { Origin: BASE }, data });
  if ((await post({ email: 'olu@example.com', password: 'wrong password here' })).ok()) throw new Error('a wrong password was accepted');
  if ((await post({ email: 'mia@example.com', password: PW })).ok()) throw new Error('another account’s email was accepted');
  await page.goto(BASE + '/account');
  const card = page.locator('#acc-address');
  await card.locator('input[type=email]').fill('olu@example.com');
  await card.locator('input[type=password]').fill(PW);
  await card.locator('button:has-text("Change email")').click();
  await card.getByText('Check olu@example.com for a link').waitFor();
  if ((await (await page.request.get(`${BASE}/api/me`)).json()).user.email !== 'owner@example.com') throw new Error('the email changed before it was confirmed');
  const confirm = await waitMail(m => /To: olu@example.com/i.test(m) && /Confirm your new email/.test(m), 'confirm-email');
  const link = confirm.match(/(http\S+\/api\/account\/email\/confirm\?token=[\w-]+)/)?.[1];
  if (!link) throw new Error('confirm email has no link');
  await page.goto(link);
  await page.locator('.toast', { hasText: 'You now sign in with olu@example.com' }).waitFor();
  await waitMail(m => /To: owner@example.com/i.test(m) && /Your email was changed/.test(m), 'email-changed');
  await page.goto(link);
  await page.locator('.toast', { hasText: 'expired or was already used' }).waitFor();
  // and back, so the rest of the test can sign in as before
  await post({ email: 'owner@example.com', password: PW });
  const back = await waitMail(m => /To: owner@example.com/i.test(m) && /Confirm your new email/.test(m), 'second confirm-email');
  await page.request.get(back.match(/(http\S+\/api\/account\/email\/confirm\?token=[\w-]+)/)[1]);
  if ((await (await page.request.get(`${BASE}/api/me`)).json()).user.email !== 'owner@example.com') throw new Error('changing it back failed');
}, page);
await check('admin removes the email settings', async () => {
  await page.goto(BASE + '/admin');
  await page.click('button:has-text("Remove")');
  await page.click('dialog button:has-text("Remove")');
  await page.getByText('Email isn’t set up').waitFor();
  smtp.close();
}, page);
await check('focus checks: an admin turns them on; off-topic prompts are flagged, on-topic ones aren’t', async () => {
  await page.goto(projectUrl + '/settings');
  await page.locator('form textarea').first().fill('A website for a local dental practice: pages, booking form and contact details.');
  await page.click('button:has-text("Save")');
  await page.locator('.toast', { hasText: 'Saved' }).waitFor();
  await page.goto(BASE + '/admin');
  await page.locator('label:has-text("Flag prompts that don’t fit their project") input').check();
  await page.getByText('Off-topic prompts will be flagged').waitFor();
  await page.goto(projectUrl + '/chat/new');
  await page.fill('textarea', 'Add opening hours to the contact page');
  await page.keyboard.press('Enter');
  await page.locator('.result-line').waitFor({ timeout: 15000 });
  await page.waitForFunction(() => !document.querySelector('.send.stop'));
  await page.waitForTimeout(1500);   // the check runs alongside Claude; give it time to (not) flag
  if (await page.locator('.flag-note').count()) throw new Error('an on-topic prompt was flagged');
  await page.fill('textarea', 'Build me an unrelated recipe-sharing app');
  await page.keyboard.press('Enter');
  await page.locator('.flag-note', { hasText: 'unrelated app' }).waitFor({ timeout: 15000 });
  await page.waitForFunction(() => !document.querySelector('.send.stop'), null, { timeout: 15000 });
  await page.screenshot({ path: `${SHOTS}/10b-flag.png` });
  await page.reload();
  await page.locator('.flag-note').waitFor();   // kept with the chat
  await page.goto(BASE + '/admin');
  await page.locator('td.mono', { hasText: 'chat.off-topic' }).first().waitFor();
  await page.locator('label:has-text("Flag prompts that don’t fit their project") input').uncheck();
  await page.getByText('Focus checks are off').waitFor();
}, page);
await check('GitHub backup: set a repo, see the deploy key, back up now (a branch per project), turn off', async () => {
  await page.goto(BASE + '/admin');
  await page.fill('input[aria-label="GitHub repo"]', 'https://gitlab.com/someone/projects');
  await page.click('button:has-text("Set up")');
  await page.getByText('Use the repo’s address from GitHub').first().waitFor();
  await page.fill('input[aria-label="GitHub repo"]', 'https://github.com/someone/ztd-projects');
  await page.click('button:has-text("Set up")');
  await page.getByText('Allow write access').waitFor();
  await page.locator('pre', { hasText: 'ssh-ed25519' }).waitFor();
  await page.click('button:has-text("Back up now")');
  await page.locator('.ok-box', { hasText: 'Backed up 1 project (changed: demo-site)' }).waitFor({ timeout: 15000 });
  if (process.env.MOCK_ROOT){
    const gh = (...a) => execFileSync('git', ['--git-dir', `${process.env.MOCK_ROOT}/github.git`, ...a], { encoding: 'utf8' });
    if (gh('rev-parse', 'projects/demo-site').trim() !== execFileSync('git', ['-C', `${process.env.MOCK_ROOT}/projects/demo-site/repo`, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()) throw new Error('projects/demo-site is not the project’s HEAD');
    if (gh('ls-tree', '--name-only', 'main').trim() !== 'README.md' || !gh('show', 'main:README.md').includes('projects/demo-site')) throw new Error('main should only hold a README listing the projects');
  }
  await page.click('button:has-text("Back up now")');
  await page.locator('.ok-box', { hasText: 'Up to date: 1 project' }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${SHOTS}/10c-github-backup.png`, fullPage: true });
  await page.click('button:has-text("Turn off")');
  await page.click('dialog button:has-text("Turn off")');
  await page.locator('button:has-text("Set up")').waitFor();
}, page);
await check('an older project moves to its own user; services start again and chats carry on', async () => {
  await page.goto(projectUrl + '/settings');
  await page.getByText('a Linux user shared with other older projects').waitFor();
  await page.click('button:has-text("Move to its own user")');
  await page.click('dialog button:has-text("Move it")');
  await page.getByText('Runs as its own Linux user').waitFor({ timeout: 15000 });
  await page.locator('.mono', { hasText: 'zp-demo-site' }).first().waitFor();
  await page.click('.tab:has-text("Services")');
  await page.locator('.pill', { hasText: 'running' }).first().waitFor({ timeout: 15000 });
  await page.click('.tab:has-text("Chat")');
  await page.fill('textarea', 'still here after the move?');
  await page.keyboard.press('Enter');
  await page.locator('.bubble', { hasText: 'still here after the move?' }).waitFor({ timeout: 8000 });
  await page.waitForFunction(() => !document.querySelector('.send.stop'), null, { timeout: 15000 });
}, page);
await check('phone notifications: pair a phone, it connects, rings for a test and a finished chat, catches up, and is removed', async () => {
  await page.goto(BASE + '/account');
  const card = page.locator('#acc-phone');
  for (const label of ['Claude finishes in your chat', 'Claude finishes in a teammate’s chat', 'A project you created is ready'])
    await card.getByText(label).waitFor();
  await card.getByText('No devices get notifications yet').waitFor();
  await card.locator('summary', { hasText: 'Studio phone app' }).click();
  if (!(await card.locator('a.phone-app-link').getAttribute('href')).startsWith('exp://')) throw new Error('no Expo Go link');
  const app = await page.request.get(`${BASE}/api/phone/app`, { maxRedirects: 0 });
  if (app.status() !== 302 || !app.headers().location.startsWith('exp://u.expo.dev/')) throw new Error(`/api/phone/app answered ${app.status()} ${app.headers().location}`);
  await card.locator('button:has-text("Pair a phone")').click();
  await page.fill('dialog input[type=text]', 'Test phone');
  await page.click('dialog button:has-text("Show pairing code")');
  const code = await page.locator('dialog input[aria-label="Pairing code"]').inputValue();
  const [studio, token] = code.split('#');
  if (studio !== BASE || !token || token.length < 40) throw new Error(`odd pairing code: ${code}`);
  await page.locator('dialog .qr img').waitFor();
  await page.screenshot({ path: `${SHOTS}/09c-pair-phone.png` });

  // The phone app's side (mobile/src/socket.js), as a plain WebSocket.
  const url = `ws://127.0.0.1:${new URL(BASE).port}/api/phone/socket`;
  const open = (hello) => new Promise((resolve, reject) => {
    const ws = new WebSocket(url), got = [];
    ws.got = got;
    ws.next = (match, what) => new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error(`no ${what} on the socket (got: ${got.map(m => m.type + ' ' + (m.title || '')).join(', ')})`)), 15000);
      const look = () => { const m = got.find(match); if (m){ clearTimeout(t); got.splice(got.indexOf(m), 1); res(m); } else setTimeout(look, 50); };
      look();
    });
    ws.onmessage = e => got.push(JSON.parse(e.data));
    ws.onopen = () => { ws.send(JSON.stringify({ type: 'hello', ...hello })); resolve(ws); };
    ws.onerror = () => reject(new Error('the socket didn’t open'));
  });
  const stranger = await open({ token: 'x'.repeat(43), after: null });
  await stranger.next(m => m.type === 'unpaired', 'refusal for a wrong token');
  const ws = await open({ token, after: null });
  const ready = await ws.next(m => m.type === 'ready', 'ready');
  if (ready.phone !== 'Test phone' || ready.user !== 'Olu Owner') throw new Error(`ready says ${JSON.stringify(ready)}`);
  await page.locator('dialog', { hasText: '✓ Connected' }).waitFor({ timeout: 8000 });
  await page.click('dialog button:has-text("Done")');
  await card.locator('.pill', { hasText: 'Connected' }).waitFor();

  // Push: the app gives its Expo push token; messages then also go to Expo's push service (a stand-in here, on the
  // port after Studio's: see test/run.sh), so the phone shows them with the app closed.
  const pushes = [];
  let pushAnswer = () => ({ status: 'ok', id: 'x' });
  const expo = http.createServer((req, res) => {
    let body = ''; req.on('data', d => body += d);
    req.on('end', () => { const list = JSON.parse(body); pushes.push(...list); res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ data: list.map(() => pushAnswer()) })); });
  });
  await new Promise(r => expo.listen(Number(new URL(BASE).port) + 1, '127.0.0.1', r));
  ws.send(JSON.stringify({ type: 'push-token', token: 'not a token' }));
  if ((await ws.next(m => m.type === 'push-token', 'push-token answer')).saved) throw new Error('a bad push token was saved');
  ws.send(JSON.stringify({ type: 'push-token', token: 'ExponentPushToken[abcdefghij1234567890]' }));
  if (!(await ws.next(m => m.type === 'push-token', 'push-token answer')).saved) throw new Error('the push token wasn’t saved');
  await page.reload();
  await card.getByText('rings with the app closed').waitFor();
  await card.locator('button:has-text("Send a test")').click();
  await page.locator('.toast', { hasText: 'Sent to 1 device' }).waitFor();
  const tested = await ws.next(m => m.type === 'message' && m.title === 'Test from Studio', 'test message');
  for (let i = 0; i < 50 && !pushes.length; i++) await new Promise(r => setTimeout(r, 100));
  const p = pushes.find(x => x.title === 'Test from Studio');
  if (!p || p.to !== 'ExponentPushToken[abcdefghij1234567890]' || p.sound !== 'default' || p.data.id !== tested.id || p.data.url !== tested.url || !p.data.studio)
    throw new Error(`the push was ${JSON.stringify(pushes)}`);
  // Not seen yet: it's pushed again, like an alarm (every 0.3 s here, see test/run.sh), until the app says it's seen.
  const reminders = () => pushes.filter(x => x.data.id === tested.id && /^Reminder \d of 4/.test(x.body || '')).length;
  for (let i = 0; i < 50 && reminders() < 2; i++) await new Promise(r => setTimeout(r, 100));
  if (reminders() < 2) throw new Error('an unseen message wasn’t pushed again');
  ws.send(JSON.stringify({ type: 'seen', upTo: tested.id }));
  await new Promise(r => setTimeout(r, 400));
  const after = reminders();
  await new Promise(r => setTimeout(r, 1000));
  if (reminders() !== after) throw new Error('reminders went on after the message was seen');
  await card.screenshot({ path: `${SHOTS}/09d-phone-card.png` });

  await page.goto(projectUrl + '/chat/new');
  await page.fill('textarea', 'ring my phone when done');
  await page.keyboard.press('Enter');
  const done = await ws.next(m => m.type === 'message' && m.event === 'runFinished', 'finished-chat message');
  for (let i = 0; i < 50 && !pushes.some(x => x.data.id === done.id); i++) await new Promise(r => setTimeout(r, 100));
  if (!pushes.some(x => x.data.id === done.id && x.data.url === done.url)) throw new Error('the finished chat wasn’t pushed');
  // Expo says the app is gone from the phone: Studio stops pushing to it.
  pushAnswer = () => ({ status: 'error', message: 'gone', details: { error: 'DeviceNotRegistered' } });
  await page.request.post(`${BASE}/api/me/phones/test`, { headers: { Origin: BASE }, data: {} });
  for (let i = 0; i < 50 && (await (await page.request.get(`${BASE}/api/me/phones`)).json()).phones[0].push; i++) await new Promise(r => setTimeout(r, 100));
  if ((await (await page.request.get(`${BASE}/api/me/phones`)).json()).phones[0].push) throw new Error('a token Expo rejected was kept');
  expo.close();
  if (!/ring my phone when done: done/.test(done.title) || !done.body.startsWith('Demo Site · ') || !done.url.startsWith(projectUrl + '/chat/')) throw new Error(`finished-chat message says ${JSON.stringify(done)}`);
  ws.close();
  // Tapping it opens that chat.
  await page.goto(done.url);
  await page.locator('.bubble', { hasText: 'ring my phone when done' }).waitFor({ timeout: 8000 });
  // Older links named the project by its short name: they still open it, at its usual address.
  await page.goto(done.url.replace(projectUrl, `${BASE}/p/demo-site`));
  await page.waitForURL(done.url);
  await page.locator('.bubble', { hasText: 'ring my phone when done' }).waitFor({ timeout: 8000 });

  // Offline for that one: on reconnecting it comes again, marked as missed.
  const again = await open({ token, after: done.id - 1 });
  await again.next(m => m.type === 'ready', 'ready after reconnecting');
  const missed = await again.next(m => m.type === 'message', 'missed message');
  if (missed.id !== done.id || !missed.missed) throw new Error(`catching up sent ${JSON.stringify(missed)}`);

  await page.goto(BASE + '/account');
  const closed = new Promise(r => { again.onclose = e => r(e.code); });
  await card.locator('.phone-row button:has-text("Remove")').click();
  await page.locator('.toast', { hasText: 'Test phone removed' }).waitFor();
  if (await closed !== 4001) throw new Error('removing the phone didn’t close its connection');
  const gone = await open({ token, after: null });
  await gone.next(m => m.type === 'unpaired', 'refusal after removing');
}, page);
await check('web push: Studio installs as a web app; a browser subscribes, gets encrypted pushes and reminders until Studio is opened', async () => {
  const sw = await page.request.get(`${BASE}/sw.js`);
  if (!sw.ok() || !sw.headers()['content-type'].includes('javascript') || !(await sw.text()).includes("addEventListener('push'")) throw new Error('no service worker');
  const man = await page.request.get(`${BASE}/manifest.webmanifest`);
  if (!man.headers()['content-type'].includes('manifest+json') || (await man.json()).display !== 'standalone') throw new Error('no web app manifest');
  await page.goto(BASE + '/account');
  if (!await page.locator('link[rel=manifest]').count()) throw new Error('the page doesn’t link the manifest');
  const card = page.locator('#acc-phone');
  await card.locator('button:has-text("Turn on notifications on this device")').waitFor();
  await page.waitForFunction(() => navigator.serviceWorker.getRegistration('/').then(r => !!r));   // registered by Studio's pages

  // A browser's subscription: its own keys, and an address at a push service (a stand-in on the port after Studio's).
  const ecdh = createECDH('prime256v1'); ecdh.generateKeys();
  const authSecret = randomBytes(16);
  const port = Number(new URL(BASE).port) + 1;
  const got = [];
  let answer = 201;
  const service = http.createServer((req, res) => {
    const chunks = []; req.on('data', d => chunks.push(d));
    req.on('end', () => { got.push({ path: req.url, headers: req.headers, body: Buffer.concat(chunks) }); res.statusCode = answer; res.end(); });
  });
  await new Promise(r => service.listen(port, '127.0.0.1', r));
  // RFC 8291: what a browser does to read a push.
  const open = ({ body }) => {
    const salt = body.subarray(0, 16), idlen = body[20], serverKey = body.subarray(21, 21 + idlen), data = body.subarray(21 + idlen);
    const hmac = (k, d) => createHmac('sha256', k).update(d).digest();
    const shared = ecdh.computeSecret(serverKey);
    const ikm = hmac(hmac(authSecret, shared), Buffer.concat([Buffer.from('WebPush: info\0'), ecdh.getPublicKey(), serverKey, Buffer.from([1])]));
    const prk = hmac(salt, ikm);
    const key = hmac(prk, Buffer.from('Content-Encoding: aes128gcm\0\x01')).subarray(0, 16), nonce = hmac(prk, Buffer.from('Content-Encoding: nonce\0\x01')).subarray(0, 12);
    const d = createDecipheriv('aes-128-gcm', key, nonce); d.setAuthTag(data.subarray(-16));
    const plain = Buffer.concat([d.update(data.subarray(0, -16)), d.final()]);
    return JSON.parse(plain.subarray(0, plain.lastIndexOf(2)).toString());
  };
  const subscription = { endpoint: `http://127.0.0.1:${port}/wp/olu`, keys: { p256dh: ecdh.getPublicKey().toString('base64url'), auth: authSecret.toString('base64url') } };
  const post = s => page.request.post(`${BASE}/api/me/push`, { headers: { Origin: BASE, 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' }, data: { subscription: s } });
  if ((await post({ ...subscription, endpoint: 'https://example.com/steal' })).ok()) throw new Error('a push address that isn’t a push service was accepted');
  if (!(await post(subscription)).ok()) throw new Error('subscribing failed');
  await page.reload();
  await card.locator('.phone-row', { hasText: 'iPhone · Home Screen' }).waitFor();
  await card.getByText('Remind me until I open Studio').waitFor();
  await card.screenshot({ path: `${SHOTS}/09e-push-card.png` });

  await card.locator('button:has-text("Send a test")').click();
  await page.locator('.toast', { hasText: 'Sent to 1 device' }).waitFor();
  for (let i = 0; i < 50 && !got.length; i++) await new Promise(r => setTimeout(r, 100));
  const first = got[0];
  if (!first || first.path !== '/wp/olu' || first.headers['content-encoding'] !== 'aes128gcm' || !/^vapid t=.+, k=.+/.test(first.headers.authorization) || first.headers.urgency !== 'high')
    throw new Error(`the push request was ${JSON.stringify(first?.headers)}`);
  const m = open(first);
  if (m.title !== 'Test from Studio' || !m.url.endsWith('/account') || !m.id) throw new Error(`the push said ${JSON.stringify(m)}`);
  // Reminders until Studio is opened (this page says so, as Studio's pages do while on screen).
  for (let i = 0; i < 50 && got.length < 3; i++) await new Promise(r => setTimeout(r, 100));
  if (!/^Reminder 1 of 4/.test(open(got[1]).body)) throw new Error(`the reminder said ${JSON.stringify(open(got[1]))}`);
  await page.request.post(`${BASE}/api/me/push/seen`, { headers: { Origin: BASE }, data: {} });
  await new Promise(r => setTimeout(r, 400));
  const n = got.length;
  await new Promise(r => setTimeout(r, 1000));
  if (got.length !== n) throw new Error('reminders went on after Studio was opened');

  // Reminders off: one push each time.
  await card.locator('label:has-text("Remind me until I open Studio") input').uncheck();
  await page.locator('.toast', { hasText: 'One notification each time' }).waitFor();
  got.length = 0;
  await page.request.post(`${BASE}/api/me/phones/test`, { headers: { Origin: BASE }, data: {} });
  await new Promise(r => setTimeout(r, 1200));
  if (got.length !== 1) throw new Error(`with reminders off, ${got.length} pushes were sent`);
  // The push service says the subscription is gone (the web app was deleted): Studio forgets it.
  answer = 410;
  await page.request.post(`${BASE}/api/me/phones/test`, { headers: { Origin: BASE }, data: {} });
  for (let i = 0; i < 50 && (await (await page.request.get(`${BASE}/api/me/phones`)).json()).web.length; i++) await new Promise(r => setTimeout(r, 100));
  if ((await (await page.request.get(`${BASE}/api/me/phones`)).json()).web.length) throw new Error('a gone subscription was kept');
  service.close();
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
await check('a chat can be archived, unarchived and deleted', async () => {
  const row = page.locator('.chat-list .chat-row', { hasText: 'slow task please' });
  await row.hover();
  await row.locator('.chat-more').click();
  await page.locator('dialog h2', { hasText: 'Archive or delete chat' }).waitFor();
  await page.screenshot({ path: `${SHOTS}/12-chat-options.png` });
  await page.click('dialog button:has-text("Archive")');
  await page.waitForURL(/\/chat\/new$/);
  await page.locator('.archived-toggle', { hasText: 'Archived (1)' }).waitFor();
  if (await row.count()) throw new Error('the archived chat is still in the list');
  await page.click('.archived-toggle');
  await row.locator('a').click();
  await page.getByText('This chat is archived.').waitFor();
  await page.click('.note button:has-text("Unarchive")');
  await page.locator('.archived-toggle').waitFor({ state: 'detached' });
  await row.hover();
  await row.locator('.chat-more').click();
  await page.click('dialog button:has-text("Delete")');
  await page.click('dialog button:has-text("Delete chat")');
  await page.getByText('Chat deleted').waitFor();
  await page.waitForURL(/\/chat\/new$/);
  if (await row.count()) throw new Error('the deleted chat is still listed');
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
const failed = results.filter(r => r.startsWith('FAIL')).length;
console.log('\n' + failed + ' failed of ' + results.length);
process.exit(failed ? 1 : 0);
