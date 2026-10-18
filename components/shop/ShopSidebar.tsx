"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Select } from "@/components/shared/Select";

interface Props {
  categories: { slug: string; name: string }[];
  bounds: { min: number; max: number };
}

// Left column of the live shop: "SHOP", a Category accordion and a Price
// accordion. Filters live in the URL so results are shareable.
export function ShopSidebar({ categories, bounds }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("category") ?? "all";
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const lo = Math.floor(bounds.min / 100);
  const hi = Math.ceil(bounds.max / 100);
  const [min, setMin] = useState(Number(params.get("min") ?? lo));
  const [max, setMax] = useState(Number(params.get("max") ?? hi));

  const href = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) (v == null ? p.delete(k) : p.set(k, v));
    const qs = p.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };
  const applyPrice = (a: number, b: number) =>
    router.push(href({ min: a > lo ? String(a) : null, max: b < hi ? String(b) : null }), { scroll: false });

  const items = [
    { slug: "all", name: "All" },
    { slug: "most-popular", name: "MOST POPULAR" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name.toUpperCase() })),
  ];

  return (
    <aside className="hidden lg:block lg:sticky lg:top-[126px] lg:self-start font-sans">
      <h2 className="font-light text-[26px]">SHOP</h2>
      <div className="mt-6 border-t border-ink/30">
        <button type="button" onClick={() => setCatOpen((v) => !v)} className="w-full flex items-center justify-between py-4 font-light text-[16px]">
          Category <span className="text-[20px] leading-none">{catOpen ? "−" : "+"}</span>
        </button>
        {catOpen && (
          <ul className="pb-5 space-y-[6px]">
            {items.map((c) => (
              <li key={c.slug}>
                <Link
                  href={href({ category: c.slug === "all" ? null : c.slug })}
                  scroll={false}
                  className={`text-[14px] font-light hover:text-green ${active === c.slug ? "font-semibold" : ""}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="border-t border-ink/30 border-b">
        <button type="button" onClick={() => setPriceOpen((v) => !v)} className="w-full flex items-center justify-between py-4 font-light text-[16px]">
          Price <span className="text-[20px] leading-none">{priceOpen ? "−" : "+"}</span>
        </button>
        {priceOpen && (
          // One track with two black handles and the range underneath, as on
          // the live site. Two overlaid range inputs; only their thumbs take
          // the pointer (see .dual-range in globals.css).
          <div className="pb-[22px] pt-[6px] font-light text-[14px]">
            <div className="relative h-[16px]">
              <div className="absolute left-[7px] right-[7px] top-1/2 h-[2px] -translate-y-1/2 bg-ink" />
              <input type="range" min={lo} max={hi} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), max))} onMouseUp={() => applyPrice(min, max)} onTouchEnd={() => applyPrice(min, max)} onKeyUp={() => applyPrice(min, max)} className="dual-range" aria-label="Minimum price" />
              <input type="range" min={lo} max={hi} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), min))} onMouseUp={() => applyPrice(min, max)} onTouchEnd={() => applyPrice(min, max)} onKeyUp={() => applyPrice(min, max)} className="dual-range" aria-label="Maximum price" />
            </div>
            <div className="mt-[6px] flex justify-between">
              <span>${min}</span>
              <span>${max}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export const SORT_OPTIONS = [
  { value: "", label: "Sort by" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "name-asc", label: "Name A-Z" },
];

export function SortBy() {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <div className="w-[200px]">
      <Select
        aria-label="Sort by"
        options={SORT_OPTIONS}
        value={params.get("sort") ?? ""}
        onChange={(v) => {
          const p = new URLSearchParams(params.toString());
          if (v) p.set("sort", v);
          else p.delete("sort");
          router.push(p.toString() ? `/shop?${p}` : "/shop", { scroll: false });
        }}
        className="h-[39px] px-[12px] border border-ink bg-white font-sans font-light text-[16px]"
      />
    </div>
  );
}
