"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, bool, opt, requireUser, revalidateSite, str } from "@/lib/admin";
import { slugify } from "@/lib/utils";

// Paths owned by other routes; a CMS page there would never be reachable.
const RESERVED = new Set(["admin", "api", "shop", "blog", "post", "cart", "dk-show", "media"]);

export async function savePage(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (!title) throw new Error("Title is required.");

  const sections = JSON.parse(str(fd, "sections") || "[]");
  if (!Array.isArray(sections)) throw new Error("Invalid sections.");

  const existing = id ? await prisma.page.findUnique({ where: { id } }) : null;
  // The home page's slug is fixed: the storefront looks it up by name.
  let slug = existing?.slug === "home" ? "home" : slugify(str(fd, "slug") || title);
  if (RESERVED.has(slug)) slug = `${slug}-page`;

  const data = {
    title,
    slug,
    metaDescription: opt(fd, "metaDescription"),
    published: existing?.slug === "home" ? true : bool(fd, "published"),
    sections: JSON.stringify(sections),
  };
  const clash = await prisma.page.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) data.slug = `${data.slug}-${Date.now().toString(36).slice(-4)}`;

  const row = id ? await prisma.page.update({ where: { id }, data }) : await prisma.page.create({ data });
  revalidateSite();
  redirect(`/admin/pages/${row.id}?saved=1`);
}

export async function deletePage(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const page = await prisma.page.findUnique({ where: { id } });
  if (page?.slug === "home") throw new Error("The home page can't be deleted.");
  await prisma.page.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/pages");
}
