import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadImage } from "@/lib/storage";

const MAX_BYTES = 15 * 1024 * 1024;

/** Image upload for the admin (image fields, rich text, media library). */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images can be uploaded" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be under 15 MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadImage(buffer, file.name);
    const media = await prisma.media.create({
      data: { filename: file.name, url, publicId, type: "image", size: file.size },
    });
    return NextResponse.json({ url, id: media.id });
  } catch (e) {
    console.error("Upload failed", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
