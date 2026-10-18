"use client";

import { useState } from "react";

// Footer signup as on the live site: "Email *" label, underlined field, and an
// attached gold Subscribe button.
export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="mt-3 font-sans text-[14px]">Thanks for subscribing!</p>;
  }

  return (
    <form onSubmit={submit} className="mt-2">
      <label htmlFor="footer-email" className="block font-sans text-[13px] mb-1">
        Email *
      </label>
      <div className="flex items-end">
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 h-[39px] bg-transparent border-b border-ink outline-none font-sans text-[15px]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="h-[39px] w-[104px] bg-gold text-[#fcfcfc] font-sans font-light text-[14px] hover:bg-gold-dark disabled:opacity-70"
        >
          {state === "sending" ? "…" : "Subscribe"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-[13px] text-red-700">Something went wrong — try again.</p>}
    </form>
  );
}
