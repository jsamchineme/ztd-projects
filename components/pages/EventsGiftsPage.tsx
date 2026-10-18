"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { GoldButton } from "./GoldButton";

export interface EventsGiftsContent {
  heroImage: string;
  title: string;
  intro: string[];
  bulkImage: string;
  bulkTitle: string;
  bulkText: string;
  bandImage: string;
  workTitle: string;
  workText: string;
  spices: string[];
}

const field = "w-full h-[42px] px-3 bg-white text-ink outline-none font-sans text-[15px]";
const label = "block mb-2 font-sans font-bold text-[15px]";

function OrderForm({ spices, onClose }: { spices: string[]; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const message = [
      "EVENT / BULK GIFT ORDER",
      `Event: ${f.event || "—"}`,
      `Multiple addresses: ${f.multiple ? "yes" : "no"}`,
      `Spice: ${f.spice || "—"} × ${f.quantity || "—"}${f.moreSpices ? " (needs more than one type)" : ""}`,
      "",
      "Primary shipping address:",
      [f.street, f.street2, f.city, f.region, f.zip, f.country].filter(Boolean).join(", ") || "—",
    ].join("\n");
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.name, email: f.email, phone: f.phone, message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 overflow-y-auto" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Tell Us About Your Order"
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto my-10 w-[92%] max-w-[812px] bg-teal-bar text-[#fcfcfc] px-6 lg:px-[70px] py-[60px]"
        style={{ backgroundImage: "url(/brand/pattern-b.png)", backgroundSize: "176px" }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5">
          <X className="w-7 h-7" strokeWidth={1.4} />
        </button>
        <h2 className="text-center text-[#fcfcfc] font-sans font-bold text-[32px] lg:text-[40px] tracking-[-0.05em]">
          Tell Us About Your Order
        </h2>
        {state === "done" ? (
          <p className="mt-10 text-center font-sans text-[18px]">Thank you! We&apos;ll be in touch about your order shortly.</p>
        ) : (
          <form onSubmit={submit} className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
            <div className="space-y-6">
              <div><label className={label}>Name</label><input name="name" required className={field} /></div>
              <div><label className={label}>Email</label><input name="email" type="email" required className={field} /></div>
              <div><label className={label}>Phone</label><input name="phone" type="tel" className={field} /></div>
              <label className="flex items-center gap-2 font-sans italic text-[15px]"><input type="checkbox" name="multiple" /> I need to send to multiple addresses</label>
              <div><label className={label}>Tell us about your event!</label><textarea name="event" rows={4} className={`${field} h-auto py-2 resize-y`} /></div>
            </div>
            <div className="space-y-6">
              <p className="font-sans text-[15px] text-ink">Please enter a primary shipping address:</p>
              <div><label className={label}>Street Address</label><input name="street" className={field} /></div>
              <div><label className={label}>Street Address Line 2</label><input name="street2" className={field} /></div>
              <div><label className={label}>City</label><input name="city" className={field} /></div>
              <div><label className={label}>Region/State/Province</label><input name="region" className={field} /></div>
              <div><label className={label}>Postal / Zip code</label><input name="zip" className={field} /></div>
              <div><label className={label}>Country</label><input name="country" defaultValue="United States" className={field} /></div>
            </div>
            <div className="md:col-span-2 grid gap-6 md:grid-cols-[1fr_200px]">
              <div>
                <label className={label}>Choose a spice</label>
                <select name="spice" className={field}>
                  {spices.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div><label className={label}>Quantity</label><input name="quantity" type="number" min={1} defaultValue={10} className={field} /></div>
            </div>
            <label className="md:col-span-2 flex items-center gap-2 font-sans italic text-[15px]"><input type="checkbox" name="moreSpices" /> I need more than one type of spice</label>
            <div className="md:col-span-2 flex justify-center">
              <button type="submit" disabled={state === "sending"} className="h-[44px] w-[160px] bg-gold text-[#fcfcfc] font-sans text-[15px] hover:bg-gold-dark disabled:opacity-70">
                {state === "sending" ? "Sending…" : "Submit"}
              </button>
            </div>
            {state === "error" && <p className="md:col-span-2 text-center">Something went wrong — please try again.</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export function EventsGiftsPage({ c }: { c: EventsGiftsContent }) {
  const [ordering, setOrdering] = useState(false);
  return (
    <div>
      {/* Hero: photo band with a white card */}
      <section className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative py-[40px] lg:py-0 lg:h-[346px] flex items-center justify-center px-4">
          <div className="w-full lg:w-[64.8%] max-w-[980px] bg-white px-6 py-[34px] text-center">
            <h1 className="font-sans font-light text-[40px] lg:text-[65px] leading-[1.15]">{c.title}</h1>
            <div className="mt-4 font-sans font-light text-[16px] leading-[1.8] space-y-6 max-w-[620px] mx-auto">
              {c.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events & Bulk Gifts */}
      <section className="mx-auto max-w-[1100px] px-6 py-[80px] lg:py-[130px] grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-[38px] items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.bulkImage} alt="" className="w-full aspect-[400/332] object-cover" />
        <div>
          <h2 className="font-sans font-light text-[20px]">{c.bulkTitle}</h2>
          <p className="mt-8 font-sans font-light text-[16px] leading-[1.8]">{c.bulkText}</p>
          <button
            type="button"
            onClick={() => setOrdering(true)}
            className="mt-8 inline-flex items-center justify-center h-[40px] w-[142px] bg-gold text-[#fcfcfc] font-sans font-light text-[14px] hover:bg-gold-dark"
          >
            Order
          </button>
        </div>
      </section>

      {/* Let's Work Together */}
      <section className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.bandImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative py-[40px] lg:py-0 lg:h-[338px] flex items-center justify-center px-4">
          <div className="w-full lg:w-[96%] bg-white px-8 lg:px-[137px] py-[48px] grid gap-6 lg:grid-cols-[1fr_1.4fr] items-start">
            <h2 className="font-sans font-bold text-[32px] lg:text-[38px] leading-[1.15]">{c.workTitle}</h2>
            <div>
              <p className="font-sans font-light text-[16px] leading-[1.8]">{c.workText}</p>
              <GoldButton href="/contact" className="mt-6">
                Contact Us
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      {ordering && <OrderForm spices={c.spices} onClose={() => setOrdering(false)} />}
    </div>
  );
}
