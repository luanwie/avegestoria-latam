"use client";

import { motion } from "motion/react";
import { AlertTriangle, DollarSign, TrendingDown } from "lucide-react";
import { calculateFCR, getExpectedFCR, calculateFCRDeviation, getSemanaVida, DEFAULT_FCR_CURVE, type GeneticCurvePoint } from "@/lib/fcr";

interface FCRAlertData {
  loteId: string;
  loteNombre: string;
  razaNombre: string;
  fechaIngreso: string;
  pesoHuevo: number;
  curvaFCR: GeneticCurvePoint[] | null;
  huevosColectados: number;
  feedProvidedKg: number | null;
  feedLeftoverKg: number | null;
}

interface FCRAlertProps {
  producciones: FCRAlertData[];
  loading: boolean;
}

export function FCRAlertBanner({ producciones, loading }: FCRAlertProps) {
  if (loading || producciones.length === 0) return null;

  const alertas: {
    loteNombre: string;
    fcrActual: number;
    fcrEsperado: number;
    deviation: number;
    estimatedLoss: number;
  }[] = [];

  for (const p of producciones) {
    if (p.feedProvidedKg == null) continue; // no feed data, skip

    const fcrResult = calculateFCR(
      p.feedProvidedKg,
      p.feedLeftoverKg,
      p.huevosColectados,
      p.pesoHuevo
    );

    if (!fcrResult.isValid || fcrResult.fcr == null) continue;

    const semana = getSemanaVida(p.fechaIngreso);
    const curva = p.curvaFCR || DEFAULT_FCR_CURVE;
    const fcrEsperado = getExpectedFCR(curva, semana);

    if (fcrEsperado == null) continue;

    if (fcrResult.fcr > fcrEsperado) {
      const deviation = calculateFCRDeviation(
        fcrResult.fcr,
        fcrEsperado,
        fcrResult.feedConsumedKg
      );

      alertas.push({
        loteNombre: p.loteNombre,
        fcrActual: fcrResult.fcr,
        fcrEsperado,
        deviation: deviation.deviationPercent,
        estimatedLoss: deviation.estimatedLoss,
      });
    }
  }

  if (alertas.length === 0) return null;

  const totalLoss = alertas.reduce((s, a) => s + a.estimatedLoss, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-rose-900/20 border border-rose-700/30 rounded-xl p-5 mb-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-rose-800/30 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
            Fuga Financeira Nutricional
            <span className="text-[10px] bg-rose-800/40 text-rose-300 px-2 py-0.5 rounded-full">
              FCR ALTO
            </span>
          </h3>
          <p className="text-xs text-rose-400/80 mt-1">
            La conversión alimentar está por encima de la curva genética esperada.
          </p>

          <div className="mt-3 space-y-2">
            {alertas.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-rose-950/30 border border-rose-800/20 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-stone-200">{a.loteNombre}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      FCR Actual: <span className="text-rose-400 font-semibold">{a.fcrActual}</span> — 
                      Esperado: <span className="text-emerald-400">{a.fcrEsperado}</span> — 
                      Desvío: <span className="text-rose-400">+{a.deviation}%</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-stone-500 uppercase">Pérdida Est.</p>
                    <p className="text-sm font-bold text-rose-400">
                      ${a.estimatedLoss.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-rose-800/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs text-stone-400">Pérdida total estimada hoy:</span>
            </div>
            <span className="text-sm font-bold text-rose-400">${totalLoss.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
