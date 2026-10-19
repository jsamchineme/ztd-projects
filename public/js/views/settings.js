// Settings view: profile (name/email/signature), preferences (block remote images, theme), labels.
import { api } from '../api.js';
import { h, icon, toast, confirmDialog } from '../ui.js';

registerView('settings', async (root, params, app) => {
  const page = h('div', { class: 'page' }, h('h1', {}, 'Settings'));
  root.append(page);

  let settings = {};
  try {
    settings = await api.get('/api/settings') || {};
  } catch (e) {
    page.append(h('p', { class: 'muted' }, 'Could not load settings. ' + (e.message || '')));
    return;
  }

  const prefs = settings.prefs || {};
  const currentTheme = localStorage.getItem('bm-theme') || prefs.theme || 'system';

  // ---- Profile ----
  page.append(h('h2', {}, 'Profile'));
  const nameInput = h('input', { class: 'input', value: settings.name || app.state.user?.name || '' });
  const emailInput = h('input', { class: 'input', value: settings.email || app.state.user?.email || '', readonly: 'readonly', disabled: 'disabled' });
  const sigInput = h('textarea', { class: 'textarea', rows: '5' }, settings.signature || '');

  const profileCard = h('div', { class: 'card', style: { padding: '20px' } },
    h('div', { class: 'field' }, h('label', { class: 'label' }, 'Name'), nameInput),
    h('div', { class: 'field' }, h('label', { class: 'label' }, 'Email'), emailInput),
    h('div', { class: 'field', style: { marginBottom: '0' } },
      h('label', { class: 'label' }, 'Signature'), sigInput),
  );
  page.append(profileCard);

  const saveProfileBtn = h('button', { class: 'btn btn-primary', style: { marginTop: '12px' },
    onClick: async () => {
      saveProfileBtn.disabled = true;
      try {
        const name = nameInput.value.trim();
        const signature = sigInput.value;
        await api.patch('/api/settings', { name, signature });
        if (app.state.user) app.state.user.name = name;
        toast('Saved');
      } catch (e) {
        toast(e.message || 'Could not save', 'error');
      } finally {
        saveProfileBtn.disabled = false;
      }
    } }, 'Save');
  page.append(h('div', {}, saveProfileBtn));

  // ---- Preferences ----
  page.append(h('h2', {}, 'Preferences'));
  const blockImgCheck = h('input', { type: 'checkbox', style: { width: '16px', height: '16px' } });
  blockImgCheck.checked = prefs.blockRemoteImages !== false;

  const themeSelect = h('select', { class: 'select', style: { maxWidth: '200px' },
    onChange: () => {
      const v = themeSelect.value;
      localStorage.setItem('bm-theme', v);
      applyTheme(v);
    } },
    h('option', { value: 'system' }, 'System'),
    h('option', { value: 'light' }, 'Light'),
    h('option', { value: 'dark' }, 'Dark'),
  );
  themeSelect.value = currentTheme;

  const prefsCard = h('div', { class: 'card', style: { padding: '20px' } },
    h('label', { class: 'row-flex', style: { cursor: 'pointer', marginBottom: '16px' } },
      blockImgCheck, h('span', {}, 'Block remote images in emails')),
    h('div', { class: 'field', style: { marginBottom: '0' } },
      h('label', { class: 'label' }, 'Theme'), themeSelect),
  );
  page.append(prefsCard);

  const savePrefsBtn = h('button', { class: 'btn btn-primary', style: { marginTop: '12px' },
    onClick: async () => {
      savePrefsBtn.disabled = true;
      try {
        await api.patch('/api/settings', {
          prefs: { blockRemoteImages: blockImgCheck.checked, theme: themeSelect.value },
        });
        toast('Saved');
      } catch (e) {
        toast(e.message || 'Could not save', 'error');
      } finally {
        savePrefsBtn.disabled = false;
      }
    } }, 'Save');
  page.append(h('div', {}, savePrefsBtn));

  // ---- Labels ----
  page.append(h('h2', {}, 'Labels'));
  const labelsCard = h('div', { class: 'card', style: { padding: '20px' } });
  page.append(labelsCard);

  async function renderLabels() {
    labelsCard.innerHTML = '';
    let labels = [];
    try {
      labels = await api.get('/api/labels') || [];
    } catch (e) {
      labelsCard.append(h('p', { class: 'muted' }, 'Could not load labels.'));
      return;
    }
    const custom = labels.filter(l => !l.system);

    if (!custom.length) {
      labelsCard.append(h('p', { class: 'muted', style: { margin: '0 0 16px' } }, 'No custom labels yet.'));
    } else {
      const list = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' } });
      for (const l of custom) {
        const del = h('button', { class: 'btn btn-ghost btn-icon btn-sm', title: 'Delete label',
          onClick: async () => {
            const ok = await confirmDialog(`Delete label "${l.name}"?`, { confirmText: 'Delete', danger: true });
            if (!ok) return;
            try {
              await api.del('/api/labels/' + l.id);
              await app.refreshSidebar();
              await renderLabels();
              toast('Label deleted');
            } catch (e) {
              toast(e.message || 'Could not delete', 'error');
            }
          } }, icon('x'));
        list.append(h('div', { class: 'row-flex', style: { padding: '6px 0' } },
          h('span', { class: 'swatch', style: { background: l.color || '#64748b', width: '12px', height: '12px' } }),
          h('span', { class: 'grow' }, l.name),
          del,
        ));
      }
      labelsCard.append(list);
    }

    // add form
    const nameField = h('input', { class: 'input', placeholder: 'Label name', style: { flex: '1' } });
    const colorField = h('input', { type: 'color', value: '#2563eb',
      style: { width: '40px', height: '36px', padding: '2px', border: '1px solid hsl(var(--input))', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer' } });
    const addBtn = h('button', { class: 'btn btn-outline',
      onClick: async () => {
        const name = nameField.value.trim();
        if (!name) { toast('Enter a label name', 'error'); return; }
        addBtn.disabled = true;
        try {
          await api.post('/api/labels', { name, color: colorField.value });
          nameField.value = '';
          await app.refreshSidebar();
          await renderLabels();
          toast('Label added');
        } catch (e) {
          toast(e.message || 'Could not add label', 'error');
        } finally {
          addBtn.disabled = false;
        }
      } }, icon('plus'), 'Add label');
    labelsCard.append(h('div', { class: 'row-flex' }, nameField, colorField, addBtn));
  }
  await renderLabels();
});

function applyTheme(theme) {
  let dark;
  if (theme === 'dark') dark = true;
  else if (theme === 'light') dark = false;
  else dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
}
