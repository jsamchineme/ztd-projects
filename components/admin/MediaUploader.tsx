"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "./upload";
import { btnPrimary } from "./ui";

export function MediaUploader() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    const failed: string[] = [];
    for (const [i, f] of list.entries()) {
      setStatus(`Uploading ${i + 1} of ${list.length}…`);
      try {
        await uploadFile(f);
      } catch (e) {
        failed.push(`${f.name}: ${(e as Error).message}`);
      }
    }
    setStatus(failed.join(" · "));
    if (input.current) input.current.value = "";
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {status && <span className="text-sm text-neutral-500">{status}</span>}
      <button type="button" className={btnPrimary} onClick={() => input.current?.click()}>
        Upload images
      </button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
    </div>
  );
}

export function CopyUrl({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="text-xs text-green hover:underline"
      onClick={async () => {
        await navigator.clipboard.writeText(url.startsWith("/") ? location.origin + url : url);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Copied!" : "Copy URL"}
    </button>
  );
}
