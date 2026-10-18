"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { cents, EDITORS, int, opt, requireUser, str } from "@/lib/admin";

async function logActivity(orderId: string, message: string, kind: "system" | "note" = "system") {
  await prisma.orderActivity.create({ data: { orderId, message, kind } });
}

function revalidateOrder(id: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

async function orderName(id: string) {
  const o = await prisma.order.findUnique({ where: { id }, select: { name: true } });
  return o?.name || "the customer";
}

// ─── Fulfillment ─────────────────────────────────────────────────────────────

export async function markFulfilled(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { fulfillmentStatus: "FULFILLED", items: { updateMany: { where: {}, data: { fulfilled: true } } } } });
  await logActivity(id, "Order marked as fulfilled");
  revalidateOrder(id);
}

export async function markUnfulfilled(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { fulfillmentStatus: "UNFULFILLED", items: { updateMany: { where: {}, data: { fulfilled: false } } } } });
  await logActivity(id, "Order marked as unfulfilled");
  revalidateOrder(id);
}

export async function cancelOrder(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { fulfillmentStatus: "CANCELLED" } });
  await logActivity(id, "Order canceled");
  revalidateOrder(id);
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export async function markPaid(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { paymentStatus: "PAID" } });
  await logActivity(id, "Order marked as Paid");
  revalidateOrder(id);
}

export async function markUnpaid(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { paymentStatus: "UNPAID" } });
  await logActivity(id, "Order marked as unpaid");
  revalidateOrder(id);
}

export async function refundOrder(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { paymentStatus: "REFUNDED" } });
  await logActivity(id, "Payment refunded to customer");
  revalidateOrder(id);
}

// ─── Shipping / tracking ─────────────────────────────────────────────────────

export async function updateTracking(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const trackingNumber = opt(fd, "trackingNumber");
  const deliveryMethod = opt(fd, "deliveryMethod");
  await prisma.order.update({ where: { id }, data: { trackingNumber, deliveryMethod } });
  if (trackingNumber) await logActivity(id, "Tracking number added");
  redirect(`/admin/orders/${id}?saved=1`);
}

export async function sendShippingEmail(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await logActivity(id, `Shipping confirmation email sent to ${await orderName(id)}`);
  revalidateOrder(id);
}

// ─── Notes, tags ─────────────────────────────────────────────────────────────

export async function addNote(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const note = str(fd, "note");
  if (note) await logActivity(id, note, "note");
  redirect(`/admin/orders/${id}?saved=1`);
}

export async function assignTags(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  const tags = [...new Set(str(fd, "tags").split(",").map((t) => t.trim()).filter(Boolean))];
  await prisma.order.update({ where: { id }, data: { tags } });
  redirect(`/admin/orders/${id}?saved=1`);
}

// ─── Contact / shipping info ─────────────────────────────────────────────────

export async function updateContact(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({
    where: { id },
    data: {
      name: opt(fd, "name"),
      email: str(fd, "email"),
      phone: opt(fd, "phone"),
      address: opt(fd, "address"),
      city: opt(fd, "city"),
      region: opt(fd, "region"),
      postalCode: opt(fd, "postalCode"),
      country: opt(fd, "country"),
      deliveryMethod: opt(fd, "deliveryMethod"),
    },
  });
  await logActivity(id, "Order details updated");
  redirect(`/admin/orders/${id}?saved=1`);
}

// ─── Archive / delete ────────────────────────────────────────────────────────

export async function archiveOrder(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { archived: true } });
  redirect("/admin/orders");
}

export async function unarchiveOrder(fd: FormData) {
  await requireUser(EDITORS);
  const id = str(fd, "id");
  await prisma.order.update({ where: { id }, data: { archived: false } });
  revalidateOrder(id);
}

export async function deleteOrder(fd: FormData) {
  await requireUser(["ADMIN"]);
  await prisma.order.delete({ where: { id: str(fd, "id") } });
  redirect("/admin/orders");
}

// ─── Bulk actions (from the list) ────────────────────────────────────────────

export async function bulkOrders(fd: FormData) {
  const user = await requireUser(EDITORS);
  const ids = fd.getAll("ids").map(String).filter(Boolean);
  const op = str(fd, "op");
  if (!ids.length) redirect("/admin/orders");

  switch (op) {
    case "paid":
      await prisma.order.updateMany({ where: { id: { in: ids } }, data: { paymentStatus: "PAID" } });
      break;
    case "fulfilled":
      await prisma.order.updateMany({ where: { id: { in: ids } }, data: { fulfillmentStatus: "FULFILLED" } });
      await prisma.orderItem.updateMany({ where: { orderId: { in: ids } }, data: { fulfilled: true } });
      break;
    case "archive":
      await prisma.order.updateMany({ where: { id: { in: ids } }, data: { archived: true } });
      break;
    case "delete":
      if (user.role === "ADMIN") await prisma.order.deleteMany({ where: { id: { in: ids } } });
      break;
  }
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

// ─── Create order (manual) ───────────────────────────────────────────────────

async function nextReference(): Promise<string> {
  const refs = await prisma.order.findMany({ select: { reference: true } });
  const max = refs.reduce((m, r) => (/^\d+$/.test(r.reference) ? Math.max(m, parseInt(r.reference, 10)) : m), 10000);
  return String(max + 1);
}

export async function createOrder(fd: FormData) {
  await requireUser(EDITORS);
  const email = str(fd, "email");
  if (!email) redirect("/admin/orders/new");

  // Recompute line items from the DB — never trust submitted prices.
  const products = await prisma.product.findMany({ select: { id: true, name: true, priceCents: true } });
  const lineItems = products
    .map((p) => {
      const qty = int(fd, `qty_${p.id}`, 0);
      return qty > 0 ? { productId: p.id, nameSnapshot: p.name, priceCents: p.priceCents, quantity: qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (!lineItems.length) redirect("/admin/orders/new");

  const subtotalCents = lineItems.reduce((n, i) => n + i.priceCents * i.quantity, 0);
  const shippingCents = cents(fd, "shipping") ?? 0;
  const taxCents = cents(fd, "tax") ?? 0;
  const paymentStatus = str(fd, "paymentStatus") === "PAID" ? "PAID" : "UNPAID";
  const name = opt(fd, "name");

  const order = await prisma.order.create({
    data: {
      reference: await nextReference(),
      name,
      email,
      phone: opt(fd, "phone"),
      address: opt(fd, "address"),
      city: opt(fd, "city"),
      region: opt(fd, "region"),
      postalCode: opt(fd, "postalCode"),
      country: opt(fd, "country"),
      deliveryMethod: opt(fd, "deliveryMethod"),
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents: subtotalCents + shippingCents + taxCents,
      paymentStatus,
      fulfillmentStatus: "UNFULFILLED",
      items: { create: lineItems },
      activity: {
        create: [
          { message: `${name || "A customer"} placed an order` },
          ...(paymentStatus === "PAID" ? [{ message: "Order marked as Paid" }] : []),
        ],
      },
    },
  });

  redirect(`/admin/orders/${order.id}?saved=1`);
}
