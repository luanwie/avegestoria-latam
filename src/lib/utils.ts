import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es").format(n);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function calcularTaxaPostura(
  huevosColectados: number,
  cantidadAves: number
): number {
  if (cantidadAves === 0) return 0;
  return (huevosColectados / cantidadAves) * 100;
}

export function calcularEdadSemanas(fechaIngreso: Date): number {
  const diff = Date.now() - fechaIngreso.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}
