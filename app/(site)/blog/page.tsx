import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { postDate, readMinutes } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "What's new, recipes & more from Debb's Kitchen.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[940px] px-4 lg:px-0 pt-[50px] pb-[110px]">
      <h1 className="text-center font-sans font-bold text-[34px] lg:text-[40px]">BLOG</h1>
      <p className="mt-2 text-center font-sans font-light text-[17px] tracking-[0.05em]">What&apos;s new, Recipes &amp; More...</p>

      <p className="mt-[60px] font-sans font-light text-[17px] text-gold">All Posts</p>

      <div className="mt-[40px] space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-line bg-white grid md:grid-cols-[454px_1fr]">
            <Link href={`/post/${post.slug}`} className="block aspect-[454/341] bg-cream overflow-hidden">
              {post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              )}
            </Link>
            <div className="p-6 lg:p-8 flex flex-col">
              <div className="flex items-center gap-3 font-sans text-[12px]">
                <span className="w-8 h-8 rounded-[50%] bg-green text-white flex items-center justify-center text-[13px]">
                  {(post.author ?? "D").charAt(0)}
                </span>
                <span>
                  {post.author}
                  <span className="block text-muted">
                    {postDate(post.createdAt)} · {readMinutes(post.body)} min read
                  </span>
                </span>
              </div>
              <Link href={`/post/${post.slug}`} className="mt-5 font-sans font-bold text-[24px] lg:text-[28px] leading-[1.25] hover:text-green">
                {post.title}
              </Link>
              {post.excerpt && <p className="mt-4 font-sans font-light text-[16px] leading-[1.6]">{post.excerpt}</p>}
            </div>
          </article>
        ))}
        {posts.length === 0 && <p className="text-muted">No posts yet.</p>}
      </div>
    </div>
  );
}
