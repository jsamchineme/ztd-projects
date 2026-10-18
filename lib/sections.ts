import { prisma } from "./db";

export interface Section {
  id: string;
  type: string;
  order: number;
  content: Record<string, unknown>;
}

/** Load and parse a CMS page's section array by slug. */
export async function getPageSections(slug: string): Promise<{
  title: string;
  metaDescription: string | null;
  sections: Section[];
} | null> {
  const page = await prisma.page.findUnique({ where: { slug } });
  // Unpublished pages are hidden (the home page always renders).
  if (!page || (!page.published && slug !== "home")) return null;

  let sections: Section[] = [];
  if (page.sections) {
    try {
      const parsed = JSON.parse(page.sections);
      if (Array.isArray(parsed)) sections = parsed;
    } catch {
      sections = [];
    }
  }
  return { title: page.title, metaDescription: page.metaDescription, sections };
}

/** Which dynamic data a page needs, inferred from its section types. */
export function neededData(sections: Section[]) {
  const types = new Set(sections.map((s) => s.type));
  return {
    bestSellers: types.has("bestSellers"),
    saleProducts: sections.some(
      (s) => s.type === "productGrid" && s.content?.filter === "onSale",
    ),
    gridProducts: types.has("productGrid"),
    stores: types.has("storeList"),
    featuredVideo: types.has("videoFeature"),
    testimonials: types.has("testimonials"),
    reviews: types.has("reviews"),
  };
}
