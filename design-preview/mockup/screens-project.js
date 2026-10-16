// Project pages: chat (several states), services, changes, files and settings.
import { ico, logo, shell, projectHead, project, DOMAIN } from './kit.js';

const toolIcon = { Read: 'eye', Edit: 'edit', Bash: 'terminal', Grep: 'search', Write: 'file', WebSearch: 'globe', TodoWrite: 'list' };
const step = (name, desc, st = 'ok', detail = '') => `<details class="step"><summary><span class="tool-ico">${ico(toolIcon[name] || 'bolt')}</span><span class="tname">${name}</span><span class="tdesc">${desc}</span>
  <span class="st ${st}">${st === 'ok' ? ico('check') : st === 'err' ? ico('alert') + ' error' : '<span class="dot busy"></span>'}</span></summary>${detail ? `<pre>${detail}</pre>` : ''}</details>`;
const steps = (n, inner, open = false) => `<details class="steps"${open ? ' open' : ''}><summary>${ico('chev', 'chev')} ${n} steps <span class="faint">· ${[...new Set([...inner.matchAll(/class="tname">(\w+)/g)].map(m => m[1]))].join(', ')}</span><span class="spacer"></span><span class="faint tiny">show</span></summary>${inner}</details>`;
const user = (text, who = '') => `<div class="msg-user">${who ? `<div class="who"><span class="avatar sm gold">${who[0]}</span>${who}</div>` : ''}<div class="bubble">${text}</div></div>`;
const ai = body => `<div class="ai"><div class="ai-head">${logo(20)} Claude <span>· Opus · Edit</span></div><div class="md">${body}</div></div>`;
const result = (time, n, cost) => `<div class="result"><span>${ico('clock')} ${time}</span><span>${ico('bolt')} ${n} steps</span><span>$${cost} if billed by usage</span></div>`;

function composer(p, { running = false, extra = '', files = false } = {}){
  return `<div class="composer-wrap"><div class="composer-col">
    ${extra}
    <form class="composer" onsubmit="event.preventDefault()">
      ${files ? `<div class="attachments"><span class="chip"><span class="shot" style="width:30px;height:30px;border-radius:7px"></span><span>wireframe.png<small>284 KB</small></span><button class="x" type="button">${ico('x')}</button></span>
        <span class="chip"><span class="fi">PDF</span><span>brand-guide.pdf<small>Uploading…</small></span><button class="x" type="button">${ico('x')}</button></span></div>` : ''}
      <textarea rows="2" placeholder="Tell Claude what to build or change in ${p.name}…" data-send></textarea>
      <div class="composer-bar">
        <button class="btn ghost icon sm" type="button" title="Attach files">${ico('clip')}</button>
        <button class="model" type="button" data-menu="models">${ico('sparkle')} Opus ${ico('chevdown')}</button>
        <span class="seg"><button class="on" type="button" title="Claude edits files and runs commands">${ico('edit')} Edit</button><button type="button" title="Claude reads and plans, changes nothing">${ico('eye')} Plan only</button></span>
        <span class="spacer"></span>
        <button class="btn ghost icon sm" type="button" title="Speak your prompt">${ico('mic')}</button>
        <button class="send${running ? ' stop' : ''}" type="button" aria-label="${running ? 'Stop' : 'Send'}" data-send-btn>${running ? ico('stop') : ico('up')}</button>
      </div>
    </form>
    <div class="hint-line">Enter to send · Shift+Enter for a new line · Paste or drop files to attach · Claude works in this project’s folder on the server</div>
  </div></div>`;
}
const updateBanner = `<div class="banner update">${ico('download')}<span><b>2 new commits</b> ready to install <span class="muted">· 1 uncommitted file won’t be included</span></span><span class="spacer"></span>
  <button class="btn primary sm" type="button" data-modal="update">Update and restart Studio</button></div>`;
const chatPage = (p, at, thread, opts = {}) => shell({ project: p.id, chat: at }, `${projectHead(p, 'chat')}
  <div class="chat"><div class="thread"><div class="thread-inner">${thread}</div></div>${composer(p, opts)}</div>`, p.name, opts.sub || 'Chat');

