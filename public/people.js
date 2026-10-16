// Account, teams and admin pages.
import { h, $, fill, api, authApi, toast, fail, busy, dialog, confirmDialog, field, ago, copy, initials, ico } from './ui.js';
import { state, go, setTitle, claudeLabel } from './app.js';
import { pushState, currentSubscription, enablePush, disablePush } from './push.js';

const page = main => { const inner = h('div', { class: 'page-inner' }); main.append(h('div', { class: 'page', style: { flex: 1 } }, inner)); return inner; };
const pageHead = (title, sub, ...right) => h('div', { class: 'page-head' }, h('div', null, h('h1', null, title), sub ? h('p', null, sub) : null), right.length ? h('div', { class: 'spacer' }) : null, ...right);
// A titled card; body is either nodes or an element that a loader fills in later.
const section = (id, title, sub, body, ...extra) => h('section', { class: 'card', id }, h('div', { class: 'card-head' }, h('div', null, h('h3', null, title), sub ? h('p', null, sub) : null), ...extra), body);
// The section menu beside a settings-style page; jumps to each card.
const subnav = items => h('nav', { class: 'subnav', 'aria-label': 'Sections' }, items.filter(Boolean).map(([id, icon, label], i) =>
  h('a', { class: i === 0 ? 'on' : '', href: '#' + id, onclick: e => { e.preventDefault(); e.currentTarget.parentNode.querySelectorAll('a').forEach(a => a.classList.toggle('on', a === e.currentTarget)); document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'smooth' }); } }, ico(icon), label)));
const roleName = r => ({ owner: 'Owner', admin: 'Admin', member: 'Member', 'site-admin': 'Studio admin' })[r] || r;

// =====================================================================
// Account
// =====================================================================
export async function renderAccount(main){
  setTitle('Account');
  const inner = page(main);
  const me = state.me.user;
  const claudeCard = h('div', { class: 'card-body' });
  const sessionsCard = h('div', { class: 'devices' });
  const emailCard = h('div', { class: 'card-body' });
  const phoneCard = h('div', { class: 'card-body' });

  const name = h('input', { type: 'text', value: me.name, maxlength: 80 });
  const cur = h('input', { type: 'password', autocomplete: 'current-password' });
  const npw = h('input', { type: 'password', autocomplete: 'new-password', minlength: 12 });
  const otherOut = h('input', { type: 'checkbox', checked: true });
  const newEmail = h('input', { type: 'email', autocomplete: 'email', maxlength: 254, required: true });
  const emailPw = h('input', { type: 'password', autocomplete: 'current-password', required: true });
  const emailNote = h('div', { class: 'ok-box', hidden: true });
  const roleName2 = r => ({ owner: 'Owner', admin: 'Admin', member: 'Member' })[r] || r;

  inner.append(
    pageHead('Account', 'Your profile, your Claude connection and how you sign in.'),
    h('div', { class: 'settings-layout' },
      subnav([['acc-profile', 'user', 'Profile'], ['claude', 'sparkle', 'Claude'], ['acc-address', 'mail', 'Email address'], ['acc-password', 'lock', 'Password'], ['acc-mfa', 'shield', 'Two-step sign-in'], ['acc-email', 'mail', 'Email notifications'], ['acc-phone', 'phone', 'Push notifications'], ['acc-devices', 'laptop', 'Devices']]),
      h('div', { class: 'stack' },
        h('section', { class: 'card profile', id: 'acc-profile' }, h('span', { class: 'avatar lg' }, initials(me.name)),
          h('div', null, h('h2', null, me.name), h('div', { class: 'muted' }, me.email),
            h('div', { class: 'row tight', style: { marginTop: '8px' } }, me.role === 'admin' ? h('span', { class: 'pill navy' }, ico('shield'), 'Studio admin') : null,
              ...state.me.teams.map(t => h('span', { class: 'pill' }, `${t.name} · ${roleName2(t.role)}`))))),
        section('claude', 'Claude', 'Your prompts run on your own Claude account.', claudeCard),
        h('form', { class: 'card', onsubmit: async e => { e.preventDefault(); await busy(e.submitter, async () => { await authApi('/update-user', { name: name.value.trim() }); state.me.user.name = name.value.trim(); toast('Saved'); }).catch(() => {}); } },
          h('div', { class: 'card-head' }, h('div', null, h('h3', null, 'Profile'), h('p', null, 'Shown to your team.'))),
          h('div', { class: 'card-body' }, field('Name', name)),
          h('div', { class: 'card-foot' }, h('div', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'submit' }, 'Save name'))),
        h('form', { class: 'card', id: 'acc-address', onsubmit: async e => {
          e.preventDefault();
          await busy(e.submitter, async () => {
            const r = await api('POST', '/api/account/email', { email: newEmail.value.trim(), password: emailPw.value });
            emailPw.value = '';
            if (r.changed){ state.me.user.email = r.email; toast('Email changed'); return go('/account', true); }
            newEmail.value = '';
            emailNote.hidden = false;
            emailNote.textContent = `Check ${r.sentTo} for a link to confirm it. It works for one hour. Until then you still sign in with ${me.email}.`;
          }).catch(() => {});
        } },
          h('div', { class: 'card-head' }, h('div', null, h('h3', null, 'Email address'), h('p', null, `You sign in with ${me.email}. Studio’s emails go there too.`))),
          h('div', { class: 'card-body' }, h('div', { class: 'grid2' }, field('New email', newEmail), field('Your password', emailPw)), emailNote),
          h('div', { class: 'card-foot' }, h('div', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'submit' }, 'Change email'))),
        h('form', { class: 'card', id: 'acc-password', onsubmit: async e => {
          e.preventDefault();
          await busy(e.submitter, async () => {
            if (npw.value.length < 12) throw new Error('Use at least 12 characters.');
            await authApi('/change-password', { currentPassword: cur.value, newPassword: npw.value, revokeOtherSessions: otherOut.checked });
            cur.value = npw.value = ''; toast('Password changed');
          }).catch(() => {});
        } },
          h('div', { class: 'card-head' }, h('div', null, h('h3', null, 'Password'), h('p', null, 'At least 12 characters. A short sentence works well.'))),
          h('div', { class: 'card-body' }, h('div', { class: 'grid2' }, field('Current password', cur), field('New password', npw, 'at least 12 characters')), h('label', { class: 'check' }, otherOut, 'Sign out my other devices')),
          h('div', { class: 'card-foot' }, h('div', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'submit' }, 'Change password'))),
        section('acc-mfa', 'Two-step sign-in', 'Studio requires it for every account.',
          h('div', { class: 'card-body conn' }, h('span', { class: 'svc-icon' }, ico('shield')),
            h('div', { style: { flex: 1 } }, h('strong', null, '✓ On, with an authenticator app.'), h('div', { class: 'small muted' }, 'Lost your backup codes? Make new ones; the old ones stop working.')),
            h('button', { class: 'btn', onclick: () => newBackupCodes() }, ico('key'), 'New backup codes')),
          h('span', { class: 'spacer' }), h('span', { class: 'pill ok' }, ico('check'), 'On')),
        section('acc-email', 'Email notifications', `Sent to ${me.email}.`, emailCard),
        section('acc-phone', 'Push notifications', 'On your phone or computer, even with Studio closed.', phoneCard),
        section('acc-devices', 'Devices', 'Where you’re signed in.', sessionsCard))));

  paintClaude(claudeCard);
  paintSessions(sessionsCard);
  paintEmailPrefs(emailCard);
  paintPhones(phoneCard);
  if (location.hash === '#claude') claudeCard.scrollIntoView({ block: 'center' });
  // Back from the link in a confirm-your-new-email message (see lib/account.mjs).
  const emailResult = new URLSearchParams(location.search).get('email');
  if (emailResult){
    history.replaceState(null, '', '/account');
    if (emailResult === 'changed') toast(`Email changed. You now sign in with ${me.email}.`);
    else toast(emailResult === 'taken' ? 'Another account already uses that email, so it wasn’t changed.' : 'That link has expired or was already used. Ask for a new one below.', true);
    if (emailResult !== 'changed') $('#acc-address')?.scrollIntoView({ block: 'center' });
  }
}

