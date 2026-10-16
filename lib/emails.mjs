// Studio's emails: one layout in Paper · ZTD blue, and a template per notification. Each template returns
// { subject, html, text }. No imports and no side effects, so the design preview and tests can load it directly.
// Email clients ignore <style> and web fonts more often than not: everything here is inline, table-based, 600px wide.
// The logo is attached by lib/mail.mjs as cid:logo; the preview swaps in /icon.svg.

const C = { bg: '#f9f8f5', panel: '#ffffff', line: '#e4e3dc', text: '#111111', muted: '#5f6368', faint: '#868a8f',
  accent: '#00427c', accentSoft: '#e4edf6', gold: '#ffc349', goldSoft: '#fff4d9', ok: '#2f7d4f', okSoft: '#e4f2e9', bad: '#b3261e', badSoft: '#fbe7e5', code: '#f3f4f1' };
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'DM Sans', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Fraunces, Georgia, 'Times New Roman', serif";
const MONO = "'JetBrains Mono', SFMono-Regular, Menlo, Consolas, monospace";

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const first = name => String(name || '').trim().split(/\s+/)[0] || 'there';
const when = d => new Date(d || Date.now()).toUTCString().replace(' GMT', ' UTC');
const duration = ms => { const s = Math.round((ms || 0) / 1000), m = Math.round(s / 60); return s < 60 ? `${s} seconds` : `${m} minute${m === 1 ? '' : 's'}`; };

// Building blocks for bodies. Each returns [html, text]; html arguments must already be escaped.
const p = (html, text = html) => [`<p style="margin:0 0 16px;font:16px/1.6 ${SANS};color:${C.text}">${html}</p>`, text];
const small = (html, text = html) => [`<p class="muted" style="margin:0 0 12px;font:14px/1.6 ${SANS};color:${C.muted}">${html}</p>`, text];
// A highlighted box: tone is 'info', 'ok', 'warn' or 'bad'.
function note(tone, html, text){
  const [bg, edge] = { info: [C.accentSoft, C.accent], ok: [C.okSoft, C.ok], warn: [C.goldSoft, C.gold], bad: [C.badSoft, C.bad] }[tone];
  return [`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr>
<td class="note" style="background:${bg};border-left:3px solid ${edge};border-radius:8px;padding:12px 16px;font:14px/1.6 ${SANS};color:${C.text}">${html}</td></tr></table>`, text];
}
// Label/value rows, e.g. [['Team', 'ZTD Devs'], ['Role', 'member']]. Empty values are left out.
function facts(rows){
  rows = rows.filter(r => r[1] != null && r[1] !== '');
  return [`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="rule" style="margin:0 0 20px;border-top:1px solid ${C.line}">${rows.map(([k, v]) =>
    `<tr><td class="muted rule" style="padding:10px 0;border-bottom:1px solid ${C.line};font:14px/1.5 ${SANS};color:${C.muted};width:38%">${esc(k)}</td>
<td class="rule" style="padding:10px 0;border-bottom:1px solid ${C.line};font:600 14px/1.5 ${SANS};color:${C.text}">${esc(v)}</td></tr>`).join('')}</table>`,
    rows.map(([k, v]) => `${k}: ${v}`).join('\n')];
}
const quote = s => [`<div class="code" style="margin:0 0 20px;padding:12px 16px;background:${C.code};border-radius:8px;font:13px/1.6 ${MONO};color:${C.text};white-space:pre-wrap;word-break:break-word">${esc(s)}</div>`,
  String(s).split('\n').map(l => '> ' + l).join('\n')];

// A button that survives Outlook (VML) and image blocking, with the link written out underneath.
function button({ label, url }){
  const u = esc(url);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td>
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${u}" style="height:48px;v-text-anchor:middle;width:260px" arcsize="20%" stroke="f" fillcolor="${C.accent}"><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold">${esc(label)}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a class="btn" href="${u}" style="display:inline-block;background:${C.accent};color:#ffffff;font:600 16px/48px ${SANS};text-decoration:none;padding:0 28px;border-radius:10px">${esc(label)}</a><!--<![endif]-->
</td></tr></table>
<p class="muted" style="margin:0 0 4px;font:13px/1.5 ${SANS};color:${C.faint}">Or paste this link into your browser:</p>
<p style="margin:0 0 24px;font:12px/1.5 ${MONO};word-break:break-all"><a href="${u}" style="color:${C.accent};text-decoration:underline">${u}</a></p>`;
}

// The whole email. blocks and after: [html, text] pairs from the helpers above, before and after the button.
export function layout({ appName = 'ZTD Devs Studio', studioUrl = '', preheader = '', eyebrow = '', title, blocks = [], action, after = [], footnote }){
  const name = esc(appName), home = esc(studioUrl);
  const html = `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(title)}</title>
