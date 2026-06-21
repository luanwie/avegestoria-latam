import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const lote = await prisma.lote.findFirst({
      where: { id, userId: session.user.id },
      include: {
        galpon: { select: { id: true, nombre: true } },
        raza: { select: { id: true, nombre: true } },
      },
    });

    if (!lote) {
      return NextResponse.json(
        { error: "Lote no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(lote);
  } catch (error) {
    console.error("Error fetching lote:", error);
    return NextResponse.json(
      { error: "Error al obtener lote" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      nombre,
      galponId,
      razaId,
      cantidadAves,
      fechaIngreso,
      fechaFinalizado,
      estado,
      costoAve,
    } = body;

    const existing = await prisma.lote.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lote no encontrado" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    if (nombre !== undefined) data.nombre = nombre.trim();
    if (galponId !== undefined) data.galponId = galponId || null;
    if (razaId !== undefined) data.razaId = razaId || null;
    if (cantidadAves !== undefined) data.cantidadAves = parseInt(cantidadAves, 10);
    if (fechaIngreso !== undefined) data.fechaIngreso = new Date(fechaIngreso);
    if (fechaFinalizado !== undefined)
      data.fechaFinalizado = fechaFinalizado ? new Date(fechaFinalizado) : null;
    if (estado !== undefined) data.estado = estado;
    if (costoAve !== undefined) data.costoAve = costoAve ? parseFloat(costoAve) : null;

    const lote = await prisma.lote.update({
      where: { id },
      data,
      include: {
        galpon: { select: { id: true, nombre: true } },
        raza: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(lote);
  } catch (error) {
    console.error("Error updating lote:", error);
    return NextResponse.json(
      { error: "Error al actualizar lote" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.lote.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Lote no encontrado" },
        { status: 404 }
      );
    }

    await prisma.lote.delete({ where: { id } });

    return NextResponse.json({ message: "Lote eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting lote:", error);
    return NextResponse.json(
      { error: "Error al eliminar lote" },
      { status: 500 }
    );
  }
}
