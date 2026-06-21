"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

interface Lote {
  id: string;
  nombre: string;
}

interface Produccion {
  id: string;
  loteId: string;
  fecha: string;
  huevosColectados: number;
  huevosRotos: number;
  huevosSucios: number;
  huevosPartidos: number;
  mortalidad: number;
  observaciones: string | null;
  lote: { id: string; nombre: string };
}

interface Totales {
  huevosColectados: number;
  huevosRotos: number;
  huevosSucios: number;
  huevosPartidos: number;
  mortalidad: number;
}

const periodButtons = [
  { value: "today", label: "Hoy" },
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
];

function getPeriodDates(period: string): { desde: string; hasta: string } {
  const today = new Date();
  const hasta = today.toISOString().split("T")[0];
  const desde = new Date();

  if (period === "today") {
    return { desde: hasta, hasta };
  } else if (period === "7") {
    desde.setDate(desde.getDate() - 7);
    return { desde: desde.toISOString().split("T")[0], hasta };
  } else if (period === "30") {
    desde.setDate(desde.getDate() - 30);
    return { desde: desde.toISOString().split("T")[0], hasta };
  }

  return { desde: "", hasta: "" };
}

export default function ProduccionListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [totales, setTotales] = useState<Totales | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [desde, setDesde] = useState(searchParams.get("desde") || "");
  const [hasta, setHasta] = useState(searchParams.get("hasta") || "");
  const [loteId, setLoteId] = useState(searchParams.get("loteId") || "");
  const [activePeriod, setActivePeriod] = useState<string | null>(null);

  // Fetch lotes for filter
  useEffect(() => {
    fetch("/api/granja/lotes")
      .then((res) => res.json())
      .then((data) => {
        const lotesArr = Array.isArray(data) ? data : data.lotes || [];
        setLotes(lotesArr);
      })
      .catch(() => {});
  }, []);

  // Fetch producciones
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (desde) params.set("desde", desde);
      if (hasta) params.set("hasta", hasta);
      if (loteId) params.set("loteId", loteId);

      const res = await fetch(`/api/granja/produccion?${params.toString()}`);
      if (!res.ok) throw new Error("Error fetching");
      const json = await res.json();
      setProducciones(json.producciones || []);
      setTotales(json.totales || null);
    } catch {
      console.error("Error al cargar registros de producción");
    } finally {
      setLoading(false);
    }
  }, [desde, hasta, loteId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Period quick button handler
  function handlePeriod(period: string) {
    setActivePeriod(period);
    const dates = getPeriodDates(period);
    setDesde(dates.desde);
    setHasta(dates.hasta);
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (dates.desde) params.set("desde", dates.desde);
    else params.delete("desde");
    if (dates.hasta) params.set("hasta", dates.hasta);
    else params.delete("hasta");
    params.delete("loteId");
    router.push(`?${params.toString()}`);
  }

  // Clear filters
  function clearFilters() {
    setDesde("");
    setHasta("");
    setLoteId("");
    setActivePeriod(null);
    router.push(window.location.pathname);
  }

  // Delete handler
  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      const res = await fetch(`/api/granja/produccion/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducciones((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el registro");
      }
    } catch {
      alert("Error al eliminar el registro");
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-lg font-bold text-stone-100">
          Producción Diaria
        </h2>
        <Link
          href="produccion/new"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Registro
        </Link>
      </div>

      {/* Summary Cards */}
      {totales && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Huevos Colectados", value: totales.huevosColectados.toLocaleString(), color: "emerald" },
            { label: "Huevos Rotos", value: totales.huevosRotos.toLocaleString(), color: "amber" },
            { label: "Huevos Sucios", value: totales.huevosSucios.toLocaleString(), color: "stone" },
            { label: "Huevos Partidos", value: totales.huevosPartidos.toLocaleString(), color: "orange" },
            { label: "Mortalidad", value: totales.mortalidad.toLocaleString(), color: "rose" },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-${item.color}-900/30 border border-${item.color}-800/30 rounded-xl p-4 text-center`}
            >
              <p className="text-xs text-stone-400 mb-1">{item.label}</p>
              <p className="text-xl font-bold text-stone-100">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          {/* Period quick buttons */}
          <div>
            <p className="text-xs text-stone-400 mb-1.5">Período</p>
            <div className="inline-flex bg-emerald-950/60 border border-emerald-800/40 rounded-lg p-0.5">
              {periodButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => handlePeriod(btn.value)}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                    activePeriod === btn.value
                      ? "bg-emerald-700/50 text-stone-100"
                      : "text-stone-400 hover:text-stone-300"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-xs text-stone-400 mb-1">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => { setDesde(e.target.value); setActivePeriod(null); }}
              className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => { setHasta(e.target.value); setActivePeriod(null); }}
              className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
            />
          </div>

          {/* Lote filter */}
          <div>
            <label className="block text-xs text-stone-400 mb-1">Lote</label>
            <select
              value={loteId}
              onChange={(e) => { setLoteId(e.target.value); setActivePeriod(null); }}
              className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200 min-w-[160px]"
            >
              <option value="">Todos los lotes</option>
              {lotes.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              Filtrar
            </button>
            {(desde || hasta || loteId) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 text-stone-300 px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        ) : producciones.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-stone-500 mb-2">
              No hay registros de producción
            </p>
            <p className="text-xs text-stone-600">
              {desde || hasta
                ? "No se encontraron resultados para los filtros seleccionados"
                : "Crea tu primer registro de producción para empezar"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-emerald-800/20">
                <tr>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">
                    Fecha
                  </th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">
                    Lote
                  </th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">
                    Colectados
                  </th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">
                    Rotos
                  </th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">
                    Sucios
                  </th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">
                    Partidos
                  </th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">
                    Mortalidad
                  </th>
                  <th className="px-3 py-2.5 text-center text-stone-400 font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {producciones.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-emerald-800/20 hover:bg-emerald-800/20 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-stone-200 whitespace-nowrap">
                      {formatDate(p.fecha)}
                    </td>
                    <td className="px-3 py-2.5 text-stone-200 whitespace-nowrap">
                      {p.lote?.nombre || "\u2014"}
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-200 font-medium">
                      {p.huevosColectados.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-400">
                      {p.huevosRotos > 0 ? p.huevosRotos.toLocaleString() : "\u2014"}
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-400">
                      {p.huevosSucios > 0 ? p.huevosSucios.toLocaleString() : "\u2014"}
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-400">
                      {p.huevosPartidos > 0 ? p.huevosPartidos.toLocaleString() : "\u2014"}
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-400">
                      {p.mortalidad > 0 ? (
                        <span className="text-rose-400">{p.mortalidad.toLocaleString()}</span>
                      ) : (
                        "\u2014"
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`produccion/${p.id}`}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-emerald-800/40 transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-900/30 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record count */}
      {!loading && producciones.length > 0 && (
        <p className="text-xs text-stone-500 mt-3 text-center">
          {producciones.length} registro{producciones.length !== 1 ? "s" : ""} encontrado{producciones.length !== 1 ? "s" : ""}
        </p>
      )}
    </DashboardShell>
  );
}
