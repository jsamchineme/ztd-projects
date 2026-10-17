import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCents: number;
  compareAtCents?: number | null;
  imageUrl?: string | null;
  inStock: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <div className="group flex flex-col bg-white border border-line rounded overflow-hidden transition-all duration-250 hover:-translate-y-[5px] hover:shadow-card">
      <Link href={`/shop/${product.slug}`} className="block relative">
        <div className="aspect-[4/5] bg-cream overflow-hidden">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-50">
              🫙
            </div>
          )}
        </div>
        {product.onSale && (
          <span className="absolute top-3 left-3 bg-burgundy text-white text-[0.68rem] tracking-[0.1em] uppercase font-semibold py-1 px-2 rounded-full">
            Sale
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-ink/80 text-white text-[0.68rem] tracking-[0.08em] uppercase font-semibold py-1 px-2 rounded-full">
            Sold out
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-[18px]">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-[1.12rem] leading-snug mb-1 hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-sans font-semibold text-ink">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="font-sans text-muted text-sm line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          )}
        </div>
        {product.freeShipping && (
          <p className="text-[0.72rem] uppercase tracking-[0.1em] text-gold-dark font-semibold mb-3">
            Free Shipping
          </p>
        )}
        <div className="mt-auto">
          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
            }}
            inStock={product.inStock}
            variant="gold"
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
