import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { dateTime } from "@/lib/admin-format";
import { formatPrice } from "@/lib/utils";
import { Card, Field, PageHeader, SavedNotice, Table, inputCls, td } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { deleteOrder, updateOrder } from "../actions";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireUser(EDITORS);
  const { id } = await params;
  const { saved } = await searchParams;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { product: { select: { id: true, imageUrl: true } } } } } });
  if (!order) notFound();

  return (
    <>
      <PageHeader title={`Order ${order.reference}`} description={`Placed ${dateTime(order.createdAt)}`} back={{ href: "/admin/orders", label: "Orders" }}>
        <OrderStatusBadge status={order.status} />
      </PageHeader>
      <SavedNotice show={!!saved} text="Order updated." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Table head={["Item", "Price", "Qty", "Total"]}>
            {order.items.map((i) => (
              <tr key={i.id}>
                <td className={td}>
                  <div className="flex items-center gap-3">
                    {i.product?.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.product.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    {i.product ? (
                      <Link href={`/admin/products/${i.product.id}`} className="hover:text-green">
                        {i.nameSnapshot}
                      </Link>
                    ) : (
                      i.nameSnapshot
                    )}
                  </div>
                </td>
                <td className={td}>{formatPrice(i.priceCents)}</td>
                <td className={td}>{i.quantity}</td>
                <td className={td}>{formatPrice(i.priceCents * i.quantity)}</td>
              </tr>
            ))}
          </Table>
          <Card>
            <dl className="ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd>{formatPrice(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Shipping</dt>
                <dd>{order.shippingCents ? formatPrice(order.shippingCents) : "Free"}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-1 font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalCents)}</dd>
              </div>
            </dl>
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Customer">
            <div className="space-y-1 text-sm">
              <div className="font-medium">{order.name || "—"}</div>
              <a href={`mailto:${order.email}`} className="block text-green hover:underline">
                {order.email}
              </a>
              {order.phone && <div>{order.phone}</div>}
              {(order.address || order.city) && (
                <div className="pt-2 text-neutral-600">
                  {order.address}
                  <br />
                  {[order.city, order.postalCode].filter(Boolean).join(" ")}
                </div>
              )}
            </div>
          </Card>
          <Card title="Update">
            <form action={updateOrder} className="space-y-4">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Status">
                <select name="status" defaultValue={order.status} className={inputCls}>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FULFILLED">Fulfilled</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </Field>
              <Field label="Note" hint="The customer's note, or your own.">
                <textarea name="note" rows={4} defaultValue={order.note ?? ""} className={inputCls} />
              </Field>
              <SubmitButton />
            </form>
          </Card>
          {user.role === "ADMIN" && <DeleteButton action={deleteOrder} id={order.id} label="Delete order" />}
        </div>
      </div>
    </>
  );
}
