"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { EDITORS, bool, int, requireUser, revalidateSite, str } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function saveCategory(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return;
  const data = { name, slug: slugify(str(fd, "slug") || name), order: int(fd, "order"), published: bool(fd, "published") };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidatePath("/admin/categories");
  revalidateSite();
}

export async function deleteCategory(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.category.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin/categories");
  revalidateSite();
}
