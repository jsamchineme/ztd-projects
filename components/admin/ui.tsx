import Link from "next/link";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20";

export const btnCls =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";
export const btnPrimary = cn(btnCls, "bg-green text-white hover:bg-green-dark");
export const btnSecondary = cn(btnCls, "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50");
export const btnDanger = cn(btnCls, "border border-red-200 bg-white text-red-600 hover:bg-red-50");

export function PageHeader({
  title,
  description,
  back,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-block text-sm text-neutral-500 hover:text-neutral-900">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={cn("rounded-lg border border-neutral-200 bg-white p-5 shadow-sm", className)}>
      {title && <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>}
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

export function Check({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-neutral-800">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-green" />
      <span>
        {label}
        {hint && <span className="block text-xs text-neutral-500">{hint}</span>}
      </span>
    </label>
  );
}

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  gray: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: keyof typeof tones }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", tones[tone])}>
      {children}
    </span>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500">{children}</div>;
}

/** Green banner after a successful save (`?saved=1`). */
export function SavedNotice({ show, text = "Saved." }: { show: boolean; text?: string }) {
  if (!show) return null;
  return <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{text}</div>;
}

export function Table({ head, children }: { head: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">{children}</tbody>
      </table>
    </div>
  );
}

export const td = "px-4 py-3 align-middle";

/** Search box that submits as a GET form (`?q=`). */
export function SearchBox({ q, placeholder = "Search…", children }: { q?: string; placeholder?: string; children?: React.ReactNode }) {
  return (
    <form className="mb-4 flex flex-wrap gap-2">
      <input name="q" defaultValue={q} placeholder={placeholder} className={cn(inputCls, "max-w-xs")} />
      {children}
      <button className={btnSecondary}>Filter</button>
    </form>
  );
}
