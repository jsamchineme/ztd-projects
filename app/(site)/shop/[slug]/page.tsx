import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductCard } from "@/components/shared/ProductCard";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.published) notFound();

  const related = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: product.id },
      categoryId: product.categoryId,
    },
    take: 4,
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      priceCents: true,
      compareAtCents: true,
      imageUrl: true,
      inStock: true,
      onSale: true,
      freeShipping: true,
    },
  });

  return (
    <>
      <div className="wrap pt-8 text-[0.85rem] text-muted">
        <Link href="/shop" className="hover:text-burgundy">Shop</Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-burgundy">
              {product.category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-ink">{product.name}</span>
      </div>

      <section className="section-padding pt-10">
        <div className="wrap grid md:grid-cols-2 gap-12 items-start">
          <div className="aspect-[4/5] rounded bg-cream border border-line overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[7rem]">🫙</span>
            )}
          </div>

          <div>
            {product.category && (
              <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold-dark font-semibold mb-3">
                {product.category.name}
              </div>
            )}
            <h1 className="text-[clamp(2rem,4vw,2.8rem)] mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-sans font-semibold text-[1.4rem]">
                {formatPrice(product.priceCents)}
              </span>
              {product.compareAtCents && (
                <span className="font-sans text-muted line-through">
                  {formatPrice(product.compareAtCents)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="text-muted text-[1.05rem] mb-7">{product.description}</p>
            )}

            <div className="max-w-[320px]">
              <AddToCartButton
                product={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceCents: product.priceCents,
                  imageUrl: product.imageUrl,
                }}
                inStock={product.inStock}
                variant="primary"
                fullWidth
              />
            </div>

            {product.freeShipping && (
              <p className="text-[0.8rem] uppercase tracking-[0.12em] text-gold-dark font-semibold mt-5">
                ✓ Free shipping on orders over $100
              </p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding pt-0">
          <div className="wrap">
            <h2 className="text-[1.8rem] mb-8 text-center">You might also like</h2>
            <div className="grid gap-[24px] grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
