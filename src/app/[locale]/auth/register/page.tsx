"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "esencial";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contrase\u00f1a debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al registrar"); setLoading(false); return; }

      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.error) { router.push("/es/auth/login"); return; }

      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: data.userId }),
      });

      const checkout = await checkoutRes.json();
      if (checkout.url) { window.location.href = checkout.url; }
      else { setError("Error al crear el pago. Intenta de nuevo."); setLoading(false); }
    } catch {
      setError("Error de conexi\u00f3n. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-green-deeper flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="glass-surface rounded-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/es" className="inline-block mb-6">
              <img src="/logo-icon-name.png" alt="AveGestoria" className="h-7 mx-auto" />
            </Link>
            <h1 className="text-xl font-semibold text-stone-100 tracking-tight">Crear tu cuenta</h1>
            <p className="text-sm text-stone-400 mt-1">
              Para el plan <span className="text-brand-gold font-medium capitalize">{plan}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] text-stone-400 mb-1.5">Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre" required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] text-stone-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] text-stone-400 mb-1.5">Contrase\u00f1a</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="M\u00ednimo 6 caracteres" required minLength={6}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/10 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-[13px] text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 text-brand-green-deeper font-semibold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2 active:scale-[0.98]">
              {loading ? (
                <span className="w-4 h-4 border-2 border-brand-green-deeper/30 border-t-brand-green-deeper rounded-full animate-spin" />
              ) : (
                <><UserPlus className="w-4 h-4" /> Crear cuenta</>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-stone-500 mt-6">
            \u00bfYa tienes cuenta?{" "}
            <Link href="/es/auth/login" className="text-brand-gold hover:text-brand-gold-light font-medium transition-colors">
              Inicia sesi\u00f3n
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
