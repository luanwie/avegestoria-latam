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

    const galpon = await prisma.galpon.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!galpon) {
      return NextResponse.json(
        { error: "Galpón no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(galpon);
  } catch (error) {
    console.error("Error fetching galpon:", error);
    return NextResponse.json(
      { error: "Error al obtener galpón" },
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
    const { nombre, descripcion, capacidadMaxima, activo } = body;

    const existing = await prisma.galpon.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Galpón no encontrado" },
        { status: 404 }
      );
    }

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const galpon = await prisma.galpon.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion !== undefined ? descripcion : undefined,
        capacidadMaxima:
          capacidadMaxima !== undefined
            ? parseInt(capacidadMaxima, 10)
            : undefined,
        activo: activo !== undefined ? activo : undefined,
      },
    });

    return NextResponse.json(galpon);
  } catch (error) {
    console.error("Error updating galpon:", error);
    return NextResponse.json(
      { error: "Error al actualizar galpón" },
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

    const existing = await prisma.galpon.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Galpón no encontrado" },
        { status: 404 }
      );
    }

    await prisma.galpon.delete({ where: { id } });

    return NextResponse.json({ message: "Galpón eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting galpon:", error);
    return NextResponse.json(
      { error: "Error al eliminar galpón" },
      { status: 500 }
    );
  }
}
