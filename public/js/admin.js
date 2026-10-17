// Photographer-facing dashboard: Home, Client Gallery, Studio Manager, Website, Store, Mobile Gallery App, Photo Editor, Settings.
import { icon, logo, esc, money, avatar, statusBadge, route, onMount, actions, state, save, toggle, toast, modal, modalHead, closeModal, go, query, rerender, current } from './core.js';
import { img, studio, galleries, clients, projects, invoices, contracts, sessionTypes, events, products, orders, sitePages, posts, apps, activity } from './data.js';

const PRODUCTS = {
  home: { name: 'Dashboard', icon: 'home', color: '#15181c', to: '/dashboard' },
  gallery: { name: 'Client Gallery', icon: 'gallery', color: '#1a9e8f', to: '/gallery', nav: [
    ['Galleries', '/gallery', 'gallery', galleries.length], ['Activity', '/gallery/activity', 'eye'], ['Email Campaigns', '/gallery/campaigns', 'mail'], ['Presets', '/gallery/presets', 'sliders'],
  ] },
  studio: { name: 'Studio Manager', icon: 'studio', color: '#7f56d9', to: '/studio', nav: [
    ['Overview', '/studio', 'chart'], ['Clients', '/studio/clients', 'users', clients.length], ['Projects', '/studio/projects', 'layout', projects.length], ['Calendar', '/studio/calendar', 'calendar'],
    '_Booking', ['Session Types', '/studio/sessions', 'clock'],
    '_Documents', ['Invoices', '/studio/invoices', 'dollar', invoices.length], ['Contracts', '/studio/contracts', 'file', contracts.length], ['Forms & Questionnaires', '/studio/forms', 'inbox'],
  ] },
  website: { name: 'Website', icon: 'globe', color: '#2456b8', to: '/website', nav: [
    ['Pages', '/website', 'layout'], ['Design', '/website/design', 'palette'], ['Blog', '/website/blog', 'type', posts.length],
  ] },
  store: { name: 'Store', icon: 'bag', color: '#d1435b', to: '/store', nav: [
    ['Orders', '/store', 'inbox', orders.length], ['Products', '/store/products', 'tag'], ['Coupons', '/store/coupons', 'zap'],
  ] },
  mobile: { name: 'Mobile Gallery App', icon: 'phone', color: '#c98a12', to: '/mobile', nav: [['Apps', '/mobile', 'phone', apps.length]] },
  editor: { name: 'Photo Editor', icon: 'wand', color: '#0e7490', to: '/editor', nav: [['Culling & Editing', '/editor', 'sparkles'], ['AI Styles', '/editor/styles', 'palette']] },
};

function shell(product, content, { wide = false, flush = false } = {}) {
  const p = PRODUCTS[product] || { name: 'Settings' };
  const path = current();
  const rail = Object.entries(PRODUCTS).map(([k, v]) =>
    `<a href="#${v.to}" class="${k === product ? 'on' : ''}" data-tip="${v.name}">${icon(v.icon)}</a>`).join('');
  const sub = p.nav ? `<aside class="sub">
      <div class="prod"><span class="dot" style="background:${p.color}">${icon(p.icon)}</span>${p.name}</div>
      ${p.nav.map(n => typeof n === 'string' ? `<div class="grp">${n.slice(1)}</div>` :
        `<a href="#${n[1]}" class="${path === n[1] || (n[1] !== p.to && path.startsWith(n[1])) || (n[1] === '/gallery' && path.startsWith('/gallery/g/')) ? 'on' : ''}">${icon(n[2])}${n[0]}${n[3] != null ? `<span class="count">${n[3]}</span>` : ''}</a>`).join('')}
    </aside>` : '';
  return `<div class="shell ${p.nav ? '' : 'no-sub'}">
    <nav class="rail"><a href="#/" class="logo" data-tip="All prototypes">${logo(22)}</a>${rail}<div class="spacer"></div>
      <a href="#/settings" class="${product === 'settings' ? 'on' : ''}" data-tip="Settings">${icon('settings')}</a></nav>
    ${sub}
    <main class="main" data-scroll="main">
      <div class="topbar">
        <div class="search">${icon('search')}<input placeholder="Search galleries, clients, invoices…"></div>
        <div class="spacer"></div>
        <a class="btn sm ghost" href="#/site" target="_blank">${icon('external')}View site</a>
        <button class="icon-btn" data-act="notifs">${icon('bell')}</button>
        <a href="#/settings" class="row" style="gap:8px">${avatar(studio.owner, 30)}</a>
      </div>
      ${flush ? content : `<div class="page ${wide ? 'wide' : ''}">${content}</div>`}
    </main></div>`;
}
const head = (title, sub, actionsHtml = '') => `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">${actionsHtml}</div></div>`;
const stat = (k, v, d) => `<div class="card stat"><div class="k">${k}</div><div class="v">${v}</div>${d ? `<div class="d">${d}</div>` : ''}</div>`;
const setting = (key, t, d, def = false) => `<div class="setting"><div><div class="t">${t}</div><div class="d">${d}</div></div><button class="toggle ${toggle(key, def) ? 'on' : ''}" data-act="toggle" data-key="${key}" data-def="${def ? 1 : 0}"></button></div>`;

actions.notifs = () => {
  const d = document.createElement('div');
  d.className = 'drawer';
  d.innerHTML = `<div class="card-head"><h2>Notifications</h2><button class="icon-btn" data-act="close">${icon('x')}</button></div>
    <div style="overflow-y:auto;padding:8px 20px">${activity.map(([who, what, obj, when]) => `<div class="row" style="padding:14px 0;border-bottom:1px solid var(--line-2);align-items:flex-start">${avatar(who, 32)}<div><div><b>${who}</b> ${what} <b>${obj}</b></div><div class="small faint">${when}</div></div></div>`).join('')}</div>`;
  document.body.append(d);
};

