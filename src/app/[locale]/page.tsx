"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck, Star, Zap, Check, MessageCircle, TrendingDown, Egg, FileText, Smartphone } from "lucide-react";
import { trackCTA } from "@/components/seo/PageViewTracker";
import ParticleField from "@/components/ui/ParticleField";
import ScrollReveal from "@/components/ui/ScrollReveal";

/* ─── Dobra 1: Promessa Direta ─── */
function Dobra1_Hero({ isTouch }: { isTouch: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Farm background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1626387345637-36d06a5b3cf2?w=1200&q=60')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green/30 via-brand-green-deeper to-brand-green-deeper" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 bg-brand-green/40 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs text-brand-gold mb-6">
            <Zap className="w-3.5 h-3.5" /> NUEVO · Gestión Inteligente para Ponedoras
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-stone-100 leading-tight mb-4">
            Deja de Adivinar<br />
            <span className="text-brand-gold">Cuánto Gana Tu Granja.</span>
          </h1>
          <p className="text-stone-400 text-base sm:text-lg max-w-2xl mx-auto mb-4">
            Cada día que controlas tu producción en papel, estás perdiendo dinero que no volverá. AveGestoria te muestra la rentabilidad real de cada lote — desde tu celular, sin internet.
          </p>

          {/* Visual contrast: papel vs app */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 mt-6">
            <div className="bg-rose-900/10 border border-rose-700/20 rounded-xl px-5 py-4 w-36 sm:w-44">
              <p className="text-[10px] uppercase tracking-wider text-rose-400/70 font-semibold mb-2">Sin AveGestoria</p>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-rose-500/50" />
                <p className="text-sm text-stone-500">Cuadernos</p>
              </div>
              <p className="text-[10px] text-stone-600 leading-relaxed">Errores manuales · Cálculos tardíos · Sin alertas</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-600 shrink-0" />
            <div className="bg-emerald-900/15 border border-emerald-700/30 rounded-xl px-5 py-4 w-36 sm:w-44">
              <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold mb-2">Con AveGestoria</p>
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <p className="text-sm text-stone-200 font-semibold">Control Total</p>
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed">Datos en tiempo real · Alertas · Lucro por lote</p>
            </div>
          </div>

          {/* CTA duplo */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/es/prices"
              onClick={() => trackCTA("Hero Probar 7 dias")}
              className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20"
            >
              Probar 7 días gratis →
            </Link>
            <a
              href="https://wa.me/5551993612092"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA("Hero WhatsApp")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-brand-gold/30 hover:border-brand-gold/60 text-brand-gold px-6 py-4 rounded-xl text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Hablar por WhatsApp
            </a>
          </div>

          <p className="text-[10px] text-stone-600 mt-4">
            El 80% de los productores de huevo en Latinoamérica todavía usa papel.
            <br className="sm:hidden" /> El otro 20% ya sabe cuánto gana por lote.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Dobra 2: Identificação ─── */
function Dobra2_Identificacion() {
  return (
    <section className="py-20 sm:py-28 bg-brand-green-deeper/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-4 text-center">
            Tu granja no es un hobby
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 text-center mb-8">
            Deja de administrarla como si lo fuera.
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-8 items-start">
          <ScrollReveal delay={0.1}>
            <div className="space-y-4 text-stone-400 text-sm leading-relaxed">
              <p>
                Te levantas a las 5 de la mañana. Recorres los galpones. Anotas en un cuaderno cuántos huevos recogiste. Luego intentas calcular si el lote A rinde más que el lote B.
              </p>
              <p>
                Pero el cuaderno no te dice que el lote A consumió 12 kilos más de ración esta semana. No te avisa que la tasa de postura bajó del 92% al 85%. No te alerta que estás perdiendo $47 dólares por día.
              </p>
              <p className="text-stone-300 font-medium">
                No es tu culpa. Pero seguir así es una decisión. Y tiene consecuencias que ves a fin de mes cuando el dinero no cierra.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-stone-100 mb-3">AveGestoria: control real, desde tu celular</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Dashboard de rentabilidad por lote en tiempo real",
                  "Registro diario en menos de 30 segundos",
                  "Funciona sin internet en el galpón",
                  "Alertas inmediatas cuando algo sale mal",
                  "Chat IA con tus datos reales",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/es/prices"
                onClick={() => trackCTA("Dobra2 CTA")}
                className="inline-flex items-center gap-1.5 mt-6 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-5 py-3 rounded-xl text-sm transition-all"
              >
                Quiero saber cuánto gana mi granja →
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <p className="text-center text-xs text-stone-600 mt-8 italic">
          Si controlas tu granja en papel o WhatsApp, no estás controlando nada.
        </p>
      </div>
    </section>
  );
}

/* ─── Dobra 3: Roadmap ─── */
function Dobra3_Roadmap() {
  const steps = [
    {
      num: "1",
      title: "Conecta tu granja",
      desc: "Registras tus galpones, lotes y razas. El sistema aprende tu operación: cuántas aves, qué genética, qué edad. 5 minutos y listo.",
    },
    {
      num: "2",
      title: "Registra tu día en segundos",
      desc: "Desde el celular, sin internet, registras huevos recolectados, mortalidad y ración. Menos de 30 segundos por lote. El sistema calcula FCR y tasa de postura automáticamente.",
    },
    {
      num: "3",
      title: "Mira la verdad de tu negocio",
      desc: "Dashboard con lucro por lote, ingresos vs gastos, alertas cuando algo sale mal. La información que antes descubrías a fin de mes — cuando ya era tarde — ahora la ves al instante.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 mb-4">
            Del papel al control total
          </h2>
          <p className="text-stone-400 text-sm mb-12">En 3 pasos, tu granja entra en el siglo 21.</p>
        </ScrollReveal>

        <div className="space-y-6 text-left">
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <div className="flex gap-4 bg-brand-green/15 border border-brand-green/30 rounded-xl p-5">
                <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-brand-gold font-bold text-lg">{s.num}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-100 mb-1">{s.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <Link
          href="/es/prices"
          onClick={() => trackCTA("Dobra3 CTA")}
          className="inline-flex items-center gap-1.5 mt-8 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20"
        >
          Empezar en 5 minutos →
        </Link>
      </div>
    </section>
  );
}

/* ─── Dobra 4: Prova Social ─── */
function Dobra4_ProvaSocial() {
  const testimonials = [
    {
      text: "Tenía 3 galpones y todo en cuadernos. Cuando vi que perdía dinero en el lote B hacía 4 meses, casi me da algo. Con AveGestoria veo el lucro por lote cada día. En 2 meses mejoré 23% mi margen.",
      name: "Carlos M.",
      loc: "Cundinamarca, Colombia",
    },
    {
      text: "Mi galpón está lejos de casa, sin señal. Registro en el celular y cuando vuelvo sincroniza solo. La IA me avisó de una caída de postura antes de que yo la notara. Impresionante.",
      name: "Ricardo G.",
      loc: "Chincha, Perú",
    },
    {
      text: "Pago $19.99 al mes y tengo un consultor que revisa mis datos y me recomienda ajustes por WhatsApp. Eso solo ya vale 10 veces lo que pago. Dejé el cuaderno para siempre.",
      name: "María L.",
      loc: "Santiago, Chile",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-brand-green-deeper/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 mb-4">
            Productores reales que ya dejaron el papel
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-5 text-left h-full flex flex-col">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-sm text-stone-300 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 pt-3 border-t border-brand-green/30">
                  <p className="text-xs font-semibold text-stone-200">{t.name}</p>
                  <p className="text-[10px] text-stone-500">{t.loc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <Link
          href="/es/prices"
          onClick={() => trackCTA("Dobra4 CTA")}
          className="inline-flex items-center gap-1.5 mt-8 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Quiero los mismos resultados →
        </Link>
      </div>
    </section>
  );
}

/* ─── Dobra 5: Disclaimer + Autoridade ─── */
function Dobra5_Autoridade() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="bg-rose-900/10 border border-rose-700/20 rounded-xl p-5 mb-10 text-center">
            <p className="text-sm text-stone-300">
              <span className="text-rose-400 font-bold">AveGestoria no es para todos.</span>
              {" "}Si tienes menos de 2.000 gallinas y estás empezando, tenemos un plan para ti. Si ya operas entre 5.000 y 50.000 aves, tenemos el plan perfecto. Y si ya pasaste las 50.000, tenemos lista de espera para el plan industrial.{" "}
              <span className="text-stone-200 font-semibold">Hay un AveGestoria para cada etapa de tu granja.</span>
            </p>
          </div>
        </ScrollReveal>

        {/* Photo + Story + WhatsApp card */}
        <div className="bg-brand-green/15 border border-brand-green/30 rounded-2xl overflow-hidden">
          <div className="grid sm:grid-cols-5">
            {/* Photo */}
            <ScrollReveal delay={0.1}>
              <div className="sm:col-span-2 relative h-64 sm:h-full min-h-[280px]">
                <img
                  src="/luan.jpg"
                  alt="Luan — Fundador de AveGestoria"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-brand-green-deeper/90 sm:bg-gradient-to-r sm:from-transparent sm:to-brand-green-deeper/90" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:hidden">
                  <p className="text-sm font-bold text-stone-100">Luan</p>
                  <p className="text-xs text-stone-400">Fundador · AveGestoria</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <div className="sm:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
              <ScrollReveal delay={0.15}>
                <p className="text-[10px] uppercase tracking-widest text-brand-gold/70 font-semibold mb-2">¿Quién está detrás de esto?</p>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 mb-1">
                  Luan <span className="text-stone-500 font-normal text-base">— Fundador</span>
                </h2>
                <p className="text-xs text-stone-500 mb-4">
                  Productor avícola · Administrador · Desarrollador
                </p>

                <div className="space-y-3 text-sm text-stone-400 leading-relaxed">
                  <p>
                    Nuestra granja familiar tiene más de <span className="text-stone-200 font-semibold">40 años de historia</span> en el sur de Brasil. Crecí viendo a mi padre anotar la producción en un cuaderno manchado de grasa. Y vi lo que pasaba cuando los números no cerraban a fin de mes.
                  </p>
                  <p>
                    Estudié administración, entendí de sistemas, y construí AveGestoria para resolver el problema que viví en carne propia.{" "}
                    <span className="text-stone-200 font-semibold">
                      Gracias a este sistema, nuestra granja pasó de 20.000 a 80.000 gallinas en 5 años
                    </span>{" "}
                    — con control real sobre cada lote, cada gasto y cada decisión. Hoy quiero ayudarte a hacer lo mismo.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a
                    href="https://wa.me/5551993612092"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTA("Dobra5 WhatsApp")}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-700/40 hover:bg-emerald-600/50 border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hablar con Luan por WhatsApp
                  </a>
                  <p className="text-[10px] text-stone-600 sm:self-center">
                    +55 51 99361-2092 · Respuesta en menos de 2h
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Dobra 6: Bônus ─── */
function Dobra6_Bonus() {
  const bonuses = [
    { title: "Consultoría WhatsApp", value: "$197/mes", desc: "Acceso directo a mi WhatsApp. Reviso tus datos y te digo dónde ajustar. Como un asesor financiero para tu granja." },
    { title: "Chat IA con tus datos", value: "$97/mes", desc: "Pregunta: ¿Cuál es mi lote más rentable? ¿Cómo está mi FCR? Respuestas inmediatas con TUS números reales." },
    { title: "Alertas inteligentes", value: "$47/mes", desc: "El sistema te avisa cuando la mortalidad sube, la postura cae o el FCR se dispara. Antes del prejuicio." },
    { title: "Acceso del consultor a tus datos", value: "Invaluable", desc: "Activas un interruptor y yo veo tus números para darte consejos precisos. Sin enviar pantallazos." },
  ];

  return (
    <section className="py-20 sm:py-28 bg-brand-green-deeper/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase">Plan Profesional</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 mt-2 mb-2">
            No solo llevas software. Llevas un consultor.
          </h2>
          <p className="text-stone-400 text-sm mb-10">Estas 4 ventajas vienen incluidas en el plan Profesional.</p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          {bonuses.map((b, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <div className="bg-brand-green/15 border border-brand-green/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-stone-100">{b.title}</h3>
                  <span className="text-[10px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded-full border border-brand-gold/20">
                    Valor ${b.value}
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <Link
          href="/es/prices"
          onClick={() => trackCTA("Dobra6 CTA")}
          className="inline-flex items-center gap-1.5 mt-8 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20"
        >
          Activar consultoría + IA →
        </Link>
      </div>
    </section>
  );
}

/* ─── Dobra 7: Quem Sou Eu ─── */
function Dobra7_Historia() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 text-center mb-8">
            Esto empezó con un cuaderno manchado de grasa.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="space-y-4 text-sm text-stone-400 leading-relaxed">
            <p>
              Nuestra granja familiar tiene más de 40 años. Mi padre, como tantos productores, usaba cuaderno y lápiz para todo. Cada mañana caminaba al galpón, anotaba huevos, muertas, ración. A fin de mes, calculadora y 3 horas — y muchas veces el resultado era frustración.
            </p>
            <p>
              Muchas veces había perdido. Y siempre lo descubría tarde.
            </p>
            <p>
              Cuando entré a la universidad me obsesioné con una pregunta: <span className="text-stone-200 font-medium">¿por qué un productor que sabe TODO de gallinas no sabe si está ganando dinero?</span> La respuesta: porque nadie le dio la herramienta correcta.
            </p>
            <p>
              Construí AveGestoria para nuestra granja. El resultado: en 5 años escalamos de 20.000 a 80.000 gallinas con control total sobre cada lote, cada gasto y cada decisión. Ahora quiero ayudarte a ti a hacer lo mismo.
            </p>
          </div>
        </ScrollReveal>
        <div className="text-center mt-8">
          <Link
            href="/es/prices"
            onClick={() => trackCTA("Dobra7 CTA")}
            className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Conocer el sistema →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Dobra 8: Reforço Autoridade ─── */
function Dobra8_Refuerzo() {
  const facts = [
    { icon: TrendingDown, label: "Ración = 65-87% de tus costos", detail: "Cada gramo de ración que no se convierte en huevo es dinero perdido. El sistema calcula tu FCR automáticamente." },
    { icon: Egg, label: "FCR de 1.9 a 2.4 cuesta ~$3,000/mes", detail: "En un lote de 10.000 aves, un deterioro del índice de conversión que no detectas a tiempo puede costarte miles." },
    { icon: ShieldCheck, label: "Funciona OFFLINE en el galpón", detail: "El 77% de las zonas rurales en Latinoamérica tienen conectividad deficiente. AveGestoria funciona sin internet y sincroniza después." },
  ];

  return (
    <section className="py-20 sm:py-28 bg-brand-green-deeper/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 text-center mb-4">
            No inventamos la gestión avícola. La hicimos accesible.
          </h2>
          <p className="text-stone-400 text-sm text-center mb-10">
            AveGestoria no es un ERP de $200/mes que necesitas un curso para usar. Es el punto exacto entre potencia y simplicidad.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-4">
          {facts.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-brand-green/15 border border-brand-green/30 rounded-xl p-5 text-center">
                <f.icon className="w-6 h-6 text-brand-gold mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-100 mb-2">{f.label}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{f.detail}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/es/prices"
            onClick={() => trackCTA("Dobra8 CTA")}
            className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Probar el sistema ahora →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Dobra 9: Garantia ─── */
function Dobra9_Garantia() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <ShieldCheck className="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 mb-4">
            7 días. Sin preguntas. Sin letra pequeña.
          </h2>
          <p className="text-stone-400 text-sm mb-8">
            Sabemos que desconfías. Has probado sistemas antes que no funcionaron. Por eso nuestra garantía es simple:
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6 mb-8">
            <p className="text-lg font-bold text-stone-100 mb-3">Prueba AveGestoria 7 días completamente gratis.</p>
            <div className="space-y-2 text-left text-sm text-stone-300 max-w-md mx-auto">
              {[
                "Cuánto gana — o pierde — cada lote",
                "Tu flujo real de ingresos y gastos",
                "Dónde está la fuga de dinero que no habías visto",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Si en 7 días no ves claramente: {item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-stone-400 mt-4">
              ...simplemente cancelas. Sin llamadas. Sin excusas.
            </p>
          </div>
        </ScrollReveal>

        <p className="text-xs text-stone-600 mb-6 italic">
          Confiamos en que una vez que veas tus números reales, no vas a querer volver al papel.
        </p>

        <Link
          href="/es/prices"
          onClick={() => trackCTA("Dobra9 CTA")}
          className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20"
        >
          Empezar 7 días gratis →
        </Link>
      </div>
    </section>
  );
}

/* ─── Dobra 10: Oferta + Ancoragem ─── */
function Dobra10_Oferta() {
  const plans = [
    {
      id: "esencial", name: "Esencial", price: "9.99", popular: false,
      features: ["Dashboard financiero", "Control de ventas y gastos", "Informes PDF y Excel"],
    },
    {
      id: "profesional", name: "Profesional", price: "19.99", popular: true,
      features: ["Todo del plan Esencial", "Chat IA (30 preguntas/sem)", "Consultoría WhatsApp", "Alertas inteligentes", "Predicciones"],
    },
    {
      id: "profesional_plus", name: "Profesional+", price: "39.99", desc: "Para industrias con +50k gallinas", popular: false, waitlist: true,
      features: [
        "Todo del plan Profesional",
        "Control avanzado de ración y producción",
        "CRM completo de clientes",
        "Calculadora de inversión vs retorno",
        "Tus empleados reportan por WhatsApp",
        "Solo el dueño ve los datos",
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-brand-green-deeper/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 mb-4">
            Todo lo que recibes
          </h2>
        </ScrollReveal>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 0.1}>
              <div className={`rounded-2xl p-6 text-left border transition-all h-full flex flex-col ${
                plan.popular
                  ? "bg-brand-green/25 border-brand-gold/40 ring-1 ring-brand-gold/20"
                  : "bg-brand-green/15 border-brand-green/30"
              }`}>
                {plan.popular && (
                  <span className="inline-flex items-center gap-1 bg-brand-gold/15 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full mb-3 border border-brand-gold/30 w-fit">
                    <Star className="w-3 h-3" /> RECOMENDADO
                  </span>
                )}
                {"waitlist" in plan && (plan as { waitlist?: boolean }).waitlist && (
                  <span className="inline-flex items-center gap-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold px-3 py-1 rounded-full mb-3 border border-brand-gold/30 w-fit">
                    <Zap className="w-3 h-3" /> LISTA DE ESPERA
                  </span>
                )}
                <h3 className="text-lg font-bold text-stone-100">{plan.name}</h3>
                {"desc" in plan && (plan as { desc?: string }).desc && (
                  <p className="text-xs text-stone-400 mt-0.5">{(plan as { desc?: string }).desc}</p>
                )}
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-stone-100">${plan.price}</span>
                  <span className="text-stone-500 text-sm">/mes</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-stone-300">
                      <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {"waitlist" in plan && (plan as { waitlist?: boolean }).waitlist ? (
                  <Link href="/es/waitlist" className="block text-center py-2.5 rounded-xl text-xs font-bold border border-brand-gold/50 text-brand-gold hover:bg-brand-gold/10 transition-all">
                    Unirse a la lista
                  </Link>
                ) : (
                  <Link
                    href="/es/prices"
                    onClick={() => trackCTA(`Dobra10 ${plan.name}`)}
                    className={`block text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                      plan.popular
                        ? "bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper shadow-lg shadow-brand-gold/20"
                        : "bg-brand-green/30 hover:bg-brand-green/40 border border-brand-green/40 text-stone-300"
                    }`}
                  >
                    7 días gratis
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Ancoragem */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-stone-300 mb-4">Sin AveGestoria vs Con AveGestoria</h3>
            <div className="bg-brand-green/15 border border-brand-green/30 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-brand-green/30 text-stone-500">
                    <th className="text-left px-4 py-2.5"></th>
                    <th className="text-center px-4 py-2.5 text-rose-400">Sin AveGestoria</th>
                    <th className="text-center px-4 py-2.5 text-emerald-400">Con AveGestoria</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Saber lucro por lote", "Fin de mes (tarde)", "Cada día"],
                    ["Control de FCR", "Manual, si acaso", "Automático con alertas"],
                    ["Consultoría", "$200-500/mes", "Incluida (Profesional)"],
                    ["Tiempo en cálculos", "3-5 horas/semana", "0"],
                    ["Decisiones", "Intuición", "Datos reales"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-brand-green/20 last:border-0">
                      <td className="px-4 py-2.5 text-stone-300">{row[0]}</td>
                      <td className="px-4 py-2.5 text-center text-stone-500">{row[1]}</td>
                      <td className="px-4 py-2.5 text-center text-stone-200 font-medium">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-500 mt-3">
              De $297/mes en valor real por solo $19.99/mes en el plan Profesional.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Dobra 11: FAQ ─── */
function Dobra11_FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "¿Funciona sin internet en el galpón?", a: "Sí. AveGestoria funciona 100% offline. Registras todo desde tu celular estés donde estés. Cuando vuelves a una zona con señal, los datos se sincronizan automáticamente." },
    { q: "¿Es difícil de usar? No soy ingeniero.", a: "Si usas WhatsApp, puedes usar AveGestoria. Registras la producción diaria en menos de 30 segundos. El onboarding guiado te deja listo en 5 minutos. Y si tienes dudas, tienes mi WhatsApp." },
    { q: "¿Qué pasa si cancelo en los 7 días?", a: "Nada. Cancelas y listo. Sin llamadas insistentes. Sin ofertas especiales para retenerte. Sin compromiso." },
    { q: "¿El consultor realmente revisa MIS datos?", a: "Sí. Cuando activas la opción en tu perfil, yo (Luan) puedo ver tus números y darte consejos específicos para TU granja. No son recomendaciones genéricas de internet. Es consultoría real." },
    { q: "¿Y si tengo más de 50.000 gallinas?", a: "Para eso creamos el plan Profesional+. Únete a la lista de espera y te avisamos cuando esté disponible. Mientras tanto, el plan Profesional ya te da control financiero completo, IA y consultoría." },
    { q: "¿Aceptan pagos de mi país?", a: "Sí. Aceptamos tarjetas internacionales vía Stripe. Productores de Colombia, Perú, Chile, Argentina, Ecuador, México y Uruguay. Precio en dólares para protegerte de la inflación local." },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-100 text-center mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-stone-400 text-sm text-center mb-10">
            Lo que todo productor pregunta antes de entrar.
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="border border-brand-green/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-brand-green/20 transition-colors"
                >
                  <span className="text-sm font-medium text-stone-200 pr-4">{faq.q}</span>
                  <span className={`text-brand-gold text-lg transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-stone-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/es/prices"
            onClick={() => trackCTA("Dobra11 CTA final")}
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-brand-gold/20"
          >
            Dejar el papel hoy — 7 días gratis →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Nav ─── */
function Nav({ onCta }: { onCta?: () => void }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/es" className="flex items-center gap-2">
          <img src="/icon.png" alt="" className="h-8 w-8" />
          <span className="text-base font-bold text-brand-gold tracking-tight">AveGestoria</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#roadmap" className="text-stone-400 hover:text-brand-gold transition-colors">Cómo funciona</a>
          <a href="#pricing" className="text-stone-400 hover:text-brand-gold transition-colors">Planes</a>
          <a href="#faq" className="text-stone-400 hover:text-brand-gold transition-colors">FAQ</a>
          <Link href="/es/blog" className="text-stone-400 hover:text-brand-gold transition-colors">Blog</Link>
          <Link href="/es/auth/login" className="text-stone-400 hover:text-brand-gold transition-colors">Entrar</Link>
          <Link
            href="/es/prices"
            onClick={() => trackCTA("Nav CTA")}
            className="bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-lg shadow-brand-gold/20"
          >
            7 días gratis
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
              <a href="#roadmap" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Cómo funciona</a>
              <a href="#pricing" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Planes</a>
              <a href="#faq" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">FAQ</a>
              <Link href="/es/blog" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Blog</Link>
              <Link href="/es/auth/login" onClick={() => setNavOpen(false)} className="py-2 text-stone-300">Entrar</Link>
              <Link href="/es/prices" onClick={() => { setNavOpen(false); trackCTA("Nav Mobile CTA"); }} className="bg-brand-gold text-brand-green-deeper font-bold px-4 py-3 rounded-lg text-center">
                7 días gratis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-brand-green/30 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-xs text-stone-600 space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/icon.png" alt="" className="h-5 w-5 opacity-50" />
          <span className="text-stone-500">AveGestoria</span>
        </div>
        <p>&copy; 2026 AveGestoria. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4">
          <Link href="/es/legal/terms" className="hover:text-stone-400">Términos</Link>
          <Link href="/es/legal/privacy" className="hover:text-stone-400">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Landing Page ─── */
export default function LandingPage() {
  const [isTouch, setTouch] = useState(true);
  useState(() => setTouch(typeof window !== "undefined" && window.matchMedia("(hover: none)").matches));

  return (
    <div className="min-h-screen bg-bg-primary text-stone-100">
      <ParticleField />
      <Nav />

      <main>
        <div id="hero"><Dobra1_Hero isTouch={isTouch} /></div>
        <Dobra2_Identificacion />
        <div id="roadmap"><Dobra3_Roadmap /></div>
        <Dobra4_ProvaSocial />
        <Dobra5_Autoridade />
        <Dobra6_Bonus />
        <Dobra7_Historia />
        <Dobra8_Refuerzo />
        <Dobra9_Garantia />
        <div id="pricing"><Dobra10_Oferta /></div>
        <div id="faq"><Dobra11_FAQ /></div>
      </main>

      <Footer />
    </div>
  );
}
