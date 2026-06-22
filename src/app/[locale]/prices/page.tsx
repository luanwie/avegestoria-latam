"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Star, ArrowRight, Zap, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";

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

export default function PricesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canceled = searchParams.get("checkout") === "canceled";

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al crear el pago");
        setLoading(false);
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-green-deeper text-stone-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-green-deeper/80 backdrop-blur-lg border-b border-brand-green/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/es" className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="h-8 w-8" />
            <span className="text-base font-bold text-brand-gold">AveGestoria</span>
          </Link>
          <Link href="/es/auth/login" className="text-sm text-stone-400 hover:text-brand-gold transition-colors">
            Entrar
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error */}
          {canceled && (
            <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-5 py-3 mb-8 text-sm text-brand-gold">
              Pago cancelado. Puedes intentar de nuevo cuando quieras.
            </div>
          )}
          {error && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl px-5 py-3 mb-8 text-sm text-red-400">
              {error}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5 text-xs sm:text-sm text-brand-gold font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Empieza hoy
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 mb-3">
              Elige el plan para tu granja
            </h1>
            <p className="text-stone-400 max-w-xl mx-auto mb-2">
              <strong className="text-brand-gold">USD 1.00</strong> hoy + 7 días de prueba. Después, el precio regular del plan.
              Cancela cuando quieras.
            </p>

            {/* Trial highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-5 py-3 mb-10"
            >
              <Zap className="w-5 h-5 text-brand-gold" />
              <span className="text-sm text-stone-200">
                <span className="text-brand-gold font-bold">USD 1.00</span> hoy — <span className="text-brand-gold font-bold">7 días gratis</span> después{" "}
                <span className="text-brand-gold font-bold">$9.99</span> o <span className="text-brand-gold font-bold">$19.99</span>/mes
              </span>
            </motion.div>
          </motion.div>

          {/* Plans */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className={`rounded-2xl p-6 sm:p-8 text-left border transition-all duration-300 ${
                  plan.popular
                    ? "bg-brand-green/25 border-brand-gold/40 ring-1 ring-brand-gold/20"
                    : "bg-brand-green/15 border-brand-green/30"
                }`}
              >
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

                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                  Incluye:
                </h4>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-stone-300">
                      <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading}
                  className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? "bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper shadow-lg shadow-brand-gold/20"
                      : "border border-brand-green hover:border-brand-gold/50 text-stone-300"
                  }`}
                >
                  {loading ? "Redirigiendo..." : `Comenzar — USD 1`}
                </button>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Pago seguro vía Stripe
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <Check className="w-3.5 h-3.5" />
                    Cancela cuando quieras
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mt-16">
            <h3 className="text-lg font-semibold text-stone-200 mb-6">Preguntas sobre los planes</h3>
            <div className="space-y-3 text-left">
              {[
                { q: "¿Qué pasa después de los 7 días?", a: "Se te cobrará automáticamente el precio del plan seleccionado. Puedes cancelar antes sin ningún costo." },
                { q: "¿El pago es seguro?", a: "Sí. Todos los pagos son procesados por Stripe, la plataforma de pagos más segura del mundo." },
                { q: "¿Puedo cambiar de plan después?", a: "Sí, puedes upgradear al plan Profesional en cualquier momento desde tu dashboard." },
              ].map((item, i) => (
                <div key={i} className="border border-brand-green/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-stone-200 mb-1">{item.q}</p>
                  <p className="text-sm text-stone-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-green/30 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-stone-600">
          &copy; 2026 AveGestoria. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
