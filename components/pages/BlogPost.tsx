import Link from "next/link";
import { postDate, readMinutes } from "@/lib/blog";

interface Post {
  title: string;
  author: string | null;
  createdAt: Date;
  body: string | null;
}

// Blog post laid out like the live Wix post page.
export function BlogPost({ post }: { post: Post }) {
  return (
    <div className="mx-auto max-w-[940px] px-4 lg:px-0 pt-[28px] pb-[110px]">
      <Link href="/blog" className="font-sans font-light text-[17px] hover:text-green">
        All Posts
      </Link>
      <article className="mt-[60px] border border-line bg-white px-6 lg:px-[100px] py-[50px]">
        <div className="flex items-center gap-3 font-sans text-[14px]">
          <span className="w-8 h-8 rounded-[50%] bg-green text-white flex items-center justify-center text-[13px]">
            {(post.author ?? "D").charAt(0)}
          </span>
          <span>{post.author}</span>
          <span className="text-muted">{postDate(post.createdAt)}</span>
          <span className="text-muted">{readMinutes(post.body)} min read</span>
        </div>
        <h1 className="mt-8 font-sans font-bold text-[30px] lg:text-[40px] leading-[1.2]">{post.title}</h1>
        {post.body && (
          <div
            className="mt-10 font-sans font-light text-[18px] leading-[1.6] space-y-7 [&_img]:w-full [&_img]:h-auto [&_strong]:font-bold [&_em]:italic [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        )}
      </article>
    </div>
  );
}
