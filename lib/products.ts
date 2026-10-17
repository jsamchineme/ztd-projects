import { prisma } from "./db";
import type { ProductCardData } from "@/components/shared/ProductCard";

const cardSelect = {
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
} as const;

export async function getBestSellers(limit = 4): Promise<ProductCardData[]> {
  return prisma.product.findMany({
    where: { published: true, bestSeller: true },
    orderBy: { order: "asc" },
    take: limit,
    select: cardSelect,
  });
}

export async function getSaleProducts(limit = 12): Promise<ProductCardData[]> {
  return prisma.product.findMany({
    where: { published: true, onSale: true },
    orderBy: { order: "asc" },
    take: limit,
    select: cardSelect,
  });
}

export interface ShopFilters {
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc";
}

export async function getShopProducts(filters: ShopFilters = {}): Promise<ProductCardData[]> {
  const orderBy =
    filters.sort === "price-asc"
      ? { priceCents: "asc" as const }
      : filters.sort === "price-desc"
        ? { priceCents: "desc" as const }
        : { order: "asc" as const };

  return prisma.product.findMany({
    where: {
      published: true,
      ...(filters.category && filters.category !== "all"
        ? filters.category === "most-popular"
          ? { bestSeller: true }
          : { category: { slug: filters.category } }
        : {}),
    },
    orderBy,
    select: cardSelect,
  });
}
