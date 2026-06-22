import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type ReportTipo = "produccion" | "financiero" | "lote";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tipo: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const tipo = await params.then((p) => p.tipo as ReportTipo);
  const { searchParams } = new URL(request.url);
  const desde = searchParams.get("desde") || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const hasta = searchParams.get("hasta") || new Date().toISOString().split("T")[0];
  const desdeDate = new Date(desde);
  const hastaDate = new Date(hasta);
  hastaDate.setHours(23, 59, 59);

  try {
    switch (tipo) {
      case "produccion": {
        const lotes = await prisma.lote.findMany({
          where: { userId, estado: "activo" },
          select: { id: true, nombre: true, cantidadAves: true },
        });

        const producciones = await prisma.produccionDiaria.findMany({
          where: {
            userId,
            fecha: { gte: desdeDate, lte: hastaDate },
          },
          include: { lote: { select: { nombre: true } } },
          orderBy: { fecha: "asc" },
        });

        const totalHuevos = producciones.reduce((s, p) => s + p.huevosColectados, 0);
        const totalMortalidad = producciones.reduce((s, p) => s + p.mortalidad, 0);
        const totalAves = lotes.reduce((s, l) => s + l.cantidadAves, 0);
        const promedioDiario = producciones.length > 0 ? Math.round(totalHuevos / producciones.length) : 0;
        const tasaPostura = totalAves > 0 && producciones.length > 0
          ? ((totalHuevos / (totalAves * producciones.length)) * 100).toFixed(1)
          : "0.0";

        return NextResponse.json({
          periodo: { desde, hasta },
          resumen: {
            totalHuevos: totalHuevos.toLocaleString(),
            promedioDiario: promedioDiario.toLocaleString(),
            tasaPostura: `${tasaPostura}%`,
            totalMortalidad,
            dias: producciones.length,
            lotesActivos: lotes.length,
          },
          detalle: producciones.map((p) => ({
            fecha: p.fecha.toISOString().split("T")[0],
            lote: p.lote.nombre,
            huevos: p.huevosColectados,
            rotos: p.huevosRotos,
            mortalidad: p.mortalidad,
          })),
        });
      }

      case "financiero": {
        const ventas = await prisma.venta.findMany({
          where: { userId, fecha: { gte: desdeDate, lte: hastaDate } },
          orderBy: { fecha: "asc" },
        });

        const gastos = await prisma.gasto.findMany({
          where: { userId, fecha: { gte: desdeDate, lte: hastaDate } },
          include: { lote: { select: { nombre: true } } },
          orderBy: { fecha: "asc" },
        });

        const totalIngresos = ventas.reduce((s, v) => s + Number(v.docenas) * Number(v.precioPorDocena), 0);
        const totalGastos = gastos.reduce((s, g) => s + Number(g.monto), 0);
        const lucro = totalIngresos - totalGastos;
        const margen = totalIngresos > 0 ? ((lucro / totalIngresos) * 100).toFixed(1) : "0.0";

        const gastosPorCategoria: Record<string, number> = {};
        for (const g of gastos) {
          gastosPorCategoria[g.categoria] = (gastosPorCategoria[g.categoria] || 0) + Number(g.monto);
        }

        return NextResponse.json({
          periodo: { desde, hasta },
          resumen: {
            totalIngresos: totalIngresos.toFixed(2),
            totalGastos: totalGastos.toFixed(2),
            lucro: lucro.toFixed(2),
            margen: `${margen}%`,
          },
          gastosPorCategoria: Object.entries(gastosPorCategoria).map(([categoria, total]) => ({
            categoria,
            total: Number(total.toFixed(2)),
          })),
          detalleVentas: ventas.map((v) => ({
            fecha: v.fecha.toISOString().split("T")[0],
            cliente: v.clienteNombre || "—",
            docenas: v.docenas,
            total: (Number(v.docenas) * Number(v.precioPorDocena)).toFixed(2),
            metodo: v.metodoPago,
          })),
          detalleGastos: gastos.map((g) => ({
            fecha: g.fecha.toISOString().split("T")[0],
            categoria: g.categoria,
            lote: g.lote?.nombre || "—",
            monto: Number(g.monto).toFixed(2),
          })),
        });
      }

      case "lote": {
        const lotes = await prisma.lote.findMany({
          where: {
            userId,
            estado: { in: ["activo", "finalizado"] },
          },
          include: {
            raza: { select: { nombre: true, productividadEsperada: true } },
            galpon: { select: { nombre: true } },
            producciones: {
              where: { fecha: { gte: desdeDate, lte: hastaDate } },
              select: { huevosColectados: true, mortalidad: true, fecha: true },
            },
            gastos: {
              where: { fecha: { gte: desdeDate, lte: hastaDate } },
              select: { monto: true, categoria: true },
            },
          },
        });

        const lotesReport = lotes.map((l) => {
          const totalHuevos = l.producciones.reduce((s, p) => s + p.huevosColectados, 0);
          const totalMortalidad = l.producciones.reduce((s, p) => s + p.mortalidad, 0);
          const totalGastos = l.gastos.reduce((s, g) => s + Number(g.monto), 0);
          const edadSemanas = Math.floor(
            (Date.now() - new Date(l.fechaIngreso).getTime()) / (7 * 86400000)
          );
          const tasaPostura = l.cantidadAves > 0 && l.producciones.length > 0
            ? ((totalHuevos / (l.cantidadAves * l.producciones.length)) * 100).toFixed(1)
            : "0.0";

          return {
            nombre: l.nombre,
            galpon: l.galpon?.nombre || "—",
            raza: l.raza?.nombre || "—",
            aves: l.cantidadAves,
            edad: `${edadSemanas} sem`,
            estado: l.estado,
            produccion: totalHuevos.toLocaleString(),
            tasaPostura: `${tasaPostura}%`,
            mortalidad: totalMortalidad,
            gastos: totalGastos.toFixed(2),
          };
        });

        return NextResponse.json({
          periodo: { desde, hasta },
          resumen: {
            totalLotes: lotes.length,
            activos: lotes.filter((l) => l.estado === "activo").length,
          },
          lotes: lotesReport,
        });
      }

      default:
        return NextResponse.json({ error: "Tipo de informe no válido" }, { status: 400 });
    }
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Error al generar informe" }, { status: 500 });
  }
}
