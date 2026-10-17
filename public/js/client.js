// Client-facing experiences plus the prototype launcher.
import { icon, logo, esc, money, statusBadge, route, onMount, actions, state, save, toggle, toast, modal, modalHead, closeModal, go, query, rerender } from './core.js';
import { img, studio, galleries, invoices, contracts, sessionTypes, products, posts } from './data.js';

/* ---------- Launcher ---------- */
const SUITE = [
  ['Dashboard', 'home', 'The photographer’s home: revenue, upcoming sessions, recent galleries and activity.', 'fam3', [['Open dashboard', '/dashboard']]],
  ['Client Gallery', 'gallery', 'Deliver, proof and sell photos. Includes the photographer’s gallery manager and what the client sees.', 'wed1', [['Gallery manager', '/gallery'], ['Gallery settings', '/gallery/g/emma-james?tab=privacy'], ['Client view ↗', '/g/emma-james']]],
  ['Studio Manager', 'studio', 'Clients, projects, calendar, booking, invoices, contracts and questionnaires.', 'eng', [['Overview', '/studio'], ['Projects board', '/studio/projects'], ['Booking page ↗', '/book'], ['Pay invoice ↗', '/pay/INV-1042'], ['Sign contract ↗', '/sign/k1']]],
  ['Website', 'globe', 'A portfolio website and blog with themes and a live design editor.', 'po2', [['Pages', '/website'], ['Design editor', '/website/design'], ['Live site ↗', '/site']]],
  ['Store', 'bag', 'Sell prints, wall art, albums and digital downloads from galleries, with lab fulfillment.', 'canvas', [['Orders', '/store'], ['Products', '/store/products'], ['Shop a gallery ↗', '/g/baby-oliver']]],
  ['Mobile Gallery App', 'phone', 'Each gallery as a branded app on the client’s phone home screen.', 'nb1', [['App manager', '/mobile'], ['Client app ↗', '/app/emma-james']]],
  ['Photo Editor', 'wand', 'AI culling and AI editing styles trained on the photographer’s own edits.', 'po5', [['Cull & edit', '/editor'], ['AI styles', '/editor/styles']]],
];
route('/', () => `<div style="min-height:100vh">
  <div class="row" style="padding:20px 32px">${logo(26)}<b style="font-size:17px;letter-spacing:-.01em">pixieset</b><span class="badge plain" style="margin-left:6px">Prototype</span><span class="spacer"></span><a class="btn primary" href="#/dashboard">Open dashboard</a></div>
  <div class="launch-hero"><div class="eyebrow">Photographer platform · clickable prototype</div><h1 style="margin-top:14px">Every Pixieset app, in one place.</h1>
    <p class="muted" style="font-size:16px;max-width:560px;margin:14px auto 0">Explore the photographer dashboard and the pages their clients see. Everything is clickable, and favorites, cart, payments and signatures are saved in your browser.</p></div>
  <div class="launch-grid">${SUITE.map(([n, ic, d, im, links]) => `<div class="launch-card"><a class="ph" href="#${links[0][1]}"><img loading="lazy" src="${img(im, 700, 400)}" alt=""></a>
    <div class="body"><div class="row"><span style="width:28px;height:28px;border-radius:8px;background:var(--ink);color:#fff;display:grid;place-items:center">${icon(ic)}</span><h2>${n}</h2></div><p class="muted">${d}</p>
    <div class="links">${links.map(([l, to]) => `<a class="chip" href="#${to}"${l.includes('↗') ? ' target="_blank"' : ''}>${l}</a>`).join('')}</div></div></div>`).join('')}
    <div class="launch-card" style="justify-content:center;padding:28px;background:var(--ink);color:#fff;border-color:var(--ink)"><div class="eyebrow" style="color:#9aa1aa">Try this flow</div><h2 style="margin:10px 0 12px;font-size:20px">Book → sign → pay → deliver → sell</h2>
      <ol style="margin:0;padding-left:18px;line-height:1.9;color:#d0d4d9"><li><a href="#/book" target="_blank" style="text-decoration:underline">Book a session</a> as a client</li><li>See it land in the <a href="#/studio/calendar" style="text-decoration:underline">calendar</a></li><li><a href="#/sign/k1" target="_blank" style="text-decoration:underline">Sign the contract</a> and <a href="#/pay/INV-1042" target="_blank" style="text-decoration:underline">pay the invoice</a></li><li>Favorite and buy prints from the <a href="#/g/emma-james" target="_blank" style="text-decoration:underline">gallery</a></li></ol>
      <button class="btn sm" style="margin-top:18px;align-self:flex-start;background:transparent;color:#fff;border-color:#444" data-act="resetProto">Reset prototype data</button></div>
  </div></div>`);
actions.resetProto = () => { localStorage.removeItem('pixieset-proto-v1'); location.reload(); };

/* ---------- Client Gallery (client view) ---------- */
const favs = id => (state.favs[id] ||= []);
const allPhotos = g => g.sets.flatMap(s => s.photos.map(p => ({ ...p, set: s.name })));
const cartCount = () => state.cart.reduce((a, c) => a + c.qty, 0);
const visited = id => state.toggles['visited-' + id];

