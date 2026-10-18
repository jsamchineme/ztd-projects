import { mkdir, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";

const hasCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Cloudinary folder all uploads are placed under. Override with CLOUDINARY_FOLDER.
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "debbskitchen";

export interface StoredImage {
  url: string;
  publicId: string;
}

/**
 * Upload an image. Uses Cloudinary when configured, otherwise writes a
 * Sharp-optimized WebP into public/uploads/ (local dev fallback).
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
): Promise<StoredImage> {
  if (hasCloudinary) {
    const { url, publicId } = await uploadToCloudinary(buffer, filename, CLOUDINARY_FOLDER);
    return { url, publicId };
  }

  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const base = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const name = `${Date.now()}-${base}.webp`;
  await writeFile(join(dir, name), optimized);

  // Served by app/media/[name]/route.ts: the production server only serves
  // public/ files that existed when it started, so new uploads go via a route.
  return { url: `/media/${name}`, publicId: `local:${name}` };
}

/** Delete an image by the publicId returned from uploadImage(). */
export async function deleteImage(publicId: string): Promise<void> {
  if (publicId.startsWith("local:")) {
    const name = publicId.slice("local:".length);
    try {
      await unlink(join(process.cwd(), "public", "uploads", name));
    } catch {
      // already gone — ignore
    }
    return;
  }
  if (hasCloudinary) {
    await deleteFromCloudinary(publicId);
  }
}

export const storageMode = hasCloudinary ? "cloudinary" : "local";
