// Accounts, sessions, MFA, password resets and teams, using Better Auth.
// Studio teams are Better Auth "organizations". Sign-up is invite-only.
import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { twoFactor, organization, admin } from 'better-auth/plugins';
import { getMigrations } from 'better-auth/db/migration';
import { db, audit } from './db.mjs';
import { APP_NAME, STUDIO_URL, SECRET, SECURE } from './config.mjs';
import { sendTemplate } from './mail.mjs';

// The last link generated for each email, so admins can pass it on when email isn't set up.
export const recentLinks = new Map();
const remember = (email, kind, url) => recentLinks.set(email.toLowerCase(), { kind, url, at: Date.now() });
// Set by bin/admin.mjs while it makes a set-password link, so the email says so and gives the right expiry.
export const cliLink = { hours: 0 };
const ipFrom = request => request?.headers?.get?.('x-real-ip') || '';
const passwordChanged = (user, how, request) =>
  sendTemplate(user.email, 'passwordChanged', { name: user.name, email: user.email, how, ip: ipFrom(request), url: `${STUDIO_URL}/forgot` });

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
      if (cliLink.hours) await sendTemplate(user.email, 'setPassword', { name: user.name, email: user.email, url, hours: cliLink.hours });
      else await sendTemplate(user.email, 'resetPassword', { name: user.name, email: user.email, url });
    },
    onPasswordReset: async ({ user }, request) => {
      audit(user.id, 'password.reset', user.email);
      await passwordChanged(user, 'reset', request);
    }
  },
  hooks: {
    // A security notice whenever someone changes their password from the account page.
    after: createAuthMiddleware(async ctx => {
      if (ctx.path !== '/change-password') return;
      const r = ctx.context.returned;
      const user = r && !(r instanceof Error) && (r.user || ctx.context.session?.user);
      if (user) await passwordChanged(user, 'changed', ctx.request);
    })
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
      sendInvitationEmail: async ({ id, email, role, organization: org, inviter }) => {
        const url = `${STUDIO_URL}/invite/${id}`;
        remember(email, 'invite', url);
        await sendTemplate(email, 'invite', { inviterName: inviter.user.name, inviterEmail: inviter.user.email, orgName: org.name, role, email, url });
      },
      organizationHooks: {
        // Tells whoever sent the invitation that it was accepted.
        afterAcceptInvitation: async ({ invitation, member, user, organization: org }) => {
          const inviter = db.prepare('SELECT name, email FROM user WHERE id = ?').get(invitation.inviterId);
          if (!inviter || inviter.email === user.email) return;
          await sendTemplate(inviter.email, 'inviteAccepted', { inviterName: inviter.name, memberName: user.name, memberEmail: user.email,
            role: member.role, orgName: org.name, url: `${STUDIO_URL}/team` });
        }
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