export const projectScreens = {
  chat: () => {
    const p = project('studio');
    return chatPage(p, 'hover', `
      <div class="daybreak">Today</div>
      ${user('When I hover over the chat title on the sidebar, I want to see the full prompt text that was ellipsis-shortened.')}
      <div class="thinking">${ico('sparkle')} Thought for 4 seconds</div>
      ${ai(`<p>The sidebar title is <strong>cut to 70 characters</strong> when it’s saved (<code>lib/agent.mjs:81</code>), so I’ll read the full prompt from the chat’s first message instead.</p>`)}
      ${steps(4, step('Grep', 'chat.title in public', 'ok', 'public/project.js:108\npublic/project.js:113') + step('Read', 'lib/agent.mjs') +
        step('Edit', 'public/project.js', 'ok', '<span class="diffline del">- href: `/p/${id}/chat/${c.id}`, \'data-link\': \'\'</span><span class="diffline add">+ href: `/p/${id}/chat/${c.id}`, title: c.prompt || c.title, \'data-link\': \'\'</span>') +
        step('Bash', 'Run the browser test suite', 'ok', '$ npm test\nok   32. a chat can be archived, unarchived and deleted\nok   33. delete project needs the short name\n\n0 failed of 33'), true)}
      ${ai(`<p>Done. Hovering a chat in the sidebar now shows its full first prompt.</p>
        <ol><li><code>listChats</code> also returns <code>prompt</code>, capped at 2000 characters</li><li>each sidebar row uses it as its hover text</li></ol>
        <div class="codeblock"><header>public/project.js<span class="spacer"></span><button class="btn ghost sm" type="button" data-toast="Copied">${ico('copy')} Copy</button></header><pre><span class="k">h</span>(<span class="s">'a'</span>, { class: <span class="s">'nav-item'</span>, title: c.prompt || c.title, … })</pre></div>
        <table><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody><tr><td><code>npm test</code></td><td>33 of 33 passed</td></tr><tr><td>Committed</td><td><code>d61fcfc</code></td></tr></tbody></table>
        <blockquote>Run <strong>Update and restart Studio</strong> to make it live.</blockquote>`)}
      ${result('1 min 34 s', 12, '0.84')}`, { extra: updateBanner, sub: 'Hovering a chat shows the full prompt' });
  },

  'chat-files': () => {
    const p = project('studio');
    return chatPage(p, 'files', `
      <div class="daybreak">Today</div>
      <div class="msg-user"><div class="files-sent"><span class="shot"></span><a class="chip" href="#"><span class="fi">PDF</span><span>brand-guide.pdf<small>1.8 MB</small></span></a></div>
        <div class="bubble">Here are two things I like. Give Studio a modern and fresh design style.</div><div class="who">Plan only · Opus</div></div>
      ${steps(3, step('WebSearch', 'web app UI design trends 2026 developer tools') + step('Read', 'wireframe.png') + step('TodoWrite', '✓ Research current styles · ✓ Build five options · Add ZTD blue'))}
      <div class="notice">${ico('clock')} Claude is rate limited. Retrying in 20 s…</div>
      ${ai(`<p>Here’s the plan. Nothing has changed yet, because this chat is in <strong>Plan only</strong>:</p><ul><li>five style directions in one preview page</li><li>light and dark versions of each</li><li>a picker to compare them</li></ul>`)}
      <div class="notice">${ico('stop')} Stopped by Samuel</div>`, { files: true, sub: 'Give Studio a modern, fresh design' });
  },

  'chat-flag': () => {
    const p = project('studio');
    return chatPage(p, 'flag', `
      <div class="daybreak">Tuesday</div>
      ${user('Write me a poem about Mondays', 'Ada Okafor')}
      <div class="flag">${ico('alert')}<div><b>Flagged as off-topic for this project.</b> A poem isn’t part of the Studio source project. Admins can see this in the Activity log.</div></div>
      ${ai('<p>Mondays arrive like a build that won’t start…</p>')}
      <div class="chat-error">${ico('alert')}<span>Claude couldn’t sign in with Ada’s connection. Reconnect Claude on the Account page, then send the prompt again.</span><a class="btn sm" href="#/account">Reconnect</a></div>`,
      { extra: `<div class="banner">${ico('archive')}<span>This chat is archived. Sending a message brings it back to the list.</span><span class="spacer"></span><button class="btn sm" type="button" data-toast="Chat restored">Unarchive</button></div>`, sub: 'Write me a poem about Mondays' });
  },

  'chat-working': () => {
    const p = project('pipeline');
    return chatPage(p, 'working', `
      ${user('Make the board easier to use on a phone', 'Tom Reid')}
      ${steps(3, step('Read', 'public/board.css') + step('Grep', 'touch-action in public') + step('Edit', 'public/board.css', 'run'), true)}
      ${ai('<p>The cards are 32 px tall on phones, below the 44 px a finger needs. I’m making them taller and putting the drag handle on the left edge, where thumbs reach…</p>')}
      <div class="working"><span class="dot busy"></span> Claude is working <span class="bar"></span> <span class="faint tiny">2 min</span></div>`,
      { running: true, extra: `<div class="banner">${ico('alert')}<span>Connect your Claude account before sending prompts.</span><span class="spacer"></span><a class="btn primary sm" href="#/account">Connect Claude</a></div>`, sub: 'Make the board easier to use on a phone' });
  },

  'new-chat': () => {
    const p = project('dental');
    const ideas = [['eye', 'Explain what this project does and how it is set up'], ['sparkle', 'Add a booking form with a date picker'], ['mail', 'Make the contact form email the practice'], ['shield', 'Check the site for accessibility problems and fix them']];
    return shell({ project: p.id }, `${projectHead(p, 'chat')}
      <div class="chat"><div class="thread"><div class="empty-chat">${logo(48)}
        <h2>What should we build?</h2>
        <p>Claude works directly in ${p.name}. It can read and change the code, run commands and restart the project’s services.</p>
        <div class="ideas">${ideas.map(([i, t]) => `<button class="idea" type="button" data-idea>${ico(i)}<span>${t}</span></button>`).join('')}</div>
      </div></div>${composer(p)}</div>`, p.name, 'New chat');
  },

  services: () => {
    const p = project('pipeline');
    const svc = ({ name, label, state, dot, icon = '', addr, cmd, port, up, mem, max, restarts, env, logs = false, actions }) => `<div class="card svc">
      <div class="svc-top"><span class="svc-icon ${icon}">${ico('server')}</span>
        <div><h3>${label} <span class="pill ${dot === 'ok' ? 'ok' : dot === 'bad' ? 'bad' : 'soft'}"><span class="dot ${dot}"></span>${state}</span></h3>
        <div class="addr">${addr}</div></div><span class="spacer"></span>${actions}</div>
      <div class="svc-meta">
        <div><small>Up for</small><b>${up}</b></div>
        <div><small>Memory</small><b>${mem ? `${mem} of ${max} MB` : '—'}</b>${mem ? `<div class="meter${mem / max > .7 ? ' hot' : ''}"><i style="width:${Math.round(mem / max * 100)}%"></i></div>` : ''}</div>
        <div><small>Restarts</small><b>${restarts}</b></div>
        <div><small>Settings</small><b>${env}</b></div>
      </div>
      <div class="cmd">${ico('terminal')}<span>$ <b>${cmd}</b></span><span class="spacer"></span><span>port ${port} · ${name}</span></div>
      ${logs ? `<div class="term-head"><span class="dot ok"></span> Live logs<span class="spacer"></span><button class="btn sm" type="button">${ico('download')} Download</button><button class="btn sm" type="button">${ico('x')} Close</button></div>
      <div class="terminal">${[['08:19:42', 'Listening on 4402'], ['08:19:49', 'GET / 200 4ms'], ['08:19:56', 'GET /api/board 200 23ms'], ['08:20:03', 'POST /api/cards 201 41ms'], ['08:20:10', 'WARN slow query: 812ms', 'w'], ['08:20:17', 'GET /api/board 200 19ms'], ['08:20:24', 'Error: ECONNRESET on map tiles', 'e'], ['08:20:31', 'GET /health 200 0ms'], ['08:20:38', 'GET /api/board 200 18ms'], ['08:20:45', 'POST /api/cards/91/move 200 12ms'], ['08:20:52', 'GET /api/board 200 21ms']].map(([t, l, c]) => `<div><span class="t">${t}</span><span class="${c || ''}">${l}</span></div>`).join('')}</div>` : ''}
    </div>`;
    return shell({ project: p.id }, `${projectHead(p, 'services')}<div class="page"><div class="page-inner">
      <div class="page-head"><div><h1>Services</h1><p>The programs this project runs. Restart one to load new code.</p></div><span class="spacer"></span>
        <button class="btn" type="button" data-modal="editServices">${ico('edit')} Edit services</button></div>
      ${svc({ name: 'board', label: 'Board', state: 'Running', dot: 'ok', addr: `<a href="#">https://pipeline.${DOMAIN}</a> <span class="pill navy">${ico('lock')} Team only</span>`, cmd: 'node server.mjs', port: 4402, up: '1 day 2 h', mem: 223, max: 800, restarts: '2 automatic', env: 'DATABASE_URL, MAPS_KEY', logs: true,
        actions: `<button class="btn sm" type="button" data-toast="Board restarted">${ico('restart')} Restart</button><button class="btn sm danger" type="button" data-toast="Board stopped">${ico('stop')} Stop</button><button class="btn sm" type="button">${ico('terminal')} Logs</button>` })}
      ${svc({ name: 'mapboard', label: 'Map board', state: 'Crashed', dot: 'bad', icon: 'bad', addr: `<a href="#">https://mapboard.${DOMAIN}</a> <span class="pill bad">${ico('alert')} Keeps crashing</span>`, cmd: 'node map.mjs', port: 4403, up: '—', restarts: '5 automatic', env: 'MAPS_KEY',
        actions: `<button class="btn sm primary" type="button" data-toast="Map board started">${ico('play')} Start</button><button class="btn sm" type="button">${ico('terminal')} Logs</button>` })}
      ${svc({ name: 'nurseries', label: 'Nurseries sync', state: 'Running', dot: 'ok', addr: `<span class="muted">No web address (internal only)</span>`, cmd: 'node jobs/nurseries.mjs', port: 4404, up: '1 day 2 h', mem: 610, max: 800, restarts: 'none', env: '—',
        actions: `<button class="btn sm" type="button">${ico('restart')} Restart</button><button class="btn sm danger" type="button">${ico('stop')} Stop</button><button class="btn sm" type="button">${ico('terminal')} Logs</button>` })}
      ${svc({ name: 'preview', label: 'Client preview', state: 'Stopped', dot: '', icon: 'off', addr: `<a href="#">https://pipeline-demo.${DOMAIN}</a> <span class="pill warn">${ico('alert')} HTTPS certificate failed</span> <button class="btn sm" type="button" data-toast="Certificate ready">Retry</button> <span class="pill">${ico('globe')} Public</span>`, cmd: 'npm start', port: 4405, up: '—', restarts: 'Manual start', env: '—',
        actions: `<button class="btn sm primary" type="button">${ico('play')} Start</button><button class="btn sm" type="button">${ico('terminal')} Logs</button>` })}
    </div></div>`, p.name, 'Services');
  },

  changes: () => {
    const p = project('studio');
    const files = [['m', 'public/', 'app.css', '+214', '−98'], ['a', 'public/fonts/', 'dm-sans.woff2', 'bin', ''], ['m', 'public/', 'icon.svg', '+1', '−1']];
    const rows = [['hunk', '', '', '@@ -8,11 +8,14 @@'], ['', 8, 8, '  --muted: #6b6860;'], ['del', 10, '', '-  --accent: #b9572f;'], ['del', 11, '', '-  --accent-hover: #a14a26;'], ['add', '', 10, '+  --accent: #00427c;          /* ZTD navy */'], ['add', '', 11, '+  --accent-hover: #003463;'], ['add', '', 12, '+  --gold: #ffc349;            /* ZTD gold */'], ['', 12, 13, '  --accent-text: #ffffff;'], ['hunk', '', '', '@@ -44,7 +47,7 @@'], ['', 44, 47, '* { box-sizing: border-box; }'], ['del', 46, '', '-body { font: 15px/1.55 var(--sans); }'], ['add', '', 49, '+body { font: 15px/1.55 "DM Sans", var(--sans); }'], ['', 47, 50, 'a { color: var(--accent); }']];
    return shell({ project: p.id }, `${projectHead(p, 'changes')}<div class="page"><div class="page-inner">
      <div class="page-head"><div><h1>Changes</h1><p>On <span class="pill navy">${ico('git')} main</span> Review what Claude changed, then save it as a commit, or undo files you don’t want.</p></div></div>
      <div class="changes-layout">
        <div class="stack">
          <div class="card"><div class="card-head"><h3>3 changed files</h3><span class="spacer"></span><button class="btn ghost sm" type="button" data-modal="undoFile">${ico('undo')} Undo all</button></div>
            ${files.map(([s, dir, f, a, d], i) => `<div class="fchange${i === 0 ? ' on' : ''}"><span class="st-chip ${s}">${s.toUpperCase()}</span><span class="path"><span>${dir}</span>${f}</span><span class="plusminus"><span class="add">${a}</span> <span class="del">${d}</span></span></div>`).join('')}
            <div class="card-body" style="display:grid;gap:10px"><label class="field"><span>Commit message</span><textarea class="textarea" style="min-height:70px" placeholder="Describe the change">Studio: new look in ZTD blue</textarea></label>
              <button class="btn primary block" type="button" data-toast="Committed 3 files">${ico('check')} Commit 3 files</button></div></div>
        </div>
        <div class="card diff"><div class="diff-file"><span class="st-chip m">M</span>public/app.css<span class="spacer"></span><span class="plusminus"><span class="add">+214</span> <span class="del">−98</span></span><button class="btn ghost sm" type="button" data-modal="undoFile">${ico('undo')} Undo file</button></div>
          <table>${rows.map(([c, a, b, l]) => c === 'hunk' ? `<tr class="hunk"><td colspan="3">${l}</td></tr>` : `<tr class="${c}"><td class="n">${a}</td><td class="n">${b}</td><td>${l.replace(/</g, '&lt;')}</td></tr>`).join('')}</table></div>
      </div>
      <div class="section"><h2>Recent commits</h2><p>Saved changes, newest first.</p>
        <div class="card timeline">${[['fb17c87', 'Design preview: add Paper in the ztddevs.com navy and gold', 'S', '15 min'], ['2383c6d', 'Design preview: five style options for Studio’s new look', 'S', '28 min'], ['d61fcfc', 'Studio: hovering a chat in the sidebar shows its full first prompt', 'S', '1 h'], ['aa01c78', 'Studio: GitHub backup pushes each project to its own branch', 'A', '1 d']].map(([h, s, w, t]) => `<div class="commit"><span class="hash">${h}</span><span class="subj">${s}</span><span class="avatar sm${w === 'A' ? ' gold' : ''}">${w}</span><time>${t} ago</time></div>`).join('')}
        <div class="card-foot"><span class="small muted">Undoing adds a new commit that reverses the last one. Nothing is lost.</span><span class="spacer"></span><button class="btn sm danger" type="button" data-modal="undoCommit">${ico('undo')} Undo last commit</button></div></div></div>
    </div></div>`, p.name, 'Changes');
  },

  files: () => {
    const p = project('studio');
    const code = `// ZTD Devs Studio: build and run projects with Claude.\nimport http from 'node:http';\nimport { readFileSync } from 'node:fs';\nimport { PORT, STUDIO_HOST } from './lib/config.mjs';\nimport * as P from './lib/projects.mjs';\n\nconst routes = [];\nconst route = (method, pattern, handler) => {\n  routes.push({ method, pattern, handler });\n};\n\nroute('GET', '/api/me', async ({ user }) => ({\n  user: { id: user.id, name: user.name },\n}));\n\nhttp.createServer(handle).listen(PORT);`;
    const hl = l => l.replace(/</g, '&lt;').replace(/(\/\/.*)$/, '<span class="c">$1</span>').replace(/\b(import|from|const|async|return)\b/g, '<span class="k">$1</span>').replace(/('[^']*')/g, '<span class="s">$1</span>');
    const node = (name, { dir, on, open, depth = 0 } = {}) => `<div class="node${dir ? ' dir' : ''}${on ? ' on' : ''}" style="padding-left:${8 + depth * 14}px">${dir ? ico(open ? 'chevdown' : 'chev') : '<span style="width:15px"></span>'}${ico(dir ? 'folder' : 'file')}${name}</div>`;
    return shell({ project: p.id }, `${projectHead(p, 'files')}<div class="files-layout" style="flex:1;min-height:0">
      <div class="tree"><div class="input-wrap" style="margin:0 4px 10px">${ico('search')}<input class="input" placeholder="Filter files…" style="padding-left:6px"></div>
        ${node('bin', { dir: 1 })}${node('lib', { dir: 1, open: 1 })}${['agent.mjs', 'auth.mjs', 'claude.mjs', 'projects.mjs'].map(f => node(f, { depth: 1 })).join('')}
        ${node('ops', { dir: 1 })}${node('public', { dir: 1, open: 1 })}${['app.css', 'app.js', 'index.html', 'project.js'].map(f => node(f, { depth: 1 })).join('')}${node('test', { dir: 1 })}
        ${node('package.json')}${node('README.md')}${node('server.mjs', { on: 1 })}</div>
      <div class="viewer"><div class="viewer-head"><div class="crumb">studio-src ${ico('chev')} <b>server.mjs</b></div><span class="pill soft">536 lines</span><span class="spacer"></span>
        <span class="small muted">Read only. To change files, ask Claude in Chat.</span><button class="btn sm" type="button" data-toast="Copied">${ico('copy')} Copy</button><button class="btn sm" type="button">${ico('download')}</button></div>
        <div class="code-view">${code.split('\n').map((l, i) => `<div><span>${i + 1}</span><span>${hl(l) || ' '}</span></div>`).join('')}</div></div>
    </div>`, p.name, 'Files');
  },

  settings: () => {
    const p = project('studio');
    const row = (b, s, input) => `<div><div class="lbl"><b>${b}</b><small>${s}</small></div><div>${input}</div></div>`;
    return shell({ project: p.id }, `${projectHead(p, 'settings')}<div class="page"><div class="page-inner">
      <div class="settings-layout">
        <nav class="subnav"><a class="on" href="#">${ico('sliders')} General</a><a href="#">${ico('sparkle')} Claude</a><a href="#">${ico('user')} Who it runs as</a><a href="#" style="color:var(--bad)">${ico('trash')} Delete project</a></nav>
        <div class="stack" style="gap:20px">
          <div class="card"><div class="card-head"><div><h3>General</h3><p>Everyone in the team can see these.</p></div></div>
            <div class="form-rows">
              ${row('Name', 'Shown in the sidebar and page titles.', `<input class="input" value="${p.name}">`)}
              ${row('Description', 'Claude reads this at the start of every chat. Focus checks compare prompts with it.', `<textarea class="textarea">${p.desc}</textarea>`)}
              ${row('Team', 'Everyone in this team can open and work on it.', '<select class="select"><option>ZTD Devs</option><option>Nurseries</option></select>')}
              ${row('Folder', 'Where the code lives on the server.', `<div class="keybox">/srv/projects/${p.slug}/repo</div>`)}
            </div>
            <div class="card-foot"><span class="spacer"></span><button class="btn" type="button">Cancel</button><button class="btn primary" type="button" data-toast="Saved">Save changes</button></div></div>
          <div class="card"><div class="card-head"><div><h3>Claude for the project’s own AI workers</h3><p>Some projects, like the pipeline, run Claude themselves.</p></div></div>
            <div class="card-body"><div class="conn"><span class="conn-logo">${ico('sparkle')}</span><div style="flex:1"><b>My Claude</b><div class="small muted">Samuel’s subscription · picked up the next time the services restart</div></div><select class="select" style="width:auto"><option>My Claude (subscription)</option><option>Nobody</option></select></div></div></div>
          <div class="card"><div class="card-head"><div><h3>Who it runs as</h3><p>Studio admins only.</p></div><span class="spacer"></span><span class="pill warn">${ico('alert')} Shared user</span></div>
            <div class="card-body"><p style="margin-top:0">Runs as <code class="mono">ztd</code>, a Linux user shared with other older projects, so their chats can read and change its folder. New projects get their own user.</p>
              <p class="small muted">Moving it stops its services for a minute or two, then starts them again. Chats keep their history.</p><button class="btn primary" type="button" data-modal="ownUser">Move to its own user</button></div></div>
          <div class="card danger-zone"><div class="card-head"><div><h3>Delete project</h3><p>Stops its services and removes its web addresses.</p></div></div>
            <div class="card-body" style="display:grid;gap:12px"><p style="margin:0" class="small">The folder moves to <code class="mono">/srv/projects/.trash</code>, so an admin can still recover it.</p>
              <label class="field"><span>Type <code class="mono">${p.slug}</code> to confirm</span><input class="input" placeholder="${p.slug}"></label>
              <div><button class="btn danger solid" type="button" data-modal="deleteProject">${ico('trash')} Delete project</button></div></div></div>
        </div>
      </div></div></div>`, p.name, 'Settings');
  },
};