route('/g/:id', ({ id }) => {
  const g = galleries.find(x => x.id === id) || galleries[0];
  const q = query(), view = q.get('view'), setIdx = Number(q.get('set') || 0);
  if (toggle(`email-${g.id}`, true) && !visited(g.id)) return `<div class="cg-cover"><img class="bg" src="${img(g.cover, 1800, 1100)}" alt=""><div class="in" style="background:#fff;color:var(--ink);padding:40px;width:min(400px,90vw);text-align:left">
      <div class="serif" style="font-size:30px;text-align:center">${esc(g.title)}</div><p class="muted small" style="text-align:center;margin:6px 0 22px">${studio.name}</p>
      <div class="field"><label>Your email</label><input class="input" value="${g.id === 'emma-james' ? 'emma.collins@mail.com' : ''}" placeholder="you@email.com"></div>
      ${toggle(`pw-${g.id}`, true) ? `<div class="field"><label>Gallery password</label><input class="input" type="password" value="emma2026"></div>` : ''}
      <button class="btn primary block lg" data-act="enterGallery" data-id="${g.id}">View gallery</button><p class="small faint" style="margin-top:12px;text-align:center">Prototype: details are pre-filled, so just continue.</p></div></div>`;
  if (q.has('set')) onMount(() => document.getElementById('cg-grid')?.scrollIntoView());
  const photos = view === 'favs' ? allPhotos(g).filter(p => favs(g.id).includes(p.id)) : g.sets[setIdx].photos;
  const fv = favs(g.id);
  return `<div class="cg">
    ${view ? '' : `<div class="cg-cover"><img class="bg" src="${img(g.cover, 1800, 1100)}" alt=""><div class="in"><h1>${esc(g.title)}</h1><div class="date">${g.date}</div><button class="view" data-act="scrollGrid">View Gallery</button></div>
      <div style="position:absolute;bottom:24px;left:0;right:0;text-align:center;z-index:1;font-size:11px;letter-spacing:.3em;text-transform:uppercase">${studio.name}</div></div>`}
    <div class="cg-bar" id="cg-grid"><div class="top"><div><div class="t">${esc(g.title)}</div><div class="small muted" style="letter-spacing:.12em;text-transform:uppercase;font-size:10px">${studio.name}</div></div><span class="spacer"></span>
      <a class="icon-btn" title="Favorites" href="#/g/${g.id}?view=favs" style="width:auto;padding:0 10px;gap:6px;display:inline-flex">${icon('heart')}<span class="small">${fv.length}</span></a>
      <button class="icon-btn" title="Download" data-act="downloadAll" data-id="${g.id}">${icon('download')}</button>
      <button class="icon-btn" title="Share" data-act="copyLink" data-url="${location.href.split('?')[0]}">${icon('share')}</button>
      <button class="icon-btn" title="Slideshow" data-act="slideshow" data-id="${g.id}">${icon('play')}</button>
      ${toggle(`st-${g.id}`, true) ? `<button class="icon-btn" title="Cart" data-act="cart" style="width:auto;padding:0 10px;gap:6px;display:inline-flex">${icon('cart')}<span class="small">${cartCount()}</span></button><button class="btn sm primary" data-act="buyAny" data-id="${g.id}">Buy photos</button>` : ''}</div>
      <div class="sets">${view === 'favs' ? `<a href="#/g/${g.id}" class="row" style="gap:4px">${icon('back')} Back to gallery</a><a class="on">Favorites (${fv.length})</a>` : g.sets.map((s, i) => `<a href="#/g/${g.id}?set=${i}" class="${i === setIdx ? 'on' : ''}">${s.name}</a>`).join('')}</div></div>
    <div class="cg-body">${photos.length ? `<div class="masonry">${photos.map((p, i) => `<div class="tile" data-act="lightbox" data-id="${g.id}" data-i="${i}" data-view="${view || ''}" data-set="${setIdx}"><img loading="lazy" src="${img(p.id, Math.round(p.w / 2), Math.round(p.h / 2))}" alt="">
        <div class="ov ${fv.includes(p.id) ? 'keep' : ''}"><button class="${fv.includes(p.id) ? 'fav' : ''}" data-act="fav" data-g="${g.id}" data-p="${p.id}" title="Favorite">${icon('heart')}</button><button data-act="dlOne" title="Download">${icon('download')}</button>${toggle(`st-${g.id}`, true) ? `<button data-act="buy" data-p="${p.id}" title="Buy">${icon('cart')}</button>` : ''}</div></div>`).join('')}</div>`
      : `<div style="text-align:center;padding:80px 0" class="muted">${view === 'favs' ? 'Tap the heart on any photo to add it to your favorites.' : 'No photos in this set yet.'}</div>`}</div>
    <div style="text-align:center;padding:40px;border-top:1px solid var(--line-2)" class="small muted"><span class="serif" style="font-size:20px;color:var(--ink)">${studio.name}</span><br>${studio.email} · <a href="#/site" style="text-decoration:underline">Website</a><div style="margin-top:14px" class="row" ><span class="spacer"></span>${logo(14, '#9aa1aa')}<span class="faint">Powered by Pixieset</span><span class="spacer"></span></div></div>
  </div>`;
});

actions.enterGallery = el => { state.toggles['visited-' + el.dataset.id] = true; save(); rerender(); };
actions.scrollGrid = () => document.getElementById('cg-grid').scrollIntoView({ behavior: 'smooth' });
actions.fav = (el, e) => {
  e.stopPropagation();
  const f = favs(el.dataset.g), p = el.dataset.p, i = f.indexOf(p);
  i >= 0 ? f.splice(i, 1) : f.push(p);
  save();
  if (document.querySelector('.lightbox')) { el.classList.toggle('on', i < 0); updateLbCounts(el.dataset.g); }
  else rerender();
};
actions.dlOne = (el, e) => { e?.stopPropagation(); toast('Downloading high-resolution photo'); };
actions.downloadAll = () => modal(`${modalHead('Download photos', 'Choose which photos and what size.')}<div class="modal-body">
  <div class="field"><label>Photos</label><div class="seg"><button class="on" data-act="seg">All photos</button><button data-act="seg">Favorites only</button></div></div>
  <div class="field"><label>Size</label><div class="seg"><button class="on" data-act="seg">High resolution</button><button data-act="seg">Web size</button></div></div>
  <div class="field"><label>Download PIN</label><input class="input" value="4821" style="max-width:120px"></div></div>
  <div class="modal-foot"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="startDl">${icon('download')}Download</button></div>`);
