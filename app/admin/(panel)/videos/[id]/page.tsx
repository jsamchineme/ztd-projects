import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { youtubeId } from "@/lib/youtube";
import { Card, Check, Field, PageHeader, SavedNotice, inputCls } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/buttons";
import { ImageField } from "@/components/admin/ImageField";
import { deleteVideo, saveVideo } from "../actions";

export default async function EditVideo({
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
  const [v, last] = await Promise.all([
    isNew ? null : prisma.video.findUnique({ where: { id } }),
    prisma.video.aggregate({ _max: { order: true } }),
  ]);
  if (!isNew && !v) notFound();
  const yt = v ? youtubeId(v.youtubeUrl) : null;

  return (
    <>
      <PageHeader title={v?.title ?? "New episode"} back={{ href: "/admin/videos", label: "DK Show" }} />
      <SavedNotice show={!!saved} text="Episode saved." />
      <form action={saveVideo} className="grid gap-6 lg:grid-cols-3">
        <input type="hidden" name="id" value={v?.id ?? ""} />
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <Field label="Title">
                <input name="title" required defaultValue={v?.title} className={inputCls} />
              </Field>
              <Field label="YouTube link" hint="e.g. https://www.youtube.com/watch?v=…">
                <input name="youtubeUrl" required defaultValue={v?.youtubeUrl} className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea name="description" rows={5} defaultValue={v?.description ?? ""} className={inputCls} />
              </Field>
            </div>
          </Card>
          {yt && (
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe src={`https://www.youtube.com/embed/${yt}`} className="h-full w-full" allowFullScreen title={v?.title} />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card title="Status">
            <div className="space-y-4">
              <Check name="published" label="Visible on the site" defaultChecked={v?.published ?? true} />
              <SubmitButton>{isNew ? "Create episode" : "Save changes"}</SubmitButton>
            </div>
          </Card>
          <Card title="Thumbnail">
            <ImageField name="thumbnailUrl" defaultValue={v?.thumbnailUrl} />
            <p className="mt-2 text-xs text-neutral-500">Leave empty to use YouTube&apos;s thumbnail.</p>
          </Card>
          <Card title="Details">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Episode">
                  <input name="episode" defaultValue={v?.episode ?? ""} placeholder="Ep 5" className={inputCls} />
                </Field>
                <Field label="Length">
                  <input name="duration" defaultValue={v?.duration ?? ""} placeholder="12:34" className={inputCls} />
                </Field>
              </div>
              <Field label="Sort order" hint="Lower numbers show first.">
                <input name="order" type="number" defaultValue={v?.order ?? (last._max.order ?? 0) + 1} className={inputCls} />
              </Field>
              <Field label="URL slug">
                <input name="slug" defaultValue={v?.slug} className={inputCls} />
              </Field>
            </div>
          </Card>
        </div>
      </form>
      {v && (
        <div className="mt-10 border-t border-neutral-200 pt-6">
          <DeleteButton action={deleteVideo} id={v.id} label="Delete episode" />
        </div>
      )}
    </>
  );
}