/* ---------- Home ---------- */
const revenue = [['May', 4200], ['Jun', 7800], ['Jul', 9600], ['Aug', 11200], ['Sep', 14100], ['Oct', 6450]];
function revenueChart() {
  const W = 560, H = 200, pad = 28, max = 16000, bw = 44, gap = (W - pad * 2) / revenue.length;
  const bars = revenue.map(([m, v], i) => {
    const h = (v / max) * (H - 40), x = pad + i * gap + (gap - bw) / 2, y = H - 24 - h;
    return `<g class="bar"><rect x="${x - 8}" y="0" width="${bw + 16}" height="${H - 24}" fill="transparent"><title>${m} 2026: ${money(v)}</title></rect>
      <path d="M${x},${H - 24} V${y + 4} a4,4 0 0 1 4,-4 h${bw - 8} a4,4 0 0 1 4,4 V${H - 24} Z" fill="${i === revenue.length - 1 ? '#a8ddd6' : '#1a9e8f'}" pointer-events="none"/>
      <text x="${x + bw / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#6e7681">${m}</text></g>`;
  }).join('');
  const grid = [0, 5000, 10000, 15000].map(v => { const y = H - 24 - (v / max) * (H - 40); return `<line x1="${pad}" x2="${W}" y1="${y}" y2="${y}" stroke="#f0f1f3"/><text x="0" y="${y + 4}" font-size="10" fill="#9aa1aa">${v / 1000}k</text>`; }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Monthly revenue, May to October 2026">${grid}${bars}</svg>
    <div class="small faint" style="margin-top:6px">October is month-to-date (lighter bar). Hover a bar for its value.</div>`;
}

route('/dashboard', () => shell('home', `
  ${head(`Good afternoon, ${studio.owner.split(' ')[0]}`, 'Here’s what’s happening across your studio today.',
    `<button class="btn" data-act="newGallery">${icon('gallery')}New gallery</button><button class="btn primary" data-act="newInvoice">${icon('plus')}New invoice</button>`)}
  <div class="stats">
    ${stat('Revenue this month', money(6450), '↑ 18% vs. Oct 2025')}
    ${stat('Outstanding invoices', money(1675), '3 invoices')}
    ${stat('Gallery views (30d)', '3,248', '↑ 9%')}
    ${stat('Store orders (30d)', '12', money(1710) + ' in sales')}
  </div>
  <div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:16px">
    <div class="card"><div class="card-head"><h3>Revenue</h3><span class="muted small">Last 6 months</span></div><div class="card-pad">${revenueChart()}</div></div>
    <div class="card"><div class="card-head"><h3>Upcoming sessions</h3><a href="#/studio/calendar" class="small muted">Calendar →</a></div>
      <div style="padding:6px 20px">${events.filter(e => e.day >= 16).map(e => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line-2)">
        <div style="width:44px;text-align:center"><div class="small muted">OCT</div><div style="font-size:18px;font-weight:600">${e.day}</div></div>
        <div><div style="font-weight:500">${e.title}</div><div class="small muted">${e.time}</div></div></div>`).join('')}</div></div>
  </div>
  <div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:16px">
    <div class="card"><div class="card-head"><h3>Recent galleries</h3><a href="#/gallery" class="small muted">All galleries →</a></div>
      <div class="card-pad"><div class="gcards" style="grid-template-columns:repeat(3,1fr)">${galleries.slice(0, 3).map(gcard).join('')}</div></div></div>
    <div class="card"><div class="card-head"><h3>Activity</h3></div>
      <div style="padding:4px 20px">${activity.map(([who, what, obj, when]) => `<div class="row" style="padding:11px 0;border-bottom:1px solid var(--line-2);align-items:flex-start">${avatar(who, 28)}<div class="small"><div><b>${who}</b> ${what} <b>${obj}</b></div><div class="faint">${when}</div></div></div>`).join('')}</div></div>
  </div>`));

/* ---------- Client Gallery ---------- */
function gcard(g) {
  return `<div class="gcard" data-act="go" data-to="/gallery/g/${g.id}">
    <div class="ph"><img loading="lazy" src="${img(g.cover, 600, 450)}" alt="">${g.status !== 'Published' ? statusBadge(g.status) : ''}</div>
    <h3>${esc(g.title)}</h3>
    <div class="meta"><span>${g.date}</span><span>${g.sets.reduce((a, s) => a + s.photos.length, 0)} photos</span></div></div>`;
}

route('/gallery', () => {
  const f = query().get('f') || 'All';
  const list = galleries.filter(g => f === 'All' || g.status === f);
  return shell('gallery', `
    ${head('Galleries', 'Deliver, proof and sell your work in beautiful client galleries.', `<button class="btn primary" data-act="newGallery">${icon('plus')}New Gallery</button>`)}
    <div class="row between" style="margin-bottom:20px">
      <div class="row">${['All', 'Published', 'Draft', 'Expired'].map(s => `<a class="chip ${s === f ? 'on' : ''}" href="#/gallery?f=${s}">${s}</a>`).join('')}</div>
      <div class="seg"><button class="on" data-act="seg">${icon('grid')}</button><button data-act="seg">${icon('layout')}</button></div>
    </div>
    <div class="gcards">${list.map(gcard).join('')}</div>`);
});

actions.newGallery = () => {
  modal(`${modalHead('Create new gallery')}<div class="modal-body">
    <div class="field"><label>Gallery name</label><input class="input" id="ng-name" placeholder="e.g. Sarah & Tom Engagement" autofocus></div>
    <div class="field"><label>Event date</label><input class="input" type="date" value="2026-10-16"></div>
    <div class="field"><label>Preset</label><select class="input"><option>Wedding (default)</option><option>Portrait</option><option>Brand</option></select></div>
  </div><div class="modal-foot"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="createGallery">Create gallery</button></div>`);
  setTimeout(() => document.getElementById('ng-name')?.focus(), 30);
};
actions.createGallery = () => {
  const title = document.getElementById('ng-name').value.trim() || 'Untitled Gallery';
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36).slice(-4);
  galleries.unshift({ id, title, subtitle: 'New gallery', date: 'Oct 16, 2026', cover: 'new' + id.length, status: 'Draft', views: 0, favs: 0, downloads: 0, sets: [{ name: 'Highlights', photos: [] }], client: '—', expires: '—' });
  closeModal();
  go('/gallery/g/' + id);
  toast('Gallery created');
};

