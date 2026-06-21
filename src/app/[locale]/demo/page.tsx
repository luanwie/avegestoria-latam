"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  ClipboardList,
  Egg,
  DollarSign,
  Package,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Plus,
  TrendingUp,
  EggOff,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

const MOCK_DATA = {
  kpis: {
    huevosHoy: { value: 6114, change: "+12.5%", positive: true },
    tasaPostura: { value: "88.5%", change: "+2.3%", positive: true },
    ingresoMensual: { value: "$24.6k", change: "+8.7%", positive: true },
    mortalidad: { value: 4, change: "Bajo media", positive: true },
  },
  misGalpones: [
    { nombre: "Galpón Principal", lotes: 2, aves: 3500 },
    { nombre: "Galpón Norte", lotes: 1, aves: 2000 },
    { nombre: "Galpón Sur", lotes: 1, aves: 1500 },
  ],
  lotes: [
    {
      nombre: "Lote A - Hy-Line Brown",
      galpon: "Principal",
      raza: "Hy-Line Brown",
      cantidad: 2000,
      edad: "28 sem",
      postura: "83.7%",
      status: "Activo",
    },
    {
      nombre: "Lote B - Hy-Line Brown",
      galpon: "Principal",
      raza: "Hy-Line Brown",
      cantidad: 1500,
      edad: "52 sem",
      postura: "76.2%",
      status: "Activo",
    },
    {
      nombre: "Lote C - Dekalb White",
      galpon: "Norte",
      raza: "Dekalb White",
      cantidad: 2000,
      edad: "15 sem",
      postura: "91.5%",
      status: "Activo",
    },
  ],
  actividades: [
    { fecha: "Hoy 06:30", accion: "Registró producción", detalle: "Lote A • 1.674 huevos" },
    { fecha: "Hoy 06:28", accion: "Registró producción", detalle: "Lote B • 1.143 huevos" },
    { fecha: "Ayer 18:00", accion: "Venta registrada", detalle: "148 docenas • $186.32" },
    { fecha: "Ayer 14:00", accion: "Nuevo gasto", detalle: "Ración • $320.00" },
    { fecha: "Ayer 06:45", accion: "Registró mortalidad", detalle: "Lote A • 2 aves" },
  ],
  resumen: { galpones: 3, lotes: 4, aves: 7000 },
};

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Registrar", icon: ClipboardList, href: "#" },
  { label: "Producción", icon: Egg, href: "#" },
  { label: "Finanzas", icon: DollarSign, href: "#" },
  { label: "Inventario", icon: Package, href: "#" },
  { label: "Equipo", icon: Users, href: "#" },
  { label: "Informes", icon: FileText, href: "#" },
];

