"use client";

import { useRef, useState } from "react";
import { uploadFile } from "./upload";
import { btnSecondary, inputCls } from "./ui";

/**
 * Image picker: preview + upload button + editable URL. Controlled when
 * `onChange` is given (used inside the section editor), else posts `name`.
 */
export function ImageField({
  name,
  defaultValue,
  value: controlled,
  onChange,
  compact,
}: {
  name?: string;
  defaultValue?: string | null;
  value?: string;
  onChange?: (url: string) => void;
  compact?: boolean;
}) {
  const [local, setLocal] = useState(defaultValue ?? "");
  const value = controlled ?? local;
  const set = (v: string) => (onChange ? onChange(v) : setLocal(v));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      set(await uploadFile(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className={`${compact ? "h-16 w-16" : "h-24 w-24"} flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-neutral-400">No image</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          name={name}
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder="Image URL"
          className={inputCls}
        />
        <div className="flex items-center gap-2">
          <button type="button" className={btnSecondary} disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Uploading…" : "Upload image"}
          </button>
          {value && (
            <button type="button" className="text-sm text-neutral-500 hover:text-red-600" onClick={() => set("")}>
              Remove
            </button>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </div>
  );
}
