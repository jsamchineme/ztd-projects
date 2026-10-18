import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { Card, Check, Field, PageHeader, SavedNotice, btnSecondary, inputCls } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { SectionsEditor, type SectionValue } from "@/components/admin/SectionsEditor";
import { deletePage, savePage } from "../actions";

function parseSections(json: string | null): SectionValue[] {
  try {
    const v = JSON.parse(json ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function EditPage({
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
  const page = isNew ? null : await prisma.page.findUnique({ where: { id } });
  if (!isNew && !page) notFound();
  const isHome = page?.slug === "home";
  const href = isHome ? "/" : `/${page?.slug}`;

  return (
    <>
      <PageHeader title={page?.title ?? "New page"} back={{ href: "/admin/pages", label: "Pages" }}>
        {page && (
          <Link href={href} target="_blank" className={btnSecondary}>
            View page ↗
          </Link>
        )}
      </PageHeader>
      <SavedNotice show={!!saved} text="Page saved — reload the live page to see it." />
      <form action={savePage} className="grid gap-6 lg:grid-cols-3">
        <input type="hidden" name="id" value={page?.id ?? ""} />
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">Content</h2>
          <SectionsEditor name="sections" defaultValue={parseSections(page?.sections ?? null)} />
        </div>
        <div className="space-y-6">
          <Card title="Page">
            <div className="space-y-4">
              <Field label="Title">
                <input name="title" required defaultValue={page?.title} className={inputCls} />
              </Field>
              <Field label="Address" hint={isHome ? "The home page always lives at /." : "Leave blank to generate from the title."}>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-400">/</span>
                  <input name="slug" defaultValue={isHome ? "" : page?.slug} disabled={isHome} className={inputCls} />
                </div>
              </Field>
              <Field label="Search description" hint="Shown by Google under the page title.">
                <textarea name="metaDescription" rows={3} defaultValue={page?.metaDescription ?? ""} className={inputCls} />
              </Field>
              {!isHome && <Check name="published" label="Visible on the site" defaultChecked={page?.published ?? true} />}
              <SubmitButton>{isNew ? "Create page" : "Save page"}</SubmitButton>
            </div>
          </Card>
          <p className="text-xs leading-relaxed text-neutral-500">
            Tip: open a section to edit its text and images. Use ↑ ↓ to reorder sections and list items. Changes go live when you
            press Save.
          </p>
        </div>
      </form>
      {page && !isHome && (
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <DeleteButton action={deletePage} id={page.id} label="Delete page" />
        </div>
      )}
    </>
  );
}
