import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionRenderer } from "@/components/shared/SectionRenderer";
import { getPageSections } from "@/lib/sections";
import { buildSectionContext } from "@/lib/page-data";

export const revalidate = 60;

// Reserved paths handled by their own route files.
const RESERVED = new Set(["shop", "cart", "dk-show", "blog", "admin", "api"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageSections(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription ?? undefined,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const page = await getPageSections(slug);
  if (!page) notFound();

  const context = await buildSectionContext(page.sections);

  return <SectionRenderer sections={page.sections} context={context} />;
}
