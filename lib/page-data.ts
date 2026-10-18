import { prisma } from "./db";
import { getBestSellers, getSaleProducts } from "./products";
import { neededData, type Section } from "./sections";
import type { SectionContext } from "@/components/shared/SectionRenderer";
import type { ReviewItem } from "@/components/shared/ReviewsSection";

/** "5mo ago"-style label, as the Wix Reviews widget shows. */
export function ago(date: Date): string {
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
  if (days < 30) return `${Math.max(1, days)}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/** A stored review in the shape the reviews widget renders. */
export function reviewItem(
  r: {
    id: string;
    rating: number;
    title: string;
    body: string | null;
    author: string;
    location: string | null;
    verified: boolean;
    productName: string | null;
    reply: string | null;
    replyAt: Date | null;
    createdAt: Date;
  },
  product: ReviewItem["product"],
): ReviewItem {
  return {
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    author: r.author,
    location: r.location,
    verified: r.verified,
    ago: ago(r.createdAt),
    product,
    productName: r.productName,
    reply: r.reply ? { body: r.reply, ago: ago(r.replyAt ?? r.createdAt) } : null,
  };
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
            void (ctx.reviews = r.map((x) => reviewItem(x, x.product))),
        ),
    );
  }

  await Promise.all(tasks);
  return ctx;
}
