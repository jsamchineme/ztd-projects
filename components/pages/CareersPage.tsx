"use client";

import { useState } from "react";
import { SOCIAL_LINKS } from "@/components/shared/SocialBar";
import { Select } from "@/components/shared/Select";

export interface CareersContent {
  title: string;
  lead: string;
  body: string;
  formTitle: string;
  locations: string[];
}

const input = "w-full h-[44px] px-3 border border-ink/70 bg-white outline-none font-sans text-[14px] focus:border-ink placeholder:text-ink/40";
const lbl = "block mb-2 font-sans font-bold text-[14px]";

export function CareersPage({ c }: { c: CareersContent }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${f.firstName} ${f.lastName}`.trim(),
          email: f.email,
          phone: f.phone,
          message: `JOB APPLICATION — Sales Associate\nClosest location: ${f.location || "—"}\nStart date: ${f.startDate || "—"}`,
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto max-w-[940px] px-6 lg:px-0 pt-[60px] lg:pt-[100px] pb-[110px]">
      <h1 className="font-sans font-light text-[42px] lg:text-[56px]">{c.title}</h1>
      <p className="mt-8 font-sans font-light text-[16px]">{c.lead}</p>
      <p className="mt-8 font-sans font-light text-[16px] leading-[1.8] max-w-[660px]">{c.body}</p>

      <div className="mt-[60px] grid gap-12 lg:grid-cols-[440px_1fr] lg:gap-[190px]">
        <div>
          <h2 className="font-sans font-bold text-[24px] lg:text-[28px]">{c.formTitle}</h2>
          {state === "done" ? (
            <p className="mt-8 font-sans text-[16px]">Thanks for applying — we&apos;ll be in touch soon!</p>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-6">
              <div><label className={lbl}>First Name</label><input name="firstName" required placeholder="e.g., John" className={input} /></div>
              <div><label className={lbl}>Last Name</label><input name="lastName" placeholder="e.g., Johnson" className={input} /></div>
              <div className="grid grid-cols-2 gap-5">
                <div><label className={lbl}>Email *</label><input name="email" type="email" required placeholder="e.g., name@email.com" className={input} /></div>
                <div><label className={lbl}>Phone</label><input name="phone" type="tel" placeholder="e.g., 555-555-555" className={input} /></div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={lbl}>Closest Location</label>
                  <Select
                    name="location"
                    aria-label="Closest Location"
                    placeholder="Select store location"
                    options={c.locations.map((l) => ({ value: l, label: l }))}
                    className={input}
                  />
                </div>
                <div><label className={lbl}>Start Date</label><input name="startDate" type="date" className={input} /></div>
              </div>
              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full h-[42px] bg-black text-white font-sans text-[16px] hover:opacity-85 disabled:opacity-70"
              >
                {state === "sending" ? "Sending…" : "Next"}
              </button>
              {state === "error" && <p className="text-[14px]">Something went wrong — please try again.</p>}
            </form>
          )}
        </div>

        <div className="lg:pt-[23px]">
          <p className="font-sans font-light text-[16px]">Social Media</p>
          <div className="mt-3 flex gap-[10px]">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt="" className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
