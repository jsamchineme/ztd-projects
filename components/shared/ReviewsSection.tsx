"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ChevronRight, MoreVertical, ChevronDown } from "lucide-react";

export interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  body: string | null;
  author: string;
  location: string | null;
  ago: string;
  product: { slug: string; name: string; imageUrl: string | null } | null;
}

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-[2px]" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path
            d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
            fill={n <= value ? "#000" : "#d6d6d6"}
          />
        </svg>
      ))}
    </span>
  );
}

function Verified() {
  return (
    <svg viewBox="0 0 16 16" className="w-[14px] h-[14px]" aria-label="Verified">
      <circle cx="8" cy="8" r="8" fill="#000" />
      <path d="M4.6 8.2l2.2 2.2 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

function ReviewCard({ r }: { r: ReviewItem }) {
  return (
    <article className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <Stars value={r.rating} size={22} />
          <span className="flex items-center gap-1 text-[12px] text-muted">
            {r.ago}
            <MoreVertical className="w-4 h-4" />
          </span>
        </div>
        <h3 className="mt-4 font-reviews font-bold text-[17px]">{r.title}</h3>
        {r.body && <p className="mt-3 text-[15px] leading-[1.55]">{r.body}</p>}
        <p className="mt-4 flex items-center gap-1 font-bold text-[15px]">
          {r.author} <Verified />
        </p>
        {r.location && <p className="text-[12px] text-muted">{r.location}</p>}
      </div>
      {r.product && (
        <Link
          href={`/shop/${r.product.slug}`}
          className="flex items-center gap-3 border-t border-line px-5 py-4 hover:bg-soft"
        >
          {r.product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.product.imageUrl} alt="" className="w-[28px] h-[36px] object-contain" />
          )}
          <span className="flex-1 text-[15px] leading-tight">
            View product
            <span className="block text-[13px] text-muted">{r.product.name}</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </article>
  );
}

// Masonry that fills left-to-right like the Wix widget: one layout per
// breakpoint, with reviews dealt round-robin into the columns.
const LAYOUTS = [
  [1, "flex sm:hidden"],
  [2, "hidden sm:flex md:hidden"],
  [3, "hidden md:flex lg:hidden"],
  [5, "hidden lg:flex"],
] as const;

const PAGE = 12;

export function ReviewsSection({
  reviews,
  title = "Reviews",
  variant = "grid",
}: {
  reviews: ReviewItem[];
  title?: string;
  /** "grid": masonry (home page); "list": stacked rows (product page). */
  variant?: "grid" | "list";
}) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PAGE);
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return reviews;
    return reviews.filter((r) =>
      [r.title, r.body, r.author, r.product?.name].some((v) => v?.toLowerCase().includes(s)),
    );
  }, [q, reviews]);
  const visible = filtered.slice(0, shown);

  if (!reviews.length) return null;

  return (
    <section className={`font-reviews ${variant === "list" ? "bg-white pt-0 pb-0" : "bg-[#fafafa] pt-[60px] pb-[90px]"}`}>
      <div className={variant === "list" ? "px-4 lg:px-0" : "px-4 lg:px-[48px]"}>
        <h2 className={`font-reviews text-[32px] lg:text-[40px] tracking-[-0.02em] ${variant === "list" ? "text-left" : "text-center"}`}>{title}</h2>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[28px] leading-none">{avg.toFixed(1)}</span>
            <Stars value={Math.round(avg)} size={26} />
            <span className="text-[14px] text-muted">({reviews.length} reviews)</span>
            <ChevronDown className="w-4 h-4 text-muted" />
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-[42px] px-5 bg-black text-white text-[14px] hover:opacity-85"
          >
            Write a review
          </Link>
        </div>

        <div className={variant === "list" ? "hidden" : "mt-6 border-t border-line pt-6"}>
          <label className="flex items-center gap-2 h-[39px] px-3 bg-white border border-[#d4d4d4] lg:ml-[37px]">
            <Search className="w-4 h-4 text-muted" strokeWidth={1.6} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShown(PAGE);
              }}
              placeholder="Search reviews..."
              className="w-full bg-transparent outline-none text-[14px]"
            />
          </label>
          <p className="mt-4 text-[13px] text-muted">
            Showing {filtered.length ? 1 : 0} - {visible.length} of {filtered.length} reviews.
          </p>
        </div>

        {variant === "list" ? (
          <div className="mt-5 space-y-[16px]">
            {visible.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>
        ) : LAYOUTS.map(([cols, cls]) => (
          <div key={cols} className={`mt-5 gap-[16px] items-start ${cls}`}>
            {Array.from({ length: cols }, (_, c) => (
              <div key={c} className="flex-1 min-w-0 flex flex-col gap-[16px]">
                {visible
                  .filter((_, k) => k % cols === c)
                  .map((r) => (
                    <ReviewCard key={r.id} r={r} />
                  ))}
              </div>
            ))}
          </div>
        ))}

        {shown < filtered.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShown((v) => v + PAGE)}
              className="w-full max-w-[375px] h-[46px] border border-ink bg-white text-[14px] hover:bg-ink hover:text-white transition-colors"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