route('/gallery/g/:id', ({ id }) => {
  const g = galleries.find(x => x.id === id) || galleries[0];
  const tab = query().get('tab') || 'photos';
  const setIdx = Number(query().get('set') || 0);
  const set = g.sets[setIdx] || g.sets[0];
  const tabs = [['photos', 'Photos'], ['design', 'Design'], ['privacy', 'Privacy'], ['download', 'Download'], ['store', 'Store'], ['activity', 'Activity']];
  const base = `#/gallery/g/${g.id}`;
  let body = '';
  if (tab === 'photos') {
    body = `<div class="grid" style="grid-template-columns:200px 1fr;gap:24px">
      <div><div class="eyebrow" style="margin-bottom:8px">Sets</div>
        ${g.sets.map((s, i) => `<a href="${base}?set=${i}" class="row between" style="padding:8px 10px;border-radius:7px;${i === setIdx ? 'background:var(--line-2);font-weight:500' : ''}"><span>${s.name}</span><span class="faint small">${s.photos.length}</span></a>`).join('')}
        <button class="btn ghost sm" style="margin-top:6px" data-act="addSet" data-id="${g.id}">${icon('plus')}Add set</button></div>
      <div>
        <div class="row between" style="margin-bottom:14px"><div class="row"><h2>${set.name}</h2><span class="muted">${set.photos.length} photos</span></div>
          <div class="row"><button class="btn sm" data-act="toast" data-msg="Sorted by capture time">Sort</button><button class="btn sm primary" data-act="upload" data-id="${g.id}" data-set="${setIdx}">${icon('upload')}Upload</button></div></div>
        ${set.photos.length ? `<div class="masonry" style="columns:5 150px;column-gap:8px">${set.photos.map(p => `<div class="tile" style="margin-bottom:8px;border-radius:4px"><img loading="lazy" src="${img(p.id, Math.round(p.w / 3), Math.round(p.h / 3))}" alt=""><div class="ov"><button data-act="toast" data-msg="Set as cover photo">${icon('star')}</button><button data-act="toast" data-msg="Photo moved to trash">${icon('trash')}</button></div></div>`).join('')}</div>`
        : `<div class="card" style="border-style:dashed;padding:60px;text-align:center"><div style="color:var(--faint)">${icon('upload')}</div><h3 style="margin-top:10px">Drag photos here to upload</h3><p class="muted" style="margin:6px 0 16px">JPEG, PNG, RAW and video up to 4 GB. Or sync from Lightroom.</p><button class="btn primary" data-act="upload" data-id="${g.id}" data-set="${setIdx}">Select photos</button></div>`}
      </div></div>`;
  } else if (tab === 'design') {
    const cover = toggle(`cover-${g.id}`) ? 'Left' : 'Center';
    body = `<div class="grid" style="grid-template-columns:340px 1fr;gap:24px">
      <div class="card card-pad">
        <div class="eyebrow">Cover</div><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 18px">${['Center', 'Left', 'Novel', 'Vintage', 'Frame', 'Stripe'].map(c => `<button class="btn sm ${c === cover ? 'primary' : ''}" data-act="toast" data-msg="Cover style: ${c}">${c}</button>`).join('')}</div>
        <div class="eyebrow">Typography</div><div class="seg" style="margin:10px 0 18px"><button class="on" data-act="seg">Serif</button><button data-act="seg">Sans</button><button data-act="seg">Modern</button></div>
        <div class="eyebrow">Color</div><div class="row" style="margin:10px 0 18px">${['#fff', '#f6f1ea', '#222', '#3a4a3f'].map((c, i) => `<button data-act="seg" style="width:34px;height:34px;border-radius:50%;background:${c};border:2px solid ${i ? 'var(--line)' : 'var(--ink)'};cursor:pointer"></button>`).join('')}</div>
        <div class="eyebrow">Grid</div><div class="seg" style="margin:10px 0 18px"><button class="on" data-act="seg">Vertical</button><button data-act="seg">Horizontal</button></div>
        <div class="eyebrow">Thumbnail size</div><div class="seg" style="margin-top:10px"><button data-act="seg">Small</button><button class="on" data-act="seg">Regular</button><button data-act="seg">Large</button></div>
      </div>
      <div class="card" style="overflow:hidden"><div style="position:relative;height:420px"><img src="${img(g.cover, 1200, 800)}" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:rgba(0,0,0,.28);display:grid;place-items:center;color:#fff;text-align:center"><div><div class="serif" style="font-size:46px">${esc(g.title)}</div><div style="letter-spacing:.3em;font-size:11px;text-transform:uppercase;margin-top:6px">${g.date}</div></div></div></div>
        <div class="card-pad row between"><span class="muted small">Live cover preview</span><a class="btn sm" href="#/g/${g.id}" target="_blank">${icon('external')}Open client view</a></div></div></div>`;
  } else if (tab === 'privacy') {
    body = `<div class="card card-pad" style="max-width:720px">
      ${setting(`pw-${g.id}`, 'Gallery password', 'Clients need a password to view this gallery.', true)}
      <div class="field" style="margin-top:8px"><label>Password</label><input class="input" value="emma2026" style="max-width:260px"></div>
      ${setting(`email-${g.id}`, 'Require email to view', 'Track who views the gallery and send them updates.', true)}
      ${setting(`hide-${g.id}`, 'Hide on homepage', 'Don’t list this gallery on your public client gallery homepage.', false)}
      ${setting(`expiry-${g.id}`, 'Auto expiry', `Gallery expires on ${g.expires}. Clients get a reminder 7 days before.`, true)}
      ${setting(`sets-${g.id}`, 'Client-only sets', 'Make specific sets visible only to the main client.', false)}</div>`;
  } else if (tab === 'download') {
    body = `<div class="card card-pad" style="max-width:720px">
      ${setting(`dl-${g.id}`, 'Photo download', 'Allow clients to download photos from this gallery.', true)}
      <div class="row" style="padding:4px 0 14px;gap:16px"><span class="muted small">Sizes:</span><label class="row small"><input type="checkbox" checked> High resolution (3600px)</label><label class="row small"><input type="checkbox" checked> Web size (1024px)</label><label class="row small"><input type="checkbox"> Original</label></div>
      ${setting(`dlpin-${g.id}`, 'Download PIN', 'Require a 4-digit PIN for downloads: 4821', true)}
      ${setting(`dllimit-${g.id}`, 'Limit free downloads', 'Clients can download up to 50 photos for free; more must be purchased.', false)}
      ${setting(`dlvideo-${g.id}`, 'Video download', 'Allow clients to download videos.', false)}
      ${setting(`dlwm-${g.id}`, 'Apply watermark', 'Add your watermark to web-size downloads.', false)}</div>`;
  } else if (tab === 'store') {
    body = `<div class="grid" style="grid-template-columns:1fr 1fr;gap:16px;max-width:980px">
      <div class="card card-pad">${setting(`st-${g.id}`, 'Enable store', 'Clients can buy prints and products from this gallery.', true)}
        <div class="field" style="margin-top:10px"><label>Price sheet</label><select class="input"><option>Wedding Collection 2026</option><option>Portrait Basics</option></select></div>
        ${setting(`stdig-${g.id}`, 'Sell digital downloads', 'Single image $25 · Full gallery $450', true)}
        ${setting(`stmin-${g.id}`, 'Minimum order', 'Require a $50 minimum order amount.', false)}</div>
      <div class="card"><div class="card-head"><h3>Sales from this gallery</h3></div><table class="table"><tbody>${orders.filter(o => o.gallery === g.title).map(o => `<tr><td>${o.id}</td><td>${o.client}</td><td class="num">${money(o.total)}</td></tr>`).join('') || '<tr><td class="muted">No orders yet</td></tr>'}</tbody></table></div></div>`;
  } else {
    body = `<div class="stats" style="margin-bottom:16px">${stat('Views', g.views.toLocaleString())}${stat('Favorites', g.favs)}${stat('Downloads', g.downloads)}${stat('Store orders', orders.filter(o => o.gallery === g.title).length)}</div>
      <div class="card"><div class="card-head"><h3>Visitor activity</h3><button class="btn sm" data-act="toast" data-msg="CSV exported">Export</button></div><table class="table"><thead><tr><th>Visitor</th><th>Action</th><th>When</th></tr></thead><tbody>
      ${[[g.client, 'Favorited 24 photos', '12 min ago'], ['james.r@mail.com', 'Downloaded full gallery (high-res)', '2 hrs ago'], ['grandma.collins@mail.com', 'Viewed gallery', 'Yesterday'], [g.client, 'Ordered 3 prints', 'Oct 15'], ['sam.t@mail.com', 'Viewed gallery', 'Oct 15']].map(r => `<tr><td><div class="row">${avatar(r[0], 26)}${r[0]}</div></td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
  }
  return shell('gallery', `
    <a href="#/gallery" class="row muted small" style="margin-bottom:10px;gap:4px">${icon('back')}Galleries</a>
    ${head(esc(g.title), `${g.date} · ${statusBadge(g.status)} · ${g.views.toLocaleString()} views · Client: ${g.client}`,
      `<a class="btn" href="#/g/${g.id}" target="_blank">${icon('eye')}Preview</a><button class="btn primary" data-act="share" data-id="${g.id}">${icon('share')}Share</button>`)}
    <div class="tabs">${tabs.map(([k, n]) => `<a href="${base}?tab=${k}" class="${k === tab ? 'on' : ''}">${n}</a>`).join('')}</div>
    ${body}`);
});

actions.upload = el => {
  const g = galleries.find(x => x.id === el.dataset.id);
  const set = g.sets[Number(el.dataset.set)];
  const n = set.photos.length;
  for (let i = 0; i < 12; i++) set.photos.push({ id: `${g.id.slice(0, 4)}${n + i}`, w: i % 3 ? 1100 : 800, h: i % 3 ? 740 : 1100, name: `IMG_${5000 + n + i}.jpg` });
  toast('12 photos uploaded');
  rerender();
};
actions.addSet = el => { const g = galleries.find(x => x.id === el.dataset.id); g.sets.push({ name: `Set ${g.sets.length + 1}`, photos: [] }); go(`/gallery/g/${g.id}?set=${g.sets.length - 1}`); };
actions.share = el => {
  const g = galleries.find(x => x.id === el.dataset.id);
  if (g.status === 'Draft') g.status = 'Published';
  const url = `${location.origin}/#/g/${g.id}`;
  modal(`${modalHead('Share gallery', 'Send by email or copy the direct link.')}<div class="modal-body">
    <div class="field"><label>Direct link</label><div class="row"><input class="input" value="${url}" readonly><button class="btn" data-act="copyLink" data-url="${url}">${icon('copy')}Copy</button></div></div>
    <div class="field"><label>To</label><input class="input" value="${g.client !== '—' ? clients.find(c => c.name === g.client)?.email || '' : ''}" placeholder="client@email.com"></div>
    <div class="field"><label>Message</label><textarea class="input">Hi! Your photos are ready. I loved every minute of this session. Enjoy!\n\n— Lena</textarea></div>
  </div><div class="modal-foot"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="sendShare">${icon('mail')}Send email</button></div>`);
};
actions.copyLink = el => { navigator.clipboard?.writeText(el.dataset.url); toast('Link copied'); };
actions.sendShare = () => { closeModal(); toast('Gallery emailed to client'); rerender(); };

route('/gallery/activity', () => shell('gallery', `${head('Activity', 'Everything clients are doing across your galleries.')}
  <div class="card"><table class="table"><thead><tr><th>Client</th><th>Activity</th><th>Gallery</th><th>When</th></tr></thead><tbody>
  ${[['Emma Collins', 'Favorited 24 photos', 'Emma & James', '12 min ago'], ['Priya Shah', 'Purchased Gallery Canvas 16×20', 'Baby Oliver', '3 hrs ago'], ['Linh Nguyen', 'Downloaded 18 photos', 'The Nguyen Family', 'Yesterday'], ['Maya Ortiz', 'Downloaded full gallery', 'Aurora Ceramics', 'Oct 13'], ['Noah Bennett', 'Viewed gallery', 'Harbor Elopement', 'Oct 1'], ['Emma Collins', 'Created favorites list “Album picks”', 'Emma & James', 'Sep 30']]
    .map(r => `<tr><td><div class="row">${avatar(r[0], 28)}${r[0]}</div></td><td>${r[1]}</td><td>${r[2]}</td><td class="muted">${r[3]}</td></tr>`).join('')}</tbody></table></div>`));

