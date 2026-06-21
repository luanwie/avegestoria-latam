"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Cliente = {
  id: string;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  activo: boolean;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formNombre, setFormNombre] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formDireccion, setFormDireccion] = useState("");

  const fetchData = () => {
    fetch("/api/granja/clientes")
      .then((r) => r.json())
      .then(setClientes)
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormNombre("");
    setFormTelefono("");
    setFormDireccion("");
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (c: Cliente) => {
    setFormNombre(c.nombre);
    setFormTelefono(c.telefono || "");
    setFormDireccion(c.direccion || "");
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim()) return;

    const body = {
      nombre: formNombre.trim(),
      telefono: formTelefono || null,
      direccion: formDireccion || null,
    };

    const url = editingId ? `/api/granja/clientes/${editingId}` : "/api/granja/clientes";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      resetForm();
      fetchData();
    } else {
      const err = await res.json();
      alert(err.error || "Error al guardar");
    }
  };

  const handleToggleEstado = async (c: Cliente) => {
    const res = await fetch(`/api/granja/clientes/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !c.activo }),
    });
    if (res.ok) fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    const res = await fetch(`/api/granja/clientes/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  return (
    <DashboardShell>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-100">Clientes</h2>
          <p className="text-xs text-stone-500 mt-0.5">{clientes.length} cliente(s) registrado(s)</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="inline-flex items-center gap-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-bold px-4 py-2 rounded-lg text-xs font-medium transition-all"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Cancelar" : "Nuevo Cliente"}
        </button>
      </div>

      {showForm && (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-stone-200 mb-4">
            {editingId ? "Editar Cliente" : "Nuevo Cliente"}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Nombre *</label>
              <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)}
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200" required />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Teléfono</label>
              <input type="text" value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)}
                placeholder="+55 51 99999-9999" className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200" />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Dirección</label>
              <input type="text" value={formDireccion} onChange={(e) => setFormDireccion(e.target.value)}
                placeholder="Opcional" className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200" />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2">
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
      ) : clientes.length === 0 ? (
        <div className="text-center py-20 text-stone-500 text-sm">No hay clientes registrados</div>
      ) : (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-emerald-800/20">
                <tr>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Nombre</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Teléfono</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Dirección</th>
                  <th className="px-3 py-2.5 text-center text-stone-400 font-medium">Estado</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                    <td className="px-3 py-2.5 text-stone-200 font-medium">{c.nombre}</td>
                    <td className="px-3 py-2.5 text-stone-400">{c.telefono || "—"}</td>
                    <td className="px-3 py-2.5 text-stone-400 max-w-[200px] truncate">{c.direccion || "—"}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => handleToggleEstado(c)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${c.activo ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30" : "bg-stone-600/20 text-stone-400 hover:bg-stone-600/30"}`}>
                        {c.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-emerald-700/30 text-stone-400 hover:text-stone-200" title="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-stone-400 hover:text-red-400" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
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
