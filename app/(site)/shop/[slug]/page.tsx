import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ago } from "@/lib/page-data";
import { ProductBuyBox } from "@/components/shop/ProductBuyBox";
import { ReviewsSection } from "@/components/shared/ReviewsSection";

export const dynamic = "force-dynamic";

const RETURN_POLICY =
  "All sales are final for food items including spices, spice blends, olive oil, and balsamic vinegar.";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? { title: product.name, description: product.description ?? undefined } : {};
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-[2px]" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" width={16} height={16} aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" fill={n <= Math.round(value) ? "#000" : "#d6d6d6"} />
        </svg>
      ))}
    </span>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.published) notFound();

  const [reviews, sameCategory, others] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id, published: true },
      orderBy: { position: "asc" },
    }),
    prisma.product.findMany({
      where: { published: true, id: { not: product.id }, categoryId: product.categoryId },
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { published: true, id: { not: product.id }, NOT: { categoryId: product.categoryId } },
      orderBy: { order: "asc" },
    }),
  ]);
  const related = [...sameCategory, ...others].slice(0, 8);
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
  const paragraphs = (product.description ?? "").split("\n").map((p) => p.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-[890px] px-4 lg:px-0 pt-[40px] lg:pt-[62px] pb-[110px] font-sans">
      <nav className="font-light text-[16px]">
        <Link href="/" className="hover:text-green">Home</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-[60px] grid gap-10 md:grid-cols-[498px_1fr] md:gap-[36px]">
        <div>
          <div className="aspect-[498/748] bg-white border border-line">
            {product.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="mt-6 space-y-6 font-light text-[17px] leading-[1.7]">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-light text-[28px] leading-[1.3]">{product.name}</h1>
          <p className="mt-4 font-light text-[16px]">{formatPrice(product.priceCents)}</p>
          {product.freeShipping && <p className="mt-1 font-light text-[14px] underline">Free Shipping</p>}
          {reviews.length > 0 && (
            <a href="#reviews" className="mt-4 inline-flex items-center gap-2 font-reviews text-[16px]">
              <Stars value={avg} />
              <span className="text-muted">({reviews.length})</span>
            </a>
          )}
          <div className="mt-6">
            <ProductBuyBox
              product={{ productId: product.id, slug: product.slug, name: product.name, priceCents: product.priceCents, imageUrl: product.imageUrl }}
              inStock={product.inStock}
            />
          </div>
          <details className="mt-10 max-w-[350px] border-t border-line pt-4 group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-light text-[17px]">
              Return Policy
              <span className="text-[20px] leading-none group-open:hidden">+</span>
              <span className="text-[20px] leading-none hidden group-open:inline">−</span>
            </summary>
            <p className="mt-4 font-light text-[15px] leading-[1.6]">{RETURN_POLICY}</p>
          </details>
        </div>
      </div>

      {reviews.length > 0 && (
        <div id="reviews" className="mt-[80px] -mx-4 lg:mx-0 scroll-mt-10">
          <ReviewsSection
            title="Product Reviews"
            variant="list"
            reviews={reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              title: r.title,
              body: r.body,
              author: r.author,
              location: r.location,
              ago: ago(r.createdAt),
              product: null,
            }))}
          />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-[80px]">
          <h2 className="font-light text-[28px]">Related Products</h2>
          <div className="mt-8 flex gap-[20px] overflow-x-auto snap-x pb-2 [scrollbar-width:thin]">
            {related.map((p) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group snap-start shrink-0 w-[210px]">
                <div className="relative aspect-square bg-white">
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 h-[30px] hidden lg:flex items-center justify-center bg-white/85 text-[13px] opacity-0 group-hover:opacity-100 transition-opacity">
                    Quick View
                  </span>
                </div>
                <p className="mt-3 font-light text-[16px]">{p.name}</p>
                <p className="mt-1 font-light text-[15px] text-muted">{formatPrice(p.priceCents)}</p>
                {p.freeShipping && <p className="mt-1 font-light text-[12px] text-muted underline">Free Shipping</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
