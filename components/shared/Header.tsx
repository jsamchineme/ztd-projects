"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

const NAV = [
  { label: "SHOP", href: "/shop" },
  { label: "ABOUT", href: "/about" },
  { label: "DK SHOW", href: "/dk-show" },
  { label: "CAREERS", href: "/careers" },
  { label: "BLOG", href: "/blog" },
];

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <circle cx="12" cy="9.5" r="3.6" fill="#fff" />
      <path d="M5.2 19.2c1.4-2.9 3.9-4.4 6.8-4.4s5.4 1.5 6.8 4.4A9.6 9.6 0 0 1 12 21.6a9.6 9.6 0 0 1-6.8-2.4Z" fill="#fff" />
    </svg>
  );
}

function CartBag({ count }: { count: number }) {
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative inline-flex text-green">
      <svg viewBox="0 0 28 32" className="w-[26px] h-[30px]" aria-hidden="true">
        <path d="M5 9h18l-1.4 20H6.4L5 9Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.5 9V7a4.5 4.5 0 0 1 9 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span className="absolute inset-x-0 top-[12px] text-center text-[11px] font-sans leading-none">
        {count}
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="bg-white">
      <div className="relative mx-auto max-w-[1512px] h-[86px] lg:h-[198px] px-4 lg:px-[58px] flex items-center">
        {/* Menu (desktop) */}
        <nav className="hidden lg:flex items-center gap-[22px]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-nav font-light text-[16px] leading-[50px] h-[50px] px-[10px] transition-colors ${
                isActive(item.href) ? "bg-mint/70" : "hover:text-green"
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
          className="lg:hidden inline-flex items-center justify-center w-10 h-10"
        >
          {open ? <X className="w-6 h-6" strokeWidth={1.4} /> : <Menu className="w-6 h-6" strokeWidth={1.4} />}
        </button>

        {/* Logo, centred */}
        <Link href="/" aria-label="Debb's Kitchen home" className="absolute left-1/2 -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dk-logo.png" alt="Debb's Kitchen" className="h-[60px] lg:h-[99px] w-auto" />
        </Link>

        {/* Search, Log In, cart */}
        <div className="ml-auto flex items-center gap-[34px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
            }}
            className="hidden lg:flex items-center gap-2 w-[150px] border-b border-ink h-[45px]"
          >
            <Search className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
              className="w-full bg-transparent outline-none font-sans font-light text-[17px] placeholder:text-ink"
            />
          </form>
          <Link href="/admin" className="hidden lg:flex items-center gap-2 text-green font-sans font-light text-[17px]">
            <UserIcon className="w-[24px] h-[24px]" />
            Log In
          </Link>
          <CartBag count={count} />
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-white">
          <div className="px-6 py-3 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-3 font-nav font-light text-[16px] border-b border-line/60 last:border-0 ${
                  isActive(item.href) ? "text-green" : ""
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
