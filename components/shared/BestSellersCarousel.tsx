"use client";

import Link from "next/link";
import { useRef } from "react";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "./ProductCard";

// Live site: four across on desktop (277×369 images); on phones a one-per-view
// carousel with thin arrows. Under each image: name, short rule, price or
// "Out of stock", and "Free Shipping" for in-stock items.
export function BestSellersCarousel({ products }: { products: ProductCardData[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  if (!products.length) return <p className="text-center text-muted">No products yet.</p>;

  return (
    <div className="relative mx-auto max-w-[1270px]">
      <div
        ref={track}
        className="flex lg:grid lg:grid-cols-4 lg:gap-[54px] snap-x snap-mandatory overflow-x-auto lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-center shrink-0 basis-full lg:basis-auto px-10 lg:px-0 text-center">
            <Link href={`/shop/${p.slug}`} className="group relative block mx-auto w-full max-w-[277px] aspect-[277/369] bg-white overflow-hidden">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110" />
              ) : null}
              <span className="absolute inset-x-0 bottom-0 h-[38px] hidden lg:flex items-center justify-center bg-white/80 font-sans font-light text-[14px] opacity-0 translate-y-[6px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,translate] duration-300 ease-out">
                Quick View
              </span>
            </Link>
            <Link href={`/shop/${p.slug}`} className="block mt-4">
              <h3 className="font-sans font-light text-[24px] lg:text-[17px] leading-[1.4]">{p.name}</h3>
            </Link>
            <div className="mx-auto my-[8px] h-px w-[16px] lg:w-[12px] bg-ink" />
            <p className="font-sans font-light text-[22px] lg:text-[16px] leading-[1.5]">
              {p.inStock ? formatPrice(p.priceCents) : "Out of stock"}
            </p>
            {p.inStock && p.freeShipping && (
              <Link href={`/shop/${p.slug}`} className="inline-block mt-1 font-sans font-light text-[17px] underline underline-offset-2">
                Free Shipping
              </Link>
            )}
          </div>
        ))}
      </div>

      {[-1, 1].map((d) => (
        <button
          key={d}
          type="button"
          aria-label={d < 0 ? "Previous" : "Next"}
          onClick={() => scroll(d as 1 | -1)}
          className={`lg:hidden absolute top-[30%] -translate-y-1/2 p-2 ${d < 0 ? "left-0" : "right-0"}`}
        >
          <svg viewBox="0 0 21 41" className="w-[14px] h-[28px]" aria-hidden="true">
            <path
              d={d < 0 ? "M20.3 40.8 0 20.5 20.3.2l.7.7L1.3 20.5 21 40.1z" : "M.7 40.8 21 20.5.7.2 0 .9l19.7 19.6L0 40.1z"}
              fill="currentColor"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
