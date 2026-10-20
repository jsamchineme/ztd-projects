import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  if (await currentUser()) redirect('/');
  return (
    <div className="auth-wrap">
      <div className="auth">
        <div className="ws"><span className="wsa">Z</span><div><div className="t">ZTD Office</div></div></div>
        <h1>Sign in</h1>
        <div className="sub">Manage your business email.</div>
        <LoginForm />
        <p className="faint small" style={{ marginTop: 14 }}>Forgotten your password? Ask ZTD Office for a new sign-in link.</p>
      </div>
    </div>
  );
}
