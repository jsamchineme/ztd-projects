import { prisma } from "./db";
import { getBestSellers, getSaleProducts } from "./products";
import { neededData, type Section } from "./sections";
import type { SectionContext } from "@/components/shared/SectionRenderer";

/** "5mo ago"-style label, as the Wix Reviews widget shows. */
export function ago(date: Date): string {
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
  if (days < 30) return `${Math.max(1, days)}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/** Fetch exactly the dynamic data a page's sections require. */
export async function buildSectionContext(sections: Section[]): Promise<SectionContext> {
  const need = neededData(sections);
  const ctx: SectionContext = {};

  const tasks: Promise<void>[] = [];

  if (need.bestSellers) {
    tasks.push(getBestSellers(8).then((r) => void (ctx.bestSellers = r)));
  }
  if (need.saleProducts || need.gridProducts) {
    tasks.push(getSaleProducts(12).then((r) => void (ctx.gridProducts = r)));
  }
  if (need.stores) {
    tasks.push(
      prisma.store
        .findMany({ where: { published: true }, orderBy: { order: "asc" } })
        .then((r) => void (ctx.stores = r)),
    );
  }
  if (need.featuredVideo) {
    tasks.push(
      prisma.video
        .findFirst({ where: { published: true }, orderBy: { order: "asc" } })
        .then((r) => void (ctx.featuredVideo = r)),
    );
  }
  if (need.testimonials) {
    tasks.push(
      prisma.testimonial
        .findMany({ where: { published: true }, orderBy: { order: "asc" } })
        .then((r) => void (ctx.testimonials = r)),
    );
  }

  if (need.reviews) {
    tasks.push(
      prisma.review
        .findMany({
          where: { published: true },
          orderBy: { position: "asc" },
          include: { product: { select: { slug: true, name: true, imageUrl: true } } },
        })
        .then(
          (r) =>
            void (ctx.reviews = r.map((x) => ({
              id: x.id,
              rating: x.rating,
              title: x.title,
              body: x.body,
              author: x.author,
              location: x.location,
              ago: ago(x.createdAt),
              product: x.product,
            }))),
        ),
    );
  }

  await Promise.all(tasks);
  return ctx;
}
