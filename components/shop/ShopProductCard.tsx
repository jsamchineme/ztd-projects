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
      <Link href={`/shop/${p.slug}`} className="relative block aspect-square bg-white overflow-hidden">
        {p.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110" />
        )}
        <span className="absolute inset-x-0 bottom-0 h-[32px] hidden lg:flex items-center justify-center bg-white/85 text-[14px] opacity-0 translate-y-[6px] group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,translate] duration-300 ease-out">
          Quick View
        </span>
      </Link>
      <Link href={`/shop/${p.slug}`} className="block mt-[24px] lg:mt-4 text-[21.5px] lg:text-[17px] font-light leading-[1.4]">
        {p.name}
      </Link>
      <p className="mt-[5px] lg:mt-1 text-[18px] lg:text-[16px] font-light text-muted">{formatPrice(p.priceCents)}</p>
      {p.freeShipping && <p className="mt-[8px] lg:mt-1 text-[15px] lg:text-[12px] font-light text-muted underline">Free Shipping</p>}
      <div className="mt-[11px] lg:mt-4 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity">
        <AddToCartButton
          product={{ productId: p.id, slug: p.slug, name: p.name, priceCents: p.priceCents, imageUrl: p.imageUrl }}
          inStock={p.inStock}
          variant="gold"
          fullWidth
          className="h-[48px] lg:h-[40px] text-[20px] lg:text-[16px]"
        />
      </div>
    </div>
  );
}
