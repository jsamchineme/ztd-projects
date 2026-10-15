// Accounts, sessions, MFA, password resets and teams, using Better Auth.
// Studio teams are Better Auth "organizations". Sign-up is invite-only.
import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { twoFactor, organization, admin } from 'better-auth/plugins';
import { getMigrations } from 'better-auth/db/migration';
import { db, audit } from './db.mjs';
import { APP_NAME, STUDIO_URL, SECRET, SECURE } from './config.mjs';
import { sendMail } from './mail.mjs';

// The last link generated for each email, so admins can pass it on when email isn't set up.
export const recentLinks = new Map();
const remember = (email, kind, url) => recentLinks.set(email.toLowerCase(), { kind, url, at: Date.now() });

export function pendingInvitation(email){
  return db.prepare(`SELECT i.*, o.name AS organizationName FROM invitation i JOIN organization o ON o.id = i.organizationId
    WHERE lower(i.email) = lower(?) AND i.status = 'pending' AND i.expiresAt > ? ORDER BY i.createdAt DESC LIMIT 1`)
    .get(email, Date.now());
}

export const auth = betterAuth({
  appName: APP_NAME,
  baseURL: STUDIO_URL,
  basePath: '/api/auth',
  secret: SECRET,
  database: db,
  trustedOrigins: [STUDIO_URL],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 256,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, token }) => {
      const url = `${STUDIO_URL}/reset-password?token=${encodeURIComponent(token)}`;
      remember(user.email, 'reset', url);
      audit(user.id, 'password.reset-requested', user.email);
      await sendMail(user.email, `Reset your ${APP_NAME} password`,
        `Someone asked to reset the password for ${user.email}.\n\nTo choose a new password, open this link within an hour:\n${url}\n\nIf this wasn't you, ignore this email. Your password won't change.`);
    },
    onPasswordReset: async ({ user }) => audit(user.id, 'password.reset', user.email)
  },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, freshAge: 60 * 15 },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 120,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 5 },
      '/two-factor/verify-totp': { window: 60, max: 5 },
      '/two-factor/verify-backup-code': { window: 60, max: 5 },
      '/request-password-reset': { window: 60 * 15, max: 3 },
      '/reset-password': { window: 60, max: 5 }
    }
  },
  advanced: {
    useSecureCookies: SECURE,
    cookiePrefix: 'studio',
    ipAddress: { ipAddressHeaders: ['x-real-ip'] }   // set by Apache from the real connection; clients can't fake it
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const count = db.prepare('SELECT count(*) AS n FROM user').get().n;
          // The first account is the owner. It's made with `studio-admin bootstrap` on the server (no HTTP request),
          // never through the public sign-up form, unless a throwaway test instance allows it.
          if (count === 0 && (!ctx?.request || process.env.STUDIO_ALLOW_FIRST_SIGNUP === '1')) return { data: { ...user, role: 'admin' } };
          if (ctx?.path === '/admin/create-user') return { data: user };          // an admin made it
          const inv = pendingInvitation(user.email);
          if (!inv) throw new APIError('FORBIDDEN', { message: 'Studio is invite-only. Ask an admin to invite you.' });
          // The invite link went to this address, so following it proves the email.
          return { data: { ...user, emailVerified: true } };
        }
      }
    }
  },
  plugins: [
    twoFactor({ issuer: APP_NAME, backupCodeOptions: { amount: 10 }, accountLockout: { enabled: true, maxFailedAttempts: 10, durationSeconds: 15 * 60 } }),
    admin({ defaultRole: 'user', adminRoles: ['admin'] }),
    organization({
      allowUserToCreateOrganization: async user => user.role === 'admin',
      invitationExpiresIn: 60 * 60 * 24 * 7,
      cancelPendingInvitationsOnReInvite: true,
      sendInvitationEmail: async ({ id, email, organization: org, inviter }) => {
        const url = `${STUDIO_URL}/invite/${id}`;
        remember(email, 'invite', url);
        await sendMail(email, `You're invited to ${org.name} on ${APP_NAME}`,
          `${inviter.user.name} invited you to join the team "${org.name}" on ${APP_NAME}.\n\nAccept the invitation within 7 days:\n${url}`);
      }
    })
  ]
});

export async function migrate(){
  const { runMigrations, toBeCreated, toBeAdded } = await getMigrations(auth.options);
  if (toBeCreated.length || toBeAdded.length) await runMigrations();
}

// Returns { user, session } for a request's cookies, or null.
export async function sessionFrom(headers){
  try {
    const h = new Headers();
    for (const [k, v] of Object.entries(headers)) if (v != null) h.set(k, Array.isArray(v) ? v.join(', ') : v);
    return await auth.api.getSession({ headers: h });
  } catch { return null; }
}
