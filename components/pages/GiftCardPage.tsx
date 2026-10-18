"use client";

import { useState } from "react";
import { Select } from "@/components/shared/Select";

export interface GiftCardContent {
  image: string;
  title: string;
  description: string;
  amounts: number[];
}

const input = "w-full h-[48px] px-3 border border-ink/60 bg-white outline-none font-sans text-[16px] focus:border-ink";
const lbl = "block mb-2 font-sans font-light text-[17px]";

// Mirrors the live eGift Card page. Payments aren't enabled yet, so "Buy Now"
// sends the request to the shop, which follows up to take payment.
export function GiftCardPage({ c }: { c: GiftCardContent }) {
  const [amount, setAmount] = useState(c.amounts[0]);
  const [qty, setQty] = useState(1);
  const [forSelf, setForSelf] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const message = [
      `EGIFT CARD REQUEST: $${amount} × ${qty}`,
      `For: ${forSelf ? "myself" : "someone else"}`,
      !forSelf ? `Recipient: ${f.recipientName || "—"} <${f.recipientEmail}>` : "",
      `Delivery: ${f.deliveryDate || "today"} ${f.deliveryTime || "Now"}`,
      `Message: ${f.message || "—"}`,
    ].filter(Boolean).join("\n");
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: f.buyerName, email: f.buyerEmail, message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mx-auto max-w-[940px] px-6 lg:px-0 pt-[26px] pb-[110px] grid gap-10 lg:grid-cols-[452px_1fr] lg:gap-[33px]">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.image} alt="Debbs Kitchen Spices gift card" className="w-full aspect-[452/301] object-cover" />
      </div>

      <div>
        <h1 className="font-sans font-bold text-[34px] lg:text-[40px] leading-[1.2]">{c.title}</h1>
        <p className="mt-4 font-sans font-light text-[21px]">${amount}</p>
        <p className="mt-5 font-sans font-light text-[20px] leading-[1.4] max-w-[420px]">{c.description}</p>

        {state === "done" ? (
          <p className="mt-10 font-sans text-[18px]">
            Thank you! We&apos;ve received your gift card request and will email you to complete payment.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-6">
            <div>
              <span className={lbl}>Amount</span>
              <div className="flex flex-wrap gap-2">
                {c.amounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`h-[38px] px-3 border font-sans text-[17px] ${
                      a === amount ? "border-gold bg-[#fdf1e2]" : "border-ink/50 hover:border-ink"
                    }`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className={lbl}>Quantity</span>
              <div className="inline-flex items-center border border-ink/60 h-[38px]">
                <button type="button" aria-label="Decrease" onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-9">−</button>
                <span className="w-8 text-center font-sans">{qty}</span>
                <button type="button" aria-label="Increase" onClick={() => setQty((v) => Math.min(20, v + 1))} className="w-9">+</button>
              </div>
            </div>

            <div>
              <span className={lbl}>Who is the gift card for?</span>
              <div className="grid grid-cols-2 gap-2">
                {[false, true].map((self) => (
                  <button
                    key={String(self)}
                    type="button"
                    onClick={() => setForSelf(self)}
                    className={`h-[44px] border font-sans text-[17px] ${
                      forSelf === self ? "border-gold bg-[#fdf1e2]" : "border-ink/50 hover:border-ink"
                    }`}
                  >
                    {self ? "For myself" : "For someone else"}
                  </button>
                ))}
              </div>
            </div>

            {!forSelf && (
              <>
                <div><label className={lbl}>Recipient email *</label><input name="recipientEmail" type="email" required className={input} /></div>
                <div><label className={lbl}>Recipient name</label><input name="recipientName" className={input} /></div>
              </>
            )}
            <div><label className={lbl}>Your name *</label><input name="buyerName" required className={input} /></div>
            <div><label className={lbl}>Your email *</label><input name="buyerEmail" type="email" required className={input} /></div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Delivery date</label>
                  <input name="deliveryDate" type="date" className={input} />
                </div>
                <div>
                  <label className={lbl}>Delivery time</label>
                  <Select
                    name="deliveryTime"
                    aria-label="Delivery time"
                    defaultValue="Now"
                    options={["Now", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"].map((t) => ({ value: t, label: t }))}
                    className={input}
                  />
                </div>
              </div>
              <p className="mt-2 font-sans font-light text-[14px]">Gift card never expires</p>
            </div>
            <div><label className={lbl}>Message</label><textarea name="message" rows={4} className={`${input} h-auto py-2 resize-y`} /></div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="w-full h-[48px] bg-black text-white font-sans text-[17px] hover:opacity-85 disabled:opacity-70"
            >
              {state === "sending" ? "Sending…" : "Buy Now"}
            </button>
            {state === "error" && <p className="text-[14px]">Something went wrong — please try again.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