actions.startDl = () => { closeModal(); toast('Preparing your download. We’ll email you a link too.'); };

function photoList(id, view, set) {
  const g = galleries.find(x => x.id === id);
  return view === 'favs' ? allPhotos(g).filter(p => favs(id).includes(p.id)) : g.sets[set].photos;
}
function updateLbCounts() { /* favorites count in the bar updates when the lightbox closes */ }
actions.lightbox = (el, e) => {
  if (e.target.closest('button')) return;
  openLightbox(el.dataset.id, el.dataset.view, Number(el.dataset.set), Number(el.dataset.i));
};
function openLightbox(id, view, set, start, auto = false) {
  const list = photoList(id, view, set);
  let i = start, timer;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  const draw = () => {
    const p = list[i];
    lb.innerHTML = `<div class="bar"><span class="small" style="color:#999">${i + 1} / ${list.length}</span><span class="spacer"></span>
      <button class="icon-btn fav ${favs(id).includes(p.id) ? 'on' : ''}" data-act="fav" data-g="${id}" data-p="${p.id}">${icon('heart')}</button>
      <button class="icon-btn" data-act="dlOne">${icon('download')}</button>
      ${toggle(`st-${id}`, true) ? `<button class="icon-btn" data-act="buy" data-p="${p.id}">${icon('cart')}</button>` : ''}
      <button class="icon-btn" data-lb="close">${icon('x')}</button></div>
      <div class="stage"><button class="icon-btn nav l" data-lb="prev">${icon('left')}</button><img src="${img(p.id, p.w, p.h)}" alt=""><button class="icon-btn nav r" data-lb="next">${icon('right')}</button></div>
      <div class="bar" style="justify-content:center;color:#888" class="small">${p.name}</div>`;
  };
  const step = d => { i = (i + d + list.length) % list.length; draw(); };
  const close = () => { clearInterval(timer); lb.remove(); document.removeEventListener('keydown', key); rerender(); };
  const key = e => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'Escape') close(); };
  lb.addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (!b) return; ({ close, prev: () => step(-1), next: () => step(1) })[b.dataset.lb](); });
  document.addEventListener('keydown', key);
  draw();
  document.body.append(lb);
  if (auto) timer = setInterval(() => step(1), 3000);
}
actions.slideshow = el => openLightbox(el.dataset.id, '', Number(query().get('set') || 0), 0, true);

// Store: buy prints from a photo
let buying = null;
actions.buyAny = el => { const g = galleries.find(x => x.id === el.dataset.id); actions.buy({ dataset: { p: g.sets[0].photos[0].id } }, { stopPropagation() {} }); };
actions.buy = (el, e) => {
  e?.stopPropagation?.();
  buying = { photo: el.dataset.p, product: 0, size: 0 };
  drawBuy();
};
function drawBuy() {
  const pr = products[buying.product];
  modal(`${modalHead('Buy photo', 'Professionally printed by our lab and shipped to your door.')}<div class="modal-body" style="display:grid;grid-template-columns:240px 1fr;gap:22px">
    <div><img src="${img(buying.photo, 480, 600)}" style="width:100%;aspect-ratio:4/5;object-fit:cover;${pr.cat === 'Wall Art' ? 'box-shadow:0 10px 24px rgba(0,0,0,.25);border:' + (pr.name.includes('Framed') ? '12px solid #222' : '0') : ''}"></div>
    <div><div class="eyebrow" style="margin-bottom:8px">Product</div><div class="grid" style="grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px">${products.map((p, i) => `<button class="btn sm ${i === buying.product ? 'primary' : ''}" data-act="pickProd" data-i="${i}">${p.name}</button>`).join('')}</div>
      <div class="eyebrow" style="margin-bottom:8px">Size</div>${pr.sizes.map(([s, p], i) => `<label class="row between" style="padding:10px 12px;border:1px solid ${i === buying.size ? 'var(--ink)' : 'var(--line)'};border-radius:8px;margin-bottom:6px;cursor:pointer" data-act="pickSize" data-i="${i}"><span>${s}</span><b>${money(p)}</b></label>`).join('')}</div></div>
    <div class="modal-foot"><button class="btn" data-act="close">Cancel</button><button class="btn primary" data-act="addCart">${icon('cart')}Add to cart · ${money(pr.sizes[buying.size][1])}</button></div>`, 'wide');
}
actions.pickProd = el => { buying.product = Number(el.dataset.i); buying.size = 0; drawBuy(); };
actions.pickSize = el => { buying.size = Number(el.dataset.i); drawBuy(); };
actions.addCart = () => {
  const pr = products[buying.product], [size, price] = pr.sizes[buying.size];
  state.cart.push({ photo: buying.photo, name: pr.name, size, price, qty: 1 });
  save(); closeModal(); document.querySelector('.lightbox') || rerender(); toast('Added to cart');
};
actions.cart = () => {
  closeModal();
  const total = state.cart.reduce((a, c) => a + c.price * c.qty, 0);
  const d = document.createElement('div');
  d.className = 'drawer';
  d.innerHTML = `<div class="card-head"><h2>Your cart</h2><button class="icon-btn" data-act="close">${icon('x')}</button></div>
    <div style="flex:1;overflow-y:auto;padding:8px 20px">${state.cart.length ? state.cart.map((c, i) => `<div class="row" style="padding:14px 0;border-bottom:1px solid var(--line-2)"><img src="${img(c.photo, 120, 120)}" style="width:60px;height:60px;object-fit:cover;border-radius:4px"><div style="flex:1"><div style="font-weight:500">${c.name}</div><div class="small muted">${c.size}</div></div><div style="text-align:right"><div>${money(c.price)}</div><button class="btn ghost sm" data-act="rmCart" data-i="${i}" style="color:var(--muted)">Remove</button></div></div>`).join('') : '<p class="muted" style="padding:40px 0;text-align:center">Your cart is empty.</p>'}</div>
    ${state.cart.length ? `<div style="padding:20px;border-top:1px solid var(--line)"><div class="row between small muted"><span>Shipping</span><span>${total >= 100 ? 'Free' : money(12)}</span></div><div class="row between" style="font-weight:600;font-size:16px;margin:8px 0 16px"><span>Total</span><span>${money(total + (total >= 100 ? 0 : 12))}</span></div><button class="btn primary block lg" data-act="checkout">Checkout</button></div>` : ''}`;
  document.body.append(d);
};
actions.rmCart = el => { state.cart.splice(Number(el.dataset.i), 1); save(); actions.cart(); rerender(); };
actions.checkout = () => {
  closeModal();
  modal(`${modalHead('Checkout')}<div class="modal-body"><div class="field"><label>Shipping address</label><input class="input" value="Emma Collins, 214 Ocean Ave, Carmel, CA 93921"></div>
    <div class="field"><label>Card</label><input class="input" value="4242 4242 4242 4242   12/29   123"></div>
    <div class="field"><label>Coupon</label><div class="row"><input class="input" placeholder="HOLIDAY20"><button class="btn" data-act="toast" data-msg="Coupon applied: 20% off prints">Apply</button></div></div></div>
    <div class="modal-foot"><button class="btn primary block lg" data-act="placeOrder">Place order</button></div>`);
};
actions.placeOrder = () => { state.cart = []; save(); closeModal(); rerender(); modal(`<div class="modal-body" style="text-align:center;padding:40px 30px"><div style="width:56px;height:56px;border-radius:50%;background:var(--accent-soft);color:var(--accent-ink);display:grid;place-items:center;margin:0 auto 16px">${icon('check')}</div><h2>Order placed!</h2><p class="muted" style="margin:8px 0 20px">Order #10285 is on its way to the lab. We’ll email tracking details when it ships.</p><button class="btn primary" data-act="close">Back to gallery</button></div>`); };

