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
      {/* Phones: black letterbox with a ⋮ menu. Desktop: striped teal band. */}
      <div className="relative bg-black py-[42px] lg:py-0 lg:bg-teal-stripes">
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open on YouTube"
          className="lg:hidden absolute right-[10px] top-[8px] flex flex-col items-center gap-[4px] p-2"
        >
          <span className="w-[5px] h-[5px] rounded-[50%] bg-white" />
          <span className="w-[5px] h-[5px] rounded-[50%] bg-white" />
          <span className="w-[5px] h-[5px] rounded-[50%] bg-white" />
        </a>
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
                <span className="font-sans font-semibold text-[22px] lg:text-[clamp(22px,2.6vw,40px)] leading-[1.25] max-w-[720px] drop-shadow underline lg:no-underline decoration-[1.5px] underline-offset-[3px]">
                  {title}
                </span>
                <span className="mt-[26px] lg:mt-4 inline-flex items-center gap-[10px] lg:gap-2 font-sans text-[17.5px] lg:text-[16px] lg:underline underline-offset-4">
                  <svg viewBox="0 0 24 24" className="w-[30px] h-[30px] lg:w-[26px] lg:h-[26px]" aria-hidden="true">
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
      <div className="flex justify-center bg-[#fafafa] pt-[13px] lg:pt-[41px]">
        <Link
          href="/dk-show"
          className="inline-flex items-center justify-center w-[195px] h-[51px] lg:w-[142px] lg:h-[40px] bg-gold text-[#fcfcfc] font-sans font-light text-[17px] lg:text-[14px] hover:bg-gold-dark transition-colors"
        >
          More Videos
        </Link>
      </div>
    </section>
  );
}
