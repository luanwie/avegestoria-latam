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
  const loteId = searchParams.get("loteId");
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  const where: Record<string, unknown> = { userId };

  if (loteId) where.loteId = loteId;

  if (desde || hasta) {
    const fechaFilter: Record<string, Date> = {};
    if (desde) fechaFilter.gte = new Date(desde);
    if (hasta) {
      const hastaDate = new Date(hasta);
      hastaDate.setHours(23, 59, 59);
      fechaFilter.lte = hastaDate;
    }
    where.fecha = fechaFilter;
  }

  try {
    const gastos = await prisma.gasto.findMany({
      where,
      include: {
        lote: { select: { id: true, nombre: true } },
      },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(
      gastos.map((g) => ({
        id: g.id,
        loteId: g.loteId,
        loteNombre: g.lote?.nombre || null,
        categoria: g.categoria,
        fecha: g.fecha.toISOString(),
        monto: Number(g.monto),
        descripcion: g.descripcion,
        createdAt: g.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching gastos:", error);
    return NextResponse.json({ error: "Error al obtener gastos" }, { status: 500 });
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
    const { loteId, categoria, fecha, monto, descripcion } = body;

    if (!categoria || !fecha || monto === undefined) {
      return NextResponse.json(
        { error: "Campos requeridos: categoria, fecha, monto" },
        { status: 400 }
      );
    }

    const validCategorias = [
      "racion", "medicinas", "vacunas", "electricidad",
      "agua", "mantenimiento", "transporte", "mano_obra", "otro",
    ];
    if (!validCategorias.includes(categoria)) {
      return NextResponse.json(
        { error: `Categoría inválida. Válidas: ${validCategorias.join(", ")}` },
        { status: 400 }
      );
    }

    const gasto = await prisma.gasto.create({
      data: {
        userId,
        loteId: loteId || null,
        categoria,
        fecha: new Date(fecha),
        monto: Number(monto),
        descripcion: descripcion || null,
      },
      include: {
        lote: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(
      {
        id: gasto.id,
        loteId: gasto.loteId,
        loteNombre: gasto.lote?.nombre || null,
        categoria: gasto.categoria,
        fecha: gasto.fecha.toISOString(),
        monto: Number(gasto.monto),
        descripcion: gasto.descripcion,
        createdAt: gasto.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gasto:", error);
    return NextResponse.json({ error: "Error al crear gasto" }, { status: 500 });
  }
}
