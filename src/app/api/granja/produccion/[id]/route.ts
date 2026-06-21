import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
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
    const produccion = await prisma.produccionDiaria.findFirst({
      where: { id, userId },
      include: {
        lote: { select: { id: true, nombre: true } },
      },
    });

    if (!produccion) {
      return NextResponse.json(
        { error: "Registro de producción no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(produccion);
  } catch (error) {
    console.error("Error getting produccion:", error);
    return NextResponse.json(
      { error: "Error al obtener registro de producción" },
      { status: 500 }
    );
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
    // Check record exists and belongs to user
    const existing = await prisma.produccionDiaria.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Registro de producción no encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      loteId,
      fecha,
      huevosColectados,
      huevosRotos,
      huevosSucios,
      huevosPartidos,
      mortalidad,
      observaciones,
    } = body;

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (loteId !== undefined) {
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
      updateData.loteId = loteId;
    }

    if (fecha !== undefined) {
      const fechaDate = new Date(fecha);
      fechaDate.setHours(0, 0, 0, 0);
      updateData.fecha = fechaDate;
    }

    if (huevosColectados !== undefined) updateData.huevosColectados = huevosColectados;
    if (huevosRotos !== undefined) updateData.huevosRotos = huevosRotos;
    if (huevosSucios !== undefined) updateData.huevosSucios = huevosSucios;
    if (huevosPartidos !== undefined) updateData.huevosPartidos = huevosPartidos;
    if (mortalidad !== undefined) updateData.mortalidad = mortalidad;
    if (observaciones !== undefined) updateData.observaciones = observaciones || null;

    // If both loteId and fecha are being updated, check for duplicate
    if (updateData.loteId || updateData.fecha) {
      const newLoteId = (updateData.loteId as string) || existing.loteId;
      const newFecha = (updateData.fecha as Date) || existing.fecha;

      const duplicate = await prisma.produccionDiaria.findFirst({
        where: {
          loteId: newLoteId,
          fecha: newFecha,
          id: { not: id },
        },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "Ya existe un registro para este lote en esta fecha" },
          { status: 409 }
        );
      }
    }

    const produccion = await prisma.produccionDiaria.update({
      where: { id },
      data: updateData,
      include: {
        lote: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(produccion);
  } catch (error) {
    console.error("Error updating produccion:", error);
    return NextResponse.json(
      { error: "Error al actualizar registro de producción" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const existing = await prisma.produccionDiaria.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Registro de producción no encontrado" },
        { status: 404 }
      );
    }

    await prisma.produccionDiaria.delete({ where: { id } });

    return NextResponse.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting produccion:", error);
    return NextResponse.json(
      { error: "Error al eliminar registro de producción" },
      { status: 500 }
    );
  }
}
