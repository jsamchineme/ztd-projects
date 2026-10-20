// Current panel user from the session cookie. Server-side only (uses next/headers).
import { cookies } from 'next/headers';
import { sessions } from './store';
import type { User } from './store';

export const COOKIE = 'ztd_panel';

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  return sessions.lookup(jar.get(COOKIE)?.value);
}

export async function setSessionCookie(token: string, days = 14) {
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: days * 86400 });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
