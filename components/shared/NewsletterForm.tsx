"use client";

import { useState } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setMessage("Thanks — you're on the list!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p className={dark ? "text-white/90" : "text-ink"}>{message}</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[460px]">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={`flex-1 py-[13px] px-[16px] rounded-input border text-[.95rem] font-sans outline-none transition-colors ${
          dark
            ? "bg-white/10 border-white/25 text-white placeholder-white/50 focus:border-gold"
            : "bg-white border-line text-ink focus:border-gold"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="py-[13px] px-[26px] rounded-full bg-gold text-ink font-sans font-medium text-[.95rem] hover:bg-gold-dark hover:text-white transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "…" : "Subscribe"}
      </button>
      {status === "error" && (
        <span className="text-burgundy text-sm self-center">{message}</span>
      )}
    </form>
  );
}
