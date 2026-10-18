"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SEEN_KEY = "dk_join_seen";

// The live site's "Join Our List" panel: slides in from the right a few
// seconds after the first visit, once per browser.
export function JoinPopup({ delayMs = 5000 }: { delayMs?: number }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return;
    const t = setTimeout(() => setOpen(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  const close = () => {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  };

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
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      setState("error");
    }
  }

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-label="Join Our List"
        className={`absolute right-0 top-0 h-full w-full sm:w-[min(557px,100%)] lg:w-[36.8%] bg-teal-bar text-white px-8 pt-[60px] transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button type="button" onClick={close} aria-label="Close" className="absolute right-5 top-5 text-white/90 hover:text-white">
          <X className="w-7 h-7" strokeWidth={1.4} />
        </button>
        <div className="mx-auto max-w-[400px] text-center">
          <h2 className="text-white font-sans font-bold text-[clamp(40px,4.4vw,66px)] leading-[1.05]">Join Our List</h2>
          <p className="mt-5 font-sans text-[18px] leading-[1.35]">
            Be the first to receive information about our sales, events and exclusive offers!
          </p>
          {state === "done" ? (
            <p className="mt-10 font-sans text-[18px]">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={submit} className="mt-10 text-left">
              <label htmlFor="join-email" className="block font-sans font-semibold text-[16px] mb-2">
                Email *
              </label>
              <div className="flex">
                <input
                  id="join-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 h-[48px] px-3 bg-white text-ink border border-green outline-none"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="h-[48px] px-6 bg-black text-white font-sans text-[15px] disabled:opacity-70"
                >
                  {state === "sending" ? "…" : "Submit"}
                </button>
              </div>
              {state === "error" && <p className="mt-2 text-[14px]">Something went wrong — please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
