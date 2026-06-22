"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight, ShieldCheck, TrendingUp, Brain, Egg, BarChart3, Bell, MessageCircle, Check, Star, Zap, Sparkles, Target, DollarSign } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";
import Hero3D from "@/components/ui/Hero3D";
import TiltCard from "@/components/ui/TiltCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

function useTouch() {
  const [isTouch, setTouch] = useState(true);
  useState(() => setTouch(typeof window !== "undefined" && window.matchMedia("(hover: none)").matches));
  return isTouch;
}

const features = [
  { icon: Egg, title: "Control de Producción", desc: "Registro diario por lote, tasa de postura y gráficos en tiempo real. Detecta caídas antes de que afecten tus ingresos." },
  { icon: DollarSign, title: "Gestión Financiera", desc: "Ingresos, gastos y rentabilidad real por lote. Descubre cuánto estás ganando o perdiendo con cada lote." },
  { icon: BarChart3, title: "Galpones y Lotes", desc: "Múltiples galpones, razas, edades y desempeño individual. Control total desde un solo lugar." },
  { icon: Brain, title: "IA para tu Granja", desc: "Chat inteligente con tus datos reales. Pregunta en lenguaje natural y obtén respuestas inmediatas." },
  { icon: Bell, title: "Alertas Inteligentes", desc: "Notificaciones cuando algo requiere atención: mortalidad alta, producción baja, vacunaciones." },
  { icon: Target, title: "Predicciones", desc: "Proyección de producción a 30 días basada en tus datos históricos. Anticipa costos." },
];

const plans = [
  {
    id: "esencial", name: "Esencial", price: "9.99", desc: "Gestión completa para empezar", popular: false,
    features: ["Gestión de lotes y galpones", "Control de producción", "Gestión financiera", "Informes PDF y Excel", "Hasta 3 colaboradores"],
  },
  {
    id: "profesional", name: "Profesional", price: "19.99", desc: "Todo el poder de la IA", popular: true,
    features: ["Todo del plan Esencial", "Chat inteligente con IA", "Predicciones de producción", "Alertas inteligentes", "Colaboradores ilimitados"],
  },
];

const faqs = [
  { q: "¿Necesito internet?", a: "Funciona offline y sincroniza cuando tengas conexión. Ideal para zonas rurales." },
  { q: "¿Es difícil de usar?", a: "Hecho para productores. Si usas WhatsApp, puedes usar AveGestoria." },
  { q: "¿Puedo probar antes?", a: "7 días gratis con cobro de $1 de activación. Cancela cuando quieras." },
  { q: "¿Mis datos están seguros?", a: "Cifrado de extremo a extremo, backups automáticos diarios." },
  { q: "¿Aceptan pagos de mi país?", a: "Stripe. Colombia, Chile, Argentina, México, Perú y Uruguay." },
  { q: "¿Puedo cancelar?", a: "Sí, con un clic. Sin multas, sin burocracia." },
];

