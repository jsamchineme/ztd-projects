'use client';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Avatar } from './ui';
import { logoutAction } from '@/app/actions';

export function SideFoot({ name, email }: { name: string; email: string }) {
  const [dark, setDark] = useState(true);
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')); }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('ztd-panel-theme', next ? 'dark' : 'light'); } catch { /* private mode */ }
    setDark(next);
  };
  return (
    <div className="side-foot">
      <Avatar name={name} />
      <div className="who2"><div className="n">{name}</div><div className="d">{email}</div></div>
      <span className="sp">
        <span className="ib" title="Light / dark" onClick={toggle}><Icon name={dark ? 'sun' : 'moon'} /></span>
        <form action={logoutAction}><button className="ib" title="Sign out" type="submit"><Icon name="logout" /></button></form>
      </span>
    </div>
  );
}
