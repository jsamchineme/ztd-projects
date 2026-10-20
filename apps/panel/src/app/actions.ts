'use server';
// Auth server actions: sign in, accept invite, sign out.
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { users, sessions, invites } from '@/lib/store';
import { clients } from '@/lib/store';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { setSessionCookie, clearSessionCookie, currentUser, COOKIE } from '@/lib/session';
import { cookies } from 'next/headers';

type State = { error?: string };

const attempts = new Map<string, { n: number; at: number }>();

export async function loginAction(_prev: State, form: FormData): Promise<State> {
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const key = `${ip}|${email}`;
  const a = attempts.get(key);
  const recent = a && Date.now() - a.at < 15 * 60_000;
  if (recent && a!.n >= 8) return { error: 'Too many attempts. Try again in 15 minutes.' };

  const u = await users.byEmail(email);
  const ok = u && u.status === 'active' && (await verifyPassword(password, u.passwordHash));
  if (!ok || !u) {
    attempts.set(key, { n: (recent ? a!.n : 0) + 1, at: recent ? a!.at : Date.now() });
    return { error: 'Wrong email or password' };
  }
  attempts.delete(key);
  if (u.role === 'client') {
    const c = await clients.get(u.clientId!);
    if (c?.status === 'suspended') return { error: 'This account is suspended. Please contact ZTD Office.' };
  }
  const t = await sessions.create(u.id, (await headers()).get('user-agent') || '');
  await setSessionCookie(t);
  await users.touchLogin(u.id);
  redirect('/');
}

export async function acceptInviteAction(token: string, _prev: State, form: FormData): Promise<State> {
  const pw = String(form.get('password') || '');
  const pw2 = String(form.get('password2') || '');
  if (pw.length < 10) return { error: 'Passwords need at least 10 characters' };
  if (pw !== pw2) return { error: "The passwords don't match" };
  const i = await invites.lookup(token);
  if (!i || !i.user) return { error: 'This link has expired or was already used. Ask ZTD Office for a new one.' };
  await users.setPassword(i.user.id, await hashPassword(pw));
  await invites.use(token);
  await sessions.destroyForUser(i.user.id);
  const t = await sessions.create(i.user.id, (await headers()).get('user-agent') || '');
  await setSessionCookie(t);
  await users.touchLogin(i.user.id);
  redirect('/');
}

export async function logoutAction() {
  const jar = await cookies();
  await sessions.destroy(jar.get(COOKIE)?.value);
  await clearSessionCookie();
  redirect('/login');
}

export async function requireUser() {
  const u = await currentUser();
  if (!u) redirect('/login');
  return u;
}
