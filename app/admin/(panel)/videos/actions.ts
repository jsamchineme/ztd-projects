"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, bool, int, opt, requireUser, revalidateSite, str } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { youtubeId } from "@/lib/youtube";

export async function saveVideo(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const title = str(fd, "title");
  const youtubeUrl = str(fd, "youtubeUrl");
  if (!title || !youtubeUrl) throw new Error("Title and YouTube link are required.");
  const yt = youtubeId(youtubeUrl);
  const data = {
    title,
    slug: slugify(str(fd, "slug") || title),
    description: opt(fd, "description"),
    youtubeUrl,
    // Fall back to YouTube's own thumbnail.
    thumbnailUrl: opt(fd, "thumbnailUrl") ?? (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : null),
    duration: opt(fd, "duration"),
    episode: opt(fd, "episode"),
    order: int(fd, "order"),
    published: bool(fd, "published"),
  };
  const clash = await prisma.video.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) data.slug = `${data.slug}-${Date.now().toString(36).slice(-4)}`;

  const row = id ? await prisma.video.update({ where: { id }, data }) : await prisma.video.create({ data });
  revalidateSite();
  redirect(`/admin/videos/${row.id}?saved=1`);
}

export async function deleteVideo(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.video.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/admin/videos");
}
