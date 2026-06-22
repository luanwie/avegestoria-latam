/**
 * FCR (Feed Conversion Ratio) — Taxa de Conversão Alimentar
 *
 * FCR = (ração fornecida - sobra) / massa de ovos produzida
 * Massa de ovos = huevosColectados * pesoPorHuevo(g) / 1000 = kg
 *
 * Um FCR mais baixo = melhor eficiência.
 * Ex: FCR 2.0 significa que a ave precisa de 2kg de ração
 *     para produzir 1kg de ovos.
 */

export interface FCRResult {
  fcr: number | null;
  feedConsumedKg: number;
  eggMassKg: number;
  isValid: boolean;
  error?: string;
}

export interface GeneticCurvePoint {
  semana: number;
  fcr: number;
}

/**
 * Calculate actual FCR from a single day's production record
 */
export function calculateFCR(
  feedProvidedKg: number | null | undefined,
  feedLeftoverKg: number | null | undefined,
  huevosColectados: number,
  pesoPorHuevoGrams: number = 60 // default 60g per egg
): FCRResult {
  const provided = feedProvidedKg ?? 0;
  const leftover = feedLeftoverKg ?? 0;
  const feedConsumed = provided - leftover;

  if (feedConsumed <= 0) {
    return {
      fcr: null,
      feedConsumedKg: 0,
      eggMassKg: 0,
      isValid: false,
      error: "No se registró consumo de ración para este día",
    };
  }

  const eggMassKg = (huevosColectados * pesoPorHuevoGrams) / 1000;

  if (eggMassKg <= 0) {
    return {
      fcr: null,
      feedConsumedKg: feedConsumed,
      eggMassKg: 0,
      isValid: false,
      error: "Sin producción de huevos para calcular FCR",
    };
  }

  const fcr = feedConsumed / eggMassKg;

  return {
    fcr: Number(fcr.toFixed(3)),
    feedConsumedKg: Number(feedConsumed.toFixed(2)),
    eggMassKg: Number(eggMassKg.toFixed(2)),
    isValid: true,
  };
}

/**
 * Get the expected FCR from the genetic curve for a given week
 */
export function getExpectedFCR(
  curvaFCR: GeneticCurvePoint[] | null | undefined,
  semanaVida: number
): number | null {
  if (!curvaFCR || curvaFCR.length === 0) return null;

  // Find exact match first
  const exact = curvaFCR.find((p) => p.semana === semanaVida);
  if (exact) return exact.fcr;

  // Find closest week (for interpolation, pick nearest)
  const sorted = [...curvaFCR].sort((a, b) => a.semana - b.semana);
  const closest = sorted.reduce((prev, curr) =>
    Math.abs(curr.semana - semanaVida) < Math.abs(prev.semana - semanaVida)
      ? curr
      : prev
  );

  return closest.fcr;
}

/**
 * Calculate FCR deviation and estimated financial loss
 */
export function calculateFCRDeviation(
  actualFCR: number,
  expectedFCR: number,
  feedConsumedKg: number,
  feedCostPerKg: number = 0.35 // default $0.35/kg of feed
): {
  deviation: number;         // positive = worse than expected
  deviationPercent: number;
  isExcessive: boolean;
  estimatedLoss: number;     // in USD
} {
  const deviation = actualFCR - expectedFCR;
  const deviationPercent = (deviation / expectedFCR) * 100;
  const isExcessive = deviation > 0; // actual FCR higher = worse

  // Loss = extra feed consumed compared to expected
  // Expected feed for same egg mass = expectedFCR * eggMass
  // Wasted feed = actualFeed - expectedFeed
  // Cost of waste = wastedFeed * costPerKg
  const wastedFeed = deviation * (feedConsumedKg / actualFCR);
  const estimatedLoss = isExcessive
    ? Number((wastedFeed * feedCostPerKg).toFixed(2))
    : 0;

  return {
    deviation: Number(deviation.toFixed(3)),
    deviationPercent: Number(deviationPercent.toFixed(1)),
    isExcessive,
    estimatedLoss,
  };
}

/**
 * Calculate the bird's age in weeks from fechaIngreso to a given date
 */
export function getSemanaVida(fechaIngreso: Date | string, fecha: Date | string = new Date()): number {
  const ingreso = new Date(fechaIngreso);
  const target = new Date(fecha);
  const diffMs = target.getTime() - ingreso.getTime();
  return Math.max(1, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
}

/**
 * Default genetic curve for common laying breeds (Hy-Line, Isa Brown, etc.)
 * FCR typically starts high (bird is growing) and improves to ~2.0 by peak production
 */
export const DEFAULT_FCR_CURVE: GeneticCurvePoint[] = [
  { semana: 1, fcr: 8.0 },
  { semana: 4, fcr: 4.5 },
  { semana: 8, fcr: 3.2 },
  { semana: 12, fcr: 2.6 },
  { semana: 18, fcr: 2.2 },
  { semana: 24, fcr: 2.0 },
  { semana: 30, fcr: 1.95 },
  { semana: 40, fcr: 2.0 },
  { semana: 50, fcr: 2.1 },
  { semana: 60, fcr: 2.25 },
  { semana: 72, fcr: 2.4 },
  { semana: 80, fcr: 2.6 },
  { semana: 90, fcr: 2.8 },
  { semana: 100, fcr: 3.0 },
];
