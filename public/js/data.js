// Mock data for the prototype. Everything is fake; images come from picsum.photos.
export const img = (seed, w = 800, h = 600) => `https://picsum.photos/seed/px-${seed}/${w}/${h}`;

export const studio = {
  name: 'Lena Hart Photography',
  owner: 'Lena Hart',
  email: 'hello@lenahart.co',
  domain: 'lenahart.pixieset.com',
};

const shapes = [[800, 1100], [1100, 760], [800, 1000], [1100, 730], [900, 1200], [1200, 800]];
const photos = (prefix, n) => Array.from({ length: n }, (_, i) => {
  const [w, h] = shapes[i % shapes.length];
  return { id: `${prefix}${i + 1}`, w, h, name: `${prefix.toUpperCase()}_${String(4120 + i).padStart(4, '0')}.jpg` };
});

export const galleries = [
  { id: 'emma-james', title: 'Emma & James', subtitle: 'Wedding · Big Sur', date: 'Sep 14, 2026', cover: 'wed1', status: 'Published', views: 1284, favs: 212, downloads: 86, sets: [
    { name: 'Getting Ready', photos: photos('gr', 12) },
    { name: 'Ceremony', photos: photos('ce', 16) },
    { name: 'Portraits', photos: photos('po', 14) },
    { name: 'Reception', photos: photos('re', 12) },
  ], client: 'Emma Collins', expires: 'Mar 14, 2027' },
  { id: 'nguyen-family', title: 'The Nguyen Family', subtitle: 'Fall Mini Session', date: 'Oct 3, 2026', cover: 'fam1', status: 'Published', views: 342, favs: 48, downloads: 31, sets: [
    { name: 'Highlights', photos: photos('nf', 18) },
  ], client: 'Linh Nguyen', expires: 'Jan 3, 2027' },
  { id: 'aurora-brand', title: 'Aurora Ceramics', subtitle: 'Brand Session', date: 'Sep 28, 2026', cover: 'brand1', status: 'Published', views: 97, favs: 15, downloads: 54, sets: [
    { name: 'Products', photos: photos('ap', 10) },
    { name: 'Studio', photos: photos('as', 8) },
  ], client: 'Maya Ortiz', expires: 'Never' },
  { id: 'sofia-senior', title: 'Sofia — Class of 2027', subtitle: 'Senior Portraits', date: 'Oct 10, 2026', cover: 'sen1', status: 'Draft', views: 0, favs: 0, downloads: 0, sets: [
    { name: 'Selects', photos: photos('ss', 14) },
  ], client: 'Sofia Ramirez', expires: '—' },
  { id: 'baby-oliver', title: 'Baby Oliver', subtitle: 'Newborn', date: 'Aug 22, 2026', cover: 'nb1', status: 'Published', views: 610, favs: 77, downloads: 40, sets: [
    { name: 'Newborn', photos: photos('nb', 15) },
  ], client: 'Priya Shah', expires: 'Feb 22, 2027' },
  { id: 'harbor-elopement', title: 'Harbor Elopement', subtitle: 'Elopement · Seattle', date: 'Jul 30, 2026', cover: 'el1', status: 'Expired', views: 905, favs: 133, downloads: 120, sets: [
    { name: 'All Photos', photos: photos('he', 20) },
  ], client: 'Noah Bennett', expires: 'Oct 1, 2026' },
];

export const clients = [
  { id: 'c1', name: 'Emma Collins', email: 'emma.collins@mail.com', phone: '(415) 555-0142', tag: 'Wedding', projects: 1, lifetime: 6800, last: 'Today' },
  { id: 'c2', name: 'Linh Nguyen', email: 'linh.n@mail.com', phone: '(206) 555-0198', tag: 'Family', projects: 2, lifetime: 950, last: 'Yesterday' },
  { id: 'c3', name: 'Maya Ortiz', email: 'maya@auroraceramics.co', phone: '(503) 555-0110', tag: 'Brand', projects: 1, lifetime: 1800, last: '3 days ago' },
  { id: 'c4', name: 'Sofia Ramirez', email: 'sofia.r@mail.com', phone: '(408) 555-0167', tag: 'Senior', projects: 1, lifetime: 650, last: '1 week ago' },
  { id: 'c5', name: 'Priya Shah', email: 'priya.shah@mail.com', phone: '(650) 555-0121', tag: 'Newborn', projects: 1, lifetime: 850, last: '2 weeks ago' },
  { id: 'c6', name: 'Noah Bennett', email: 'noah.b@mail.com', phone: '(206) 555-0175', tag: 'Elopement', projects: 1, lifetime: 3200, last: '1 month ago' },
  { id: 'c7', name: 'Grace Kim', email: 'grace.kim@mail.com', phone: '(415) 555-0133', tag: 'Lead', projects: 0, lifetime: 0, last: 'Today' },
];

