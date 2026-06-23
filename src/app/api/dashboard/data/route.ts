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
  const periodDays = parseInt(searchParams.get("periodo") || "30");
  const since = new Date();
  since.setDate(since.getDate() - periodDays);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  try {
    // Lotes ativos
    const lotes = await prisma.lote.findMany({
      where: { userId, estado: "activo" },
      include: { galpon: { select: { nombre: true } }, raza: { select: { nombre: true, pesoHuevo: true } } },
    });

    // Producción hoy
    const produccionHoy = await prisma.produccionDiaria.findMany({
      where: { userId, fecha: hoy },
    });

    // Producción del período
    const produccionPeriodo = await prisma.produccionDiaria.findMany({
      where: { userId, fecha: { gte: since } },
    });

    // Ventas y gastos del período
    const [ventas, gastos] = await Promise.all([
      prisma.venta.findMany({ where: { userId, fecha: { gte: since } } }),
      prisma.gasto.findMany({ where: { userId, fecha: { gte: since } } }),
    ]);

    // Totales generales
    const totalAves = lotes.reduce((s, l) => s + l.cantidadAves, 0);
    const huevosHoy = produccionHoy.reduce((s, p) => s + p.huevosColectados, 0);
    const mortalidadHoy = produccionHoy.reduce((s, p) => s + p.mortalidad, 0);
    const ingresoPeriodo = ventas.reduce((s, v) => s + v.docenas * Number(v.precioPorDocena), 0);
    const gastoPeriodo = gastos.reduce((s, g) => s + Number(g.monto), 0);
    const lucroPeriodo = ingresoPeriodo - gastoPeriodo;
    const margen = ingresoPeriodo > 0 ? (lucroPeriodo / ingresoPeriodo) * 100 : 0;

    // Gastos por categoría
    const gastosPorCat: Record<string, number> = {};
    for (const g of gastos) {
      gastosPorCat[g.categoria] = (gastosPorCat[g.categoria] || 0) + Number(g.monto);
    }
    const maxGasto = Math.max(...Object.values(gastosPorCat), 1);

    // KPIs por lote
    const lotesKpi = lotes.map((l) => {
      const prodLoteHoy = produccionHoy.filter((p) => p.loteId === l.id);
      const prodLotePeriodo = produccionPeriodo.filter((p) => p.loteId === l.id);
      const huevosLoteHoy = prodLoteHoy.reduce((s, p) => s + p.huevosColectados, 0);
      const mortLoteHoy = prodLoteHoy.reduce((s, p) => s + p.mortalidad, 0);
      const posturaLote = l.cantidadAves > 0 ? (huevosLoteHoy / l.cantidadAves) * 100 : 0;
      const huevosLotePeriodo = prodLotePeriodo.reduce((s, p) => s + p.huevosColectados, 0);

      // FCR estimado
      const raciónPeriodo = prodLotePeriodo.reduce((s, p) => s + (Number(p.feedProvidedKg || 0) - Number(p.feedLeftoverKg || 0)), 0);
      const pesoHuevo = Number(l.raza?.pesoHuevo || 60) / 1000;
      const masaHuevo = huevosLotePeriodo * pesoHuevo;
      const fcr = masaHuevo > 0 ? raciónPeriodo / masaHuevo : 0;

      // Edad en semanas
      const edadSemanas = l.fechaIngreso
        ? Math.floor((Date.now() - new Date(l.fechaIngreso).getTime()) / (7 * 24 * 60 * 60 * 1000))
        : 0;

      return {
        id: l.id,
        nombre: l.nombre,
        galpon: l.galpon?.nombre || "",
        raza: l.raza?.nombre || "",
        cantidadAves: l.cantidadAves,
        edadSemanas,
        huevosHoy: huevosLoteHoy,
        postura: posturaLote,
        mortalidad: mortLoteHoy,
        fcr: fcr > 0 ? Math.round(fcr * 100) / 100 : null,
        costoAve: l.costoAve ? Number(l.costoAve) : null,
        estado: l.estado,
      };
    });

    // FCR alert
    const fcrAlerta = lotesKpi.filter((l) => l.fcr && l.fcr > 2.5);
    const fcrAlertMessage = fcrAlerta.length > 0
      ? `FCR elevado en ${fcrAlerta.map((l) => l.nombre).join(", ")}. Revisa la ración.`
      : null;

    // Mortalidad alert
    const mortAlerta = lotesKpi.filter((l) => l.mortalidad > l.cantidadAves * 0.005);
    const mortAlertMessage = mortAlerta.length > 0
      ? `Mortalidad elevada en ${mortAlerta.map((l) => l.nombre).join(", ")}.`
      : null;

    return NextResponse.json({
      kpis: {
        lucro: { value: `$${Math.round(lucroPeriodo).toLocaleString()}`, change: margen.toFixed(0) + "%" },
        postura: { value: totalAves > 0 ? (huevosHoy / totalAves * 100).toFixed(1) + "%" : "0%", change: null },
        mortalidad: { value: mortalidadHoy.toString(), change: null },
        fcr: {
          value: lotesKpi.filter((l) => l.fcr).length > 0
            ? (lotesKpi.filter((l) => l.fcr).reduce((s, l) => s + (l.fcr || 0), 0) / lotesKpi.filter((l) => l.fcr).length).toFixed(2)
            : "--",
          change: null,
        },
      },
      lotes: lotesKpi,
      gastosPorCategoria: Object.entries(gastosPorCat).map(([cat, monto]) => ({
        categoria: cat,
        monto: Math.round(monto * 100) / 100,
        pct: Math.round((monto / maxGasto) * 100),
      })),
      resumen: {
        ingresoPeriodo: Math.round(ingresoPeriodo * 100) / 100,
        gastoPeriodo: Math.round(gastoPeriodo * 100) / 100,
        lucroPeriodo: Math.round(lucroPeriodo * 100) / 100,
        margen: Math.round(margen * 10) / 10,
        totalAves,
        huevosHoy,
        mortalidadHoy,
        lotesCount: lotes.length,
      },
      alertas: {
        fcr: fcrAlertMessage,
        mortalidad: mortAlertMessage,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Error al cargar datos" }, { status: 500 });
  }
}
