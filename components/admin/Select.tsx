"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  /** Controlled value. Omit and use defaultValue for plain forms. */
  value?: string;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  /** Field name: a hidden input carries the value into form submissions. */
  name?: string;
  /** Shown when the current value matches no option. */
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  /** Extra classes for the closed box (e.g. width caps like `max-w-48`). */
  className?: string;
}

const boxCls =
  "flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-left text-sm text-neutral-900 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60";

/** Admin custom select: matches the form input styling with a chevron, a
 *  shadowed dropdown, hover/keyboard highlighting and a check on the current
 *  option. Drop-in for a native <select> styled with `inputCls`. */
export function Select({ options, value, defaultValue, onChange, name, placeholder, disabled, className, ...rest }: SelectProps) {
  const [inner, setInner] = useState(defaultValue != null ? String(defaultValue) : "");
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const selected = options.find((o) => o.value === current);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => {
    if (disabled) return;
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
    <div ref={root} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={current} />}
      <button
        type="button"
        role="combobox"
        aria-label={rest["aria-label"]}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={cn(boxCls, open ? "border-green ring-2 ring-green/20" : "border-neutral-300")}
      >
        <span className={cn("truncate", !selected && "text-neutral-400")}>{selected?.label ?? placeholder ?? ""}</span>
        <ChevronDown size={16} className={cn("shrink-0 text-neutral-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 text-sm shadow-lg"
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
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 px-3 py-2",
                i === active && "bg-neutral-50",
                o.value === current ? "font-medium text-green" : "text-neutral-700",
              )}
            >
              <span className="truncate">{o.label}</span>
              {o.value === current && <Check size={15} className="shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
