"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Printer } from "lucide-react";

export default function ReportePorLote() {
  const [data, setData] = useState<any>(null);
  const [periodo, setPeriodo] = useState("30");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const hasta = new Date().toISOString().split("T")[0];
    const desde = new Date(Date.now() - parseInt(periodo) * 86400000).toISOString().split("T")[0];
    fetch(`/api/granja/informes/lote?desde=${desde}&hasta=${hasta}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [periodo]);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex bg-emerald-900/40 border border-emerald-800/40 rounded-lg p-0.5">
          {["7", "30", "60", "90"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                periodo === p
                  ? "bg-emerald-700/50 text-stone-100"
                  : "text-stone-400 hover:text-stone-300"
              }`}
            >
              {p} días
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
      ) : data && data.lotes.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-xl font-bold text-stone-100">Informe por Lote</h1>
            <p className="text-sm text-stone-500 mt-1">
              {data.periodo.desde} → {data.periodo.hasta} • {data.resumen.activos} activos de {data.resumen.totalLotes} totales
            </p>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-emerald-800/20">
                  <tr>
                    {["Lote", "Galpón", "Raza", "Aves", "Edad", "Estado", "Producción", "Postura", "Mortalidad", "Gastos"].map(
                      (h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-stone-400 font-medium">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.lotes.map((l: any, i: number) => (
                    <tr
                      key={i}
                      className="border-t border-emerald-800/20 hover:bg-emerald-800/20"
                    >
                      <td className="px-3 py-2.5 text-stone-200 font-medium">{l.nombre}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.galpon}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.raza}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.aves}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.edad}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            l.estado === "activo"
                              ? "bg-emerald-600/20 text-emerald-400"
                              : "bg-stone-600/20 text-stone-400"
                          }`}
                        >
                          {l.estado}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-stone-200 font-medium">{l.produccion}</td>
                      <td className="px-3 py-2.5 text-emerald-400 font-medium">{l.tasaPostura}</td>
                      <td className="px-3 py-2.5 text-rose-400">{l.mortalidad}</td>
                      <td className="px-3 py-2.5 text-amber-400">${l.gastos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-stone-500 text-sm">
          {data ? "No hay lotes registrados" : "Cargando..."}
        </div>
      )}
    </DashboardShell>
  );
}
