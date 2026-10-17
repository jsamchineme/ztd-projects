import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <article className="section-padding">
      <div className="wrap max-w-[760px]">
        <Link href="/blog" className="text-gold-dark text-sm hover:underline">← All posts</Link>
        {post.category && (
          <p className="text-gold-dark text-[0.72rem] tracking-[0.12em] uppercase font-semibold mt-6 mb-2">
            {post.category}
          </p>
        )}
        <h1 className="text-[clamp(2.2rem,4.5vw,3.2rem)] mb-3">{post.title}</h1>
        <p className="text-muted text-[0.9rem] mb-8">
          {post.author ? `${post.author} · ` : ""}
          {formatDate(post.createdAt)}
        </p>
        {post.imageUrl && (
          <div className="aspect-[16/9] rounded overflow-hidden mb-8 bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        {post.excerpt && <p className="text-[1.2rem] text-ink mb-6">{post.excerpt}</p>}
        {post.body && (
          <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />
        )}
      </div>
    </article>
  );
}
