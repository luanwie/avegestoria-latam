import { TrendingUp, TrendingDown, Minus, Eye, Egg, DollarSign } from "lucide-react";

interface PredictionsProps {
  data: {
    actual: {
      promedioDiario: number;
      tendencia: string;
      variacionEstimada30d: string;
      taxaPosturaMedia: string;
      avesActivas: number;
      lotesActivos: number;
    };
    prediccionProduccion: {
      totalEstimado30d: number;
      promedioEstimado: number;
      taxaPosturaEstimada: string;
    };
    prediccionCostos: {
      gastoDiarioMedio: number;
      gastoMensualEstimado: number;
      proyeccion30d: number;
    };
  } | null;
  error?: string;
  loading: boolean;
}

export default function PredictionsCards({ data, error, loading }: PredictionsProps) {
  if (loading) {
    return (
      <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-teal-400" />
          Predicciones
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const TrendIcon = data.actual.tendencia === "subiendo" ? TrendingUp : data.actual.tendencia === "bajando" ? TrendingDown : Minus;
  const trendColor = data.actual.tendencia === "subiendo" ? "text-emerald-400" : data.actual.tendencia === "bajando" ? "text-rose-400" : "text-stone-400";

  return (
    <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center gap-2">
        <Eye className="w-4 h-4 text-brand-gold" />
        Predicciones — Próximos 30 Días
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-950/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Egg className="w-3.5 h-3.5 text-emerald-400" />
            <p className="text-[10px] text-stone-500">Producción Estimada</p>
          </div>
          <p className="text-lg font-bold text-stone-100">
            {data.prediccionProduccion.totalEstimado30d.toLocaleString()}
          </p>
          <p className="text-[10px] text-stone-500">
            {data.prediccionProduccion.promedioEstimado.toLocaleString()} huevos/día
          </p>
        </div>

        <div className="bg-emerald-950/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
            <p className="text-[10px] text-stone-500">Tendencia</p>
          </div>
          <p className={`text-lg font-bold capitalize ${trendColor}`}>
            {data.actual.tendencia}
          </p>
          <p className="text-[10px] text-stone-500">
            {data.actual.variacionEstimada30d} en 30 días
          </p>
        </div>

        <div className="bg-emerald-950/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Egg className="w-3.5 h-3.5 text-teal-400" />
            <p className="text-[10px] text-stone-500">Tasa de Postura</p>
          </div>
          <p className="text-lg font-bold text-teal-300">
            {data.prediccionProduccion.taxaPosturaEstimada}
          </p>
          <p className="text-[10px] text-stone-500">
            Actual: {data.actual.taxaPosturaMedia}
          </p>
        </div>

        <div className="bg-emerald-950/40 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <p className="text-[10px] text-stone-500">Costos Estimados</p>
          </div>
          <p className="text-lg font-bold text-amber-300">
            ${data.prediccionCostos.proyeccion30d.toLocaleString()}
          </p>
          <p className="text-[10px] text-stone-500">
            ${data.prediccionCostos.gastoDiarioMedio.toFixed(2)}/día
          </p>
        </div>
      </div>
    </div>
  );
}
