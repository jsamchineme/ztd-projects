import Link from "next/link";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { dateTime } from "@/lib/admin-format";
import { formatPrice } from "@/lib/utils";
import { Empty, PageHeader, SearchBox, Table, inputCls, td } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export const metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireUser(EDITORS);
  const { q, status } = await searchParams;
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status: status as OrderStatus } : {}),
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
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: { _count: { select: { items: true } } } });

  return (
    <>
      <PageHeader title="Orders" description="Orders placed through the cart. Update the status as you take payment and ship." />
      <SearchBox q={q} placeholder="Order #, name or email">
        <select name="status" defaultValue={status ?? ""} className={`${inputCls} max-w-40`}>
          <option value="">All statuses</option>
          {["PENDING", "PAID", "FULFILLED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </SearchBox>
      {orders.length ? (
        <Table head={["Order", "Customer", "Items", "Total", "Status", "Placed"]}>
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-neutral-50">
              <td className={td}>
                <Link href={`/admin/orders/${o.id}`} className="font-medium text-green hover:underline">
                  {o.reference}
                </Link>
              </td>
              <td className={td}>
                {o.name || "—"}
                <div className="text-xs text-neutral-500">{o.email}</div>
              </td>
              <td className={td}>{o._count.items}</td>
              <td className={td}>{formatPrice(o.totalCents)}</td>
              <td className={td}>
                <OrderStatusBadge status={o.status} />
              </td>
              <td className={`${td} text-neutral-500`}>{dateTime(o.createdAt)}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No orders found.</Empty>
      )}
    </>
  );
}