// Each box saves as soon as it's changed. Security emails can't be turned off, so they're only mentioned.
const prefBox = (path, on, off) => p => {
  const input = h('input', { type: 'checkbox', checked: p.on });
  input.onchange = async () => {
    input.disabled = true;
    try { await api('PUT', path, { [p.key]: input.checked }); toast(input.checked ? on : off); }
    catch (e){ input.checked = !input.checked; fail(e); }
    finally { input.disabled = false; }
  };
  return h('label', { class: 'check switch-check email-pref' }, input, h('span', null, h('strong', null, p.label), h('span', { class: 'small muted' }, p.hint)));
};
async function paintEmailPrefs(card){
  let prefs;
  try { prefs = await api('GET', '/api/me/email'); } catch (e){ card.replaceChildren(h('p', null, e.message)); return; }
  card.replaceChildren(
    state.me.mailEnabled ? null : h('p', { class: 'note small', style: { marginTop: 0 } }, 'Email isn’t set up on this Studio yet, so nothing is sent. A Studio admin can set it up on the Admin page.'),
    ...prefs.map(prefBox('/api/me/email', 'You’ll get these emails', 'You won’t get these emails')),
    h('p', { class: 'muted small', style: { marginBottom: 0 } }, 'Password resets, invitations and security notices (a changed password, a reset two-step sign-in) are always sent.'));
}

// Paired phones (lib/phone.mjs), a test button, and what they ring for.
async function paintPhones(card){
  let r;
  try { r = await api('GET', '/api/me/phones'); } catch (e){ card.replaceChildren(h('p', null, e.message)); return; }
  const repaint = () => paintPhones(card);
  const here = await currentSubscription().catch(() => null);
  const isHere = w => here && w.endpoint === here.endpoint;

  // This browser: turn web push on or off, or what's in the way.
  const state = pushState();
  const turnOn = e => busy(e.currentTarget, async () => { await enablePush(r.vapidKey); toast('Notifications are on for this device'); repaint(); }).catch(() => {});
  const turnOff = e => busy(e.currentTarget, async () => { await disablePush(); toast('Notifications are off for this device'); repaint(); }).catch(() => {});
  const thisDevice = h('div', { class: 'push-here' },
    state === 'home-screen' ? h('p', { class: 'note', style: { margin: 0 } }, 'To get notifications on this iPhone, add Studio to your Home Screen: tap Share (the square with an arrow), then ', h('strong', null, 'Add to Home Screen'), '. Open Studio from the Home Screen, sign in, and come back to this page.')
    : state === 'unsupported' ? h('p', { class: 'muted', style: { margin: 0 } }, 'This browser can’t get push notifications.')
    : state === 'denied' ? h('p', { class: 'note', style: { margin: 0 } }, 'Notifications are blocked for Studio in this browser. Allow them in its settings, then reload this page.')
    : r.web.some(isHere) ? h('div', { class: 'row' }, h('span', { style: { flex: 1 } }, '✓ This device gets notifications, even with Studio closed.'), h('button', { class: 'btn small', onclick: turnOff }, 'Turn off here'))
    : h('button', { class: 'btn primary', onclick: turnOn }, ico('phone'), 'Turn on notifications on this device'));

  const webRow = w => h('div', { class: 'phone-row' },
    h('span', { class: 'dev-ico' }, ico(/iPhone|iPad|Android/.test(w.device) ? 'phone' : 'laptop')),
    h('div', { style: { flex: 1, minWidth: 0 } }, h('strong', null, w.device),
      isHere(w) ? h('span', { class: 'pill navy', style: { marginLeft: '8px' } }, 'This device') : null,
      h('div', { class: 'small muted' }, [`Added ${ago(w.createdAt)}`, w.lastOkAt ? `last notified ${ago(w.lastOkAt)}` : ''].filter(Boolean).join(' · '))),
    h('button', { class: 'btn small', onclick: e => busy(e.target, async () => {
      if (isHere(w)) await disablePush(); else await api('DELETE', '/api/me/push', { id: w.id });
      toast('Notifications turned off for that device'); repaint();
    }).catch(() => {}) }, 'Remove'));
  const appRow = p => h('div', { class: 'phone-row' },
    h('span', { class: 'dev-ico' }, ico('phone')),
    h('div', { style: { flex: 1, minWidth: 0 } }, h('strong', null, p.name), h('span', { class: 'small muted' }, ' · phone app'),
      p.connected ? h('span', { class: 'pill ok', style: { marginLeft: '8px' } }, 'Connected') : null,
      h('div', { class: 'small muted' }, [p.connected ? `Paired ${ago(p.createdAt)}` : p.lastSeenAt ? `Last connected ${ago(p.lastSeenAt)}` : 'Not connected yet',
        p.push ? 'rings with the app closed' : p.lastSeenAt ? 'only while the app is open: open it to turn on push' : ''].filter(Boolean).join(' · '))),
    h('button', { class: 'btn small', onclick: e => busy(e.target, async () => { await api('DELETE', `/api/me/phones/${p.id}`); toast(`${p.name} removed`); repaint(); }).catch(() => {}) }, 'Remove'));
  const count = r.web.length + r.phones.length;
  const test = e => busy(e.target, async () => {
    const t = await api('POST', '/api/me/phones/test');
    toast(t.delivered ? `Sent to ${t.delivered} device${t.delivered > 1 ? 's' : ''}` : 'Nothing got it right now. A phone app gets it when it connects.', !t.delivered);
  }).catch(() => {});

  const repeat = h('input', { type: 'checkbox', checked: r.webRepeat });
  repeat.onchange = async () => {
    repeat.disabled = true;
    try { await api('PUT', '/api/me/push/repeat', { on: repeat.checked }); toast(repeat.checked ? 'Studio will remind you until you open it' : 'One notification each time'); }
    catch (e){ repeat.checked = !repeat.checked; fail(e); }
    finally { repeat.disabled = false; }
  };

  card.replaceChildren(
    thisDevice,
    count ? h('div', { class: 'phones', style: { marginTop: '14px' } }, r.web.map(webRow), r.phones.map(appRow))
      : h('p', { class: 'muted' }, 'No devices get notifications yet.'),
    count ? h('div', { class: 'row', style: { margin: '12px 0 4px' } }, h('button', { class: 'btn', onclick: test }, 'Send a test')) : null,
    r.web.length ? h('label', { class: 'check switch-check email-pref', style: { marginTop: '12px' } }, repeat,
      h('span', null, h('strong', null, 'Remind me until I open Studio'), h('span', { class: 'small muted' }, 'Each notification comes again every 30 seconds, up to 4 more times, until you open Studio or tap it.'))) : null,
    h('h4', { class: 'push-sub' }, 'Notify me when'),
    ...r.prefs.map(prefBox('/api/me/phone-prefs', 'Your devices will ring for these', 'Your devices won’t ring for these')),
    h('details', { class: 'push-app' }, h('summary', null, 'Or use the Studio phone app (Expo Go)'),
      h('p', { class: 'small muted' }, 'It can ring until you tap Stop while it’s open. On iPhone it runs in Expo Go (free in the App Store). On your phone, ',
        h('a', { href: r.appUrl, class: 'phone-app-link' }, 'open the app in Expo Go'), ', or go to ', h('span', { class: 'mono' }, `${location.origin}/api/phone/app`), '. Then pair it:'),
      h('button', { class: 'btn', onclick: () => pairDialog(repaint) }, ico('phone'), 'Pair a phone')));
}

