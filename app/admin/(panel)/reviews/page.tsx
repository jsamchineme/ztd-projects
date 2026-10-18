import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import { Badge, Empty, PageHeader, SearchBox, Table, btnPrimary, td } from "@/components/admin/ui";
import { toggleReview } from "./actions";

export const metadata = { title: "Reviews" };

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireUser(EDITORS);
  const { q } = await searchParams;
  const where: Prisma.ReviewWhereInput = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { body: { contains: q, mode: "insensitive" } },
          { author: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};
  const reviews = await prisma.review.findMany({ where, orderBy: { position: "asc" }, include: { product: { select: { name: true } } } });

  return (
    <>
      <PageHeader title="Reviews" description="Customer reviews shown on the home page and product pages, in position order.">
        <Link href="/admin/reviews/new" className={btnPrimary}>
          Add review
        </Link>
      </PageHeader>
      <SearchBox q={q} placeholder="Search reviews…" />
      {reviews.length ? (
        <Table head={["#", "Review", "Product", "Rating", "Reply", "Date", "Visible"]}>
          {reviews.map((r) => (
            <tr key={r.id} className="hover:bg-neutral-50">
              <td className={`${td} text-neutral-400`}>{r.position}</td>
              <td className={`${td} max-w-sm`}>
                <Link href={`/admin/reviews/${r.id}`} className="font-medium hover:text-green">
                  {r.title}
                </Link>
                <div className="text-xs text-neutral-500">
                  {r.author}
                  {r.location && ` · ${r.location}`}
                </div>
              </td>
              <td className={`${td} text-neutral-600`}>{r.product?.name ?? r.productName ?? "—"}</td>
              <td className={`${td} whitespace-nowrap text-amber-500`}>
                {"★".repeat(r.rating)}
                <span className="text-neutral-300">{"★".repeat(5 - r.rating)}</span>
              </td>
              <td className={td}>{r.reply ? <Badge tone="blue">Replied</Badge> : "—"}</td>
              <td className={`${td} whitespace-nowrap text-neutral-500`}>{formatDate(r.createdAt)}</td>
              <td className={td}>
                <form action={toggleReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="value" value={String(!r.published)} />
                  <button title="Click to toggle">
                    <Badge tone={r.published ? "green" : "gray"}>{r.published ? "Live" : "Hidden"}</Badge>
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No reviews found.</Empty>
      )}
    </>
  );
}
