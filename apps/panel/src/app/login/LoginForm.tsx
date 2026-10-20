'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from '../actions';

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn primary" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>;
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, {});
  return (
    <form className="card form" action={action}>
      <div className="field"><label>Email</label><input className="input" name="email" type="email" autoComplete="username" required autoFocus /></div>
      <div className="field"><label>Password</label><input className="input" name="password" type="password" autoComplete="current-password" required /></div>
      <div className="errline">{state.error}</div>
      <Submit />
    </form>
  );
}
