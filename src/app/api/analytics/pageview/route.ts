import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, section, ctaClick } = body;

    if (!path) {
      return NextResponse.json({ error: "path requerido" }, { status: 400 });
    }

    await prisma.pageView.create({
      data: {
        path,
        section: section || null,
        ctaClick: ctaClick || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PageView error:", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
