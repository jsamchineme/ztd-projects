import { requireUser } from '@/app/actions';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { headers } from 'next/headers';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  // Which top-level page is active (for the sidebar highlight).
  const path = (await headers()).get('x-pathname') || '/';
  const page = path === '/' ? 'overview' : path.split('/')[1] || 'overview';
  return (
    <>
      <div className="mobile-top">
        <button className="icon-btn" aria-label="Menu"><Icon name="menu" /></button>
        <span className="wsa" style={{ background: 'linear-gradient(145deg,var(--ws-a),var(--ws-b))' }}>Z</span><b>ZTD Office</b>
      </div>
      <div className="app">
        <aside id="side"><Sidebar user={user} page={page} /></aside>
        <main id="view"><div className="view">{children}</div></main>
      </div>
    </>
  );
}