function pairDialog(done){
  const name = h('input', { type: 'text', maxlength: 60, value: /iPhone|Android/.test(navigator.userAgent) ? '' : 'My phone', placeholder: 'My phone', required: true });
  let poll;
  const d = dialog(close => h('form', { onsubmit: async e => {
    e.preventDefault();
    await busy(e.submitter, async () => {
      const p = await api('POST', '/api/me/phones', { name: name.value.trim() });
      const status = h('p', { class: 'muted small phone-pair-status' }, 'Waiting for the app to connect…');
      e.target.replaceChildren(h('h2', null, `Pair ${p.name}`),
        h('p', { class: 'muted' }, 'In the Studio phone app, tap Scan and point it at this code. Or copy the code and paste it into the app.'),
        h('div', { class: 'qr' }, h('img', { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(p.qr), width: 220, height: 220, alt: 'Pairing code for the Studio phone app' })),
        h('div', { class: 'row tight' }, h('input', { type: 'text', readonly: true, value: p.code, class: 'mono', style: { flex: 1 }, 'aria-label': 'Pairing code', onfocus: ev => ev.target.select() }),
          h('button', { class: 'btn', type: 'button', onclick: () => copy(p.code) }, 'Copy')),
        h('p', { class: 'muted small' }, 'This code is shown only once. Anyone with it gets your Studio notifications, so don’t share it. You can remove the phone later.'),
        status,
        h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn primary', type: 'button', onclick: close }, 'Done')));
      poll = setInterval(async () => {
        const phone = (await api('GET', '/api/me/phones').catch(() => null))?.phones.find(x => x.id === p.id);
        if (phone?.connected){ clearInterval(poll); status.textContent = '✓ Connected. Your phone will ring for the notifications you choose.'; status.classList.remove('muted'); done(); }
      }, 2000);
    }).catch(() => {});
  } }, h('h2', null, 'Pair a phone'), field('Name for this phone', name, 'so you can tell your phones apart'),
    h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn', type: 'button', onclick: close }, 'Cancel'), h('button', { class: 'btn primary', type: 'submit' }, 'Show pairing code'))));
  d.el.addEventListener('close', () => { clearInterval(poll); done(); });
}

function newBackupCodes(){
  const pw = h('input', { type: 'password', autocomplete: 'current-password', required: true });
  dialog(close => h('form', { onsubmit: async e => {
    e.preventDefault();
    await busy(e.submitter, async () => {
      const r = await authApi('/two-factor/generate-backup-codes', { password: pw.value });
      e.target.replaceChildren(h('h2', null, 'Your new backup codes'), h('p', { class: 'muted' }, 'Save them somewhere safe. Each works once.'),
        h('div', { class: 'codes' }, r.backupCodes.map(c => h('span', null, c))),
        h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn', type: 'button', onclick: () => copy(r.backupCodes.join('\n')) }, 'Copy'), h('button', { class: 'btn primary', type: 'button', onclick: close }, 'Done')));
    }).catch(() => {});
  } }, h('h2', null, 'New backup codes'), field('Your password', pw), h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn', type: 'button', onclick: close }, 'Cancel'), h('button', { class: 'btn primary', type: 'submit' }, 'Make new codes'))));
}

async function paintSessions(card){
  try {
    const list = await api('GET', '/api/auth/list-sessions');
    const phone = ua => /iPhone|iPad|Android/.test(ua || '');
    card.replaceChildren(...list.map(s => h('div', null,
      h('span', { class: 'dev-ico' }, ico(phone(s.userAgent) ? 'phone' : 'laptop')),
      h('div', { style: { flex: 1, minWidth: 0 } }, h('strong', null, describeAgent(s.userAgent)), s.id === state.me.session.id ? h('span', { class: 'pill navy', style: { marginLeft: '8px' } }, 'This device') : null,
        h('div', { class: 'small muted' }, [s.ipAddress, `active ${ago(s.updatedAt)}`].filter(Boolean).join(' · '))),
      s.id === state.me.session.id ? null : h('button', { class: 'btn small', onclick: e => busy(e.target, async () => { await authApi('/revoke-session', { token: s.token }); paintSessions(card); }) }, 'Sign out'))));
  } catch (e){ card.replaceChildren(h('div', null, e.message)); }
}
function describeAgent(ua = ''){
  const b = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const o = /iPhone|iPad/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : '';
  return `${b}${o ? ' on ' + o : ''}`;
}

async function paintClaude(card){
  const info = await api('GET', '/api/claude').catch(() => ({ connected: false }));
  state.me.claude = info;
  const side = $('#side-claude'); if (side) side.textContent = claudeLabel();
  if (info.connected && info.sharedBy){
    card.replaceChildren(
      h('div', { class: 'conn' }, h('span', { class: 'conn-logo' }, ico('sparkle')),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('strong', null, `Using ${info.sharedBy}’s Claude ${info.kind === 'subscription' ? 'subscription' : 'API key'}`),
          h('div', { class: 'small muted' }, `${info.sharedBy} shared it with you when they invited you.`)),
        h('span', { class: 'pill ok' }, ico('check'), 'Connected')),
      h('p', { class: 'small muted' }, `Prompts you send in Studio run on ${info.sharedBy}’s ${info.kind === 'subscription' ? 'Claude.ai plan and count towards its usage limits' : 'Anthropic Console account'}. Connect your own and Studio uses yours instead.`),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => connectFlow(card) }, 'Connect my own Claude subscription'),
        h('button', { class: 'btn', onclick: () => apiKeyFlow(card) }, 'Use my own API key'),
        h('button', { class: 'btn danger', onclick: async () => { if (await confirmDialog(`Stop using ${info.sharedBy}’s Claude?`, 'You won’t be able to send prompts until you connect your own.', 'Stop using it', true)){ await api('DELETE', '/api/claude'); paintClaude(card); } } }, 'Stop using it')));
    return;
  }
  if (info.connected){
    card.replaceChildren(
      h('div', { class: 'conn' }, h('span', { class: 'conn-logo' }, ico('sparkle')),
        h('div', { style: { flex: 1, minWidth: 0 } }, h('strong', null, info.kind === 'subscription' ? 'Connected to your Claude subscription' : 'Using your Anthropic API key'),
          h('div', { class: 'small muted' }, `${info.hint} · since ${new Date(info.createdAt).toLocaleDateString('en-GB')}`)),
        h('span', { class: 'pill ok' }, ico('check'), 'Connected')),
      h('p', { class: 'small muted' }, info.kind === 'subscription' ? 'Prompts you send in Studio run on your Claude.ai plan and count towards its usage limits.' : 'Prompts you send in Studio are billed to your Anthropic Console account.',
        ' Projects whose own AI workers use your connection (set in each project’s Settings) pick up a change the next time their services restart.'),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => connectFlow(card) }, info.kind === 'subscription' ? 'Reconnect' : 'Switch to my subscription'),
        h('button', { class: 'btn danger', onclick: async () => { if (await confirmDialog('Disconnect Claude?', 'You won’t be able to send prompts until you connect again. Projects that lend your connection to their AI workers will stop being able to run them.', 'Disconnect', true)){ await api('DELETE', '/api/claude'); paintClaude(card); } } }, 'Disconnect')));
    return;
  }
  card.replaceChildren(
    h('div', { class: 'conn' }, h('span', { class: 'conn-logo off' }, ico('sparkle')), h('div', null, h('strong', null, 'Not connected. '), 'Connect your own Claude account so your prompts run as you.')),
    h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => connectFlow(card) }, 'Connect my Claude subscription'),
      h('button', { class: 'btn', onclick: () => apiKeyFlow(card) }, 'Use an API key instead')),
    h('p', { class: 'small muted' }, 'This uses Claude Code’s own sign-in: you approve access on claude.ai and paste back a code. Studio stores the resulting token encrypted, and only uses it for prompts you send.'));
}

