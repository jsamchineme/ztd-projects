"use client";

import { useState } from "react";
import { ImageField } from "./ImageField";
import { Select } from "./Select";
import { btnSecondary, inputCls } from "./ui";
import { cn } from "@/lib/utils";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

export interface SectionValue {
  id: string;
  type: string;
  order: number;
  content: Obj;
}

/** Human names for the section types SectionRenderer knows. */
const TYPE_LABELS: Record<string, string> = {
  heroSlideshow: "Hero slideshow",
  bestSellers: "Best sellers carousel",
  dkShowBand: "DK Show video band",
  instagram: "Instagram feed",
  reviews: "Customer reviews",
  aboutPage: "About page",
  storesPage: "Store locations page",
  termsPage: "Terms page",
  eventsGiftsPage: "Events & gifts page",
  giftCardPage: "Gift card page",
  careersPage: "Careers page",
  pageHero: "Page heading",
  textContent: "Text (HTML)",
  ctaBand: "Call-to-action band",
  productGrid: "Product grid (on sale)",
  featuresGrid: "Features grid",
  splitContent: "Image + text",
  newsletter: "Newsletter signup",
  contactForm: "Contact form",
  promoBanner: "Promo banner",
  hero: "Hero (single image)",
};

/** Starting content for sections added from the "Add section" menu. */
const TEMPLATES: Record<string, Obj> = {
  pageHero: { eyebrow: "", headline: "", subtitle: "" },
  textContent: { html: "<p></p>" },
  ctaBand: { headline: "", description: "", buttonLabel: "", buttonLink: "" },
  splitContent: { imageUrl: "", eyebrow: "", headline: "", body: "", ctaLabel: "", ctaLink: "" },
  productGrid: { title: "On Sale Now", filter: "onSale", count: 8 },
  bestSellers: { title: "BEST SELLERS", slugs: [] },
  newsletter: { title: "", subtitle: "" },
  promoBanner: { text: "", link: "" },
  reviews: {},
  contactForm: {},
  dkShowBand: { youtubeId: "", title: "", poster: "" },
  hero: { eyebrow: "", headline: "", subheadline: "", backgroundImage: "", buttons: [{ label: "", href: "" }] },
};

const IMAGE_KEY = /(image|poster|photo|logo|thumbnail|avatar|background|^src$|^img$)/i;
const IMAGE_VALUE = /^(\/|https?:\/\/).+\.(jpe?g|png|webp|gif|svg|avif)(\?.*)?$/i;
const LONG_KEY = /(body|html|text|description|paragraph|bio|intro|content|quote|note|subtitle)/i;

function humanize(key: string) {
  const s = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** An empty value with the same shape, for "Add item". */
function blank(v: Json): Json {
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).map((k) => [k, blank(v[k])]));
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  return "";
}

function newItem(items: Json[]): Json {
  if (!items.length) return "";
  const objects = items.filter((i): i is Obj => !!i && typeof i === "object" && !Array.isArray(i));
  if (objects.length === items.length) {
    const shape: Obj = {};
    for (const o of objects) for (const [k, v] of Object.entries(o)) if (!(k in shape)) shape[k] = blank(v);
    return shape;
  }
  return blank(items[items.length - 1]);
}

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

// ─── Value editors ───────────────────────────────────────────────────────────

function ValueEditor({ k, value, onChange }: { k: string; value: Json; onChange: (v: Json) => void }) {
  if (Array.isArray(value)) return <ArrayEditor k={k} items={value} onChange={onChange} />;
  if (value && typeof value === "object") return <ObjectEditor value={value} onChange={onChange} />;
  if (typeof value === "boolean")
    return (
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-green" />
    );
  if (typeof value === "number")
    return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={cn(inputCls, "max-w-40")} />;

  const s = value ?? "";
  if (IMAGE_KEY.test(k) || IMAGE_VALUE.test(s)) return <ImageField compact value={s} onChange={onChange} />;
  if (s.length > 80 || s.includes("\n") || LONG_KEY.test(k))
    return (
      <textarea
        value={s}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(14, Math.max(2, Math.ceil(s.length / 90) + s.split("\n").length - 1))}
        className={cn(inputCls, "resize-y", /html/i.test(k) && "font-mono text-xs")}
      />
    );
  return <input value={s} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}

function ObjectEditor({ value, onChange }: { value: Obj; onChange: (v: Obj) => void }) {
  const keys = Object.keys(value);
  if (!keys.length) return <p className="text-sm text-neutral-500">No settings — this section fills itself in.</p>;
  return (
    <div className="space-y-4">
      {keys.map((k) => (
        <div key={k}>
          <div className="mb-1 text-sm font-medium text-neutral-700">{humanize(k)}</div>
          <ValueEditor k={k} value={value[k]} onChange={(v) => onChange({ ...value, [k]: v })} />
        </div>
      ))}
    </div>
  );
}

