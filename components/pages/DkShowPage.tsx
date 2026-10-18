"use client";

import { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { youtubeId } from "@/lib/youtube";

export interface ShowVideo {
  slug: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string | null;
}

// The live DK Show channel: a cover with "Play Video", a video search, and a
// horizontally scrolling row of episodes that play in the main player.
export function DkShowPage({ cover, videos }: { cover: string; videos: ShowVideo[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const row = useRef<HTMLDivElement>(null);
  const list = useMemo(
    () => videos.filter((v) => v.title.toLowerCase().includes(q.trim().toLowerCase())),
    [q, videos],
  );
  const play = (v?: ShowVideo) => {
    const id = v ? youtubeId(v.youtubeUrl) : null;
    if (id) {
      setCurrent(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[940px] px-4 lg:px-0 pt-[12px] pb-[90px]">
      <p className="font-sans font-light text-[18px] py-[10px]">DK Show</p>

      <div className="relative w-full aspect-[940/529] bg-black">
        {current ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${current}?autoplay=1&rel=0`}
            title="DK Show"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 className="text-white font-sans text-[36px] lg:text-[50px] drop-shadow">DK Show</h1>
              <button
                type="button"
                onClick={() => play(videos[0])}
                className="mt-5 inline-flex items-center gap-2 h-[40px] px-5 bg-gold text-[#fcfcfc] font-sans text-[14px] hover:bg-gold-dark"
              >
                <svg viewBox="0 0 12 12" className="w-[11px] h-[11px]" aria-hidden="true">
                  <path d="M2 1l9 5-9 5z" fill="currentColor" />
                </svg>
                Play Video
              </button>
            </div>
          </>
        )}
      </div>

      <label className="mt-6 flex items-center gap-2 h-[40px] border-b border-line">
        <Search className="w-4 h-4 text-muted" strokeWidth={1.6} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search videos"
          className="w-full bg-transparent outline-none font-sans text-[14px]"
        />
      </label>

      <div
        ref={row}
        className="mt-6 flex gap-[14px] overflow-x-auto snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((v) => {
          const id = youtubeId(v.youtubeUrl);
          return (
            <button
              key={v.slug}
              type="button"
              onClick={() => play(v)}
              className="group relative snap-start shrink-0 w-[calc((100%-28px)/3)] min-w-[220px] aspect-[299/173] bg-black text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumbnailUrl || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "")}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute left-3 top-3 right-3 text-white font-sans text-[14px] leading-tight drop-shadow opacity-0 group-hover:opacity-100 transition-opacity">
                {v.title}
              </span>
              <span className="absolute inset-x-0 bottom-4 text-center text-white font-sans text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                Play Video
              </span>
            </button>
          );
        })}
        {list.length === 0 && <p className="font-sans text-[14px] text-muted">No videos match.</p>}
      </div>

      {list.length > 3 && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => row.current?.scrollBy({ left: row.current.clientWidth, behavior: "smooth" })}
            className="inline-flex items-center gap-3 font-sans text-[14px]"
          >
            Next
            <svg viewBox="0 0 34 12" className="w-[34px] h-[12px]" aria-hidden="true">
              <path d="M0 6h32M27 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
