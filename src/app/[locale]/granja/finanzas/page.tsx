"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Link from "next/link";
import { TrendingUp, TrendingDown, DollarSign, Plus, Calendar } from "lucide-react";

const DAYS = [{ label: "7d", value: 7 }, { label: "30d", value: 30 }, { label: "60d", value: 60 }, { label: "90d", value: 90 }];

const CAT_COLORS: Record<string, string> = {
  racion: "bg-amber-500", medicinas: "bg-rose-500", vacunas: "bg-purple-500",
  electricidad: "bg-blue-500", agua: "bg-cyan-500", mantenimiento: "bg-orange-500",
  transporte: "bg-yellow-500", mano_obra: "bg-pink-500", otro: "bg-stone-500",
};

const CAT_LABELS: Record<string, string> = {
  racion: "Ración", medicinas: "Medicinas", vacunas: "Vacunas",
  electricidad: "Electricidad", agua: "Agua", mantenimiento: "Mantenimiento",
  transporte: "Transporte", mano_obra: "Mano de obra", otro: "Otro",
};

export default function FinanzasPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/data?periodo=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const r = data?.resumen;
  const gastos = (data?.gastosPorCategoria || []) as Array<{ categoria: string; monto: number; pct: number }>;

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header with period selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-200 tracking-tight">Demostrativo de Resultado</h2>
          <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
            {DAYS.map((d) => (
              <button key={d.value} onClick={() => setDays(d.value)}
                className={`px-3 py-1.5 text-[11px] rounded-md transition-colors ${days === d.value ? "bg-brand-gold/15 text-brand-gold" : "text-stone-500 hover:text-stone-300"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Cargando...</div>
        ) : r ? (
          <>
            {/* DRE Visual */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
              {/* Ingresos */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Ingresos</span>
                  <span className="text-emerald-400 font-semibold">${r.ingresoPeriodo.toLocaleString()}</span>
                </div>
                <div className="w-full h-8 bg-white/[0.03] rounded-lg overflow-hidden flex">
                  <div className="h-full bg-emerald-500/60 rounded-lg" style={{ width: "100%" }} />
                </div>
              </div>

              {/* Gastos breakdown */}
              <div className="space-y-2.5 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Gastos</p>
                {gastos.map((g) => (
                  <div key={g.categoria}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-stone-400">{CAT_LABELS[g.categoria] || g.categoria}</span>
                      <span className="text-stone-300">${g.monto.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/[0.03] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${CAT_COLORS[g.categoria] || "bg-stone-500"}`}
                        style={{ width: `${g.pct}%`, maxWidth: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Lucro Neto */}
              <div className="border-t border-white/[0.06] pt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-stone-200 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-brand-gold" /> Lucro Neto
                  </span>
                  <span className={`text-lg font-bold ${r.lucroPeriodo >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${r.lucroPeriodo.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] mt-1">
                  <span className="text-stone-500">Margen</span>
                  <span className="text-stone-400">{r.margen}%</span>
                </div>
              </div>
            </div>

            {/* KPIs row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Ingresos", value: `$${r.ingresoPeriodo.toLocaleString()}`, color: "text-emerald-400" },
                { label: "Gastos", value: `$${r.gastoPeriodo.toLocaleString()}`, color: "text-red-400" },
                { label: "Lucro", value: `$${r.lucroPeriodo.toLocaleString()}`, color: r.lucroPeriodo >= 0 ? "text-emerald-400" : "text-red-400" },
                { label: "Aves Activas", value: r.totalAves.toLocaleString(), color: "text-stone-300" },
              ].map((k, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                  <p className="text-[10px] text-stone-500 mb-1">{k.label}</p>
                  <p className={`text-base font-bold ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="flex gap-2">
              <Link href="/es/granja/finanzas/ventas" className="text-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Nueva Venta
              </Link>
              <Link href="/es/granja/finanzas/gastos" className="text-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Nuevo Gasto
              </Link>
            </div>
          </>
        ) : (
          <div className="py-20 text-center text-stone-500 text-sm">Sin datos financieros aún. Registra tu primera venta o gasto.</div>
        )}
      </div>
    </DashboardShell>
  );
}
