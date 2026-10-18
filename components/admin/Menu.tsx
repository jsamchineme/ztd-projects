"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { btnSecondary } from "./ui";

/**
 * Lightweight click-to-open dropdown. Unlike a portal-based menu, its children
 * render in normal DOM flow, so server-action <form>s inside menu items work.
 */
export function Menu({
  label,
  children,
  align = "right",
  trigger,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  align?: "left" | "right";
  trigger?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={cn("relative inline-block", className)} ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {trigger ?? (
          <span className={btnSecondary}>
            {label}
            <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
          </span>
        )}
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-30 mt-1 min-w-52 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export const menuItemCls =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50";
export const menuDangerCls =
  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50";

export function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={menuItemCls}>
      {children}
    </Link>
  );
}

/** A menu item that submits a server action for the given order id. */
export function MenuAction({
  action,
  id,
  children,
  danger,
  confirm,
}: {
  action: (fd: FormData) => Promise<void>;
  id: string;
  children: React.ReactNode;
  danger?: boolean;
  confirm?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={danger ? menuDangerCls : menuItemCls}>
        {children}
      </button>
    </form>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-neutral-100" />;
}
