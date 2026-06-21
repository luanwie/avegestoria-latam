import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  try {
    const gasto = await prisma.gasto.findFirst({
      where: { id, userId },
      include: { lote: { select: { id: true, nombre: true } } },
    });

    if (!gasto) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: gasto.id,
      loteId: gasto.loteId,
      loteNombre: gasto.lote?.nombre || null,
      categoria: gasto.categoria,
      fecha: gasto.fecha.toISOString(),
      monto: Number(gasto.monto),
      descripcion: gasto.descripcion,
      createdAt: gasto.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching gasto:", error);
    return NextResponse.json({ error: "Error al obtener gasto" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.gasto.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { loteId, categoria, fecha, monto, descripcion } = body;

    const validCategorias = [
      "racion", "medicinas", "vacunas", "electricidad",
      "agua", "mantenimiento", "transporte", "mano_obra", "otro",
    ];

    const updateData: Record<string, unknown> = {};

    if (categoria !== undefined) {
      if (!validCategorias.includes(categoria)) {
        return NextResponse.json(
          { error: `Categoría inválida. Válidas: ${validCategorias.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.categoria = categoria;
    }
    if (loteId !== undefined) updateData.loteId = loteId || null;
    if (fecha !== undefined) updateData.fecha = new Date(fecha);
    if (monto !== undefined) updateData.monto = Number(monto);
    if (descripcion !== undefined) updateData.descripcion = descripcion || null;

    const gasto = await prisma.gasto.update({
      where: { id },
      data: updateData,
      include: { lote: { select: { id: true, nombre: true } } },
    });

    return NextResponse.json({
      id: gasto.id,
      loteId: gasto.loteId,
      loteNombre: gasto.lote?.nombre || null,
      categoria: gasto.categoria,
      fecha: gasto.fecha.toISOString(),
      monto: Number(gasto.monto),
      descripcion: gasto.descripcion,
      createdAt: gasto.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating gasto:", error);
    return NextResponse.json({ error: "Error al actualizar gasto" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.gasto.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Gasto no encontrado" }, { status: 404 });
    }

    await prisma.gasto.delete({ where: { id } });

    return NextResponse.json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting gasto:", error);
    return NextResponse.json({ error: "Error al eliminar gasto" }, { status: 500 });
  }
}
