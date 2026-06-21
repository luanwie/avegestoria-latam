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
  const periodDays = parseInt(searchParams.get("periodo") || "7");
  const since = new Date();
  since.setDate(since.getDate() - periodDays);

  try {
    // ── Galpones ──
    const galpones = await prisma.galpon.findMany({
      where: { userId },
      include: { _count: { select: { lotes: true } } },
    });

    // ── Lotes ativos ──
    const lotes = await prisma.lote.findMany({
      where: { userId, estado: "activo" },
      include: { galpon: true, raza: true },
    });

    // ── Producción do período ──
    const produccion = await prisma.produccionDiaria.findMany({
      where: {
        userId,
        fecha: { gte: since },
      },
      include: { lote: true },
      orderBy: { fecha: "asc" },
    });

    // ── Hoy ──
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const produccionHoy = await prisma.produccionDiaria.findMany({
      where: { userId, fecha: hoy },
    });

    const huevosHoy = produccionHoy.reduce((s, p) => s + p.huevosColectados, 0);
    const mortalidadHoy = produccionHoy.reduce((s, p) => s + p.mortalidad, 0);
    const totalAvesActivas = lotes.reduce((s, l) => s + l.cantidadAves, 0);
    const taxaPostura =
      totalAvesActivas > 0
        ? (huevosHoy / totalAvesActivas) * 100
        : 0;

    // ── Ventas do período ──
    const ventas = await prisma.venta.findMany({
      where: {
        userId,
        fecha: { gte: since },
      },
      orderBy: { fecha: "asc" },
    });

    const ingresoPeriodo = ventas.reduce(
      (s, v) => s + Number(v.docenas) * Number(v.precioPorDocena),
      0
    );

    // ── Gastos do período ──
    const gastos = await prisma.gasto.findMany({
      where: {
        userId,
        fecha: { gte: since },
      },
      orderBy: { fecha: "asc" },
    });

    const gastoPeriodo = gastos.reduce((s, g) => s + Number(g.monto), 0);

    // ── Actividades recentes ──
    const actividades: Array<{ fecha: string; accion: string; detalle: string }> = [];

    for (const p of produccion.slice(-5).reverse()) {
      actividades.push({
        fecha: p.fecha.toISOString().split("T")[0],
        accion: "Registró producción",
        detalle: `${p.lote?.nombre || "Lote"} • ${p.huevosColectados} huevos`,
      });
    }

    for (const v of ventas.slice(-3).reverse()) {
      actividades.push({
        fecha: v.fecha.toISOString().split("T")[0],
        accion: "Venta registrada",
        detalle: `${v.docenas} docenas • $${Number(v.precioPorDocena).toFixed(2)}`,
      });
    }

    // ── Datos de gráficos (agregados por día) ──
    const ingresosPorDia: Record<string, number> = {};
    const gastosPorDia: Record<string, number> = {};

    for (const v of ventas) {
      const key = v.fecha.toISOString().split("T")[0];
      ingresosPorDia[key] =
        (ingresosPorDia[key] || 0) +
        Number(v.docenas) * Number(v.precioPorDocena);
    }

    for (const g of gastos) {
      const key = g.fecha.toISOString().split("T")[0];
      gastosPorDia[key] = (gastosPorDia[key] || 0) + Number(g.monto);
    }

    const chartData: Array<{
      fecha: string;
      ingresos: number;
      gastos: number;
      huevos: number;
      mortalidad: number;
    }> = [];

    for (let i = periodDays; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      chartData.push({
        fecha: key,
        ingresos: ingresosPorDia[key] || 0,
        gastos: gastosPorDia[key] || 0,
        huevos: produccion
          .filter((p) => p.fecha.toISOString().split("T")[0] === key)
          .reduce((s, p) => s + p.huevosColectados, 0),
        mortalidad: produccion
          .filter((p) => p.fecha.toISOString().split("T")[0] === key)
          .reduce((s, p) => s + p.mortalidad, 0),
      });
    }

    return NextResponse.json({
      kpis: {
        huevosHoy: { value: huevosHoy.toLocaleString(), change: null },
        taxaPostura: { value: `${taxaPostura.toFixed(1)}%`, change: null },
        ingresoMensual: {
          value: `$${ingresoPeriodo.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`,
          change: null,
        },
        mortalidad: { value: mortalidadHoy.toString(), change: null },
      },
      galpones: galpones.map((g) => ({
        id: g.id,
        nombre: g.nombre,
        lotes: g._count.lotes,
        aves: lotes
          .filter((l) => l.galponId === g.id)
          .reduce((s, l) => s + l.cantidadAves, 0),
      })),
      lotes: lotes.map((l) => ({
        id: l.id,
        nombre: l.nombre,
        galpon: l.galpon?.nombre || "",
        raza: l.raza?.nombre || "",
        cantidad: l.cantidadAves,
        edad: `${l.edadSemanas || 0} sem`,
        postura: "",
        estado: l.estado || "activo",
      })),
      chartData,
      actividades: actividades.slice(0, 8),
      resumen: {
        galpones: galpones.length,
        lotes: lotes.length,
        aves: totalAvesActivas,
        produccionTotal: produccion.reduce((s, p) => s + p.huevosColectados, 0),
        ingresoPeriodo: Number(ingresoPeriodo.toFixed(2)),
        gastoPeriodo: Number(gastoPeriodo.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { error: "Error al cargar datos" },
      { status: 500 }
    );
  }
}
