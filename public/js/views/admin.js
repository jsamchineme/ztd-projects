// Admin view: users (create/suspend/role), domains (add → DNS records → verify), aliases.
import { api } from '../api.js';
import { h, icon, toast, confirmDialog } from '../ui.js';

registerView('admin', async (root, params, app) => {
  const user = app.state.user;
  if (!user || user.role !== 'admin') {
    root.append(h('div', { class: 'page' }, h('h1', {}, 'Admin'), h('p', { class: 'muted' }, 'Admin only.')));
    return;
  }

  const page = h('div', { class: 'page' });
  root.append(page);

  page.append(h('h1', {}, 'Admin'));
  page.append(h('p', { class: 'muted' }, 'Manage users, domains, and aliases for your organization.'));

  // --- tab bar ---
  const tabNames = [['users', 'Users'], ['domains', 'Domains'], ['aliases', 'Aliases']];
  let active = 'users';
  const tabBar = h('div', { class: 'tabs', style: { marginLeft: '0', marginTop: '20px', display: 'inline-flex' } });
  const sections = {};
  for (const [key, label] of tabNames) {
    tabBar.append(h('button', { class: 'tab' + (key === active ? ' active' : ''), dataset: { tab: key },
      onClick: () => select(key) }, label));
    sections[key] = h('div', { style: { display: key === active ? 'block' : 'none' } });
  }
  page.append(tabBar);
  for (const [key] of tabNames) page.append(sections[key]);

  function select(key) {
    active = key;
    tabBar.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    for (const [k] of tabNames) sections[k].style.display = k === key ? 'block' : 'none';
  }

  // shared cache of users for the aliases select
  let usersCache = [];

  // ================= USERS =================
  async function loadUsers() {
    const el = sections.users;
    el.innerHTML = '';

    // Add user form
    const form = h('div', { class: 'card', style: { padding: '16px', marginTop: '20px' } });
    const nameI = h('input', { class: 'input', placeholder: 'Full name' });
    const emailI = h('input', { class: 'input', placeholder: 'email@domain.com', type: 'email' });
    const passI = h('input', { class: 'input', placeholder: 'Password', type: 'password' });
    const roleSel = h('select', { class: 'select' },
      h('option', { value: 'member' }, 'Member'),
      h('option', { value: 'admin' }, 'Admin'));
    const addBtn = h('button', { class: 'btn btn-primary', onClick: addUser }, icon('plus'), 'Add user');
    form.append(
      h('h2', { style: { marginTop: '0' } }, 'Add user'),
      h('div', { class: 'row-flex', style: { flexWrap: 'wrap', gap: '8px' } },
        h('div', { style: { flex: '1 1 160px' } }, nameI),
        h('div', { style: { flex: '1 1 200px' } }, emailI),
        h('div', { style: { flex: '1 1 160px' } }, passI),
        h('div', { style: { flex: '0 0 140px' } }, roleSel),
        addBtn));
    el.append(form);

    async function addUser() {
      const name = nameI.value.trim(), email = emailI.value.trim(), password = passI.value;
      if (!name || !email || !password) { toast('Name, email and password are required', 'error'); return; }
      addBtn.disabled = true;
      try {
        await api.post('/api/admin/users', { name, email, password, role: roleSel.value });
        toast('User created');
        nameI.value = ''; emailI.value = ''; passI.value = ''; roleSel.value = 'member';
        await loadUsers();
      } catch (e) { toast(e.message || 'Failed to create user', 'error'); }
      finally { addBtn.disabled = false; }
    }

    // Users table
    el.append(h('h2', {}, 'Users'));
    let users = [];
    try { users = await api.get('/api/admin/users'); }
    catch (e) { el.append(h('p', { class: 'muted' }, 'Failed to load users: ' + (e.message || ''))); return; }
    usersCache = users;

    if (!users.length) { el.append(h('p', { class: 'muted' }, 'No users yet.')); return; }

    const tbody = h('tbody');
    for (const u of users) {
      const suspended = u.status === 'suspended';
      const statusBadge = h('span', { class: 'badge ' + (suspended ? 'badge-outline' : 'badge-sec') },
        suspended ? 'Suspended' : 'Active');

      const toggleStatusBtn = h('button', { class: 'btn btn-sm btn-outline',
        onClick: () => patchUser(u.id, { status: suspended ? 'active' : 'suspended' }) },
        suspended ? 'Activate' : 'Suspend');

      const isAdmin = u.role === 'admin';
      const toggleRoleBtn = h('button', { class: 'btn btn-sm btn-ghost',
        onClick: () => patchUser(u.id, { role: isAdmin ? 'member' : 'admin' }) },
        isAdmin ? 'Make member' : 'Make admin');

      // Don't let an admin suspend / demote themselves.
      if (u.id === user.id) { toggleStatusBtn.disabled = true; toggleRoleBtn.disabled = true; }

      tbody.append(h('tr', {},
        h('td', {}, u.name || '—'),
        h('td', {}, u.email),
        h('td', {}, h('span', { class: 'badge ' + (isAdmin ? 'badge-sec' : 'badge-outline') }, isAdmin ? 'Admin' : 'Member')),
        h('td', {}, statusBadge),
        h('td', {}, h('div', { class: 'row-flex' }, toggleStatusBtn, toggleRoleBtn))));
    }
    el.append(h('table', { class: 'table' },
      h('thead', {}, h('tr', {},
        h('th', {}, 'Name'), h('th', {}, 'Email'), h('th', {}, 'Role'), h('th', {}, 'Status'), h('th', {}, 'Actions'))),
      tbody));
  }

  async function patchUser(id, fields) {
    try {
      await api.patch('/api/admin/users/' + id, fields);
      toast('User updated');
      await loadUsers();
    } catch (e) { toast(e.message || 'Update failed', 'error'); }
  }

  // ================= DOMAINS =================
  async function loadDomains() {
    const el = sections.domains;
    el.innerHTML = '';

    // Add domain form
    const form = h('div', { class: 'card', style: { padding: '16px', marginTop: '20px' } });
    const domI = h('input', { class: 'input', placeholder: 'example.com' });
    const addBtn = h('button', { class: 'btn btn-primary', onClick: addDomain }, icon('plus'), 'Add domain');
    form.append(
      h('h2', { style: { marginTop: '0' } }, 'Add domain'),
      h('div', { class: 'row-flex', style: { flexWrap: 'wrap', gap: '8px' } },
        h('div', { style: { flex: '1 1 240px' } }, domI), addBtn));
    el.append(form);

    async function addDomain() {
      const domain = domI.value.trim();
      if (!domain) { toast('Enter a domain', 'error'); return; }
      addBtn.disabled = true;
      try {
        await api.post('/api/admin/domains', { domain });
        toast('Domain added — add the DNS records below, then verify');
        domI.value = '';
        await loadDomains();
      } catch (e) { toast(e.message || 'Failed to add domain', 'error'); }
      finally { addBtn.disabled = false; }
    }

    el.append(h('h2', {}, 'Domains'));
    let domains = [];
    try { domains = await api.get('/api/admin/domains'); }
    catch (e) { el.append(h('p', { class: 'muted' }, 'Failed to load domains: ' + (e.message || ''))); return; }

    if (!domains.length) { el.append(h('p', { class: 'muted' }, 'No domains yet. Add one above.')); return; }

    for (const d of domains) {
      const verified = (d.status || '').toLowerCase() === 'verified';
      const verifyBtn = h('button', { class: 'btn btn-sm btn-outline',
        onClick: () => verifyDomain(d.id) }, icon('shield'), 'Verify');

      const card = h('div', { class: 'card', style: { padding: '16px', marginBottom: '16px' } },
        h('div', { class: 'row-flex' },
          icon('globe'),
          h('strong', { style: { fontSize: '15px' } }, d.domain),
          h('span', { class: 'badge ' + (verified ? 'badge-sec' : 'badge-outline'),
            style: { marginLeft: '4px' } }, d.status || 'pending'),
          h('div', { class: 'grow' }),
          verifyBtn));

      const records = parseRecords(d);
      if (records.length) {
        card.append(h('div', { class: 'muted', style: { margin: '12px 0 4px', fontSize: '13px' } },
          'Add these DNS records at your registrar:'));
        for (const r of records) {
          const parts = [r.type, r.name, r.value, r.priority].filter(v => v != null && v !== '').map(String);
          card.append(h('div', { class: 'dns-rec' }, parts.join('  ')));
        }
      } else {
        card.append(h('div', { class: 'muted', style: { marginTop: '12px', fontSize: '13px' } }, 'No DNS records available.'));
      }
      el.append(card);
    }
  }

  function parseRecords(d) {
    let recs = d.records;
    if (recs == null && d.records_json != null) {
      try { recs = JSON.parse(d.records_json); } catch { recs = null; }
    }
    if (typeof recs === 'string') { try { recs = JSON.parse(recs); } catch { recs = null; } }
    if (!Array.isArray(recs)) return [];
    return recs.map(r => ({
      type: r.type || r.record || '',
      name: r.name || r.host || '',
      value: r.value || r.data || r.content || '',
      priority: r.priority != null ? r.priority : (r.prio != null ? r.prio : ''),
    }));
  }

  async function verifyDomain(id) {
    try {
      const res = await api.post('/api/admin/domains/' + id + '/verify');
      const status = res && res.status ? res.status : null;
      toast(status ? 'Domain status: ' + status : 'Verification requested');
      await loadDomains();
    } catch (e) { toast(e.message || 'Verification failed', 'error'); }
  }

  // ================= ALIASES =================
  async function loadAliases() {
    const el = sections.aliases;
    el.innerHTML = '';

    // Make sure we have a user list for the select.
    if (!usersCache.length) {
      try { usersCache = await api.get('/api/admin/users'); } catch {}
    }

    // Add alias form
    const form = h('div', { class: 'card', style: { padding: '16px', marginTop: '20px' } });
    const addrI = h('input', { class: 'input', placeholder: 'alias@domain.com', type: 'email' });
    const userSel = h('select', { class: 'select' });
    for (const u of usersCache) {
      userSel.append(h('option', { value: u.id }, (u.name ? u.name + ' — ' : '') + u.email));
    }
    const addBtn = h('button', { class: 'btn btn-primary', onClick: addAlias }, icon('plus'), 'Add alias');
    form.append(
      h('h2', { style: { marginTop: '0' } }, 'Add alias'),
      h('div', { class: 'row-flex', style: { flexWrap: 'wrap', gap: '8px' } },
        h('div', { style: { flex: '1 1 220px' } }, addrI),
        h('div', { style: { flex: '1 1 220px' } }, userSel),
        addBtn));
    el.append(form);

    async function addAlias() {
      const address = addrI.value.trim();
      const userId = userSel.value;
      if (!address) { toast('Enter an alias address', 'error'); return; }
      if (!userId) { toast('Select a user', 'error'); return; }
      addBtn.disabled = true;
      try {
        await api.post('/api/admin/aliases', { address, userId });
        toast('Alias created');
        addrI.value = '';
        await loadAliases();
      } catch (e) { toast(e.message || 'Failed to create alias', 'error'); }
      finally { addBtn.disabled = false; }
    }

    el.append(h('h2', {}, 'Aliases'));
    let aliases = [];
    try { aliases = await api.get('/api/admin/aliases'); }
    catch (e) { el.append(h('p', { class: 'muted' }, 'Failed to load aliases: ' + (e.message || ''))); return; }

    if (!aliases.length) { el.append(h('p', { class: 'muted' }, 'No aliases yet.')); return; }

    const byId = new Map(usersCache.map(u => [String(u.id), u]));
    const tbody = h('tbody');
    for (const a of aliases) {
      const owner = a.user_name || a.user_email || (byId.get(String(a.user_id)) &&
        (byId.get(String(a.user_id)).name || byId.get(String(a.user_id)).email)) || a.user_id || '—';
      tbody.append(h('tr', {},
        h('td', {}, a.address),
        h('td', {}, owner),
        h('td', {}, h('button', { class: 'btn btn-sm btn-ghost', onClick: () => delAlias(a) },
          icon('trash'), 'Delete'))));
    }
    el.append(h('table', { class: 'table' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Address'), h('th', {}, 'User'), h('th', {}, ''))),
      tbody));
  }

  async function delAlias(a) {
    const ok = await confirmDialog('Delete alias ' + a.address + '?', { confirmText: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.del('/api/admin/aliases/' + a.id);
      toast('Alias deleted');
      await loadAliases();
    } catch (e) { toast(e.message || 'Delete failed', 'error'); }
  }

  // Load all three sections; they're built once and toggled by the tab bar.
  await loadUsers();
  loadDomains();
  loadAliases();
});
