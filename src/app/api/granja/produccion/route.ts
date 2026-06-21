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
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");
  const loteId = searchParams.get("loteId");

  try {
    const where: Record<string, unknown> = { userId };

    if (desde || hasta) {
      const fechaFilter: Record<string, Date> = {};
      if (desde) {
        const d = new Date(desde);
        d.setHours(0, 0, 0, 0);
        fechaFilter.gte = d;
      }
      if (hasta) {
        const h = new Date(hasta);
        h.setHours(23, 59, 59, 999);
        fechaFilter.lte = h;
      }
      where.fecha = fechaFilter;
    }

    if (loteId) {
      where.loteId = loteId;
    }

    const producciones = await prisma.produccionDiaria.findMany({
      where,
      include: {
        lote: { select: { id: true, nombre: true } },
      },
      orderBy: [{ fecha: "desc" }, { loteId: "asc" }],
    });

    const totales = {
      huevosColectados: producciones.reduce((s, p) => s + p.huevosColectados, 0),
      huevosRotos: producciones.reduce((s, p) => s + p.huevosRotos, 0),
      huevosSucios: producciones.reduce((s, p) => s + p.huevosSucios, 0),
      huevosPartidos: producciones.reduce((s, p) => s + p.huevosPartidos, 0),
      mortalidad: producciones.reduce((s, p) => s + p.mortalidad, 0),
    };

    return NextResponse.json({ producciones, totales });
  } catch (error) {
    console.error("Error listing producciones:", error);
    return NextResponse.json(
      { error: "Error al listar registros de producción" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const {
      loteId,
      fecha,
      huevosColectados,
      huevosRotos = 0,
      huevosSucios = 0,
      huevosPartidos = 0,
      mortalidad = 0,
      observaciones,
    } = body;

    // Validate required fields
    if (!loteId || !fecha || huevosColectados === undefined || huevosColectados === null) {
      return NextResponse.json(
        { error: "Campos requeridos: loteId, fecha, huevosColectados" },
        { status: 400 }
      );
    }

    // Validate lote belongs to user
    const lote = await prisma.lote.findFirst({
      where: { id: loteId, userId },
    });
    if (!lote) {
      return NextResponse.json(
        { error: "Lote no encontrado o no pertenece al usuario" },
        { status: 404 }
      );
    }

    // Normalize fecha to start of day
    const fechaDate = new Date(fecha);
    fechaDate.setHours(0, 0, 0, 0);

    // Check for duplicate (loteId + fecha unique constraint)
    const existing = await prisma.produccionDiaria.findUnique({
      where: { loteId_fecha: { loteId, fecha: fechaDate } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un registro de producción para este lote en esta fecha" },
        { status: 409 }
      );
    }

    const produccion = await prisma.produccionDiaria.create({
      data: {
        userId,
        loteId,
        fecha: fechaDate,
        huevosColectados,
        huevosRotos,
        huevosSucios,
        huevosPartidos,
        mortalidad,
        observaciones: observaciones || null,
      },
      include: {
        lote: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(produccion, { status: 201 });
  } catch (error) {
    console.error("Error creating produccion:", error);
    return NextResponse.json(
      { error: "Error al crear registro de producción" },
      { status: 500 }
    );
  }
}
