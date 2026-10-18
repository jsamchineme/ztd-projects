"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, bool, int, opt, requireUser, revalidateSite, str } from "@/lib/admin";

export async function saveReview(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const reply = opt(fd, "reply");
  const existing = id ? await prisma.review.findUnique({ where: { id } }) : null;
  const date = str(fd, "createdAt");

  const data = {
    rating: Math.min(5, Math.max(1, int(fd, "rating", 5))),
    title: str(fd, "title"),
    body: opt(fd, "body"),
    author: str(fd, "author"),
    location: opt(fd, "location"),
    verified: bool(fd, "verified"),
    published: bool(fd, "published"),
    position: int(fd, "position"),
    productId: opt(fd, "productId"),
    productName: opt(fd, "productName"),
    reply,
    // Stamp the reply date when the reply is first written or changed.
    replyAt: reply ? (reply === existing?.reply ? existing.replyAt : new Date()) : null,
    ...(date ? { createdAt: new Date(date) } : {}),
  };
  if (!data.title || !data.author) throw new Error("Title and author are required.");

  const row = id ? await prisma.review.update({ where: { id }, data }) : await prisma.review.create({ data });
  revalidateSite();
  redirect(`/admin/reviews/${row.id}?saved=1`);
}

export async function deleteReview(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.review.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/admin/reviews");
}

export async function toggleReview(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.review.update({ where: { id: str(fd, "id") }, data: { published: str(fd, "value") === "true" } });
  revalidateSite();
}