<style>
  body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
  a { color:${C.accent}; }
  @media (max-width:620px){ .card { padding:28px 22px !important; } .outer { padding:16px 10px !important; } h1 { font-size:24px !important; } }
  @media (prefers-color-scheme: dark){
    body, .outer { background:#0a0f16 !important; }
    .card { background:#111823 !important; border-color:#243042 !important; }
    h1, p, td, .brand { color:#e8ecf1 !important; }
    .muted, .foot, .foot p, .foot a { color:#9aa4b1 !important; }
    .rule { border-color:#243042 !important; }
    .note { background:#17212f !important; }
    .code { background:#0d141e !important; color:#e8ecf1 !important; }
    a { color:#6aa6e6 !important; }
    a.btn { background:#1d5fa3 !important; color:#ffffff !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(preheader)}${'&#8199;&#65279;&#847;'.repeat(30)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="outer" style="background:${C.bg};padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
  <tr><td style="padding:0 4px 20px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle"><img src="cid:logo" width="32" height="32" alt="" style="display:block;border:0;border-radius:7px"></td>
      <td class="brand" style="vertical-align:middle;padding-left:10px;font:600 16px/1 ${SANS};color:${C.text}">${name}</td>
    </tr></table>
  </td></tr>
  <tr><td class="card" style="background:${C.panel};border:1px solid ${C.line};border-radius:16px;padding:40px 40px 32px">
    <div style="height:4px;width:44px;background:${C.gold};border-radius:2px;margin:0 0 24px;font-size:0;line-height:0">&nbsp;</div>
    ${eyebrow ? `<p class="muted" style="margin:0 0 8px;font:600 12px/1.4 ${SANS};letter-spacing:.08em;text-transform:uppercase;color:${C.muted}">${esc(eyebrow)}</p>` : ''}
    <h1 style="margin:0 0 20px;font:600 28px/1.25 ${SERIF};color:${C.text};letter-spacing:-.01em">${esc(title)}</h1>
    ${blocks.map(b => b[0]).join('\n    ')}
    ${action ? button(action) : ''}
    ${after.map(b => b[0]).join('\n    ')}
  </td></tr>
  <tr><td class="foot" style="padding:20px 8px 0;font:12px/1.6 ${SANS};color:${C.faint}">
    ${footnote ? `<p style="margin:0 0 8px;color:${C.faint}">${esc(footnote)}</p>` : ''}
    <p style="margin:0;color:${C.faint}">Sent by ${name}${home ? ` · <a href="${home}" style="color:${C.faint}">${esc(studioUrl.replace(/^https?:\/\//, ''))}</a>` : ''}</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  const text = [title, '='.repeat(Math.min(title.length, 60)), '',
    ...blocks.map(b => b[1] + '\n'),
    ...(action ? [`${action.label}:`, action.url, ''] : []),
    ...after.map(b => b[1] + '\n'),
    '--', ...(footnote ? [footnote] : []), `Sent by ${appName}${studioUrl ? ` · ${studioUrl}` : ''}`, ''].join('\n');
  return { html, text };
}

const make = (subject, opts) => ({ subject, ...layout(opts) });
const base = d => ({ appName: d.appName, studioUrl: d.studioUrl });
const hi = name => p(`Hi ${esc(first(name))},`, `Hi ${first(name)},`);

// Someone asked for a password reset (the /forgot page, or an admin's Reset button).
export function resetPassword(d){
  return make(`Reset your ${d.appName} password`, { ...base(d),
    preheader: 'Choose a new password. The link works for one hour.',
    eyebrow: 'Password reset', title: 'Choose a new password',
    blocks: [hi(d.name),
      p(`Someone asked to reset the password for <b>${esc(d.email)}</b>. Use the button below to choose a new one. You’ll be signed out everywhere else afterwards.`,
        `Someone asked to reset the password for ${d.email}. Use the link below to choose a new one. You'll be signed out everywhere else afterwards.`)],
    action: { label: 'Choose a new password', url: d.url },
    after: [note('info', 'This link works for <b>one hour</b> and only once.', 'This link works for one hour and only once.')],
    footnote: 'Didn’t ask for this? Ignore this email: your password won’t change.' });
}

// A link made on the server with `studio-admin bootstrap` or `reset-link`, usually for an account with no password yet.
export function setPassword(d){
  return make(`Set your ${d.appName} password`, { ...base(d),
    preheader: `Your ${d.appName} account is ready. Choose a password to sign in.`,
    eyebrow: 'Welcome', title: 'Set your password',
    blocks: [hi(d.name),
      p(`An admin made a link for <b>${esc(d.email)}</b> so you can choose a password and sign in to ${esc(d.appName)}. After that you’ll set up two-step sign-in.`,
        `An admin made a link for ${d.email} so you can choose a password and sign in to ${d.appName}. After that you'll set up two-step sign-in.`)],
    action: { label: 'Set your password', url: d.url },
    after: [note('info', `This link works for <b>${esc(d.hours)} hours</b> and only once.`, `This link works for ${d.hours} hours and only once.`)],
    footnote: 'Not expecting this? Ignore this email and nothing will change.' });
}

// An invitation to join a team.
export function invite(d){
  return make(`${d.inviterName} invited you to ${d.orgName} on ${d.appName}`, { ...base(d),
    preheader: `Join ${d.orgName} to work on its projects with Claude. The invitation lasts 7 days.`,
    eyebrow: 'Invitation', title: `Join ${d.orgName}`,
    blocks: [p(`<b>${esc(d.inviterName)}</b> invited you to join the team <b>${esc(d.orgName)}</b> on ${esc(d.appName)}, where the team builds and runs its projects with Claude.`,
        `${d.inviterName} invited you to join the team "${d.orgName}" on ${d.appName}, where the team builds and runs its projects with Claude.`),
      facts([['Team', d.orgName], ['Your role', d.role], ['Invited', d.email], ['From', d.inviterEmail ? `${d.inviterName} (${d.inviterEmail})` : d.inviterName]])],
    action: { label: 'Accept the invitation', url: d.url },
    after: [small('You’ll create an account, then set up two-step sign-in. Studio requires it for everyone.', "You'll create an account, then set up two-step sign-in. Studio requires it for everyone.")],
    footnote: 'This invitation lasts 7 days. Not expecting it? Ignore this email.' });
}

// Tells the person who sent an invitation that it was accepted.
export function inviteAccepted(d){
  return make(`${d.memberName} joined ${d.orgName}`, { ...base(d),
    preheader: `${d.memberName} accepted your invitation to ${d.orgName}.`,
    eyebrow: 'Team', title: `${d.memberName} joined ${d.orgName}`,
    blocks: [hi(d.inviterName),
      p(`<b>${esc(d.memberName)}</b> accepted your invitation and is now on the team.`, `${d.memberName} accepted your invitation and is now on the team.`),
      facts([['Name', d.memberName], ['Email', d.memberEmail], ['Role', d.role], ['Team', d.orgName]])],
    action: { label: 'See the team', url: d.url },
    footnote: 'You’re getting this because you sent the invitation. Turn these off under Account → Email notifications.' });
}

// Security notice after a password was changed (how: 'changed') or reset with an emailed link (how: 'reset').
export function passwordChanged(d){
  const how = d.how === 'reset' ? 'reset with an emailed link' : 'changed from the account page';
  return make(`Your ${d.appName} password was changed`, { ...base(d),
    preheader: 'If this was you, there’s nothing to do.',
    eyebrow: 'Security', title: 'Your password was changed',
    blocks: [hi(d.name),
      p(`The password for <b>${esc(d.email)}</b> was just ${how}. If this was you, there’s nothing to do.`,
        `The password for ${d.email} was just ${how}. If this was you, there's nothing to do.`),
      facts([['When', when(d.at)], ['From', d.ip]]),
      note('warn', '<b>Wasn’t you?</b> Reset your password now and tell a Studio admin straight away.', "Wasn't you? Reset your password now and tell a Studio admin straight away.")],
    action: { label: 'Reset my password', url: d.url },
    footnote: 'This security notice is sent every time your password changes.' });
}

// Security notice after an admin turned off someone's two-step sign-in.
export function mfaReset(d){
  return make(`Your ${d.appName} two-step sign-in was reset`, { ...base(d),
    preheader: 'Set it up again the next time you sign in.',
    eyebrow: 'Security', title: 'Two-step sign-in was reset',
    blocks: [hi(d.name),
      p(`<b>${esc(d.adminName)}</b>, a Studio admin, reset two-step sign-in for <b>${esc(d.email)}</b> and signed you out everywhere. This usually happens after a lost phone.`,
        `${d.adminName}, a Studio admin, reset two-step sign-in for ${d.email} and signed you out everywhere. This usually happens after a lost phone.`),
      p('The next time you sign in, you’ll scan a new code in your authenticator app.', "The next time you sign in, you'll scan a new code in your authenticator app."),
      facts([['When', when(d.at)]]),
      note('warn', '<b>Didn’t ask for this?</b> Contact your admin straight away.', "Didn't ask for this? Contact your admin straight away.")],
    action: { label: 'Sign in', url: d.url },
    footnote: 'This security notice is sent whenever an admin changes your sign-in.' });
}

// Sent to the new address when someone changes their email from the account page; nothing changes until they follow it.
export function confirmEmail(d){
  return make(`Confirm your new ${d.appName} email`, { ...base(d),
    preheader: `Confirm this address to sign in to ${d.appName} with it. The link works for ${d.hours} hour${d.hours == 1 ? '' : 's'}.`,
    eyebrow: 'Account', title: 'Confirm your new email',
    blocks: [hi(d.name),
      p(`You asked to change the email you sign in to ${esc(d.appName)} with from <b>${esc(d.oldEmail)}</b> to <b>${esc(d.email)}</b>. Use the button below to confirm this address.`,
        `You asked to change the email you sign in to ${d.appName} with from ${d.oldEmail} to ${d.email}. Use the link below to confirm this address.`)],
    action: { label: 'Confirm my new email', url: d.url },
    after: [note('info', `Until you do, you still sign in with <b>${esc(d.oldEmail)}</b>. This link works for <b>${esc(d.hours)} hour${d.hours == 1 ? '' : 's'}</b> and only once.`,
      `Until you do, you still sign in with ${d.oldEmail}. This link works for ${d.hours} hour${d.hours == 1 ? '' : 's'} and only once.`)],
    footnote: 'Didn’t ask for this? Ignore this email and nothing will change.' });
}

// Security notice to the old address once the email has changed.
export function emailChanged(d){
  return make(`Your ${d.appName} email was changed`, { ...base(d),
    preheader: `You now sign in with ${d.email}.`,
    eyebrow: 'Security', title: 'Your email was changed',
    blocks: [hi(d.name),
      p(`The email for your ${esc(d.appName)} account was changed from <b>${esc(d.oldEmail)}</b> to <b>${esc(d.email)}</b>. Sign in with the new address from now on; emails from Studio go there too.`,
        `The email for your ${d.appName} account was changed from ${d.oldEmail} to ${d.email}. Sign in with the new address from now on; emails from Studio go there too.`),
      facts([['New email', d.email], ['When', when(d.at)], ['From', d.ip]]),
      note('warn', '<b>Wasn’t you?</b> Tell a Studio admin straight away: they can see the change in the activity log.', "Wasn't you? Tell a Studio admin straight away: they can see the change in the activity log.")],
    action: { label: 'Sign in', url: d.url },
    footnote: 'This security notice goes to your old address whenever your email changes.' });
}

// Admin → Email → Send a test email.
export function testEmail(d){
  return make(`Test email from ${d.appName}`, { ...base(d),
    preheader: `${d.appName} can send email.`,
    eyebrow: 'Admin', title: 'Email is working',
    blocks: [note('ok', `<b>This test arrived</b>, so ${esc(d.appName)} can send password resets, invitations and security notices.`,
        `This test arrived, so ${d.appName} can send password resets, invitations and security notices.`),
      facts([['Mail server', d.host], ['Sending as', d.from], ['Sent', when(d.at)]])],
    action: d.url ? { label: 'Open Admin', url: d.url } : null,
    footnote: `You sent this from ${d.appName}’s Admin page.` });
}

// Each person chooses whether to get these (Account → Email notifications, lib/notify.mjs).
export function projectReady(d){
  const ok = d.status !== 'error';
  const title = ok ? `${d.projectName} is ready` : `${d.projectName} couldn’t be set up`;
  return make(title, { ...base(d),
    preheader: ok ? 'Open it and start a chat with Claude.' : 'See what went wrong.',
    eyebrow: 'Project', title,
    blocks: ok ? [p('Your new project is set up. Open it and start a chat with Claude.')]
      : [p('Setting up your new project failed. Studio said:'), quote(d.detail || 'No details.'), small('Open the project to try again, or ask an admin.')],
    action: { label: 'Open the project', url: d.url },
    footnote: 'You’re getting this because you created the project. Turn these off under Account → Email notifications.' });
}

export function runFinished(d){
  const ok = d.ok !== false;
  return make(ok ? `Claude finished: ${d.chatTitle}` : `Claude stopped with an error: ${d.chatTitle}`, { ...base(d),
    preheader: `${d.projectName} · ${ok ? 'done' : 'needs a look'}`,
    eyebrow: d.projectName, title: ok ? 'Claude finished' : 'Claude stopped with an error',
    blocks: [facts([['Chat', d.chatTitle], ['Project', d.projectName], ['Took', d.durationMs ? duration(d.durationMs) : '']]),
      ...(d.summary ? [quote(d.summary)] : []),
      ...(ok ? [] : [note('bad', esc(d.error || 'Something went wrong.'), d.error || 'Something went wrong.')])],
    action: { label: 'Open the chat', url: d.url },
    footnote: 'You’re getting this because you started this run. Turn these off under Account → Email notifications.' });
}

export function focusFlag(d){
  return make(`Off-topic prompt flagged in ${d.projectName}`, { ...base(d),
    preheader: `${d.userName} sent a prompt that doesn’t seem to fit ${d.projectName}.`,
    eyebrow: 'Admin alert', title: 'A prompt was flagged',
    blocks: [p(`<b>${esc(d.userName)}</b> sent a prompt in <b>${esc(d.projectName)}</b> that doesn’t seem to fit the project.`,
        `${d.userName} sent a prompt in ${d.projectName} that doesn't seem to fit the project.`),
      quote(d.excerpt), ...(d.reason ? [small(`Why: ${esc(d.reason)}`, `Why: ${d.reason}`)] : [])],
    action: { label: 'Review in the activity log', url: d.url },
    footnote: 'Sent to admins while focus checks are on. Turn these off under Account → Email notifications.' });
}

export const templates = { resetPassword, setPassword, invite, inviteAccepted, passwordChanged, mfaReset, confirmEmail, emailChanged, testEmail, projectReady, runFinished, focusFlag };
// Which ones Studio sends today (all of them).
export const LIVE = Object.keys(templates);

// Example data, for the design preview and the tests.
const S = { appName: 'ZTD Devs Studio', studioUrl: 'https://studio.ztddevs.com', at: '2026-10-16T09:42:00Z' };
export const samples = {
  resetPassword: { ...S, name: 'Jo Bello', email: 'jo@ztddevs.com', url: `${S.studioUrl}/reset-password?token=Qm9vdHN0cmFwLXRva2VuLWV4YW1wbGU` },
  setPassword: { ...S, name: 'Samuel', email: 'samuel@ztddevs.com', hours: 48, url: `${S.studioUrl}/reset-password?token=U2V0LXBhc3N3b3JkLWV4YW1wbGU` },
  invite: { ...S, inviterName: 'Samuel', inviterEmail: 'samuel@ztddevs.com', orgName: 'ZTD Devs', role: 'member', email: 'jo@ztddevs.com', url: `${S.studioUrl}/invite/inv_8f2k1x` },
  inviteAccepted: { ...S, inviterName: 'Samuel', memberName: 'Jo Bello', memberEmail: 'jo@ztddevs.com', role: 'member', orgName: 'ZTD Devs', url: `${S.studioUrl}/team` },
  passwordChanged: { ...S, name: 'Jo Bello', email: 'jo@ztddevs.com', how: 'changed', ip: '102.89.34.10', url: `${S.studioUrl}/forgot` },
  mfaReset: { ...S, name: 'Jo Bello', email: 'jo@ztddevs.com', adminName: 'Samuel', url: `${S.studioUrl}/login` },
  confirmEmail: { ...S, name: 'Jo Bello', oldEmail: 'jo@ztddevs.com', email: 'jo.bello@ztddevs.com', hours: 1, url: `${S.studioUrl}/api/account/email/confirm?token=Q29uZmlybS1lbWFpbC1leGFtcGxl` },
  emailChanged: { ...S, name: 'Jo Bello', oldEmail: 'jo@ztddevs.com', email: 'jo.bello@ztddevs.com', ip: '102.89.34.10', url: `${S.studioUrl}/login` },
  testEmail: { ...S, host: 'smtp.gmail.com', from: 'studio@ztddevs.com', url: `${S.studioUrl}/admin` },
  projectReady: { ...S, projectName: 'Bright Smile Dental', status: 'ready', url: `${S.studioUrl}/p/dental/chat` },
  runFinished: { ...S, chatTitle: 'Make the board easier to use on a phone', projectName: 'Pipeline', durationMs: 412000, summary: 'The board now stacks into one column under 700px, and cards can be dragged with a finger.', url: `${S.studioUrl}/p/pipeline/chat/working` },
  focusFlag: { ...S, userName: 'Ada', projectName: 'Bright Smile Dental', excerpt: 'Write me a poem about Mondays', reason: 'A poem isn’t part of a dental practice website.', url: `${S.studioUrl}/admin` },
};
