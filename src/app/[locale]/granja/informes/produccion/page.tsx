"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Printer, Download } from "lucide-react";

interface ReportData {
  periodo: { desde: string; hasta: string };
  resumen: Record<string, string>;
  detalle: Array<Record<string, string | number>>;
}

export default function ReporteProduccion() {
  const [data, setData] = useState<ReportData | null>(null);
  const [periodo, setPeriodo] = useState("30");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const hasta = new Date().toISOString().split("T")[0];
    const desde = new Date(Date.now() - parseInt(periodo) * 86400000).toISOString().split("T")[0];
    fetch(`/api/granja/informes/produccion?desde=${desde}&hasta=${hasta}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [periodo]);

  return (
    <DashboardShell>
      {/* Period filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex bg-emerald-900/40 border border-emerald-800/40 rounded-lg p-0.5">
          {[
            { value: "7", label: "7 días" },
            { value: "30", label: "30 días" },
            { value: "60", label: "60 días" },
            { value: "90", label: "90 días" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                periodo === p.value
                  ? "bg-emerald-700/50 text-stone-100"
                  : "text-stone-400 hover:text-stone-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-500 text-sm">Cargando...</div>
      ) : !data ? (
        <div className="text-center py-12 text-stone-500 text-sm">
          No hay datos para este período
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-xl font-bold text-stone-100">Informe de Producción</h1>
            <p className="text-sm text-stone-500 mt-1">
              {data.periodo.desde} → {data.periodo.hasta}
            </p>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            {Object.entries(data.resumen).map(([key, val]) => (
              <div
                key={key}
                className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-4 text-center"
              >
                <p className="text-lg font-bold text-teal-300">{val}</p>
                <p className="text-xs text-stone-400 mt-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            ))}
          </div>

          {/* Tabla detalle */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-emerald-800/20">
                  <tr>
                    {["Fecha", "Lote", "Huevos", "Rotos", "Mortalidad"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-stone-400 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.detalle.map((d: any, i: number) => (
                    <tr
                      key={i}
                      className="border-t border-emerald-800/20 hover:bg-emerald-800/20"
                    >
                      <td className="px-3 py-2.5 text-stone-200">{d.fecha}</td>
                      <td className="px-3 py-2.5 text-stone-400">{d.lote}</td>
                      <td className="px-3 py-2.5 text-stone-200 font-medium">{d.huevos}</td>
                      <td className="px-3 py-2.5 text-stone-400">{d.rotos}</td>
                      <td className="px-3 py-2.5 text-rose-400">{d.mortalidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          body { background: white !important; color: black !important; }
          button { display: none !important; }
        }
      `}</style>
    </DashboardShell>
  );
}
