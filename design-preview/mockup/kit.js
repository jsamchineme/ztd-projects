// Building blocks for the redesign mock-up: icons, the logo, the app shell and made-up data.
const P = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-11 5.5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  external: '<path d="M7 17 17 7M8 7h9v9"/>',
  play: '<path d="M7 5v14l11-7z"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  restart: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  terminal: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m6 9 3 3-3 3M12 15h6"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  check: '<path d="m5 12 5 5L20 7"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chev: '<path d="m9 6 6 6-6 6"/>', chevdown: '<path d="m6 9 6 6 6-6"/>',
  clip: '<path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  more: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M16 7l3 3M18 5l2 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  laptop: '<rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>', download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  home: '<path d="m3 11 9-8 9 8M5 9v11h14V9"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
};
export const ico = (name, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
export const logo = (size = 28) => `<span class="logo" style="width:${size}px;height:${size}px"><svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true"><rect width="64" height="64" rx="15" fill="#00427c"/><path d="M19 19h26v7L31 38H19v-7l13-5H19z" fill="#fff"/><path d="M19 38h26v7H19z" fill="#ffc349"/></svg></span>`;

export const DOMAIN = 'ztddevs.com';
export const PROJECTS = [
  { id: 'studio', name: 'Studio', slug: 'studio-src', desc: 'ZTD Studio source. Commit here, then update Studio.', team: 'ZTD Devs', dot: 'ok', state: 'Running', live: ['studio-new'], chats: 5, changes: 3, thumb: 'Studio' },
  { id: 'pipeline', name: 'Pipeline', slug: 'pipeline', desc: 'Board, map board and nurseries for the pipeline team.', team: 'ZTD Devs', dot: 'busy', state: 'Claude working', live: ['pipeline', 'mapboard'], chats: 12, changes: 1, thumb: 'Pipeline' },
  { id: 'dental', name: 'Bright Smile Dental', slug: 'smile-dental', desc: 'Landing page and contact form for a local dental practice.', team: 'Nurseries', dot: 'warn', state: 'Starting', live: ['smile-dental'], chats: 3, changes: 0, thumb: 'Smile' },
  { id: 'templates', name: 'Design templates', slug: 'templates', desc: 'Shared starting points for client sites.', team: 'ZTD Devs', dot: '', state: 'Stopped', live: [], chats: 2, changes: 0, thumb: 'Aa' },
];
// Each project's chats in the sidebar.
export const CHATS_BY = {
  pipeline: [{ id: 'working', title: 'Make the board easier to use on a phone', who: 'Tom', when: '2 min', busy: true }, { id: 'p2', title: 'Cluster nearby nurseries on the map', who: 'Ada', when: '2 d' }, { id: 'p3', title: 'Export the board as a spreadsheet', who: 'You', when: '6 d' }],
  dental: [{ id: 'd1', title: 'Build a landing page for the practice', who: 'You', when: '3 d' }],
  templates: [{ id: 't1', title: 'Start a template for a café', who: 'Ada', when: '2 w' }],
};
export const CHATS = [
  { id: 'hover', title: 'Hovering a chat shows the full prompt', who: 'You', when: '4 min', busy: true },
  { id: 'files', title: 'Give Studio a modern, fresh design', who: 'You', when: '50 min' },
  { id: 'flag', title: 'Write me a poem about Mondays', who: 'Ada', when: '2 d' },
  { id: 'backup', title: 'GitHub backup: a branch per project', who: 'Ada', when: '5 h' },
];

// The app shell: sidebar, phone top bar and the page. `at` says what's open, e.g. { project: 'studio', chat: 'hover' }.
export function shell(at, main, phoneTitle = 'Studio', phoneSub = ''){
  const proj = p => {
    const open = at.project === p.id;
    return `<a class="nav-item${open && !at.chat ? ' on' : ''}" href="#/p/${p.id}/chat"><span class="dot ${p.dot}"></span><span class="name">${p.name}</span>${p.changes ? `<span class="badge">${p.changes}</span>` : ''}</a>` +
      (open ? `<div class="proj-chats">
        <a class="nav-item new" href="#/p/${p.id}/new">${ico('plus')}<span class="name">New chat</span></a>
        ${(CHATS_BY[p.id] || CHATS).map(c => `<a class="nav-item${at.chat === c.id ? ' on' : ''}" href="#/p/${p.id}/chat${['hover', 'p2', 'p3', 'd1', 't1'].includes(c.id) ? '' : '/' + c.id}" title="${c.title}">${c.busy ? '<span class="dot busy"></span>' : ''}<span class="name">${c.title}<span class="sub">${c.who} · ${c.when}</span></span><button class="btn ghost icon sm more" data-modal="chatOptions" type="button" aria-label="Chat options">${ico('more')}</button></a>`).join('')}
        <a class="nav-item arch" href="#/p/${p.id}/chat">${ico('archive')}<span class="name">Archived (1)</span></a>
      </div>` : '');
  };
  return `<div class="app">
  <aside class="side">
    <a class="brand" href="#/home">${logo()} ZTD Devs Studio</a>
    <button class="search" type="button" data-palette>${ico('search')} Search or jump to… <span class="kbd">⌘K</span></button>
    <nav>
      <a class="nav-item${at.page === 'home' ? ' on' : ''}" href="#/home">${ico('grid')}<span class="name">Projects</span></a>
      <a class="nav-item${at.page === 'teams' ? ' on' : ''}" href="#/teams">${ico('users')}<span class="name">Teams and people</span></a>
      <a class="nav-item${at.page === 'admin' ? ' on' : ''}" href="#/admin">${ico('shield')}<span class="name">Admin</span></a>
      <h2>Projects <button type="button" data-modal="newProject" title="New project">${ico('plus')}</button></h2>
      ${PROJECTS.map(proj).join('')}
    </nav>
    <div class="side-foot">
      <a class="me${at.page === 'account' ? ' on' : ''}" href="#/account"><span class="avatar">S</span><span><b>Samuel</b><small><span class="dot ok"></span>Claude subscription</small></span></a>
      <button class="btn ghost icon" type="button" data-mode-toggle title="Light or dark">${ico('moon')}</button>
      <a class="btn ghost icon" href="#/login" title="Sign out" style="margin-right:8px">${ico('logout')}</a>
    </div>
  </aside>
  <main class="main">
    <div class="topbar"><button class="btn ghost icon" type="button" data-menu-open aria-label="Menu">${ico('menu')}</button>
      <div class="t"><b>${phoneTitle}</b>${phoneSub ? `<small>${phoneSub}</small>` : ''}</div>
      <button class="btn ghost icon" type="button" data-palette aria-label="Search">${ico('search')}</button></div>
    ${main}
  </main>
</div>`;
}

// A project's header with its addresses and tabs.
export function projectHead(p, tab){
  const tabs = [['chat', 'Chat', 'chat'], ['services', 'Services', 'server'], ['changes', 'Changes', 'git'], ['files', 'Files', 'folder'], ['settings', 'Settings', 'sliders']];
  return `<header class="phead">
    <div class="crumb"><a href="#/home">Projects</a>${ico('chev')}<span>${p.team}</span></div>
    <div class="phead-row">
      <h1>${p.name}</h1>
      <span class="pill soft"><span class="dot ${p.dot}"></span>${p.state}</span>
      <span class="spacer"></span>
      ${p.live.map((s, i) => `<a class="pill" href="#/p/${p.id}/services"><span class="dot ${i === 1 && p.id === 'pipeline' ? 'bad' : p.dot === 'busy' ? 'ok' : p.dot}"></span>${s}.${DOMAIN} ${ico('external')}</a>`).join('')}
      <a class="btn primary sm" href="#/p/${p.id}/new">${ico('plus')} New chat</a>
    </div>
    <nav class="tabs">${tabs.map(([k, l, i]) => `<a class="tab${k === tab ? ' on' : ''}" href="#/p/${p.id}/${k}">${ico(i)} ${l}${k === 'changes' && p.changes ? ` <span class="badge">${p.changes}</span>` : ''}</a>`).join('')}</nav>
  </header>`;
}
export const project = id => PROJECTS.find(p => p.id === id) || PROJECTS[0];
