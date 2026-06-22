"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Warehouse, Dna, Egg, DollarSign, ArrowRight, ArrowLeft, PartyPopper, Lock, Eye, EyeOff } from "lucide-react";

const STEPS = [
  {
    title: "Crea tu contraseña",
    description: "Define una contraseña para acceder a tu cuenta.",
    icon: Lock,
    isPassword: true,
  },
  {
    title: "Crea tu primer Galpón",
    description: "Los galpones son las instalaciones donde estarán tus aves.",
    icon: Warehouse,
    fields: [
      { name: "galponNombre", label: "Nombre del Galpón", placeholder: "Ej: Galpón Principal", type: "text" },
      { name: "galponCapacidad", label: "Capacidad Máxima (aves)", placeholder: "Ej: 3000", type: "number" },
    ],
  },
  {
    title: "Registra una Raza",
    description: "Selecciona o crea la raza de tus gallinas.",
    icon: Dna,
    fields: [
      { name: "razaNombre", label: "Nombre de la Raza", placeholder: "Ej: Hy-Line Brown", type: "text" },
      { name: "razaProductividad", label: "Productividad Esperada (%)", placeholder: "Ej: 92", type: "number" },
    ],
  },
  {
    title: "Crea tu primer Lote",
    description: "Un lote es un grupo de aves de la misma raza.",
    icon: Egg,
    fields: [
      { name: "loteNombre", label: "Nombre del Lote", placeholder: "Ej: Lote A", type: "text" },
      { name: "loteCantidad", label: "Cantidad de Aves", placeholder: "Ej: 2000", type: "number" },
      { name: "loteFechaIngreso", label: "Fecha de Ingreso", type: "date" },
      { name: "loteCostoAve", label: "Costo por Ave (opcional)", placeholder: "Ej: 4.50", type: "number" },
    ],
  },
  {
    title: "Registra tu primera Venta",
    description: "Registra una venta para empezar a ver tu flujo de ingresos.",
    icon: DollarSign,
    fields: [
      { name: "ventaCliente", label: "Nombre del Cliente", placeholder: "Ej: Supermercado López", type: "text" },
      { name: "ventaDocenas", label: "Docenas Vendidas", placeholder: "Ej: 50", type: "number" },
      { name: "ventaPrecio", label: "Precio por Docena ($)", placeholder: "Ej: 1.35", type: "number" },
    ],
  },
  {
    title: "¡Todo listo! 🎉",
    description: "Tu granja está configurada.",
    icon: PartyPopper,
    isComplete: true,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(true);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Fetch email from Stripe session
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.email) setEmail(data.email);
          setLoadingEmail(false);
        })
        .catch(() => setLoadingEmail(false));
    } else {
      setLoadingEmail(false);
    }
  }, [sessionId]);

  const updateField = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canProceed = () => {
    const current = STEPS[step];
    if (current.isComplete) return true;
    if (current.isPassword) return password.length >= 6;
    return current.fields?.every((f) => {
      if (f.name === "loteCostoAve" || f.name === "galponCapacidad") return true;
      return form[f.name]?.trim();
    });
  };

  const handleNext = async () => {
    if (step === 0 && STEPS[0].isPassword) {
      // Save password
      setPasswordError("");
      if (password.length < 6) {
        setPasswordError("Mínimo 6 caracteres");
        return;
      }
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: email?.split("@")[0] || "Productor", email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          // If user already exists, try to set password via a PUT
          if (res.status === 409) {
            // User exists from webhook — go to next step
            setStep(1);
            return;
          }
          setPasswordError(data.error || "Error al crear contraseña");
          return;
        }
      } catch {
        setPasswordError("Error de conexión");
        return;
      }
      setStep(1);
      return;
    }

    if (step === STEPS.length - 2) {
      setSaving(true);
      try {
        const galponRes = await fetch("/api/granja/galpones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: form.galponNombre,
            capacidadMaxima: form.galponCapacidad ? parseInt(form.galponCapacidad) : null,
          }),
        });
        const galpon = await galponRes.json();

        const razaRes = await fetch("/api/granja/razas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: form.razaNombre,
            productividadEsperada: form.razaProductividad || null,
          }),
        });
        const raza = await razaRes.json();

        await fetch("/api/granja/lotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: form.loteNombre,
            galponId: galpon.id,
            razaId: raza.id,
            cantidadAves: parseInt(form.loteCantidad),
            fechaIngreso: form.loteFechaIngreso || new Date().toISOString().split("T")[0],
            costoAve: form.loteCostoAve || null,
          }),
        });

        const clienteRes = await fetch("/api/granja/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.ventaCliente }),
        });
        const cliente = await clienteRes.json();

        await fetch("/api/granja/finanzas/ventas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clienteId: cliente.id,
            fecha: new Date().toISOString().split("T")[0],
            docenas: parseInt(form.ventaDocenas),
            precioPorDocena: parseFloat(form.ventaPrecio),
          }),
        });
      } catch (err) {
        console.error("Onboarding save error:", err);
      } finally {
        setSaving(false);
      }
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const current = STEPS[step];
  const Icon = current.icon;

  if (loadingEmail) {
    return (
      <div className="min-h-screen bg-brand-green-deeper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full bg-brand-green-deeper/60 border border-brand-green/40 rounded-lg px-4 py-3 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-brand-gold/50";

  return (
    <div className="min-h-screen bg-brand-green-deeper flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= step
                    ? "bg-brand-gold text-brand-green-deeper"
                    : "bg-brand-green/40 text-stone-500"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 transition-all ${i < step ? "bg-brand-gold" : "bg-brand-green/40"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-brand-green/20 border border-brand-green/30 rounded-2xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-green/30 flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-brand-gold" />
            </div>
            <h2 className="text-xl font-bold text-stone-100">{current.title}</h2>
            {current.description && (
              <p className="text-sm text-stone-400 mt-2 max-w-sm">{current.description}</p>
            )}
          </div>

          {current.isComplete ? (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <p className="text-stone-300 text-sm">Tu granja ya está lista.</p>
              <button
                onClick={() => router.push("/es/auth/login")}
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Ir al Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : current.isPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Email (de Stripe)</label>
                <div className={inputClass + " text-brand-gold font-semibold"}>{email}</div>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Contraseña *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {current.fields?.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs text-stone-400 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.name] || ""}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          {!current.isComplete && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 bg-brand-green/30 hover:bg-brand-green/40 disabled:opacity-30 disabled:cursor-not-allowed text-stone-300 px-4 py-2.5 rounded-lg text-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || saving}
                className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-brand-green-deeper font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-brand-green-deeper/30 border-t-brand-green-deeper rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    {step === STEPS.length - 2 ? "Finalizar" : "Siguiente"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {!current.isComplete && !current.isPassword && step < 3 && (
            <p className="text-center mt-4">
              <button onClick={() => router.push("/es/auth/login")} className="text-xs text-stone-500 hover:text-stone-400 transition-colors">
                Saltar configuración inicial
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
