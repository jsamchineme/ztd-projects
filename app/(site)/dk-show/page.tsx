import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DkShowPage } from "@/components/pages/DkShowPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DK Show",
  description: "Cook along with Debb — episodes of the DK Show.",
};

export default async function DkShow() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, youtubeUrl: true, thumbnailUrl: true },
  });
  return <DkShowPage cover="/pages/dkshow-cover.jpg" videos={videos} />;
}
