import type { Metadata } from "next";
import { Sidebar, type NavItem } from "@/components/admin/Sidebar";
import { requireUser } from "@/lib/admin";
import { signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin | Debb's Kitchen" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const isEditor = user.role !== "AUTHOR";
  const [pendingOrders, unread] = isEditor
    ? await Promise.all([
        prisma.order.count({ where: { archived: false, OR: [{ paymentStatus: "UNPAID" }, { fulfillmentStatus: "UNFULFILLED" }] } }),
        prisma.contactMessage.count({ where: { read: false } }),
      ])
    : [0, 0];

  const groups: { title?: string; items: NavItem[] }[] = isEditor
    ? [
        { items: [{ href: "/admin", label: "Dashboard" }] },
        {
          title: "Store",
          items: [
            { href: "/admin/orders", label: "Orders", badge: pendingOrders },
            { href: "/admin/products", label: "Products" },
            { href: "/admin/categories", label: "Categories" },
            { href: "/admin/reviews", label: "Reviews" },
          ],
        },
        {
          title: "Content",
          items: [
            { href: "/admin/pages", label: "Pages" },
            { href: "/admin/blog", label: "Blog" },
            { href: "/admin/videos", label: "DK Show" },
            { href: "/admin/media", label: "Media" },
          ],
        },
        {
          title: "Customers",
          items: [
            { href: "/admin/messages", label: "Messages", badge: unread },
            { href: "/admin/subscribers", label: "Subscribers" },
          ],
        },
        {
          title: "Settings",
          items: [
            { href: "/admin/settings", label: "Site settings" },
            ...(user.role === "ADMIN" ? [{ href: "/admin/users", label: "Users" }] : []),
          ],
        },
      ]
    : [{ items: [{ href: "/admin/blog", label: "Blog" }, { href: "/admin/media", label: "Media" }] }];

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <Sidebar groups={groups} user={user} signOut={doSignOut} />
      <div className="lg:pl-60">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
