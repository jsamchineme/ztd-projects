"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
  const [priceOpen, setPriceOpen] = useState(Boolean(params.get("min") || params.get("max")));
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
    <aside className="font-sans">
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
          <div className="pb-5 space-y-3 text-[14px] font-light">
            <label className="flex items-center gap-3">
              <span className="w-8">${min}</span>
              <input type="range" min={lo} max={hi} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), max))} onMouseUp={() => applyPrice(min, max)} onTouchEnd={() => applyPrice(min, max)} className="flex-1 accent-gold" aria-label="Minimum price" />
            </label>
            <label className="flex items-center gap-3">
              <span className="w-8">${max}</span>
              <input type="range" min={lo} max={hi} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), min))} onMouseUp={() => applyPrice(min, max)} onTouchEnd={() => applyPrice(min, max)} className="flex-1 accent-gold" aria-label="Maximum price" />
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}

export function SortBy() {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <select
      aria-label="Sort by"
      value={params.get("sort") ?? ""}
      onChange={(e) => {
        const p = new URLSearchParams(params.toString());
        if (e.target.value) p.set("sort", e.target.value);
        else p.delete("sort");
        router.push(p.toString() ? `/shop?${p}` : "/shop", { scroll: false });
      }}
      className="h-[38px] w-[200px] px-3 border border-ink/60 bg-white font-sans font-light text-[15px] outline-none"
    >
      <option value="">Sort by</option>
      <option value="price-asc">Price (low to high)</option>
      <option value="price-desc">Price (high to low)</option>
      <option value="name-asc">Name A-Z</option>
      <option value="name-desc">Name Z-A</option>
    </select>
  );
}
