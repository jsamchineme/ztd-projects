import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Recipes, guides and kitchen notes from Debb's Kitchen.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-cream">
        <div className="wrap py-[56px] text-center">
          <div className="font-sans text-[0.74rem] tracking-[0.2em] uppercase text-gold-dark font-semibold mb-3">
            Kitchen Notes
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,3.4rem)]">The Blog</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="wrap grid gap-[28px] md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-line rounded overflow-hidden hover:-translate-y-[4px] hover:shadow-card transition-all"
            >
              <div className="aspect-[16/10] bg-cream overflow-hidden flex items-center justify-center">
                {post.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-5xl opacity-50">📝</span>
                )}
              </div>
              <div className="p-6">
                {post.category && (
                  <p className="text-gold-dark text-[0.72rem] tracking-[0.12em] uppercase font-semibold mb-2">
                    {post.category}
                  </p>
                )}
                <h3 className="text-[1.3rem] mb-2 group-hover:text-burgundy transition-colors">{post.title}</h3>
                {post.excerpt && <p className="text-muted text-[0.95rem] mb-3">{post.excerpt}</p>}
                <p className="text-[0.82rem] text-muted">{formatDate(post.createdAt)}</p>
              </div>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-muted">No posts yet.</p>}
        </div>
      </section>
    </>
  );
}
