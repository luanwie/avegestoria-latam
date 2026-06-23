"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Email o contrase\u00f1a incorrectos");
      setLoading(false);
      return;
    }

    router.push("/es/dashboard");
    router.refresh();
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
            <h1 className="text-xl font-semibold text-stone-100 tracking-tight">Entrar</h1>
            <p className="text-sm text-stone-400 mt-1">Accede a tu granja</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] text-stone-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] text-stone-400 mb-1.5">Contrase\u00f1a</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30 focus:ring-1 focus:ring-brand-gold/10 transition-all"
                />
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
                <><LogIn className="w-4 h-4" /> Entrar</>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-stone-500 mt-6">
            \u00bfNo tienes cuenta?{" "}
            <Link href="/es/auth/register" className="text-brand-gold hover:text-brand-gold-light font-medium transition-colors">
              Crea una
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
