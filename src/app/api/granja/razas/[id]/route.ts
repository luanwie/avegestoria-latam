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

    const raza = await prisma.raza.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!raza) {
      return NextResponse.json(
        { error: "Raza no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(raza);
  } catch (error) {
    console.error("Error fetching raza:", error);
    return NextResponse.json(
      { error: "Error al obtener raza" },
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
    const { nombre, productividadEsperada, pesoPromedio } = body;

    const existing = await prisma.raza.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Raza no encontrada" },
        { status: 404 }
      );
    }

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const raza = await prisma.raza.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        productividadEsperada:
          productividadEsperada !== undefined
            ? parseFloat(productividadEsperada)
            : undefined,
        pesoPromedio:
          pesoPromedio !== undefined
            ? parseFloat(pesoPromedio)
            : undefined,
      },
    });

    return NextResponse.json(raza);
  } catch (error) {
    console.error("Error updating raza:", error);
    return NextResponse.json(
      { error: "Error al actualizar raza" },
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

    const existing = await prisma.raza.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Raza no encontrada" },
        { status: 404 }
      );
    }

    await prisma.raza.delete({ where: { id } });

    return NextResponse.json({ message: "Raza eliminada correctamente" });
  } catch (error) {
    console.error("Error deleting raza:", error);
    return NextResponse.json(
      { error: "Error al eliminar raza" },
      { status: 500 }
    );
  }
}
