"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full py-[13px] px-[16px] border border-line rounded-input font-sans text-[.95rem] bg-white transition-colors focus:outline-none focus:border-gold";

  if (status === "done") {
    return (
      <div className="bg-cream border border-line rounded p-6 text-center">
        <p className="text-ink font-medium">Thanks for reaching out — we&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[.85rem] font-semibold mb-[6px]">Name</label>
        <input name="name" required className={field} />
      </div>
      <div>
        <label className="block text-[.85rem] font-semibold mb-[6px]">Email</label>
        <input type="email" name="email" required className={field} />
      </div>
      <div>
        <label className="block text-[.85rem] font-semibold mb-[6px]">Phone</label>
        <input type="tel" name="phone" className={field} />
      </div>
      <div>
        <label className="block text-[.85rem] font-semibold mb-[6px]">Message</label>
        <textarea name="message" rows={5} required className={`${field} resize-y`} />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="py-[13px] px-[30px] rounded-full bg-burgundy text-white font-sans font-medium text-[.95rem] hover:bg-burgundy-dark transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
      {status === "error" && (
        <p className="text-burgundy text-sm">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