export const projects = [
  { id: 'p1', name: 'Emma & James Wedding', client: 'Emma Collins', date: 'Sep 14, 2026', stage: 'Delivered', type: 'Wedding', value: 6800 },
  { id: 'p2', name: 'Nguyen Fall Mini', client: 'Linh Nguyen', date: 'Oct 3, 2026', stage: 'Editing', type: 'Family', value: 450 },
  { id: 'p3', name: 'Aurora Brand Session', client: 'Maya Ortiz', date: 'Sep 28, 2026', stage: 'Delivered', type: 'Brand', value: 1800 },
  { id: 'p4', name: 'Sofia Senior Portraits', client: 'Sofia Ramirez', date: 'Oct 10, 2026', stage: 'Editing', type: 'Senior', value: 650 },
  { id: 'p5', name: 'Grace Kim Engagement', client: 'Grace Kim', date: 'Nov 8, 2026', stage: 'Inquiry', type: 'Engagement', value: 900 },
  { id: 'p6', name: 'Collins Anniversary', client: 'Emma Collins', date: 'Dec 2, 2026', stage: 'Booked', type: 'Couples', value: 550 },
  { id: 'p7', name: 'Nguyen Holiday Cards', client: 'Linh Nguyen', date: 'Nov 20, 2026', stage: 'Booked', type: 'Family', value: 500 },
];

export const invoices = [
  { id: 'INV-1042', client: 'Grace Kim', project: 'Grace Kim Engagement', amount: 900, paid: 0, due: 'Oct 25, 2026', status: 'Sent', items: [['Engagement session (2 hrs)', 1, 750], ['Online gallery + 40 edited images', 1, 0], ['Travel fee', 1, 150]] },
  { id: 'INV-1041', client: 'Emma Collins', project: 'Collins Anniversary', amount: 550, paid: 275, due: 'Nov 15, 2026', status: 'Partially paid', items: [['Couples session (1 hr)', 1, 550]] },
  { id: 'INV-1040', client: 'Linh Nguyen', project: 'Nguyen Holiday Cards', amount: 500, paid: 0, due: 'Oct 12, 2026', status: 'Overdue', items: [['Holiday mini session', 1, 400], ['Card design', 1, 100]] },
  { id: 'INV-1039', client: 'Sofia Ramirez', project: 'Sofia Senior Portraits', amount: 650, paid: 650, due: 'Oct 1, 2026', status: 'Paid', items: [['Senior portrait session', 1, 650]] },
  { id: 'INV-1038', client: 'Maya Ortiz', project: 'Aurora Brand Session', amount: 1800, paid: 1800, due: 'Sep 20, 2026', status: 'Paid', items: [['Half-day brand session', 1, 1500], ['Commercial usage license', 1, 300]] },
  { id: 'INV-1037', client: 'Emma Collins', project: 'Emma & James Wedding', amount: 6800, paid: 6800, due: 'Aug 30, 2026', status: 'Paid', items: [['Full-day wedding coverage', 1, 5800], ['Second shooter', 1, 1000]] },
];

export const contracts = [
  { id: 'k1', name: 'Engagement Session Agreement', client: 'Grace Kim', status: 'Awaiting signature', sent: 'Oct 14, 2026' },
  { id: 'k2', name: 'Portrait Session Agreement', client: 'Emma Collins', status: 'Signed', sent: 'Oct 2, 2026' },
  { id: 'k3', name: 'Commercial License Agreement', client: 'Maya Ortiz', status: 'Signed', sent: 'Sep 10, 2026' },
  { id: 'k4', name: 'Wedding Photography Contract', client: 'Emma Collins', status: 'Signed', sent: 'Feb 4, 2026' },
];

export const sessionTypes = [
  { id: 's1', name: 'Mini Session', duration: '20 min', price: 195, deposit: 50, desc: '20 minutes, one location, 10 edited images.', img: 'mini' },
  { id: 's2', name: 'Family Portrait Session', duration: '1 hr', price: 450, deposit: 100, desc: 'One hour at a location of your choice, full online gallery.', img: 'fam2' },
  { id: 's3', name: 'Engagement Session', duration: '2 hr', price: 750, deposit: 200, desc: 'Two hours, up to two locations, 40+ edited images.', img: 'eng' },
  { id: 's4', name: 'Discovery Call', duration: '30 min', price: 0, deposit: 0, desc: 'Free video call to chat about your wedding day.', img: 'call' },
];

