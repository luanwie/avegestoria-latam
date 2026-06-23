import { getAllPosts } from "@/content/blog/posts";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-bg-primary text-stone-100">
      {/* Simple Nav */}
      <nav className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/es" className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="h-7 w-7" />
            <span className="text-sm font-bold text-brand-gold">AveGestoria</span>
          </Link>
          <Link href="/es" className="text-xs text-stone-400 hover:text-stone-200 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-widest text-brand-gold/70 font-semibold mb-3">Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-100 mb-4">
            Gestión Avícola Inteligente
          </h1>
          <p className="text-sm text-stone-400 leading-relaxed max-w-xl">
            Artículos para productores de huevo que quieren más control, más rentabilidad y menos papel. 
            Escrito por Luan, productor avícola y fundador de AveGestoria.
          </p>
        </div>

        {/* Article List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/es/blog/${post.slug}`}
              className="block bg-brand-green/15 border border-brand-green/30 rounded-xl p-6 hover:bg-brand-green/20 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
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

              <h2 className="text-lg font-bold text-stone-100 mb-2 group-hover:text-brand-gold transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed mb-3">
                {post.description}
              </p>

              <span className="inline-flex items-center gap-1 text-xs text-brand-gold group-hover:gap-2 transition-all">
                Leer artículo
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>

        {/* SEO: schema.org Blog markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "Blog de AveGestoria — Gestión Avícola Inteligente",
              description:
                "Artículos sobre gestión financiera, producción y tecnología para granjas de gallinas ponedoras en Latinoamérica.",
              url: "https://avegestoria.vercel.app/es/blog",
              author: {
                "@type": "Person",
                name: "Luan",
              },
              blogPost: posts.map((p) => ({
                "@type": "BlogPosting",
                headline: p.title,
                description: p.description,
                datePublished: p.date,
                url: `https://avegestoria.vercel.app/es/blog/${p.slug}`,
                keywords: p.keywords.join(", "),
              })),
            }),
          }}
        />
      </main>
    </div>
  );
}
