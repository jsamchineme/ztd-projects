import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { Badge, Empty, PageHeader, SearchBox, Table, btnPrimary, inputCls, td } from "@/components/admin/ui";
import { toggleProduct } from "./actions";

export const metadata = { title: "Products" };

function Toggle({ id, field, value, on, off }: { id: string; field: string; value: boolean; on: string; off: string }) {
  return (
    <form action={toggleProduct}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!value)} />
      <button title="Click to toggle">
        <Badge tone={value ? "green" : "gray"}>{value ? on : off}</Badge>
      </button>
    </form>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  await requireUser(EDITORS);
  const { q, category } = await searchParams;
  const where: Prisma.ProductWhereInput = {
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    ...(category ? { categoryId: category } : {}),
  };
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy: [{ order: "asc" }, { name: "asc" }], include: { category: true } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="Products" description={`${products.length} product${products.length === 1 ? "" : "s"}`}>
        <Link href="/admin/products/new" className={btnPrimary}>
          Add product
        </Link>
      </PageHeader>
      <SearchBox q={q} placeholder="Search products…">
        <select name="category" defaultValue={category ?? ""} className={`${inputCls} max-w-48`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </SearchBox>
      {products.length ? (
        <Table head={["", "Product", "Category", "Price", "Visibility", "Stock", "Best seller", "Sale"]}>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-neutral-50">
              <td className={`${td} w-14`}>
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                )}
              </td>
              <td className={td}>
                <Link href={`/admin/products/${p.id}`} className="font-medium text-neutral-900 hover:text-green">
                  {p.name}
                </Link>
                <div className="text-xs text-neutral-400">/shop/{p.slug}</div>
              </td>
              <td className={`${td} text-neutral-600`}>{p.category?.name ?? "—"}</td>
              <td className={td}>
                {formatPrice(p.priceCents)}
                {p.compareAtCents && <span className="ml-1 text-xs text-neutral-400 line-through">{formatPrice(p.compareAtCents)}</span>}
              </td>
              <td className={td}>
                <Toggle id={p.id} field="published" value={p.published} on="Live" off="Hidden" />
              </td>
              <td className={td}>
                <Toggle id={p.id} field="inStock" value={p.inStock} on="In stock" off="Sold out" />
              </td>
              <td className={td}>
                <Toggle id={p.id} field="bestSeller" value={p.bestSeller} on="Yes" off="No" />
              </td>
              <td className={td}>
                <Toggle id={p.id} field="onSale" value={p.onSale} on="On sale" off="No" />
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No products found.</Empty>
      )}
    </>
  );
}
