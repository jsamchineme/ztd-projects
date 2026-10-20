import { invites } from '@/lib/store';
import { firstName } from '@/lib/format';
import { InviteForm } from './InviteForm';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const i = await invites.lookup(token);
  if (!i || !i.user) {
    return (
      <div className="auth-wrap"><div className="auth">
        <div className="ws"><span className="wsa">Z</span><div><div className="t">ZTD Office</div></div></div>
        <h1>Link expired</h1>
        <div className="sub">This link has expired or was already used. Ask ZTD Office for a new one.</div>
        <a className="btn" style={{ marginTop: 18 }} href="/login">Go to sign in</a>
      </div></div>
    );
  }
  return (
    <div className="auth-wrap"><div className="auth">
      <div className="ws"><span className="wsa">Z</span><div><div className="t">ZTD Office</div></div></div>
      <h1>Welcome, {firstName(i.user.name)}</h1>
      <div className="sub">Choose a password for <b>{i.user.email}</b>.</div>
      <InviteForm token={token} />
    </div></div>
  );
}
