"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

interface Lote {
  id: string;
  nombre: string;
}

interface ProduccionForm {
  loteId: string;
  fecha: string;
  huevosColectados: string;
  huevosRotos: string;
  huevosSucios: string;
  huevosPartidos: string;
  mortalidad: string;
  observaciones: string;
}

const emptyForm: ProduccionForm = {
  loteId: "",
  fecha: new Date().toISOString().split("T")[0],
  huevosColectados: "",
  huevosRotos: "0",
  huevosSucios: "0",
  huevosPartidos: "0",
  mortalidad: "0",
  observaciones: "",
};

export default function ProduccionFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [form, setForm] = useState<ProduccionForm>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch lotes list
  useEffect(() => {
    fetch("/api/granja/lotes")
      .then((res) => res.json())
      .then((data) => {
        const lotesArr = Array.isArray(data) ? data : data.lotes || [];
        setLotes(lotesArr);
      })
      .catch(() => {});
  }, []);

  // Fetch existing record for edit mode
  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    fetch(`/api/granja/produccion/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setForm({
          loteId: data.loteId || "",
          fecha: data.fecha ? data.fecha.split("T")[0] : "",
          huevosColectados: String(data.huevosColectados ?? ""),
          huevosRotos: String(data.huevosRotos ?? "0"),
          huevosSucios: String(data.huevosSucios ?? "0"),
          huevosPartidos: String(data.huevosPartidos ?? "0"),
          mortalidad: String(data.mortalidad ?? "0"),
          observaciones: data.observaciones || "",
        });
      })
      .catch(() => {
        setError("Registro no encontrado");
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const body = {
        loteId: form.loteId,
        fecha: form.fecha,
        huevosColectados: parseInt(form.huevosColectados) || 0,
        huevosRotos: parseInt(form.huevosRotos) || 0,
        huevosSucios: parseInt(form.huevosSucios) || 0,
        huevosPartidos: parseInt(form.huevosPartidos) || 0,
        mortalidad: parseInt(form.mortalidad) || 0,
        observaciones: form.observaciones || null,
      };

      // Validate
      if (!body.loteId) {
        setError("Selecciona un lote");
        setSaving(false);
        return;
      }
      if (!body.fecha) {
        setError("Selecciona una fecha");
        setSaving(false);
        return;
      }
      if (body.huevosColectados <= 0) {
        setError("Los huevos colectados debe ser mayor a 0");
        setSaving(false);
        return;
      }

      const url = isNew
        ? "/api/granja/produccion"
        : `/api/granja/produccion/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al guardar");
      }

      router.push("/es/granja/produccion");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (error && !saving && !isNew) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <p className="text-sm text-rose-400 mb-4">{error}</p>
          <Link
            href="/es/granja/produccion"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const inputClass = "w-full bg-emerald-950/60 border border-emerald-800/40 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-600/50";
  const labelClass = "block text-xs text-stone-400 mb-1";

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/es/granja/produccion"
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-emerald-800/40 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-lg font-bold text-stone-100">
          {isNew ? "Nuevo Registro de Producción" : "Editar Registro de Producción"}
        </h2>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lote and Date row */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Lote */}
            <div>
              <label className={labelClass}>Lote *</label>
              <select
                name="loteId"
                value={form.loteId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Seleccionar lote</option>
                {lotes.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className={labelClass}>Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Numeric fields */}
          <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-stone-200 mb-4">
              Producción
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Huevos Colectados *</label>
                <input
                  type="number"
                  name="huevosColectados"
                  value={form.huevosColectados}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Huevos Rotos</label>
                <input
                  type="number"
                  name="huevosRotos"
                  value={form.huevosRotos}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Huevos Sucios</label>
                <input
                  type="number"
                  name="huevosSucios"
                  value={form.huevosSucios}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Huevos Partidos</label>
                <input
                  type="number"
                  name="huevosPartidos"
                  value={form.huevosPartidos}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className={labelClass}>Mortalidad</label>
                <input
                  type="number"
                  name="mortalidad"
                  value={form.mortalidad}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className={labelClass}>Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="Notas adicionales sobre la producción..."
              rows={3}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-rose-900/30 border border-rose-800/40 rounded-lg px-4 py-3">
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <Link
              href="/es/granja/produccion"
              className="inline-flex items-center gap-1.5 bg-emerald-800/30 hover:bg-emerald-700/40 border border-emerald-700/30 text-stone-300 px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
