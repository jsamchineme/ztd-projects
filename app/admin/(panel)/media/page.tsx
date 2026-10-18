import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, str } from "@/lib/admin";
import { deleteImage, storageMode } from "@/lib/storage";
import { Empty, PageHeader } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/buttons";
import { CopyUrl, MediaUploader } from "@/components/admin/MediaUploader";

export const metadata = { title: "Media" };

async function deleteMedia(fd: FormData) {
  "use server";
  await requireUser();
  const media = await prisma.media.findUnique({ where: { id: str(fd, "id") } });
  if (!media) return;
  if (media.publicId) await deleteImage(media.publicId).catch(() => {});
  await prisma.media.delete({ where: { id: media.id } });
  revalidatePath("/admin/media");
}

function size(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default async function MediaPage() {
  await requireUser();
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader
        title="Media"
        description={`Every image uploaded through the admin${storageMode === "cloudinary" ? " (stored on Cloudinary)" : ""}. Copy a URL to use it anywhere.`}
      >
        <MediaUploader />
      </PageHeader>
      {media.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
              <a href={m.url} target="_blank" className="block aspect-square bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.filename} className="h-full w-full object-cover" loading="lazy" />
              </a>
              <div className="space-y-1 p-2">
                <div className="truncate text-xs font-medium" title={m.filename}>
                  {m.filename}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-neutral-400">{size(m.size)}</span>
                  <CopyUrl url={m.url} />
                </div>
                <DeleteButton
                  action={deleteMedia}
                  id={m.id}
                  className="text-xs text-red-600 hover:underline"
                  confirmText="Delete this image? Anything still using it will show a broken image."
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty>No uploads yet. Images uploaded from any editor also appear here.</Empty>
      )}
    </>
  );
}
