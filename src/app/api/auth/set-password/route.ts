import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Profile-only update (no password change)
    if (body.onlyProfile) {
      const { name, nombreGranja, ciudad, pais, moneda } = body;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          nombreGranja: nombreGranja || user.nombreGranja,
          ciudad: ciudad || user.ciudad,
          pais: pais || user.pais,
          moneda: moneda || user.moneda,
        },
      });

      return NextResponse.json({ success: true, profile: true });
    }

    // Password update
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Mínimo 6 caracteres" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
