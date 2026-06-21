"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X, ChevronDown, Egg, DollarSign, Building2, Brain, FileText, Smartphone, ArrowRight, MessageCircle, TrendingUp, ShieldCheck } from "lucide-react";

function useTouch() {
  const [isTouch, setTouch] = useState(true);
  useEffect(() => { setTouch(false); }, []);
  return isTouch;
}

const iconMap: Record<string, React.ReactNode> = {
  egg: <Egg className="w-6 h-6" />,
  money: <DollarSign className="w-6 h-6" />,
  barn: <Building2 className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  report: <FileText className="w-6 h-6" />,
  mobile: <Smartphone className="w-6 h-6" />,
};

export default function LandingPage() {
  const t = useTranslations();
  const isTouch = useTouch();
  const [navOpen, setNavOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-emerald-950 text-stone-100">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-950/80 backdrop-blur-lg border-b border-emerald-800/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="text-lg font-bold text-teal-300">AveGestoria</span>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-stone-400 hover:text-teal-300 transition-colors">{t('solution.title')}</a>
            <a href="#pricing" className="text-stone-400 hover:text-teal-300 transition-colors">Precios</a>
            <Link href="/es/demo" className="text-stone-400 hover:text-teal-300 transition-colors">{t('nav.demo')}</Link>
            <Link href="/es/auth/login" className="text-stone-400 hover:text-teal-300 transition-colors">{t('nav.login')}</Link>
            <Link href="/es/auth/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
              {t('hero.cta')}
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-emerald-900/90 backdrop-blur-lg border-t border-emerald-800/40 overflow-hidden">
              <div className="px-4 py-4 flex flex-col gap-3 text-sm">
                <a href="#features" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">{t('solution.title')}</a>
                <a href="#pricing" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Precios</a>
                <Link href="/es/demo" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">{t('nav.demo')}</Link>
                <Link href="/es/auth/login" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">{t('nav.login')}</Link>
                <Link href="/es/auth/register" onClick={() => setNavOpen(false)} className="bg-emerald-600 text-white px-4 py-3 rounded-lg text-center font-medium">{t('hero.cta')}</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800/30 via-emerald-950 to-emerald-950" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-emerald-800/40 border border-emerald-700/40 rounded-full px-4 py-1.5 text-xs sm:text-sm text-teal-300 mb-6">
                <TrendingUp className="w-4 h-4" />
                {t('hero.social_proof')}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 text-stone-100">
                {t('hero.headline')}
              </h1>
              <h2 className="text-xl sm:text-2xl text-amber-400 font-semibold mb-4">
                {t('hero.subheadline')}
              </h2>
              <p className="text-base sm:text-lg text-stone-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/es/auth/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-900/40">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/es/demo" className="border border-emerald-700 hover:border-emerald-500 text-stone-300 px-8 py-3.5 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t('nav.demo')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Pain Points ── */}
        <section className="py-20 sm:py-28 border-t border-emerald-800/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-stone-100">
                {t('pain.title')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {((t.raw('pain.items') as string[]) || []).map((item: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-emerald-900/40 border border-emerald-800/40 rounded-xl p-5 flex items-start gap-3">
                    <span className="text-amber-400 text-xl shrink-0">!</span>
                    <p className="text-stone-300 text-sm sm:text-base">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Solution / Features ── */}
        <section id="features" className="py-20 sm:py-28 bg-emerald-900/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-stone-100">
                {t('features.title')}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {((t.raw('features.items') as any[]) || []).map((item: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95, y: 60 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-6 hover:border-emerald-600/40 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-emerald-800/50 flex items-center justify-center text-teal-300 mb-4 group-hover:bg-emerald-700/50 transition-colors">
                      {iconMap[item.icon] || <Egg className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-semibold text-stone-100 mb-2">{item.title}</h3>
                    <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-20 sm:py-28 border-t border-emerald-800/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-stone-100">{t('pricing.title')}</h2>
              <p className="text-stone-400 mb-12">{t('pricing.subtitle')}</p>
              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {(['esencial', 'profesional'] as const).map((plan) => {
                  const p = t.raw(`pricing.plans.${plan}`) as any;
                  return (
                    <motion.div key={plan} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className={`rounded-2xl p-6 sm:p-8 text-left border ${plan === 'profesional' ? 'bg-emerald-800/30 border-emerald-500/50 ring-1 ring-emerald-500/20' : 'bg-emerald-900/30 border-emerald-800/30'}`}>
                      <h3 className="text-xl font-bold text-stone-100 mb-1">{p.name}</h3>
                      <p className="text-sm text-stone-400 mb-4">{p.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-stone-100">${p.price}</span>
                        <span className="text-stone-400 text-sm">/mes</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {(p.features as string[]).map((f: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-stone-300">
                            <span className="text-emerald-400 mt-0.5 shrink-0">&#10003;</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href="/es/auth/register" className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${plan === 'profesional' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30' : 'border border-emerald-700 hover:border-emerald-500 text-stone-300'}`}>
                        {t('pricing.cta')}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-xs text-stone-500 mt-6">{t('pricing.guarantee')}</p>
            </motion.div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 sm:py-28 bg-emerald-900/20 border-t border-emerald-800/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-stone-100">{t('testimonials.title')}</h2>
              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                {((t.raw('testimonials.items') as any[]) || []).map((item: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="bg-emerald-900/40 border border-emerald-800/30 rounded-xl p-6">
                    <p className="text-sm text-stone-300 leading-relaxed mb-4 italic">{item.text}</p>
                    <div>
                      <p className="text-sm font-semibold text-stone-100">{item.name}</p>
                      <p className="text-xs text-stone-500">{item.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
                {((t.raw('testimonials.stats') as any[]) || []).map((stat: any, i: number) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-teal-300">{stat.value}</p>
                    <p className="text-xs text-stone-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-stone-100">{t('faq.title')}</h2>
              <div className="space-y-3">
                {((t.raw('faq.items') as any[]) || []).map((item: any, i: number) => (
                  <div key={i} className="border border-emerald-800/30 rounded-xl overflow-hidden">
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-medium text-stone-200 hover:bg-emerald-900/30 transition-colors">
                      {item.q}
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {faqOpen === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-stone-400 leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 sm:py-28 bg-emerald-900/20 border-t border-emerald-800/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-stone-100">{t('cta_final.title')}</h2>
              <p className="text-stone-400 mb-8 max-w-xl mx-auto">{t('cta_final.subtitle')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/es/auth/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-emerald-900/40">
                  {t('cta_final.cta')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/es/demo" className="border border-emerald-700 hover:border-emerald-500 text-stone-300 px-8 py-3.5 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  {t('cta_final.guarantee')}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-emerald-800/40 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; 2026 AveGestoria. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-stone-300 transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-stone-300 transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
