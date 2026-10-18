import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validations";
import { getSetting } from "@/lib/settings";

const FLAT_SHIPPING = 800;

function orderReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `DK-${stamp}${rand}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 },
    );
  }

  const { items, ...customer } = parsed.data;

  // Recompute everything from the DB — never trust client-side prices.
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, published: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems = items
    .map((i) => {
      const p = productMap.get(i.productId);
      if (!p || !p.inStock) return null;
      return {
        productId: p.id,
        nameSnapshot: p.name,
        priceCents: p.priceCents,
        quantity: i.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "None of the items are available" },
      { status: 400 },
    );
  }

  const subtotalCents = lineItems.reduce((n, i) => n + i.priceCents * i.quantity, 0);
  const shippingCents = subtotalCents >= (await getSetting("freeShippingThresholdCents", 10000)) ? 0 : FLAT_SHIPPING;
  const totalCents = subtotalCents + shippingCents;

  const order = await prisma.order.create({
    data: {
      reference: orderReference(),
      name: customer.name?.trim() || null,
      email: customer.email.trim(),
      phone: customer.phone?.trim() || null,
      address: customer.address?.trim() || null,
      city: customer.city?.trim() || null,
      postalCode: customer.postalCode?.trim() || null,
      note: customer.note?.trim() || null,
      subtotalCents,
      shippingCents,
      totalCents,
      status: "PENDING",
      items: { create: lineItems },
    },
  });

  return NextResponse.json({ ok: true, reference: order.reference });
}
