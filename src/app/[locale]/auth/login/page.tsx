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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/es/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-brand-green-deeper flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-brand-green/20 border border-brand-green/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <Link href="/es" className="inline-flex items-center gap-2 mb-4">
              <img src="/icon.png" alt="" className="h-10 w-10" />
              <span className="text-lg font-bold text-brand-gold">AveGestoria</span>
            </Link>
            <h1 className="text-2xl font-bold text-stone-100 mt-4">
              Entrar
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Accede a tu granja
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-stone-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-brand-green-deeper/60 border border-brand-green/40 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-emerald-950/60 border border-emerald-700/40 rounded-xl px-4 py-3 pr-10 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
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

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 text-brand-green-deeper font-bold py-3 rounded-xl text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/es/auth/register" className="text-brand-gold hover:text-brand-gold-light font-medium">
              Crea una
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
