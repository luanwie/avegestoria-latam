"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import PredictionsCards from "@/components/dashboard/PredictionsCards";
import { DRECard } from "@/components/dashboard/DRECard";
import { FCRAlertBanner } from "@/components/dashboard/FCRAlertBanner";
import { KPISkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import { hubLinks } from "@/components/dashboard/links";

interface KpiData {
  value: string;
  change: string | null;
}

interface DashboardData {
  kpis: {
    huevosHoy: KpiData;
    taxaPostura: KpiData;
    ingresoMensual: KpiData;
    mortalidad: KpiData;
  };
  galpones: Array<{ id: string; nombre: string; lotes: number; aves: number }>;
  lotes: Array<{
    id: string;
    nombre: string;
    galpon: string;
    raza: string;
    cantidad: number;
    edad: string;
    postura: string;
    estado: string;
  }>;
  chartData: Array<{
    fecha: string;
    ingresos: number;
    gastos: number;
    huevos: number;
    mortalidad: number;
  }>;
  actividades: Array<{ fecha: string; accion: string; detalle: string }>;
  resumen: {
    galpones: number;
    lotes: number;
    aves: number;
    produccionTotal: number;
    ingresoPeriodo: number;
    gastoPeriodo: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = (session?.user as { plan?: string } | undefined)?.plan || "none";
  const isEsencial = plan === "esencial" || plan === "none";
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [fcrData, setFcrData] = useState<any>(null);

  const periodo = searchParams.get("periodo") || "7";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/data?periodo=${periodo}`);
      if (!res.ok) throw new Error("Error fetching data");
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, fetchData]);

  // Fetch predictions (only for profesional+)
  useEffect(() => {
    if (status === "authenticated" && !isEsencial) {
      setPredictionLoading(true);
      fetch("/api/granja/previsoes")
        .then((r) => r.json())
        .then((d) => {
          if (d.datos) setPredictionData(d);
        })
        .catch(() => {})
        .finally(() => setPredictionLoading(false));
    }
  }, [status]);

  // Fetch FCR alerts (only for profesional+)
  useEffect(() => {
    if (status === "authenticated" && !isEsencial) {
      fetch("/api/granja/fcr")
        .then((r) => r.json())
        .then((d) => {
          if (d.hasAlerts) setFcrData(d);
        })
        .catch(() => {});
    }
  }, [status]);

  if (status === "loading" || (status === "authenticated" && loading && !data)) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
          <KPISkeleton />
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/es/auth/login");
    return null;
  }

  const kpis = data?.kpis;

  return (
    <DashboardShell>
      {/* Period + QuickActions row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <PeriodFilter />
        <div className="flex flex-wrap gap-2">
          {!isEsencial && (
            <Link
              href="/es/granja/produccion"
              className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 px-3 py-2 rounded-lg text-xs text-stone-300 transition-all"
            >
              Registrar Producción
            </Link>
          )}
          <Link
            href="/es/granja/finanzas/ventas"
            className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 px-3 py-2 rounded-lg text-xs text-stone-300 transition-all"
          >
            Nueva Venta
          </Link>
          <Link
            href="/es/granja/finanzas/gastos"
            className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 px-3 py-2 rounded-lg text-xs text-stone-300 transition-all"
          >
            Nuevo Gasto
          </Link>
        </div>
      </div>

      {/* FCR Alert */}
      {!isEsencial && fcrData && <FCRAlertBanner producciones={[]} loading={false} />}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {!isEsencial && [
          { label: "Huevos Hoy", kpi: kpis?.huevosHoy, color: "emerald" },
          { label: "Tasa de Postura", kpi: kpis?.taxaPostura, color: "teal" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-xl p-4 bg-${item.color}-900/20 border border-${item.color}-800/20 gold-glow`}
          >
            <p className="text-xs text-stone-400 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-stone-100">
              {item.kpi?.value || "—"}
            </p>
            {item.kpi?.change && (
              <p className="text-xs text-emerald-400 mt-1">{item.kpi.change}</p>
            )}
          </motion.div>
        ))}
        {[
          { label: "Ingreso del Período", kpi: isEsencial ? (data?.resumen ? { value: `$${data.resumen.ingresoPeriodo.toFixed(0)}`, change: null } : null) : kpis?.ingresoMensual, color: "amber" },
          { label: isEsencial ? "Gasto del Período" : "Mortalidad Hoy", kpi: isEsencial ? (data?.resumen ? { value: `$${data.resumen.gastoPeriodo.toFixed(0)}`, change: null } : null) : kpis?.mortalidad, color: isEsencial ? "rose" : "rose" },
        ].map((item, i) => (
          <motion.div
            key={i + 2}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: (i + 2) * 0.08 }}
            className={`rounded-xl p-4 bg-${item.color}-900/20 border border-${item.color}-800/20 gold-glow`}
          >
            <p className="text-xs text-stone-400 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-stone-100">
              {item.kpi?.value || "—"}
            </p>
            {item.kpi?.change && (
              <p className="text-xs text-emerald-400 mt-1">{item.kpi.change}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* DRE */}
      <div className="mb-6">
        <DRECard
          ingresos={data?.resumen?.ingresoPeriodo || 0}
          gastos={data?.resumen?.gastoPeriodo || 0}
          lucro={(data?.resumen?.ingresoPeriodo || 0) - (data?.resumen?.gastoPeriodo || 0)}
          margen={data?.resumen?.ingresoPeriodo ? (((data.resumen.ingresoPeriodo - data.resumen.gastoPeriodo) / data.resumen.ingresoPeriodo) * 100) : 0}
          loading={loading}
        />
      </div>

      {/* Charts — only for profesional+ */}
      {!isEsencial && data?.chartData && <DashboardCharts data={data.chartData} />}

      {/* Upgrade prompt for esencial users */}
      {isEsencial && (
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-5 text-center mb-6">
          <p className="text-sm text-stone-200 font-medium mb-1">
            ¿Quieres ver producción, lotes y predicciones?
          </p>
          <p className="text-xs text-stone-400 mb-3">
            Actualiza al plan Profesional y desbloquea todas las funcionalidades.
          </p>
          <Link
            href="/es/prices"
            className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs transition-all"
          >
            Ver Plan Profesional
          </Link>
        </div>
      )}

      {/* Sections only for profesional+ */}
      {!isEsencial && (
        <>
          {/* DRE + Galpones */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-bg-secondary border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-stone-200 mb-4">Mis Galpones</h3>
              {data?.galpones.length ? (
                <div className="space-y-3">
                  {data.galpones.map((g) => (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3 gold-glow"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-200">{g.nombre}</p>
                        <p className="text-xs text-stone-500">{g.lotes} lotes • {g.aves.toLocaleString()} aves</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 text-center py-6">Crea tu primer galpón para empezar</p>
              )}
            </div>

            <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-stone-200 mb-4">Actividades Recientes</h3>
              {data?.actividades.length ? (
                <div className="space-y-3">
                  {data.actividades.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 pb-3 border-b border-emerald-800/20 last:border-0"
                    >
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-800/40 flex items-center justify-center">
                          <span className="text-xs text-teal-400 font-bold">
                            {a.accion === "Registró producción" ? "P" : "V"}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-stone-200">{a.accion}</p>
                        <p className="text-xs text-stone-500">{a.detalle}</p>
                        <p className="text-[10px] text-stone-600 mt-0.5">{a.fecha}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 text-center py-6">Sin actividades recientes</p>
              )}
            </div>
          </div>

          {/* Lotes Table */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-emerald-800/30">
              <h3 className="text-sm font-semibold text-stone-200">Rendimiento por Lote</h3>
            </div>
            {data?.lotes.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-emerald-800/20">
                    <tr>
                      {["Nombre", "Galpón", "Raza", "Cant.", "Edad", "Estado"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-stone-400 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.lotes.map((l) => (
                      <tr key={l.id} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                        <td className="px-3 py-2.5 text-stone-200">{l.nombre}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.galpon}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.raza}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.cantidad}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.edad}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded-full">{l.estado}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-stone-500 text-center py-8">Registra tu primer lote para ver el rendimiento</p>
            )}
          </div>

          {/* Resumen Rápido */}
          {data?.resumen && (
            <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-stone-200 mb-4">Resumen Rápido</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {[
                  { label: "Galpones", value: data.resumen.galpones },
                  { label: "Lotes", value: data.resumen.lotes },
                  { label: "Aves", value: data.resumen.aves.toLocaleString() },
                  { label: "Producción (período)", value: data.resumen.produccionTotal.toLocaleString() },
                  { label: "Ingresos", value: `$${data.resumen.ingresoPeriodo.toFixed(2)}` },
                  { label: "Gastos", value: `$${data.resumen.gastoPeriodo.toFixed(2)}` },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xl font-bold text-teal-300">{s.value}</p>
                    <p className="text-xs text-stone-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictions */}
          <div className="mt-6">
            <PredictionsCards data={predictionData} loading={predictionLoading} />
          </div>
        </>
      )}

      {/* Bienvenida */}
      {(!data || data.galpones.length === 0) && !loading && (
        <div className="mt-6 bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-8 text-center">
          <p className="text-sm text-stone-400 mb-2">
            🎉 Bienvenido, {session?.user?.name || "Productor"}
          </p>
          <p className="text-sm text-stone-500">
            {isEsencial
              ? "Empieza registrando ventas y gastos para ver tus finanzas aquí"
              : "Crea tu primer galpón y lote para ver los datos aquí"}
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
