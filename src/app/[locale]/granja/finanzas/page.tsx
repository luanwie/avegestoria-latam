"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Link from "next/link";
import {
  DollarSign, TrendingUp, Wallet, Percent,
  Plus, BarChart3, ArrowUpRight, Layers,
  FileText, Calendar,
} from "lucide-react";

const DAYS_OPTIONS = [
  { label: "7 días", value: 7 },
  { label: "30 días", value: 30 },
  { label: "60 días", value: 60 },
  { label: "90 días", value: 90 },
];

const CATEGORY_COLORS: Record<string, string> = {
  racion: "bg-amber-500",
  medicinas: "bg-rose-500",
  vacunas: "bg-purple-500",
  electricidad: "bg-blue-500",
  agua: "bg-cyan-500",
  mantenimiento: "bg-orange-500",
  transporte: "bg-yellow-500",
  mano_obra: "bg-pink-500",
  otro: "bg-stone-500",
};

const CATEGORY_LABELS: Record<string, string> = {
  racion: "Ración",
  medicinas: "Medicinas",
  vacunas: "Vacunas",
  electricidad: "Electricidad",
  agua: "Agua",
  mantenimiento: "Mantenimiento",
  transporte: "Transporte",
  mano_obra: "Mano de Obra",
  otro: "Otros",
};

export default function FinanzasDashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<{
    totalIngresos: number;
    totalGastos: number;
    lucro: number;
    margen: number;
    gastosPorCategoria: { categoria: string; total: number }[];
    gastosPorLote: { loteId: string; loteNombre: string; total: number }[];
    ingresosPorMes: { mes: string; total: number }[];
    gastosPorMes: { mes: string; total: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const desde = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
    const hasta = new Date().toISOString().split("T")[0];

    fetch(`/api/granja/finanzas/resumen?desde=${desde}&hasta=${hasta}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [days]);

  const kpis = data
    ? [
        {
          label: "Ingresos Totales",
          value: `$${data.totalIngresos.toLocaleString("es")}`,
          icon: DollarSign,
          color: "emerald",
        },
        {
          label: "Gastos Totales",
          value: `$${data.totalGastos.toLocaleString("es")}`,
          icon: TrendingUp,
          color: "rose",
        },
        {
          label: "Lucro",
          value: `$${data.lucro.toLocaleString("es")}`,
          icon: Wallet,
          color: data.lucro >= 0 ? "amber" : "red",
        },
        {
          label: "Margen",
          value: `${data.margen.toFixed(1)}%`,
          icon: Percent,
          color: data.margen >= 0 ? "teal" : "red",
        },
      ]
    : [];

  const maxCategoria = data
    ? Math.max(...data.gastosPorCategoria.map((c) => c.total), 1)
    : 1;
  const maxMes = data
    ? Math.max(
        ...data.ingresosPorMes.map((m) => m.total),
        ...data.gastosPorMes.map((m) => m.total),
        1
      )
    : 1;
  const maxLote = data
    ? Math.max(...data.gastosPorLote.map((l) => l.total), 1)
    : 1;

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-100">Dashboard Financiero</h2>
          <p className="text-xs text-stone-500 mt-0.5">Resumen de ingresos, gastos y rentabilidad</p>
        </div>
        <div className="flex items-center gap-2">
          {DAYS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                days === opt.value
                  ? "bg-brand-gold text-brand-green-deeper font-bold"
                  : "bg-emerald-800/30 text-stone-400 hover:bg-emerald-700/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/es/granja/finanzas/gastos"
          className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs font-medium transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar Gasto
        </Link>
        <Link
          href="/es/granja/finanzas/ventas"
          className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 px-4 py-2 rounded-lg text-xs text-stone-300 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar Venta
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data ? (
        <div className="text-center py-20 text-stone-500 text-sm">
          Error al cargar datos financieros
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-xl p-4 border ${
                  kpi.color === "red"
                    ? "bg-red-900/20 border-red-800/30"
                    : `bg-${kpi.color}-900/30 border-${kpi.color}-800/30`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-stone-400">{kpi.label}</p>
                  <kpi.icon className="w-4 h-4 text-stone-500" />
                </div>
                <p className={`text-2xl font-bold ${
                  kpi.color === "red" ? "text-red-400" : "text-stone-100"
                }`}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Gastos por Categoría */}
            <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-gold" />
                            Gastos por Categoría
              </h3>
              {data.gastosPorCategoria.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-8">Sin gastos en este período</p>
              ) : (
                <div className="space-y-3">
                  {data.gastosPorCategoria.map((cat) => (
                    <div key={cat.categoria}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat.categoria] || "bg-stone-500"}`} />
                          <span className="text-xs text-stone-300">{CATEGORY_LABELS[cat.categoria] || cat.categoria}</span>
                        </div>
                        <span className="text-xs text-stone-400">${cat.total.toLocaleString("es")}</span>
                      </div>
                      <div className="w-full h-2 bg-emerald-950/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${CATEGORY_COLORS[cat.categoria] || "bg-stone-500"}`}
                          style={{ width: `${(cat.total / maxCategoria) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ingresos vs Gastos por Mes */}
            <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-gold" />
                            Ingresos vs Gastos por Mes
              </h3>
              {data.ingresosPorMes.length === 0 && data.gastosPorMes.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-8">Sin datos en este período</p>
              ) : (
                <div className="space-y-3">
                  {Array.from(
                    new Set([
                      ...data.ingresosPorMes.map((m) => m.mes),
                      ...data.gastosPorMes.map((m) => m.mes),
                    ])
                  )
                    .sort()
                    .map((mes) => {
                      const ingreso = data.ingresosPorMes.find((m) => m.mes === mes)?.total || 0;
                      const gasto = data.gastosPorMes.find((m) => m.mes === mes)?.total || 0;
                      const [year, month] = mes.split("-");
                      const label = `${month}/${year.slice(2)}`;
                      return (
                        <div key={mes}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-stone-400">{label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-emerald-400">${ingreso.toLocaleString("es")}</span>
                              <span className="text-[11px] text-rose-400">${gasto.toLocaleString("es")}</span>
                            </div>
                          </div>
                          <div className="w-full h-4 bg-emerald-950/60 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-emerald-600/60 rounded-l-full transition-all"
                              style={{ width: `${(ingreso / maxMes) * 100}%` }}
                            />
                            <div
                              className="h-full bg-rose-600/40 rounded-r-full transition-all"
                              style={{ width: `${(gasto / maxMes) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600/60" />
                  Ingresos
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-rose-600/40" />
                  Gastos
                </span>
              </div>
            </div>
          </div>

          {/* Gastos por Lote */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-gold" />
              Gastos por Lote
            </h3>
            {data.gastosPorLote.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-8">Sin gastos por lote en este período</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-emerald-800/20">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Lote</th>
                      <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Total Gastos</th>
                      <th className="px-3 py-2.5 text-right text-stone-400 font-medium">% del Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.gastosPorLote.map((lote) => (
                      <tr key={lote.loteId} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                        <td className="px-3 py-2.5 text-stone-200">{lote.loteNombre}</td>
                        <td className="px-3 py-2.5 text-right text-stone-200 font-medium">
                          ${lote.total.toLocaleString("es")}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-emerald-950/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${(lote.total / maxLote) * 100}%` }}
                              />
                            </div>
                            <span className="text-stone-400">
                              {data.totalGastos > 0
                                ? ((lote.total / data.totalGastos) * 100).toFixed(1)
                                : 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
