"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export interface HeroSlide {
  image: string;
  eyebrow?: string;
  title?: string;
  /** "top": box near the top (tagline + title); "low": box lower, letter-spaced title. */
  layout?: "top" | "low";
  buttonLabel?: string;
  buttonHref?: string;
  /** object-position used on phones, e.g. "90% 100%" (desktop is centred). */
  focus?: string;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 21 41" className="w-[20px] h-[40px] lg:w-[40px] lg:h-[81px]" aria-hidden="true">
      <path
        d={dir === "left" ? "M20.3 40.8 0 20.5 20.3.2l.7.7L1.3 20.5 21 40.1z" : "M.7 40.8 21 20.5.7.2 0 .9l19.7 19.6L0 40.1z"}
        fill="currentColor"
      />
    </svg>
  );
}

export function HeroSlideshow({ slides, interval = 4500 }: { slides: HeroSlide[]; interval?: number }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => go(1), interval);
    return () => clearInterval(t);
  }, [go, interval, n, i]);

  if (!n) return null;

  return (
    <section
      aria-label="Slideshow"
      className="relative w-full overflow-hidden h-[445px] sm:h-[clamp(420px,44.45vw,672px)] bg-ink"
    >
      {slides.map((s, k) => (
        <div
          key={k}
          aria-hidden={k !== i}
          className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.image}
            alt=""
            style={{ "--focus": s.focus ?? "50% 50%" } as React.CSSProperties}
            className="absolute inset-0 w-full h-full object-cover [object-position:var(--focus)] lg:[object-position:50%_50%]"
          />
          {(s.title || s.eyebrow) && (
            <div
              className={`absolute inset-x-[25px] top-[25px] lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[64.8%] bg-white/75 flex flex-col items-start lg:items-center text-left lg:text-center px-[26px] py-[24px] lg:px-6 ${
                s.layout === "low"
                  ? "lg:top-[42%] lg:py-[clamp(24px,3.4vw,52px)]"
                  : "lg:top-[11.5%] lg:py-[clamp(20px,2.1vw,32px)]"
              }`}
            >
              {s.eyebrow && (
                <p className="font-sans font-normal lg:font-bold text-[20px] lg:text-[clamp(11px,1.39vw,21px)] leading-[1.35] tracking-[0.15em] lg:tracking-[0.1em] mb-[18px] lg:mb-[clamp(10px,1.3vw,20px)]">
                  {s.eyebrow}
                </p>
              )}
              {s.title && (
                <h2
                  className={`font-sans font-light leading-[1.18] ${
                    s.layout === "low"
                      ? "text-[31px] lg:text-[clamp(24px,3.3vw,50px)] leading-[1.35] lg:leading-[1.18] tracking-[0.1em]"
                      : "text-[34px] lg:text-[clamp(30px,4.3vw,65px)]"
                  }`}
                >
                  {s.title}
                </h2>
              )}
              {s.buttonLabel && (
                <Link
                  href={s.buttonHref ?? "/shop"}
                  className="mt-[24px] lg:mt-[clamp(16px,2.4vw,37px)] inline-flex items-center justify-center w-[195px] h-[51px] lg:w-[144px] lg:h-[38px] bg-gold text-[#fcfcfc] font-sans font-light text-[16px] lg:text-[14px] hover:bg-gold-dark transition-colors"
                >
                  {s.buttonLabel}
                </Link>
              )}
            </div>
          )}
        </div>
      ))}

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute left-[10px] lg:left-[100px] top-[53%] lg:top-1/2 -translate-y-1/2 text-gold hover:text-gold-dark"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute right-[10px] lg:right-[100px] top-[53%] lg:top-1/2 -translate-y-1/2 text-gold hover:text-gold-dark"
          >
            <Chevron dir="right" />
          </button>
          <div className="absolute bottom-[37px] left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-[8px]">
            {slides.map((_, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Slide ${k + 1}`}
                onClick={() => setI(k)}
                className={`rounded-[50%] transition-all ${
                  k === i ? "w-[26px] h-[26px] border-2 border-gold" : "w-[16px] h-[16px] bg-gold"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
