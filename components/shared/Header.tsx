"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CartCount } from "@/components/cart/CartCount";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Stores", href: "/stores" },
  { label: "Special Deals", href: "/specials" },
  { label: "Events & Gifts", href: "/events-gifts" },
  { label: "Gift Card", href: "/gift-card" },
  { label: "About", href: "/about" },
  { label: "DK Show", href: "/dk-show" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="wrap flex items-center justify-between h-[74px] gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-[1.5rem] font-semibold tracking-tight text-ink">
            Debb&apos;s <span className="text-burgundy">Kitchen</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-[22px]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-[0.92rem] text-ink/80 hover:text-burgundy transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <CartCount />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="xl:hidden border-t border-line bg-paper">
          <div className="wrap py-3 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-[11px] font-sans text-[0.98rem] text-ink/85 border-b border-line/60 last:border-0 hover:text-burgundy"
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
