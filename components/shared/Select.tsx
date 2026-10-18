"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  /** Controlled value; leave out and use defaultValue for forms. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Field name: a hidden input carries the value into form submissions. */
  name?: string;
  /** Shown (and not selectable) while nothing is chosen. */
  placeholder?: string;
  "aria-label"?: string;
  /** Classes for the closed box (size, border, font). */
  className?: string;
}

// The live shop's "Sort by" dropdown, used for every select on the site: a
// box with a thin chevron that flips when open, and a white list attached
// underneath with a soft shadow; the hovered/current option is grey.
export function Select({ options, value, defaultValue, onChange, name, placeholder, className = "", ...rest }: SelectProps) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const selected = options.find((o) => o.value === current);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // Keep the highlighted option in view in long lists.
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen(true);
  };
  const pick = (i: number) => {
    const v = options[i]?.value;
    if (v === undefined) return;
    if (value === undefined) setInner(v);
    if (v !== current) onChange?.(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative">
      {name && <input type="hidden" name={name} value={current} />}
      <button
        type="button"
        role="combobox"
        aria-label={rest["aria-label"]}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 text-left ${className}`}
      >
        <span className={`truncate ${selected ? "" : "text-ink/60"}`}>{selected?.label ?? placeholder ?? ""}</span>
        <svg
          viewBox="0 0 16 9"
          className={`w-[15px] h-[8px] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          aria-hidden="true"
        >
          <path d="M1 1l7 7 7-7" />
        </svg>
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 max-h-[300px] overflow-y-auto border border-[#a8a8a8] border-t-0 bg-[#fcfcfc] py-[12px] shadow-[0_2px_5px_rgba(0,0,0,0.25)] font-sans font-light text-[16px] text-ink"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.value === current}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
              className={`flex min-h-[38px] items-center px-[24px] py-[6px] cursor-pointer leading-snug ${i === active ? "bg-[#d4d4d4]" : ""}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
