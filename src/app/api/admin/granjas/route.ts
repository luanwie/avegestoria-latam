import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { dataShared: true },
      select: {
        id: true,
        name: true,
        email: true,
        nombreGranja: true,
        pais: true,
        plan: true,
        whatsappNumber: true,
        _count: { select: { lotes: true } },
        lotes: {
          where: { estado: "activo" },
          select: { cantidadAves: true },
        },
      },
      orderBy: { nombreGranja: "asc" },
    });

    const granjas = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      granjaName: u.nombreGranja || "Sin nombre",
      pais: u.pais,
      plan: u.plan,
      whatsappNumber: u.whatsappNumber,
      totalAves: u.lotes.reduce((sum, l) => sum + l.cantidadAves, 0),
      lotesCount: u._count.lotes,
    }));

    return NextResponse.json(granjas);
  } catch (error) {
    console.error("Admin granjas error:", error);
    return NextResponse.json({ error: "Error al obtener granjas" }, { status: 500 });
  }
}
