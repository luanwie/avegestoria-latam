import { getPostBySlug, getAllSlugs } from "@/content/blog/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";

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

  if (!post) {
    notFound();
  }

  // Simple markdown-to-HTML conversion for the blog content
  const htmlContent = post.content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-stone-100 mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-stone-100 mt-10 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-stone-200 font-semibold">$1</strong>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-brand-green/20 border border-brand-green/30 rounded-lg p-4 my-4 overflow-x-auto text-xs text-stone-300 font-mono leading-relaxed">$1</pre>')
    // Ordered lists
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1"><span class="text-stone-200 font-medium">$1.</span> $2</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="text-sm text-stone-400 leading-relaxed mb-4">')
    // Wrap in paragraph
    .replace(/^/, '<p class="text-sm text-stone-400 leading-relaxed mb-4">')
    + '</p>';

  return (
    <div className="min-h-screen bg-bg-primary text-stone-100">
      {/* Schema.org Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Person", name: "Luan" },
            url: `https://avegestoria.vercel.app/es/blog/${post.slug}`,
            keywords: post.keywords.join(", "),
            articleBody: post.content.substring(0, 500),
          }),
        }}
      />

      <nav className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/es" className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="h-7 w-7" />
            <span className="text-sm font-bold text-brand-gold">AveGestoria</span>
          </Link>
          <Link href="/es/blog" className="text-xs text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            Blog
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <article>
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full border border-brand-gold/20 font-medium">
                {post.category}
              </span>
              <span className="text-[10px] text-stone-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-sm text-stone-400 leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Content */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* CTA */}
          <div className="mt-12 bg-brand-green/20 border border-brand-green/30 rounded-xl p-6 text-center">
            <p className="text-sm text-stone-300 font-medium mb-2">
              ¿Listo para tener control total de tu granja?
            </p>
            <p className="text-xs text-stone-500 mb-4">
              Prueba AveGestoria 7 días gratis. Sin compromiso.
            </p>
            <Link
              href="/es/prices"
              className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Comenzar 7 días gratis →
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
