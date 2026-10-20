// Presentational primitives shared across pages.
import { color, initials, meterClass } from '@/lib/format';
import { Icon } from './Icon';

export function Avatar({ name, cls = '' }: { name: string; cls?: string }) {
  return <span className={`avatar ${cls}`} style={{ background: color(name) }}>{initials(name)}</span>;
}

export function Badge({ kind, children }: { kind?: 'premium' | 'business' | 'ok' | 'warn' | 'bad' | ''; children: React.ReactNode }) {
  return <span className={`badge ${kind || ''}`}>{children}</span>;
}

export function Meter({ used, limit, lg = false }: { used: number; limit: number; lg?: boolean }) {
  return (
    <div className={`meter ${lg ? 'lg' : ''} ${meterClass(used, limit)}`}>
      <i style={{ width: `${limit ? Math.min(100, (used / limit) * 100) : 0}%` }} />
    </div>
  );
}

export function Mini({ used, limit }: { used: number; limit: number }) {
  return (
    <div className="mini">
      <span className="t">{used} <span className="faint">of {limit}</span></span>
      <Meter used={used} limit={limit} />
    </div>
  );
}

export function DnsBadge({ dns }: { dns: { verified: boolean; missingRequired: string[] } | null }) {
  if (!dns) return <Badge><span className="dot" />Not checked</Badge>;
  if (dns.verified) return <Badge kind="ok"><span className="dot" />Verified</Badge>;
  return <Badge kind="warn"><span className="dot" />{dns.missingRequired.length ? `${dns.missingRequired.length} missing` : 'Pending'}</Badge>;
}

export function Tile({ name, lg = false }: { name: Parameters<typeof Icon>[0]['name']; lg?: boolean }) {
  return <span className={`tile ${lg ? 'lg' : ''}`}><Icon name={name} /></span>;
}
