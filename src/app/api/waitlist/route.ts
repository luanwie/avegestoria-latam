import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, granjaName } = body;

    if (!email || !phone || !granjaName) {
      return NextResponse.json(
        { error: "Email, teléfono y nombre de granja son requeridos" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await prisma.waitlist.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este email ya está en la lista de espera" },
        { status: 409 }
      );
    }

    await prisma.waitlist.create({
      data: { email, phone, granjaName },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
