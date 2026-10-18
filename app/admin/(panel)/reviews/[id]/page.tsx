import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { dateInput } from "@/lib/admin-format";
import { Card, Check, Field, PageHeader, SavedNotice, inputCls } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { deleteReview, saveReview } from "../actions";

export default async function EditReview({
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
  const [r, products, last] = await Promise.all([
    isNew ? null : prisma.review.findUnique({ where: { id } }),
    prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.review.aggregate({ _max: { position: true } }),
  ]);
  if (!isNew && !r) notFound();

  return (
    <>
      <PageHeader title={r?.title ?? "New review"} back={{ href: "/admin/reviews", label: "Reviews" }} />
      <SavedNotice show={!!saved} text="Review saved." />
      <form action={saveReview} className="grid gap-6 lg:grid-cols-3">
        <input type="hidden" name="id" value={r?.id ?? ""} />
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <Field label="Rating">
                  <select name="rating" defaultValue={r?.rating ?? 5} className={inputCls}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {"★".repeat(n)} {n}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Title">
                  <input name="title" required defaultValue={r?.title} className={inputCls} />
                </Field>
              </div>
              <Field label="Review">
                <textarea name="body" rows={6} defaultValue={r?.body ?? ""} className={inputCls} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Author">
                  <input name="author" required defaultValue={r?.author} className={inputCls} />
                </Field>
                <Field label="Location">
                  <input name="location" defaultValue={r?.location ?? ""} className={inputCls} />
                </Field>
              </div>
            </div>
          </Card>
          <Card title="Store reply">
            <Field label="Public reply" hint="Shown under the review as Debbs Kitchen's reply. Leave empty for none.">
              <textarea name="reply" rows={4} defaultValue={r?.reply ?? ""} className={inputCls} />
            </Field>
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Status">
            <div className="space-y-3">
              <Check name="published" label="Visible on the site" defaultChecked={r?.published ?? true} />
              <Check name="verified" label="Verified buyer" defaultChecked={r?.verified ?? true} />
            </div>
          </Card>
          <Card title="Details">
            <div className="space-y-4">
              <Field label="Product">
                <select name="productId" defaultValue={r?.productId ?? ""} className={inputCls}>
                  <option value="">None</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Product name (not in shop)" hint="Only used when no product is selected.">
                <input name="productName" defaultValue={r?.productName ?? ""} className={inputCls} />
              </Field>
              <Field label="Date">
                <input name="createdAt" type="date" defaultValue={dateInput(r?.createdAt ?? new Date())} className={inputCls} />
              </Field>
              <Field label="Position" hint="Lower numbers show first.">
                <input name="position" type="number" defaultValue={r?.position ?? (last._max.position ?? 0) + 1} className={inputCls} />
              </Field>
            </div>
          </Card>
          <SubmitButton>{isNew ? "Create review" : "Save changes"}</SubmitButton>
        </div>
      </form>
      {r && (
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <DeleteButton action={deleteReview} id={r.id} label="Delete review" />
        </div>
      )}
    </>
  );
}
