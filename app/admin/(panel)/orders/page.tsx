import Link from "next/link";
import { Plus } from "lucide-react";
import type { FulfillmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { dateTime, orderNumber } from "@/lib/admin-format";
import { formatPrice } from "@/lib/utils";
import { Empty, PageHeader, SearchBox, btnPrimary } from "@/components/admin/ui";
import { Select } from "@/components/admin/Select";
import { OrdersTable, type OrderRow } from "./OrdersTable";
import { bulkOrders } from "./actions";

export const metadata = { title: "Orders" };

const PAYMENTS: PaymentStatus[] = ["PAID", "UNPAID", "REFUNDED"];
const FULFILLMENTS: FulfillmentStatus[] = ["FULFILLED", "UNFULFILLED", "CANCELLED"];
const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; payment?: string; fulfillment?: string; archived?: string }>;
}) {
  const user = await requireUser(EDITORS);
  const { q, payment, fulfillment, archived } = await searchParams;
  const showArchived = archived === "1";

  const where: Prisma.OrderWhereInput = {
    archived: showArchived,
    ...(PAYMENTS.includes(payment as PaymentStatus) ? { paymentStatus: payment as PaymentStatus } : {}),
    ...(FULFILLMENTS.includes(fulfillment as FulfillmentStatus) ? { fulfillmentStatus: fulfillment as FulfillmentStatus } : {}),
    ...(q
      ? {
          OR: [
            { reference: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { select: { id: true, nameSnapshot: true, quantity: true, priceCents: true } } },
  });

  const paid = orders.filter((o) => o.paymentStatus === "PAID");
  const salesCents = paid.reduce((n, o) => n + o.totalCents, 0);
  const avgCents = paid.length ? Math.round(salesCents / paid.length) : 0;

  const rows: OrderRow[] = orders.map((o) => ({
    id: o.id,
    refDisplay: orderNumber(o.reference),
    date: dateTime(o.createdAt),
    customerName: o.name || "—",
    email: o.email,
    paymentStatus: o.paymentStatus,
    fulfillmentStatus: o.fulfillmentStatus,
    total: formatPrice(o.totalCents),
    tags: o.tags,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.nameSnapshot,
      qty: i.quantity,
      price: formatPrice(i.priceCents),
      lineTotal: formatPrice(i.priceCents * i.quantity),
    })),
  }));

  return (
    <>
      <PageHeader title="Orders" description="Orders placed through the cart. Track payment and fulfillment as you go.">
        <Link href="/admin/orders/new" className={btnPrimary}>
          <Plus size={16} /> Add New Order
        </Link>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 shadow-sm sm:grid-cols-3">
        {[
          { label: "Sales (paid)", value: formatPrice(salesCents) },
          { label: "Orders", value: String(orders.length) },
          { label: "Avg. order value", value: formatPrice(avgCents) },
        ].map((s) => (
          <div key={s.label} className="bg-white px-5 py-4">
            <div className="text-xs text-neutral-500">{s.label}</div>
            <div className="mt-1 text-xl font-semibold text-neutral-900">{s.value}</div>
          </div>
        ))}
      </div>

      <SearchBox q={q} placeholder="Order #, name or email">
        <Select
          name="payment"
          defaultValue={payment ?? ""}
          aria-label="Filter by payment"
          className="w-40"
          options={[{ value: "", label: "Any payment" }, ...PAYMENTS.map((s) => ({ value: s, label: cap(s) }))]}
        />
        <Select
          name="fulfillment"
          defaultValue={fulfillment ?? ""}
          aria-label="Filter by fulfillment"
          className="w-44"
          options={[{ value: "", label: "Any fulfillment" }, ...FULFILLMENTS.map((s) => ({ value: s, label: s === "CANCELLED" ? "Canceled" : cap(s) }))]}
        />
        {showArchived && <input type="hidden" name="archived" value="1" />}
      </SearchBox>

      <div className="mb-3 flex items-center gap-4 text-sm">
        <Link href="/admin/orders" className={!showArchived ? "font-semibold text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}>
          Active
        </Link>
        <Link href="/admin/orders?archived=1" className={showArchived ? "font-semibold text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}>
          Archived
        </Link>
      </div>

      {rows.length ? (
        <OrdersTable rows={rows} bulkAction={bulkOrders} canDelete={user.role === "ADMIN"} />
      ) : (
        <Empty>No orders found.</Empty>
      )}
    </>
  );
}
