"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, DollarSign, TrendingDown, TrendingUp, Egg, Skull, Activity, PackageOpen, MessageCircle } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminLinks } from "@/components/dashboard/links";

interface GranjaData {
  profile: {
    name: string | null;
    email: string | null;
    nombreGranja: string | null;
    ciudad: string | null;
    pais: string | null;
    plan: string;
    whatsappNumber: string | null;
    totalAves: number;
    lotesCount: number;
  };
  resumen: {
    huevosHoy: number;
    mortalidadHoy: number;
    huevosMes: number;
    ingresoMes: number;
    gastoMes: number;
    lucroMes: number;
    margen: number;
  };
  lotes: Array<{
    id: string;
    nombre: string;
    galpon: string;
    raza: string;
    cantidadAves: number;
    fechaIngreso: string;
    estado: string;
    costoAve: number | null;
  }>;
  ventas: Array<{
    id: string;
    fecha: string;
    clienteNombre: string | null;
    docenas: number;
    precioPorDocena: number;
    total: number;
    metodoPago: string;
  }>;
  gastos: Array<{
    id: string;
    fecha: string;
    categoria: string;
    monto: number;
    descripcion: string | null;
    loteNombre: string | null;
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  racion: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  medicinas: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  vacunas: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  electricidad: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  agua: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  mantenimiento: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  transporte: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  mano_obra: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  otro: "bg-stone-500/20 text-stone-400 border-stone-500/30",
};

const PLAN_LABELS: Record<string, string> = {
  none: "Sin plan",
  esencial: "Esencial",
  profesional: "Profesional",
  profesional_plus: "Profesional+",
};

export default function AdminGranjaDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<GranjaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"resumen" | "lotes" | "ventas" | "gastos">("resumen");

