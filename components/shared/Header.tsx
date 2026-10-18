"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { DesktopSearch, MobileSearch } from "./SearchPanel";

const SHOP_SUB = [
  { label: "STORES", href: "/stores" },
  { label: "SPECIAL DEALS", href: "/specials" },
  { label: "EVENTS & GIFTS", href: "/events-gifts" },
  { label: "GIFT CARD", href: "/gift-card" },
];

const NAV = [
  { label: "SHOP", href: "/shop", sub: SHOP_SUB },
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

// Live site's cart bag: green outline with the item count inside in dark green.
function CartBag({ count }: { count: number }) {
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} className="inline-flex">
      <svg viewBox="33 25 142 167" className="w-[31px] h-[36px] lg:w-[26px] lg:h-[30px] font-sans" aria-hidden="true">
        <g fill="none" stroke="#068e78" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 75H168L158 186H51Z" />
          <path d="M75 93V58a30 30 0 0 1 60 0v35" />
        </g>
        <text x="105" y="158" textAnchor="middle" fill="#04473c" fontFamily="inherit" fontWeight="300" fontSize={count > 9 ? 66 : 90}>
          {count > 99 ? "99+" : count}
        </text>
      </svg>
    </Link>
  );
}

// Full-screen mint menu used on phones, as on the live site. It stays mounted
// so it can slide in from the right and back out again.
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [shopOpen, setShopOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (!open) {
      setSearching(false);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  return (
    <>
      <div
        role="dialog"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={`lg:hidden fixed inset-0 z-[80] bg-[#ace3da] overflow-y-auto pb-10 transition-[opacity,visibility] duration-[400ms] ease-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Contents ease down into place as the panel fades in. */}
        <div className={`transition-transform duration-[400ms] ease-out ${open ? "translate-y-0" : "-translate-y-6"}`}>
        <Link href="/admin" onClick={onClose} className="mt-[88px] ml-[62px] flex w-fit items-center gap-[20px] h-[29px] text-green font-sans font-light text-[22px]">
          <UserIcon className="w-[29px] h-[29px]" />
          Log In
        </Link>
        <button
          type="button"
          onClick={() => setSearching(true)}
          className="mt-[24px] ml-[73px] flex items-center gap-[16px] w-[292px] max-w-[calc(100%-98px)] h-[84px] border-b border-ink text-left font-sans font-light text-[22px]"
        >
          <Search className="w-[21px] h-[21px] shrink-0" strokeWidth={1.6} />
          Search...
        </button>
        <nav className="mt-[26px] ml-[69px] w-[195px]">
          {NAV.map((item) => (
            <div key={item.href}>
              <div className="flex items-center justify-between h-[68px]">
                <Link href={item.href} onClick={onClose} className="font-sans font-light text-[24px] leading-none">
                  {item.label}
                </Link>
                {item.sub && (
                  <button
                    type="button"
                    aria-label={shopOpen ? "Hide shop menu" : "Show shop menu"}
                    aria-expanded={shopOpen}
                    onClick={() => setShopOpen((v) => !v)}
                    className="p-2 -mr-2"
                  >
                    <ChevronDown className={`w-[18px] h-[18px] transition-transform ${shopOpen ? "rotate-180" : ""}`} strokeWidth={1.6} />
                  </button>
                )}
              </div>
              {item.sub && shopOpen && (
                <div className="pl-5 pb-2">
                  {item.sub.map((s) => (
                    <Link key={s.href} href={s.href} onClick={onClose} className="block py-[10px] font-sans font-light text-[20px]">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        </div>
        {/* The menu button's three bars turn into an X in the same spot. */}
        <button type="button" onClick={onClose} aria-label="Close menu" className="absolute top-[118px] right-[24px] w-[27px] h-[26px]">
          <span className={`absolute left-0 top-0 w-full h-[2.5px] bg-ink transition-transform duration-[400ms] ease-out ${open ? "translate-y-[11.5px] rotate-45" : ""}`} />
          <span className={`absolute left-0 top-[11.5px] w-full h-[2.5px] bg-ink transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute left-0 top-[23px] w-full h-[2.5px] bg-ink transition-transform duration-[400ms] ease-out ${open ? "-translate-y-[11.5px] -rotate-45" : ""}`} />
        </button>
      </div>
      {open && searching && <MobileSearch onBack={() => setSearching(false)} onDone={onClose} />}
    </>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();
  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="bg-white">
      <div className="relative mx-auto max-w-[1512px] h-[91px] lg:h-[198px] pl-[27px] pr-[24px] lg:px-[58px] flex items-center">
        {/* Menu (desktop), SHOP has a hover dropdown */}
        <nav className="hidden lg:flex items-center gap-[22px]">
          {NAV.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`block font-nav font-light text-[16px] leading-[50px] h-[50px] px-[10px] transition-colors ${
                  isActive(item.href) || item.sub?.some((s) => isActive(s.href)) ? "bg-mint/70" : "hover:text-green"
                }`}
              >
                {item.label}
              </Link>
              {item.sub && (
                <div className="absolute left-0 top-full z-50 hidden group-hover:block group-focus-within:block bg-white shadow-[0_6px_20px_rgba(0,0,0,0.12)] min-w-[190px] py-2">
                  {item.sub.map((s) => (
                    <Link key={s.href} href={s.href} className="block px-[14px] py-[9px] font-nav font-light text-[15px] hover:bg-mint/50">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logo: left on phones, centred on desktop */}
        <Link href="/" aria-label="Debb's Kitchen home" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/dk-logo.png" alt="Debb's Kitchen" className="h-[60px] lg:h-[99px] w-auto" />
        </Link>

        <div className="ml-auto flex items-center gap-[48px] lg:gap-[34px]">
          <DesktopSearch />
          <Link href="/admin" className="hidden lg:flex items-center gap-2 text-green font-sans font-light text-[17px]">
            <UserIcon className="w-[24px] h-[24px]" />
            Log In
          </Link>
          <CartBag count={count} />
          <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="lg:hidden flex flex-col gap-[9px] w-[27px]">
            <span className="block h-[2.5px] bg-ink" />
            <span className="block h-[2.5px] bg-ink" />
            <span className="block h-[2.5px] bg-ink" />
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
