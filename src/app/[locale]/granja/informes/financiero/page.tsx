"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Printer } from "lucide-react";

interface ReportData {
  periodo: { desde: string; hasta: string };
  resumen: Record<string, string>;
  gastosPorCategoria: Array<{ categoria: string; total: number }>;
  detalleVentas: Array<Record<string, string | number>>;
  detalleGastos: Array<Record<string, string | number>>;
}

export default function ReporteFinanciero() {
  const [data, setData] = useState<ReportData | null>(null);
  const [periodo, setPeriodo] = useState("30");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const hasta = new Date().toISOString().split("T")[0];
    const desde = new Date(Date.now() - parseInt(periodo) * 86400000).toISOString().split("T")[0];
    fetch(`/api/granja/informes/financiero?desde=${desde}&hasta=${hasta}`)
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
      ) : data ? (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-xl font-bold text-stone-100">Informe Financiero</h1>
            <p className="text-sm text-stone-500 mt-1">
              {data.periodo.desde} → {data.periodo.hasta}
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {Object.entries(data.resumen).map(([key, val]) => (
              <div
                key={key}
                className={`rounded-xl p-4 text-center border ${
                  key === "lucro" && Number(val) < 0
                    ? "bg-rose-900/20 border-rose-800/30"
                    : "bg-emerald-900/30 border-emerald-800/30"
                }`}
              >
                <p className="text-lg font-bold text-teal-300">
                  {key === "margen" ? val : `$${val}`}
                </p>
                <p className="text-xs text-stone-400 mt-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            ))}
          </div>

          {/* Gastos por Categoria */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-stone-200 mb-4">
              Gastos por Categoría
            </h3>
            {data.gastosPorCategoria.length > 0 ? (
              <div className="space-y-2">
                {data.gastosPorCategoria.map((g, i) => {
                  const max = Math.max(...data.gastosPorCategoria.map((x) => x.total));
                  const pct = max > 0 ? (g.total / max) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-stone-400 mb-1">
                        <span className="capitalize">{g.categoria.replace(/_/g, " ")}</span>
                        <span>${g.total.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-emerald-950/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-600/60 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-500 text-center py-4">Sin gastos registrados</p>
            )}
          </div>

          {/* Ventas */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-emerald-800/30">
              <h3 className="text-sm font-semibold text-stone-200">Ventas</h3>
            </div>
            {data.detalleVentas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-emerald-800/20">
                    <tr>
                      {["Fecha", "Cliente", "Docenas", "Total", "Método"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-stone-400 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.detalleVentas.map((v: any, i: number) => (
                      <tr key={i} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                        <td className="px-3 py-2.5 text-stone-200">{v.fecha}</td>
                        <td className="px-3 py-2.5 text-stone-400">{v.cliente}</td>
                        <td className="px-3 py-2.5 text-stone-400">{v.docenas}</td>
                        <td className="px-3 py-2.5 text-emerald-400 font-medium">${v.total}</td>
                        <td className="px-3 py-2.5 text-stone-400 capitalize">{v.metodo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-stone-500 text-center py-6">Sin ventas registradas</p>
            )}
          </div>

          {/* Gastos */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-emerald-800/30">
              <h3 className="text-sm font-semibold text-stone-200">Gastos</h3>
            </div>
            {data.detalleGastos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-emerald-800/20">
                    <tr>
                      {["Fecha", "Categoría", "Lote", "Monto"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-stone-400 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.detalleGastos.map((g: any, i: number) => (
                      <tr key={i} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                        <td className="px-3 py-2.5 text-stone-200">{g.fecha}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded-full capitalize">
                            {g.categoria.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-stone-400">{g.lote}</td>
                        <td className="px-3 py-2.5 text-rose-400">${g.monto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-stone-500 text-center py-6">Sin gastos registrados</p>
            )}
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
