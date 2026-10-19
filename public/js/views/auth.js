// Auth view — fullscreen login + first-run setup. Mounted into #app (no chrome).
import { api } from '../api.js';
import { h, icon, toast } from '../ui.js';

registerView('auth', (root, params, app) => {
  root.innerHTML = '';
  if (params.needsSetup) mountSetup(root);
  else mountLogin(root);
});

function brandHeader(subtitle) {
  return h('div', { class: 'brand', style: { marginBottom: '20px', fontSize: '18px' } },
    h('span', { class: 'mark' }, icon('mail')),
    h('div', {},
      h('div', {}, 'Businessmail'),
      subtitle ? h('div', { class: 'muted', style: { fontSize: '13px', fontWeight: '400' } }, subtitle) : null,
    ),
  );
}

// toggle button spinner/disabled state
function setBusy(btn, busy, label) {
  btn.disabled = busy;
  btn.innerHTML = '';
  if (busy) btn.append(h('span', { class: 'spinner' }));
  else btn.append(document.createTextNode(label));
}

function mountSetup(root) {
  const orgName = h('input', { class: 'input', type: 'text', placeholder: 'Acme Inc.', required: true, autofocus: true });
  const name = h('input', { class: 'input', type: 'text', placeholder: 'Jane Doe', required: true });
  const email = h('input', { class: 'input', type: 'email', placeholder: 'you@example.com', required: true });
  const password = h('input', { class: 'input', type: 'password', placeholder: '••••••••', required: true });
  const submit = h('button', { class: 'btn btn-primary', type: 'submit', style: { width: '100%' } }, 'Create account');

  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    setBusy(submit, true);
    try {
      await api.post('/api/auth/setup', {
        orgName: orgName.value.trim(),
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
      });
      location.reload();
    } catch (err) {
      toast(err.message || 'Setup failed', 'error');
      setBusy(submit, false, 'Create account');
    }
  } },
    field('Organization name', orgName),
    field('Your name', name),
    field('Email', email),
    field('Password', password),
    submit,
  );

  root.append(h('div', { class: 'center-screen' },
    h('div', { class: 'card auth-card', style: { padding: '28px' } },
      brandHeader('Create your admin account'),
      form,
    ),
  ));
  setTimeout(() => orgName.focus(), 0);
}

function mountLogin(root) {
  const email = h('input', { class: 'input', type: 'email', placeholder: 'you@example.com', required: true, autofocus: true });
  const password = h('input', { class: 'input', type: 'password', placeholder: '••••••••', required: true });
  const totp = h('input', { class: 'input', type: 'text', inputmode: 'numeric', pattern: '[0-9]*', maxlength: '6', placeholder: '123456', autocomplete: 'one-time-code' });
  const totpField = field('Authentication code', totp);
  totpField.style.display = 'none';
  const submit = h('button', { class: 'btn btn-primary', type: 'submit', style: { width: '100%' } }, 'Sign in');

  let need2fa = false;

  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    setBusy(submit, true);
    try {
      const body = { email: email.value.trim(), password: password.value };
      if (need2fa) body.totp = totp.value.trim();
      const result = await api.post('/api/auth/login', body);
      if (result && result.need2fa) {
        need2fa = true;
        totpField.style.display = '';
        setBusy(submit, false, 'Verify');
        totp.focus();
        toast('Enter the 6-digit code from your authenticator app');
        return;
      }
      location.reload();
    } catch (err) {
      toast(err.message || 'Sign in failed', 'error');
      setBusy(submit, false, need2fa ? 'Verify' : 'Sign in');
    }
  } },
    field('Email', email),
    field('Password', password),
    totpField,
    submit,
  );

  root.append(h('div', { class: 'center-screen' },
    h('div', { class: 'card auth-card', style: { padding: '28px' } },
      brandHeader('Sign in to your account'),
      form,
    ),
  ));
  setTimeout(() => email.focus(), 0);
}

function field(labelText, input) {
  return h('div', { class: 'field' },
    h('label', { class: 'label' }, labelText),
    input,
  );
}
