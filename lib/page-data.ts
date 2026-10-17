import { prisma } from "./db";
import { getBestSellers, getSaleProducts } from "./products";
import { neededData, type Section } from "./sections";
import type { SectionContext } from "@/components/shared/SectionRenderer";

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

  await Promise.all(tasks);
  return ctx;
}
