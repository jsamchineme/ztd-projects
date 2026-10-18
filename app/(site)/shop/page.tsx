import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { getPriceBounds, getShopProducts } from "@/lib/products";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { MobileShopControls } from "@/components/shop/MobileShopControls";
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
    <div className="mx-auto max-w-[1512px] px-[37px] lg:px-[85px] pt-[64px] lg:pt-[55px] pb-[31px] lg:pb-[110px]">
      <div className="text-center">
        <h1 className="font-sans font-light text-[50px] lg:text-[65px] leading-[1.15]">SHOP</h1>
        <p className="mt-[22px] lg:mt-3 -mx-[20px] lg:mx-0 font-sans font-light text-[17px] leading-[22px] lg:leading-normal tracking-[0.06em] lg:tracking-[0.05em] lg:tracking-[0.05em]">
          Explore our healthy, flavorful, &amp; unique spices!
        </p>
      </div>

      <Suspense>
        <div className="mt-[44px] lg:hidden">
          <MobileShopControls categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} bounds={bounds} />
        </div>
      </Suspense>

      <div className="mt-[15px] lg:mt-[70px] grid lg:grid-cols-[200px_1fr] lg:gap-[52px]">
        <Suspense>
          <ShopSidebar categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} bounds={bounds} />
        </Suspense>

        <div>
          <div className={`${sp.q ? "flex" : "hidden lg:flex"} items-center justify-between gap-4 mb-[30px] lg:-mt-[4px]`}>
            <p className="font-sans font-light text-[14px] text-muted">
              {sp.q ? `${products.length} ${products.length === 1 ? "result" : "results"} for “${sp.q}”` : ""}
            </p>
            <div className="hidden lg:block">
              <Suspense>
                <SortBy />
              </Suspense>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="py-20 text-center font-sans text-muted">No products match these filters.</p>
          ) : (
            <ShopGrid key={JSON.stringify(sp)} products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
