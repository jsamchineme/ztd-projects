import Link from 'next/link';
import { currentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { overviewData } from '@/lib/panel';
import { gbp, fmtBytes, firstName } from '@/lib/format';
import { Icon, IconName } from '@/components/Icon';
import { Avatar, Meter, Mini, Badge, DnsBadge, Tile } from '@/components/ui';

function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }

const ACTION_ICON: Record<string, IconName> = { 'inbox-created': 'inbox', 'inbox-deleted': 'inbox', 'password-reset': 'key', 'group-created': 'users', 'alias-created': 'at', 'client-created': 'plus', 'plan-changed': 'card', 'domain-added': 'globe', 'admin-invited': 'mail', request: 'spark', 'signed-up': 'check' };
const ACTION_TEXT: Record<string, string> = { 'inbox-created': 'Inbox created', 'inbox-deleted': 'Inbox deleted', 'password-reset': 'Password reset', 'group-created': 'Group created', 'alias-created': 'Alias created', 'client-created': 'Client added', 'plan-changed': 'Plan changed', 'domain-added': 'Domain added', 'admin-invited': 'Admin invited', request: 'Change requested', 'signed-up': 'Signed in for the first time' };

export default async function OverviewPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  if (user.role !== 'staff') return <ClientLanding name={user.name} />;

  const o = await overviewData();
  const plans = ['lite', 'premium', 'business'] as const;
  const maxUsed = Math.max(1, ...o.storage.map((s) => s.usedBytes));
  const levelIcon: Record<string, IconName> = { bad: 'key', warn: 'alert', brand: 'spark' };

  return (
    <>
      <div className="head">
        <div><h1>{greeting()}, {firstName(user.name)}</h1><div className="sub">Here&apos;s how ZTD Office is doing today.</div></div>
        <div className="actions"><Link className="btn primary" href="/clients"><Icon name="plus" />New client</Link></div>
      </div>

      <div className="grid g4" style={{ marginBottom: 16 }}>
        <div className="card card-b stat"><div className="k"><Icon name="pound" />Monthly revenue</div><div className="v">{gbp(o.mrr)}</div><div className="f">{gbp(o.mrr * 12)} a year</div></div>
        <div className="card card-b stat"><div className="k"><Icon name="users" />Clients</div><div className="v">{o.clients.total}</div><div className="f">{plans.map((p) => `${o.clients.byPlan[p]} ${p[0]!.toUpperCase() + p.slice(1)}`).join(' · ')}</div></div>
        <div className="card card-b stat"><div className="k"><Icon name="key" />Licence seats</div><div className="v">{o.seats.used}<small> / {o.seats.total}</small></div><div style={{ marginTop: 12 }}><Meter used={o.seats.used} limit={o.seats.total} /></div></div>
        <div className="card card-b stat"><div className="k"><Icon name="globe" />Domains verified</div><div className="v">{o.domains.verified}<small> / {o.domains.total}</small></div><div className="f">Mail, DKIM, DMARC and relay records</div></div>
      </div>

      <div className="card card-b" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div><div className="eyebrow">Storage used</div><div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.03em', marginTop: 7 }} className="num">{fmtBytes(o.storage.reduce((a, s) => a + s.usedBytes, 0))}<span className="faint" style={{ fontSize: 13.5, fontWeight: 450, letterSpacing: 0 }}> · across {o.storage.length} account{o.storage.length === 1 ? '' : 's'}</span></div></div>
          <Link className="dd" href="/clients">All clients <Icon name="chev" /></Link>
        </div>
        <div className="chart-legend">
          {o.storage.length ? o.storage.map((s) => (
            <Link key={s.id} className="lr" href={`/clients/${s.id}`} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,220px) 1fr auto', gap: 16 }}>
              <span className="nm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              <span className="meter" style={{ height: 6, alignSelf: 'center' }}><i style={{ width: `${Math.max(1, (s.usedBytes / maxUsed) * 100)}%` }} /></span>
              <span className="pct">{fmtBytes(s.usedBytes)} <span className="faint">of {fmtBytes(s.quotaBytes)}</span></span>
            </Link>
          )) : <div className="empty">No mailboxes yet.</div>}
        </div>
      </div>

      <div className="grid g2">
        <div className="stack">
          <div className="card">
            <div className="card-h"><div><h2>Needs attention</h2><div className="sub muted">Things that cost money or mail if ignored</div></div></div>
            <div className="list" style={{ marginTop: 10 }}>
              {o.attention.length ? o.attention.map((a, i) => {
                const inner = <><span className={`ic ${a.level}`}><Icon name={levelIcon[a.level] || 'alert'} /></span><div className="grow"><div className="n">{a.title}</div><div className="d">{a.detail}</div></div>{a.clientId && <span className="faint"><Icon name="chev" /></span>}</>;
                return a.clientId ? <Link key={i} className="li" href={`/clients/${a.clientId}`}>{inner}</Link> : <div key={i} className="li">{inner}</div>;
              }) : <div className="empty"><Icon name="check" /> All clear</div>}
            </div>
          </div>
          <div className="card">
            <div className="card-h"><h2>Clients</h2><Link className="btn sm ghost" href="/clients">View all <Icon name="arrow" /></Link></div>
            <div className="table-wrap" style={{ marginTop: 12 }}><ClientTable list={o.clientsList.filter((c) => !c.internal)} compact /></div>
          </div>
        </div>
        <div className="stack">
          <div className="card card-b"><h2>Mail licence</h2><div className="sub muted small">Stalwart Enterprise · ztdoffice.com</div>
            <div className="usage" style={{ marginTop: 16 }}><div className="row"><span className="muted">Mailboxes</span><b>{o.seats.used} of {o.seats.total}</b></div><Meter used={o.seats.used} limit={o.seats.total} lg /></div>
            <dl className="kv" style={{ marginTop: 16 }}><dt>Renews</dt><dd>{new Date(o.seats.renews).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</dd><dt>Groups &amp; aliases</dt><dd>Free, not counted</dd></dl>
          </div>
          <div className="card">
            <div className="card-h"><h2>Recent activity</h2></div>
            <div className="list" style={{ marginTop: 8 }}>
              {o.activity.length ? o.activity.map((a, i) => (
                <div key={i} className="li"><span className="tile" style={{ width: 32, height: 32 }}><Icon name={ACTION_ICON[a.action] || 'activity'} /></span><div className="grow"><div style={{ fontSize: 13.5 }}>{ACTION_TEXT[a.action] || a.action}{a.client ? <> · <span className="muted">{a.client}</span></> : ''}</div><div className="d">{a.detail}</div></div></div>
              )) : <div className="empty">Nothing yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ClientTable({ list, compact = false }: { list: Awaited<ReturnType<typeof overviewData>>['clientsList']; compact?: boolean }) {
  if (!list.length) return <div className="empty">No clients yet. Add your first with “New client”.</div>;
  const wide = compact ? 'hidden-col' : 'hide-sm';
  return (
    <table>
      <thead><tr><th>Client</th><th>Plan</th><th className="hide-sm">Inboxes</th><th className={wide}>Groups &amp; aliases</th><th className={wide}>Domain</th><th className="r">Price</th></tr></thead>
      <tbody>
        {list.map((c) => (
          <tr key={c.id} className={c.status === 'suspended' ? 'suspended' : ''}>
            <td><div className="who"><Avatar name={c.name} cls="sq" /><div style={{ minWidth: 0 }}><div className="n"><Link href={`/clients/${c.id}`}>{c.name}</Link></div><div className="d">{c.domains[0]?.name || 'no domain'}</div></div></div></td>
            <td><Badge kind={c.plan as 'premium' | 'business'}>{c.planName}</Badge>{c.status === 'suspended' && <> <Badge kind="bad">Suspended</Badge></>}{c.openRequests ? <> <Badge kind="premium">Request</Badge></> : ''}</td>
            <td className="hide-sm"><Mini used={c.usage.inboxes} limit={c.limits.inboxes} /></td>
            <td className={wide}><Mini used={c.usage.aliases} limit={c.limits.aliases} /></td>
            <td className={wide}><DnsBadge dns={c.domains[0]?.dns || null} /></td>
            <td className="r num"><b>{gbp(c.monthly)}</b><span className="faint">/mo</span>{c.customPrice != null && <span className="tag">CUSTOM</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ClientLanding({ name }: { name: string }) {
  return (
    <>
      <div className="head"><div><h1>Welcome, {firstName(name)}</h1><div className="sub">Your account tools are being set up here.</div></div></div>
      <div className="card card-b" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Tile name="mail" />
        <div className="grow"><div style={{ fontWeight: 600 }}>Open your webmail</div><div className="muted small">Read and send email, calendar and contacts.</div></div>
        <a className="btn primary" href="https://mail.ztdoffice.com" target="_blank" rel="noopener noreferrer">Open webmail</a>
      </div>
    </>
  );
}
