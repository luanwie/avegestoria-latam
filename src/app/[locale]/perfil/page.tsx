"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Save, ShieldCheck, MessageCircle, Check } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  nombreGranja: string | null;
  ciudad: string | null;
  pais: string | null;
  moneda: string | null;
  plan: string;
  role: string;
  dataShared: boolean;
  whatsappNumber: string | null;
}

const PLAN_LABELS: Record<string, string> = {
  none: "Sin plan",
  esencial: "Esencial",
  profesional: "Profesional",
  profesional_plus: "Profesional+",
};

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dataShared, setDataShared] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/es/auth/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            router.push("/es/auth/login");
            return;
          }
          setProfile(data);
          setDataShared(data.dataShared);
          setWhatsappNumber(data.whatsappNumber || "");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataShared,
        whatsappNumber: whatsappNumber || null,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const updated = await res.json();
      setProfile(updated);
    }
    setSaving(false);
  };

  if (status === "loading" || loading) {
    return (
      <DashboardShell>
        <div className="py-20 text-center text-stone-500 text-sm">Cargando...</div>
      </DashboardShell>
    );
  }

  if (!profile) return null;

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-stone-100">Mi Perfil</h1>
          <p className="text-sm text-stone-400 mt-1">
            Configura tus datos y preferencias de consultoría
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-brand-gold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Datos de tu cuenta
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-stone-500 text-xs">Nombre</p>
              <p className="text-stone-200">{profile.name || "—"}</p>
            </div>
            <div>
              <p className="text-stone-500 text-xs">Email</p>
              <p className="text-stone-200">{profile.email || "—"}</p>
            </div>
            <div>
              <p className="text-stone-500 text-xs">Granja</p>
              <p className="text-stone-200">{profile.nombreGranja || "—"}</p>
            </div>
            <div>
              <p className="text-stone-500 text-xs">Plan</p>
              <p className="text-stone-200">
                <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded-full">
                  {PLAN_LABELS[profile.plan] || profile.plan}
                </span>
              </p>
            </div>
            {profile.ciudad && (
              <div>
                <p className="text-stone-500 text-xs">Ciudad</p>
                <p className="text-stone-200">{profile.ciudad}</p>
              </div>
            )}
            {profile.pais && (
              <div>
                <p className="text-stone-500 text-xs">País</p>
                <p className="text-stone-200">{profile.pais}</p>
              </div>
            )}
          </div>
        </div>

        {/* Consultoría Section */}
        <form onSubmit={handleSave}>
          <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-brand-gold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Consultoría WhatsApp
            </h2>

            <p className="text-xs text-stone-400 leading-relaxed">
              Al activar esta opción, Luan (consultor especializado) podrá ver los
              datos de tu granja para darte recomendaciones personalizadas vía
              WhatsApp. Tus datos solo son visibles para el consultor asignado.
            </p>

            {/* Data Sharing Toggle */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-brand-green/30 border border-brand-green/40 cursor-pointer hover:bg-brand-green/40 transition-colors">
              <div>
                <p className="text-sm text-stone-200 font-medium">
                  Compartir mis datos con el consultor
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  El consultor podrá ver producción, finanzas y lotes
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={dataShared}
                onClick={() => setDataShared(!dataShared)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  dataShared ? "bg-brand-gold" : "bg-stone-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    dataShared ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            {/* WhatsApp Number */}
            <div>
              <label className="text-xs text-stone-400 block mb-1">
                Tu número de WhatsApp
              </label>
              <input
                type="text"
                placeholder="+57 300 123 4567"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-brand-green-deeper/60 border border-brand-green/40 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:border-brand-gold/50 focus:outline-none"
              />
              <p className="text-[10px] text-stone-600 mt-1">
                Formato internacional. El consultor te contactará por aquí.
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                saved
                  ? "bg-emerald-800/40 text-emerald-400 border border-emerald-600/30"
                  : "bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper"
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Guardado
                </>
              ) : saving ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>

        {/* Consultoría link (only shown if has profesional plan) */}
        {profile.plan !== "none" && profile.plan !== "esencial" && (
          <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4">
            <p className="text-sm text-stone-200 font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-gold" />
              ¿Necesitas ayuda ahora?
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Habla directamente con tu consultor por WhatsApp.
            </p>
            <a
              href="https://wa.me/5551993612092"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-brand-green-deeper bg-brand-gold hover:bg-brand-gold-light px-3 py-1.5 rounded-lg transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Abrir WhatsApp
            </a>
          </div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