route('/gallery/campaigns', () => shell('gallery', `${head('Email Campaigns', 'Automated emails that bring clients back to their galleries.', `<button class="btn primary" data-act="toast" data-msg="Campaign draft created">${icon('plus')}New campaign</button>`)}
  <div class="card"><table class="table"><thead><tr><th>Campaign</th><th>Trigger</th><th>Sent</th><th>Open rate</th><th></th></tr></thead><tbody>
  ${[['Gallery expiring soon', '7 days before expiry', 142, '68%', true], ['Abandoned cart reminder', '24 hrs after cart activity', 37, '54%', true], ['Holiday print sale — 20% off', 'Scheduled Nov 20', 0, '—', false], ['Anniversary check-in', '1 year after event', 18, '71%', true]]
    .map((r, i) => `<tr><td style="font-weight:500">${r[0]}</td><td class="muted">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><button class="toggle ${toggle('camp' + i, r[4]) ? 'on' : ''}" data-act="toggle" data-key="camp${i}" data-def="${r[4] ? 1 : 0}"></button></td></tr>`).join('')}</tbody></table></div>`));

route('/gallery/presets', () => shell('gallery', `${head('Presets', 'Save gallery settings to apply to new galleries in one click.', `<button class="btn primary" data-act="toast" data-msg="Preset created">${icon('plus')}New preset</button>`)}
  <div class="grid" style="grid-template-columns:repeat(3,1fr)">${[['Wedding (default)', 'Serif cover · Downloads on · Store on · 6-month expiry'], ['Portrait', 'Sans cover · 10 free downloads · Store on'], ['Brand', 'Minimal cover · Full downloads · No store']].map(([n, d]) => `<div class="card card-pad"><h3>${n}</h3><p class="muted small" style="margin-top:6px">${d}</p><button class="btn sm" style="margin-top:14px">Edit</button></div>`).join('')}</div>`));

/* ---------- Studio Manager ---------- */
const STAGES = ['Inquiry', 'Booked', 'Editing', 'Delivered', 'Completed'];

route('/studio', () => shell('studio', `
  ${head('Studio Manager', 'Bookings, clients, invoices and contracts in one place.', `<button class="btn" data-act="newClient">${icon('users')}Add client</button><button class="btn primary" data-act="newInvoice">${icon('plus')}New invoice</button>`)}
  <div class="stats">${stat('Paid this month', money(6450), '↑ 18%')}${stat('Outstanding', money(1675), '3 invoices')}${stat('Upcoming sessions', '4', 'Next: Oct 18')}${stat('Open inquiries', '2', 'Avg. reply 3h')}</div>
  <div class="grid" style="grid-template-columns:1fr 1fr;margin-top:16px">
    <div class="card"><div class="card-head"><h3>Needs attention</h3></div><div style="padding:4px 20px">
      ${[['red', 'INV-1040 is overdue', 'Linh Nguyen · $500 · due Oct 12', '/pay/INV-1040'], ['amber', 'Contract awaiting signature', 'Grace Kim · Engagement Session Agreement', '/sign/k1'], ['amber', 'New inquiry', 'Hannah Lee asked about wedding dates in June 2027', '/studio/clients'], ['blue', 'Questionnaire submitted', 'Sofia Ramirez · Senior session prep', '/studio/forms']]
        .map(([c, t, d, to]) => `<a href="#${to}" class="row" style="padding:13px 0;border-bottom:1px solid var(--line-2)"><span class="badge ${c} plain" style="width:8px;padding:0;height:8px"></span><div><div style="font-weight:500">${t}</div><div class="small muted">${d}</div></div><span class="spacer"></span>${icon('right')}</a>`).join('')}</div></div>
    <div class="card"><div class="card-head"><h3>Booking page</h3><a href="#/book" target="_blank" class="btn sm">${icon('external')}Open</a></div><div class="card-pad">
      <p class="muted">Clients pick a session, a time and pay a deposit. You get notified and a project is created automatically.</p>
      <div class="row" style="margin-top:14px;padding:10px 12px;background:var(--line-2);border-radius:8px">${icon('link')}<span class="small">${studio.domain}/book</span><span class="spacer"></span><button class="btn sm" data-act="copyLink" data-url="${location.origin}/#/book">Copy</button></div>
      <div class="row" style="margin-top:14px;gap:20px"><div><div class="small muted">Bookings (30d)</div><div style="font-size:20px;font-weight:600">9</div></div><div><div class="small muted">Deposits collected</div><div style="font-size:20px;font-weight:600">${money(1150)}</div></div></div></div></div>
  </div>`));

route('/studio/clients', () => shell('studio', `
  ${head('Clients', `${clients.length} contacts`, `<button class="btn primary" data-act="newClient">${icon('plus')}Add client</button>`)}
  <div class="card"><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Tag</th><th class="num">Lifetime value</th><th>Last activity</th></tr></thead><tbody>
  ${clients.map(c => `<tr class="click" data-act="clientDrawer" data-id="${c.id}"><td><div class="row">${avatar(c.name, 30)}<b style="font-weight:500">${c.name}</b></div></td><td class="muted">${c.email}</td><td class="muted">${c.phone}</td><td>${statusBadge(c.tag)}</td><td class="num">${money(c.lifetime)}</td><td class="muted">${c.last}</td></tr>`).join('')}</tbody></table></div>`));

actions.clientDrawer = el => {
  const c = clients.find(x => x.id === el.dataset.id);
  const d = document.createElement('div');
  d.className = 'drawer';
  d.innerHTML = `<div class="card-head"><h2>Client</h2><button class="icon-btn" data-act="close">${icon('x')}</button></div>
    <div style="padding:24px;overflow-y:auto"><div class="row">${avatar(c.name, 52)}<div><h2>${c.name}</h2><div class="muted small">${c.tag} client</div></div></div>
    <div class="row" style="margin:18px 0"><button class="btn sm" data-act="toast" data-msg="Email composer opened">${icon('mail')}Email</button><button class="btn sm" data-act="newInvoice">${icon('dollar')}Invoice</button><button class="btn sm" data-act="toast" data-msg="Contract sent">${icon('file')}Contract</button></div>
    <div class="field"><label>Email</label><div>${c.email}</div></div><div class="field"><label>Phone</label><div>${c.phone}</div></div>
    <div class="eyebrow" style="margin:20px 0 8px">Projects</div>${projects.filter(p => p.client === c.name).map(p => `<div class="row between" style="padding:10px 0;border-bottom:1px solid var(--line-2)"><span>${p.name}</span>${statusBadge(p.stage)}</div>`).join('') || '<p class="muted small">No projects yet</p>'}
    <div class="eyebrow" style="margin:20px 0 8px">Invoices</div>${invoices.filter(i => i.client === c.name).map(i => `<a href="#/pay/${i.id}" class="row between" style="padding:10px 0;border-bottom:1px solid var(--line-2)"><span>${i.id} · ${money(i.amount)}</span>${statusBadge(i.status)}</a>`).join('') || '<p class="muted small">No invoices</p>'}
    <div class="eyebrow" style="margin:20px 0 8px">Notes</div><textarea class="input" placeholder="Add a private note…"></textarea></div>`;
  document.body.append(d);
};
actions.newClient = () => modal(`${modalHead('Add client')}<div class="modal-body">
  <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>First name</label><input class="input" id="nc-f"></div><div class="field"><label>Last name</label><input class="input" id="nc-l"></div></div>
  <div class="field"><label>Email</label><input class="input" type="email"></div><div class="field"><label>Phone</label><input class="input"></div>
  <div class="field"><label>Tag</label><select class="input"><option>Lead</option><option>Wedding</option><option>Family</option><option>Brand</option></select></div>
  </div><div class="modal-foot"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="saveClient">Save client</button></div>`);
actions.saveClient = () => {
  const name = `${document.getElementById('nc-f').value} ${document.getElementById('nc-l').value}`.trim() || 'New Client';
  clients.unshift({ id: 'c' + Date.now(), name, email: '—', phone: '—', tag: 'Lead', projects: 0, lifetime: 0, last: 'Just now' });
  closeModal(); go('/studio/clients'); rerender(); toast('Client added');
};

