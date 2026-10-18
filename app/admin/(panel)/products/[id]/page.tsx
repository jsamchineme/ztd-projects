import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { centsInput } from "@/lib/admin-format";
import { Card, Check, Field, PageHeader, SavedNotice, btnSecondary, inputCls } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { ImageField } from "@/components/admin/ImageField";
import { deleteProduct, saveProduct } from "../actions";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireUser(EDITORS);
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const [product, categories] = await Promise.all([
    isNew ? null : prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!isNew && !product) notFound();
  const p = product;

  return (
    <>
      <PageHeader title={p?.name ?? "New product"} back={{ href: "/admin/products", label: "Products" }}>
        {p && (
          <Link href={`/shop/${p.slug}`} target="_blank" className={btnSecondary}>
            View on site ↗
          </Link>
        )}
      </PageHeader>
      <SavedNotice show={!!saved} text="Product saved." />
      <form action={saveProduct} className="grid gap-6 lg:grid-cols-3">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <Field label="Name">
                <input name="name" required defaultValue={p?.name} className={inputCls} />
              </Field>
              <Field label="URL slug" hint="Leave blank to generate from the name. Changing it changes the product's address.">
                <input name="slug" defaultValue={p?.slug} className={inputCls} />
              </Field>
              <Field label="Description" hint="Shown on the product page and in search results.">
                <textarea name="description" rows={7} defaultValue={p?.description ?? ""} className={inputCls} />
              </Field>
            </div>
          </Card>
          <Card title="Image">
            <ImageField name="imageUrl" defaultValue={p?.imageUrl} />
          </Card>
          <Card title="Pricing">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price ($)">
                <input name="price" required inputMode="decimal" defaultValue={centsInput(p?.priceCents)} className={inputCls} />
              </Field>
              <Field label="Compare-at price ($)" hint="Original price, shown crossed out when on sale.">
                <input name="compareAt" inputMode="decimal" defaultValue={centsInput(p?.compareAtCents)} className={inputCls} />
              </Field>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Status">
            <div className="space-y-3">
              <Check name="published" label="Visible in the shop" defaultChecked={p?.published ?? true} />
              <Check name="inStock" label="In stock" defaultChecked={p?.inStock ?? true} />
              <Check name="bestSeller" label="Best seller" hint="Appears in Most Popular." defaultChecked={p?.bestSeller} />
              <Check name="onSale" label="On sale" defaultChecked={p?.onSale} />
              <Check name="featured" label="Featured" defaultChecked={p?.featured} />
              <Check name="freeShipping" label="Free shipping" defaultChecked={p?.freeShipping ?? true} />
            </div>
          </Card>
          <Card title="Organization">
            <div className="space-y-4">
              <Field label="Category">
                <select name="categoryId" defaultValue={p?.categoryId ?? ""} className={inputCls}>
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sort order" hint="Lower numbers show first in the shop.">
                <input name="order" type="number" defaultValue={p?.order ?? 0} className={inputCls} />
              </Field>
            </div>
          </Card>
          <div className="flex items-center justify-between">
            <SubmitButton>{isNew ? "Create product" : "Save changes"}</SubmitButton>
          </div>
        </div>
      </form>
      {p && (
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <DeleteButton action={deleteProduct} id={p.id} label="Delete product" confirmText={`Delete "${p.name}"? Its reviews will stay but lose the link.`} />
        </div>
      )}
    </>
  );
}
