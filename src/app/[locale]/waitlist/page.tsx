"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Check, Send, Egg, TrendingUp, Users, Calculator, MessageCircle, Zap, ChevronRight } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";

const benefits = [
  { icon: TrendingUp, title: "Control de Ración", desc: "Gestión completa del alimento: compras, inventario y consumo por lote." },
  { icon: Egg, title: "Control de Producción Avanzado", desc: "KPIs detallados, proyecciones y análisis de eficiencia productiva." },
  { icon: Users, title: "CRM de Clientes", desc: "Historial completo de clientes, pedidos y pagos." },
  { icon: Calculator, title: "Calculadora de ROI", desc: "Proyecta inversión vs retorno. Toma decisiones con datos reales." },
  { icon: MessageCircle, title: "WhatsApp para Empleados", desc: "Tus funcionarios reportan datos directo por WhatsApp. Tú ves todo en tiempo real." },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [granjaName, setGranjaName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, granjaName }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error || "Error al registrarse");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-stone-100 relative overflow-hidden">
      <ParticleField />

      {/* Nav */}
      <nav className="relative z-10 px-4 py-4 flex items-center">
        <Link href="/es" className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <img src="/icon.png" alt="" className="h-6 w-6" />
          <span className="text-sm font-bold text-brand-gold">AveGestoria</span>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-3xl mx-auto px-4 py-12"
      >
        {!submitted ? (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-3 py-1 mb-4">
                <Zap className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[10px] font-medium text-brand-gold">LISTA DE ESPERA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="text-brand-gold">Profesional</span>
                <span className="text-stone-100">+</span>
              </h1>
              <p className="text-stone-400 text-sm mt-2 max-w-md mx-auto">
                El plan para granjas con más de 50.000 gallinas. Control total de producción, clientes, costos y un equipo trabajando conectado.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4 flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-200">{b.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-brand-gold mb-1">Sé de los primeros</h2>
              <p className="text-xs text-stone-500 mb-4">
                Te avisaremos cuando Profesional+ esté disponible. Sin compromiso.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Nombre de la granja</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Avícola Los Andes"
                    value={granjaName}
                    onChange={(e) => setGranjaName(e.target.value)}
                    className="w-full bg-brand-green-deeper/60 border border-brand-green/40 rounded-lg px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:border-brand-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-green-deeper/60 border border-brand-green/40 rounded-lg px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:border-brand-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    required
                    placeholder="+57 300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-brand-green-deeper/60 border border-brand-green/40 rounded-lg px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:border-brand-gold/50 focus:outline-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-3 rounded-lg text-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    "Registrando..."
                  ) : (
                    <>
                      Quiero ser de los primeros
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Pricing hint */}
            <div className="text-center mt-6">
              <p className="text-xs text-stone-600">
                USD 39.99/mes cuando esté disponible
              </p>
            </div>
          </>
        ) : (
          /* Success state */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-stone-100 mb-2">¡Registrado!</h2>
            <p className="text-sm text-stone-400 max-w-sm mx-auto mb-8">
              Te avisaremos a <span className="text-stone-200">{email}</span> cuando Profesional+ esté disponible.
            </p>
            <Link
              href="/es"
              className="inline-flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
