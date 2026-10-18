"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold border-2 border-white text-white flex items-center justify-center shadow-card transition-opacity hover:bg-gold-dark ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-8 h-8" strokeWidth={1.5} />
    </button>
  );
}
