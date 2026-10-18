"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, bool, cents, int, opt, requireUser, revalidateSite, str } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function saveProduct(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const name = str(fd, "name");
  const priceCents = cents(fd, "price");
  if (!name || priceCents == null) throw new Error("Name and price are required.");

  const data = {
    name,
    slug: slugify(str(fd, "slug") || name),
    description: opt(fd, "description"),
    priceCents,
    compareAtCents: cents(fd, "compareAt"),
    imageUrl: opt(fd, "imageUrl"),
    categoryId: opt(fd, "categoryId"),
    inStock: bool(fd, "inStock"),
    bestSeller: bool(fd, "bestSeller"),
    featured: bool(fd, "featured"),
    freeShipping: bool(fd, "freeShipping"),
    onSale: bool(fd, "onSale"),
    order: int(fd, "order"),
    published: bool(fd, "published"),
  };

  const clash = await prisma.product.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) data.slug = `${data.slug}-${Date.now().toString(36).slice(-4)}`;

  const row = id
    ? await prisma.product.update({ where: { id }, data })
    : await prisma.product.create({ data });
  revalidateSite();
  redirect(`/admin/products/${row.id}?saved=1`);
}

export async function deleteProduct(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.product.delete({ where: { id: str(fd, "id") } });
  revalidateSite();
  redirect("/admin/products");
}

/** Quick toggle from the product list. */
export async function toggleProduct(fd: FormData) {
  await requireUser(EDITORS);
  const field = str(fd, "field");
  if (!["published", "inStock", "bestSeller", "onSale"].includes(field)) return;
  await prisma.product.update({ where: { id: str(fd, "id") }, data: { [field]: str(fd, "value") === "true" } });
  revalidateSite();
}
