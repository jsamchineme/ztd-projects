// Small presentation helpers shared by components.
export const gbp = (n: number) => '£' + (Math.round(n * 100) / 100).toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export function fmtBytes(b: number): string {
  if (b >= 1024 ** 3) return `${(b / 1024 ** 3).toFixed(b >= 10 * 1024 ** 3 ? 0 : 1)} GB`;
  if (b >= 1024 ** 2) return `${Math.round(b / 1024 ** 2)} MB`;
  if (b >= 1024) return `${Math.round(b / 1024)} KB`;
  return `${b} B`;
}

export const gbOf = (b: number) => Math.round((b / 1024 ** 3) * 10) / 10;

export function ago(iso: string | Date | null | undefined): string {
  if (!iso) return '—';
  const t = typeof iso === 'string' ? Date.parse(iso) : iso.getTime();
  const s = (Date.now() - t) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const dateTime = (iso: string | Date | null | undefined) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) : '—';

export const firstName = (n: string | null | undefined) => String(n || '').split(/\s+/)[0] || '';

const COLORS = ['#7c3aed', '#0f766e', '#b45309', '#be185d', '#2563eb', '#4d7c0f', '#9f1239', '#0e7490', '#6d28d9', '#c2410c'];
export const color = (s: string) => COLORS[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]!;
export const initials = (n: string) => String(n).split(/[\s@.]+/).filter((w) => /[A-Za-z0-9]/.test(w[0] || '')).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export const meterClass = (u: number, l: number) => (u >= l ? 'full' : l && u / l >= 0.8 ? 'warn' : '');