route('/studio/projects', () => shell('studio', `
  ${head('Projects', 'Track every job from inquiry to delivery.', `<button class="btn primary" data-act="toast" data-msg="Project created">${icon('plus')}New project</button>`)}
  <div class="kanban">${STAGES.map(s => { const list = projects.filter(p => p.stage === s); return `<div class="lane"><h4>${s}<span class="faint">${list.length}</span></h4>
    ${list.map(p => `<div class="kcard" data-act="advance" data-id="${p.id}" title="Click to move to the next stage"><div style="font-weight:500">${p.name}</div><div class="row small muted" style="margin-top:6px">${icon('calendar')}${p.date}</div><div class="row between" style="margin-top:10px">${avatar(p.client, 22)}<span class="small" style="font-weight:500">${money(p.value)}</span></div></div>`).join('')}</div>`; }).join('')}</div>
  <p class="small faint" style="margin-top:10px">Tip: click a card to move it to the next stage.</p>`, { wide: true }));
actions.advance = el => { const p = projects.find(x => x.id === el.dataset.id); const i = STAGES.indexOf(p.stage); p.stage = STAGES[(i + 1) % STAGES.length]; toast(`${p.name} → ${p.stage}`); rerender(); };

route('/studio/calendar', () => {
  const cells = [];
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => cells.push(`<div class="dow">${d}</div>`));
  for (let i = 0; i < 4; i++) cells.push(`<div class="out"><span class="n">${27 + i}</span></div>`);
  for (let d = 1; d <= 31; d++) cells.push(`<div class="${d === 16 ? 'today' : ''}"><span class="n">${d}</span>${events.filter(e => e.day === d).map(e => `<div class="ev ${e.color}">${e.time} ${e.title}</div>`).join('')}${state.booked && d === state.booked.day ? `<div class="ev teal">${state.booked.time} ${state.booked.name}</div>` : ''}</div>`);
  return shell('studio', `${head('October 2026', 'Sessions, calls and availability.', `<div class="seg"><button data-act="seg">Week</button><button class="on" data-act="seg">Month</button></div><button class="btn" data-act="toast" data-msg="Google Calendar connected">${icon('link')}Sync calendar</button><button class="btn primary" data-act="toast" data-msg="Event added">${icon('plus')}Add event</button>`)}
    <div class="card" style="overflow:hidden"><div class="cal">${cells.join('')}</div></div>`, { wide: true });
});

route('/studio/sessions', () => shell('studio', `
  ${head('Session Types', 'What clients can book from your booking page.', `<a class="btn" href="#/book" target="_blank">${icon('external')}View booking page</a><button class="btn primary" data-act="toast" data-msg="Session type created">${icon('plus')}New session type</button>`)}
  <div class="grid" style="grid-template-columns:repeat(2,1fr)">${sessionTypes.map(s => `<div class="card" style="display:flex;overflow:hidden"><img src="${img(s.img, 300, 300)}" style="width:140px;object-fit:cover"><div class="card-pad" style="flex:1">
    <div class="row between"><h3>${s.name}</h3><button class="toggle ${toggle('sess' + s.id, true) ? 'on' : ''}" data-act="toggle" data-key="sess${s.id}" data-def="1"></button></div>
    <p class="muted small" style="margin:6px 0 12px">${s.desc}</p>
    <div class="row small" style="gap:16px"><span class="row" style="gap:4px">${icon('clock')}${s.duration}</span><span class="row" style="gap:4px">${icon('dollar')}${s.price ? money(s.price) : 'Free'}</span>${s.deposit ? `<span class="muted">${money(s.deposit)} deposit</span>` : ''}</div>
    <a href="#/book/${s.id}" target="_blank" class="small" style="color:var(--accent-ink);display:inline-block;margin-top:10px">Preview booking →</a></div></div>`).join('')}</div>
  <div class="card card-pad" style="margin-top:16px;max-width:720px"><h3 style="margin-bottom:4px">Availability</h3>
    ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d, i) => `<div class="setting" style="padding:10px 0"><div class="row" style="gap:14px"><button class="toggle ${toggle('av' + i, i < 6) ? 'on' : ''}" data-act="toggle" data-key="av${i}" data-def="${i < 6 ? 1 : 0}"></button><span style="width:100px;font-weight:500">${d}</span></div><span class="muted">${i < 5 ? '9:00 AM – 6:00 PM' : i === 5 ? '8:00 AM – 2:00 PM' : 'Unavailable'}</span></div>`).join('')}</div>`));

route('/studio/invoices', () => shell('studio', `
  ${head('Invoices', 'Get paid online by card, Apple Pay or bank transfer.', `<button class="btn primary" data-act="newInvoice">${icon('plus')}New invoice</button>`)}
  <div class="stats" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px">${stat('Paid (90d)', money(9250))}${stat('Outstanding', money(1175))}${stat('Overdue', money(500))}</div>
  <div class="card"><table class="table"><thead><tr><th>Invoice</th><th>Client</th><th>Project</th><th>Due</th><th>Status</th><th class="num">Amount</th></tr></thead><tbody>
  ${invoices.map(i => { const s = state.paid[i.id] ? 'Paid' : i.status; return `<tr class="click" data-act="go" data-to="/pay/${i.id}"><td style="font-weight:500">${i.id}</td><td><div class="row">${avatar(i.client, 26)}${i.client}</div></td><td class="muted">${i.project}</td><td class="muted">${i.due}</td><td>${statusBadge(s)}</td><td class="num">${money(i.amount)}</td></tr>`; }).join('')}</tbody></table></div>
  <p class="small faint" style="margin-top:10px">Click an invoice to see what your client sees.</p>`));

actions.newInvoice = () => {
  closeModal();
  modal(`${modalHead('New invoice')}<div class="modal-body">
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Client</label><select class="input">${clients.map(c => `<option>${c.name}</option>`).join('')}</select></div><div class="field"><label>Due date</label><input class="input" type="date" value="2026-10-30"></div></div>
    <table class="table" style="margin:4px 0 10px"><thead><tr><th style="padding-left:0">Item</th><th>Qty</th><th class="num" style="padding-right:0">Price</th></tr></thead><tbody>
      <tr><td style="padding-left:0"><input class="input" value="Family Portrait Session"></td><td><input class="input" value="1" style="width:60px"></td><td style="padding-right:0"><input class="input num" value="450.00" style="width:110px"></td></tr>
      <tr><td style="padding-left:0"><input class="input" value="8×10 Fine Art Prints"></td><td><input class="input" value="3" style="width:60px"></td><td style="padding-right:0"><input class="input num" value="40.00" style="width:110px"></td></tr></tbody></table>
    <button class="btn sm ghost">${icon('plus')}Add line item</button>
    <div class="setting">${'<div><div class="t">Payment schedule</div><div class="d">Collect a 25% retainer now, balance due 7 days before session.</div></div>'}<button class="toggle ${toggle('inv-sched', true) ? 'on' : ''}" data-act="toggle" data-key="inv-sched" data-def="1"></button></div>
    <div class="row between" style="font-size:16px;font-weight:600;padding-top:8px"><span>Total</span><span>${money(570)}</span></div>
  </div><div class="modal-foot"><button class="btn" data-act="close">Save draft</button><button class="btn primary" data-act="sendInvoice">${icon('mail')}Send invoice</button></div>`, 'wide');
};
actions.sendInvoice = () => { closeModal(); toast('Invoice sent'); };

route('/studio/contracts', () => shell('studio', `
  ${head('Contracts', 'Send contracts and collect legally binding e-signatures.', `<button class="btn" data-act="toast" data-msg="Template library opened">${icon('copy')}Templates</button><button class="btn primary" data-act="toast" data-msg="Contract draft created">${icon('plus')}New contract</button>`)}
  <div class="card"><table class="table"><thead><tr><th>Contract</th><th>Client</th><th>Sent</th><th>Status</th></tr></thead><tbody>
  ${contracts.map(k => `<tr class="click" data-act="go" data-to="/sign/${k.id}"><td style="font-weight:500"><div class="row">${icon('file')}${k.name}</div></td><td>${k.client}</td><td class="muted">${k.sent}</td><td>${statusBadge(state.signed[k.id] ? 'Signed' : k.status)}</td></tr>`).join('')}</tbody></table></div>`));

