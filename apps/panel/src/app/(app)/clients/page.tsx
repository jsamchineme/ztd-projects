import Link from 'next/link';
import { requireUser } from '@/app/actions';
import { redirect } from 'next/navigation';
import { clientsList } from '@/lib/panel';
import { Icon } from '@/components/Icon';
import { ClientTable } from '../page';

export default async function ClientsPage() {
  const user = await requireUser();
  if (user.role !== 'staff') redirect('/');
  const list = (await clientsList()).filter((c) => !c.internal);
  const internal = (await clientsList()).find((c) => c.internal);
  return (
    <>
      <div className="head">
        <div><h1>Clients</h1><div className="sub">Every business you host, their plan and what they&apos;ve used.</div></div>
        <div className="actions"><Link className="btn primary" href="/clients"><Icon name="plus" />New client</Link></div>
      </div>
      <div className="card">
        <div className="table-wrap">{<ClientTable list={list} />}</div>
      </div>
      {internal && <p className="faint small" style={{ marginTop: 14 }}>Your own mailboxes are under <Link className="tablink" href={`/clients/${internal.id}`}>{internal.name}</Link>.</p>}
    </>
  );
}
