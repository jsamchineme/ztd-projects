// Sign-in screens: a navy brand panel on the left, the form on the right.
import { ico, logo } from './kit.js';

const side = (quote, line) => `<aside class="auth-side">
  <div class="brand">${logo(30)} ZTD Devs Studio</div>
  <blockquote>${quote}</blockquote>
  <p>${line}</p>
</aside>`;
const page = (card, quote = 'Build, run and ship your projects <em>with Claude</em>.', line = 'Every project gets its own folder, web address and chats. Your team works on them together.') =>
  `<div class="auth">${side(quote, line)}<main class="auth-main">${card}</main></div>`;
const field = (label, input, hint = '') => `<label class="field"><span>${label}${hint ? ` <em>${hint}</em>` : ''}</span>${input}</label>`;

export const authScreens = {
  login: () => page(`<div class="auth-card">
    <h1>Welcome back</h1>
    <p>Sign in to ZTD Devs Studio.</p>
    <form onsubmit="event.preventDefault(); location.hash='#/two-step'">
      ${field('Email', '<input class="input" type="email" value="samuel@ztddevs.com" autocomplete="username">')}
      ${field('Password', '<input class="input" type="password" value="correct horse battery" autocomplete="current-password">')}
      <label class="check"><input type="checkbox" checked> Keep me signed in on this device</label>
      <button class="btn primary block" type="submit">Sign in ${ico('chev')}</button>
    </form>
    <div class="auth-foot"><a href="#/forgot">Forgotten your password?</a><a href="#/login-error">See an error</a></div>
  </div>`),

  'login-error': () => page(`<div class="auth-card">
    <h1>Welcome back</h1>
    <p>Sign in to ZTD Devs Studio.</p>
    <form onsubmit="event.preventDefault()">
      <div class="callout bad" role="alert">${ico('alert')} That email and password don’t match.</div>
      ${field('Email', '<input class="input" type="email" value="samuel@ztddevs.com">')}
      ${field('Password', '<input class="input" type="password" value="wrong" style="border-color:var(--bad)">')}
      <button class="btn primary block" type="submit">Sign in ${ico('chev')}</button>
    </form>
    <div class="auth-foot"><a href="#/forgot">Forgotten your password?</a><a href="#/login">Back</a></div>
  </div>`),

  'two-step': () => page(`<div class="auth-card">
    <div class="modal-icon" style="margin-bottom:16px">${ico('lock')}</div>
    <h1>Two-step check</h1>
    <p>Enter the 6-digit code from your authenticator app for ZTD Devs Studio.</p>
    <form onsubmit="event.preventDefault(); location.hash='#/home'">
      <div class="otp">${'482913'.split('').map((d, i) => `<input class="input" maxlength="1" inputmode="numeric" value="${i < 4 ? d : ''}" aria-label="Digit ${i + 1}">`).join('')}</div>
      <label class="check"><input type="checkbox"> Trust this device for 30 days</label>
      <button class="btn primary block" type="submit">Verify</button>
    </form>
    <div class="auth-foot"><button class="btn ghost sm" type="button">${ico('key')} Use a backup code instead</button></div>
  </div>`, 'Codes change <em>every 30 seconds</em>.', 'Studio can change and run code on the server, so every account signs in with two steps.'),

  forgot: () => page(`<div class="auth-card">
    <h1>Reset your password</h1>
    <p>We’ll email you a link to choose a new one. It works for one hour.</p>
    <form onsubmit="event.preventDefault(); location.hash='#/forgot-sent'">
      ${field('Your email', '<input class="input" type="email" value="samuel@ztddevs.com">')}
      <button class="btn primary block" type="submit">Send reset link</button>
    </form>
    <div class="auth-foot"><a href="#/login">${'←'} Back to sign in</a></div>
  </div>`),

  'forgot-sent': () => page(`<div class="auth-card">
    <div class="modal-icon" style="margin-bottom:16px">${ico('mail')}</div>
    <h1>Check your email</h1>
    <p>If samuel@ztddevs.com has an account, a reset link is on its way. If nothing arrives, ask a Studio admin: they can give you a link from the Admin page.</p>
    <a class="btn block" href="#/login">Back to sign in</a>
  </div>`),

  reset: () => page(`<div class="auth-card">
    <h1>Choose a password</h1>
    <p>After saving, sign in with it. You’ll be signed out everywhere else.</p>
    <form onsubmit="event.preventDefault(); location.hash='#/login'">
      ${field('New password', '<input class="input" type="password" value="a long sentence works well">', 'at least 12 characters')}
      <div class="meter" style="margin-top:-8px"><i style="width:80%;background:var(--ok)"></i></div>
      ${field('Type it again', '<input class="input" type="password" value="a long sentence works well">')}
      <button class="btn primary block" type="submit">Save password</button>
    </form>
  </div>`),

  invite: () => page(`<div class="auth-card">
    <div class="invite-card"><span class="avatar">S</span><div><b>Samuel invited you to ZTD Devs</b><div class="small muted">as a member · jo@ztddevs.com</div></div></div>
    <h1>Create your account</h1>
    <p>Then you’ll set up two-step sign-in. Studio requires it for everyone.</p>
    <form onsubmit="event.preventDefault(); location.hash='#/mfa'">
      ${field('Email', '<input class="input" type="email" value="jo@ztddevs.com" disabled>')}
      ${field('Your name', '<input class="input" value="Jo Bello">')}
      <div class="grid2">${field('Password', '<input class="input" type="password" value="xxxxxxxxxxxxxx">', '12+ characters')}${field('Again', '<input class="input" type="password" value="xxxxxxxxxxxxxx">')}</div>
      <button class="btn primary block" type="submit">Create account and join</button>
    </form>
  </div>`, 'Welcome to <em>the team</em>.', 'You’ll be able to open the team’s projects, chat with Claude in them and restart them.'),

  mfa: () => page(`<div class="auth-card wide">
    <div class="progress"><i class="on"></i><i class="on"></i><i></i></div>
    <h1>Set up two-step sign-in</h1>
    <p>Use an authenticator app such as Google Authenticator, Microsoft Authenticator, 1Password or Authy.</p>
    <ol class="steps-num">
      <li><div><b>Scan this code in the app</b>
        <div class="mfa-grid" style="margin-top:10px"><div class="qr"><img src="/api/qr?text=otpauth://totp/preview" width="148" height="148" alt="QR code"></div>
        <div class="small muted">Can’t scan? Enter this key:<div class="keybox" style="margin-top:6px">JBSW Y3DP EHPK 3PXP</div></div></div></div></li>
      <li><div><b>Save your backup codes</b><div class="small muted" style="margin:2px 0 8px">Each works once if you lose your phone.</div>
        <div class="codes">${['7KQ2-M9XD', 'P4TR-2WZL', 'H8NB-6QEC', 'Y3JF-KV7A', 'D5LS-9RMU', 'W2XG-H4PE', 'B6CT-N8YQ', 'R9VK-3ZDJ'].map(c => `<span>${c}</span>`).join('')}</div>
        <div class="row tight" style="margin-top:8px"><button class="btn sm" type="button" data-toast="Backup codes copied">${ico('copy')} Copy</button><button class="btn sm" type="button" data-toast="Saved backup-codes.txt">${ico('download')} Download</button></div></div></li>
      <li><div><b>Enter the code the app shows</b><div class="otp" style="margin-top:10px;max-width:360px">${'      '.split('').map(() => '<input class="input" maxlength="1" inputmode="numeric">').join('')}</div></div></li>
    </ol>
    <button class="btn primary block" style="margin-top:22px" type="button" onclick="location.hash='#/home'">Turn on two-step sign-in</button>
  </div>`, 'One more step and <em>you’re in</em>.', 'Every account needs an authenticator app, because Studio can change and run code on the server.'),
};
