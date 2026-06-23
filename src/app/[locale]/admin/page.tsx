"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, TrendingUp, MousePointerClick, Users, Globe, ArrowRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminLinks } from "@/components/dashboard/links";

interface Analytics {
  totalVisitors: number;
  totalPageViews: number;
  ctaClicks: number;
  topPages: Array<{ path: string; count: number }>;
  topCTAs: Array<{ cta: string; count: number }>;
  dailyViews: Array<{ date: string; count: number }>;
}

interface GranjaSummary {
  id: string;
  name: string | null;
  email: string | null;
  granjaName: string;
  pais: string | null;
  plan: string;
  whatsappNumber: string | null;
  totalAves: number;
  lotesCount: number;
}

const PLAN_LABELS: Record<string, string> = {
  none: "Sin plan",
  esencial: "Esencial",
  profesional: "Profesional",
  profesional_plus: "Profesional+",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [granjas, setGranjas] = useState<GranjaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/es/dashboard");
      return;
    }

    Promise.all([
      fetch("/api/admin/analytics").then((r) => r.json()),
      fetch("/api/admin/granjas").then((r) => r.json()),
    ])
      .then(([analyticsData, granjasData]) => {
        if (!analyticsData.error) setAnalytics(analyticsData);
        if (!granjasData.error) setGranjas(Array.isArray(granjasData) ? granjasData : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar datos");
        setLoading(false);
      });
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <DashboardShell links={adminLinks}>
        <div className="py-20 text-center text-stone-500 text-sm">Cargando...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell links={adminLinks}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Analytics Header */}
        <div>
          <h1 className="text-xl font-bold text-stone-100">Panel de Administración</h1>
          <p className="text-sm text-stone-500 mt-1">Analytics del sitio y granjas que comparten datos</p>
        </div>

        {/* KPI Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                <Users className="w-3.5 h-3.5" />
                Visitantes (30d)
              </div>
              <p className="text-2xl font-bold text-stone-100">{analytics.totalVisitors}</p>
            </div>
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                <Globe className="w-3.5 h-3.5" />
                Páginas Vistas (30d)
              </div>
              <p className="text-2xl font-bold text-stone-100">{analytics.totalPageViews}</p>
            </div>
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                <MousePointerClick className="w-3.5 h-3.5" />
                Clicks en CTA (30d)
              </div>
              <p className="text-2xl font-bold text-stone-100">{analytics.ctaClicks}</p>
            </div>
          </div>
        )}

        {/* Top Pages + Top CTAs */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-brand-gold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Páginas (7 días)
              </h3>
              <div className="space-y-2">
                {analytics.topPages.length === 0 && (
                  <p className="text-xs text-stone-500">Sin datos aún</p>
                )}
                {analytics.topPages.map((p) => (
                  <div key={p.path} className="flex items-center justify-between">
                    <span className="text-xs text-stone-300 truncate max-w-[200px]">{p.path}</span>
                    <span className="text-xs text-stone-500">{p.count} visitas</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-brand-gold mb-3 flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" />
                CTAs Más Clickeados (30 días)
              </h3>
              <div className="space-y-2">
                {analytics.topCTAs.length === 0 && (
                  <p className="text-xs text-stone-500">Sin datos aún</p>
                )}
                {analytics.topCTAs.map((c) => (
                  <div key={c.cta} className="flex items-center justify-between">
                    <span className="text-xs text-stone-300">{c.cta}</span>
                    <span className="text-xs text-stone-500">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Granjas Section */}
        <div>
          <h2 className="text-lg font-bold text-stone-100 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-gold" />
            Granjas que Comparten Datos
          </h2>

          {granjas.length === 0 ? (
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-8 text-center">
              <EyeOff className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-sm text-stone-500">Ninguna granja ha compartido sus datos aún</p>
              <p className="text-xs text-stone-600 mt-1">
                Cuando un usuario active "Compartir datos" en su Perfil, aparecerá aquí
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {granjas.map((g) => (
                <div
                  key={g.id}
                  className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4 hover:bg-brand-green/30 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-100">
                        {g.granjaName}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {g.name || "—"} · {g.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded-full">
                          {PLAN_LABELS[g.plan] || g.plan}
                        </span>
                        <span className="text-[10px] bg-stone-700/40 text-stone-400 px-2 py-0.5 rounded-full">
                          {g.totalAves.toLocaleString()} aves · {g.lotesCount} lotes
                        </span>
                        {g.pais && (
                          <span className="text-[10px] text-stone-500">{g.pais}</span>
                        )}
                      </div>
                      {g.whatsappNumber && (
                        <p className="text-[10px] text-stone-500 mt-1">WhatsApp: {g.whatsappNumber}</p>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/es/admin/granjas/${g.id}`)}
                      className="flex items-center gap-1 text-xs text-brand-gold hover:text-brand-gold-light transition-colors"
                    >
                      Ver datos
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </DashboardShell>
  );
}
