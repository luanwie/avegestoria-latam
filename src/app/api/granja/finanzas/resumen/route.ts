import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);

  // Default: last 30 days
  const desde =
    searchParams.get("desde") ||
    new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const hasta =
    searchParams.get("hasta") || new Date().toISOString().split("T")[0];

  const desdeDate = new Date(desde);
  const hastaDate = new Date(hasta);
  hastaDate.setHours(23, 59, 59);

  try {
    // ── Ventas (ingresos) ──
    const ventas = await prisma.venta.findMany({
      where: {
        userId,
        fecha: { gte: desdeDate, lte: hastaDate },
      },
      orderBy: { fecha: "asc" },
    });

    const totalIngresos = ventas.reduce(
      (sum, v) => sum + Number(v.docenas) * Number(v.precioPorDocena),
      0
    );

    // ── Gastos ──
    const gastos = await prisma.gasto.findMany({
      where: {
        userId,
        fecha: { gte: desdeDate, lte: hastaDate },
      },
      include: {
        lote: { select: { id: true, nombre: true } },
      },
      orderBy: { fecha: "asc" },
    });

    const totalGastos = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

    // ── Gastos por categoría ──
    const gastosPorCategoria: Record<string, number> = {};
    for (const g of gastos) {
      const cat = g.categoria;
      gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + Number(g.monto);
    }

    // ── Gastos por lote ──
    const gastosPorLoteMap: Record<string, { loteNombre: string; total: number }> = {};
    for (const g of gastos) {
      if (g.loteId) {
        const key = g.loteId;
        if (!gastosPorLoteMap[key]) {
          gastosPorLoteMap[key] = {
            loteNombre: g.lote?.nombre || "Sin nombre",
            total: 0,
          };
        }
        gastosPorLoteMap[key].total += Number(g.monto);
      }
    }

    // ── Ingresos por mes ──
    const ingresosPorMes: Record<string, number> = {};
    for (const v of ventas) {
      const mes = v.fecha.toISOString().slice(0, 7); // YYYY-MM
      ingresosPorMes[mes] =
        (ingresosPorMes[mes] || 0) +
        Number(v.docenas) * Number(v.precioPorDocena);
    }

    // ── Gastos por mes ──
    const gastosPorMes: Record<string, number> = {};
    for (const g of gastos) {
      const mes = g.fecha.toISOString().slice(0, 7);
      gastosPorMes[mes] = (gastosPorMes[mes] || 0) + Number(g.monto);
    }

    const lucro = totalIngresos - totalGastos;
    const margen = totalIngresos > 0 ? (lucro / totalIngresos) * 100 : 0;

    return NextResponse.json({
      periodo: { desde, hasta },
      totalIngresos: Number(totalIngresos.toFixed(2)),
      totalGastos: Number(totalGastos.toFixed(2)),
      lucro: Number(lucro.toFixed(2)),
      margen: Number(margen.toFixed(2)),
      gastosPorCategoria: Object.entries(gastosPorCategoria).map(
        ([categoria, total]) => ({
          categoria,
          total: Number(total.toFixed(2)),
        })
      ),
      ingresosPorMes: Object.entries(ingresosPorMes)
        .map(([mes, total]) => ({ mes, total: Number(total.toFixed(2)) }))
        .sort((a, b) => a.mes.localeCompare(b.mes)),
      gastosPorMes: Object.entries(gastosPorMes)
        .map(([mes, total]) => ({ mes, total: Number(total.toFixed(2)) }))
        .sort((a, b) => a.mes.localeCompare(b.mes)),
      gastosPorLote: Object.entries(gastosPorLoteMap).map(
        ([loteId, data]) => ({
          loteId,
          loteNombre: data.loteNombre,
          total: Number(data.total.toFixed(2)),
        })
      ),
    });
  } catch (error) {
    console.error("Error generating resumen:", error);
    return NextResponse.json({ error: "Error al generar resumen" }, { status: 500 });
  }
}
