"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { youtubeId } from "@/lib/youtube";
import { SOCIAL_LINKS } from "@/components/shared/SocialBar";

const CHANNEL = SOCIAL_LINKS.find((s) => s.label === "YouTube")?.href ?? "https://youtube.com";

export interface ShowVideo {
  slug: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string | null;
  duration?: string | null;
}

// Phones: the live site's vertical channel list — a black "DK Show" bar, then
// every episode as a full-width card (underlined title + "Play Video") split
// by thin white rules. Tapping a card plays it in place.
function MobileList({ videos }: { videos: ShowVideo[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <div className="lg:hidden bg-black">
      <div className="relative flex items-center h-[72px] pl-[24px]">
        <p className="font-sans font-light text-[18px] text-white">DK Show</p>
        <a
          href={CHANNEL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DK Show on YouTube"
          className="absolute right-[10px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-[4px] p-2"
        >
          <span className="w-[5px] h-[5px] rounded-[50%] bg-white" />
          <span className="w-[5px] h-[5px] rounded-[50%] bg-white" />
          <span className="w-[5px] h-[5px] rounded-[50%] bg-white" />
        </a>
      </div>
      {videos.map((v, i) => {
        const id = youtubeId(v.youtubeUrl);
        return (
          <div key={v.slug} className={i > 0 ? "border-t-2 border-white pt-[25px]" : ""}>
            <div className="relative w-full aspect-video bg-black">
              {id && playing === id ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => id && setPlaying(id)}
                  aria-label={`Play ${v.title}`}
                  className="absolute inset-0 w-full h-full text-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.thumbnailUrl || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "")}
                    alt=""
                    loading={i > 1 ? "lazy" : undefined}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/30" />
                  <span className="relative flex flex-col items-center justify-center h-full px-[40px] text-center">
                    <span className="font-sans text-[21px] leading-[25px] underline decoration-[1.5px] underline-offset-[3px] drop-shadow">
                      {v.title}
                    </span>
                    <span className="mt-[22px] inline-flex items-center gap-[8px] font-sans text-[17px]">
                      <svg viewBox="0 0 24 24" className="w-[30px] h-[30px]" aria-hidden="true">
                        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M10 8l6 4-6 4z" fill="currentColor" />
                      </svg>
                      Play Video
                    </span>
                  </span>
                </button>
              )}
            </div>
            <div className="h-[24px]" />
          </div>
        );
      })}
    </div>
  );
}

// Desktop: the live DK Show channel: a cover with "Play Video", a video search, and a
// horizontally scrolling row of episodes that play in the main player.
export function DkShowPage({ cover, videos }: { cover: string; videos: ShowVideo[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const list = useMemo(
    () => videos.filter((v) => v.title.toLowerCase().includes(q.trim().toLowerCase())),
    [q, videos],
  );
  // Previous/Next only show when there is somewhere to go in that direction.
  const updateEdges = () => {
    const el = row.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };
  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [list]);
  const page = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * row.current.clientWidth, behavior: "smooth" });

  const play = (v?: ShowVideo) => {
    const id = v ? youtubeId(v.youtubeUrl) : null;
    if (id) {
      setCurrent(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
    <MobileList videos={videos} />
    <div className="hidden lg:block mx-auto w-full max-w-[940px] pt-[12px] pb-[90px]">
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

      {/* Live site: plain icon + placeholder; focusing turns it into a grey bar with ✕. */}
      <label
        className={`mt-6 flex items-center h-[40px] px-[6px] -mx-[6px] lg:mx-0 transition-colors duration-[250ms] ease-out ${
          focused ? "bg-[#e2e2e2]" : "bg-transparent"
        }`}
      >
        {/* On focus the icon and text ease 12px to the right as the bar fades in. */}
        <span
          className={`flex flex-1 min-w-0 items-center gap-3 pr-3 transition-transform duration-[250ms] ease-out ${
            focused ? "translate-x-[12px]" : "translate-x-0"
          }`}
        >
          <Search className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search video..."
            aria-label="Search video"
            className="w-full bg-transparent outline-none font-sans font-light text-[14px] placeholder:text-ink/70"
          />
        </span>
        {(focused || q) && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQ("");
              input.current?.blur();
            }}
            className="shrink-0 mr-[6px]"
          >
            <X className="w-[16px] h-[16px]" strokeWidth={1.4} />
          </button>
        )}
      </label>

      <div
        ref={row}
        onScroll={updateEdges}
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
              {/* Hover (or now playing): dark overlay, title top-left, play
                  button centred, running time bottom-left — as on the live site. */}
              <span
                className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ${
                  id === current ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                <span className="absolute left-[18px] top-[18px] right-[18px] text-white font-sans font-light text-[15px] leading-snug line-clamp-2">
                  {v.title}
                </span>
                {id === current ? (
                  <span className="absolute inset-0 flex items-center justify-center text-white font-sans font-light text-[15px]">
                    Now Playing
                  </span>
                ) : (
                  <svg viewBox="0 0 44 44" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] text-white" aria-hidden="true">
                    <circle cx="22" cy="22" r="20.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M18 14.5l12 7.5-12 7.5z" fill="currentColor" />
                  </svg>
                )}
                {v.duration && (
                  <span className="absolute left-[18px] bottom-[12px] text-white font-sans font-light text-[15px]">
                    {v.duration}
                  </span>
                )}
              </span>
            </button>
          );
        })}
        {list.length === 0 && <p className="font-sans text-[14px] text-muted">No videos match.</p>}
      </div>

      {!(edges.start && edges.end) && (
        <div className="mt-6 flex items-center justify-between">
          {!edges.start ? (
            <button type="button" onClick={() => page(-1)} className="inline-flex items-center gap-3 font-sans text-[14px]">
              <svg viewBox="0 0 34 12" className="w-[34px] h-[12px]" aria-hidden="true">
                <path d="M34 6H2M7 1L2 6l5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Prev
            </button>
          ) : (
            <span />
          )}
          {!edges.end && (
            <button type="button" onClick={() => page(1)} className="inline-flex items-center gap-3 font-sans text-[14px]">
              Next
              <svg viewBox="0 0 34 12" className="w-[34px] h-[12px]" aria-hidden="true">
                <path d="M0 6h32M27 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
    </>
  );
}