route('/studio/forms', () => shell('studio', `
  ${head('Forms & Questionnaires', 'Contact forms for your website and questionnaires for booked clients.', `<button class="btn primary" data-act="toast" data-msg="Form created">${icon('plus')}New form</button>`)}
  <div class="grid" style="grid-template-columns:repeat(3,1fr)">${[['Website Contact Form', 'Contact form', 38], ['Wedding Day Questionnaire', 'Questionnaire', 6], ['Senior Session Prep', 'Questionnaire', 4], ['Family Session Prep', 'Questionnaire', 11], ['Brand Session Brief', 'Questionnaire', 2], ['Mini Session Waitlist', 'Contact form', 54]]
    .map(([n, t, r]) => `<div class="card card-pad"><span class="badge plain">${t}</span><h3 style="margin-top:12px">${n}</h3><p class="muted small" style="margin-top:4px">${r} responses</p><div class="row" style="margin-top:14px"><button class="btn sm" data-act="toast" data-msg="Opening form builder">Edit</button><button class="btn sm ghost" data-act="toast" data-msg="${r} responses">Responses</button></div></div>`).join('')}</div>`));

/* ---------- Website ---------- */
route('/website', () => shell('website', `
  ${head('Website', `${studio.domain} · Theme: ${(state.site?.theme) || 'Ivory'}`, `<a class="btn" href="#/site" target="_blank">${icon('external')}View site</a><a class="btn primary" href="#/website/design">${icon('palette')}Customize design</a>`)}
  <div class="card" style="overflow:hidden;margin-bottom:20px;display:grid;grid-template-columns:1.3fr 1fr">
    <div style="height:260px;overflow:hidden;border-right:1px solid var(--line)"><iframe src="/#/site" style="width:200%;height:520px;border:0;transform:scale(.5);transform-origin:0 0;pointer-events:none"></iframe></div>
    <div class="card-pad"><span class="badge green">Published</span><h2 style="margin-top:12px">${studio.name}</h2><p class="muted" style="margin-top:4px">Last published Oct 14, 2026</p>
      <div class="row" style="margin-top:16px;gap:24px"><div><div class="small muted">Visitors (30d)</div><div style="font-size:20px;font-weight:600">2,184</div></div><div><div class="small muted">Inquiries</div><div style="font-size:20px;font-weight:600">14</div></div></div>
      <div class="row" style="margin-top:18px"><button class="btn sm" data-act="toast" data-msg="Custom domain setup started">${icon('globe')}Connect domain</button><button class="btn sm" data-act="toast" data-msg="SEO settings saved">SEO</button></div></div></div>
  <div class="card"><div class="card-head"><h3>Pages</h3><button class="btn sm" data-act="toast" data-msg="Choose a page template">${icon('plus')}Add page</button></div>
    <table class="table"><tbody>${sitePages.map(p => `<tr class="click" data-act="go" data-to="/website/design?page=${p.path.slice(1) || 'home'}"><td style="font-weight:500">${p.name}</td><td class="muted">${p.path}</td><td>${statusBadge(p.status)}</td><td class="num"><span class="muted">${icon('right')}</span></td></tr>`).join('')}</tbody></table></div>`));

const THEMES = [['Ivory', '#fbf9f6', '#2a2723'], ['Noir', '#141414', '#f2f0ec'], ['Sage', '#eef0ea', '#2f3a30'], ['Blush', '#fbf3f0', '#4a2f2c']];
const FONTS = ['Cormorant Garamond', 'Playfair Display', 'Inter'];
route('/website/design', () => {
  const s = state.site || (state.site = { theme: 'Ivory', font: 'Cormorant Garamond' });
  const page = query().get('page') || 'home';
  const dev = query().get('dev') || 'desktop';
  return shell('website', `<div style="display:grid;grid-template-columns:300px 1fr;height:calc(100vh - 60px)">
    <div style="background:#fff;border-right:1px solid var(--line);padding:20px;overflow-y:auto">
      <a href="#/website" class="row muted small" style="gap:4px;margin-bottom:14px">${icon('back')}Website</a>
      <div class="eyebrow" style="margin-bottom:8px">Page</div>
      <select class="input" onchange="location.hash='#/website/design?page='+this.value">${['home', 'portfolio', 'about', 'investment', 'journal', 'contact'].map(p => `<option value="${p}" ${p === page ? 'selected' : ''}>${p[0].toUpperCase() + p.slice(1)}</option>`).join('')}</select>
      <div class="eyebrow" style="margin:22px 0 8px">Theme</div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">${THEMES.map(([n, bg, fg]) => `<button data-act="siteTheme" data-v="${n}" style="border:2px solid ${s.theme === n ? 'var(--ink)' : 'var(--line)'};border-radius:10px;padding:0;overflow:hidden;cursor:pointer;background:#fff"><div style="height:46px;background:${bg};display:grid;place-items:center;color:${fg};font-family:var(--serif);font-size:18px">Aa</div><div class="small" style="padding:5px">${n}</div></button>`).join('')}</div>
      <div class="eyebrow" style="margin:22px 0 8px">Heading font</div>
      ${FONTS.map(f => `<button class="btn block" data-act="siteFont" data-v="${f}" style="justify-content:flex-start;margin-bottom:6px;font-family:'${f}';font-size:16px;${s.font === f ? 'border-color:var(--ink)' : ''}">${f}</button>`).join('')}
      <div class="eyebrow" style="margin:22px 0 8px">Sections</div>
      ${['Hero slideshow', 'Intro text', 'Featured galleries', 'Testimonial', 'Instagram feed', 'Contact form'].map((n, i) => `<div class="row between" style="padding:8px 10px;border:1px solid var(--line);border-radius:8px;margin-bottom:6px;background:#fff"><span class="row small">${icon('more')}${n}</span><button class="toggle ${toggle('sec' + i, i !== 4) ? 'on' : ''}" data-act="toggle" data-key="sec${i}" data-def="${i !== 4 ? 1 : 0}"></button></div>`).join('')}
      <button class="btn block ghost" style="margin-top:4px">${icon('plus')}Add section</button>
    </div>
    <div style="display:flex;flex-direction:column;background:#eceef0;min-width:0">
      <div class="row" style="padding:10px 16px;background:#fff;border-bottom:1px solid var(--line)"><div class="seg">${['desktop', 'mobile'].map(d => `<button class="${d === dev ? 'on' : ''}" data-act="go" data-to="/website/design?page=${page}&dev=${d}">${icon(d === 'desktop' ? 'monitor' : 'phone')}</button>`).join('')}</div><span class="spacer"></span><span class="small muted">Unpublished changes</span><button class="btn sm primary" data-act="toast" data-msg="Website published">Publish</button></div>
      <div style="flex:1;display:grid;place-items:center;padding:20px;min-height:0"><iframe src="/#/site/${page}" style="border:0;background:#fff;box-shadow:var(--shadow-lg);width:${dev === 'mobile' ? '390px' : '100%'};height:100%;border-radius:${dev === 'mobile' ? '24px' : '6px'}"></iframe></div>
    </div></div>`, { flush: true });
});
actions.siteTheme = el => { state.site.theme = el.dataset.v; save(); rerender(); };
actions.siteFont = el => { state.site.font = el.dataset.v; save(); rerender(); };

route('/website/blog', () => shell('website', `
  ${head('Blog', 'Share stories, tips and recent sessions.', `<button class="btn primary" data-act="toast" data-msg="New post draft created">${icon('plus')}New post</button>`)}
  <div class="grid" style="grid-template-columns:repeat(2,1fr)">${posts.map(p => `<div class="card" style="overflow:hidden;display:flex"><img src="${img(p.img, 300, 240)}" style="width:150px;object-fit:cover"><div class="card-pad"><div class="row">${statusBadge(p.status)}<span class="small muted">${p.date}</span></div><h3 style="margin-top:10px">${p.title}</h3><a href="#/site/journal" target="_blank" class="small" style="color:var(--accent-ink);display:inline-block;margin-top:10px">View post →</a></div></div>`).join('')}</div>`));

