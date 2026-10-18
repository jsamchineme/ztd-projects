import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/admin";
import { dateTime } from "@/lib/admin-format";
import { formatPrice } from "@/lib/utils";
import { Card, PageHeader, Table, td } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export default async function Dashboard() {
  const user = await requireUser();
  if (user.role === "AUTHOR") redirect("/admin/blog");

  const [products, pending, revenue, messages, subscribers, reviews, orders, unread] = await Promise.all([
    prisma.product.count({ where: { published: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ where: { status: { in: ["PAID", "FULFILLED"] } }, _sum: { totalCents: true } }),
    prisma.contactMessage.count(),
    prisma.newsletterSubscriber.count(),
    prisma.review.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Pending orders", value: pending, href: "/admin/orders?status=PENDING" },
    { label: "Revenue (paid)", value: formatPrice(revenue._sum.totalCents ?? 0), href: "/admin/orders" },
    { label: "Live products", value: products, href: "/admin/products" },
    { label: "Reviews", value: reviews, href: "/admin/reviews" },
    { label: "Messages", value: messages, href: "/admin/messages" },
    { label: "Subscribers", value: subscribers, href: "/admin/subscribers" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Here's what's happening at Debb's Kitchen." />
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm hover:border-green">
            <div className="text-xs text-neutral-500">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-green hover:underline">
              All orders
            </Link>
          </div>
          {orders.length ? (
            <Table head={["Order", "Customer", "Total", "Status", "Date"]}>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-green hover:underline">
                      {o.reference}
                    </Link>
                  </td>
                  <td className={td}>{o.name || o.email}</td>
                  <td className={td}>{formatPrice(o.totalCents)}</td>
                  <td className={td}>
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className={`${td} text-neutral-500`}>{dateTime(o.createdAt)}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <Card>
              <p className="text-sm text-neutral-500">No orders yet.</p>
            </Card>
          )}
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Unread messages</h2>
            <Link href="/admin/messages" className="text-sm text-green hover:underline">
              Inbox
            </Link>
          </div>
          <Card className="p-0">
            {unread.length ? (
              <ul className="divide-y divide-neutral-100">
                {unread.map((m) => (
                  <li key={m.id} className="p-4">
                    <Link href={`/admin/messages#${m.id}`} className="block">
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="line-clamp-2 text-sm text-neutral-500">{m.message}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-5 text-sm text-neutral-500">You&apos;re all caught up.</p>
            )}
          </Card>
          <h2 className="mb-3 mt-6 font-semibold">Quick links</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["/admin/products/new", "Add product"],
              ["/admin/blog/new", "Write post"],
              ["/admin/pages", "Edit pages"],
              ["/admin/settings", "Promo banner"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-md border border-neutral-200 bg-white px-3 py-2 hover:border-green">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
