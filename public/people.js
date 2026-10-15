// Account, teams and admin pages.
import { h, $, api, authApi, toast, fail, busy, dialog, confirmDialog, field, ago, copy, initials } from './ui.js';
import { state, go, setTitle, claudeLabel } from './app.js';

const page = main => { const inner = h('div', { class: 'page-inner', style: { maxWidth: '820px' } }); main.append(h('div', { class: 'page', style: { flex: 1 } }, inner)); return inner; };
const roleName = r => ({ owner: 'Owner', admin: 'Admin', member: 'Member', 'site-admin': 'Studio admin' })[r] || r;

// =====================================================================
// Account
// =====================================================================
export async function renderAccount(main){
  setTitle('Account');
  const inner = page(main);
  const me = state.me.user;
  const claudeCard = h('div', { class: 'card', id: 'claude' });
  const sessionsCard = h('div', { class: 'card' });

  const name = h('input', { type: 'text', value: me.name, maxlength: 80 });
  const cur = h('input', { type: 'password', autocomplete: 'current-password' });
  const npw = h('input', { type: 'password', autocomplete: 'new-password', minlength: 12 });
  const otherOut = h('input', { type: 'checkbox', checked: true });

  inner.append(
    h('h1', null, 'Account'),
    h('p', { class: 'muted' }, me.email, me.role === 'admin' ? ' · Studio admin' : ''),
    h('h2', null, 'Claude'), claudeCard,
    h('h2', null, 'Profile'),
    h('form', { class: 'card', onsubmit: async e => { e.preventDefault(); await busy(e.submitter, async () => { await authApi('/update-user', { name: name.value.trim() }); state.me.user.name = name.value.trim(); toast('Saved'); }).catch(() => {}); } },
      field('Name', name), h('button', { class: 'btn', type: 'submit', style: { marginTop: '10px' } }, 'Save name')),
    h('h2', null, 'Password'),
    h('form', { class: 'card', onsubmit: async e => {
      e.preventDefault();
      await busy(e.submitter, async () => {
        if (npw.value.length < 12) throw new Error('Use at least 12 characters.');
        await authApi('/change-password', { currentPassword: cur.value, newPassword: npw.value, revokeOtherSessions: otherOut.checked });
        cur.value = npw.value = ''; toast('Password changed');
      }).catch(() => {});
    } }, field('Current password', cur), field('New password', npw, 'at least 12 characters'), h('label', { class: 'check' }, otherOut, 'Sign out my other devices'),
      h('button', { class: 'btn', type: 'submit' }, 'Change password')),
    h('h2', null, 'Two-step sign-in'),
    h('div', { class: 'card' }, h('p', { style: { marginTop: 0 } }, '✓ On, with an authenticator app. Studio requires it for every account.'),
      h('p', { class: 'small muted' }, 'Lost your backup codes? Make new ones; the old ones stop working.'),
      h('button', { class: 'btn', onclick: () => newBackupCodes() }, 'New backup codes')),
    h('h2', null, 'Where you’re signed in'), sessionsCard);

  paintClaude(claudeCard);
  paintSessions(sessionsCard);
  if (location.hash === '#claude') claudeCard.scrollIntoView({ block: 'center' });
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
    card.replaceChildren(h('div', { class: 'table-wrap' }, h('table', { class: 'list' },
      h('thead', null, h('tr', null, h('th', null, 'Device'), h('th', null, 'Last active'), h('th', null, ''))),
      h('tbody', null, list.map(s => h('tr', null,
        h('td', null, describeAgent(s.userAgent), s.id === state.me.session.id ? h('span', { class: 'pill', style: { marginLeft: '6px' } }, 'this device') : null, h('div', { class: 'small muted' }, s.ipAddress || '')),
        h('td', { class: 'small' }, ago(s.updatedAt)),
        h('td', null, s.id === state.me.session.id ? null : h('button', { class: 'btn small', onclick: e => busy(e.target, async () => { await authApi('/revoke-session', { token: s.token }); paintSessions(card); }) }, 'Sign out'))))))));
  } catch (e){ card.textContent = e.message; }
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
  if (info.connected){
    card.replaceChildren(
      h('p', { style: { marginTop: 0 } }, h('strong', null, info.kind === 'subscription' ? '✓ Connected to your Claude subscription' : '✓ Using your Anthropic API key'), ` (${info.hint}), since ${new Date(info.createdAt).toLocaleDateString('en-GB')}.`),
      h('p', { class: 'small muted' }, info.kind === 'subscription' ? 'Prompts you send in Studio run on your Claude.ai plan and count towards its usage limits.' : 'Prompts you send in Studio are billed to your Anthropic Console account.',
        ' Projects whose own AI workers use your connection (set in each project’s Settings) pick up a change the next time their services restart.'),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => connectFlow(card) }, info.kind === 'subscription' ? 'Reconnect' : 'Switch to my subscription'),
        h('button', { class: 'btn danger', onclick: async () => { if (await confirmDialog('Disconnect Claude?', 'You won’t be able to send prompts until you connect again. Projects that lend your connection to their AI workers will stop being able to run them.', 'Disconnect', true)){ await api('DELETE', '/api/claude'); paintClaude(card); } } }, 'Disconnect')));
    return;
  }
  card.replaceChildren(
    h('p', { style: { marginTop: 0 } }, h('strong', null, 'Not connected. '), 'Connect your own Claude account so your prompts run as you.'),
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
    h('ol', { style: { paddingLeft: '20px', marginTop: 0 } },
      h('li', null, h('a', { class: 'btn primary small', href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Open claude.ai to approve ↗'), ' Sign in with the Claude account you want Studio to use, and approve.'),
      h('li', { style: { marginTop: '8px' } }, 'claude.ai shows a code. Copy it.'),
      h('li', { style: { marginTop: '8px' } }, 'Paste it here:')),
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
    inner.replaceChildren(
      h('div', { class: 'row' }, h('div', null, h('h1', null, 'Teams and people'), h('p', { class: 'muted', style: { margin: 0 } }, 'Everyone in a team can open its projects, chat with Claude in them and restart them. Owners and admins can also invite people and change settings.')),
        h('div', { class: 'spacer' }), state.me.user.role === 'admin' ? h('button', { class: 'btn', onclick: () => newTeam(load) }, '+ New team') : null),
      !state.me.mailEnabled ? h('div', { class: 'note' }, 'Email isn’t set up on this server yet, so invitations aren’t emailed. Copy each invite link and send it yourself.') : null,
      teams.length ? null : h('div', { class: 'card' }, 'You’re not in a team yet.'),
      ...teams.map(t => teamCard(t, load)));
  }
  await load().catch(e => inner.replaceChildren(h('div', { class: 'error-box' }, e.message)));
}

function teamCard(t, reload){
  const email = h('input', { type: 'email', required: true, placeholder: 'name@example.com', 'aria-label': 'Email to invite' });
  const role = h('select', { 'aria-label': 'Role', style: { width: 'auto' } }, h('option', { value: 'member' }, 'Member'), h('option', { value: 'admin' }, 'Admin'), t.role === 'owner' || t.role === 'site-admin' ? h('option', { value: 'owner' }, 'Owner') : null);
  return h('div', { class: 'card' },
    h('div', { class: 'row' }, h('h3', { style: { fontSize: '1.15rem' } }, t.name), h('span', { class: 'pill' }, 'You: ' + roleName(t.role || 'none'))),
    t.projects.length ? h('p', { class: 'small muted' }, 'Projects: ', t.projects.map((p, i) => [i ? ', ' : '', h('a', { href: `/p/${p.id}`, 'data-link': '' }, p.name)])) : h('p', { class: 'small muted' }, 'No projects yet.'),
    h('div', { class: 'table-wrap' }, h('table', { class: 'list' },
      h('thead', null, h('tr', null, h('th', null, 'Person'), h('th', null, 'Role'), h('th', null, 'Two-step'), h('th', null, ''))),
      h('tbody', null, t.members.map(m => {
        const sel = h('select', { style: { width: 'auto', minHeight: '32px' }, 'aria-label': `Role for ${m.name}`, disabled: !t.canAdmin || m.userId === state.me.user.id },
          ['member', 'admin', 'owner'].map(r => h('option', { value: r }, roleName(r))));
        sel.value = m.role;
        sel.onchange = async () => { try { await authApi('/organization/update-member-role', { memberId: m.id, role: sel.value, organizationId: t.organizationId }); toast(`${m.name} is now ${roleName(sel.value)}`); } catch (e){ fail(e); sel.value = m.role; } };
        return h('tr', null,
          h('td', null, h('div', { class: 'row', style: { gap: '8px', flexWrap: 'nowrap' } }, h('span', { class: 'avatar' }, initials(m.name)), h('div', null, m.name, m.userId === state.me.user.id ? ' (you)' : '', h('div', { class: 'small muted' }, m.email)))),
          h('td', null, sel),
          h('td', { class: 'small' }, m.twoFactorEnabled ? '✓ On' : h('span', { style: { color: 'var(--warn)' } }, 'Not set up')),
          h('td', null, t.canAdmin && m.userId !== state.me.user.id ? h('button', { class: 'btn small danger', onclick: async e => {
            if (await confirmDialog(`Remove ${m.name}?`, `They lose access to ${t.name}'s projects straight away.`, 'Remove', true))
              busy(e.target, async () => { await authApi('/organization/remove-member', { memberIdOrEmail: m.id, organizationId: t.organizationId }); reload(); });
          } }, 'Remove') : null));
      })))),
    t.canAdmin ? h('div', null,
      t.invites.length ? h('div', null, h('h3', { style: { marginTop: '18px' } }, 'Waiting to join'),
        h('ul', { class: 'files', style: { fontFamily: 'inherit' } }, t.invites.map(i => h('li', null, h('span', { class: 'path' }, i.email, h('span', { class: 'small muted' }, ` · ${roleName(i.role)} · expires ${new Date(i.expiresAt).toLocaleDateString('en-GB')}`)),
          h('button', { class: 'btn small', onclick: () => copy(i.link) }, 'Copy invite link'),
          h('button', { class: 'btn small ghost', onclick: e => busy(e.target, async () => { await authApi('/organization/cancel-invitation', { invitationId: i.id }); reload(); }) }, 'Cancel'))))) : null,
      h('form', { class: 'row', style: { marginTop: '16px' }, onsubmit: async e => {
        e.preventDefault();
        await busy(e.submitter, async () => {
          await authApi('/organization/invite-member', { email: email.value.trim(), role: role.value, organizationId: t.organizationId, resend: true });
          toast(state.me.mailEnabled ? `Invitation emailed to ${email.value.trim()}` : 'Invitation created. Copy the link below and send it.');
          email.value = ''; reload();
        }, 'Inviting…').catch(() => {});
      } }, h('div', { style: { flex: '1 1 220px' } }, email), role, h('button', { class: 'btn primary', type: 'submit' }, 'Invite'))) : null);
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
  inner.style.maxWidth = '1100px';
  if (state.me.user.role !== 'admin'){ inner.append(h('p', null, 'Admins only.')); return; }
  const usersCard = h('div', { class: 'card table-wrap' });
  const auditCard = h('div', { class: 'card table-wrap' });
  const studioCard = h('div', { class: 'card' }, h('p', { class: 'muted' }, 'Checking…'));
  const mailCard = h('div', { class: 'card' }, h('p', { class: 'muted' }, 'Loading…'));
  inner.append(
    h('h1', null, 'Admin'),
    h('h2', null, 'Studio version'), studioCard,
    h('h2', null, 'Email'), mailCard,
    h('h2', null, 'People'), h('p', { class: 'muted small' }, 'To add someone, invite them to a team from Teams and people.'), usersCard,
    h('h2', null, 'Activity log'), auditCard);

  async function loadUsers(){
    const users = await api('GET', '/api/admin/users');
    const act = (label, fn, cls = '') => h('button', { class: 'btn small ' + cls, onclick: e => busy(e.target, fn).catch(() => {}) }, label);
    usersCard.replaceChildren(h('table', { class: 'list' },
      h('thead', null, h('tr', null, h('th', null, 'Person'), h('th', null, 'Teams'), h('th', null, 'Security'), h('th', null, 'Last seen'), h('th', null, ''))),
      h('tbody', null, users.map(u => h('tr', null,
        h('td', null, u.name, u.role === 'admin' ? h('span', { class: 'pill', style: { marginLeft: '6px' } }, 'admin') : null, u.banned ? h('span', { class: 'pill', style: { marginLeft: '6px', color: 'var(--bad)' } }, 'suspended') : null, h('div', { class: 'small muted' }, u.email)),
        h('td', { class: 'small' }, u.teams.map(t => `${t.name} (${roleName(t.role)})`).join(', ') || '—'),
        h('td', { class: 'small' }, u.twoFactorEnabled ? 'Two-step on' : h('span', { style: { color: 'var(--warn)' } }, 'Two-step not set up'), h('br'), u.claude ? 'Claude connected' : 'No Claude'),
        h('td', { class: 'small' }, ago(u.lastSeen)),
        h('td', null, u.id === state.me.user.id ? h('span', { class: 'small muted' }, 'you') : h('div', { class: 'row', style: { gap: '6px' } },
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
    else auditCard.replaceChildren(h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'When'), h('th', null, 'Who'), h('th', null, 'What'), h('th', null, 'Detail'), h('th', null, 'IP'))), h('tbody', null, trs)),
      h('button', { class: 'btn small', style: { marginTop: '10px' }, onclick: () => loadAudit(true).catch(fail) }, 'Older'));
  }
  loadMail(mailCard).catch(e => mailCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadStudio(studioCard).catch(e => studioCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadUsers().catch(e => usersCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
  loadAudit().catch(e => auditCard.replaceChildren(h('div', { class: 'error-box' }, e.message)));
}

// Updating Studio: installs the last commit of studio/ from the source project and restarts, then waits for it to come back.
const short = c => c?.slice(0, 7) || '';
async function loadStudio(card){
  const { installed, source, sourceError } = await api('GET', '/api/admin/studio');
  const commitLine = c => h('li', null, h('span', { class: 'mono' }, short(c.hash)), ' ', c.subject, h('span', { class: 'muted small' }, ` · ${c.author}, ${ago(Date.parse(c.date))}`));
  const upToDate = installed && source && installed.commit === source.head.hash;
  const logBox = h('pre', { class: 'update-log', hidden: true });
  const btn = h('button', { class: 'btn primary', disabled: !source || source.updating, onclick: () => update() }, upToDate ? 'Reinstall and restart Studio' : 'Update and restart Studio');
  card.replaceChildren(
    h('p', null, 'Running: ', installed ? [h('span', { class: 'mono' }, short(installed.commit)), ` ${installed.subject} `, h('span', { class: 'muted small' }, `(installed ${ago(Date.parse(installed.installedAt))})`)]
      : h('span', { class: 'muted' }, 'a version installed by hand, so Studio can’t tell which commit it is.')),
    sourceError ? h('div', { class: 'error-box' }, sourceError) : null,
    source ? h('p', null, `Latest commit to ${source.path}/ in the ${source.project} project: `, h('span', { class: 'mono' }, short(source.head.hash)), ` ${source.head.subject}`) : null,
    upToDate ? h('p', { class: 'ok-box' }, 'Studio is up to date.') : null,
    source?.pending?.length ? [h('p', null, `${source.pending.length} new commit${source.pending.length > 1 ? 's' : ''} to install. Check these are changes you expect, because the update runs the install script as root:`), h('ul', { class: 'small' }, source.pending.map(commitLine))] : null,
    source?.dirty?.length ? h('div', { class: 'note' }, `${source.dirty.length} uncommitted change${source.dirty.length > 1 ? 's' : ''} in ${source.path}/ won’t be installed. Commit them in the ${source.project} project’s Changes tab first: `, h('span', { class: 'mono small' }, source.dirty.slice(0, 8).join(', ') + (source.dirty.length > 8 ? ' …' : ''))) : null,
    source?.updating ? h('div', { class: 'note' }, 'An update is running now.') : null,
    h('div', { class: 'row' }, btn), logBox);

  async function update(){
    if (!await confirmDialog('Update and restart Studio?', 'Studio installs the latest committed code and restarts. Any Claude chats that are running stop, and Studio is unavailable for about a minute.', 'Update and restart')) return;
    btn.disabled = true; btn.textContent = 'Updating…';
    let started;
    try { started = (await api('POST', '/api/admin/studio/update')).at; } catch (e){ fail(e); btn.disabled = false; btn.textContent = 'Update and restart Studio'; return; }
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
}

// Email for password resets and invites. Saving checks the settings with the mail server first.
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
