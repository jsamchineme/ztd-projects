"use server";

import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser, str } from "@/lib/admin";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export async function updateOrder(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const status = str(fd, "status") as OrderStatus;
  if (!STATUSES.includes(status)) return;
  await prisma.order.update({ where: { id }, data: { status, note: str(fd, "note") || null } });
  redirect(`/admin/orders/${id}?saved=1`);
}

export async function deleteOrder(fd: FormData) {
  await requireUser(["ADMIN"]);
  await prisma.order.delete({ where: { id: str(fd, "id") } });
  redirect("/admin/orders");
}