export default function DemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTouch, setTouch] = useState(true);
  useEffect(() => setTouch(false), []);

  return (
    <div className="min-h-screen bg-emerald-950 text-stone-100 flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-emerald-900/60 border-r border-emerald-800/40 backdrop-blur-xl transform transition-transform duration-200 ${
          sidebarOpen || !isTouch ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-800/40">
          <Link href="/es" className="text-lg font-bold text-teal-300">
            AveGestoria
          </Link>
          <button
            className="md:hidden text-stone-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-emerald-800/40 hover:text-stone-100 transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </a>
          ))}
          <div className="border-t border-emerald-800/40 my-3 pt-3">
            <a
              href="/es"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-emerald-800/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </a>
          </div>
        </nav>
      </aside>

      {/* ── Mobile header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-emerald-900/80 backdrop-blur-lg border-b border-emerald-800/40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="text-stone-400">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-teal-300">AveGestoria</span>
        <div className="ml-auto">
          <span className="text-[10px] bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
            DEMO
          </span>
        </div>
      </div>

      {/* ── Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {/* Top bar */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-stone-100">Dashboard</h1>
            <span className="text-xs bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full font-medium">
              MODO DEMOSTRACIÓN
            </span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Huevos Hoy",
                value: MOCK_DATA.kpis.huevosHoy.value.toLocaleString(),
                change: MOCK_DATA.kpis.huevosHoy.change,
                color: "emerald",
              },
              {
                label: "Tasa de Postura",
                value: MOCK_DATA.kpis.tasaPostura.value,
                change: MOCK_DATA.kpis.tasaPostura.change,
                color: "teal",
              },
              {
                label: "Ingreso Mensual",
                value: MOCK_DATA.kpis.ingresoMensual.value,
                change: MOCK_DATA.kpis.ingresoMensual.change,
                color: "amber",
              },
              {
                label: "Mortalidad",
                value: MOCK_DATA.kpis.mortalidad.value.toString(),
                change: MOCK_DATA.kpis.mortalidad.change,
                color: "rose",
              },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl p-4 bg-${kpi.color}-900/30 border border-${kpi.color}-800/30`}
              >
                <p className="text-xs text-stone-400 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-stone-100">{kpi.value}</p>
                <p className="text-xs text-emerald-400 mt-1">{kpi.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: "Registrar Producción", icon: Plus },
              { label: "Nueva Venta", icon: DollarSign },
              { label: "Nuevo Gasto", icon: TrendingUp },
              { label: "Ver Lotes", icon: Egg },
            ].map((action, i) => (
              <button
                key={i}
                className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 px-3 py-2 rounded-lg text-xs text-stone-300 transition-all"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Charts + Galpones */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Chart placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                Ingresos vs Gastos
              </h3>
              <div className="h-40 flex items-center justify-center bg-emerald-950/40 rounded-lg">
                <div className="flex items-end gap-2 h-32">
                  {[65, 70, 55, 80, 75, 90, 85, 95, 78, 82, 88, 92].map(
                    (h, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 sm:w-8 bg-emerald-600/60 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                        <div
                          className="w-6 sm:w-8 bg-amber-600/40 rounded-t"
                          style={{ height: `${h * 0.7}%` }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-600/60" />
                  Ingresos
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-600/40" />
                  Gastos
                </span>
              </div>
            </motion.div>

            {/* Mis Galpones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-stone-200 mb-4">
                Mis Galpones
              </h3>
              <div className="space-y-3">
                {MOCK_DATA.misGalpones.map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-emerald-950/40 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-200">
                        {g.nombre}
                      </p>
                      <p className="text-xs text-stone-500">
                        {g.lotes} lotes • {g.aves.toLocaleString()} aves
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-500" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Lotes table + Actividades */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Tabla de Lotes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-emerald-800/30">
                <h3 className="text-sm font-semibold text-stone-200">
                  Rendimiento por Lote
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-emerald-800/20">
                    <tr>
                      {["Nombre", "Galpón", "Raza", "Cant.", "Edad", "Postura", "Estado"].map(
                        (h) => (
                          <th key={h} className="px-3 py-2.5 text-left text-stone-400 font-medium">
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DATA.lotes.map((l, i) => (
                      <tr key={i} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                        <td className="px-3 py-2.5 text-stone-200">{l.nombre}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.galpon}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.raza}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.cantidad}</td>
                        <td className="px-3 py-2.5 text-stone-400">{l.edad}</td>
                        <td className="px-3 py-2.5 text-emerald-400 font-medium">{l.postura}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded-full">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Actividades Recientes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-stone-200 mb-4">
                Actividades Recientes
              </h3>
              <div className="space-y-3">
                {MOCK_DATA.actividades.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-emerald-800/20 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-800/40 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-stone-200">{a.accion}</p>
                      <p className="text-xs text-stone-500">{a.detalle}</p>
                      <p className="text-[10px] text-stone-600 mt-0.5">{a.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Resumen Rápido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-stone-200 mb-4">
              Resumen Rápido
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Galpones", value: MOCK_DATA.resumen.galpones },
                { label: "Lotes", value: MOCK_DATA.resumen.lotes },
                { label: "Aves", value: MOCK_DATA.resumen.aves.toLocaleString() },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-teal-300">{s.value}</p>
                  <p className="text-xs text-stone-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              href="/es/auth/register"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-900/40"
            >
              <Egg className="w-4 h-4" />
              Probar gratis por 7 días
            </Link>
            <p className="text-xs text-stone-500 mt-3">
              Modo demostración — Los datos son ilustrativos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
