import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const razas = await prisma.raza.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(razas);
  } catch (error) {
    console.error("Error fetching razas:", error);
    return NextResponse.json(
      { error: "Error al obtener razas" },
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
    const { nombre, productividadEsperada, pesoPromedio } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const raza = await prisma.raza.create({
      data: {
        userId: session.user.id,
        nombre: nombre.trim(),
        productividadEsperada: productividadEsperada
          ? parseFloat(productividadEsperada)
          : null,
        pesoPromedio: pesoPromedio ? parseFloat(pesoPromedio) : null,
      },
    });

    return NextResponse.json(raza, { status: 201 });
  } catch (error) {
    console.error("Error creating raza:", error);
    return NextResponse.json(
      { error: "Error al crear raza" },
      { status: 500 }
    );
  }
}
