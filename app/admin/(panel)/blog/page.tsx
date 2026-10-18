import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { Badge, Empty, PageHeader, Table, btnPrimary, td } from "@/components/admin/ui";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  await requireUser();
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Blog" description="Posts on the Blog page.">
        <Link href="/admin/blog/new" className={btnPrimary}>
          Write post
        </Link>
      </PageHeader>
      {posts.length ? (
        <Table head={["", "Title", "Category", "Author", "Date", "Status"]}>
          {posts.map((p) => (
            <tr key={p.id} className="hover:bg-neutral-50">
              <td className={`${td} w-16`}>
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="h-10 w-14 rounded object-cover" />
                )}
              </td>
              <td className={td}>
                <Link href={`/admin/blog/${p.id}`} className="font-medium hover:text-green">
                  {p.title}
                </Link>
              </td>
              <td className={`${td} text-neutral-600`}>{p.category ?? "—"}</td>
              <td className={`${td} text-neutral-600`}>{p.author ?? "—"}</td>
              <td className={`${td} whitespace-nowrap text-neutral-500`}>{formatDate(p.createdAt)}</td>
              <td className={td}>
                <Badge tone={p.published ? "green" : "gray"}>{p.published ? "Published" : "Draft"}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No posts yet.</Empty>
      )}
    </>
  );
}
