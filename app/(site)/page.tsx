import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/shared/SectionRenderer";
import { getPageSections } from "@/lib/sections";
import { buildSectionContext } from "@/lib/page-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await getPageSections("home");
  if (!page) notFound();

  const context = await buildSectionContext(page.sections);

  return <SectionRenderer sections={page.sections} context={context} />;
}
