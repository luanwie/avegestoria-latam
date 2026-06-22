"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, DollarSign, ChevronRight } from "lucide-react";

interface DREProps {
  ingresos: number;
  gastos: number;
  lucro: number;
  margen: number;
  loading: boolean;
}

export function DRECard({ ingresos, gastos, lucro, margen, loading }: DREProps) {
  if (loading) {
    return (
      <div className="bg-bg-secondary border border-white/5 rounded-xl p-5 animate-pulse">
        <div className="h-4 w-24 bg-white/5 rounded mb-4" />
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-8 bg-white/5 rounded mb-2" />
        ))}
      </div>
    );
  }

  const items = [
    { label: "Ingresos Totales", value: ingresos, color: "text-emerald-400", icon: TrendingUp, format: true },
    { label: "Gastos Totales", value: -gastos, color: "text-rose-400", icon: TrendingDown, format: true },
    { label: "Lucro Neto", value: lucro, color: lucro >= 0 ? "text-brand-gold" : "text-rose-400", icon: DollarSign, format: true, bold: true },
    { label: "Margen", value: margen, color: margen >= 0 ? "text-emerald-400" : "text-rose-400", icon: ChevronRight, format: false, suffix: "%" },
  ];

  const maxAbs = Math.max(
    ...items.filter(i => i.format).map(i => Math.abs(i.value)),
    1
  );

  return (
    <div className="bg-bg-secondary border border-white/5 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-brand-gold" />
        Demonstrativo de Resultados
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <item.icon className="w-3.5 h-3.5 text-stone-500" />
                <span className={`text-xs ${item.bold ? "font-semibold" : "text-stone-400"}`}>
                  {item.label}
                </span>
              </div>
              <span className={`text-xs font-semibold ${item.color}`}>
                {item.format
                  ? `$${Math.abs(item.value).toLocaleString("es", { minimumFractionDigits: 0 })}`
                  : `${item.value.toFixed(1)}${item.suffix || ""}`}
              </span>
            </div>
            {item.format && (
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${item.value >= 0 ? "bg-gradient-to-r from-emerald-600 to-brand-gold" : "bg-rose-600"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.abs(item.value) / maxAbs) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {lucro > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 pt-4 border-t border-white/5"
        >
          <p className="text-[11px] text-stone-500">
            Por cada dólar de ingreso, tu ganancia neta es de{" "}
            <span className="text-brand-gold font-semibold">${(lucro / (ingresos || 1)).toFixed(2)}</span>
          </p>
          <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-brand-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(margen, 100)}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
