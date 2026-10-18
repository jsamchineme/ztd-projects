import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { Card, PageHeader, btnSecondary, inputCls } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { deleteCategory, saveCategory } from "./actions";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await requireUser(EDITORS);
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { products: true } } } });

  return (
    <>
      <PageHeader title="Categories" description="Shop categories shown in the sidebar filter, in sort order." />
      <Card className="p-0">
        <div className="hidden grid-cols-[1fr_1fr_80px_90px_150px] gap-3 border-b border-neutral-200 px-4 py-2 text-xs font-medium uppercase tracking-wide text-neutral-500 md:grid">
          <span>Name</span>
          <span>Slug</span>
          <span>Order</span>
          <span>Visible</span>
          <span />
        </div>
        {categories.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-3 border-b border-neutral-100 px-4 py-3 md:grid md:grid-cols-[1fr_1fr_80px_90px_150px]">
            <form id={`cat-${c.id}`} action={saveCategory} className="contents">
              <input type="hidden" name="id" value={c.id} />
              <div>
                <input name="name" defaultValue={c.name} className={inputCls} />
                <span className="text-xs text-neutral-400">{c._count.products} products</span>
              </div>
              <input name="slug" defaultValue={c.slug} className={inputCls} />
              <input name="order" type="number" defaultValue={c.order} className={inputCls} />
              <input type="checkbox" name="published" defaultChecked={c.published} className="h-4 w-4 accent-green" />
            </form>
            <div className="flex gap-2">
              <button form={`cat-${c.id}`} className={btnSecondary}>
                Save
              </button>
              <DeleteButton
                action={deleteCategory}
                id={c.id}
                confirmText={`Delete "${c.name}"? Its products stay, without a category.`}
                className="rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50"
              />
            </div>
          </div>
        ))}
        <form action={saveCategory} className="flex flex-wrap items-center gap-3 bg-neutral-50 px-4 py-3 md:grid md:grid-cols-[1fr_1fr_80px_90px_150px]">
          <input name="name" placeholder="New category name" required className={inputCls} />
          <input name="slug" placeholder="slug (optional)" className={inputCls} />
          <input name="order" type="number" defaultValue={categories.length + 1} className={inputCls} />
          <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-green" />
          <SubmitButton>Add</SubmitButton>
        </form>
      </Card>
    </>
  );
}