/* ---------- Store ---------- */
route('/store', () => shell('store', `
  ${head('Orders', 'Prints and products ordered from your galleries. Fulfilled automatically by your print lab.', `<button class="btn" data-act="toast" data-msg="CSV exported">Export</button>`)}
  <div class="stats" style="margin-bottom:16px">${stat('Sales (30d)', money(1710), '↑ 22%')}${stat('Orders', '12')}${stat('Avg. order', money(142.5))}${stat('Print lab', 'WHCC', 'Auto-fulfillment on')}</div>
  <div class="card"><table class="table"><thead><tr><th>Order</th><th>Client</th><th>Gallery</th><th>Date</th><th>Items</th><th>Status</th><th class="num">Total</th></tr></thead><tbody>
  ${orders.map(o => `<tr class="click" data-act="orderDetail" data-id="${o.id}"><td style="font-weight:500">${o.id}</td><td><div class="row">${avatar(o.client, 26)}${o.client}</div></td><td class="muted">${o.gallery}</td><td class="muted">${o.date}</td><td>${o.items}</td><td>${statusBadge(o.status)}</td><td class="num">${money(o.total)}</td></tr>`).join('')}</tbody></table></div>`));
actions.orderDetail = el => {
  const o = orders.find(x => x.id === el.dataset.id);
  modal(`${modalHead(`Order ${o.id}`, `${o.client} · ${o.date}`)}<div class="modal-body">
    ${[['Gallery Canvas 16×20', 1, 220, 'po3'], ['Fine Art Print 8×10', 2, 40, 'ce5']].slice(0, o.items > 1 ? 2 : 1).map(([n, q, p, s]) => `<div class="row" style="padding:10px 0;border-bottom:1px solid var(--line-2)"><img src="${img(s, 120, 120)}" style="width:52px;height:52px;object-fit:cover;border-radius:6px"><div><div style="font-weight:500">${n}</div><div class="small muted">Qty ${q} · Lustre paper</div></div><span class="spacer"></span>${money(p * q)}</div>`).join('')}
    <div class="row between" style="padding-top:14px;font-weight:600"><span>Total</span><span>${money(o.total)}</span></div>
    <div class="row" style="margin-top:16px;padding:12px;background:var(--line-2);border-radius:8px">${icon('truck')}<span class="small">${o.status} · Ships via UPS Ground · Tracking 1Z999AA10123456784</span></div>
  </div><div class="modal-foot"><button class="btn" data-act="close">Close</button></div>`);
};

route('/store/products', () => shell('store', `
  ${head('Products', 'Price sheets and the products your clients can buy.', `<button class="btn primary" data-act="toast" data-msg="Product added">${icon('plus')}Add product</button>`)}
  <div class="row" style="margin-bottom:16px">${['Wedding Collection 2026', 'Portrait Basics'].map((n, i) => `<button class="chip ${i ? '' : 'on'}" data-act="seg">${n}</button>`).join('')}</div>
  <div class="gcards">${products.map(p => `<div class="card" style="overflow:hidden"><img src="${img(p.img, 500, 380)}" style="width:100%;aspect-ratio:4/3;object-fit:cover"><div class="card-pad"><div class="row between"><h3>${p.name}</h3><button class="toggle ${toggle('prod' + p.id, true) ? 'on' : ''}" data-act="toggle" data-key="prod${p.id}" data-def="1"></button></div><div class="small muted" style="margin-top:2px">${p.cat} · from ${money(p.from)}</div>
    <div style="margin-top:10px">${p.sizes.map(([s, pr]) => `<div class="row between small" style="padding:4px 0"><span>${s}</span><span class="muted">${money(pr)}</span></div>`).join('')}</div></div></div>`).join('')}</div>`));

route('/store/coupons', () => shell('store', `
  ${head('Coupons', 'Discount codes for sales and promotions.', `<button class="btn primary" data-act="toast" data-msg="Coupon created">${icon('plus')}New coupon</button>`)}
  <div class="card"><table class="table"><thead><tr><th>Code</th><th>Discount</th><th>Uses</th><th>Expires</th><th>Status</th></tr></thead><tbody>
  ${[['HOLIDAY20', '20% off prints', 14, 'Dec 31, 2026', 'Live'], ['FREESHIP', 'Free shipping over $100', 31, 'Never', 'Live'], ['WEDDING10', '10% off albums', 3, 'Expired', 'Expired']].map(r => `<tr><td><code style="font-weight:600">${r[0]}</code></td><td>${r[1]}</td><td>${r[2]}</td><td class="muted">${r[3]}</td><td>${statusBadge(r[4])}</td></tr>`).join('')}</tbody></table></div>`));

/* ---------- Mobile Gallery App ---------- */
route('/mobile', () => {
  const sel = query().get('app') || apps[0].gallery;
  return shell('mobile', `
  ${head('Mobile Gallery Apps', 'Give clients their photos as a branded app on their phone’s home screen.', `<button class="btn primary" data-act="toast" data-msg="Choose a gallery to turn into an app">${icon('plus')}New app</button>`)}
  <div class="grid" style="grid-template-columns:1fr 340px;gap:28px;align-items:start">
    <div class="stack">${apps.map(a => `<a href="#/mobile?app=${a.gallery}" class="card row" style="padding:14px;gap:14px;${a.gallery === sel ? 'border-color:var(--ink)' : ''}"><img src="${img(a.cover, 160, 160)}" style="width:64px;height:64px;border-radius:14px;object-fit:cover"><div style="flex:1"><h3>${a.name}</h3><div class="small muted">${a.installs} installs</div></div>${statusBadge(a.status)}</a>`).join('')}
      <div class="card card-pad"><h3>App settings</h3>
        ${setting('app-dl', 'Allow downloads in app', 'Clients can save photos straight to their camera roll.', true)}
        ${setting('app-brand', 'Show studio branding', 'Display your logo and contact details in the app.', true)}
        ${setting('app-share', 'Allow sharing', 'Let clients share photos to social media and messaging.', true)}
        <div class="row" style="margin-top:12px"><button class="btn sm" data-act="copyLink" data-url="${location.origin}/#/app/${sel}">${icon('link')}Copy app link</button><a class="btn sm" href="#/app/${sel}" target="_blank">${icon('external')}Open full screen</a></div></div></div>
    <div style="position:sticky;top:80px"><div class="phone"><div class="screen"><div class="notch"></div><iframe src="/#/app/${sel}" style="border:0;width:100%;height:100%"></iframe></div></div></div>
  </div>`);
});

/* ---------- Photo Editor ---------- */
const EDIT = { exposure: 0, contrast: 0, warmth: 0, saturation: 0, fade: 0 };
const RATINGS = ['★★★★★', '★★★★', 'Eyes closed', '★★★★', 'Blurry', '★★★★★', '★★★', 'Duplicate', '★★★★', '★★★★★', '★★★', '★★★★'];
const STYLES = [['Lena Signature', { exposure: 8, contrast: -10, warmth: 18, saturation: -12, fade: 14 }], ['Moody Film', { exposure: -10, contrast: 18, warmth: 6, saturation: -30, fade: 20 }], ['Bright & Airy', { exposure: 18, contrast: -16, warmth: 4, saturation: -6, fade: 10 }], ['True Color', { exposure: 0, contrast: 0, warmth: 0, saturation: 0, fade: 0 }]];
const filterCss = e => `brightness(${1 + e.exposure / 100}) contrast(${1 + e.contrast / 100}) saturate(${1 + e.saturation / 100}) sepia(${Math.max(0, e.warmth) / 200}) hue-rotate(${e.warmth < 0 ? e.warmth / 3 : 0}deg)`;

