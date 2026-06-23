"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import { KPISkeleton } from "@/components/ui/Skeleton";
import { TrendingUp, TrendingDown, Egg, Skull, AlertTriangle, ChevronRight } from "lucide-react";

interface LoteKpi {
  id: string; nombre: string; galpon: string; raza: string;
  cantidadAves: number; edadSemanas: number; huevosHoy: number;
  postura: number; mortalidad: number; fcr: number | null;
  costoAve: number | null; estado: string;
}

interface DashboardData {
  kpis: {
    lucro: { value: string; change: string };
    postura: { value: string; change: string | null };
    mortalidad: { value: string; change: string | null };
    fcr: { value: string; change: string | null };
  };
  lotes: LoteKpi[];
  gastosPorCategoria: Array<{ categoria: string; monto: number; pct: number }>;
  resumen: {
    ingresoPeriodo: number; gastoPeriodo: number; lucroPeriodo: number;
    margen: number; totalAves: number; huevosHoy: number; mortalidadHoy: number;
    lotesCount: number;
  };
  alertas: { fcr: string | null; mortalidad: string | null };
}

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = (session?.user as { plan?: string } | undefined)?.plan || "none";
  const isEsencial = plan === "esencial" || plan === "none";
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const periodo = searchParams.get("periodo") || "30";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/data?periodo=${periodo}`);
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [periodo]);

  useEffect(() => { if (status === "authenticated") fetchData(); }, [status, fetchData]);
  if (status === "unauthenticated") { router.push("/es/auth/login"); return null; }

  const kpis = data?.kpis;
  const resumen = data?.resumen;
  const alertas = data?.alertas;

  return (
    <DashboardShell>
      {loading && !data ? (
        <div className="max-w-6xl mx-auto"><KPISkeleton /></div>
      ) : data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-5">
          {/* Alertas */}
          {(alertas?.fcr || alertas?.mortalidad) && (
            <div className="bg-red-900/10 border border-red-700/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                {alertas.fcr && <p className="text-sm text-red-300">{alertas.fcr}</p>}
                {alertas.mortalidad && <p className="text-sm text-red-300 mt-0.5">{alertas.mortalidad}</p>}
              </div>
            </div>
          )}

          {/* KPIs + Periodo */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
              {[
                { label: "Lucro", value: kpis?.lucro?.value || "--", sub: kpis?.lucro?.change ? `${kpis.lucro.change} margen` : "", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/5 border-emerald-400/10" },
                { label: "FCR", value: kpis?.fcr?.value || "--", sub: "Promedio del período", icon: TrendingDown, color: "text-amber-400", bg: "bg-amber-400/5 border-amber-400/10" },
                { label: "Postura", value: kpis?.postura?.value || "0%", sub: "Tasa hoy", icon: Egg, color: "text-teal-400", bg: "bg-teal-400/5 border-teal-400/10" },
                { label: "Mortalidad", value: kpis?.mortalidad?.value || "0", sub: "Hoy", icon: Skull, color: "text-stone-400", bg: "bg-stone-400/5 border-stone-400/10" },
              ].map((k, i) => (
                <div key={i} className={`rounded-xl p-4 border ${k.bg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <k.icon className={`w-4 h-4 ${k.color}`} />
                    <span className="text-[11px] text-stone-500">{k.label}</span>
                  </div>
                  <p className={`text-xl font-bold ${k.color} tracking-tight`}>{k.value}</p>
                  {k.sub && <p className="text-[10px] text-stone-600 mt-0.5">{k.sub}</p>}
                </div>
              ))}
            </div>
            <PeriodFilter />
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            {!isEsencial && (
              <Link href="/es/granja/produccion" className="text-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors">
                + Producción
              </Link>
            )}
            <Link href="/es/granja/finanzas/ventas" className="text-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors">
              + Venta
            </Link>
            <Link href="/es/granja/finanzas/gastos" className="text-[12px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200 transition-colors">
              + Gasto
            </Link>
          </div>

          {/* Lote Comparison Cards */}
          {!isEsencial && data.lotes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-stone-300 mb-3 tracking-tight">Comparativo por Lote</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.lotes.map((l) => (
                  <div key={l.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-200">{l.nombre}</p>
                        <p className="text-[10px] text-stone-500">{l.raza} · {l.edadSemanas} sem</p>
                      </div>
                      <span className="text-[10px] bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/15">
                        {l.cantidadAves.toLocaleString()} aves
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white/[0.02] rounded-lg p-2">
                        <p className="text-stone-500">Postura</p>
                        <p className={`font-semibold ${l.postura >= 80 ? "text-emerald-400" : l.postura >= 70 ? "text-amber-400" : "text-red-400"}`}>
                          {l.postura.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-2">
                        <p className="text-stone-500">Huevos hoy</p>
                        <p className="font-semibold text-stone-200">{l.huevosHoy.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-2">
                        <p className="text-stone-500">FCR</p>
                        <p className={`font-semibold ${l.fcr && l.fcr <= 2.2 ? "text-emerald-400" : l.fcr && l.fcr <= 2.5 ? "text-amber-400" : "text-red-400"}`}>
                          {l.fcr?.toFixed(2) || "--"}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-2">
                        <p className="text-stone-500">Mortalidad</p>
                        <p className={`font-semibold ${l.mortalidad === 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {l.mortalidad}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DRE + Gastos por categoria */}
          {resumen && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* DRE Card */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-stone-300 mb-4">Demostrativo de Resultado</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-stone-400">Ingresos</span><span className="text-emerald-400 font-medium">${resumen.ingresoPeriodo.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-stone-400">Gastos</span><span className="text-red-400 font-medium">${resumen.gastoPeriodo.toLocaleString()}</span></div>
                  <div className="border-t border-white/[0.05] pt-2 flex justify-between">
                    <span className="text-stone-300 font-medium">Lucro Neto</span>
                    <span className={`font-bold ${resumen.lucroPeriodo >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      ${resumen.lucroPeriodo.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-500">Margen</span>
                    <span className="text-stone-400">{resumen.margen}%</span>
                  </div>
                </div>

                {/* Margen bar */}
                <div className="mt-3 w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(Math.abs(resumen.margen), 100)}%` }} />
                </div>
              </div>

              {/* Gastos por categoria */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-stone-300 mb-4">Gastos por Categoría</h3>
                <div className="space-y-2.5">
                  {data.gastosPorCategoria.slice(0, 6).map((g) => (
                    <div key={g.categoria}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-stone-400">{CAT_LABELS[g.categoria] || g.categoria}</span>
                        <span className="text-stone-300">${g.monto.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${CAT_COLORS[g.categoria] || "bg-stone-500"}`} style={{ width: `${g.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upgrade prompt */}
          {isEsencial && (
            <div className="bg-brand-gold/5 border border-brand-gold/15 rounded-xl p-5 text-center">
              <p className="text-sm text-stone-300 font-medium mb-1">¿Quieres ver producción y comparativo por lote?</p>
              <p className="text-xs text-stone-500 mb-3">Actualiza al plan Profesional.</p>
              <Link href="/es/prices" className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-brand-gold-light transition-colors">
                Ver Plan Profesional <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Resumen rápido */}
          {resumen && !isEsencial && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">Resumen del período</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "Aves Activas", value: resumen.totalAves.toLocaleString() },
                  { label: "Lotes", value: resumen.lotesCount },
                  { label: "Huevos Hoy", value: resumen.huevosHoy.toLocaleString() },
                  { label: "Mortalidad Hoy", value: resumen.mortalidadHoy },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-stone-200">{s.value}</p>
                    <p className="text-[10px] text-stone-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </DashboardShell>
  );
}
