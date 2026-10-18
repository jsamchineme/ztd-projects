import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** CSV export of newsletter subscribers. */
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role === "AUTHOR") return new Response("Unauthorized", { status: 401 });
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "asc" } });
  const csv = ["email,signed_up", ...subs.map((s) => `"${s.email.replace(/"/g, '""')}",${s.createdAt.toISOString()}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
