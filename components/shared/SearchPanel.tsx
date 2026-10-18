"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";

interface Hit {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

function useSearch(q: string) {
  const [state, setState] = useState<{ trending: boolean; products: Hit[] } | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then(setState)
        .catch(() => {});
    }, q ? 180 : 0);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);
  return state;
}

function Results({ q, onPick }: { q: string; onPick: () => void }) {
  const res = useSearch(q);
  if (!res) return null;
  return (
    <div>
      <h2 className="font-sans text-[20px] lg:text-[17px]">
        {res.trending ? "Trending Products" : res.products.length ? "Products" : `No results for “${q.trim()}”`}
      </h2>
      <ul className="mt-5 space-y-4">
        {res.products.map((p) => (
          <li key={p.id}>
            <Link href={`/shop/${p.slug}`} onClick={onPick} className="flex items-center gap-6 lg:gap-4 group">
              <span className="w-[80px] h-[60px] lg:w-[54px] lg:h-[48px] shrink-0 flex items-center justify-center bg-white">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-sans font-light text-[20px] lg:text-[16px] group-hover:text-green">{p.name}</span>
                {p.description && (
                  <span className="block truncate font-sans font-light text-[16px] lg:text-[13px] text-muted">
                    {p.description.split("\n")[0]}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useSubmit(onClose: () => void) {
  const router = useRouter();
  return (q: string) => {
    router.push(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
    onClose();
  };
}

/** Full-screen search on phones, as on the live site. */
export function MobileSearch({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [q, setQ] = useState("");
  const submit = useSubmit(onDone);
  return (
    <div role="dialog" aria-label="Search" className="fixed inset-0 z-[90] bg-white overflow-y-auto px-[24px] pt-[24px] pb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="flex items-center gap-6"
      >
        <button type="button" onClick={onBack} aria-label="Back" className="p-1 -ml-1">
          <ChevronLeft className="w-[24px] h-[24px]" strokeWidth={1.4} />
        </button>
        <label className="flex-1 flex items-center gap-3 h-[52px] px-6 border border-ink/70">
          <Search className="w-[18px] h-[18px] shrink-0 text-ink/70" strokeWidth={1.4} />
          <input
            autoFocus
            type="search"
            enterKeyHint="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            aria-label="Search"
            className="w-full bg-transparent outline-none font-sans font-light text-[20px] placeholder:text-ink/70"
          />
        </label>
      </form>
      <div className="mt-[50px]">
        <Results q={q} onPick={onDone} />
      </div>
    </div>
  );
}

/** Desktop header search: the underlined field with results dropping down. */
export function DesktopSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const submit = useSubmit(() => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative hidden lg:block">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(q);
        }}
        className="flex items-center gap-2 w-[150px] h-[45px] border-b border-ink"
      >
        <Search className="w-[18px] h-[18px] shrink-0" strokeWidth={1.4} />
        <input
          type="search"
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          placeholder="Search..."
          aria-label="Search"
          className="w-full bg-transparent outline-none font-sans font-light text-[17px] placeholder:text-ink [&::-webkit-search-cancel-button]:hidden"
        />
      </form>
      {open && (
        <div className="absolute right-0 top-[52px] z-50 w-[380px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.14)] p-6">
          <Results q={q} onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