/* ---------- Booking page ---------- */
const DAYS_AVAIL = [17, 18, 20, 21, 22, 23, 24, 27, 28, 29, 30, 31];
const TIMES = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];
const publicShell = inner => `<div class="public"><div class="public-head">Lena Hart</div><div class="public-body">${inner}</div><div class="row small faint" style="justify-content:center;padding-bottom:30px">${logo(14, '#9aa1aa')} Powered by Pixieset</div></div>`;
const steps = n => `<div class="steps">${['Session', 'Date & time', 'Details', 'Done'].map((s, i) => `${i ? '<span class="sep"></span>' : ''}<span class="s ${i === n ? 'on' : i < n ? 'done' : ''}"><b>${i < n ? '✓' : i + 1}</b>${s}</span>`).join('')}</div>`;

route('/book', () => publicShell(`${steps(0)}<h1 class="serif" style="font-size:40px;font-weight:400">Book a session</h1><p class="muted" style="margin:6px 0 26px">Choose the session that suits you. A deposit secures your date.</p>
  <div class="grid" style="grid-template-columns:repeat(2,1fr);gap:18px">${sessionTypes.filter(s => toggle('sess' + s.id, true)).map(s => `<a class="card" href="#/book/${s.id}" style="overflow:hidden;display:block"><img src="${img(s.img, 700, 380)}" style="width:100%;aspect-ratio:16/8;object-fit:cover"><div class="card-pad"><div class="row between"><h2>${s.name}</h2><b>${s.price ? money(s.price) : 'Free'}</b></div><p class="muted" style="margin-top:6px">${s.desc}</p><div class="row small muted" style="margin-top:10px">${icon('clock')}${s.duration}</div></div></a>`).join('')}</div>`));

