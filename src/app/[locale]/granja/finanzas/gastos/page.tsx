"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Pencil, Trash2, X, Check, Search } from "lucide-react";

type Gasto = { id: string; loteId: string | null; loteNombre: string | null; categoria: string; fecha: string; monto: number; descripcion: string | null; };
type LoteOption = { id: string; nombre: string };

const CATEGORIAS = [
  { id: "racion", label: "Ración", icon: "🥩", color: "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400" },
  { id: "medicinas", label: "Medicinas", icon: "💊", color: "border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400" },
  { id: "vacunas", label: "Vacunas", icon: "💉", color: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400" },
  { id: "electricidad", label: "Electricidad", icon: "⚡", color: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400" },
  { id: "agua", label: "Agua", icon: "💧", color: "border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400" },
  { id: "mantenimiento", label: "Mantenimiento", icon: "🔧", color: "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400" },
  { id: "transporte", label: "Transporte", icon: "🚚", color: "border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-400" },
  { id: "mano_obra", label: "Mano de obra", icon: "👷", color: "border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400" },
  { id: "otro", label: "Otro", icon: "📦", color: "border-stone-500/30 bg-stone-500/5 hover:bg-stone-500/10 text-stone-400" },
];

const CAT_BADGE: Record<string, string> = {
  racion: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medicinas: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  vacunas: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  electricidad: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  agua: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  mantenimiento: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  transporte: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  mano_obra: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  otro: "bg-stone-500/10 text-stone-400 border-stone-500/20",
};

export default function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchCat, setSearchCat] = useState("");

  // Form state
  const [categoria, setCategoria] = useState("racion");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loteId, setLoteId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  const fetchGastos = () => {
    fetch("/api/granja/finanzas/gastos").then((r) => r.json()).then((d) => setGastos(Array.isArray(d) ? d : d.gastos || [])).catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/granja/finanzas/gastos").then((r) => r.json()),
      fetch("/api/granja/lotes").then((r) => r.json()),
    ]).then(([g, l]) => {
      setGastos(Array.isArray(g) ? g : g.gastos || []);
      setLotes(Array.isArray(l) ? l : l.lotes || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const resetForm = () => { setCategoria("racion"); setMonto(""); setDescripcion(""); setLoteId(""); setFecha(new Date().toISOString().split("T")[0]); setEditingId(null); setShowForm(false); setSearchCat(""); };

  const startEdit = (g: Gasto) => {
    setEditingId(g.id); setCategoria(g.categoria); setMonto(g.monto.toString());
    setDescripcion(g.descripcion || ""); setLoteId(g.loteId || "");
    setFecha(g.fecha.split("T")[0]); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto) return;
    setSaving(true);
    const url = editingId ? `/api/granja/finanzas/gastos/${editingId}` : "/api/granja/finanzas/gastos";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categoria, monto: parseFloat(monto), descripcion: descripcion || null, loteId: loteId || null, fecha }) });
    if (res.ok) { resetForm(); fetchGastos(); } else { alert("Error al guardar"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => { if (!confirm("¿Eliminar este gasto?")) return; await fetch(`/api/granja/finanzas/gastos/${id}`, { method: "DELETE" }); fetchGastos(); };

  const filteredCats = CATEGORIAS.filter((c) => c.label.toLowerCase().includes(searchCat.toLowerCase()));

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-200 tracking-tight">Gastos</h2>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="text-[12px] bg-brand-gold/10 hover:bg-brand-gold/15 border border-brand-gold/20 px-4 py-2 rounded-lg text-brand-gold transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Nuevo Gasto
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-stone-300">{editingId ? "Editar Gasto" : "Nuevo Gasto"}</h3>
              <button type="button" onClick={resetForm} className="text-stone-500 hover:text-stone-300"><X className="w-4 h-4" /></button>
            </div>

            {/* Category grid with search */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-3.5 h-3.5 text-stone-500" />
                <input type="text" placeholder="Buscar categoría..." value={searchCat} onChange={(e) => setSearchCat(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-stone-300 placeholder:text-stone-600 focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {filteredCats.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => setCategoria(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-[10px] ${cat.color} ${categoria === cat.id ? "ring-1 ring-brand-gold/40 scale-[1.02]" : ""}`}>
                    <span className="text-base">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount + date + lote */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-[10px] text-stone-500 block mb-1">Monto ($)</label>
                <input type="number" step="0.01" required value={monto} onChange={(e) => setMonto(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-brand-gold/30" />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Fecha</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-brand-gold/30" />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Lote (opcional)</label>
                <select value={loteId} onChange={(e) => setLoteId(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-brand-gold/30">
                  <option value="">Sin lote</option>
                  {lotes.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-stone-500 block mb-1">Descripción (opcional)</label>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-brand-gold/30" />
            </div>

            <button type="submit" disabled={saving}
              className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-semibold text-sm transition-all disabled:opacity-50">
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Registrar gasto"}
            </button>
          </form>
        )}

        {/* Gastos list */}
        {loading ? <div className="py-10 text-center text-stone-500 text-sm">Cargando...</div> : gastos.length === 0 ? (
          <div className="py-16 text-center text-stone-500 text-sm">Sin gastos registrados</div>
        ) : (
          <div className="space-y-2">
            {gastos.map((g) => (
              <div key={g.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${CAT_BADGE[g.categoria] || CAT_BADGE.otro}`}>
                    {CATEGORIAS.find((c) => c.id === g.categoria)?.label || g.categoria}
                  </span>
                  <div>
                    <p className="text-sm text-stone-200 font-medium">${g.monto.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-500">{g.fecha.split("T")[0]}{g.loteNombre ? ` · ${g.loteNombre}` : ""}{g.descripcion ? ` · ${g.descripcion}` : ""}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(g)} className="p-1.5 text-stone-500 hover:text-stone-300 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(g.id)} className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
