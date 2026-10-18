import Link from "next/link";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { Badge, PageHeader, Table, btnPrimary, td } from "@/components/admin/ui";

export const metadata = { title: "Pages" };

export default async function PagesPage() {
  await requireUser(EDITORS);
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHeader
        title="Pages"
        description="Site pages and their content. The shop, blog, cart and DK Show pages are built from Products, Blog and DK Show."
      >
        <Link href="/admin/pages/new" className={btnPrimary}>
          New page
        </Link>
      </PageHeader>
      <Table head={["Title", "Address", "Updated", "Status"]}>
        {pages.map((p) => (
          <tr key={p.id} className="hover:bg-neutral-50">
            <td className={td}>
              <Link href={`/admin/pages/${p.id}`} className="font-medium hover:text-green">
                {p.title}
              </Link>
            </td>
            <td className={`${td} text-neutral-500`}>{p.slug === "home" ? "/" : `/${p.slug}`}</td>
            <td className={`${td} text-neutral-500`}>{formatDate(p.updatedAt)}</td>
            <td className={td}>
              <Badge tone={p.published ? "green" : "gray"}>{p.published ? "Live" : "Hidden"}</Badge>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