route('/book/:sid', ({ sid }) => {
  const s = sessionTypes.find(x => x.id === sid) || sessionTypes[0];
  const q = query(), day = Number(q.get('d') || 0), time = q.get('t');
  const step = q.get('step');
  const summary = `<div class="card card-pad" style="position:sticky;top:20px"><img src="${img(s.img, 500, 300)}" style="border-radius:8px;margin-bottom:14px"><h3>${s.name}</h3><div class="small muted" style="margin:4px 0 12px">${s.duration} · ${s.price ? money(s.price) : 'Free'}</div>${day ? `<div class="row small">${icon('calendar')}Oct ${day}, 2026${time ? ' · ' + time : ''}</div>` : ''}${s.deposit ? `<div class="row between" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line)"><span>Deposit due today</span><b>${money(s.deposit)}</b></div>` : ''}</div>`;
  if (step === 'done') return publicShell(`${steps(3)}<div class="card" style="text-align:center;padding:56px 30px;max-width:560px;margin:0 auto"><div style="width:60px;height:60px;border-radius:50%;background:var(--accent-soft);color:var(--accent-ink);display:grid;place-items:center;margin:0 auto 18px">${icon('check')}</div><h1 class="serif" style="font-weight:400;font-size:36px">You’re booked!</h1><p class="muted" style="margin:10px 0 24px">${s.name} on <b>Oct ${day}, 2026 at ${time}</b>. A confirmation, your contract and a short questionnaire are on their way to your inbox.</p><div class="row" style="justify-content:center"><button class="btn" data-act="toast" data-msg="Added to your calendar">${icon('calendar')}Add to calendar</button><a class="btn primary" href="#/sign/k1">Review contract</a></div></div>`);
  if (step === 'details') return publicShell(`${steps(2)}<div class="grid" style="grid-template-columns:1.5fr 1fr;gap:24px;align-items:start"><div class="card card-pad"><h2 style="margin-bottom:16px">Your details</h2>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>First name</label><input class="input" value="Grace"></div><div class="field"><label>Last name</label><input class="input" value="Kim"></div></div>
    <div class="field"><label>Email</label><input class="input" value="grace.kim@mail.com"></div><div class="field"><label>Phone</label><input class="input" value="(415) 555-0133"></div>
    <div class="field"><label>Anything I should know?</label><textarea class="input">We’d love some golden-hour photos by the water!</textarea></div>
    ${s.deposit ? `<h2 style="margin:22px 0 12px">Payment</h2><div class="field"><label>Card</label><input class="input" value="4242 4242 4242 4242   12/29   123"></div>` : ''}
    <button class="btn primary lg block" data-act="confirmBooking" data-s="${s.id}" data-d="${day}" data-t="${time}">${s.deposit ? `Pay ${money(s.deposit)} & book` : 'Confirm booking'}</button></div>${summary}</div>`);
  const cal = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div class="h">${d}</div>`).join('') + '<div></div>'.repeat(4) + Array.from({ length: 31 }, (_, i) => { const d = i + 1, av = DAYS_AVAIL.includes(d); return `<button class="${d === day ? 'on' : av ? 'av' : ''}" ${av ? `data-act="go" data-to="/book/${s.id}?d=${d}"` : 'disabled'}>${d}</button>`; }).join('');
  return publicShell(`${steps(1)}<a href="#/book" class="row small muted" style="gap:4px;margin-bottom:14px">${icon('back')}All sessions</a><div class="grid" style="grid-template-columns:1.5fr 1fr;gap:24px;align-items:start"><div class="card card-pad">
    <div class="row between" style="margin-bottom:12px"><h2>October 2026</h2><div class="row"><button class="icon-btn" disabled>${icon('left')}</button><button class="icon-btn" data-act="toast" data-msg="November opens Oct 20">${icon('right')}</button></div></div>
    <div class="mini-cal">${cal}</div>
    ${day ? `<h3 style="margin:22px 0 10px">Available times · Oct ${day}</h3><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px">${TIMES.map(t => `<button class="slot ${t === time ? 'on' : ''}" data-act="go" data-to="/book/${s.id}?d=${day}&t=${encodeURIComponent(t)}">${t}</button>`).join('')}</div>` : '<p class="muted small" style="margin-top:16px">Pick a highlighted date to see available times.</p>'}
    ${time ? `<button class="btn primary lg block" style="margin-top:20px" data-act="go" data-to="/book/${s.id}?d=${day}&t=${encodeURIComponent(time)}&step=details">Continue</button>` : ''}</div>${summary}</div>`);
});
actions.confirmBooking = el => {
  const s = sessionTypes.find(x => x.id === el.dataset.s);
  state.booked = { day: Number(el.dataset.d), time: el.dataset.t, name: `${s.name} — Grace` };
  save();
  go(`/book/${s.id}?d=${el.dataset.d}&t=${encodeURIComponent(el.dataset.t)}&step=done`);
};

/* ---------- Invoice payment ---------- */
route('/pay/:id', ({ id }) => {
  const inv = invoices.find(x => x.id === id) || invoices[0];
  const paid = state.paid[inv.id] || inv.paid >= inv.amount;
  const due = paid ? 0 : inv.amount - inv.paid;
  return publicShell(`<a href="#/studio/invoices" class="row small muted" style="gap:4px;margin-bottom:14px">${icon('back')}Back to dashboard (prototype)</a><div class="grid" style="grid-template-columns:1.6fr 1fr;gap:24px;align-items:start">
    <div class="paper"><div class="row between" style="align-items:flex-start"><div><div class="serif" style="font-size:28px">Lena Hart</div><div class="small muted">${studio.email}<br>Carmel-by-the-Sea, CA</div></div><div style="text-align:right"><div class="eyebrow">Invoice</div><div style="font-size:18px;font-weight:600">${inv.id}</div>${statusBadge(paid ? 'Paid' : inv.status)}</div></div>
      <div class="row" style="margin:30px 0;gap:60px"><div><div class="eyebrow">Billed to</div><div style="margin-top:4px">${inv.client}</div></div><div><div class="eyebrow">Project</div><div style="margin-top:4px">${inv.project}</div></div><div><div class="eyebrow">Due</div><div style="margin-top:4px">${inv.due}</div></div></div>
      <table class="table"><thead><tr><th style="padding-left:0">Item</th><th>Qty</th><th class="num" style="padding-right:0">Amount</th></tr></thead><tbody>${inv.items.map(([n, q, p]) => `<tr><td style="padding-left:0">${n}</td><td>${q}</td><td class="num" style="padding-right:0">${p ? money(p * q) : 'Included'}</td></tr>`).join('')}</tbody></table>
      <div style="margin-left:auto;width:260px;margin-top:18px"><div class="row between" style="padding:4px 0"><span class="muted">Total</span><span>${money(inv.amount)}</span></div><div class="row between" style="padding:4px 0"><span class="muted">Paid</span><span>${money(paid ? inv.amount : inv.paid)}</span></div><div class="row between" style="padding:10px 0;border-top:1px solid var(--line);font-weight:600;font-size:16px;margin-top:6px"><span>Amount due</span><span>${money(due)}</span></div></div>
      <p class="small muted" style="margin-top:30px">Thank you for choosing Lena Hart Photography! Your remaining balance is due 7 days before your session.</p></div>
    <div class="card card-pad" style="position:sticky;top:20px">${paid ? `<div style="text-align:center;padding:20px 0"><div style="width:56px;height:56px;border-radius:50%;background:var(--accent-soft);color:var(--accent-ink);display:grid;place-items:center;margin:0 auto 14px">${icon('check')}</div><h2>Paid in full</h2><p class="muted small" style="margin-top:6px">A receipt has been emailed to you.</p><button class="btn" style="margin-top:16px" data-act="toast" data-msg="Receipt downloaded">${icon('download')}Receipt</button></div>`
      : `<div class="small muted">Amount due</div><div style="font-size:32px;font-weight:600;margin-bottom:16px">${money(due)}</div>
      <div class="seg" style="width:100%;margin-bottom:14px"><button class="on" data-act="seg" style="flex:1">Card</button><button data-act="seg" style="flex:1">Bank</button><button data-act="seg" style="flex:1">Wallet</button></div>
      <div class="field"><label>Card number</label><input class="input" value="4242 4242 4242 4242"></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label>Expiry</label><input class="input" value="12 / 29"></div><div class="field"><label>CVC</label><input class="input" value="123"></div></div>
      <button class="btn primary lg block" data-act="payInvoice" data-id="${inv.id}">${icon('lock')}Pay ${money(due)}</button><p class="small faint" style="text-align:center;margin-top:10px">Secure payment powered by Stripe</p>`}</div></div>`);
});
actions.payInvoice = el => { state.paid[el.dataset.id] = true; save(); rerender(); toast('Payment successful'); };

/* ---------- Contract signing ---------- */
route('/sign/:id', ({ id }) => {
  const k = contracts.find(x => x.id === id) || contracts[0];
  const signed = state.signed[k.id] || k.status === 'Signed';
  return publicShell(`<a href="#/studio/contracts" class="row small muted" style="gap:4px;margin-bottom:14px">${icon('back')}Back to dashboard (prototype)</a><div class="paper" style="max-width:760px;margin:0 auto">
    <div class="eyebrow">Contract</div><h1 class="serif" style="font-weight:400;font-size:34px;margin:6px 0 4px">${k.name}</h1><p class="muted small">Between Lena Hart Photography (“Photographer”) and ${k.client} (“Client”)</p>
    ${[['1. Services', 'Photographer agrees to provide photographic services for a two-hour engagement session on the date and at the location agreed in writing. Client will receive an online gallery with no fewer than 40 professionally edited images.'], ['2. Retainer & Payment', 'A non-refundable retainer of $200 secures the date. The remaining balance is due no later than seven (7) days before the session.'], ['3. Rescheduling', 'Client may reschedule once without penalty with at least 72 hours’ notice. Weather-related rescheduling is always free of charge.'], ['4. Image Delivery & Usage', 'Images will be delivered within three (3) weeks. Client receives a personal-use license; Photographer retains copyright and may use images for portfolio and marketing.'], ['5. Limitation of Liability', 'In the unlikely event of equipment failure or loss of images, Photographer’s liability is limited to a full refund of payments received.']]
      .map(([h, t]) => `<h3 style="margin:24px 0 6px">${h}</h3><p style="color:var(--ink-2)">${t}</p>`).join('')}
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:30px;margin-top:40px">
      <div><div class="sig" style="height:50px">Lena Hart</div><div style="border-top:1px solid var(--ink);padding-top:6px" class="small muted">Photographer · Oct 14, 2026</div></div>
      <div>${signed ? `<div class="sig" style="height:50px">${k.client}</div><div style="border-top:1px solid var(--ink);padding-top:6px" class="small muted">Client · Signed Oct 16, 2026</div>`
        : `<input class="input" id="sig-name" placeholder="Type your full name" style="margin-bottom:8px"><button class="btn primary block" data-act="signContract" data-id="${k.id}">${icon('pen')}Sign contract</button>`}</div></div>
    ${signed ? `<div class="row" style="margin-top:30px;padding:14px;background:#e7f6ee;border-radius:8px;color:#18794e">${icon('check')}Signed. A copy has been emailed to both parties.<span class="spacer"></span><a class="btn sm" href="#/pay/INV-1042">Pay retainer →</a></div>` : ''}</div>`);
});
actions.signContract = el => {
  if (!document.getElementById('sig-name').value.trim()) return toast('Type your name to sign');
  state.signed[el.dataset.id] = true; save(); rerender(); toast('Contract signed');
};

/* ---------- Portfolio website ---------- */
const THEMES = { Ivory: ['#fbf9f6', '#2a2723', '#e8e3dc'], Noir: ['#141414', '#f2f0ec', '#2a2a2a'], Sage: ['#eef0ea', '#2f3a30', '#d9ddd2'], Blush: ['#fbf3f0', '#4a2f2c', '#efdcd6'] };
route('/site', () => site('home'));
route('/site/:page', ({ page }) => site(page));
function site(page) {
  const s = state.site || { theme: 'Ivory', font: 'Cormorant Garamond' };
  const [bg, fg, line] = THEMES[s.theme] || THEMES.Ivory;
  const font = `font-family:'${s.font}',serif;${s.font === 'Inter' ? 'font-weight:600;letter-spacing:-.02em;' : ''}`;
  const nav = ['portfolio', 'about', 'investment', 'journal', 'client', 'contact'];
  const H = (t, size = 40) => `<h2 class="s" style="${font}font-size:${size}px">${t}</h2>`;
  let body = '';
  if (page === 'home') body = `<div class="hero"><img src="${img('wed2', 1800, 1000)}" alt=""><div class="cap"><div style="letter-spacing:.3em;font-size:11px;text-transform:uppercase;margin-bottom:12px">Weddings · Families · Brands</div><h1 style="${font}">Honest photographs<br>for the in-between moments.</h1></div></div>
    <section style="text-align:center;max-width:760px;margin:0 auto">${H('Hello, I’m Lena')}<p style="margin:18px 0 26px;font-size:16px;line-height:1.8;opacity:.8">A wedding and family photographer based in Carmel-by-the-Sea, California. I love foggy beaches, golden hour and real, unposed connection, and I travel wherever your story takes us.</p><a class="btn-line" href="#/site/about">More about me</a></section>
    <section style="padding-top:0"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${['wed3', 'fam2', 'el2'].map((p, i) => `<a href="#/site/portfolio" style="display:block"><img src="${img(p, 600, 780)}" style="aspect-ratio:4/5;object-fit:cover;width:100%"><div style="text-align:center;margin-top:12px;letter-spacing:.2em;font-size:11px;text-transform:uppercase">${['Weddings', 'Families', 'Elopements'][i]}</div></a>`).join('')}</div></section>
    <section style="background:${line};text-align:center"><p style="${font}font-size:28px;max-width:760px;margin:0 auto;line-height:1.4;font-style:italic">“Lena made us feel completely at ease. Every time we open our gallery we cry happy tears all over again.”</p><div style="margin-top:16px;letter-spacing:.2em;font-size:11px;text-transform:uppercase">Emma &amp; James</div></section>
    <section style="text-align:center">${H('Let’s create something beautiful')}<div style="margin-top:22px"><a class="btn-line" href="#/book" target="_top">Book a session</a></div></section>`;
  else if (page === 'portfolio') body = `<section>${H('Portfolio', 48)}<div style="columns:3 260px;column-gap:14px;margin-top:30px">${galleries.flatMap(g => g.sets[0].photos.slice(0, 3)).map(p => `<img loading="lazy" src="${img(p.id, Math.round(p.w / 2), Math.round(p.h / 2))}" style="width:100%;margin-bottom:14px">`).join('')}</div></section>`;
  else if (page === 'about') body = `<section style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center"><img src="${img('portrait-lena', 700, 900)}" style="width:100%"><div>${H('About Lena', 48)}<p style="margin-top:20px;line-height:1.9;opacity:.85">I picked up my grandfather’s film camera at fourteen and never put it down. Twelve years and 300+ weddings later, I still believe the best photographs happen between the poses: the laugh after the kiss, the little hand reaching for yours.</p><p style="margin-top:14px;line-height:1.9;opacity:.85">When I’m not shooting you’ll find me surfing badly, baking sourdough, or walking our dog Juniper on Carmel Beach.</p><div style="margin-top:26px"><a class="btn-line" href="#/site/contact">Say hello</a></div></div></section>`;
  else if (page === 'investment') body = `<section style="text-align:center">${H('Investment', 48)}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px;text-align:left">${[['Portraits', 'from $450', 'One-hour session, online gallery, print release'], ['Elopements', 'from $2,800', 'Up to four hours, two locations, sneak peeks in 48 hours'], ['Weddings', 'from $5,800', 'Full-day coverage, second shooter, heirloom album']].map(([n, p, d]) => `<div style="border:1px solid ${line};padding:34px"><div style="letter-spacing:.2em;font-size:11px;text-transform:uppercase">${n}</div><div style="${font}font-size:34px;margin:10px 0">${p}</div><p style="opacity:.75;line-height:1.7">${d}</p></div>`).join('')}</div><div style="margin-top:40px"><a class="btn-line" href="#/book" target="_top">Check availability</a></div></section>`;
  else if (page === 'journal') body = `<section>${H('Journal', 48)}<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:40px;margin-top:30px">${posts.filter(p => p.status === 'Published').map(p => `<article><img src="${img(p.img, 800, 520)}" style="width:100%;aspect-ratio:16/10;object-fit:cover"><div style="letter-spacing:.2em;font-size:11px;text-transform:uppercase;margin-top:16px;opacity:.6">${p.date}</div><h3 style="${font}font-size:26px;font-weight:400;margin-top:6px">${p.title}</h3></article>`).join('')}</div></section>`;
  else if (page === 'client') body = `<section>${H('Client Galleries', 48)}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:30px">${galleries.filter(g => g.status === 'Published' && !toggle('hide-' + g.id)).map(g => `<a href="#/g/${g.id}" target="_top"><img src="${img(g.cover, 600, 450)}" style="aspect-ratio:4/3;object-fit:cover;width:100%"><div style="${font}font-size:22px;margin-top:10px">${g.title}</div><div style="font-size:12px;opacity:.6">${g.date}</div></a>`).join('')}</div></section>`;
  else body = `<section style="display:grid;grid-template-columns:1fr 1fr;gap:60px">${'<div>' + H('Get in touch', 48) + `<p style="margin-top:18px;line-height:1.8;opacity:.8">Tell me about your plans. I reply to every message within one business day.</p><p style="margin-top:20px">${studio.email}<br>@lenahart.photo</p></div>`}
    <div><div class="field"><label>Name</label><input class="input"></div><div class="field"><label>Email</label><input class="input"></div><div class="field"><label>Event date</label><input class="input" type="date"></div><div class="field"><label>Message</label><textarea class="input"></textarea></div><button class="btn-line" data-act="toast" data-msg="Thanks! Lena will be in touch soon.">Send inquiry</button></div></section>`;
  return `<div class="site" style="background:${bg};color:${fg}"><nav><a class="logo" href="#/site" style="${font}">LENA HART</a><div class="links">${nav.map(n => `<a href="#/site/${n}" class="${n === page ? 'on' : ''}">${n === 'client' ? 'Clients' : n}</a>`).join('')}</div></nav>${body}
    <footer style="border-color:${line}"><span>© 2026 Lena Hart Photography</span><span>Made with Pixieset</span></footer></div>`;
}

