import { getPostBySlug, getAllSlugs } from "@/content/blog/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-bg-primary text-stone-100 p-10">
      <Link href="/es/blog" className="text-xs text-stone-400">← Blog</Link>
      <h1 className="text-2xl font-bold text-stone-100 mt-4">{post.title}</h1>
      <p className="text-sm text-stone-400 mt-2">{post.description}</p>
      <div className="mt-6 text-sm text-stone-300 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>
    </div>
  );
}
