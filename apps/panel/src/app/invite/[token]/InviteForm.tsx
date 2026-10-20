'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { acceptInviteAction } from '../../actions';

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn primary" type="submit" disabled={pending}>{pending ? 'Setting up…' : 'Set password and continue'}</button>;
}

export function InviteForm({ token }: { token: string }) {
  const action = acceptInviteAction.bind(null, token);
  const [state, formAction] = useActionState(action, {});
  return (
    <form className="card form" action={formAction}>
      <div className="field"><label>Password</label><input className="input" name="password" type="password" autoComplete="new-password" minLength={10} required autoFocus /><span className="hint">At least 10 characters.</span></div>
      <div className="field"><label>Repeat password</label><input className="input" name="password2" type="password" autoComplete="new-password" required /></div>
      <div className="errline">{state.error}</div>
      <Submit />
    </form>
  );
}
