import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { getPriceBounds, getShopProducts } from "@/lib/products";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopSidebar, SortBy } from "@/components/shop/ShopSidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore our healthy, flavorful, & unique spices!",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string; min?: string; max?: string }>;
}) {
  const sp = await searchParams;
  const [categories, products, bounds] = await Promise.all([
    prisma.category.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getShopProducts({
      category: sp.category,
      sort: sp.sort,
      q: sp.q?.trim() || undefined,
      minCents: sp.min ? Number(sp.min) * 100 : undefined,
      maxCents: sp.max ? Number(sp.max) * 100 : undefined,
    }),
    getPriceBounds(),
  ]);

  return (
    <div className="mx-auto max-w-[1512px] px-4 lg:px-[85px] pt-[40px] lg:pt-[55px] pb-[110px]">
      <div className="text-center">
        <h1 className="font-sans font-light text-[44px] lg:text-[65px] leading-[1.15]">SHOP</h1>
        <p className="mt-3 font-sans font-light text-[17px] tracking-[0.05em]">
          Explore our healthy, flavorful, &amp; unique spices!
        </p>
      </div>

      <div className="mt-[50px] lg:mt-[70px] grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-[52px]">
        <Suspense>
          <ShopSidebar categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} bounds={bounds} />
        </Suspense>

        <div>
          <div className="flex items-center justify-between gap-4 mb-[30px] lg:-mt-[4px]">
            <p className="font-sans font-light text-[14px] text-muted">
              {sp.q ? `${products.length} ${products.length === 1 ? "result" : "results"} for “${sp.q}”` : ""}
            </p>
            <Suspense>
              <SortBy />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <p className="py-20 text-center font-sans text-muted">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 lg:gap-x-[62px] lg:gap-y-[60px] lg:max-w-[1078px]">
              {products.map((p) => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
