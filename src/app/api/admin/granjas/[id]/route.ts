import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    // Verify this user shared data
    const user = await prisma.user.findFirst({
      where: { id, dataShared: true },
      select: {
        id: true,
        name: true,
        email: true,
        nombreGranja: true,
        ciudad: true,
        pais: true,
        moneda: true,
        plan: true,
        whatsappNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Granja no encontrada o no compartió datos" },
        { status: 404 }
      );
    }

    // Fetch granja data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [lotes, ventas, gastos, produccionHoy, produccionMes] = await Promise.all([
      prisma.lote.findMany({
        where: { userId: id },
        include: {
          galpon: { select: { nombre: true } },
          raza: { select: { nombre: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.venta.findMany({
        where: { userId: id },
        orderBy: { fecha: "desc" },
        take: 30,
      }),
      prisma.gasto.findMany({
        where: { userId: id },
        include: { lote: { select: { nombre: true } } },
        orderBy: { fecha: "desc" },
        take: 50,
      }),
      // Today's production
      prisma.produccionDiaria.findMany({
        where: { userId: id, fecha: { gte: today } },
        include: { lote: { select: { nombre: true } } },
      }),
      // Monthly production
      prisma.produccionDiaria.findMany({
        where: { userId: id, fecha: { gte: monthStart } },
        orderBy: { fecha: "desc" },
      }),
    ]);

    // Calculate resumen
    const huevosHoy = produccionHoy.reduce((s, p) => s + p.huevosColectados, 0);
    const mortalidadHoy = produccionHoy.reduce((s, p) => s + p.mortalidad, 0);
    const huevosMes = produccionMes.reduce((s, p) => s + p.huevosColectados, 0);
    const ingresoMes = ventas
      .filter((v) => new Date(v.fecha) >= monthStart)
      .reduce((s, v) => s + Number(v.docenas) * Number(v.precioPorDocena), 0);
    const gastoMes = gastos
      .filter((g) => new Date(g.fecha) >= monthStart)
      .reduce((s, g) => s + Number(g.monto), 0);

    // Lotes active + their latest production
    const lotesActivos = lotes.filter((l) => l.estado === "activo");
    const totalAves = lotesActivos.reduce((s, l) => s + l.cantidadAves, 0);

    return NextResponse.json({
      profile: { ...user, totalAves, lotesCount: lotes.length },
      resumen: {
        huevosHoy,
        mortalidadHoy,
        huevosMes,
        ingresoMes: Math.round(ingresoMes * 100) / 100,
        gastoMes: Math.round(gastoMes * 100) / 100,
        lucroMes: Math.round((ingresoMes - gastoMes) * 100) / 100,
        margen: ingresoMes > 0 ? Math.round(((ingresoMes - gastoMes) / ingresoMes) * 100 * 100) / 100 : 0,
      },
      lotes: lotes.map((l) => ({
        id: l.id,
        nombre: l.nombre,
        galpon: l.galpon?.nombre || "—",
        raza: l.raza?.nombre || "—",
        cantidadAves: l.cantidadAves,
        fechaIngreso: l.fechaIngreso,
        estado: l.estado,
        costoAve: l.costoAve ? Number(l.costoAve) : null,
      })),
      ventas: ventas.map((v) => ({
        id: v.id,
        fecha: v.fecha,
        clienteNombre: v.clienteNombre,
        docenas: v.docenas,
        precioPorDocena: Number(v.precioPorDocena),
        total: Math.round(v.docenas * Number(v.precioPorDocena) * 100) / 100,
        metodoPago: v.metodoPago,
      })),
      gastos: gastos.map((g) => ({
        id: g.id,
        fecha: g.fecha,
        categoria: g.categoria,
        monto: Number(g.monto),
        descripcion: g.descripcion,
        loteNombre: g.lote?.nombre || null,
      })),
    });
  } catch (error) {
    console.error("Admin granja detail error:", error);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}
