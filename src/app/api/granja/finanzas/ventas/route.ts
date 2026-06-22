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
  const cliente = searchParams.get("cliente");
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  const where: Record<string, unknown> = { userId };

  if (cliente) where.clienteNombre = { contains: cliente };
  if (desde || hasta) {
    const fechaFilter: Record<string, Date> = {};
    if (desde) fechaFilter.gte = new Date(desde);
    if (hasta) { const hastaDate = new Date(hasta); hastaDate.setHours(23, 59, 59); fechaFilter.lte = hastaDate; }
    where.fecha = fechaFilter;
  }

  try {
    const ventas = await prisma.venta.findMany({ where, orderBy: { fecha: "desc" } });

    return NextResponse.json(
      ventas.map((v) => ({
        id: v.id,
        clienteNombre: v.clienteNombre || null,
        fecha: v.fecha.toISOString(),
        docenas: v.docenas,
        precioPorDocena: Number(v.precioPorDocena),
        total: Number(v.docenas) * Number(v.precioPorDocena),
        metodoPago: v.metodoPago,
        descripcion: v.descripcion,
        createdAt: v.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching ventas:", error);
    return NextResponse.json({ error: "Error al obtener ventas" }, { status: 500 });
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
    const { clienteNombre, fecha, docenas, precioPorDocena, metodoPago, descripcion } = body;

    if (!fecha || docenas === undefined || precioPorDocena === undefined) {
      return NextResponse.json({ error: "Campos requeridos: fecha, docenas, precioPorDocena" }, { status: 400 });
    }
    if (typeof docenas !== "number" || docenas <= 0) {
      return NextResponse.json({ error: "docenas debe ser un número positivo" }, { status: 400 });
    }

    const venta = await prisma.venta.create({
      data: {
        userId,
        clienteNombre: clienteNombre || null,
        fecha: new Date(fecha),
        docenas,
        precioPorDocena: Number(precioPorDocena),
        metodoPago: metodoPago || "efectivo",
        descripcion: descripcion || null,
      },
    });

    return NextResponse.json(
      {
        id: venta.id,
        clienteNombre: venta.clienteNombre,
        fecha: venta.fecha.toISOString(),
        docenas: venta.docenas,
        precioPorDocena: Number(venta.precioPorDocena),
        total: Number(venta.docenas) * Number(venta.precioPorDocena),
        metodoPago: venta.metodoPago,
        descripcion: venta.descripcion,
        createdAt: venta.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating venta:", error);
    return NextResponse.json({ error: "Error al crear venta" }, { status: 500 });
  }
}
