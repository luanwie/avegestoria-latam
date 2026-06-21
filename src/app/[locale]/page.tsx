"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight, ShieldCheck, TrendingUp, Brain, Egg, BarChart3, Bell, MessageCircle, Check, Star, Users, DollarSign, Zap, Target, Sparkles } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";

function useTouch() {
  const [isTouch, setTouch] = useState(true);
  useEffect(() => { setTouch(false); }, []);
  return isTouch;
}

function ScrollReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

const features = [
  { icon: Egg, title: "Control de Producción", desc: "Registro diario por lote, tasa de postura y gráficos en tiempo real. Detecta caídas de producción antes de que afecten tus ingresos.", color: "emerald" },
  { icon: DollarSign, title: "Gestión Financiera", desc: "Ingresos, gastos y rentabilidad real por lote. Descubre cuánto estás ganando o perdiendo con cada lote.", color: "gold" },
  { icon: BarChart3, title: "Galpones y Lotes", desc: "Múltiples galpones, razas, edades y desempeño individual. Control total de tu operación desde un solo lugar.", color: "emerald" },
  { icon: Brain, title: "IA para tu Granja", desc: "Chat inteligente con tus datos reales. Pregunta en lenguaje natural: ¿cuánto produjimos ayer? ¿cuál es mi lucro del mes?", color: "gold" },
  { icon: Bell, title: "Alertas Inteligentes", desc: "Recibe notificaciones cuando algo requiere atención: mortalidad alta, producción baja, vacunaciones pendientes.", color: "emerald" },
  { icon: Target, title: "Predicciones", desc: "Proyección de producción a 30 días basada en tus datos históricos. Anticipa costos y planifica mejor.", color: "gold" },
];

const plans = [
  {
    id: "esencial",
    name: "Esencial",
    price: "9.99",
    desc: "Gestión completa para empezar",
    popular: false,
    features: [
      "Gestión de lotes y galpones",
      "Control de producción de huevos",
      "Gestión financiera completa",
      "Informes PDF y Excel",
      "Hasta 3 colaboradores",
    ],
  },
  {
    id: "profesional",
    name: "Profesional",
    price: "19.99",
    desc: "Todo el poder de la IA",
    popular: true,
    features: [
      "Todo del plan Esencial",
      "Chat inteligente con IA",
      "Predicciones de producción",
      "Alertas inteligentes",
      "Colaboradores ilimitados",
    ],
  },
];

