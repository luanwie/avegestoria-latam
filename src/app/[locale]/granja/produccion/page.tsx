"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Warehouse, Egg, Dna } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useRequirePlan } from "@/hooks/useRequirePlan";

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
  useRequirePlan("esencial");
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
  const [activeSection, setActiveSection] = useState<null | "galpones" | "lotes" | "razas">(null);

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

  // ─── Inline CRUD: Galpones ───
  const [galponesData, setGalponesData] = useState<Array<{ id: string; nombre: string }>>([]);
  const [showGalponForm, setShowGalponForm] = useState(false);
  const [editGalponId, setEditGalponId] = useState<string | null>(null);
  const [galponInput, setGalponInput] = useState("");
  const loadGalpones = () => fetch("/api/granja/galpones").then(r=>r.json()).then(d => setGalponesData(Array.isArray(d)?d:[]));
  useEffect(() => { if (activeSection === "galpones" && galponesData.length === 0) loadGalpones(); }, [activeSection]);
  const saveGalpon = async (e: React.FormEvent) => { e.preventDefault(); if (!galponInput.trim()) return; const url = editGalponId ? `/api/granja/galpones/${editGalponId}` : "/api/granja/galpones"; const method = editGalponId ? "PUT" : "POST"; await fetch(url, { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify({ nombre: galponInput }) }); setGalponInput(""); setEditGalponId(null); setShowGalponForm(false); loadGalpones(); };
  function renderGalponesInline() { return (
    <div className="space-y-2">
      <button onClick={() => { setShowGalponForm(!showGalponForm); setEditGalponId(null); setGalponInput(""); }} className="text-xs flex items-center gap-1 text-brand-gold hover:text-brand-gold-light transition-colors"><Plus className="w-3 h-3" /> Nuevo Galpón</button>
      {showGalponForm && <form onSubmit={saveGalpon} className="flex gap-2"><input value={galponInput} onChange={e=>setGalponInput(e.target.value)} placeholder="Nombre del galpón" className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-brand-gold/30" /><button type="submit" className="text-xs bg-brand-gold/10 text-brand-gold px-3 py-2 rounded-lg border border-brand-gold/20">{editGalponId ? "Guardar" : "Crear"}</button></form>}
      {galponesData.map(g => <div key={g.id} className="flex items-center justify-between text-xs text-stone-400 py-1 border-b border-white/[0.04] last:border-0"><span>{g.nombre}</span></div>)}
    </div>
  ); }

  // ─── Inline CRUD: Lotes ───
  const [lotesData, setLotesData] = useState<Array<{ id: string; nombre: string; raza?: string; cantidadAves: number; galpon?: string }>>([]);
  const [showLoteForm, setShowLoteForm] = useState(false);
  const [loteInput, setLoteInput] = useState({ nombre: "", cantidadAves: 0 });
  const [galponOptions, setGalponOptions] = useState<Array<{id:string;nombre:string}>>([]);
  const [razaOptions, setRazaOptions] = useState<Array<{id:string;nombre:string}>>([]);
  const loadLotes = () => fetch("/api/granja/lotes").then(r=>r.json()).then(d => setLotesData(Array.isArray(d)?d.map((l:any)=>({id:l.id, nombre:l.nombre, raza:l.raza?.nombre, cantidadAves:l.cantidadAves, galpon:l.galpon?.nombre})):[]));
  useEffect(() => { if (activeSection === "lotes" && lotesData.length === 0) { loadLotes(); fetch("/api/granja/galpones").then(r=>r.json()).then(d => setGalponOptions(Array.isArray(d)?d:[])); fetch("/api/granja/razas").then(r=>r.json()).then(d => setRazaOptions(Array.isArray(d)?d:[])); }}, [activeSection]);
  function renderLotesInline() { return (
    <div className="space-y-1 text-xs">
      {lotesData.map(l => <div key={l.id} className="flex justify-between text-stone-400 py-1 border-b border-white/[0.04] last:border-0"><span>{l.nombre} <span className="text-stone-500">({l.raza})</span></span><span className="text-stone-300">{l.cantidadAves} aves</span></div>)}
    </div>
  ); }

  // ─── Inline CRUD: Razas ───
  const [razasData, setRazasData] = useState<Array<{ id: string; nombre: string }>>([]);
  const [showRazaForm, setShowRazaForm] = useState(false);
  const [razaInput, setRazaInput] = useState("");
  const loadRazas = () => fetch("/api/granja/razas").then(r=>r.json()).then(d => setRazasData(Array.isArray(d)?d:[]));
  useEffect(() => { if (activeSection === "razas" && razasData.length === 0) loadRazas(); }, [activeSection]);
  const saveRaza = async (e: React.FormEvent) => { e.preventDefault(); if (!razaInput.trim()) return; await fetch("/api/granja/razas", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ nombre: razaInput }) }); setRazaInput(""); setShowRazaForm(false); loadRazas(); };
  function renderRazasInline() { return (
    <div className="space-y-2">
      <button onClick={() => setShowRazaForm(!showRazaForm)} className="text-xs flex items-center gap-1 text-brand-gold"><Plus className="w-3 h-3" /> Nueva Raza</button>
      {showRazaForm && <form onSubmit={saveRaza} className="flex gap-2"><input value={razaInput} onChange={e=>setRazaInput(e.target.value)} placeholder="Nombre de la raza" className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-brand-gold/30" /><button type="submit" className="text-xs bg-brand-gold/10 text-brand-gold px-3 py-2 rounded-lg border border-brand-gold/20">Crear</button></form>}
      {razasData.map(r => <div key={r.id} className="text-xs text-stone-400 py-1 border-b border-white/[0.04] last:border-0">{r.nombre}</div>)}
    </div>
  ); }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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

      {/* Cadastros inline: Galpones, Lotes, Razas */}
      <div className="flex gap-2 mb-4">
        {(["galpones", "lotes", "razas"] as const).map((s) => {
          const Icon = s === "galpones" ? Warehouse : s === "lotes" ? Egg : Dna;
          return (
            <button key={s} onClick={() => setActiveSection(activeSection === s ? null : s)}
              className={`flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-lg border transition-all ${
                activeSection === s
                  ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                  : "bg-white/[0.03] text-stone-500 hover:text-stone-300 border-white/[0.06]"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Inline CRUD sections */}
      {activeSection === "lotes" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-300">Lotes</h3>
          </div>
          {renderLotesInline()}
        </div>
      )}
      {activeSection === "razas" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-300">Razas</h3>
          </div>
          {renderRazasInline()}
        </div>
      )}
      {activeSection === "galpones" && (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-300">Galpones</h3>
          </div>
          {renderGalponesInline()}
        </div>
      )}

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
