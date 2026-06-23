"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useRequirePlan } from "@/hooks/useRequirePlan";

type Lote = {
  id: string;
  nombre: string;
  galponId: string | null;
  galpon?: { id: string; nombre: string } | null;
  razaId: string | null;
  raza?: { id: string; nombre: string } | null;
  cantidadAves: number;
  fechaIngreso: string;
  fechaFinalizado: string | null;
  estado: string;
  costoAve: number | null;
};

type Option = { id: string; nombre: string };

export default function LotesPage() {
  useRequirePlan("profesional");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [galpones, setGalpones] = useState<Option[]>([]);
  const [razas, setRazas] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formNombre, setFormNombre] = useState("");
  const [formGalponId, setFormGalponId] = useState("");
  const [formRazaId, setFormRazaId] = useState("");
  const [formCantidad, setFormCantidad] = useState("");
  const [formFechaIngreso, setFormFechaIngreso] = useState(new Date().toISOString().split("T")[0]);
  const [formEstado, setFormEstado] = useState("activo");
  const [formCostoAve, setFormCostoAve] = useState("");

  const fetchLotes = () => fetch("/api/granja/lotes").then((r) => r.json()).then(setLotes);
  const fetchGalpones = () => fetch("/api/granja/galpones").then((r) => r.json()).then(setGalpones);
  const fetchRazas = () => fetch("/api/granja/razas").then((r) => r.json()).then(setRazas);

  useEffect(() => {
    Promise.all([fetchLotes(), fetchGalpones(), fetchRazas()]).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormNombre("");
    setFormGalponId("");
    setFormRazaId("");
    setFormCantidad("");
    setFormFechaIngreso(new Date().toISOString().split("T")[0]);
    setFormEstado("activo");
    setFormCostoAve("");
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (l: Lote) => {
    setFormNombre(l.nombre);
    setFormGalponId(l.galponId || "");
    setFormRazaId(l.razaId || "");
    setFormCantidad(l.cantidadAves.toString());
    setFormFechaIngreso(l.fechaIngreso.split("T")[0]);
    setFormEstado(l.estado);
    setFormCostoAve(l.costoAve?.toString() || "");
    setEditingId(l.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formCantidad || !formFechaIngreso) return;

    const body = {
      nombre: formNombre.trim(),
      galponId: formGalponId || null,
      razaId: formRazaId || null,
      cantidadAves: parseInt(formCantidad),
      fechaIngreso: formFechaIngreso,
      estado: formEstado,
      costoAve: formCostoAve || null,
    };

    const url = editingId ? `/api/granja/lotes/${editingId}` : "/api/granja/lotes";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      resetForm();
      fetchLotes();
    } else {
      const err = await res.json();
      alert(err.error || "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este lote?")) return;
    const res = await fetch(`/api/granja/lotes/${id}`, { method: "DELETE" });
    if (res.ok) fetchLotes();
  };

  const inputClass = "w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200";
  const labelClass = "block text-xs text-stone-400 mb-1";

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-100">Lotes</h2>
          <p className="text-xs text-stone-500 mt-0.5">{lotes.length} lote(s) registrado(s)</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs font-medium transition-all"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancelar" : "Nuevo Lote"}
        </button>
      </div>

      {showForm && (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-stone-200 mb-4">
            {editingId ? "Editar Lote" : "Nuevo Lote"}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Galpón</label>
              <select value={formGalponId} onChange={(e) => setFormGalponId(e.target.value)} className={inputClass}>
                <option value="">Sin galpón</option>
                {galpones.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Raza</label>
              <select value={formRazaId} onChange={(e) => setFormRazaId(e.target.value)} className={inputClass}>
                <option value="">Sin raza</option>
                {razas.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Cantidad de Aves *</label>
              <input type="number" min="1" value={formCantidad} onChange={(e) => setFormCantidad(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Fecha de Ingreso *</label>
              <input type="date" value={formFechaIngreso} onChange={(e) => setFormFechaIngreso(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select value={formEstado} onChange={(e) => setFormEstado(e.target.value)} className={inputClass}>
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Costo por Ave</label>
              <input type="number" step="0.01" min="0" value={formCostoAve} onChange={(e) => setFormCostoAve(e.target.value)} placeholder="Opcional" className={inputClass} />
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <label className={labelClass}>Edad (semanas)</label>
                {formFechaIngreso ? (
                  <div className={inputClass + " text-teal-300 font-semibold"}>
                    {Math.max(0, Math.floor((Date.now() - new Date(formFechaIngreso).getTime()) / (7 * 86400000)))} sem
                  </div>
                ) : <div className={inputClass + " text-stone-500"}>—</div>}
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2">
              <button type="button" onClick={resetForm}
                className="bg-emerald-800/30 hover:bg-emerald-700/40 text-stone-300 px-4 py-2 rounded-lg text-xs transition-all">Cancelar</button>
              <button type="submit"
                className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs font-medium transition-all">
                {editingId ? <><Check className="w-3.5 h-3.5" /> Actualizar</> : <><Plus className="w-3.5 h-3.5" /> Guardar</>}
              </button>
            </div>
          </form>
        </div>
      )}

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
      ) : lotes.length === 0 ? (
        <div className="text-center py-20 text-stone-500 text-sm">No hay lotes registrados</div>
      ) : (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-emerald-800/20">
                <tr>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Nombre</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Galpón</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Raza</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Aves</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Edad</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Costo/Ave</th>
                  <th className="px-3 py-2.5 text-center text-stone-400 font-medium">Estado</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((l) => {
                  const edad = Math.floor((Date.now() - new Date(l.fechaIngreso).getTime()) / (7 * 86400000));
                  return (
                    <tr key={l.id} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                      <td className="px-3 py-2.5 text-stone-200 font-medium">{l.nombre}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.galpon?.nombre || "—"}</td>
                      <td className="px-3 py-2.5 text-stone-400">{l.raza?.nombre || "—"}</td>
                      <td className="px-3 py-2.5 text-right text-stone-200">{l.cantidadAves.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right text-stone-400">{edad} sem</td>
                      <td className="px-3 py-2.5 text-right text-stone-400">{l.costoAve ? `$${l.costoAve}` : "—"}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          l.estado === "activo" ? "bg-emerald-600/20 text-emerald-400" :
                          l.estado === "finalizado" ? "bg-amber-600/20 text-amber-400" :
                          "bg-blue-600/20 text-blue-400"
                        }`}>{l.estado}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-emerald-700/30 text-stone-400 hover:text-stone-200" title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-stone-400 hover:text-red-400" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