function ArrayEditor({ k, items, onChange }: { k: string; items: Json[]; onChange: (v: Json[]) => void }) {
  const simple = items.every((i) => i === null || typeof i !== "object");
  return (
    <div className="space-y-2 rounded-md border border-neutral-200 bg-neutral-50/60 p-3">
      {items.map((item, i) => (
        <div key={i} className={cn("flex gap-2", !simple && "flex-col rounded-md border border-neutral-200 bg-white p-3")}>
          {!simple && (
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-500">
              <span>
                {humanize(k).replace(/s$/, "")} {i + 1}
              </span>
              <ItemControls i={i} n={items.length} onMove={(d) => onChange(move(items, i, d))} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <ValueEditor k={k} value={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
          </div>
          {simple && (
            <ItemControls i={i} n={items.length} onMove={(d) => onChange(move(items, i, d))} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          )}
        </div>
      ))}
      <button type="button" className="text-sm font-medium text-green hover:underline" onClick={() => onChange([...items, newItem(items)])}>
        + Add {humanize(k).toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  );
}

function ItemControls({ i, n, onMove, onRemove }: { i: number; n: number; onMove: (d: number) => void; onRemove: () => void }) {
  const c = "rounded px-1.5 py-0.5 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-start gap-1 text-sm">
      <button type="button" className={c} disabled={i === 0} onClick={() => onMove(-1)} title="Move up">
        ↑
      </button>
      <button type="button" className={c} disabled={i === n - 1} onClick={() => onMove(1)} title="Move down">
        ↓
      </button>
      <button type="button" className={cn(c, "hover:text-red-600")} onClick={onRemove} title="Remove">
        ✕
      </button>
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function SectionCard({
  section,
  index,
  count,
  onChange,
  onMove,
  onRemove,
}: {
  section: SectionValue;
  index: number;
  count: number;
  onChange: (s: SectionValue) => void;
  onMove: (d: number) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(count === 1);
  const [raw, setRaw] = useState<string | null>(null);
  const [rawError, setRawError] = useState("");

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" className="flex flex-1 items-center gap-2 text-left" onClick={() => setOpen(!open)}>
          <span className="text-neutral-400">{open ? "▾" : "▸"}</span>
          <span className="font-medium text-neutral-900">{TYPE_LABELS[section.type] ?? humanize(section.type)}</span>
          <span className="text-xs text-neutral-400">{section.type}</span>
        </button>
        <ItemControls
          i={index}
          n={count}
          onMove={onMove}
          onRemove={() => confirm("Remove this section from the page?") && onRemove()}
        />
      </div>
      {open && (
        <div className="border-t border-neutral-100 px-4 py-4">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              className="text-xs text-neutral-500 hover:text-neutral-900"
              onClick={() => {
                setRawError("");
                setRaw(raw === null ? JSON.stringify(section.content, null, 2) : null);
              }}
            >
              {raw === null ? "Edit as JSON" : "Back to form"}
            </button>
          </div>
          {raw === null ? (
            <ObjectEditor value={section.content} onChange={(content) => onChange({ ...section, content })} />
          ) : (
            <>
              <textarea
                value={raw}
                onChange={(e) => {
                  setRaw(e.target.value);
                  try {
                    const parsed = JSON.parse(e.target.value);
                    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Must be an object { … }");
                    onChange({ ...section, content: parsed });
                    setRawError("");
                  } catch (err) {
                    setRawError((err as Error).message);
                  }
                }}
                rows={18}
                className={cn(inputCls, "font-mono text-xs")}
              />
              {rawError && <p className="mt-1 text-xs text-red-600">Invalid JSON: {rawError} (not applied)</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/** Edits a page's section list; posts it as JSON in `name`. */
export function SectionsEditor({ name, defaultValue }: { name: string; defaultValue: SectionValue[] }) {
  const [sections, setSections] = useState<SectionValue[]>(() => [...defaultValue].sort((a, b) => a.order - b.order));
  const [adding, setAdding] = useState("");
  const serialized = JSON.stringify(sections.map((s, i) => ({ ...s, order: i })));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serialized} />
      {sections.map((s, i) => (
        <SectionCard
          key={s.id}
          section={s}
          index={i}
          count={sections.length}
          onChange={(next) => setSections(sections.map((x, j) => (j === i ? next : x)))}
          onMove={(d) => setSections(move(sections, i, d))}
          onRemove={() => setSections(sections.filter((_, j) => j !== i))}
        />
      ))}
      {!sections.length && <p className="text-sm text-neutral-500">This page has no sections yet.</p>}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Select
          value={adding}
          onChange={setAdding}
          placeholder="Add a section…"
          aria-label="Add a section"
          className="max-w-64"
          options={Object.keys(TEMPLATES).map((t) => ({ value: t, label: TYPE_LABELS[t] ?? t }))}
        />
        <button
          type="button"
          className={btnSecondary}
          disabled={!adding}
          onClick={() => {
            setSections([
              ...sections,
              { id: `sec_${adding}_${Date.now().toString(36)}`, type: adding, order: sections.length, content: structuredClone(TEMPLATES[adding]) },
            ]);
            setAdding("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

/** Generic JSON value editor, for settings. Posts JSON in `name`. */
export function JsonValueField({ name, k, defaultValue }: { name: string; k: string; defaultValue: Json }) {
  const [value, setValue] = useState<Json>(defaultValue);
  return (
    <>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      <ValueEditor k={k} value={value} onChange={setValue} />
    </>
  );
}