export const events = [
  { day: 3, title: 'Nguyen Fall Mini', time: '4:00 PM', color: 'teal' },
  { day: 10, title: 'Sofia Senior', time: '5:30 PM', color: 'violet' },
  { day: 18, title: 'Discovery call — Grace', time: '11:00 AM', color: 'amber' },
  { day: 21, title: 'Mini sessions', time: '9:00 AM', color: 'teal' },
  { day: 21, title: 'Mini sessions', time: '2:00 PM', color: 'teal' },
  { day: 27, title: 'Album design review', time: '1:00 PM', color: 'rose' },
];

export const products = [
  { id: 'pr1', name: 'Fine Art Print', cat: 'Prints', from: 25, sizes: [['5×7', 25], ['8×10', 40], ['11×14', 65], ['16×20', 110]], img: 'print' },
  { id: 'pr2', name: 'Gallery Canvas', cat: 'Wall Art', from: 145, sizes: [['12×12', 145], ['16×20', 220], ['24×36', 380]], img: 'canvas' },
  { id: 'pr3', name: 'Framed Print', cat: 'Wall Art', from: 120, sizes: [['8×10', 120], ['11×14', 165], ['16×20', 240]], img: 'frame' },
  { id: 'pr4', name: 'Layflat Album', cat: 'Albums', from: 650, sizes: [['10×10 · 20 spreads', 650], ['12×12 · 30 spreads', 950]], img: 'album' },
  { id: 'pr5', name: 'Metal Print', cat: 'Wall Art', from: 95, sizes: [['8×10', 95], ['16×20', 210]], img: 'metal' },
  { id: 'pr6', name: 'Digital Download', cat: 'Digital', from: 25, sizes: [['Single image', 25], ['Full gallery', 450]], img: 'digital' },
];

export const orders = [
  { id: '#10284', client: 'Emma Collins', gallery: 'Emma & James', items: 3, total: 485, status: 'Processing', date: 'Oct 15, 2026' },
  { id: '#10283', client: 'Priya Shah', gallery: 'Baby Oliver', items: 1, total: 220, status: 'Shipped', date: 'Oct 12, 2026' },
  { id: '#10282', client: 'Linh Nguyen', gallery: 'The Nguyen Family', items: 5, total: 175, status: 'Delivered', date: 'Oct 8, 2026' },
  { id: '#10281', client: 'Noah Bennett', gallery: 'Harbor Elopement', items: 1, total: 450, status: 'Fulfilled', date: 'Sep 29, 2026' },
  { id: '#10280', client: 'Emma Collins', gallery: 'Emma & James', items: 2, total: 380, status: 'Delivered', date: 'Sep 24, 2026' },
];

export const sitePages = [
  { name: 'Home', path: '/', status: 'Published' },
  { name: 'Portfolio', path: '/portfolio', status: 'Published' },
  { name: 'About', path: '/about', status: 'Published' },
  { name: 'Investment', path: '/investment', status: 'Published' },
  { name: 'Journal', path: '/journal', status: 'Published' },
  { name: 'Contact', path: '/contact', status: 'Published' },
  { name: 'Mini Sessions 2026', path: '/minis', status: 'Draft' },
];

export const posts = [
  { title: 'Emma & James — A Foggy Big Sur Wedding', date: 'Oct 1, 2026', img: 'wed3', status: 'Published' },
  { title: 'What to Wear to Your Family Session', date: 'Sep 12, 2026', img: 'fam3', status: 'Published' },
  { title: 'Five Favorite Elopement Spots in the PNW', date: 'Aug 18, 2026', img: 'el2', status: 'Published' },
  { title: 'Fall Mini Sessions Are Here', date: 'Aug 2, 2026', img: 'mini2', status: 'Draft' },
];

export const apps = [
  { id: 'a1', name: 'Emma & James', gallery: 'emma-james', installs: 64, cover: 'wed1', status: 'Live' },
  { id: 'a2', name: 'Baby Oliver', gallery: 'baby-oliver', installs: 12, cover: 'nb1', status: 'Live' },
  { id: 'a3', name: 'The Nguyen Family', gallery: 'nguyen-family', installs: 0, cover: 'fam1', status: 'Draft' },
];

export const activity = [
  ['Emma Collins', 'favorited 24 photos in', 'Emma & James', '12 min ago'],
  ['Grace Kim', 'viewed invoice', 'INV-1042', '1 hr ago'],
  ['Priya Shah', 'ordered a Gallery Canvas from', 'Baby Oliver', '3 hrs ago'],
  ['Linh Nguyen', 'downloaded 18 photos from', 'The Nguyen Family', 'Yesterday'],
  ['New inquiry', 'from Hannah Lee via', 'Contact form', 'Yesterday'],
  ['Emma Collins', 'signed', 'Portrait Session Agreement', 'Oct 2'],
];
