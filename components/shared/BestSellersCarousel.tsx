"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "./ProductCard";

// Matches the live site's best-sellers strip: image, name, short rule, then
// price or "Out of stock". One per view on phones, four on desktop.
export function BestSellersCarousel({ products }: { products: ProductCardData[] }) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>("[data-slide]");
    el.scrollBy({ left: dir * (item?.offsetWidth ?? el.clientWidth), behavior: "smooth" });
  };

  if (!products.length) {
    return <p className="text-center text-muted">No products yet.</p>;
  }

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/shop/${p.slug}`}
            data-slide
            className="group snap-center shrink-0 basis-full md:basis-1/4 px-6 text-center"
          >
            <div className="aspect-[3/4] flex items-center justify-center">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="text-6xl opacity-40">🫙</span>
              )}
            </div>
            <h3 className="mt-6 font-sans font-light text-[1.6rem] md:text-[1.15rem] tracking-[0.02em]">
              {p.name}
            </h3>
            <div className="mx-auto my-3 h-px w-8 bg-ink" />
            <p className="font-sans font-light text-[1.4rem] md:text-[1rem]">
              {p.inStock ? formatPrice(p.priceCents) : "Out of stock"}
            </p>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-[38%] -translate-y-1/2 p-2 text-ink/80 hover:text-ink md:-left-4"
      >
        <ChevronLeft className="w-8 h-8" strokeWidth={1} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        className="absolute right-0 top-[38%] -translate-y-1/2 p-2 text-ink/80 hover:text-ink md:-right-4"
      >
        <ChevronRight className="w-8 h-8" strokeWidth={1} />
      </button>
    </div>
  );
}
