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
  sort?: string; // featured | newest | price-asc | price-desc | name-asc | name-desc
  q?: string;
  minCents?: number;
  maxCents?: number;
}

const SORTS: Record<string, Record<string, "asc" | "desc">> = {
  newest: { createdAt: "desc" },
  "price-asc": { priceCents: "asc" },
  "price-desc": { priceCents: "desc" },
  "name-asc": { name: "asc" },
  "name-desc": { name: "desc" },
};

export async function getShopProducts(filters: ShopFilters = {}): Promise<ProductCardData[]> {
  const { category, sort, q, minCents, maxCents } = filters;
  return prisma.product.findMany({
    where: {
      published: true,
      ...(category && category !== "all"
        ? category === "most-popular"
          ? { bestSeller: true }
          : { category: { slug: category } }
        : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      ...(minCents != null || maxCents != null
        ? { priceCents: { ...(minCents != null ? { gte: minCents } : {}), ...(maxCents != null ? { lte: maxCents } : {}) } }
        : {}),
    },
    orderBy: SORTS[sort ?? ""] ?? { order: "asc" },
    select: cardSelect,
  });
}

/** Lowest and highest catalog price, for the shop's price filter. */
export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const r = await prisma.product.aggregate({ where: { published: true }, _min: { priceCents: true }, _max: { priceCents: true } });
  return { min: r._min.priceCents ?? 0, max: r._max.priceCents ?? 0 };
}
