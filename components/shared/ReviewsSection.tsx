"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Search, ChevronRight, MoreVertical, ChevronDown, Pencil } from "lucide-react";

export interface ReviewItem {
  id: string;
  rating: number;
  title: string;
  body: string | null;
  author: string;
  location: string | null;
  verified: boolean;
  ago: string;
  product: { slug: string; name: string; imageUrl: string | null } | null;
  /** Product no longer in the shop: named, but not linked. */
  productName: string | null;
  reply: { body: string; ago: string } | null;
}

// The live widget (Fera) draws phones at 320px and scales it up to the
// screen, so below `sm` sizes are its desktop sizes x1.22.

function Stars({ value, className }: { value: number; className: string }) {
  return (
    <span className="inline-flex gap-[4px] sm:gap-[3px]" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            d="M12 1.8l3.1 6.6 7.1.9-5.2 4.9 1.4 7.1L12 17.8l-6.4 3.5 1.4-7.1L1.8 9.3l7.1-.9z"
            fill={n <= value ? "#000" : "#d1d1d1"}
          />
        </svg>
      ))}
    </span>
  );
}

function Verified() {
  return (
    <svg viewBox="0 0 16 16" className="w-[19.5px] h-[19.5px] sm:w-[16px] sm:h-[16px]" aria-label="Verified">
      <path
        d="M8 .6l1.8 1.3 2.2-.1.7 2.1 1.8 1.3-.7 2.1.7 2.1-1.8 1.3-.7 2.1-2.2-.1L8 14l-1.8-1.3-2.2.1-.7-2.1L1.5 9.4l.7-2.1-.7-2.1 1.8-1.3.7-2.1 2.2.1z"
        fill="#000"
      />
      <path d="M5 7.6l2 2 4-4.2" fill="none" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

const CUT = 72; // the widget's preview length before "...SHOW MORE"

function ReviewCard({ r }: { r: ReviewItem }) {
  const [full, setFull] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const long = (r.body?.length ?? 0) > CUT + 3;
  const muted = "text-[#737373]";
  return (
    <article className="bg-white border border-[#f2f2f2] shadow-[6px_6px_24px_#e6e6e6]">
      <div className="px-[25px] pt-[25px] pb-[24px] sm:p-[20px]">
        <div className="flex items-center justify-between">
          <Stars value={r.rating} className="w-[24px] h-[24px] sm:w-[20px] sm:h-[20px]" />
          <span className="flex items-center gap-[15px] sm:gap-[12px]">
            <span className={`text-[17px] sm:text-[14px] ${muted}`}>{r.ago}</span>
            <MoreVertical className="w-[22px] h-[22px] sm:w-[18px] sm:h-[18px] text-[#888]" aria-hidden="true" />
          </span>
        </div>
        {/* The widget keeps the text in a narrower column than the stars row. */}
        <div className="pr-[36px] sm:pr-[34px]">
          <h3 className="mt-[24px] sm:mt-[20px] font-reviews font-semibold tracking-normal text-[22px] sm:text-[18px] leading-[1.4]">{r.title}</h3>
          {r.body && (
            <p className="mt-[15px] sm:mt-[12px] text-[19.5px] sm:text-[16px] leading-[1.4] whitespace-pre-line">
              {long && !full ? (
                <>
                  {r.body.slice(0, CUT).trimEnd()}...
                  <button
                    type="button"
                    onClick={() => setFull(true)}
                    className={`uppercase text-[15.5px] sm:text-[12.8px] ${muted} hover:underline`}
                  >
                    Show More
                  </button>
                </>
              ) : (
                r.body
              )}
            </p>
          )}
          <p className="mt-[19.5px] sm:mt-[16px] flex items-center gap-[5px] sm:gap-[4px] font-semibold text-[19.5px] sm:text-[16px] leading-[1.4]">
            {r.author} {r.verified && <Verified />}
          </p>
          {r.location && <p className="text-[17px] sm:text-[14px] text-[#444]">{r.location}</p>}
          {r.reply && (
            <div className="relative mt-[19.5px] sm:mt-[16px] inline-block max-w-full bg-[#fafafa] border border-[#f2f2f2] px-[19.5px] py-[14.5px] sm:px-[16px] sm:py-[12px]">
              {/* speech-bubble notch */}
              <span className="absolute -top-[7px] left-[22px] w-[12px] h-[12px] rotate-45 bg-[#fafafa] border-l border-t border-[#f2f2f2]" />
              <div className={`relative flex items-center justify-between gap-[56px] sm:gap-[28px] whitespace-nowrap text-[14.5px] sm:text-[12px] ${muted}`}>
                <button type="button" onClick={() => setReplyOpen((v) => !v)} className="hover:underline">
                  {replyOpen ? "Hide Reply" : "Show Reply (1)"}
                </button>
                <span>{r.reply.ago}</span>
              </div>
              {replyOpen && (
                <div className="relative mt-[12px] text-[17px] sm:text-[14px] leading-[1.4] whitespace-pre-line">
                  {r.reply.body}
                  <p className="mt-[10px] font-semibold">Debbs Kitchen</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {r.product ? (
        <Link
          href={`/shop/${r.product.slug}`}
          className="flex items-center gap-[15px] sm:gap-[12px] border-t border-[#f2f2f2] p-[24px] sm:p-[20px] text-[#444] hover:bg-[#fafafa]"
        >
          {r.product.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.product.imageUrl} alt="" className="w-[49px] h-[49px] sm:w-[40px] sm:h-[40px] object-contain" />
          )}
          <span className="flex-1 min-w-0 font-semibold text-[19.5px] sm:text-[16px] leading-[1.4]">
            View product
            <span className="block font-normal text-[17px] sm:text-[14px]">{r.product.name}</span>
          </span>
          <ChevronRight className="w-[23px] h-[23px] sm:w-[19px] sm:h-[19px]" strokeWidth={1.5} />
        </Link>
      ) : (
        r.productName && (
          <p className="border-t border-[#f2f2f2] p-[24px] sm:p-[20px] text-[17px] sm:text-[14px] text-[#444] truncate">
            Product: {r.productName}
          </p>
        )
      )}
    </article>
  );
}

// Masonry that fills left-to-right like the widget: one layout per
// breakpoint, with reviews dealt round-robin into the columns.
const LAYOUTS = [
  [1, "flex sm:hidden"],
  [2, "hidden sm:flex md:hidden"],
  [3, "hidden md:flex lg:hidden"],
  [5, "hidden lg:flex"],
] as const;

const PHONE = "(max-width: 639px)";
const subscribePhone = (cb: () => void) => {
  const mq = window.matchMedia(PHONE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const isPhoneNow = () => window.matchMedia(PHONE).matches;

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
  // The widget pages 6 at a time on phones and 12 on larger screens.
  const isPhone = useSyncExternalStore(subscribePhone, isPhoneNow, () => false);
  const page = isPhone ? 6 : 12;
  const [pages, setPages] = useState(1);
  const shown = page * pages;
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
    <section className={`font-reviews ${variant === "list" ? "bg-white pt-0 pb-0" : "bg-[#fafafa] pt-[49px] sm:pt-[60px] pb-[90px]"}`}>
      <div className={variant === "list" ? "px-[29px] sm:px-4 lg:px-0" : "px-[29px] sm:px-4 lg:px-[48px]"}>
        <h2
          className={`font-reviews text-[39px] sm:text-[32px] lg:text-[40px] tracking-[-0.02em] ${
            variant === "list" ? "text-left" : "text-center"
          }`}
        >
          {title}
        </h2>

        {/* Phones: stars and count centred, with a black pencil button below. */}
        <div className="sm:hidden flex flex-col items-center">
          <div className="mt-[19.5px] flex items-center">
            <Stars value={Math.round(avg)} className="w-[35px] h-[35px]" />
            <span className="ml-[18px] text-[22px] text-[#737373]">({reviews.length})</span>
            <ChevronDown className="ml-[18px] w-[19.5px] h-[19.5px]" strokeWidth={1.5} />
          </div>
          <Link
            href="/contact"
            aria-label="Write a review"
            className="mt-[19.5px] flex items-center justify-center w-[61px] h-[41px] bg-black text-white"
          >
            <Pencil className="w-[19.5px] h-[19.5px]" fill="currentColor" strokeWidth={1} />
          </Link>
        </div>

        <div className="hidden sm:flex mt-6 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[28px] leading-none">{avg.toFixed(1)}</span>
            <Stars value={Math.round(avg)} className="w-[26px] h-[26px]" />
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

        <div className={variant === "list" ? "hidden" : "mt-[28px] sm:mt-6 border-t border-[#d1d1d1] sm:border-line pt-[21px] sm:pt-6"}>
          <label className="flex items-center gap-[10px] sm:gap-2 h-[43px] sm:h-[41px] px-[12px] sm:px-3 bg-white border border-[#d1d1d1]">
            <Search className="w-[19.5px] h-[19.5px] sm:w-4 sm:h-4 text-ink sm:text-muted" strokeWidth={1.6} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPages(1);
              }}
              placeholder="Search reviews..."
              className="w-full bg-transparent outline-none text-[17px] sm:text-[14px]"
            />
          </label>
          <p className="mt-[30px] sm:mt-4 text-[14.5px] sm:text-[13px] text-[#737373]">
            {filtered.length ? 1 : 0} - {visible.length} of {filtered.length} reviews
          </p>
        </div>

        {variant === "list" ? (
          <div className="mt-[41px] sm:mt-5 space-y-[18px] sm:space-y-[16px]">
            {visible.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          LAYOUTS.map(([cols, cls]) => (
            <div key={cols} className={`mt-[37px] sm:mt-5 gap-[16px] items-start ${cls}`}>
              {Array.from({ length: cols }, (_, c) => (
                <div key={c} className="flex-1 min-w-0 flex flex-col gap-[18px] sm:gap-[16px]">
                  {visible
                    .filter((_, k) => k % cols === c)
                    .map((r) => (
                      <ReviewCard key={r.id} r={r} />
                    ))}
                </div>
              ))}
            </div>
          ))
        )}

        {shown < filtered.length && (
          <div className="mt-[24px] sm:mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setPages((n) => n + 1)}
              className="w-full sm:max-w-[375px] h-[55px] sm:h-[46px] border border-ink bg-white font-semibold sm:font-normal text-[19.5px] sm:text-[14px] hover:bg-ink hover:text-white transition-colors"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
