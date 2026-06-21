import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const galpones = await prisma.galpon.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(galpones);
  } catch (error) {
    console.error("Error fetching galpones:", error);
    return NextResponse.json(
      { error: "Error al obtener galpones" },
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
    const { nombre, descripcion, capacidadMaxima, activo } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const galpon = await prisma.galpon.create({
      data: {
        userId: session.user.id,
        nombre: nombre.trim(),
        descripcion: descripcion || null,
        capacidadMaxima: capacidadMaxima ? parseInt(capacidadMaxima, 10) : null,
        activo: activo !== undefined ? activo : true,
      },
    });

    return NextResponse.json(galpon, { status: 201 });
  } catch (error) {
    console.error("Error creating galpon:", error);
    return NextResponse.json(
      { error: "Error al crear galpón" },
      { status: 500 }
    );
  }
}
