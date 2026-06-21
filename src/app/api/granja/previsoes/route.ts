import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { searchParams } = new URL(request.url);
    const loteId = searchParams.get("loteId");

    const where: Record<string, unknown> = { userId };
    if (loteId) where.loteId = loteId;

    // ── Get last 60 days of production data ──
    const producciones = await prisma.produccionDiaria.findMany({
      where: {
        ...where,
        fecha: { gte: new Date(Date.now() - 60 * 86400000) },
      },
      include: { lote: { select: { nombre: true, cantidadAves: true } } },
      orderBy: { fecha: "asc" },
    });

    if (producciones.length < 3) {
      return NextResponse.json({
        error: "Se necesitan al menos 3 registros de producción para generar predicciones",
        datos: false,
      });
    }

    // ── Group by day ──
    const dayMap: Record<string, { total: number; mortalidad: number; lotes: Set<string> }> = {};
    for (const p of producciones) {
      const key = p.fecha.toISOString().split("T")[0];
      if (!dayMap[key]) dayMap[key] = { total: 0, mortalidad: 0, lotes: new Set() };
      dayMap[key].total += p.huevosColectados;
      dayMap[key].mortalidad += p.mortalidad;
      dayMap[key].lotes.add(p.loteId);
    }

    const days = Object.entries(dayMap).sort(([a], [b]) => a.localeCompare(b));
    const n = days.length;

    // ── Simple linear regression: y = a + bx ──
    const xValues = days.map((_, i) => i);
    const yValues = days.map(([, d]) => d.total);
    const sumX = xValues.reduce((s, x) => s + x, 0);
    const sumY = yValues.reduce((s, y) => s + y, 0);
    const sumXY = xValues.reduce((s, x, i) => s + x * yValues[i], 0);
    const sumX2 = xValues.reduce((s, x) => s + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // ── Predict next 30 days ──
    const predictions30: number[] = [];
    for (let i = 1; i <= 30; i++) {
      const pred = Math.round(Math.max(0, slope * (n + i - 1) + intercept));
      predictions30.push(pred);
    }

    // ── Cost prediction (based on last 30 days of gastos) ──
    const gastos = await prisma.gasto.findMany({
      where: {
        ...where,
        fecha: { gte: new Date(Date.now() - 30 * 86400000) },
      },
      select: { monto: true, categoria: true },
    });

    const totalGastos30 = gastos.reduce((s, g) => s + Number(g.monto), 0);
    const gastoDiarioMedio = totalGastos30 / 30;

    // ── Average and trend ──
    const avgDaily = Math.round(sumY / n);
    const trend = slope > 0 ? "subiendo" : slope < 0 ? "bajando" : "estable";
    const trendPct = avgDaily > 0 ? ((slope / avgDaily) * 100) * 30 : 0; // % change over 30 days

    // ── Get lotes info ──
    const lotes = await prisma.lote.findMany({
      where: { userId, estado: "activo" },
      select: { id: true, nombre: true, cantidadAves: true },
    });

    const totalAves = lotes.reduce((s, l) => s + l.cantidadAves, 0);
    const avgPostura = totalAves > 0 ? (avgDaily / totalAves) * 100 : 0;
    const predPostura30 = predictions30.length > 0
      ? (predictions30.reduce((s, v) => s + v, 0) / predictions30.length / totalAves) * 100
      : 0;

    return NextResponse.json({
      datos: true,
      periodo: { desde: days[0][0], hasta: days[n - 1][0] },
      actual: {
        promedioDiario: avgDaily,
        tendencia: trend,
        variacionEstimada30d: `${trendPct > 0 ? "+" : ""}${trendPct.toFixed(1)}%`,
        taxaPosturaMedia: `${avgPostura.toFixed(1)}%`,
        avesActivas: totalAves,
        lotesActivos: lotes.length,
      },
      prediccionProduccion: {
        proximos30Dias: predictions30,
        totalEstimado30d: predictions30.reduce((s, v) => s + v, 0),
        promedioEstimado: Math.round(predictions30.reduce((s, v) => s + v, 0) / 30),
        taxaPosturaEstimada: `${predPostura30.toFixed(1)}%`,
      },
      prediccionCostos: {
        gastoDiarioMedio: Number(gastoDiarioMedio.toFixed(2)),
        gastoMensualEstimado: Number(totalGastos30.toFixed(2)),
        proyeccion30d: Number((gastoDiarioMedio * 30).toFixed(2)),
      },
      ultimosDias: days.slice(-14).map(([fecha, d]) => ({
        fecha,
        huevos: d.total,
        mortalidad: d.mortalidad,
      })),
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json({ error: "Error al generar predicciones" }, { status: 500 });
  }
}
