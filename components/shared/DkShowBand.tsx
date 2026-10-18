"use client";

import Link from "next/link";
import { useState } from "react";

interface DkShowBandProps {
  youtubeId: string;
  title: string;
  poster: string;
}

// Striped teal band with the featured DK Show episode (poster until played),
// then a "More Videos" button — as on the live home page.
export function DkShowBand({ youtubeId, title, poster }: DkShowBandProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <section>
      <div
        className="bg-teal-bar"
        style={{ backgroundImage: "url(/brand/pattern-b.png)", backgroundSize: "176px" }}
      >
        <div className="relative mx-auto w-full lg:w-[64.8%] aspect-[980/551] bg-black">
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 w-full h-full text-white"
              aria-label={`Play ${title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <span className="relative flex flex-col items-center justify-center h-full px-6 text-center">
                <span className="font-sans font-semibold text-[clamp(22px,2.6vw,40px)] leading-[1.25] max-w-[720px] drop-shadow">
                  {title}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 font-sans text-[16px] underline underline-offset-4">
                  <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10 8l6 4-6 4z" fill="currentColor" />
                  </svg>
                  Play Video
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-center pt-[41px]">
        <Link
          href="/dk-show"
          className="inline-flex items-center justify-center w-[142px] h-[40px] bg-gold text-[#fcfcfc] font-sans font-light text-[14px] hover:bg-gold-dark transition-colors"
        >
          More Videos
        </Link>
      </div>
    </section>
  );
}