/* ---------- Mobile Gallery App ---------- */
route('/app/:id', ({ id }) => {
  const g = galleries.find(x => x.id === id) || galleries[0];
  const tab = query().get('tab') || 'photos';
  const fv = favs(g.id);
  const list = tab === 'favs' ? allPhotos(g).filter(p => fv.includes(p.id)) : allPhotos(g);
  const sq = p => `<div data-act="appPhoto" data-g="${g.id}" data-p="${p.id}" style="aspect-ratio:1;overflow:hidden;cursor:pointer;position:relative"><img loading="lazy" src="${img(p.id, 240, 240)}" style="width:100%;height:100%;object-fit:cover">${fv.includes(p.id) ? `<span style="position:absolute;right:4px;bottom:4px;color:#fff">${icon('heart', '')}</span>` : ''}</div>`;
  const inFrame = window.self !== window.top;
  const app = `<div style="height:100%;display:flex;flex-direction:column;background:#fff;font-size:13px">
    <div style="flex:1;overflow-y:auto" data-scroll="app">
      ${tab === 'photos' ? `<div style="position:relative;height:330px"><img src="${img(g.cover, 600, 700)}" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.55));display:flex;flex-direction:column;justify-content:flex-end;padding:20px;color:#fff"><div class="serif" style="font-size:30px;line-height:1.1">${esc(g.title)}</div><div style="font-size:10px;letter-spacing:.24em;text-transform:uppercase;margin-top:6px">${g.date}</div></div></div>` : `<div style="padding:52px 16px 12px"><div class="serif" style="font-size:26px">${tab === 'favs' ? 'Favorites' : 'Lena Hart'}</div></div>`}
      ${tab === 'info' ? `<div style="padding:0 16px"><img src="${img('portrait-lena', 400, 300)}" style="border-radius:10px"><p style="margin:14px 0;line-height:1.6" class="muted">Thank you for letting me capture your story! Save this app to your home screen to keep your photos close.</p>${[['mail', studio.email], ['globe', studio.domain], ['camera', '@lenahart.photo']].map(([i, t]) => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line-2)">${icon(i)}${t}</div>`).join('')}<a href="#/book" target="_top" class="btn primary block" style="margin-top:16px">Book another session</a></div>`
        : list.length ? `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px">${list.map(sq).join('')}</div>` : `<p class="muted" style="padding:30px 16px;text-align:center">Tap a photo, then the heart, to save favorites here.</p>`}
    </div>
    <div style="display:flex;border-top:1px solid var(--line);padding:8px 0 ${inFrame ? 18 : 10}px;background:#fff">${[['photos', 'grid', 'Photos'], ['favs', 'heart', 'Favorites'], ['info', 'users', 'Contact']].map(([k, i, n]) => `<a href="#/app/${g.id}?tab=${k}" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;color:${k === tab ? 'var(--ink)' : 'var(--faint)'}">${icon(i)}${n}</a>`).join('')}</div></div>`;
  return inFrame ? `<div style="height:100vh">${app}</div>` : `<div style="min-height:100vh;display:grid;place-items:center;background:#e9ebee;padding:30px"><div class="phone"><div class="screen"><div class="notch"></div>${app}</div></div></div>`;
});
actions.appPhoto = el => {
  const g = el.dataset.g, p = galleries.find(x => x.id === g) && allPhotos(galleries.find(x => x.id === g)).find(x => x.id === el.dataset.p);
  const host = el.closest('.screen') || document.body;
  const v = document.createElement('div');
  v.style.cssText = 'position:absolute;inset:0;background:#000;z-index:20;display:flex;flex-direction:column;color:#fff' + (host === document.body ? ';position:fixed' : '');
  const fav = () => favs(g).includes(p.id);
  const draw = () => v.innerHTML = `<div class="row" style="padding:44px 10px 10px"><button class="icon-btn" style="color:#fff" data-x>${icon('left')}</button><span class="spacer"></span><button class="icon-btn" style="color:#fff" data-f>${fav() ? icon('heart').replace('class="i ', 'style="fill:#fff" class="i ') : icon('heart')}</button><button class="icon-btn" style="color:#fff" data-act="toast" data-msg="Saved to Photos">${icon('download')}</button><button class="icon-btn" style="color:#fff" data-act="toast" data-msg="Share sheet opened">${icon('share')}</button></div><div style="flex:1;display:grid;place-items:center;min-height:0"><img src="${img(p.id, p.w / 2, p.h / 2)}" style="max-height:100%;object-fit:contain"></div>`;
  v.addEventListener('click', e => {
    if (e.target.closest('[data-x]')) { v.remove(); rerender(); }
    if (e.target.closest('[data-f]')) { const f = favs(g), i = f.indexOf(p.id); i >= 0 ? f.splice(i, 1) : f.push(p.id); save(); draw(); }
  });
  draw();
  host.append(v);
};
