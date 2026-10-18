import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const select = { id: true, slug: true, name: true, description: true, imageUrl: true } as const;

// Live search for the header. Empty query returns "Trending Products"
// (the best sellers); otherwise matches name or description.
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (!q) {
    const products = await prisma.product.findMany({
      where: { published: true, bestSeller: true },
      orderBy: { order: "asc" },
      take: 4,
      select,
    });
    return NextResponse.json({ trending: true, products });
  }

  // Name matches first, then products that only mention the term in their
  // description (e.g. "salt" → Pink Salt before every "Salt Free!" blend).
  const byName = await prisma.product.findMany({
    where: { published: true, name: { contains: q, mode: "insensitive" } },
    orderBy: { order: "asc" },
    take: 8,
    select,
  });
  const byDescription = await prisma.product.findMany({
    where: {
      published: true,
      id: { notIn: byName.map((p) => p.id) },
      description: { contains: q, mode: "insensitive" },
    },
    orderBy: { order: "asc" },
    take: 8 - byName.length,
    select,
  });
  const products = [...byName, ...byDescription];
  return NextResponse.json({ trending: false, products });
}
