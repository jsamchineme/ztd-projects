import { readFile } from "node:fs/promises";
import { join, basename, extname } from "node:path";

const TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/** Serves locally stored uploads (public/uploads) — see lib/storage.ts. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = basename((await params).name);
  try {
    const file = await readFile(join(process.cwd(), "public", "uploads", name));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": TYPES[extname(name).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
