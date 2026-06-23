"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Minus, Plus, Check, Egg } from "lucide-react";

interface LoteOption {
  id: string;
  nombre: string;
  raza: string;
  cantidadAves: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProduccionQuiz({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [selectedLote, setSelectedLote] = useState<LoteOption | null>(null);
  const [huevos, setHuevos] = useState(0);
  const [rotos, setRotos] = useState(0);
  const [mortalidad, setMortalidad] = useState(0);
  const [racion, setRacion] = useState("");
  const [sobra, setSobra] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setDone(false);
      fetch("/api/granja/lotes")
        .then((r) => r.json())
        .then((d) => {
          const arr = Array.isArray(d) ? d : d.lotes || [];
          setLotes(arr.map((l: any) => ({ id: l.id, nombre: l.nombre, raza: l.raza?.nombre || "", cantidadAves: l.cantidadAves })));
        })
        .catch(() => {});
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedLote || huevos <= 0) return;
    setSaving(true);
    const body: Record<string, any> = {
      loteId: selectedLote.id,
      fecha: new Date().toISOString(),
      huevosColectados: huevos,
      huevosRotos: rotos,
      mortalidad,
      observaciones: "",
    };
    if (racion) body.feedProvidedKg = parseFloat(racion);
    if (sobra) body.feedLeftoverKg = parseFloat(sobra);

    const res = await fetch("/api/granja/produccion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => { onClose(); onSuccess?.(); }, 1200);
    }
  };

  const reset = () => { setStep(1); setSelectedLote(null); setHuevos(0); setRotos(0); setMortalidad(0); setRacion(""); setSobra(""); };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#0a150f] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <button onClick={() => { if (step > 1) setStep(step - 1); else onClose(); }} className="text-stone-400 hover:text-stone-200">
                {step > 1 ? <ChevronLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s <= step ? "bg-brand-gold" : "bg-white/[0.1]"}`} />
                ))}
              </div>
              <div className="w-5" />
            </div>

            {/* Content */}
            <div className="px-5 py-6 min-h-[280px]">
              {done ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-4">
                    <Check className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-stone-200">¡Registrado!</p>
                  <p className="text-xs text-stone-500 mt-1">{huevos.toLocaleString()} huevos en {selectedLote?.nombre}</p>
                </div>
              ) : step === 1 ? (
                /* Step 1: Select lote */
                <div>
                  <p className="text-sm font-medium text-stone-300 mb-4">¿Qué lote vas a registrar?</p>
                  <div className="space-y-2">
                    {lotes.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { setSelectedLote(l); setStep(2); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-brand-gold/10 border border-brand-gold/15 flex items-center justify-center shrink-0">
                          <Egg className="w-4 h-4 text-brand-gold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-200">{l.nombre}</p>
                          <p className="text-[10px] text-stone-500">{l.raza} · {l.cantidadAves.toLocaleString()} aves</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-600 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : step === 2 ? (
                /* Step 2: Huevos + extras */
                <div>
                  <p className="text-sm font-medium text-stone-300 mb-1">{selectedLote?.nombre}</p>
                  <p className="text-[10px] text-stone-500 mb-5">{selectedLote?.raza}</p>

                  <div className="space-y-5">
                    {/* Huevos stepper */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Huevos recolectados</p>
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => setHuevos(Math.max(0, huevos - 10))} className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-stone-400 hover:text-stone-200 hover:bg-white/[0.08] transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-3xl font-bold text-stone-100 tabular-nums w-28 text-center">{huevos.toLocaleString()}</span>
                        <button onClick={() => setHuevos(huevos + 10)} className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-stone-400 hover:text-stone-200 hover:bg-white/[0.08] transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        {[1, 5, 100, 500].map((inc) => (
                          <button key={inc} onClick={() => setHuevos(huevos + inc)} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-stone-500 hover:text-stone-300 transition-colors">+{inc}</button>
                        ))}
                      </div>
                    </div>

                    {/* Rotos + Mortalidad */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-stone-500 mb-1">Huevos rotos</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setRotos(Math.max(0, rotos - 1))} className="text-stone-500 hover:text-stone-300"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-medium text-stone-200 w-6 text-center">{rotos}</span>
                          <button onClick={() => setRotos(rotos + 1)} className="text-stone-500 hover:text-stone-300"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-500 mb-1">Mortalidad</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setMortalidad(Math.max(0, mortalidad - 1))} className="text-stone-500 hover:text-stone-300"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-medium text-stone-200 w-6 text-center">{mortalidad}</span>
                          <button onClick={() => setMortalidad(mortalidad + 1)} className="text-stone-500 hover:text-stone-300"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setStep(3)} disabled={huevos <= 0} className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-green-deeper font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      Continuar
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 3: Ración opcional + confirmar */
                <div>
                  <p className="text-sm font-medium text-stone-300 mb-4">¿Cuánta ración se sirvió hoy?</p>
                  <p className="text-[10px] text-stone-500 mb-4">Opcional. Si no sabes, deja en blanco.</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-stone-500 mb-1">Suministrado (kg)</p>
                      <input type="number" placeholder="0" value={racion} onChange={(e) => setRacion(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 mb-1">Sobra (kg)</p>
                      <input type="number" placeholder="0" value={sobra} onChange={(e) => setSobra(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-brand-gold/30" />
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 mb-4 text-[11px] text-stone-400">
                    <p className="font-medium text-stone-300 mb-1">Resumen</p>
                    <p>Lote: {selectedLote?.nombre}</p>
                    <p>Huevos: {huevos.toLocaleString()} {rotos > 0 && `(${rotos} rotos)`}</p>
                    {mortalidad > 0 && <p>Mortalidad: {mortalidad}</p>}
                  </div>

                  <button onClick={handleSubmit} disabled={saving} className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all disabled:opacity-50">
                    {saving ? "Registrando..." : `Registrar ${huevos.toLocaleString()} huevos`}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
