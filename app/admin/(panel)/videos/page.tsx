import Link from "next/link";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { Badge, Empty, PageHeader, Table, btnPrimary, td } from "@/components/admin/ui";

export const metadata = { title: "DK Show" };

export default async function VideosPage() {
  await requireUser(EDITORS);
  const videos = await prisma.video.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <PageHeader title="DK Show" description="Episodes on the DK Show page, in sort order (the first one is featured).">
        <Link href="/admin/videos/new" className={btnPrimary}>
          Add episode
        </Link>
      </PageHeader>
      {videos.length ? (
        <Table head={["#", "", "Title", "Episode", "Length", "Status"]}>
          {videos.map((v) => (
            <tr key={v.id} className="hover:bg-neutral-50">
              <td className={`${td} text-neutral-400`}>{v.order}</td>
              <td className={`${td} w-24`}>
                {v.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbnailUrl} alt="" className="h-11 w-20 rounded object-cover" />
                )}
              </td>
              <td className={td}>
                <Link href={`/admin/videos/${v.id}`} className="font-medium hover:text-green">
                  {v.title}
                </Link>
              </td>
              <td className={`${td} text-neutral-600`}>{v.episode ?? "—"}</td>
              <td className={`${td} text-neutral-600`}>{v.duration ?? "—"}</td>
              <td className={td}>
                <Badge tone={v.published ? "green" : "gray"}>{v.published ? "Live" : "Hidden"}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No episodes yet.</Empty>
      )}
    </>
  );
}
