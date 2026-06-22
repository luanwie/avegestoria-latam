"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Venta = {
  id: string;
  clienteNombre: string | null;
  fecha: string;
  docenas: number;
  precioPorDocena: number;
  total: number;
  metodoPago: string;
  descripcion: string | null;
};

type ClienteOption = { id: string; nombre: string };

const METODO_PAGO_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  otro: "Otro",
};

const METODO_PAGO_COLORS: Record<string, string> = {
  efectivo: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  transferencia: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  tarjeta: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  otro: "bg-stone-500/20 text-stone-400 border-stone-500/30",
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formClienteId, setFormClienteId] = useState("");
  const [formFecha, setFormFecha] = useState(new Date().toISOString().split("T")[0]);
  const [formDocenas, setFormDocenas] = useState("");
  const [formPrecio, setFormPrecio] = useState("");
  const [formMetodoPago, setFormMetodoPago] = useState("efectivo");
  const [formDescripcion, setFormDescripcion] = useState("");

  const fetchVentas = () => {
    fetch("/api/granja/finanzas/ventas")
      .then((r) => r.json())
      .then(setVentas)
      .catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/granja/finanzas/ventas")
      .then((r) => r.json())
      .then(setVentas)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setFormClienteId("");
    setFormFecha(new Date().toISOString().split("T")[0]);
    setFormDocenas("");
    setFormPrecio("");
    setFormMetodoPago("efectivo");
    setFormDescripcion("");
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (v: Venta) => {
    setFormClienteId(v.clienteNombre || "");
    setFormFecha(v.fecha.split("T")[0]);
    setFormDocenas(v.docenas.toString());
    setFormPrecio(v.precioPorDocena.toString());
    setFormMetodoPago(v.metodoPago);
    setFormDescripcion(v.descripcion || "");
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFecha || !formDocenas || !formPrecio) return;

    const body = {
      clienteNombre: formClienteId || null,
      fecha: formFecha,
      docenas: parseInt(formDocenas, 10),
      precioPorDocena: parseFloat(formPrecio),
      metodoPago: formMetodoPago,
      descripcion: formDescripcion || null,
    };

    const url = editingId
      ? `/api/granja/finanzas/ventas/${editingId}`
      : "/api/granja/finanzas/ventas";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        fetchVentas();
      } else {
        const err = await res.json();
        alert(err.error || "Error al guardar");
      }
    } catch {
      alert("Error al guardar venta");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta venta?")) return;
    try {
      const res = await fetch(`/api/granja/finanzas/ventas/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchVentas();
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

  const totalDocenas = ventas.reduce((s, v) => s + v.docenas, 0);
  const totalIngresos = ventas.reduce((s, v) => s + v.total, 0);

  const computedTotal = formDocenas && formPrecio
    ? (parseInt(formDocenas) * parseFloat(formPrecio)).toFixed(2)
    : "0.00";

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-100">Ventas</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {ventas.length} registro{ventas.length !== 1 ? "s" : ""}
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
          {showForm ? "Cancelar" : "Nueva Venta"}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-4">
          <p className="text-xs text-stone-400 mb-1">Docenas Totales</p>
          <p className="text-2xl font-bold text-stone-100">{totalDocenas.toLocaleString("es")}</p>
        </div>
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-4">
          <p className="text-xs text-stone-400 mb-1">Ingreso Total</p>
          <p className="text-2xl font-bold text-emerald-400">${totalIngresos.toLocaleString("es")}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-stone-200 mb-4">
            {editingId ? "Editar Venta" : "Nueva Venta"}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Cliente</label>
              <input
                type="text"
                value={formClienteId}
                onChange={(e) => setFormClienteId(e.target.value)}
                placeholder="Nombre del cliente (opcional)"
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
              />
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
              <label className="block text-xs text-stone-400 mb-1">Docenas *</label>
              <input
                type="number"
                min="1"
                value={formDocenas}
                onChange={(e) => setFormDocenas(e.target.value)}
                placeholder="0"
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Precio por Docena *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formPrecio}
                onChange={(e) => setFormPrecio(e.target.value)}
                placeholder="0.00"
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">Método de Pago</label>
              <select
                value={formMetodoPago}
                onChange={(e) => setFormMetodoPago(e.target.value)}
                className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-xs text-stone-400 mb-1">Total Calculado</label>
                <div className="w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-teal-300 font-semibold">
                  ${parseFloat(computedTotal).toLocaleString("es")}
                </div>
              </div>
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
      ) : ventas.length === 0 ? (
        <div className="text-center py-20 text-stone-500 text-sm">
          No hay ventas registradas
        </div>
      ) : (
        <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-emerald-800/20">
                <tr>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Fecha</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Cliente</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Docenas</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Precio/Docena</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Total</th>
                  <th className="px-3 py-2.5 text-left text-stone-400 font-medium">Método de Pago</th>
                  <th className="px-3 py-2.5 text-right text-stone-400 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id} className="border-t border-emerald-800/20 hover:bg-emerald-800/20">
                    <td className="px-3 py-2.5 text-stone-200 whitespace-nowrap">{formatDate(v.fecha)}</td>
                    <td className="px-3 py-2.5 text-stone-200">{v.clienteNombre || "—"}</td>
                    <td className="px-3 py-2.5 text-right text-stone-200">{v.docenas.toLocaleString("es")}</td>
                    <td className="px-3 py-2.5 text-right text-stone-400">
                      ${Number(v.precioPorDocena).toLocaleString("es")}
                    </td>
                    <td className="px-3 py-2.5 text-right text-stone-200 font-medium">
                      ${v.total.toLocaleString("es")}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                          METODO_PAGO_COLORS[v.metodoPago] || METODO_PAGO_COLORS.otro
                        }`}
                      >
                        {METODO_PAGO_LABELS[v.metodoPago] || v.metodoPago}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(v)}
                          className="p-1.5 rounded-lg hover:bg-emerald-700/30 text-stone-400 hover:text-stone-200 transition-all"
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
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
