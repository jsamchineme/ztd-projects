import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { youtubeId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DK Show",
  description: "Cook along with Debb — recipes and techniques from the DK Show.",
};

export default async function DkShowPage() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <section className="bg-ink text-white">
        <div className="wrap py-[64px] text-center">
          <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold font-semibold mb-3">
            The DK Show
          </div>
          <h1 className="text-white text-[clamp(2.4rem,5vw,3.4rem)]">Cook along with Debb</h1>
          <p className="text-white/70 mt-3 max-w-[560px] mx-auto">
            Short, friendly episodes showing you exactly how to use every blend.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="wrap grid gap-[28px] md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => {
            const id = youtubeId(v.youtubeUrl);
            return (
              <div key={v.slug} className="bg-white border border-line rounded overflow-hidden">
                <div className="aspect-video bg-black">
                  {id && (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${id}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-5">
                  {v.episode && (
                    <p className="text-gold-dark text-[0.75rem] tracking-[0.12em] uppercase font-semibold mb-1">
                      {v.episode}
                    </p>
                  )}
                  <h3 className="text-[1.2rem] mb-1">{v.title}</h3>
                  {v.description && <p className="text-muted text-[0.95rem]">{v.description}</p>}
                </div>
              </div>
            );
          })}
          {videos.length === 0 && <p className="text-muted">No episodes yet.</p>}
        </div>
      </section>
    </>
  );
}
