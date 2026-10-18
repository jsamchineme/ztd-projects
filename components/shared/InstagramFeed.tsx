"use client";

import { useState } from "react";

interface InstagramFeedProps {
  handle: string;
  posts: number;
  followers: number;
  following: number;
  bio: string[];
  link: string;
  images: string[];
}

// Static rendering of the live site's Instagram widget: profile header, a
// 3-column grid of recent posts, and "Load More".
export function InstagramFeed({ handle, posts, followers, following, bio, link, images }: InstagramFeedProps) {
  const [shown, setShown] = useState(6);
  const url = `https://instagram.com/${handle}`;
  return (
    <section className="bg-[#fafafa] pt-[93px] pb-[60px]">
      <div className="mx-auto w-[92%] lg:w-[64.8%] max-w-[980px]">
        {/* Phones: photo, name and counts stacked. Desktop: one row. */}
        <div className="flex flex-col lg:flex-row items-start gap-[22px] lg:gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/hero-popup.jpg" alt="" className="w-[44px] h-[44px] lg:w-[56px] lg:h-[56px] rounded-[50%] object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <a href={url} target="_blank" rel="noopener noreferrer" className="font-sans font-light lg:font-normal text-[25px] lg:text-[20px]">
                {handle}
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 border border-ink px-4 h-[32px] font-sans text-[14px] hover:bg-ink hover:text-white transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/social/instagram.png" alt="" className="w-[14px] h-[14px]" />
                Follow
              </a>
            </div>
            <p className="mt-[12px] lg:mt-1 flex flex-col lg:flex-row lg:gap-5 font-sans font-light lg:font-normal text-[16.5px] lg:text-[13px] leading-[28px] lg:leading-normal text-muted">
              <span>{posts} Posts</span>
              <span>{followers} Followers</span>
              <span>{following} Following</span>
            </p>
            <div className="mt-5 lg:mt-3 font-sans text-[16px] lg:text-[13px] leading-[1.6]">
              {bio.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <a href={link} className="text-gold hover:underline">
                {link}
              </a>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden mt-5 inline-flex items-center gap-2 border border-ink px-5 h-[40px] font-sans text-[16px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/social/instagram.png" alt="" className="w-[16px] h-[16px]" />
              Follow
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
          {images.slice(0, shown).map((src) => (
            <a key={src} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </a>
          ))}
        </div>

        {shown < images.length && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setShown((v) => v + 6)}
              className="border border-ink px-4 h-[32px] font-sans text-[14px] hover:bg-ink hover:text-white transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
