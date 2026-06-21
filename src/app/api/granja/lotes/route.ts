import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const lotes = await prisma.lote.findMany({
      where: { userId: session.user.id },
      include: {
        galpon: { select: { id: true, nombre: true } },
        raza: { select: { id: true, nombre: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lotes);
  } catch (error) {
    console.error("Error fetching lotes:", error);
    return NextResponse.json(
      { error: "Error al obtener lotes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

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

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (!cantidadAves || parseInt(cantidadAves, 10) < 1) {
      return NextResponse.json(
        { error: "La cantidad de aves debe ser mayor a 0" },
        { status: 400 }
      );
    }

    if (!fechaIngreso) {
      return NextResponse.json(
        { error: "La fecha de ingreso es obligatoria" },
        { status: 400 }
      );
    }

    const lote = await prisma.lote.create({
      data: {
        userId: session.user.id,
        nombre: nombre.trim(),
        galponId: galponId || null,
        razaId: razaId || null,
        cantidadAves: parseInt(cantidadAves, 10),
        fechaIngreso: new Date(fechaIngreso),
        fechaFinalizado: fechaFinalizado ? new Date(fechaFinalizado) : null,
        estado: estado || "activo",
        costoAve: costoAve ? parseFloat(costoAve) : null,
      },
      include: {
        galpon: { select: { id: true, nombre: true } },
        raza: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(lote, { status: 201 });
  } catch (error) {
    console.error("Error creating lote:", error);
    return NextResponse.json(
      { error: "Error al crear lote" },
      { status: 500 }
    );
  }
}
