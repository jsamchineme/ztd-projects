"use client";

import { useState } from "react";
import { ShopProductCard } from "./ShopProductCard";
import type { ProductCardData } from "@/components/shared/ProductCard";

const PAGE = 12;

// Product grid with the live site's "Load More" button under it.
export function ShopGrid({ products }: { products: ProductCardData[] }) {
  const [shown, setShown] = useState(PAGE);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-[62px] lg:gap-x-[62px] lg:gap-y-[60px] lg:max-w-[1078px]">
        {products.slice(0, shown).map((p) => (
          <ShopProductCard key={p.id} product={p} />
        ))}
      </div>
      {shown < products.length && (
        <div className="mt-[62px] lg:mt-[60px] flex justify-center lg:max-w-[1078px]">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="w-[262px] lg:w-[200px] h-[53px] lg:h-[40px] border border-ink bg-transparent font-sans font-light text-[21px] lg:text-[16px] hover:bg-ink hover:text-white transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
