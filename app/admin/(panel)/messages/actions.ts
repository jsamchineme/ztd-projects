"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser, str } from "@/lib/admin";

export async function markMessage(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.contactMessage.update({ where: { id: str(fd, "id") }, data: { read: str(fd, "read") === "true" } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(fd: FormData) {
  await requireUser(EDITORS);
  await prisma.contactMessage.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin", "layout");
}