  const fetchData = useCallback(() => {
    fetch(`/api/admin/granjas/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          router.push("/es/admin");
          return;
        }
        setData(d);
        setLoading(false);
      })
      .catch(() => router.push("/es/admin"));
  }, [id, router]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/es/dashboard");
      return;
    }
    fetchData();
  }, [status, session, router, fetchData]);

  if (status === "loading" || loading) {
    return (
      <DashboardShell links={adminLinks}>
        <div className="py-20 text-center text-stone-500 text-sm">Cargando datos de la granja...</div>
      </DashboardShell>
    );
  }

  if (!data) return null;

  const { profile, resumen } = data;

  return (
    <DashboardShell links={adminLinks}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/es/admin")}
            className="text-stone-400 hover:text-stone-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-100">{profile.nombreGranja || "Granja"}</h1>
            <p className="text-xs text-stone-500">
              {profile.name} · {profile.email}
              {profile.ciudad && ` · ${profile.ciudad}`}
              {profile.pais && `, ${profile.pais}`}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded-full">
              {PLAN_LABELS[profile.plan] || profile.plan}
            </span>
            {profile.whatsappNumber && (
              <a
                href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] bg-emerald-800/30 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded-full hover:bg-emerald-800/50 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-[10px] mb-1">
              <Egg className="w-3 h-3" /> Huevos Hoy
            </div>
            <p className="text-lg font-bold text-stone-100">{resumen.huevosHoy.toLocaleString()}</p>
          </div>
          <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-[10px] mb-1">
              <Skull className="w-3 h-3" /> Mortalidad Hoy
            </div>
            <p className="text-lg font-bold text-stone-100">{resumen.mortalidadHoy}</p>
          </div>
          <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-[10px] mb-1">
              <TrendingUp className="w-3 h-3" /> Ingreso Mes
            </div>
            <p className="text-lg font-bold text-emerald-400">${resumen.ingresoMes.toLocaleString()}</p>
          </div>
          <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-[10px] mb-1">
              <DollarSign className="w-3 h-3" /> Lucro Mes
            </div>
            <p className={`text-lg font-bold ${resumen.lucroMes >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ${resumen.lucroMes.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Margen bar */}
        <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-400">Margen del mes</span>
            <span className={`text-xs font-bold ${resumen.margen >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {resumen.margen}%
            </span>
          </div>
          <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${resumen.margen >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
              style={{ width: `${Math.min(Math.abs(resumen.margen), 100)}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-brand-green/30 pb-2">
          {([
            ["resumen", "Resumen", Activity],
            ["lotes", "Lotes", Egg],
            ["ventas", "Ventas", TrendingUp],
            ["gastos", "Gastos", TrendingDown],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                tab === key
                  ? "bg-brand-green/40 text-stone-100"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "resumen" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-stone-400 mb-3">Datos de la Granja</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total aves</span>
                  <span className="text-stone-200">{profile.totalAves.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Lotes</span>
                  <span className="text-stone-200">{profile.lotesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Huevos hoy</span>
                  <span className="text-stone-200">{resumen.huevosHoy.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Huevos mes</span>
                  <span className="text-stone-200">{resumen.huevosMes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Mortalidad hoy</span>
                  <span className="text-stone-200">{resumen.mortalidadHoy}</span>
                </div>
              </div>
            </div>
            <div className="bg-brand-green/20 border border-brand-green/30 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-stone-400 mb-3">Resumen Financiero (mes)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Ingresos</span>
                  <span className="text-emerald-400">${resumen.ingresoMes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Gastos</span>
                  <span className="text-rose-400">${resumen.gastoMes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-brand-green/30 pt-2 mt-2">
                  <span className="text-stone-400 font-medium">Lucro</span>
                  <span className={`font-bold ${resumen.lucroMes >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    ${resumen.lucroMes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "lotes" && (
          <div className="overflow-x-auto">
            {data.lotes.length === 0 ? (
              <p className="text-center py-10 text-stone-500 text-sm">Sin lotes registrados</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-brand-green/40 text-stone-500">
                    <th className="text-left px-3 py-2.5">Nombre</th>
                    <th className="text-left px-3 py-2.5">Galpón</th>
                    <th className="text-left px-3 py-2.5">Raza</th>
                    <th className="text-right px-3 py-2.5">Aves</th>
                    <th className="text-center px-3 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lotes.map((l) => (
                    <tr key={l.id} className="border-b border-brand-green/20 hover:bg-brand-green/30">
                      <td className="px-3 py-2.5 text-stone-200">{l.nombre}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.galpon}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.raza}</td>
                      <td className="px-3 py-2.5 text-right text-stone-200">{l.cantidadAves.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          l.estado === "activo"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-stone-700/40 text-stone-500"
                        }`}>
                          {l.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "ventas" && (
          <div className="overflow-x-auto">
            {data.ventas.length === 0 ? (
              <p className="text-center py-10 text-stone-500 text-sm">Sin ventas registradas</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-brand-green/40 text-stone-500">
                    <th className="text-left px-3 py-2.5">Fecha</th>
                    <th className="text-left px-3 py-2.5">Cliente</th>
                    <th className="text-right px-3 py-2.5">Docenas</th>
                    <th className="text-right px-3 py-2.5">Precio/Doc</th>
                    <th className="text-right px-3 py-2.5">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ventas.map((v) => (
                    <tr key={v.id} className="border-b border-brand-green/20 hover:bg-brand-green/30">
                      <td className="px-3 py-2.5 text-stone-200">{new Date(v.fecha).toLocaleDateString("es-ES")}</td>
                      <td className="px-3 py-2.5 text-stone-400">{v.clienteNombre || "—"}</td>
                      <td className="px-3 py-2.5 text-right text-stone-200">{v.docenas}</td>
                      <td className="px-3 py-2.5 text-right text-stone-400">${v.precioPorDocena}</td>
                      <td className="px-3 py-2.5 text-right text-stone-200">${v.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "gastos" && (
          <div className="overflow-x-auto">
            {data.gastos.length === 0 ? (
              <p className="text-center py-10 text-stone-500 text-sm">Sin gastos registrados</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-brand-green/40 text-stone-500">
                    <th className="text-left px-3 py-2.5">Fecha</th>
                    <th className="text-left px-3 py-2.5">Categoría</th>
                    <th className="text-left px-3 py-2.5">Lote</th>
                    <th className="text-right px-3 py-2.5">Monto</th>
                    <th className="text-left px-3 py-2.5">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gastos.map((g) => (
                    <tr key={g.id} className="border-b border-brand-green/20 hover:bg-brand-green/30">
                      <td className="px-3 py-2.5 text-stone-200">{new Date(g.fecha).toLocaleDateString("es-ES")}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[g.categoria] || CATEGORY_COLORS.otro}`}>
                          {g.categoria}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-stone-400">{g.loteNombre || "—"}</td>
                      <td className="px-3 py-2.5 text-right text-rose-400">${g.monto.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-stone-400">{g.descripcion || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
