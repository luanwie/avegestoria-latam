"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Pencil, Trash2, X, Check, Search, Filter } from "lucide-react";

type Gasto = {
  id: string;
  loteId: string | null;
  loteNombre: string | null;
  categoria: string;
  fecha: string;
  monto: number;
  descripcion: string | null;
};

type LoteOption = { id: string; nombre: string };

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

const CATEGORY_LABELS: Record<string, string> = {
  racion: "Ración",
  medicinas: "Medicinas",
  vacunas: "Vacunas",
  electricidad: "Electricidad",
  agua: "Agua",
  mantenimiento: "Mantenimiento",
  transporte: "Transporte",
  mano_obra: "Mano de Obra",
  otro: "Otros",
};

const CATEGORIAS = Object.keys(CATEGORY_COLORS);

export default function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterLote, setFilterLote] = useState("");

  // Form state
  const [formLoteId, setFormLoteId] = useState("");
  const [formCategoria, setFormCategoria] = useState("racion");
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split("T")[0]);
  const [formMonto, setFormMonto] = useState("");
  const [formDescripcion, setFormDescripcion] = useState("");

  const fetchGastos = () => {
    const params = new URLSearchParams();
    if (filterLote) params.set("loteId", filterLote);
    fetch(`/api/granja/finanzas/gastos?${params}`)
      .then((r) => r.json())
      .then(setGastos)
      .catch(() => {});
  };

  const fetchLotes = () => {
    fetch("/api/granja/lotes")
      .then((r) => r.json())
      .then((data) => {
        // Handle both array and {lotes: [...]} response shapes
        const list = Array.isArray(data) ? data : data.lotes || [];
        setLotes(list);
      })
      .catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/granja/finanzas/gastos")
        .then((r) => r.json())
        .then(setGastos),
      fetch("/api/granja/lotes")
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : data.lotes || [];
          setLotes(list);
        }),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGastos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLote]);

  const resetForm = () => {
    setFormLoteId("");
    setFormCategoria("racion");
    setFormFecha(new Date().toISOString().split("T")[0]);
    setFormMonto("");
    setFormDescripcion("");
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (g: Gasto) => {
    setFormLoteId(g.loteId || "");
    setFormCategoria(g.categoria);
    setFormFecha(g.fecha.split("T")[0]);
    setFormMonto(g.monto.toString());
    setFormDescripcion(g.descripcion || "");
    setEditingId(g.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFecha || !formMonto) return;

    const body = {
      loteId: formLoteId || null,
      categoria: formCategoria,
      fecha: formFecha,
      monto: parseFloat(formMonto),
      descripcion: formDescripcion || null,
    };

    const url = editingId
      ? `/api/granja/finanzas/gastos/${editingId}`
      : "/api/granja/finanzas/gastos";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        fetchGastos();
      } else {
        const err = await res.json();
        alert(err.error || "Error al guardar");
      }
    } catch {
      alert("Error al guardar gasto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este gasto?")) return;
    try {
      const res = await fetch(`/api/granja/finanzas/gastos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchGastos();
    } catch {
      alert("Error al eliminar");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-100">Gastos</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {gastos.length} registro{gastos.length !== 1 ? "s" : ""} · Total: ${totalGastos.toLocaleString("es")}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs font-medium transition-all"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancelar" : "Nuevo Gasto"}
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-3.5 h-3.5 text-stone-500" />
        <select
          value={filterLote}
          onChange={(e) => setFilterLote(e.target.value)}
          className="w-full max-w-xs bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
        >
          <option value="">Todos los lotes</option>
          {lotes.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-stone-200 mb-4">
            {editingId ? "Editar Gasto" : "Nuevo Gasto"}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Categoría *</label>
              <select
                value={formCategoria}
                onChange={(e) => setFormCategoria(e.target.value)}
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
                required
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Fecha *</label>
              <input
                type="date"
                value={formFecha}
                onChange={(e) => setFormFecha(e.target.value)}
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Monto *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formMonto}
                onChange={(e) => setFormMonto(e.target.value)}
                placeholder="0.00"
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Lote</label>
              <select
                value={formLoteId}
                onChange={(e) => setFormLoteId(e.target.value)}
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
              >
                <option value="">Sin lote</option>
                {lotes.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs text-stone-400 mb-1">Descripción</label>
              <input
                type="text"
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                placeholder="Opcional"
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="bg-emerald-800/30 hover:bg-emerald-700/40 text-stone-300 px-4 py-2 rounded-lg text-xs transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs font-medium transition-all"
              >
                {editingId ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Actualizar
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-full max-w-lg">
            <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden animate-pulse">
              <div className="bg-emerald-800/20 p-3">
                <div className="flex gap-4">
                  <div className="h-3 bg-emerald-800/40 rounded flex-1" />
                  <div className="h-3 bg-emerald-800/40 rounded flex-1" />
                  <div className="h-3 bg-emerald-800/40 rounded w-20" />
                  <div className="h-3 bg-emerald-800/40 rounded w-16" />
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 border-t border-emerald-800/20">
                  <div className="h-3 bg-emerald-800/20 rounded flex-1" />
                  <div className="h-3 bg-emerald-800/20 rounded flex-1" />
                  <div className="h-3 bg-emerald-800/20 rounded w-20" />
                  <div className="h-3 bg-emerald-800/20 rounded w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : gastos.length === 0 ? (
        <div className="text-center py-20 text-stone-500 text-sm">
          No hay gastos registrados
        </div>
      ) : (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-emerald-800/20">
                <tr>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Fecha</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Categoría</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Lote</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Monto</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Descripción</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((g) => (
                  <tr key={g.id} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                    <td className="px-3 py-2.5 text-stone-200 whitespace-nowrap">{formatDate(g.fecha)}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                          CATEGORY_COLORS[g.categoria] || CATEGORY_COLORS.otro
                        }`}
                      >
                        {CATEGORY_LABELS[g.categoria] || g.categoria}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-stone-400">{g.loteNombre || "—"}</td>
                    <td className="px-3 py-2.5 text-right text-stone-200 font-medium">
                      ${g.monto.toLocaleString("es")}
                    </td>
                    <td className="px-3 py-2.5 text-stone-400 max-w-[200px] truncate">
                      {g.descripcion || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(g)}
                          className="p-1.5 rounded-lg hover:bg-emerald-700/30 text-stone-400 hover:text-stone-200 transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          className="p-1.5 rounded-lg hover:bg-red-900/30 text-stone-400 hover:text-red-400 transition-all"
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
        </div>
      )}
    </DashboardShell>
  );
}
