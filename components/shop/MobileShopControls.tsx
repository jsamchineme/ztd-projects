"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SORT_OPTIONS } from "./ShopSidebar";

interface Props {
  categories: { slug: string; name: string }[];
  bounds: { min: number; max: number };
}

// Phone layout of the live shop: a wide "Filter" button that opens a
// full-screen panel (Category / Price, Clear Filters / Apply) and a square
// sort button that opens the native picker.
export function MobileShopControls({ categories, bounds }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const lo = Math.floor(bounds.min / 100);
  const hi = Math.ceil(bounds.max / 100);

  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [min, setMin] = useState(lo);
  const [max, setMax] = useState(hi);

  // Start each visit to the panel from what's currently applied.
  const openPanel = () => {
    setCategory(params.get("category") ?? "all");
    setMin(Number(params.get("min") ?? lo));
    setMax(Number(params.get("max") ?? hi));
    setPriceOpen(Boolean(params.get("min") || params.get("max")));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) (v == null ? p.delete(k) : p.set(k, v));
    const qs = p.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const apply = () => {
    go({
      category: category === "all" ? null : category,
      min: min > lo ? String(min) : null,
      max: max < hi ? String(max) : null,
    });
    setOpen(false);
  };

  const clear = () => {
    setCategory("all");
    setMin(lo);
    setMax(hi);
    go({ category: null, min: null, max: null });
    setOpen(false);
  };

  const items = [
    { slug: "all", name: "All" },
    { slug: "most-popular", name: "MOST POPULAR" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name.toUpperCase() })),
  ];

  return (
    <div className="lg:hidden font-sans">
      <div className="flex gap-[15px]">
        <button
          type="button"
          onClick={openPanel}
          className="flex-1 h-[48px] border border-ink bg-transparent font-light text-[19px]"
        >
          Filter
        </button>
        <label className="relative flex items-center justify-center w-[48px] h-[48px] border border-ink">
          <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M7 20V4M3 8l4-4 4 4M17 4v16M13 16l4 4 4-4" />
          </svg>
          <select
            aria-label="Sort by"
            value={params.get("sort") ?? ""}
            onChange={(e) => go({ sort: e.target.value || null })}
            className="absolute inset-0 opacity-0 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Filter products" className="fixed inset-0 z-[100] flex flex-col bg-[#fafafa] text-ink">
          <div className="flex items-center justify-between h-[73px] px-[25px] border-b border-[#c8c8c8] shrink-0">
            <h2 className="font-light text-[25px]">SHOP</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close filters" className="-mr-1 p-1">
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M4 4l16 16M20 4L4 20" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-[#c8c8c8]">
              <button
                type="button"
                onClick={() => setCatOpen((v) => !v)}
                aria-expanded={catOpen}
                className="w-full flex items-center justify-between h-[84px] px-[25px] font-light text-[20px]"
              >
                Category <PlusMinus open={catOpen} />
              </button>
              {catOpen && (
                <ul className="px-[25px] -mt-[14px] pb-[30px]">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => setCategory(c.slug)}
                        className={`py-[3px] text-left text-[17px] leading-[22px] font-light ${category === c.slug ? "text-ink" : "text-[#5a5a5a]"}`}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-b border-[#c8c8c8]">
              <button
                type="button"
                onClick={() => setPriceOpen((v) => !v)}
                aria-expanded={priceOpen}
                className="w-full flex items-center justify-between h-[84px] px-[25px] font-light text-[20px]"
              >
                Price (${min} - ${max}) <PlusMinus open={priceOpen} />
              </button>
              {priceOpen && (
                <div className="px-[25px] -mt-[10px] pb-[30px] space-y-4 text-[16px] font-light">
                  <label className="flex items-center gap-3">
                    <span className="w-10">${min}</span>
                    <input type="range" min={lo} max={hi} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value), max))} className="flex-1 accent-ink" aria-label="Minimum price" />
                  </label>
                  <label className="flex items-center gap-3">
                    <span className="w-10">${max}</span>
                    <input type="range" min={lo} max={hi} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value), min))} className="flex-1 accent-ink" aria-label="Maximum price" />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 grid grid-cols-2 gap-[20px] px-[25px] pt-4 pb-[30px]">
            <button type="button" onClick={clear} className="h-[39px] border border-ink bg-transparent font-light text-[17px]">
              Clear Filters
            </button>
            <button type="button" onClick={apply} className="h-[39px] bg-ink text-white font-light text-[17px]">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M1 8h14" />
      {!open && <path d="M8 1v14" />}
    </svg>
  );
}
