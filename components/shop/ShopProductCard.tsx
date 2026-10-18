import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { ProductCardData } from "@/components/shared/ProductCard";

// Live shop card: square image with a "Quick View" bar on hover, name, grey
// price, underlined "Free Shipping", and a full-width button shown on hover
// (always shown on touch screens).
export function ShopProductCard({ product: p }: { product: ProductCardData }) {
  return (
    <div className="group font-sans">
      <Link href={`/shop/${p.slug}`} className="relative block aspect-square bg-white">
        {p.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
        )}
        <span className="absolute inset-x-0 bottom-0 h-[32px] hidden lg:flex items-center justify-center bg-white/85 text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
          Quick View
        </span>
      </Link>
      <Link href={`/shop/${p.slug}`} className="block mt-[18px] lg:mt-4 text-[20px] lg:text-[17px] font-light leading-[1.4]">
        {p.name}
      </Link>
      <p className="mt-[8px] lg:mt-1 text-[20px] lg:text-[16px] font-light text-muted">{formatPrice(p.priceCents)}</p>
      {p.freeShipping && <p className="mt-[10px] lg:mt-1 text-[16px] lg:text-[12px] font-light text-muted underline">Free Shipping</p>}
      <div className="mt-[14px] lg:mt-4 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity">
        <AddToCartButton
          product={{ productId: p.id, slug: p.slug, name: p.name, priceCents: p.priceCents, imageUrl: p.imageUrl }}
          inStock={p.inStock}
          variant="gold"
          fullWidth
          className="h-[48px] lg:h-[40px] text-[22px] lg:text-[16px]"
        />
      </div>
    </div>
  );
}
