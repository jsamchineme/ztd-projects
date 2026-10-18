"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Item {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  freeShipping: boolean;
}

// "Related Products" as on the live product page: a scrolling row on desktop,
// and one card at a time between thin arrows on phones.
export function RelatedProducts({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const step = (d: number) => setI((n) => (n + d + items.length) % items.length);

  return (
    <section className="mt-[80px] -mx-4 px-[25px] lg:mx-0 lg:px-0">
      <div className="lg:hidden border-t-[1.5px] border-ink/85" />
      <h2 className="mt-[45px] lg:mt-0 pl-[49px] lg:pl-0 font-light text-[31px] lg:text-[28px] leading-[1.3]">Related Products</h2>

      {/* Phones */}
      <div className="lg:hidden mt-[45px] relative">
        <div
          className="mx-auto w-[242px]"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{ transform: `translateX(-${i * 100}%)` }}
            >
              {items.map((p, n) => (
                <Link key={p.id} href={`/shop/${p.slug}`} aria-hidden={n !== i} tabIndex={n === i ? 0 : -1} className="block w-full shrink-0">
                  <div className="aspect-square bg-white">
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="mt-[20px] font-light text-[20px] leading-[1.4]">{p.name}</p>
                  <p className="mt-[8px] font-light text-[20px] text-muted">{formatPrice(p.priceCents)}</p>
                  {p.freeShipping && <p className="mt-[10px] font-light text-[16px] text-muted underline">Free Shipping</p>}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {items.length > 1 && (
          <>
            <Arrow dir="prev" onClick={() => step(-1)} />
            <Arrow dir="next" onClick={() => step(1)} />
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex mt-8 gap-[20px] overflow-x-auto snap-x pb-2 [scrollbar-width:thin]">
        {items.map((p) => (
          <Link key={p.id} href={`/shop/${p.slug}`} className="group snap-start shrink-0 w-[210px]">
            <div className="relative aspect-square bg-white">
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              )}
              <span className="absolute inset-x-0 bottom-0 h-[30px] flex items-center justify-center bg-white/85 text-[13px] opacity-0 group-hover:opacity-100 transition-opacity">
                Quick View
              </span>
            </div>
            <p className="mt-3 font-light text-[16px]">{p.name}</p>
            <p className="mt-1 font-light text-[15px] text-muted">{formatPrice(p.priceCents)}</p>
            {p.freeShipping && <p className="mt-1 font-light text-[12px] text-muted underline">Free Shipping</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous product" : "Next product"}
      className={`absolute top-[121px] -translate-y-1/2 p-2 ${dir === "prev" ? "left-[1px]" : "right-[1px]"}`}
    >
      <svg viewBox="0 0 10 18" className="w-[11px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
        <path d={dir === "prev" ? "M9 1L1 9l8 8" : "M1 1l8 8-8 8"} />
      </svg>
    </button>
  );
}
