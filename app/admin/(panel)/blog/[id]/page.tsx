import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/admin";
import { dateInput } from "@/lib/admin-format";
import { Card, Check, Field, PageHeader, SavedNotice, btnSecondary, inputCls } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { ImageField } from "@/components/admin/ImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { deletePost, savePost } from "../actions";

export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const p = isNew ? null : await prisma.blogPost.findUnique({ where: { id } });
  if (!isNew && !p) notFound();

  return (
    <>
      <PageHeader title={p?.title ?? "New post"} back={{ href: "/admin/blog", label: "Blog" }}>
        {p?.published && (
          <Link href={`/post/${p.slug}`} target="_blank" className={btnSecondary}>
            View on site ↗
          </Link>
        )}
      </PageHeader>
      <SavedNotice show={!!saved} text="Post saved." />
      <form action={savePost} className="grid gap-6 lg:grid-cols-3">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <Field label="Title">
                <input name="title" required defaultValue={p?.title} className={inputCls} />
              </Field>
              <Field label="Excerpt" hint="Short summary shown on the blog list.">
                <textarea name="excerpt" rows={2} defaultValue={p?.excerpt ?? ""} className={inputCls} />
              </Field>
            </div>
          </Card>
          <RichTextEditor name="body" defaultValue={p?.body} />
        </div>
        <div className="space-y-6">
          <Card title="Publish">
            <div className="space-y-4">
              <Check name="published" label="Published" hint="Drafts are hidden from the site." defaultChecked={p?.published ?? false} />
              <Field label="Date">
                <input name="createdAt" type="date" defaultValue={dateInput(p?.createdAt ?? new Date())} className={inputCls} />
              </Field>
              <SubmitButton>{isNew ? "Create post" : "Save changes"}</SubmitButton>
            </div>
          </Card>
          <Card title="Cover image">
            <ImageField name="imageUrl" defaultValue={p?.imageUrl} />
          </Card>
          <Card title="Details">
            <div className="space-y-4">
              <Field label="URL slug" hint="Leave blank to generate from the title.">
                <input name="slug" defaultValue={p?.slug} className={inputCls} />
              </Field>
              <Field label="Category">
                <input name="category" defaultValue={p?.category ?? ""} className={inputCls} />
              </Field>
              <Field label="Author">
                <input name="author" defaultValue={p?.author ?? user.name ?? ""} className={inputCls} />
              </Field>
            </div>
          </Card>
        </div>
      </form>
      {p && (
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <DeleteButton action={deletePost} id={p.id} label="Delete post" />
        </div>
      )}
    </>
  );
}
