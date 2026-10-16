// Made-up data for the design preview: enough to fill every Studio page. seed() returns a fresh copy.
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const REPO = join(import.meta.dirname, '..');
const min = 60000, hr = 60 * min, day = 24 * hr;
export const DOMAIN = 'ztddevs.com';

const git = args => { try { return execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8', timeout: 5000 }); } catch { return ''; } };
// Studio's own project shows this repo's real history and files.
export const realLog = () => git(['log', '-n', '40', '--date=iso-strict', '--pretty=format:%H%x1f%an%x1f%ad%x1f%s']).split('\n').filter(Boolean)
  .map(l => { const [hash, author, date, subject] = l.split('\x1f'); return { hash, author, date, subject }; });
export const realFiles = () => git(['ls-files']).split('\n').filter(Boolean);

export function seed(){
  const t = Date.now();
  const users = [
    { id: 'u1', name: 'Samuel', email: 'samuel@ztddevs.com', role: 'admin', twoFactorEnabled: true, banned: false, createdAt: t - 200 * day, lastSeen: t - 2 * min, claude: true },
    { id: 'u2', name: 'Ada Okafor', email: 'ada@ztddevs.com', role: 'user', twoFactorEnabled: true, banned: false, createdAt: t - 120 * day, lastSeen: t - 3 * hr, claude: true },
    { id: 'u3', name: 'Tom Reid', email: 'tom@ztddevs.com', role: 'user', twoFactorEnabled: false, banned: false, createdAt: t - 9 * day, lastSeen: t - 2 * day, claude: false },
    { id: 'u4', name: 'Priya Shah', email: 'priya@nurseries.example', role: 'user', twoFactorEnabled: true, banned: true, createdAt: t - 60 * day, lastSeen: t - 20 * day, claude: true },
  ];
  const teams = [
    { organizationId: 'o1', name: 'ZTD Devs', slug: 'ztd-devs', members: [['u1', 'owner'], ['u2', 'admin'], ['u3', 'member']],
      invites: [{ id: 'inv1', email: 'jo@ztddevs.com', role: 'member', status: 'pending', expiresAt: t + 6 * day }] },
    { organizationId: 'o2', name: 'Nurseries', slug: 'nurseries', members: [['u1', 'admin'], ['u4', 'member']], invites: [] },
  ];
  const svc = (id, name, label, sub, state, extra = {}) => ({ id, name, label, command: 'node server.mjs', port: 4400 + Number(id.replace(/\D/g, '')), subdomain: sub,
    memoryMB: 800, autostart: 1, publicAccess: 0, certStatus: 'ok', envKeys: [], state, since: t - 26 * hr, mem: 74, restarts: 0, ...extra });
  const projects = [
    { id: 'p1', slug: 'studio-src', name: 'Studio', organizationId: 'o1', description: 'ZTD Studio source. Commit here, then Admin → Update and restart Studio.', status: 'ready', workerClaudeUserId: null,
      services: [svc('s1', 'preview', 'Design preview', 'studio-new', 'running', { command: 'node design-preview/server.mjs', mem: 41 })] },
    { id: 'p2', slug: 'pipeline', name: 'Pipeline', organizationId: 'o1', description: 'Board, map board and nurseries for the pipeline team.', status: 'ready', workerClaudeUserId: 'u1',
      services: [svc('s2', 'board', 'Board', 'pipeline', 'running', { mem: 223, envKeys: ['DATABASE_URL', 'MAPS_KEY'], restarts: 2 }),
        svc('s3', 'mapboard', 'Map board', 'mapboard', 'crashed', { restarts: 5, mem: null }),
        svc('s4', 'nurseries', 'Nurseries sync', null, 'running', { command: 'node jobs/nurseries.mjs', mem: 82 })] },
    { id: 'p3', slug: 'smile-dental', name: 'Bright Smile Dental', organizationId: 'o2', description: 'Landing page and contact form for a local dental practice.', status: 'ready', workerClaudeUserId: null,
      services: [svc('s5', 'web', 'Website', 'smile-dental', 'starting', { certStatus: 'pending', publicAccess: 1, mem: 30 })] },
    { id: 'p4', slug: 'templates', name: 'Design templates', organizationId: 'o1', description: 'Shared starting points for client sites.', status: 'ready', workerClaudeUserId: null,
      services: [svc('s6', 'web', 'Website', 'templates', 'stopped', { certStatus: 'failed', autostart: 0, mem: null })] },
  ];

  const ev = (type, o = {}) => ({ type, ...o });
  const me = { userId: 'u1', userName: 'Samuel', model: 'opus', mode: 'edit' };
  const ada = { userId: 'u2', userName: 'Ada Okafor', model: 'opus', mode: 'edit' };
  const chats = [
    { id: 'c1', projectId: 'p1', userId: 'u1', title: 'When I hover over the chat title on the sidebar, I want to see the full prompt text', model: 'opus', mode: 'edit', updatedAt: t - 4 * min, events: [
      ev('user', { ...me, text: 'When I hover over the chat title on the sidebar, I want to see the full prompt text that was ellipsis-shortened.' }),
      ev('thinking', { text: 'The title is cut to 70 characters when it is saved, so a tooltip from the title alone would still be cut. The full prompt is the first user event in chat_event.' }),
      ev('tool', { id: 't1', name: 'Grep', input: { pattern: 'chat.title', path: '/srv/projects/studio-src/repo/public' } }),
      ev('tool_result', { id: 't1', text: 'public/project.js:108\npublic/project.js:113' }),
      ev('tool', { id: 't2', name: 'Read', input: { file_path: '/srv/projects/studio-src/repo/lib/agent.mjs' } }),
      ev('tool_result', { id: 't2', text: '212 lines' }),
      ev('text', { text: 'The sidebar title is **cut to 70 characters** when it’s saved (`lib/agent.mjs:81`), so I’ll read the full prompt from the chat’s first message instead.\n\n1. `listChats` also returns `prompt`, capped at 2000 characters\n2. Each sidebar row uses it as its hover text\n\n```js\nh(\'a\', { class: \'nav-item\', title: c.prompt || c.title, … })\n```' }),
      ev('tool', { id: 't3', name: 'Edit', input: { file_path: '/srv/projects/studio-src/repo/public/project.js', old_string: "href: `/p/${id}/chat/${c.id}`, 'data-link': ''", new_string: "href: `/p/${id}/chat/${c.id}`, title: c.prompt || c.title, 'data-link': ''" } }),
      ev('tool_result', { id: 't3', text: 'The file has been updated.' }),
      ev('tool', { id: 't4', name: 'Bash', input: { command: 'npm test', description: 'Run the browser test suite' } }),
      ev('tool_result', { id: 't4', text: 'ok   32. a chat can be archived, unarchived and deleted\nok   33. delete project needs the short name\n\n0 failed of 33' }),
      ev('text', { text: 'Done. Hovering a chat in the sidebar now shows its full first prompt.\n\n| Check | Result |\n|---|---|\n| `npm test` | 33 of 33 passed |\n| Committed | `d61fcfc` |\n\n> Run **Admin → Update** to make it live.' }),
      ev('result', { ok: true, durationMs: 94000, turns: 12, costUsd: 0.84 }),
    ] },
    { id: 'c2', projectId: 'p1', userId: 'u1', title: 'Give Studio a modern and fresh design style', model: 'opus', mode: 'plan', updatedAt: t - 50 * min, events: [
      ev('user', { ...me, mode: 'plan', text: 'Here are two screenshots of sites I like. Give Studio a modern and fresh design style.', attachments: [
        { id: 'up1', name: 'homepage-mockup.png', kind: 'image', size: 284000 }, { id: 'up2', name: 'brand-guide.pdf', kind: 'pdf', size: 1830000 }] }),
      ev('tool', { id: 't5', name: 'WebSearch', input: { query: 'web app UI design trends 2026 developer tools' } }),
      ev('tool_result', { id: 't5', text: '9 results' }),
      ev('tool', { id: 't6', name: 'TodoWrite', input: { todos: [{ content: 'Research current styles', status: 'completed' }, { content: 'Build five options', status: 'completed' }, { content: 'Add ZTD blue', status: 'in_progress' }] } }),
      ev('tool_result', { id: 't6', text: 'ok' }),
      ev('notice', { text: 'Claude is rate limited or at its usage limit. Retrying…' }),
      ev('text', { text: 'Five directions, all in one preview: **Graphite**, **Paper**, **Aurora**, **Terminal** and **Calm**. See https://studio-new.ztddevs.com.' }),
      ev('result', { ok: true, durationMs: 312000, turns: 31, costUsd: 2.71 }),
    ] },
    { id: 'c3', projectId: 'p1', userId: 'u2', title: 'GitHub backup pushes each project to its own branch', model: 'sonnet', mode: 'edit', updatedAt: t - 5 * hr, events: [
      ev('user', { ...ada, text: 'Make the GitHub backup push every project to its own branch, projects/<name>.' }),
      ev('tool', { id: 't7', name: 'Bash', input: { command: 'bash ops/github-backup.sh --dry-run', description: 'Try the backup without pushing' } }),
      ev('tool_result', { id: 't7', isError: true, text: 'fatal: could not read from remote repository.' }),
      ev('text', { text: 'The deploy key isn’t on the repo yet, so the dry run can’t reach GitHub. I’ve changed the script anyway; add the key in **Admin → GitHub backup** and press *Back up now*.' }),
      ev('result', { ok: true, durationMs: 41000, turns: 6, costUsd: 0.19 }),
    ] },
    { id: 'c4', projectId: 'p1', userId: 'u2', title: 'Write me a poem about Mondays', model: 'haiku', mode: 'edit', updatedAt: t - 2 * day, events: [
      ev('user', { ...ada, model: 'haiku', text: 'Write me a poem about Mondays' }),
      ev('flag', { text: 'A poem isn’t part of the Studio source project.', userId: 'u2', userName: 'Ada Okafor' }),
      ev('text', { text: 'Mondays arrive like a build that won’t start…' }),
      ev('error', { text: 'Claude couldn’t sign in with your connection. Reconnect Claude on your Account page, then send the prompt again.' }),
      ev('result', { ok: false, durationMs: 8000, turns: 1 }),
    ] },
    { id: 'c5', projectId: 'p1', userId: 'u1', title: 'Clearer heading on the archive dialog', model: 'opus', mode: 'edit', updatedAt: t - 9 * day, archivedAt: t - 8 * day, events: [
      ev('user', { ...me, text: 'Give the chat archive/delete dialog a clearer heading.' }),
      ev('text', { text: 'Changed it to “Archive or delete chat”.' }), ev('result', { ok: true, durationMs: 22000, turns: 3, costUsd: 0.07 }),
    ] },
    { id: 'c6', projectId: 'p2', userId: 'u3', title: 'Make the board easier to use on a phone', model: 'opus', mode: 'edit', updatedAt: t - 1 * min, running: true, events: [
      ev('user', { userId: 'u3', userName: 'Tom Reid', model: 'opus', mode: 'edit', text: 'Make the board easier to use on a phone' }),
      ev('tool', { id: 't8', name: 'Read', input: { file_path: '/srv/projects/pipeline/repo/public/board.css' } }),
      ev('tool_result', { id: 't8', text: '410 lines' }),
    ] },
    { id: 'c7', projectId: 'p3', userId: 'u1', title: 'Build a landing page for the practice', model: 'opus', mode: 'edit', updatedAt: t - 3 * day, events: [
      ev('user', { ...me, text: 'Build a simple landing page for a local dental practice, with opening hours and a contact form.' }),
      ev('text', { text: 'The page is up at https://smile-dental.ztddevs.com, with hours, a map and a contact form that emails the practice.' }),
      ev('result', { ok: true, durationMs: 188000, turns: 22, costUsd: 1.32 }),
    ] },
  ];
  // PREVIEW_BIG_CHAT=1: a very long chat (like a whole day's session), for checking the chat page stays fast.
  if (process.env.PREVIEW_BIG_CHAT){
    const events = [];
    for (let r = 0; r < 150; r++){
      events.push(ev('user', { ...me, text: `Round ${r}: please change something in the sidebar and check it` }), ev('thinking', { text: 'Look first.' }), ev('text', { text: `Looking at round ${r}. Here is **some** markdown with \`code\` and a list:\n\n- one\n- two` }));
      for (let k = 0; k < 6; k++) events.push(ev('tool', { id: `b${r}-${k}`, name: ['Read', 'Edit', 'Bash', 'Grep', 'Write', 'Bash'][k], input: { file_path: '/srv/projects/studio-src/repo/public/app.js', command: 'npm test', pattern: 'nav-item' } }), ev('tool_result', { id: `b${r}-${k}`, text: 'ok\n'.repeat(20) }));
      events.push(ev('text', { text: `Done with round ${r}.` }), ev('result', { ok: true, durationMs: 17000, turns: 7, costUsd: 0.13 }));
    }
    chats.push({ id: 'big', projectId: 'p1', userId: 'u1', title: 'A very long chat', model: 'opus', mode: 'edit', updatedAt: t, events });
  }
  for (const c of chats){ c.createdAt = c.updatedAt - hr; c.archivedAt ??= null; c.running ??= false; c.events.forEach((e, i) => { if (e.type === 'tool_result') e.isError = !!e.isError; e.seq = i; e.at = c.updatedAt - (c.events.length - i) * 20000; }); }

  const gitState = {
    p1: { files: [{ code: ' M', path: 'public/app.css' }, { code: '??', path: 'public/fonts/dm-sans.woff2' }, { code: ' M', path: 'public/icon.svg' }], log: null },
    p2: { files: [{ code: ' M', path: 'public/board.css' }], log: [
      { hash: 'a1b2c3d4e5', author: 'Tom Reid', date: new Date(t - 3 * hr).toISOString(), subject: 'Board: bigger tap targets on cards' },
      { hash: 'b2c3d4e5f6', author: 'Ada Okafor', date: new Date(t - 2 * day).toISOString(), subject: 'Map board: cluster nearby nurseries' }] },
    p3: { files: [], log: [{ hash: 'c3d4e5f6a7', author: 'Samuel', date: new Date(t - 3 * day).toISOString(), subject: 'Landing page, hours and contact form' }] },
    p4: { files: [], log: [] },
  };
  const audit = [];
  const actions = [['u1', 'chat.prompt', 'studio-src', '{"model":"opus","mode":"edit"}'], ['u2', 'service.restart', 'pipeline/board', ''], ['u1', 'studio.update', 'aa01c78', ''],
    [null, 'auth/sign-in/email', '', ''], ['u2', 'chat.off-topic', 'studio-src', 'A poem isn’t part of the Studio source project.'], ['u1', 'git.commit', 'pipeline', 'Board: bigger tap targets'],
    ['u1', 'admin.github-backup', 'git@github.com:ztd-devs/ztd-projects.git', ''], ['u3', 'chat.prompt', 'pipeline', '{"model":"opus","mode":"edit"}']];
  for (let i = 0; i < 60; i++){ const [u, action, target, detail] = actions[i % actions.length]; audit.push({ id: 60 - i, at: t - i * 47 * min, userId: u, userName: users.find(x => x.id === u)?.name || null, action, target, detail, ip: `81.2.${69 + (i % 5)}.${140 + i}` }); }

  return {
    users, teams, projects, chats, gitState, audit,
    claude: { connected: true, kind: 'subscription', hint: 'samuel@ztddevs.com', createdAt: t - 40 * day },
    settings: { scopeCheck: true },
    mail: { source: 'studio', host: 'smtp.gmail.com', port: 465, secure: true, user: 'studio@ztddevs.com', from: '', hasPassword: true },
    backup: { url: 'git@github.com:ztd-devs/ztd-projects.git', publicKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPreviewOnlyNotARealKeyZtdStudioBackup0000 studio-backup', running: false, last: { ok: true, message: 'Backed up 4 projects', at: new Date(t - 38 * min).toISOString() } },
    sessions: [{ id: 'sess1', token: 'tok1', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 Chrome/130.0 Safari/537.36', ipAddress: '81.2.69.142', updatedAt: t - min },
      { id: 'sess2', token: 'tok2', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1', ipAddress: '86.12.4.9', updatedAt: t - 5 * hr }],
    uploads: { up1: { id: 'up1', name: 'homepage-mockup.png', kind: 'image', size: 284000 }, up2: { id: 'up2', name: 'brand-guide.pdf', kind: 'pdf', size: 1830000 } },
    studio: { installedAt: new Date(t - 2 * day).toISOString(), updated: false, updateStarted: 0 },
  };
}