export default function LandingPage() {
  const isTouch = useTouch();
  const [navOpen, setNavOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-brand-green-deeper text-stone-100">
      <ParticleField />

      {/* ── Nav ── */}
      <GlassCard className="fixed top-0 left-0 right-0 z-50 bg-brand-green-deeper/80 backdrop-blur-2xl border-b border-brand-green/30 rounded-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/es" className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="h-8 w-8" />
            <span className="text-base font-bold text-brand-gold tracking-tight">AveGestoria</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-stone-400 hover:text-brand-gold transition-colors">Funcionalidades</a>
            <a href="#ia" className="text-stone-400 hover:text-brand-gold transition-colors">IA</a>
            <a href="#pricing" className="text-stone-400 hover:text-brand-gold transition-colors">Precios</a>
            <Link href="/es/demo" className="text-stone-400 hover:text-brand-gold transition-colors">Demo</Link>
            <Link href="/es/auth/login" className="text-stone-400 hover:text-brand-gold transition-colors">Entrar</Link>
            <Link href="/es/prices" className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-lg shadow-brand-gold/20">
              Probar gratis
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-brand-green-dark/90 backdrop-blur-lg border-t border-brand-green/30 overflow-hidden">
              <div className="px-4 py-4 flex flex-col gap-3 text-sm">
                <a href="#features" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Funcionalidades</a>
                <a href="#ia" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">IA</a>
                <a href="#pricing" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Precios</a>
                <Link href="/es/demo" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Demo</Link>
                <Link href="/es/auth/login" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Entrar</Link>
                <Link href="/es/prices" onClick={() => setNavOpen(false)} className="bg-brand-gold text-brand-green-deeper font-bold px-4 py-3 rounded-lg text-center">Probar gratis</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      <main>
        {/* ── Hero ── */}
        <Hero3D>
          <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green/30 via-brand-green-deeper to-brand-green-deeper" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center z-10">
              <motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-brand-green/40 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs sm:text-sm text-brand-gold mb-6"
                >
                  <TrendingUp className="w-4 h-4" />
                  +500 productores ya transformaron su gestión
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] mb-4 text-stone-100"
                >
                  ¿Sigues controlando tu granja <br />
                  <span className="text-brand-gold">en papel?</span>
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-xl sm:text-2xl text-brand-gold/90 font-semibold mb-4"
                >
                  Descubre cuánto dinero estás perdiendo sin saberlo
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-base sm:text-lg text-stone-400 max-w-2xl mx-auto mb-8 leading-relaxed"
                >
                  AveGestoria te muestra en tiempo real la rentabilidad de cada lote — desde tu celular.
                  Sin planillas, sin papeles, sin conjeturas.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link href="/es/prices" className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-3.5 rounded-xl text-base transition-all inline-flex items-center gap-2 shadow-lg shadow-brand-gold/25 group">
                    Probar gratis por 7 días
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/es/demo" className="border border-brand-green hover:border-brand-gold/50 text-stone-300 px-8 py-3.5 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Ver Demo
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-xs text-stone-600 mt-4"
                >
                  Sin compromiso. $1 de activación + 7 días gratis 🇨🇴 🇨🇱 🇦🇷
                </motion.p>
              </motion.div>
            </div>
          </section>
        </Hero3D>

        {/* ── Pain Points ── */}
        <section className="py-20 sm:py-28 border-t border-brand-green/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">¿Te identificas?</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Duele más de lo que parece</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "No sabes si estás ganando o perdiendo en cada lote",
                  "Tus datos están mezclados en papeles y WhatsApp",
                  "Pierdes horas calculando lo que debería ser automático",
                  "No tienes visibilidad de tu producción en tiempo real",
                  "Los costos se escapan sin que te des cuenta",
                  "Tu banco te pide reportes que no sabes cómo generar",
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.06} direction={i % 2 === 0 ? "left" : "right"}>
                    <GlassCard className="bg-brand-green/20 p-5 border-brand-green/30">
                      <div className="flex items-start gap-3">
                        <span className="text-brand-gold text-xl shrink-0 mt-0.5">!</span>
                        <p className="text-stone-300 text-sm sm:text-base">{item}</p>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-20 sm:py-28 bg-brand-green-dark/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Solución</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Tu granja en el bolsillo</h2>
                <p className="text-stone-400 mt-3 max-w-xl mx-auto">Cada herramienta que necesitas con datos reales, no con corazonadas.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.07}>
                    <TiltCard maxTilt={6} scale={1.03} className="bg-brand-green/15 border border-brand-green/30 rounded-xl p-6 h-full">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-brand-green/30 flex items-center justify-center text-brand-gold mb-4"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <item.icon className="w-6 h-6" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-stone-100 mb-2">{item.title}</h3>
                      <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── IA Section ── */}
        <section id="ia" className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 via-transparent to-brand-gold/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[150px] pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs sm:text-sm text-brand-gold font-semibold mb-4"
                >
                  <Sparkles className="w-4 h-4" />
                  Inteligencia Artificial
                </motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100">
                  Una IA que <span className="text-brand-gold">conoce tu granja</span>
                </h2>
                <p className="text-stone-400 mt-3 max-w-2xl mx-auto">
                  No es un chat genérico. Entrenada con tus datos reales de producción, ventas y costos.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
                <ScrollReveal direction="left">
                  <TiltCard maxTilt={4} scale={1.02} className="bg-brand-green/20 border border-brand-gold/30 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-6 h-6 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-stone-100">Chat con tus datos</h3>
                        <p className="text-sm text-stone-400">Lenguaje natural, como hablar con un asesor</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { q: "¿Cuántos huevos produjimos ayer?", r: "5.234 huevos. Lote A: 3.120 · Lote B: 2.114." },
                        { q: "¿Cuál es mi lucro del mes?", r: "Lucro neto: $1,234. Ingresos: $4,567 · Gastos: $3,333." },
                        { q: "¿Qué lote tiene mejor rendimiento?", r: "Lote C (Dekalb White): 91.5% de postura." },
                      ].map((ex, i) => (
                        <div key={i} className="bg-brand-green-dark/50 border border-brand-green/30 rounded-xl p-4">
                          <p className="text-xs text-stone-500 mb-1">Tú:</p>
                          <p className="text-sm text-stone-200 mb-2">{ex.q}</p>
                          <p className="text-xs text-brand-gold/80 mb-1">AveGestoria:</p>
                          <p className="text-sm text-stone-300">{ex.r}</p>
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                </ScrollReveal>

                <div className="space-y-6">
                  {[
                    { icon: BarChart3, title: "Predicciones", desc: "Proyección a 30 días basada en tus datos históricos." },
                    { icon: Bell, title: "Alertas", desc: "Mortalidad alta, producción baja, vacunaciones pendientes." },
                    { icon: TrendingUp, title: "Tendencias", desc: "¿Tu producción sube o baja? La IA monitorea." },
                  ].map((item, i) => (
                    <ScrollReveal key={i} delay={i * 0.1} direction="right">
                      <TiltCard maxTilt={3} className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <item.icon className="w-5 h-5 text-brand-gold" />
                          <h3 className="text-base font-semibold text-stone-100">{item.title}</h3>
                        </div>
                        <p className="text-sm text-stone-400">{item.desc}</p>
                      </TiltCard>
                    </ScrollReveal>
                  ))}
                  <Link href="/es/prices" className="block w-full bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold text-center py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20">
                    Activar IA ahora
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Numbers ── */}
        <section className="py-16 border-t border-brand-green/30 bg-brand-green-dark/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up">
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: 500, suffix: "+", label: "Productores Activos" },
                  { value: 30, suffix: "%", prefix: "+", label: "Aumento en Rentabilidad" },
                  { value: 5, suffix: "h/sem", label: "Tiempo Ahorrado" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                      <AnimatedCounter
                        from={0}
                        to={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        className="text-3xl sm:text-4xl font-bold text-brand-gold"
                      />
                      <p className="text-xs sm:text-sm text-stone-500 mt-1">{stat.label}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal direction="up">
              <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Precios</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-2 text-stone-100">Invierte en el futuro de tu granja</h2>
              <p className="text-stone-400 mb-8">Empieza a ver resultados en 7 días</p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-5 py-3 mb-10"
              >
                <Zap className="w-5 h-5 text-brand-gold" />
                <span className="text-sm text-stone-200">
                  <span className="text-brand-gold font-bold">$1</span> de activación + <span className="text-brand-gold font-bold">7 días gratis</span> → después $9.99 o $19.99/mes
                </span>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {plans.map((plan, i) => (
                  <ScrollReveal key={plan.id} delay={i * 0.12}>
                    <TiltCard maxTilt={8} scale={1.03} className={`rounded-2xl p-6 sm:p-8 text-left border transition-all ${
                      plan.popular
                        ? "bg-brand-green/25 border-brand-gold/40 ring-1 ring-brand-gold/20"
                        : "bg-brand-green/15 border-brand-green/30"
                    }`}>
                      {plan.popular && (
                        <div className="inline-flex items-center gap-1 bg-brand-gold/15 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full mb-4 border border-brand-gold/30">
                          <Star className="w-3 h-3" /> MÁS POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-stone-100 mb-1">{plan.name}</h3>
                      <p className="text-sm text-stone-500 mb-4">{plan.desc}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-stone-100">${plan.price}</span>
                        <span className="text-stone-500 text-sm">/mes</span>
                        <p className="text-xs text-stone-600 mt-1">
                          o <strong className="text-stone-400">${(parseInt(plan.price) * 10).toFixed(2)}/año</strong> (17% desc.)
                        </p>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-stone-300">
                            <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/es/prices"
                        className={`block text-center py-3 rounded-xl text-sm font-bold transition-all ${
                          plan.popular
                            ? "bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper shadow-lg shadow-brand-gold/20"
                            : "border border-brand-green hover:border-brand-gold/50 text-stone-300"
                        }`}
                      >
                        Comenzar — $1
                      </Link>
                      <p className="text-[10px] text-stone-600 text-center mt-2">Garantía 7 días • Cancela cuando quieras</p>
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 sm:py-28 bg-brand-green-dark/30 border-t border-brand-green/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Casos Reales</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Productores que ya transformaron sus granjas</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { text: "AveGestoria revolucionó mi granja. Aumento del 25% en productividad y ahora sé exactamente mi ganancia por lote.", name: "Carlos M.", location: "Antioquia, Colombia" },
                  { text: "La IA me alertó de una caída en producción que no había notado. Ahorré miles.", name: "Ricardo G.", location: "Santiago, Chile" },
                  { text: "Puedo controlar producción, costos y ventas en un solo lugar. El chat IA es increíble.", name: "María L.", location: "Buenos Aires" },
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <TiltCard maxTilt={5} className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6">
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                        ))}
                      </div>
                      <p className="text-sm text-stone-300 leading-relaxed mb-4 italic">{item.text}</p>
                      <p className="text-sm font-semibold text-stone-100">{item.name}</p>
                      <p className="text-xs text-stone-500">{item.location}</p>
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">FAQ</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((item, i) => (
                  <GlassCard key={i} className="border-brand-green/30 bg-brand-green/10 overflow-hidden">
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-medium text-stone-200">
                      {item.q}
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-brand-gold ${faqOpen === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {faqOpen === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-stone-400 leading-relaxed">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 sm:py-28 bg-brand-green-dark/30 border-t border-brand-green/30 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/5 to-transparent" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <ScrollReveal direction="up">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-stone-100">No pierdas más dinero</h2>
              <p className="text-stone-400 mb-8 max-w-xl mx-auto">
                Cada día en papel es dinero que dejas de ganar. Tus competidores ya usan herramientas profesionales.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/es/prices" className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-3.5 rounded-xl text-base transition-all inline-flex items-center gap-2 shadow-lg shadow-brand-gold/25 group">
                  Comenzar ahora — $1
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/es/demo" className="border border-brand-green hover:border-brand-gold/50 text-stone-300 px-8 py-3.5 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Garantía total: tu riesgo es cero
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-brand-green/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <Link href="/es" className="flex items-center gap-2">
              <img src="/icon.png" alt="" className="h-7 w-7" />
              <span className="text-sm font-bold text-brand-gold">AveGestoria</span>
            </Link>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <Link href="/es/legal/terms" className="hover:text-stone-300 transition-colors">Términos</Link>
              <Link href="/es/legal/privacy" className="hover:text-stone-300 transition-colors">Privacidad</Link>
            </div>
          </div>
          <p className="text-xs text-stone-600 text-center">&copy; 2026 AveGestoria. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
