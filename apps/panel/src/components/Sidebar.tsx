import Link from 'next/link';
import { Icon, IconName } from './Icon';
import { SideFoot } from './SideFoot';
import type { User } from '@/lib/store';

function NavLink({ href, icon, label, active }: { href: string; icon: IconName; label: string; active: boolean }) {
  return <Link href={href} className={active ? 'on' : ''}><Icon name={icon} />{label}</Link>;
}

export function Sidebar({ user, page }: { user: User; page: string }) {
  const staff = user.role === 'staff';
  return (
    <>
      <div className="ws"><span className="wsa">Z</span><div style={{ minWidth: 0 }}><div className="t">ZTD Office</div></div></div>
      <nav>
        {staff ? (
          <>
            <NavLink href="/" icon="home" label="Overview" active={page === 'overview'} />
            <NavLink href="/clients" icon="users" label="Clients" active={page === 'clients'} />
            <div className="nav-label">Services</div>
            <a href="https://mail.ztdoffice.com" target="_blank" rel="noopener noreferrer"><Icon name="mail" />Webmail<span className="count"><Icon name="ext" /></span></a>
            <a href="https://mx1.ztdoffice.com/admin" target="_blank" rel="noopener noreferrer"><Icon name="shield" />Mail server<span className="count"><Icon name="ext" /></span></a>
          </>
        ) : (
          <>
            <NavLink href="/" icon="home" label="Overview" active={page === 'overview'} />
            <div className="nav-label">Apps</div>
            <a href="https://mail.ztdoffice.com" target="_blank" rel="noopener noreferrer"><Icon name="mail" />Open webmail<span className="count"><Icon name="ext" /></span></a>
          </>
        )}
      </nav>
      <SideFoot name={user.name} email={user.email} />
    </>
  );
}
