import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, CreditCard, Mail, Package, Pencil, Printer, RotateCcw, Trash2, Truck, XCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { dateOnly, dateTime, orderNumber, timeOnly } from "@/lib/admin-format";
import { formatPrice } from "@/lib/utils";
import { Card, Field, PageHeader, SavedNotice, inputCls, btnSecondary } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { Menu, MenuAction, MenuSeparator } from "@/components/admin/Menu";
import { PrintButton } from "@/components/admin/PrintButton";
import { FulfillmentBadge, PaymentBadge } from "@/components/admin/OrderStatusBadge";
import {
  addNote,
  archiveOrder,
  assignTags,
  cancelOrder,
  deleteOrder,
  markFulfilled,
  markPaid,
  markUnfulfilled,
  markUnpaid,
  refundOrder,
  sendShippingEmail,
  unarchiveOrder,
  updateContact,
  updateTracking,
} from "../actions";

function initials(name: string | null, email: string) {
  const src = (name || email).trim();
  const parts = src.split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || src[0]?.toUpperCase() || "?";
}

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
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { id: true, imageUrl: true } } } },
      activity: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) notFound();

  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const isFulfilled = order.fulfillmentStatus === "FULFILLED";
  const isPaid = order.paymentStatus === "PAID";

  // Group activity by day for the timeline.
  const groups: { day: string; events: typeof order.activity }[] = [];
  for (const a of order.activity) {
    const day = dateOnly(a.createdAt);
    const g = groups.at(-1);
    if (g && g.day === day) g.events.push(a);
    else groups.push({ day, events: [a] });
  }

  return (
    <>
      <PageHeader back={{ href: "/admin/orders", label: "Orders" }} title={orderNumber(order.reference)}>
        <Menu label="More Actions">
          {isFulfilled ? (
            <MenuAction action={markUnfulfilled} id={order.id}>
              <XCircle size={16} /> Mark as unfulfilled
            </MenuAction>
          ) : (
            <MenuAction action={markFulfilled} id={order.id}>
              <Truck size={16} /> Mark as fulfilled
            </MenuAction>
          )}
          <MenuAction action={sendShippingEmail} id={order.id}>
            <Mail size={16} /> Send shipping confirmation email
          </MenuAction>
          <PrintButton className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50">
            <Printer size={16} /> Print order
          </PrintButton>
          {order.fulfillmentStatus !== "CANCELLED" && (
            <MenuAction action={cancelOrder} id={order.id} confirm="Cancel this order?">
              <XCircle size={16} /> Cancel order
            </MenuAction>
          )}
          <MenuSeparator />
          {order.archived ? (
            <MenuAction action={unarchiveOrder} id={order.id}>
              <Archive size={16} /> Unarchive
            </MenuAction>
          ) : (
            <MenuAction action={archiveOrder} id={order.id}>
              <Archive size={16} /> Archive
            </MenuAction>
          )}
          {user.role === "ADMIN" && (
            <MenuAction action={deleteOrder} id={order.id} danger confirm="Delete this order? This can't be undone.">
              <Trash2 size={16} /> Delete order
            </MenuAction>
          )}
        </Menu>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <PaymentBadge status={order.paymentStatus} />
        <FulfillmentBadge status={order.fulfillmentStatus} />
        <span className="text-sm text-neutral-500">Placed on {dateTime(order.createdAt)}</span>
      </div>

      <SavedNotice show={!!saved} text="Order updated." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-semibold">Items ({itemCount})</h2>
              <PrintButton className={`${btnSecondary} px-3 py-1.5`}>
                <Printer size={15} /> Print shipping label
              </PrintButton>
            </div>
            <ul className="divide-y divide-neutral-100">
              {order.items.map((i) => (
                <li key={i.id} className="flex items-center gap-4 px-5 py-4">
                  {i.product?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.product.imageUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded border border-neutral-200 object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-300">
                      <Package size={18} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    {i.product ? (
                      <Link href={`/admin/products/${i.product.id}`} className="font-medium hover:text-green">
                        {i.nameSnapshot}
                      </Link>
                    ) : (
                      <span className="font-medium">{i.nameSnapshot}</span>
                    )}
                    <div className="text-xs text-neutral-500">{i.fulfilled ? "Fulfilled" : "Not fulfilled"}</div>
                  </div>
                  <div className="text-sm text-neutral-500">{formatPrice(i.priceCents)}</div>
                  <div className="w-10 text-right text-sm text-neutral-500">× {i.quantity}</div>
                  <div className="w-20 text-right font-medium">{formatPrice(i.priceCents * i.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="border-t border-neutral-100 px-5 py-4">
              {order.trackingNumber && (
                <p className="mb-3 text-sm">
                  <span className="text-neutral-500">Tracking:</span>{" "}
                  <span className="font-medium text-green">{order.trackingNumber}</span>
                  {order.deliveryMethod && <span className="text-neutral-500"> · {order.deliveryMethod}</span>}
                </p>
              )}
              <details className="text-sm">
                <summary className="cursor-pointer text-neutral-500 hover:text-neutral-900">
                  {order.trackingNumber ? "Edit tracking" : "Add tracking"}
                </summary>
                <form action={updateTracking} className="mt-3 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={order.id} />
                  <Field label="Carrier" className="w-40">
                    <input name="deliveryMethod" defaultValue={order.deliveryMethod ?? ""} placeholder="USPS" className={inputCls} />
                  </Field>
                  <Field label="Tracking number" className="flex-1">
                    <input name="trackingNumber" defaultValue={order.trackingNumber ?? ""} className={inputCls} />
                  </Field>
                  <SubmitButton>Save</SubmitButton>
                </form>
              </details>
            </div>
          </Card>

          {/* Payment info */}
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Payment info</h2>
                <PaymentBadge status={order.paymentStatus} />
              </div>
              <Menu label="Actions">
                {isPaid ? (
                  <>
                    <MenuAction action={refundOrder} id={order.id} confirm="Mark this order as refunded?">
                      <RotateCcw size={16} /> Refund
                    </MenuAction>
                    <MenuAction action={markUnpaid} id={order.id}>
                      <CreditCard size={16} /> Mark as unpaid
                    </MenuAction>
                  </>
                ) : (
                  <MenuAction action={markPaid} id={order.id}>
                    <CreditCard size={16} /> Mark as paid
                  </MenuAction>
                )}
              </Menu>
            </div>
            <div className="px-5 py-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Items</dt>
                  <dd>{formatPrice(order.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Shipping</dt>
                  <dd>{order.shippingCents ? formatPrice(order.shippingCents) : "Free"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Tax</dt>
                  <dd>{formatPrice(order.taxCents)}</dd>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.totalCents)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm">
                <div>
                  <div className="font-medium">{isPaid ? "Amount customer paid" : "Amount due"}</div>
                  {order.paymentMethod && <div className="text-neutral-500">Paid with {order.paymentMethod}</div>}
                </div>
                <div className="font-semibold">{formatPrice(order.totalCents)}</div>
              </div>
            </div>
          </Card>

          {/* Order activity */}
          <Card title="Order activity">
            <form action={addNote} className="mb-5">
              <input type="hidden" name="id" value={order.id} />
              <textarea name="note" rows={2} placeholder="Add a note (your customer won't see this)" className={inputCls} />
              <div className="mt-2 flex justify-end">
                <SubmitButton>Add note</SubmitButton>
              </div>
            </form>
            {groups.length ? (
              <div className="space-y-5">
                {groups.map((g) => (
                  <div key={g.day}>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">{g.day}</div>
                    <ul className="space-y-3">
                      {g.events.map((e) => (
                        <li key={e.id} className="flex items-start gap-3 text-sm">
                          <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${e.kind === "note" ? "bg-amber-400" : "bg-green"}`} />
                          <span className="flex-1 text-neutral-700">{e.message}</span>
                          <span className="whitespace-nowrap text-xs text-neutral-400">{timeOnly(e.createdAt)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No activity yet.</p>
            )}
          </Card>
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="space-y-6">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-semibold">Order info</h2>
            </div>
            <div className="space-y-5 px-5 py-4 text-sm">
              <div>
                <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">Contact info</div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green/10 text-xs font-semibold text-green">
                    {initials(order.name, order.email)}
                  </span>
                  <span className="font-medium">{order.name || "—"}</span>
                </div>
                <a href={`mailto:${order.email}`} className="mt-1.5 block text-green hover:underline">
                  {order.email}
                </a>
                {order.phone && <div className="text-neutral-600">{order.phone}</div>}
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Delivery method</div>
                <div>{order.deliveryMethod || "—"}</div>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Shipping address</div>
                {order.address || order.city ? (
                  <address className="not-italic leading-relaxed text-neutral-700">
                    {order.name && <>{order.name}<br /></>}
                    {order.address && <>{order.address}<br /></>}
                    {[order.city, order.region, order.postalCode].filter(Boolean).join(", ")}
                    {order.country && <><br />{order.country}</>}
                    {order.phone && <><br />{order.phone}</>}
                  </address>
                ) : (
                  <span className="text-neutral-500">No address on file</span>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">Billing address</div>
                <div className="text-neutral-600">Same as shipping</div>
              </div>

              <details className="border-t border-neutral-100 pt-4">
                <summary className="flex cursor-pointer items-center gap-1.5 text-green hover:underline">
                  <Pencil size={14} /> Edit details
                </summary>
                <form action={updateContact} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={order.id} />
                  <Field label="Name"><input name="name" defaultValue={order.name ?? ""} className={inputCls} /></Field>
                  <Field label="Email"><input name="email" type="email" required defaultValue={order.email} className={inputCls} /></Field>
                  <Field label="Phone"><input name="phone" defaultValue={order.phone ?? ""} className={inputCls} /></Field>
                  <Field label="Address"><input name="address" defaultValue={order.address ?? ""} className={inputCls} /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="City"><input name="city" defaultValue={order.city ?? ""} className={inputCls} /></Field>
                    <Field label="State / region"><input name="region" defaultValue={order.region ?? ""} className={inputCls} /></Field>
                    <Field label="Postal code"><input name="postalCode" defaultValue={order.postalCode ?? ""} className={inputCls} /></Field>
                    <Field label="Country"><input name="country" defaultValue={order.country ?? ""} className={inputCls} /></Field>
                  </div>
                  <Field label="Delivery method"><input name="deliveryMethod" defaultValue={order.deliveryMethod ?? ""} placeholder="USPS" className={inputCls} /></Field>
                  <SubmitButton>Save details</SubmitButton>
                </form>
              </details>
            </div>
          </Card>

          <Card title="Tags">
            {order.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {order.tags.map((t) => (
                  <span key={t} className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <form action={assignTags} className="flex items-end gap-2">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Tags" hint="Comma-separated" className="flex-1">
                <input name="tags" defaultValue={order.tags.join(", ")} placeholder="VIP, Wholesale" className={inputCls} />
              </Field>
              <SubmitButton>Save</SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
