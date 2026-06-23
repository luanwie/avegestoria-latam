import { getPostBySlug, getAllSlugs } from "@/content/blog/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | AveGestoria Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://avegestoria.vercel.app/es/blog/${post.slug}`,
    },
  };
}

function renderMarkdown(md: string): string {
  // Simple conversion: split by double-newline, wrap in <p>, handle headers
  const blocks = md.split(/\n\n+/);
  return blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';

    // ### headers (check BEFORE ##)
    const h3Match = trimmed.match(/^### (.+)$/);
    if (h3Match) return '<h3 class="text-lg font-bold text-stone-100 mt-8 mb-3">' + h3Match[1] + '</h3>';

    // ## headers
    const h2Match = trimmed.match(/^## (.+)$/);
    if (h2Match) return '<h2 class="text-xl font-bold text-stone-100 mt-10 mb-4">' + h2Match[1] + '</h2>';

    // Code blocks (inline)
    if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
      return '<pre class="bg-brand-green/20 border border-brand-green/30 rounded-lg p-4 my-4 overflow-x-auto text-xs text-stone-300 font-mono leading-relaxed">' +
        trimmed.replace(/`/g, '') + '</pre>';
    }

    // Ordered list items
    const listMatch = trimmed.match(/^(\d+)\. (.+)$/);
    if (listMatch) {
      return '<li class="ml-4 mb-1"><span class="text-stone-200 font-medium">' + listMatch[1] + '.</span> ' + listMatch[2] + '</li>';
    }

    // Bold inline
    const withBold = trimmed.replace(/\*\*(.+?)\*\*/g,
      '<strong class="text-stone-200 font-semibold">$1</strong>'
    );

    // Wrap in <p>
    return '<p class="text-sm text-stone-400 leading-relaxed mb-4">' + withBold + '</p>';
  }).join('\n');
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

  const htmlContent = renderMarkdown(post.content);

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article content */}
          <article className="flex-1 min-w-0">
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
          </article>

          {/* Sidebar CTA */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-5">
                <p className="text-sm font-bold text-stone-100 mb-2">
                  ¿Listo para tener control total?
                </p>
                <p className="text-xs text-stone-400 leading-relaxed mb-4">
                  Prueba AveGestoria 7 días gratis. Sin compromiso. Sin tarjeta por adelantado.
                </p>
                <Link
                  href="/es/prices"
                  className="block text-center bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
                >
                  Comenzar gratis →
                </Link>
              </div>

              <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-5">
                <p className="text-xs text-stone-300 font-medium mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-brand-gold" />
                  ¿Prefieres hablar?
                </p>
                <p className="text-[10px] text-stone-500 mb-3">
                  Escríbeme por WhatsApp. Te respondo personalmente.
                </p>
                <a
                  href="https://wa.me/5551993612092"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center border border-emerald-600/30 hover:bg-emerald-800/20 text-emerald-400 font-medium px-4 py-2 rounded-xl text-xs transition-all"
                >
                  WhatsApp → +55 51 99361-2092
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