async function connectFlow(card){
  card.replaceChildren(h('p', { class: 'muted', style: { margin: 0 } }, 'Starting Claude sign-in…'));
  let url;
  try { url = (await api('POST', '/api/claude/connect')).url; }
  catch (e){ card.replaceChildren(h('div', { class: 'error-box' }, e.message), h('button', { class: 'btn', onclick: () => paintClaude(card) }, 'Back')); return; }
  const code = h('input', { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: 'Paste the code from claude.ai', class: 'mono' });
  const box = h('div', { class: 'error-box', hidden: true });
  const btn = h('button', { class: 'btn primary', type: 'submit' }, 'Connect');
  card.replaceChildren(
    h('ol', { class: 'steps-num' },
      h('li', null, h('div', null, h('strong', null, 'Approve access on claude.ai'), h('div', { class: 'small muted', style: { margin: '2px 0 8px' } }, 'Sign in with the Claude account you want Studio to use, and approve.'),
        h('a', { class: 'btn primary small', href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Open claude.ai to approve', ico('external')))),
      h('li', null, h('div', null, h('strong', null, 'Copy the code claude.ai shows'))),
      h('li', null, h('div', null, h('strong', null, 'Paste it here')))),
    h('form', { onsubmit: async e => {
      e.preventDefault(); box.hidden = true;
      try { await busy(btn, () => api('POST', '/api/claude/code', { code: code.value.trim() }), 'Connecting…'); toast('Claude connected'); paintClaude(card); }
      catch (err){ box.hidden = false; box.textContent = err.message; }
    } }, box, code, h('div', { class: 'row', style: { marginTop: '10px' } }, btn, h('button', { class: 'btn', type: 'button', onclick: async () => { await api('POST', '/api/claude/cancel').catch(() => {}); paintClaude(card); } }, 'Cancel'))));
  code.focus();
}

function apiKeyFlow(card){
  const key = h('input', { type: 'password', autocomplete: 'off', placeholder: 'sk-ant-…', class: 'mono' });
  card.replaceChildren(
    h('p', { style: { marginTop: 0 } }, 'Create a key at ', h('a', { href: 'https://console.anthropic.com/settings/keys', target: '_blank', rel: 'noopener noreferrer' }, 'console.anthropic.com'), '. Usage is billed to that Console account. Set a monthly limit there.'),
    h('form', { onsubmit: async e => {
      e.preventDefault();
      await busy(e.submitter, async () => { await api('POST', '/api/claude/apikey', { key: key.value }); toast('API key saved'); paintClaude(card); }).catch(() => {});
    } }, field('API key', key), h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn primary', type: 'submit' }, 'Save key'), h('button', { class: 'btn', type: 'button', onclick: () => paintClaude(card) }, 'Cancel'))));
  key.focus();
}

// =====================================================================
// Teams
// =====================================================================
export async function renderTeams(main){
  setTitle('Teams and people');
  const inner = page(main);
  async function load(){
    const teams = await api('GET', '/api/teams');
    fill(inner,
      pageHead('Teams and people', 'Everyone in a team can open its projects, chat with Claude in them and restart them. Owners and admins can also invite people and change settings.',
        state.me.user.role === 'admin' ? h('button', { class: 'btn', onclick: () => newTeam(load) }, ico('plus'), 'New team') : null),
      !state.me.mailEnabled ? h('div', { class: 'note' }, ico('mail'), h('span', null, 'Email isn’t set up on this server yet, so invitations aren’t emailed. Copy each invite link and send it yourself.')) : null,
      teams.length ? null : h('div', { class: 'card card-pad' }, 'You’re not in a team yet.'),
      h('div', { class: 'stack' }, teams.map(t => teamCard(t, load, teams))));
  }
  await load().catch(e => inner.replaceChildren(h('div', { class: 'error-box' }, e.message)));
}

function teamCard(t, reload, teams){
  const others = teams.filter(o => o.canAdmin && o.organizationId !== t.organizationId);
  const email = h('input', { type: 'email', required: true, placeholder: 'name@example.com', 'aria-label': 'Email to invite' });
  // Only your own connection can be shared, not one shared with you.
  const canShare = state.me.claude?.connected && !state.me.claude.sharedBy;
  const share = h('input', { type: 'checkbox', 'aria-label': 'Share my Claude' });
  const role = h('select', { 'aria-label': 'Role', style: { width: 'auto' } }, h('option', { value: 'member' }, 'Member'), h('option', { value: 'admin' }, 'Admin'), t.role === 'owner' || t.role === 'site-admin' ? h('option', { value: 'owner' }, 'Owner') : null);
  return h('section', { class: 'card team-card' },
    h('div', { class: 'card-head' }, h('div', null, h('h3', null, t.name),
      t.projects.length ? h('p', null, 'Projects: ', t.projects.map((p, i) => [i ? ', ' : '', h('a', { href: `/p/${p.id}`, 'data-link': '' }, p.name)])) : h('p', null, 'No projects yet.')),
      h('span', { class: 'spacer' }), h('span', { class: 'pill navy' }, 'You: ' + roleName(t.role || 'none'))),
    h('div', { class: 'table-wrap' }, h('table', { class: 'list' },
      h('thead', null, h('tr', null, h('th', null, 'Person'), h('th', null, 'Role'), h('th', null, 'Two-step'), h('th', null, ''))),
      h('tbody', null, t.members.map(m => {
        const sel = h('select', { style: { width: 'auto', minHeight: '32px' }, 'aria-label': `Role for ${m.name}`, disabled: !t.canAdmin || m.userId === state.me.user.id },
          ['member', 'admin', 'owner'].map(r => h('option', { value: r }, roleName(r))));
        sel.value = m.role;
        sel.onchange = async () => { try { await authApi('/organization/update-member-role', { memberId: m.id, role: sel.value, organizationId: t.organizationId }); toast(`${m.name} is now ${roleName(sel.value)}`); } catch (e){ fail(e); sel.value = m.role; } };
        return h('tr', null,
          h('td', null, h('div', { class: 'row', style: { gap: '8px', flexWrap: 'nowrap' } }, h('span', { class: 'avatar' }, initials(m.name)), h('div', null, m.name, m.userId === state.me.user.id ? ' (you)' : '', h('div', { class: 'small muted' }, m.email), m.claudeFrom ? claudeFromLine(m, reload) : null))),
          h('td', null, sel),
          h('td', { class: 'small' }, m.twoFactorEnabled ? h('span', { class: 'pill ok' }, ico('check'), 'On') : h('span', { class: 'pill warn' }, ico('alert'), 'Not set up')),
          h('td', { class: 'right' }, t.canAdmin && m.userId !== state.me.user.id ? h('div', { class: 'row tight end' }, others.length ? h('button', { class: 'btn small ghost', onclick: () => moveMember(t, m, others, reload) }, 'Move') : null, h('button', { class: 'btn small ghost danger', onclick: async e => {
            if (await confirmDialog(`Remove ${m.name}?`, `They lose access to ${t.name}'s projects straight away.`, 'Remove', true))
              busy(e.target, async () => { await authApi('/organization/remove-member', { memberIdOrEmail: m.id, organizationId: t.organizationId }); reload(); });
          } }, 'Remove')) : null));
      })))),
    t.canAdmin ? h('div', null,
      t.invites.length ? h('div', { class: 'card-body invites' }, h('div', { class: 'small muted label' }, 'Waiting to join'),
        t.invites.map(i => h('div', { class: 'row' }, h('span', { class: 'avatar small blank' }, ico('mail')), h('span', null, h('strong', null, i.email), h('span', { class: 'small muted' }, ` · ${roleName(i.role)} · expires ${new Date(i.expiresAt).toLocaleDateString('en-GB')}`), i.sharesClaude ? h('span', { class: 'small muted' }, i.inviterId === state.me.user.id ? ' · shares your Claude' : ' · shares the inviter’s Claude') : null),
          h('span', { class: 'spacer' }),
          h('button', { class: 'btn small', onclick: () => copy(i.link) }, ico('link'), 'Copy invite link'),
          h('button', { class: 'btn small ghost', onclick: e => busy(e.target, async () => { await authApi('/organization/cancel-invitation', { invitationId: i.id }); reload(); }) }, 'Cancel')))) : null,
      h('form', { class: 'card-foot', onsubmit: async e => {
        e.preventDefault();
        await busy(e.submitter, async () => {
          const inv = await authApi('/organization/invite-member', { email: email.value.trim(), role: role.value, organizationId: t.organizationId, resend: true });
          if (canShare && inv?.id) await api('POST', `/api/invitations/${inv.id}/share-claude`, { on: share.checked });
          toast(state.me.mailEnabled ? `Invitation emailed to ${email.value.trim()}` : 'Invitation created. Copy the link below and send it.');
          email.value = ''; reload();
        }, 'Inviting…').catch(() => {});
      } }, h('div', { style: { flex: '1 1 220px' } }, email), role, h('button', { class: 'btn primary', type: 'submit' }, 'Invite'),
        canShare ? h('label', { class: 'check', style: { flexBasis: '100%', margin: '4px 0 0' } }, share,
          h('span', null, `Let them use my Claude ${state.me.claude.kind === 'subscription' ? 'subscription' : 'API key'} `, h('span', { class: 'small muted' }, '(until they connect their own)'))) : null)) : null);
}

// Moves someone straight into another team you administer; they keep their role.
function moveMember(t, m, others, reload){
  const to = h('select', { 'aria-label': 'Move to team' }, others.map(o => h('option', { value: o.organizationId }, o.name)));
  dialog(close => h('form', { class: 'dialog-body', onsubmit: async e => {
    e.preventDefault();
    await busy(e.submitter, async () => {
      await api('POST', `/api/teams/${t.organizationId}/members/${m.id}/move`, { organizationId: to.value });
      close(); toast(`${m.name} moved to ${to.selectedOptions[0].textContent}`); reload();
    }).catch(() => {});
  } }, h('h2', null, `Move ${m.name} to another team`),
    h('p', { class: 'muted' }, `They lose access to ${t.name}’s projects and get access to the new team’s, with the same role. Projects here that use their Claude switch to the team owner’s.`),
    field('Team', to),
    h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn', type: 'button', onclick: close }, 'Cancel'), h('button', { class: 'btn primary', type: 'submit' }, 'Move'))));
}

// "Uses Samuel's Claude", with a way to stop it for the person sharing, the person using it, or a site admin.
function claudeFromLine(m, reload){
  const me = state.me.user;
  const mine = m.claudeFrom.id === me.id;
  const canStop = mine || m.userId === me.id || me.role === 'admin';
  return h('div', { class: 'small muted' }, mine ? 'Uses your Claude' : `Uses ${m.claudeFrom.name}’s Claude`,
    canStop ? [' · ', h('button', { class: 'btn small ghost', style: { minHeight: 0, padding: '0 4px' }, onclick: async e => {
      if (await confirmDialog(`Stop ${m.name} using ${mine ? 'your' : m.claudeFrom.name + '’s'} Claude?`, 'They won’t be able to send prompts until they connect their own.', 'Stop sharing', true))
        busy(e.target, async () => { await api('DELETE', `/api/claude/share/${m.userId}`); toast('Stopped sharing'); reload(); });
    } }, 'Stop sharing')] : null);
}

function newTeam(reload){
  const name = h('input', { type: 'text', required: true, maxlength: 60, placeholder: 'e.g. Nurseries' });
  dialog(close => h('form', { onsubmit: async e => {
    e.preventDefault();
    await busy(e.submitter, async () => {
      const slug = name.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
      await authApi('/organization/create', { name: name.value.trim(), slug, keepCurrentActiveOrganization: true });
      state.me = await api('GET', '/api/me');
      close(); toast('Team created'); reload();
    }).catch(() => {});
  } }, h('h2', null, 'New team'), field('Team name', name), h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn', type: 'button', onclick: close }, 'Cancel'), h('button', { class: 'btn primary', type: 'submit' }, 'Create team'))));
}

// =====================================================================
// Admin
// =====================================================================
export async function renderAdmin(main){
  setTitle('Admin');
  const inner = page(main);
  if (state.me.user.role !== 'admin'){ inner.append(h('p', null, 'Admins only.')); return; }
  const usersCard = h('div', { class: 'table-wrap' });
  const auditCard = h('div', { class: 'table-wrap' });
  const loading = t => h('div', { class: 'card-body' }, h('p', { class: 'muted', style: { margin: 0 } }, t));
  const studioCard = loading('Checking…'), mailCard = loading('Loading…'), focusCard = loading('Loading…'), backupCard = loading('Loading…');
  inner.append(
    pageHead('Admin', 'Studio-wide settings. Only Studio admins see this page.'),
    h('div', { class: 'settings-layout' },
      subnav([['adm-version', 'download', 'Studio version'], ['adm-email', 'mail', 'Email'], ['adm-focus', 'eye', 'Project focus'], ['adm-backup', 'github', 'GitHub backup'], ['adm-people', 'users', 'People'], ['adm-activity', 'activity', 'Activity log']]),
      h('div', { class: 'stack' },
        section('adm-version', 'Studio version', 'Installs the latest commit of the Studio source project, then restarts.', studioCard),
        section('adm-email', 'Email', 'How Studio sends invitations and sign-in help.', mailCard),
        section('adm-focus', 'Project focus', 'Spot prompts that don’t belong in their project.', focusCard),
        section('adm-backup', 'GitHub backup', 'Every project’s committed code, pushed every hour, a branch per project.', backupCard),
        section('adm-people', 'People', 'To add someone, invite them to a team from Teams and people.', usersCard),
        section('adm-activity', 'Activity log', 'Sign-ins, prompts, restarts and admin changes.', auditCard))));

  async function loadUsers(){
    const users = await api('GET', '/api/admin/users');
    const act = (label, fn, cls = '') => h('button', { class: 'btn small ' + cls, onclick: e => busy(e.target, fn).catch(() => {}) }, label);
    usersCard.replaceChildren(h('table', { class: 'list' },
      h('thead', null, h('tr', null, h('th', null, 'Person'), h('th', null, 'Teams'), h('th', null, 'Security'), h('th', null, 'Last seen'), h('th', null, ''))),
      h('tbody', null, users.map(u => h('tr', null,
        h('td', null, h('div', { class: 'person' }, h('span', { class: 'avatar' }, initials(u.name)), h('div', null, h('strong', null, u.name), u.role === 'admin' ? h('span', { class: 'pill navy', style: { marginLeft: '6px' } }, 'admin') : null, u.banned ? h('span', { class: 'pill bad', style: { marginLeft: '6px' } }, 'suspended') : null, h('div', { class: 'small muted' }, u.email)))),
        h('td', { class: 'small' }, u.teams.map(t => `${t.name} (${roleName(t.role)})`).join(', ') || '—'),
        h('td', { class: 'small' }, u.twoFactorEnabled ? [h('span', { class: 'dot running' }), ' Two-step on'] : [h('span', { class: 'dot starting' }), h('span', { style: { color: 'var(--warn)' } }, ' Two-step not set up')], h('br'), h('span', { class: 'muted' }, u.claude ? 'Claude connected' : 'No Claude')),
        h('td', { class: 'small' }, ago(u.lastSeen)),
        h('td', null, u.id === state.me.user.id ? h('span', { class: 'small muted' }, 'you') : h('div', { class: 'row tight' },
          act('Reset link', async () => {
            const r = await api('POST', `/api/admin/users/${u.id}/reset-link`);
            if (r.link) dialog(close => h('div', { class: 'dialog-body' }, h('h2', null, 'Password reset link'), h('p', { class: 'muted' }, `Send this to ${u.email}. It works once, for one hour.`), h('div', { class: 'secret' }, r.link),
              h('div', { class: 'row end', style: { marginTop: '16px' } }, h('button', { class: 'btn', onclick: () => copy(r.link) }, 'Copy'), h('button', { class: 'btn primary', onclick: close }, 'Done'))));
            else toast(`Reset link emailed to ${u.email}`);
          }),
          act('Reset two-step', async () => { if (await confirmDialog('Reset two-step sign-in?', `${u.name} is signed out and must set up an authenticator app again next time they sign in. Do this only after checking it's really them asking.`, 'Reset', true)){ await api('POST', `/api/admin/users/${u.id}/reset-mfa`); toast('Two-step reset'); loadUsers(); } }),
          u.banned ? act('Restore', async () => { await authApi('/admin/unban-user', { userId: u.id }); loadUsers(); })
            : act('Suspend', async () => { if (await confirmDialog(`Suspend ${u.name}?`, 'They are signed out everywhere and can’t sign in until restored.', 'Suspend', true)){ await authApi('/admin/ban-user', { userId: u.id, banReason: 'Suspended by an admin' }); loadUsers(); } }, 'danger'),
          act(u.role === 'admin' ? 'Remove admin' : 'Make admin', async () => { await authApi('/admin/set-role', { userId: u.id, role: u.role === 'admin' ? 'user' : 'admin' }); loadUsers(); }),
          act('Delete', async () => { if (await confirmDialog(`Delete ${u.name}'s account?`, 'This can’t be undone. Their chats stay in the projects.', 'Delete account', true)){ await authApi('/admin/remove-user', { userId: u.id }); loadUsers(); } }, 'danger'))))))));
  }
  let oldest = null;
  async function loadAudit(more = false){
    const rows = await api('GET', '/api/admin/audit' + (more && oldest ? `?before=${oldest}` : ''));
    if (rows.length) oldest = rows[rows.length - 1].at;
    const table = more ? auditCard.querySelector('tbody') : null;
    const trs = rows.map(r => h('tr', null, h('td', { class: 'small muted', style: { whiteSpace: 'nowrap' } }, new Date(r.at).toLocaleString('en-GB')), h('td', { class: 'small' }, r.userName || '—'), h('td', { class: 'small mono' }, r.action), h('td', { class: 'small' }, [r.target, r.detail].filter(Boolean).join(' · ').slice(0, 200)), h('td', { class: 'small muted' }, r.ip)));
    if (table) table.append(...trs);
    else auditCard.replaceChildren(h('table', { class: 'list audit' }, h('thead', null, h('tr', null, h('th', null, 'When'), h('th', null, 'Who'), h('th', null, 'What'), h('th', null, 'Detail'), h('th', null, 'IP'))), h('tbody', null, trs)),
      h('div', { class: 'card-foot' }, h('div', { class: 'spacer' }), h('button', { class: 'btn small', onclick: () => loadAudit(true).catch(fail) }, 'Older')));
  }
  loadBackup(backupCard).catch(e => backupCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadFocus(focusCard).catch(e => focusCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadMail(mailCard).catch(e => mailCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadStudio(studioCard).catch(e => studioCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadUsers().catch(e => usersCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadAudit().catch(e => auditCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
}

// Updating Studio: installs the last commit of the Studio source project and restarts, then waits for it to come back.
const short = c => c?.slice(0, 7) || '';
async function loadStudio(card){
  const { installed, source, sourceError } = await api('GET', '/api/admin/studio');
  const commitLine = c => h('li', null, h('span', { class: 'mono' }, short(c.hash)), ' ', c.subject, h('span', { class: 'muted small' }, ` · ${c.author}, ${ago(Date.parse(c.date))}`));
  const upToDate = installed && source && installed.commit === source.head.hash;
  const where = source ? (source.path === '.' ? `the ${source.project} project` : `${source.path}/ in the ${source.project} project`) : '';
  const logBox = h('pre', { class: 'update-log', hidden: true });
  const btn = h('button', { class: 'btn primary', disabled: !source || source.updating, onclick: () => update() }, upToDate ? 'Reinstall and restart Studio' : 'Update and restart Studio');
  fill(card,
    h('p', null, 'Running: ', installed ? [h('span', { class: 'mono' }, short(installed.commit)), ` ${installed.subject} `, h('span', { class: 'muted small' }, `(installed ${ago(Date.parse(installed.installedAt))})`)]
      : h('span', { class: 'muted' }, 'a version installed by hand, so Studio can’t tell which commit it is.')),
    sourceError ? h('div', { class: 'error-box' }, sourceError) : null,
    source ? h('p', null, `Latest commit to ${where}: `, h('span', { class: 'mono' }, short(source.head.hash)), ` ${source.head.subject}`) : null,
    upToDate ? h('p', { class: 'ok-box' }, 'Studio is up to date.') : null,
    source?.pending?.length ? [h('p', null, `${source.pending.length} new commit${source.pending.length > 1 ? 's' : ''} to install. Check these are changes you expect, because the update runs the install script as root:`), h('ul', { class: 'small' }, source.pending.map(commitLine))] : null,
    source?.dirty?.length ? h('div', { class: 'note' }, `${source.dirty.length} uncommitted change${source.dirty.length > 1 ? 's' : ''} in ${where} won’t be installed. Commit them in its Changes tab first: `, h('span', { class: 'mono small' }, source.dirty.slice(0, 8).join(', ') + (source.dirty.length > 8 ? ' …' : ''))) : null,
    source?.updating ? h('div', { class: 'note' }, 'An update is running now.') : null,
    h('div', { class: 'row' }, btn), logBox);

  const update = () => runStudioUpdate(btn, logBox);
}

// Installs the latest Studio commit and restarts Studio, showing progress in logBox (a <pre>) and reloading the page
// when it's done. Used by Admin and by the update bar in the Studio source project's chats.
export async function runStudioUpdate(btn, logBox){
  if (!await confirmDialog('Update and restart Studio?', 'Studio installs the latest committed code and restarts. Any Claude chats that are running stop, and Studio is unavailable for about a minute.', 'Update and restart')) return;
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = 'Updating…';
  let started;
  try { started = (await api('POST', '/api/admin/studio/update')).at; } catch (e){ fail(e); btn.disabled = false; btn.textContent = label; return; }
  logBox.hidden = false; logBox.textContent = 'Starting…';
  // Studio goes away while it restarts, so keep polling through errors.
  const until = Date.now() + 10 * 60000;
  while (Date.now() < until){
    await new Promise(r => setTimeout(r, 3000));
    let st; try { st = await api('GET', '/api/admin/studio/log'); } catch { logBox.textContent += '.'; continue; }
    logBox.textContent = st.log.split('\n').slice(-25).join('\n');
    if (st.updating) continue;
    // The journal keeps earlier runs too: only trust a "finished" line stamped after this run started.
    const done = st.log.split('\n').filter(l => /studio-update finished: \d+/.test(l)).pop();
    if (!done || Date.parse(done.split(' ')[0]) < started - 5000) continue;
    if (/finished: 0\b/.test(done)){ toast('Studio updated. Reloading…'); setTimeout(() => location.reload(), 1200); }
    else { toast('The update failed. See the log below.', true); btn.disabled = false; btn.textContent = 'Try again'; }
    return;
  }
  toast('The update is taking a long time. Check the server.', true);
}

// Email for password resets and invites. Saving checks the settings with the mail server first.
// GitHub backup: every project's committed code, pushed to one repo with a branch per project (ops/github-backup.sh).
async function loadBackup(card){
  let poll = null;
  const paint = s => {
    clearTimeout(poll);
    const repo = s.url.replace(/^git@github\.com:|\.git$/g, '');
    const act = (label, fn, cls = '') => h('button', { class: 'btn ' + cls, type: 'button', onclick: e => busy(e.target, fn).catch(() => {}) }, label);
    const urlInput = h('input', { type: 'text', value: repo ? `https://github.com/${repo}` : '', placeholder: 'https://github.com/you/ztd-projects', 'aria-label': 'GitHub repo' });
    const save = act(repo ? 'Change repo' : 'Set up', async () => paint(await api('PUT', '/api/admin/github-backup', { url: urlInput.value })), repo ? '' : 'primary');
    if (!repo){
      fill(card,
        h('p', { style: { marginTop: 0 } }, 'Push every project’s committed code to one GitHub repo every hour, each project on its own branch with its full history. An off-server backup, and an easy start if a project later needs a repo of its own.'),
        h('ol', { class: 'small' },
          h('li', null, 'On GitHub, create an empty ', h('strong', null, 'private'), ' repo, for example ztd-projects.'),
          h('li', null, 'Paste its address here. Studio then shows a key to add to that repo.')),
        h('div', { class: 'row', style: { alignItems: 'end' } }, field('GitHub repo', urlInput), save));
      return;
    }
    const last = s.last;
    fill(card,
      h('p', { style: { marginTop: 0 } }, 'Backing up to ', h('a', { href: `https://github.com/${repo}`, target: '_blank', rel: 'noopener' }, repo), ' every hour, a branch per project (projects/<name>). Only committed changes are included.'),
      s.running ? h('div', { class: 'note' }, 'Backing up now…')
        : last ? h('div', { class: last.ok ? 'ok-box' : 'error-box' }, `${last.message} (${ago(Date.parse(last.at))})`)
        : h('div', { class: 'note' }, 'No backup yet. Add the key below on GitHub, then press Back up now.'),
      h('p', { class: 'small' }, 'Studio pushes with its own key. On GitHub, open the repo’s ',
        h('a', { href: `https://github.com/${repo}/settings/keys/new`, target: '_blank', rel: 'noopener' }, 'Settings → Deploy keys → Add deploy key'),
        ', paste this key, and tick ', h('strong', null, 'Allow write access'), ':'),
      h('pre', { class: 'mono small', style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, s.publicKey),
      h('div', { class: 'row' },
        act('Back up now', async () => paint(await api('POST', '/api/admin/github-backup/run')), 'primary'),
        h('button', { class: 'btn', type: 'button', onclick: () => copy(s.publicKey) }, 'Copy key'),
        act('Turn off', async () => { if (await confirmDialog('Turn off the GitHub backup?', 'Nothing more is pushed. What’s on GitHub stays there.', 'Turn off')) paint(await api('DELETE', '/api/admin/github-backup')); })),
      h('details', { class: 'small', style: { marginTop: '10px' } }, h('summary', null, 'Use a different repo'),
        h('div', { class: 'row', style: { alignItems: 'end' } }, field('GitHub repo', urlInput), save)));
    if (s.running) poll = setTimeout(async () => {
      if (!document.body.contains(card)) return;
      const n = await api('GET', '/api/admin/github-backup').catch(() => null);
      if (n && !n.running && n.last) toast(n.last.ok ? 'Backup done' : 'The backup failed', !n.last.ok);
      if (n) paint(n);
    }, 2000);
  };
  paint(await api('GET', '/api/admin/github-backup'));
}

// Focus checks: flag prompts that don't fit their project's description (see checkScope in lib/agent.mjs).
async function loadFocus(card){
  const s = await api('GET', '/api/admin/settings');
  const box = h('input', { type: 'checkbox', checked: s.scopeCheck });
  box.onchange = async () => {
    box.disabled = true;
    try { const r = await api('PUT', '/api/admin/settings', { scopeCheck: box.checked }); box.checked = r.scopeCheck; toast(r.scopeCheck ? 'Off-topic prompts will be flagged' : 'Focus checks are off'); }
    catch (e){ box.checked = !box.checked; fail(e); }
    finally { box.disabled = false; }
  };
  card.replaceChildren(
    h('label', { class: 'check switch-check', style: { marginTop: 0 } }, box, ' Flag prompts that don’t fit their project'),
    h('p', { class: 'muted small', style: { marginBottom: 0 } }, 'Each prompt is compared with its project’s Description (in the project’s Settings) by a quick check with Haiku, on the sender’s Claude connection, while Claude works. Prompts that don’t fit still run, and are marked in the chat and listed here in the Activity log as chat.off-topic. Projects without a description aren’t checked.'));
}

async function loadMail(card){
  const paint = m => {
    state.me.mailEnabled = m.source !== 'none';
    const inp = (v, attrs = {}) => h('input', { value: v ?? '', autocomplete: 'off', ...attrs });
    const host = inp(m.host || 'smtp.gmail.com'), port = inp(m.port || 465, { type: 'number', min: 1, max: 65535, style: { maxWidth: '120px' } });
    const user = inp(m.user, { type: 'email', placeholder: 'you@gmail.com' }), from = inp(m.from, { type: 'email', placeholder: 'Same as the user name' });
    const pass = inp('', { type: 'password', autocomplete: 'new-password', placeholder: m.source === 'studio' && m.hasPassword ? 'Saved. Leave empty to keep it.' : 'For Gmail, a 16-character app password' });
    const secure = h('input', { type: 'checkbox', checked: m.secure !== false });
    port.oninput = () => { if (port.value === '587') secure.checked = false; if (port.value === '465') secure.checked = true; };
    const act = (label, fn, cls = '') => h('button', { class: 'btn ' + cls, type: 'button', onclick: e => busy(e.target, fn).catch(() => {}) }, label);
    card.replaceChildren(
      m.source === 'none' ? h('div', { class: 'note', style: { marginTop: 0 } }, 'Email isn’t set up, so password reset links and invitations aren’t emailed. Admins copy them from this page and from Teams and people instead.')
        : h('p', { class: 'ok-box', style: { marginTop: 0 } }, `Sending through ${m.host} as ${m.user}`, m.source === 'server' ? ', using the settings in /etc/studio/studio.env on the server. Saving here replaces them.' : '.'),
      h('p', { class: 'muted small' }, 'For Gmail, turn on two-step verification for the account, then create an app password at ',
        h('a', { href: 'https://myaccount.google.com/apppasswords', target: '_blank', rel: 'noopener' }, 'myaccount.google.com/apppasswords'), '. The password is stored encrypted and never shown again.'),
      h('div', { style: { display: 'grid', gap: '10px', maxWidth: '480px' } },
        field('Mail server', host),
        h('div', { class: 'row', style: { alignItems: 'end' } }, field('Port', port), h('label', { class: 'check', style: { marginBottom: '10px' } }, secure, ' Secure connection (TLS), on for port 465')),
        field('User name', user, 'usually the email address'), field('Password', pass), field('From address', from, 'optional')),
      h('div', { class: 'row', style: { marginTop: '14px' } },
        act('Check and save', async () => {
          const r = await api('PUT', '/api/admin/mail', { host: host.value, port: Number(port.value), secure: secure.checked, user: user.value, pass: pass.value, from: from.value });
          toast('Email settings saved'); paint(r);
        }, 'primary'),
        m.source !== 'none' ? act('Send a test email', async () => { const r = await api('POST', '/api/admin/mail/test'); toast(`Test email sent to ${r.to}`); }) : null,
        m.source === 'studio' ? act('Remove', async () => {
          if (await confirmDialog('Remove the email settings?', 'Studio stops sending email, unless the server has its own settings in /etc/studio/studio.env.', 'Remove', true)) paint(await api('DELETE', '/api/admin/mail'));
        }, 'danger') : null));
  };
  paint(await api('GET', '/api/admin/mail'));
}
