import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getShopProducts } from "@/lib/products";
import { ProductCard } from "@/components/shared/ProductCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop chef-crafted spices, blends, oils and vinegars from Debb's Kitchen.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category = "all", sort } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getShopProducts({ category, sort: sort as never }),
  ]);

  const pills = [
    { slug: "all", name: "All" },
    { slug: "most-popular", name: "Most Popular" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  const qs = (cat: string) =>
    `/shop?category=${cat}${sort ? `&sort=${sort}` : ""}`;

  return (
    <>
      <section className="bg-cream">
        <div className="wrap py-[56px] text-center">
          <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold-dark font-semibold mb-3">
            The Pantry
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,3.4rem)]">Shop the Collection</h1>
          <p className="text-muted mt-3">Free shipping on orders over $100.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="wrap">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {pills.map((p) => {
              const active = category === p.slug;
              return (
                <Link
                  key={p.slug}
                  href={qs(p.slug)}
                  className={`py-[9px] px-[18px] rounded-full border text-[0.9rem] font-sans transition-colors ${
                    active
                      ? "bg-burgundy text-white border-burgundy"
                      : "bg-white text-ink border-line hover:border-gold"
                  }`}
                >
                  {p.name}
                </Link>
              );
            })}
          </div>

          <div className="flex justify-end mb-6 gap-2 text-[0.85rem]">
            <span className="text-muted self-center">Sort:</span>
            {[
              { v: "featured", label: "Featured" },
              { v: "price-asc", label: "Price ↑" },
              { v: "price-desc", label: "Price ↓" },
            ].map((s) => (
              <Link
                key={s.v}
                href={`/shop?category=${category}&sort=${s.v}`}
                className={`py-1 px-3 rounded-full border ${
                  (sort ?? "featured") === s.v
                    ? "border-gold text-gold-dark"
                    : "border-line text-muted hover:border-gold"
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <p className="text-center text-muted py-20">No products in this category yet.</p>
          ) : (
            <div className="grid gap-[24px] grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
