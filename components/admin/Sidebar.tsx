"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  badge?: number;
}

export function Sidebar({
  groups,
  user,
  signOut,
}: {
  groups: { title?: string; items: NavItem[] }[];
  user: { name?: string | null; email?: string | null; role: string };
  signOut: () => Promise<void>;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-semibold">Debb&apos;s Kitchen Admin</span>
        <button onClick={() => setOpen(!open)} className="rounded border border-neutral-300 px-3 py-1 text-sm">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-neutral-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/admin" className="flex items-center gap-2 border-b border-neutral-200 px-5 py-4" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dk-logo.png" alt="" className="h-8 w-auto" onError={(e) => (e.currentTarget.style.display = "none")} />
          <span className="text-sm font-semibold leading-tight">
            Debb&apos;s Kitchen
            <span className="block text-xs font-normal text-neutral-500">Admin</span>
          </span>
        </Link>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g, gi) => (
            <div key={gi} className="mb-5">
              {g.title && <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">{g.title}</div>}
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
                    active(item.href) ? "bg-green/10 font-medium text-green-dark" : "text-neutral-700 hover:bg-neutral-100",
                  )}
                >
                  {item.label}
                  {!!item.badge && <span className="rounded-full bg-green px-1.5 text-[11px] font-semibold text-white">{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-4 text-sm">
          <div className="truncate font-medium">{user.name}</div>
          <div className="truncate text-xs text-neutral-500">
            {user.email} · {user.role.toLowerCase()}
          </div>
          <div className="mt-3 flex gap-3 text-xs">
            <Link href="/" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              View site ↗
            </Link>
            <Link href="/admin/account" className="text-neutral-600 hover:text-neutral-900" onClick={() => setOpen(false)}>
              Account
            </Link>
            <form action={signOut}>
              <button className="text-neutral-600 hover:text-red-600">Sign out</button>
            </form>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
