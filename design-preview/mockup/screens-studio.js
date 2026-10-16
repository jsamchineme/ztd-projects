// Studio-wide pages: Projects home, Account, Teams and people, Admin.
import { ico, logo, shell, PROJECTS, DOMAIN } from './kit.js';

const card = (title, sub, body, { foot = '', right = '', id = '' } = {}) => `<section class="card"${id ? ` id="${id}"` : ''}><div class="card-head"><div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div><span class="spacer"></span>${right}</div>${body}${foot ? `<div class="card-foot">${foot}</div>` : ''}</section>`;
const person = (name, email, cls = '') => `<div class="person"><span class="avatar${cls}">${name.replace(/ \(you\)$/, '').split(' ').map(s => s[0]).join('').slice(0, 2)}</span><div><b>${name}</b><small>${email}</small></div></div>`;

export const studioScreens = {
  home: () => shell({ page: 'home' }, `<div class="page"><div class="page-inner">
    <div class="page-head"><div><h1 class="hello">Good afternoon, Samuel</h1><p>Four projects, two chats running, everything backed up 38 minutes ago.</p></div><span class="spacer"></span>
      <button class="btn primary" type="button" data-modal="newProject">${ico('plus')} New project</button></div>
    <div class="stats">
      <div class="stat"><b>4</b><span>${ico('grid')} Projects</span></div>
      <div class="stat"><b>6</b><span>${ico('server')} Services running</span></div>
      <div class="stat gold"><b>2</b><span><span class="dot busy"></span> Chats working now</span></div>
      <div class="stat"><b>$3.40</b><span>${ico('sparkle')} Claude this week</span></div>
    </div>
    <div class="pgrid">
      ${PROJECTS.map(p => `<a class="pcard" href="#/p/${p.id}/chat"><div class="thumb">${p.thumb}${p.live.length ? `<span class="pill live"><span class="dot ${p.dot === 'busy' ? 'ok' : p.dot}"></span>${p.live[0]}.${DOMAIN}</span>` : ''}</div>
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="pcard-foot"><span class="dot ${p.dot}"></span>${p.state}<span>·</span>${ico('chat')} ${p.chats}${p.changes ? `<span>·</span><span class="badge">${p.changes}</span> to commit` : ''}<span class="spacer"></span><span class="pill soft">${p.team}</span></div></a>`).join('')}
      <button class="pcard add" type="button" data-modal="newProject"><div><div class="plus">${ico('plus')}</div><b>New project</b><p style="margin:4px 0 0">A blank website, or a copy of a Git repo</p></div></button>
    </div>
    <div class="home-cols">
      ${card('Recent activity', 'Across your teams', `<div class="activity">${[['S', '', 'Samuel committed <b>Design preview: add ZTD blue</b> in Studio', '15 min'], ['T', ' gold', 'Tom started a chat in <b>Pipeline</b>: Make the board easier to use on a phone', '22 min'], ['A', ' green', 'Ada restarted <b>Board</b> in Pipeline', '3 h'], ['S', '', 'Samuel updated Studio to <code class="mono">d61fcfc</code>', '1 d']].map(([a, c, t, w]) => `<div><span class="avatar sm${c}">${a}</span><span>${t}</span><time>${w} ago</time></div>`).join('')}</div>`)}
      ${card('Needs a look', '', `<div class="list">
        <div>${ico('alert')}<span class="small"><b>Map board</b> keeps crashing<br><a href="#/p/pipeline/services">See its logs</a></span></div>
        <div>${ico('lock')}<span class="small"><b>Tom Reid</b> hasn’t set up two-step sign-in<br><a href="#/teams">Teams and people</a></span></div>
        <div>${ico('download')}<span class="small"><b>2 commits</b> ready to install in Studio<br><a href="#/admin">Update Studio</a></span></div></div>`)}
    </div>
  </div></div>`, 'Projects'),

  'home-empty': () => shell({ page: 'home' }, `<div class="page"><div class="page-inner narrow" style="text-align:center;padding-top:10vh">
    ${logo(56)}<h1 class="hello" style="margin:18px 0 8px">Welcome, Jo</h1>
    <p class="muted" style="max-width:46ch;margin:0 auto 22px">There are no projects yet. Start one from a blank website or a copy of a Git repo, and Claude can build it with you.</p>
    <div class="row" style="justify-content:center"><button class="btn primary" type="button" data-modal="newProject">${ico('plus')} New project</button><a class="btn" href="#/teams">${ico('users')} Invite your team</a></div>
  </div></div>`, 'Welcome'),

  account: () => shell({ page: 'account' }, `<div class="page"><div class="page-inner">
    <div class="page-head"><div><h1>Account</h1><p>Your profile, your Claude connection and how you sign in.</p></div></div>
    <div class="settings-layout">
      <nav class="subnav"><a class="on" href="#">${ico('user')} Profile</a><a href="#claude">${ico('sparkle')} Claude</a><a href="#">${ico('lock')} Password</a><a href="#">${ico('shield')} Two-step sign-in</a><a href="#">${ico('laptop')} Devices</a></nav>
      <div class="stack" style="gap:20px">
        <section class="card profile"><span class="avatar lg">S</span><div><h2>Samuel</h2><div class="muted">samuel@ztddevs.com</div><div class="row tight" style="margin-top:8px"><span class="pill navy">${ico('shield')} Studio admin</span><span class="pill soft">ZTD Devs · Owner</span><span class="pill soft">Nurseries · Admin</span></div></div></section>
        ${card('Claude', 'Your prompts run on your own Claude account.', `<div class="card-body"><div class="conn"><span class="conn-logo">${ico('sparkle')}</span><div style="flex:1"><b>Connected to your Claude subscription</b><div class="small muted">samuel@ztddevs.com · since 6 Sept 2026 · prompts count towards your Claude.ai plan’s usage limits</div></div><span class="pill ok">${ico('check')} Connected</span></div></div>`,
          { id: 'claude', foot: `<span class="tiny muted" style="flex:1 1 260px">Projects that lend your connection to their AI workers pick it up when their services restart.</span><a class="btn" href="#/account-connect">Reconnect</a><button class="btn danger" type="button" data-modal="disconnect">Disconnect</button>` })}
        ${card('Profile', '', `<div class="form-rows"><div><div class="lbl"><b>Name</b><small>Shown to your team.</small></div><input class="input" value="Samuel"></div></div>`, { foot: '<span class="spacer"></span><button class="btn primary" type="button" data-toast="Saved">Save name</button>' })}
        ${card('Password', '', `<div class="form-rows"><div><div class="lbl"><b>Current password</b></div><input class="input" type="password"></div><div><div class="lbl"><b>New password</b><small>At least 12 characters. A short sentence works well.</small></div><input class="input" type="password"></div>
          <div><div class="lbl"></div><label class="check"><input type="checkbox" checked> Sign out my other devices</label></div></div>`, { foot: '<span class="spacer"></span><button class="btn primary" type="button" data-toast="Password changed">Change password</button>' })}
        ${card('Two-step sign-in', 'Studio requires it for every account.', `<div class="card-body"><div class="conn"><span class="svc-icon">${ico('shield')}</span><div style="flex:1"><b>On, with an authenticator app</b><div class="small muted">Lost your backup codes? Make new ones; the old ones stop working.</div></div><button class="btn" type="button" data-modal="backupCodes">${ico('key')} New backup codes</button></div></div>`, { right: `<span class="pill ok">${ico('check')} On</span>` })}
        ${card('Devices', 'Where you’re signed in.', `<div class="devices">
          <div><span class="dev-ico">${ico('laptop')}</span><div style="flex:1"><b>Chrome on Mac</b> <span class="pill navy" style="margin-left:6px">This device</span><div class="small muted">81.2.69.142 · active now</div></div></div>
          <div><span class="dev-ico">${ico('phone')}</span><div style="flex:1"><b>Safari on iPhone</b><div class="small muted">86.12.4.9 · 5 h ago</div></div><button class="btn sm" type="button" data-toast="Signed out on Safari on iPhone">Sign out</button></div></div>`)}
      </div>
    </div></div></div>`, 'Account'),

  'account-connect': () => shell({ page: 'account' }, `<div class="page"><div class="page-inner narrow">
    <div class="page-head"><div><h1>Connect Claude</h1><p>So the prompts you send in Studio run as you.</p></div></div>
    ${card('Use your Claude subscription', 'Claude Code’s own sign-in. Studio stores the token encrypted and only uses it for your prompts.', `<div class="card-body"><ol class="steps-num">
      <li><div><b>Approve access on claude.ai</b><div class="small muted" style="margin:2px 0 8px">Sign in with the Claude account you want Studio to use.</div><a class="btn primary sm" href="#">Open claude.ai ${ico('external')}</a></div></li>
      <li><div><b>Copy the code claude.ai shows</b></div></li>
      <li><div><b>Paste it here</b><div class="row" style="margin-top:8px"><input class="input mono" style="flex:1" placeholder="Paste the code from claude.ai"><button class="btn primary" type="button" onclick="location.hash='#/account'">Connect</button></div></div></li></ol></div>`,
      { foot: '<span class="small muted">No subscription?</span><button class="btn sm" type="button" data-modal="apiKey">Use an API key instead</button><span class="spacer"></span><a class="btn ghost sm" href="#/account">Cancel</a>' })}
  </div></div>`, 'Connect Claude'),

  teams: () => {
    const roleSel = (r, dis = '') => `<select class="select" style="width:auto;min-height:32px;padding:4px 28px 4px 10px"${dis}>${['Member', 'Admin', 'Owner'].map(o => `<option${o === r ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    const team = (name, you, projects, members, invites) => `<section class="card"><div class="card-head"><div><h3>${name}</h3><p>Projects: ${projects}</p></div><span class="spacer"></span><span class="pill navy">You: ${you}</span></div>
      <table class="table"><thead><tr><th>Person</th><th>Role</th><th>Two-step</th><th></th></tr></thead><tbody>
      ${members.map(([n, e, r, tf, me, c]) => `<tr><td>${person(n + (me ? ' (you)' : ''), e, c)}</td><td>${roleSel(r, me ? ' disabled' : '')}</td><td>${tf ? `<span class="pill ok">${ico('check')} On</span>` : `<span class="pill warn">${ico('alert')} Not set up</span>`}</td><td style="text-align:right">${me ? '' : `<button class="btn ghost sm" type="button" data-modal="removeMember">Remove</button>`}</td></tr>`).join('')}
      </tbody></table>
      ${invites.length ? `<div class="card-body" style="border-top:1px solid var(--line)"><div class="small muted" style="font-weight:600;margin-bottom:8px">Waiting to join</div>${invites.map(([e, r, x]) => `<div class="row"><span class="avatar sm" style="background:var(--sunken);color:var(--faint)">${ico('mail')}</span><span><b>${e}</b> <span class="small muted">· ${r} · expires ${x}</span></span><span class="spacer"></span><button class="btn sm" type="button" data-toast="Invite link copied">${ico('link')} Copy invite link</button><button class="btn ghost sm" type="button">Cancel</button></div>`).join('')}</div>` : ''}
      <div class="card-foot"><input class="input" style="flex:1 1 240px" placeholder="name@example.com" type="email"><select class="select" style="width:auto"><option>Member</option><option>Admin</option></select><button class="btn primary" type="button" data-toast="Invitation emailed">Invite</button></div></section>`;
    return shell({ page: 'teams' }, `<div class="page"><div class="page-inner">
      <div class="page-head"><div><h1>Teams and people</h1><p>Everyone in a team can open its projects, chat with Claude in them and restart them. Owners and admins can also invite people and change settings.</p></div><span class="spacer"></span><button class="btn" type="button" data-modal="newTeam">${ico('plus')} New team</button></div>
      <div class="callout warn" style="margin-bottom:20px">${ico('mail')}<span>Email isn’t set up on this server, so invitations aren’t emailed. Copy each invite link and send it yourself. <a href="#/admin">Set up email</a></span></div>
      <div class="stack" style="gap:20px">
        ${team('ZTD Devs', 'Owner', '<a href="#/p/studio/chat">Studio</a>, <a href="#/p/pipeline/chat">Pipeline</a>, <a href="#/p/templates/chat">Design templates</a>', [['Samuel', 'samuel@ztddevs.com', 'Owner', 1, 1, ''], ['Ada Okafor', 'ada@ztddevs.com', 'Admin', 1, 0, ' gold'], ['Tom Reid', 'tom@ztddevs.com', 'Member', 0, 0, ' green']], [['jo@ztddevs.com', 'Member', '22 Oct']])}
        ${team('Nurseries', 'Admin', '<a href="#/p/dental/chat">Bright Smile Dental</a>', [['Samuel', 'samuel@ztddevs.com', 'Admin', 1, 1, ''], ['Priya Shah', 'priya@nurseries.example', 'Member', 1, 0, ' gold']], [])}
      </div></div></div>`, 'Teams and people');
  },

  admin: () => {
    const users = [['Samuel', 'samuel@ztddevs.com', 'ZTD Devs (Owner), Nurseries (Admin)', 1, 1, 'now', 'admin', ''], ['Ada Okafor', 'ada@ztddevs.com', 'ZTD Devs (Admin)', 1, 1, '3 h ago', '', ' gold'], ['Tom Reid', 'tom@ztddevs.com', 'ZTD Devs (Member)', 0, 0, '2 d ago', '', ' green'], ['Priya Shah', 'priya@nurseries.example', 'Nurseries (Member)', 1, 1, '20 d ago', 'suspended', ' gold']];
    const log = [['16 Oct, 09:12', 'Samuel', 'chat.prompt', 'studio-src · opus, edit'], ['16 Oct, 08:40', 'Ada Okafor', 'service.restart', 'pipeline/board'], ['16 Oct, 08:02', 'Samuel', 'studio.update', 'aa01c78'], ['15 Oct, 22:15', 'Ada Okafor', 'chat.off-topic', 'studio-src · A poem isn’t part of the Studio source project.'], ['15 Oct, 18:30', 'Samuel', 'git.commit', 'pipeline · Board: bigger tap targets'], ['15 Oct, 17:02', '—', 'auth/sign-in/email', '86.12.4.9']];
    return shell({ page: 'admin' }, `<div class="page"><div class="page-inner">
      <div class="page-head"><div><h1>Admin</h1><p>Studio-wide settings. Only Studio admins see this page.</p></div></div>
      <div class="settings-layout">
        <nav class="subnav"><a class="on" href="#">${ico('download')} Studio version</a><a href="#">${ico('mail')} Email</a><a href="#">${ico('eye')} Project focus</a><a href="#">${ico('github')} GitHub backup</a><a href="#">${ico('users')} People</a><a href="#">${ico('activity')} Activity log</a></nav>
        <div class="stack" style="gap:20px">
          ${card('Studio version', 'Installs the latest commit of the Studio source project, then restarts.', `<div class="card-body stack">
            <div class="row"><span class="pill soft">Running</span><code class="mono small">d61fcfc</code><span>Studio: hovering a chat shows its full first prompt</span><span class="faint small">· installed 2 d ago</span></div>
            <div class="callout info">${ico('download')}<div><b>2 new commits to install.</b> Check these are changes you expect, because the update runs the install script as root.
              <ul style="margin:6px 0 0;padding-left:18px" class="small"><li><code class="mono">fb17c87</code> Design preview: add Paper in the ztddevs.com navy and gold</li><li><code class="mono">2383c6d</code> Design preview: five style options for Studio’s new look</li></ul></div></div>
            <div class="callout warn">${ico('alert')}<span>1 uncommitted change won’t be installed: <code class="mono small">design-preview/ztd/app.css</code>. Commit it in Studio’s Changes tab first.</span></div>
            <div class="update-log"><div>2026-10-16T08:02:01 studio-update started</div><div>Unpacking the latest commit…</div><div>npm ci --omit=dev · added 61 packages in 4s</div><div>Restarting studio.service</div><div class="ok">studio-update finished: 0</div></div></div>`,
            { foot: '<span class="spacer"></span><button class="btn primary" type="button" data-modal="update">Update and restart Studio</button>' })}
          ${card('Email', 'For password reset links and invitations.', `<div class="card-body stack"><div class="callout ok">${ico('check')}<span>Sending through smtp.gmail.com as studio@ztddevs.com.</span></div>
            <div class="grid2"><label class="field"><span>Mail server</span><input class="input" value="smtp.gmail.com"></label><label class="field"><span>Port</span><input class="input" value="465"></label>
            <label class="field"><span>User name</span><input class="input" value="studio@ztddevs.com"></label><label class="field"><span>Password <em>saved; leave empty to keep it</em></span><input class="input" type="password" placeholder="••••••••••••••••"></label></div>
            <label class="check"><input type="checkbox" checked> Secure connection (TLS), on for port 465</label>
            <p class="small muted" style="margin:0">For Gmail, create an app password at <a href="#">myaccount.google.com/apppasswords</a>. It’s stored encrypted and never shown again.</p></div>`,
            { foot: '<button class="btn danger" type="button">Remove</button><span class="spacer"></span><button class="btn" type="button" data-toast="Test email sent to samuel@ztddevs.com">Send a test email</button><button class="btn primary" type="button" data-toast="Email settings saved">Check and save</button>' })}
          ${card('Project focus', '', `<div class="card-body"><div class="toggle-row"><button class="switch on" type="button" aria-label="Flag off-topic prompts"></button><div><b>Flag prompts that don’t fit their project</b><small style="display:block;margin-top:2px">Each prompt is compared with its project’s description by a quick check with Haiku. Prompts that don’t fit still run, and are marked in the chat and in the Activity log.</small></div></div></div>`)}
          ${card('GitHub backup', 'Every project’s committed code, pushed every hour, a branch per project.', `<div class="card-body stack">
            <div class="row"><span class="svc-icon">${ico('github')}</span><div style="flex:1"><b><a href="#">ztd-devs/ztd-projects</a></b><div class="small muted">Branches projects/&lt;name&gt; · only committed changes</div></div><span class="pill ok">${ico('check')} Backed up 4 projects · 38 min ago</span></div>
            <div><div class="small" style="margin-bottom:6px">Deploy key. On GitHub: <a href="#">Settings → Deploy keys → Add deploy key</a>, tick <b>Allow write access</b>.</div><div class="keybox">ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPreviewOnlyNotARealKey studio-backup</div></div></div>`,
            { foot: '<button class="btn" type="button" data-toast="Key copied">' + ico('copy') + ' Copy key</button><button class="btn ghost" type="button">Use a different repo</button><span class="spacer"></span><button class="btn ghost danger" type="button">Turn off</button><button class="btn primary" type="button" data-toast="Backing up now…">Back up now</button>' })}
          ${card('People', 'To add someone, invite them to a team.', `<table class="table"><thead><tr><th>Person</th><th>Teams</th><th>Security</th><th>Last seen</th><th></th></tr></thead><tbody>
            ${users.map(([n, e, t, tf, cl, seen, tag, c]) => `<tr><td>${person(n, e, c)}${tag ? `<span class="pill ${tag === 'admin' ? 'navy' : 'bad'}" style="margin:4px 0 0 42px">${tag}</span>` : ''}</td><td class="small">${t}</td>
              <td class="small">${tf ? '<span class="dot ok"></span> Two-step on' : '<span class="dot warn"></span> No two-step'}<br><span class="muted">${cl ? 'Claude connected' : 'No Claude'}</span></td><td class="small muted">${seen}</td>
              <td style="text-align:right">${tag === 'admin' ? '<span class="small muted">you</span>' : `<button class="btn ghost icon sm" type="button" data-menu="person">${ico('more')}</button>`}</td></tr>`).join('')}</tbody></table>`)}
          ${card('Activity log', 'Sign-ins, prompts, restarts and admin changes.', `<table class="table"><thead><tr><th>When</th><th>Who</th><th>What</th><th>Detail</th></tr></thead><tbody>
            ${log.map(([w, who, a, d]) => `<tr><td class="small muted" style="white-space:nowrap">${w}</td><td class="small">${who}</td><td><span class="pill ${a.includes('off-topic') ? 'warn' : 'soft'} mono" style="font-size:11.5px">${a}</span></td><td class="small">${d}</td></tr>`).join('')}</tbody></table>`,
            { right: '<input class="input" style="width:200px;min-height:34px" placeholder="Filter…">', foot: '<span class="spacer"></span><button class="btn sm" type="button">Older</button>' })}
        </div>
      </div></div></div>`, 'Admin');
  },
};