const faqs = [
  { q: "¿Necesito internet para usar AveGestoria?", a: "Funciona offline y sincroniza cuando tengas conexión. Ideal para granjas en zonas rurales." },
  { q: "¿Es difícil de usar?", a: "Hecho para productores, no para ingenieros. En 5 minutos tienes tu primer lote registrado. Si usas WhatsApp, puedes usar AveGestoria." },
  { q: "¿Puedo probar antes de comprar?", a: "Sí. Solo USD 1 por los primeros 7 días. Sin compromiso. Cancela cuando quieras." },
  { q: "¿Mis datos están seguros?", a: "Cifrado de extremo a extremo, backups automáticos diarios y servidores seguros. Tus datos de producción son tuyos." },
  { q: "¿Aceptan pagos de mi país?", a: "Aceptamos tarjetas internacionales vía Stripe. Colombia, Chile, Argentina, México, Perú y Uruguay." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí, con un clic. Sin multas, sin preguntas, sin burocracia." },
];

export default function LandingPage() {
  const isTouch = useTouch();
  const [navOpen, setNavOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-brand-green-deeper text-stone-100">
      <ParticleField />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-green-deeper/80 backdrop-blur-lg border-b border-brand-green/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/es" className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="h-8 w-8" />
            <span className="text-base font-bold text-brand-gold tracking-tight">AveGestoria</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="text-stone-400 hover:text-brand-gold transition-colors">Funcionalidades</a>
            <a href="#ia" className="text-stone-400 hover:text-brand-gold transition-colors">IA</a>
            <a href="#pricing" className="text-stone-400 hover:text-brand-gold transition-colors">Precios</a>
            <Link href="/es/demo" className="text-stone-400 hover:text-brand-gold transition-colors">Ver Demo</Link>
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
                <Link href="/es/demo" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Ver Demo</Link>
                <Link href="/es/auth/login" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Entrar</Link>
                <Link href="/es/prices" onClick={() => setNavOpen(false)} className="bg-brand-gold text-brand-green-deeper font-bold px-4 py-3 rounded-lg text-center">Probar gratis</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green/30 via-brand-green-deeper to-brand-green-deeper" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="inline-flex items-center gap-2 bg-brand-green/40 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs sm:text-sm text-brand-gold mb-6">
                <TrendingUp className="w-4 h-4" />
                +500 productores ya transformaron su gestión
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] mb-4 text-stone-100">
                ¿Sigues controlando tu granja <br />
                <span className="text-brand-gold">en papel?</span>
              </h1>
              <h2 className="text-xl sm:text-2xl text-brand-gold/90 font-semibold mb-4">
                Descubre cuánto dinero estás perdiendo sin saberlo
              </h2>
              <p className="text-base sm:text-lg text-stone-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                AveGestoria te muestra en tiempo real la rentabilidad de cada lote — desde tu celular.
                Sin planillas, sin papeles, sin conjeturas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/es/prices" className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-3.5 rounded-xl text-base transition-all inline-flex items-center gap-2 shadow-lg shadow-brand-gold/25 group">
                  Probar gratis por 7 días
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/es/demo" className="border border-brand-green hover:border-brand-gold/50 text-stone-300 px-8 py-3.5 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2 gold-glow">
                  <MessageCircle className="w-5 h-5" />
                  Ver Demo
                </Link>
              </div>
              <p className="text-xs text-stone-600 mt-4">Sin compromiso. Cancela cuando quieras. 🇨🇴 🇨🇱 🇦🇷</p>
            </motion.div>
          </div>
        </section>

        {/* ── Pain Points ── */}
        <section className="py-20 sm:py-28 border-t border-brand-green/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-5 flex items-start gap-3 gold-glow"
                  >
                    <span className="text-brand-gold text-xl shrink-0 mt-0.5">!</span>
                    <p className="text-stone-300 text-sm sm:text-base">{item}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Solution / Features ── */}
        <section id="features" className="py-20 sm:py-28 bg-brand-green-dark/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Solución</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Tu granja en el bolsillo</h2>
                <p className="text-stone-400 mt-3 max-w-xl mx-auto">Cada herramienta que necesitas para gestionar tu granja con datos reales, no con corazonadas.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((item, i) => (
                  <StaggerItem key={i} index={i}>
                    <div className={`bg-brand-green/15 border border-brand-green/30 rounded-xl p-6 gold-glow h-full transition-all duration-300`}>
                      <div className="w-12 h-12 rounded-lg bg-brand-green/30 flex items-center justify-center text-brand-gold mb-4">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-stone-100 mb-2">{item.title}</h3>
                      <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </StaggerItem>
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
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs sm:text-sm text-brand-gold font-semibold mb-4">
                  <Sparkles className="w-4 h-4" />
                  Inteligencia Artificial
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100">
                  Una IA que <span className="text-brand-gold">conoce tu granja</span>
                </h2>
                <p className="text-stone-400 mt-3 max-w-2xl mx-auto">
                  No es un chat genérico. Es una IA entrenada con tus datos reales de producción, ventas y costos. Pregunta lo que quieras saber.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-brand-green/20 border border-brand-gold/30 rounded-2xl p-6 sm:p-8 gold-glow"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-gold/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-100">Chat con tus datos</h3>
                      <p className="text-sm text-stone-400">En lenguaje natural, como si hablaras con un asesor</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { q: "¿Cuántos huevos produjimos ayer?", r: "Ayer se produjeron 5.234 huevos en total. El Lote A tuvo 3.120 y el Lote B 2.114." },
                      { q: "¿Cuál es mi lucro del mes?", r: "Tu lucro neto este mes es de $1,234.50. Ingresos: $4,567 · Gastos: $3,332.50" },
                      { q: "¿Qué lote tiene mejor rendimiento?", r: "El Lote C (Dekalb White) lidera con 91.5% de postura, vs 83.7% del promedio." },
                    ].map((ex, i) => (
                      <div key={i} className="bg-brand-green-dark/50 border border-brand-green/30 rounded-xl p-4">
                        <p className="text-xs text-stone-500 mb-1">Tú preguntas:</p>
                        <p className="text-sm text-stone-200 mb-2">{ex.q}</p>
                        <p className="text-xs text-brand-gold/80 mb-1">AveGestoria IA responde:</p>
                        <p className="text-sm text-stone-300">{ex.r}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="space-y-6"
                >
                  <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6 gold-glow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-green/30 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-5 h-5 text-brand-gold" />
                      </div>
                      <h3 className="text-base font-semibold text-stone-100">Predicciones precisas</h3>
                    </div>
                    <p className="text-sm text-stone-400">Proyección de producción a 30 días basada en tus datos históricos con regresión lineal. Anticipa picos y caídas.</p>
                  </div>

                  <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6 gold-glow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-green/30 flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-brand-gold" />
                      </div>
                      <h3 className="text-base font-semibold text-stone-100">Alertas inteligentes</h3>
                    </div>
                    <p className="text-sm text-stone-400">Mortalidad alta, producción por debajo de lo esperado, fechas de vacunación. La IA monitorea y te avisa.</p>
                  </div>

                  <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6 gold-glow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-green/30 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-brand-gold" />
                      </div>
                      <h3 className="text-base font-semibold text-stone-100">Tendencias y alertas</h3>
                    </div>
                    <p className="text-sm text-stone-400">Visualiza si tu producción está subiendo, bajando o estable. Toma decisiones antes de que sea tarde.</p>
                  </div>

                  <Link href="/es/prices" className="block w-full bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold text-center py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20">
                    Activar IA ahora
                  </Link>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Numbers ── */}
        <section className="py-16 border-t border-brand-green/30 bg-brand-green-dark/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "500+", label: "Productores Activos" },
                  { value: "+30%", label: "Aumento en Rentabilidad" },
                  { value: "5h/sem", label: "Tiempo Ahorrado" },
                ].map((stat, i) => (
                  <motion.div key={i} className="text-center" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal>
              <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Precios</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-2 text-stone-100">Invierte en el futuro de tu granja</h2>
              <p className="text-stone-400 mb-8">Empieza a ver resultados en 7 días</p>

              {/* Trial highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-5 py-3 mb-10 gold-glow"
              >
                <Zap className="w-5 h-5 text-brand-gold" />
                <span className="text-sm text-stone-200"><span className="text-brand-gold font-bold">USD 1.00</span> por los primeros 7 días — después elige tu plan</span>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {plans.map((plan, i) => (
                  <StaggerItem key={plan.id} index={i}>
                    <div className={`rounded-2xl p-6 sm:p-8 text-left border transition-all duration-300 ${
                      plan.popular
                        ? "bg-brand-green/25 border-brand-gold/40 ring-1 ring-brand-gold/20 gold-glow"
                        : "bg-brand-green/15 border-brand-green/30 gold-glow"
                    }`}>
                      {plan.popular && (
                        <div className="inline-flex items-center gap-1 bg-brand-gold/15 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full mb-4 border border-brand-gold/30">
                          <Star className="w-3 h-3" />
                          MÁS POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-stone-100 mb-1">{plan.name}</h3>
                      <p className="text-sm text-stone-500 mb-4">{plan.desc}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-stone-100">${plan.price}</span>
                        <span className="text-stone-500 text-sm">/mes</span>
                        <p className="text-xs text-stone-600 mt-1">
                          o <strong className="text-stone-400">$99.90/año</strong> (17% descuento)
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
                            : "border border-brand-green hover:border-brand-gold/50 text-stone-300 gold-glow"
                        }`}
                      >
                        Comenzar prueba — USD 1
                      </Link>
                      <p className="text-[10px] text-stone-600 text-center mt-2">Garantía de 7 días • Cancela cuando quieras</p>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 sm:py-28 bg-brand-green-dark/30 border-t border-brand-green/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Casos Reales</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Productores que ya transformaron sus granjas</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { text: "AveGestoria revolucionó mi granja. Aumento del 25% en productividad y ahora sé exactamente mi ganancia por lote.", name: "Carlos M.", location: "Antioquia, Colombia" },
                  { text: "La IA me alertó de una caída en producción que no había notado. Ahorré miles con la acción rápida.", name: "Ricardo G.", location: "Santiago, Chile" },
                  { text: "Finalmente puedo controlar producción, costos y ventas en un solo lugar. El chat IA es increíble.", name: "María L.", location: "Buenos Aires, Argentina" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6 gold-glow"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                      ))}
                    </div>
                    <p className="text-sm text-stone-300 leading-relaxed mb-4 italic">{item.text}</p>
                    <div>
                      <p className="text-sm font-semibold text-stone-100">{item.name}</p>
                      <p className="text-xs text-stone-500">{item.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">FAQ</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-stone-100">Preguntas Frecuentes</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((item, i) => (
                  <div key={i} className="border border-brand-green/30 rounded-xl overflow-hidden gold-glow">
                    <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-medium text-stone-200 hover:bg-brand-green/20 transition-colors">
                      {item.q}
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''} text-brand-gold`} />
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
            </ScrollReveal>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 sm:py-28 bg-brand-green-dark/30 border-t border-brand-green/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-stone-100">No pierdas más dinero</h2>
              <p className="text-stone-400 mb-8 max-w-xl mx-auto">
                Cada día que controlas tu granja en papel es dinero que estás dejando de ganar.
                Tus competidores ya están usando herramientas profesionales.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/es/prices" className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-3.5 rounded-xl text-base transition-all inline-flex items-center gap-2 shadow-lg shadow-brand-gold/25 group">
                  Comenzar ahora — 7 días gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/es/demo" className="border border-brand-green hover:border-brand-gold/50 text-stone-300 px-8 py-3.5 rounded-xl text-base font-medium transition-all inline-flex items-center gap-2 gold-glow">
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
