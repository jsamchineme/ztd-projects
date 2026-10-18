"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { bool, opt, requireUser, revalidateSite, str } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function savePost(fd: FormData) {
  await requireUser();
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (!title) throw new Error("Title is required.");
  const date = str(fd, "createdAt");
  const data = {
    title,
    slug: slugify(str(fd, "slug") || title),
    excerpt: opt(fd, "excerpt"),
    category: opt(fd, "category"),
    author: opt(fd, "author"),
    imageUrl: opt(fd, "imageUrl"),
    body: opt(fd, "body"),
    published: bool(fd, "published"),
    ...(date ? { createdAt: new Date(date) } : {}),
  };
  const clash = await prisma.blogPost.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) data.slug = `${data.slug}-${Date.now().toString(36).slice(-4)}`;

  const row = id ? await prisma.blogPost.update({ where: { id }, data }) : await prisma.blogPost.create({ data });
  revalidateSite();
  redirect(`/admin/blog/${row.id}?saved=1`);
}

export async function deletePost(fd: FormData) {
  await requireUser();
  await prisma.blogPost.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/admin/blog");
}
