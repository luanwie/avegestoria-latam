"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Link from "next/link";
import { FileText, BarChart3, DollarSign } from "lucide-react";
import { useRequirePlan } from "@/hooks/useRequirePlan";

const reports = [
  {
    id: "produccion",
    title: "Informe de Producción",
    desc: "Resumen de producción de huevos, tasa de postura y mortalidad por período.",
    icon: BarChart3,
    href: "/es/granja/informes/produccion",
  },
  {
    id: "financiero",
    title: "Informe Financiero",
    desc: "Ingresos, gastos, rentabilidad y margen por período.",
    icon: DollarSign,
    href: "/es/granja/informes/financiero",
  },
  {
    id: "lote",
    title: "Informe por Lote",
    desc: "Rendimiento detallado de cada lote activo con costos y producción.",
    icon: FileText,
    href: "/es/granja/informes/lote",
  },
];

export default function InformesHub() {
  useRequirePlan("esencial");
  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-stone-400 mb-6">
          Selecciona el tipo de informe que deseas generar
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={r.href}
              className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-6 hover:bg-emerald-900/50 transition-all text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-800/30 flex items-center justify-center">
                <r.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-sm font-semibold text-stone-200 mb-2">
                {r.title}
              </h3>
              <p className="text-xs text-stone-500">{r.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