route('/editor', () => {
  const ph = galleries.find(x => x.id === 'emma-james').sets[2].photos;
  const cur = Number(query().get('p') || 0);
  const p = ph[cur];
  return shell('editor', `<div class="editor">
    <div class="canvas"><div class="view" style="position:relative"><img id="ed-img" src="${img(p.id, p.w, p.h)}" style="filter:${filterCss(EDIT)}"><div id="ed-fade" style="position:absolute;inset:0;background:rgba(255,255,255,${EDIT.fade / 300});pointer-events:none"></div></div>
      <div class="strip">${ph.map((x, i) => `<a class="th ${i === cur ? 'on' : ''}" href="#/editor?p=${i}"><img src="${img(x.id, Math.round(x.w / 8), Math.round(x.h / 8))}"><span class="r">${RATINGS[i % RATINGS.length]}</span></a>`).join('')}</div></div>
    <div class="panel">
      <div class="row between"><h3>${p.name}</h3><span class="badge ${/★★★★/.test(RATINGS[cur % 12]) ? 'green' : /★/.test(RATINGS[cur % 12]) ? '' : 'red'}">${RATINGS[cur % 12]}</span></div>
      <p class="small muted" style="margin:4px 0 16px">Emma &amp; James · Portraits</p>
      <div class="card" style="padding:14px;background:var(--accent-soft);border-color:#c5e8e3;margin-bottom:18px"><div class="row" style="font-weight:600;color:var(--accent-ink)">${icon('sparkles')}AI Culling</div>
        <p class="small" style="margin:6px 0 10px">Scanned ${ph.length} photos: 2 closed eyes, 1 blurry, 1 duplicate flagged.</p><button class="btn sm accent" data-act="toast" data-msg="4 flagged photos moved to Rejected">Reject flagged</button></div>
      <div class="eyebrow" style="margin-bottom:10px">AI Style</div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:6px;margin-bottom:18px">${STYLES.map(([n], i) => `<button class="btn sm" data-act="applyStyle" data-i="${i}">${n}</button>`).join('')}</div>
      <div class="eyebrow" style="margin-bottom:10px">Adjust</div>
      ${Object.keys(EDIT).map(k => `<div class="slider"><span>${k[0].toUpperCase() + k.slice(1)}</span><input type="range" min="-50" max="50" value="${EDIT[k]}" data-k="${k}"><span id="v-${k}">${EDIT[k]}</span></div>`).join('')}
      <div class="row" style="margin-top:18px"><button class="btn sm" data-act="resetEdit">Reset</button><span class="spacer"></span><button class="btn sm primary" data-act="toast" data-msg="Edits synced to all 14 photos">Sync to all</button></div>
      <button class="btn block" style="margin-top:10px" data-act="toast" data-msg="Edited photos sent to the Emma & James gallery">${icon('upload')}Export to gallery</button>
    </div></div>`, { flush: true });
});
onMountEditor();
function onMountEditor() {
  document.addEventListener('input', e => {
    const k = e.target.dataset?.k;
    if (!k || !(k in EDIT)) return;
    EDIT[k] = Number(e.target.value);
    document.getElementById('v-' + k).textContent = EDIT[k];
    applyEdit();
  });
}
function applyEdit() {
  const i = document.getElementById('ed-img'); if (i) i.style.filter = filterCss(EDIT);
  const f = document.getElementById('ed-fade'); if (f) f.style.background = `rgba(255,255,255,${EDIT.fade / 300})`;
}
actions.applyStyle = el => { Object.assign(EDIT, STYLES[el.dataset.i][1]); rerender(); toast(`Applied “${STYLES[el.dataset.i][0]}”`); };
actions.resetEdit = () => { Object.keys(EDIT).forEach(k => EDIT[k] = 0); rerender(); };

route('/editor/styles', () => shell('editor', `
  ${head('AI Styles', 'Train a style on your past edits and apply it to new sessions in seconds.', `<button class="btn primary" data-act="toast" data-msg="Upload 200+ edited photos to train a new style">${icon('plus')}Train new style</button>`)}
  <div class="gcards">${STYLES.map(([n, e], i) => `<div class="card" style="overflow:hidden"><div style="display:grid;grid-template-columns:1fr 1fr"><img src="${img('po' + (i + 2), 300, 360)}" style="aspect-ratio:5/6;object-fit:cover"><img src="${img('po' + (i + 2), 300, 360)}" style="aspect-ratio:5/6;object-fit:cover;filter:${filterCss(e)}"></div><div class="card-pad"><h3>${n}</h3><p class="small muted">${i === 0 ? 'Trained on 1,240 of your edits' : 'Pixieset preset'}</p></div></div>`).join('')}</div>`));

/* ---------- Settings ---------- */
route('/settings', () => {
  const tab = query().get('tab') || 'brand';
  const plans = [['Free', 0, '3 GB storage', ['Unlimited galleries', 'Store (15% commission)', 'Website on pixieset.com']], ['Basic', 8, '10 GB storage', ['Everything in Free', '0% store commission', 'Custom watermarks']], ['Plus', 20, '100 GB storage', ['Everything in Basic', 'Mobile Gallery App', 'Email campaigns']], ['Pro', 28, '1 TB storage', ['Everything in Plus', 'Remove Pixieset branding', 'Video in galleries']], ['Ultimate', 40, 'Unlimited storage', ['Everything in Pro', 'Priority support', 'Bulk gallery creation']]];
  return shell('settings', `${head('Settings', 'Your studio, branding and subscription.')}
    <div class="tabs">${[['brand', 'Brand'], ['account', 'Account'], ['billing', 'Plans & Billing'], ['payments', 'Payments']].map(([k, n]) => `<a href="#/settings?tab=${k}" class="${k === tab ? 'on' : ''}">${n}</a>`).join('')}</div>
    ${tab === 'billing' ? `<div class="grid" style="grid-template-columns:repeat(5,1fr)">${plans.map(([n, p, s, f]) => `<div class="card card-pad" style="${n === 'Plus' ? 'border-color:var(--ink);box-shadow:var(--shadow-lg)' : ''}">${n === 'Plus' ? '<span class="badge green" style="margin-bottom:8px">Current plan</span>' : ''}<h3>${n}</h3><div style="font-size:28px;font-weight:600;margin:6px 0">${money(p)}<span class="small muted" style="font-weight:400">/mo</span></div><div class="small muted">${s}</div><div style="margin:14px 0">${f.map(x => `<div class="row small" style="padding:3px 0">${icon('check')}${x}</div>`).join('')}</div><button class="btn sm block ${n === 'Plus' ? '' : 'primary'}" data-act="toast" data-msg="${n === 'Plus' ? 'This is your current plan' : 'Switched to ' + n}">${n === 'Plus' ? 'Current' : p > 20 ? 'Upgrade' : 'Downgrade'}</button></div>`).join('')}</div><p class="small faint" style="margin-top:12px">Prices billed annually. Studio Manager and Website plans are billed separately or as a bundle.</p>`
    : tab === 'payments' ? `<div class="card card-pad" style="max-width:720px"><div class="row" style="gap:14px"><div style="width:44px;height:44px;border-radius:10px;background:#635bff;display:grid;place-items:center;color:#fff;font-weight:700">S</div><div><h3>Stripe</h3><div class="small muted">Connected · Payouts to •••• 4421 every 2 days</div></div><span class="spacer"></span>${statusBadge('Live')}</div>
      ${setting('pay-apple', 'Apple Pay & Google Pay', 'Let clients pay with their phone wallet.', true)}${setting('pay-ach', 'Bank transfer (ACH)', 'Lower fees for large invoices.', true)}${setting('pay-tip', 'Tipping', 'Let clients add a tip when paying invoices.', false)}${setting('pay-tap', 'Tap to Pay', 'Accept in-person card payments in the Studio Manager mobile app.', false)}</div>`
    : tab === 'account' ? `<div class="card card-pad" style="max-width:640px"><div class="field"><label>Full name</label><input class="input" value="${studio.owner}"></div><div class="field"><label>Email</label><input class="input" value="${studio.email}"></div><div class="field"><label>Time zone</label><select class="input"><option>(GMT-07:00) Pacific Time</option></select></div><div class="field"><label>Currency</label><select class="input"><option>USD — US Dollar</option></select></div><button class="btn primary" data-act="toast" data-msg="Account saved">Save</button></div>`
    : `<div class="grid" style="grid-template-columns:1fr 1fr;gap:16px;max-width:980px"><div class="card card-pad"><div class="field"><label>Business name</label><input class="input" value="${studio.name}"></div><div class="field"><label>Logo</label><div class="row" style="padding:18px;border:1px dashed var(--line);border-radius:8px"><span class="serif" style="font-size:24px">Lena Hart</span><span class="spacer"></span><button class="btn sm">Replace</button></div></div><div class="field"><label>Website URL</label><input class="input" value="https://${studio.domain}"></div><div class="field"><label>Instagram</label><input class="input" value="@lenahart.photo"></div><button class="btn primary" data-act="toast" data-msg="Brand saved">Save</button></div>
      <div class="card card-pad"><h3>Watermark</h3><div style="position:relative;margin-top:12px;border-radius:8px;overflow:hidden"><img src="${img('po4', 600, 400)}"><span class="serif" style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,255,255,.6);font-size:34px">Lena Hart</span></div>${setting('wm', 'Apply watermark to proofing galleries', 'Recommended for unpaid sessions.', false)}</div></div>`}`);
});
