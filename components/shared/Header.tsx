"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { CartCount } from "@/components/cart/CartCount";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "DK Show", href: "/dk-show" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-line">
      <div className="wrap grid grid-cols-[1fr_auto_1fr] items-center h-[76px] gap-4">
        {/* Left: nav (desktop) / hamburger (mobile) */}
        <nav className="hidden lg:flex items-center gap-1 justify-self-start">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-[3px] font-sans text-[0.76rem] uppercase tracking-[0.12em] transition-colors ${
                isActive(item.href)
                  ? "bg-mint/60 text-green-dark"
                  : "text-ink/75 hover:text-green"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden justify-self-start inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Center: logo */}
        <Link href="/" className="justify-self-center" aria-label="Debb's Kitchen home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dk-logo.png" alt="Debb's Kitchen" className="h-[52px] w-auto" />
        </Link>

        {/* Right: search + account + cart */}
        <div className="flex items-center gap-1 justify-self-end">
          <Link
            href="/shop"
            aria-label="Search"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream text-ink/70"
          >
            <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
          </Link>
          <Link
            href="/admin"
            aria-label="Account"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream text-ink/70"
          >
            <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
          </Link>
          <CartCount />
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-paper">
          <div className="wrap py-3 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-[11px] font-sans text-[0.82rem] uppercase tracking-[0.1em] border-b border-line/60 last:border-0 ${
                  isActive(item.href) ? "text-green-dark" : "text-ink/85 hover:text-green"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
