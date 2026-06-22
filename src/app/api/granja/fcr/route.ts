import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateFCR, getExpectedFCR, calculateFCRDeviation, getSemanaVida, DEFAULT_FCR_CURVE } from "@/lib/fcr";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Get all active lotes with today's production + raza info
    const lotes = await prisma.lote.findMany({
      where: { userId, estado: "activo" },
      include: {
        raza: { select: { nombre: true, pesoHuevo: true, curvaFCR: true } },
        producciones: {
          where: {
            fecha: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59)),
            },
          },
          take: 1,
        },
      },
    });

    const alertas: {
      loteId: string;
      loteNombre: string;
      razaNombre: string;
      fcrActual: number | null;
      fcrEsperado: number | null;
      deviationPercent: number;
      estimatedLoss: number;
      feedConsumedKg: number;
      eggMassKg: number;
    }[] = [];

    for (const lote of lotes) {
      const produccion = lote.producciones[0];
      if (!produccion || produccion.feedProvidedKg == null) continue;

      const pesoHuevo = Number(lote.raza?.pesoHuevo || 60);
      const fcrResult = calculateFCR(
        Number(produccion.feedProvidedKg),
        produccion.feedLeftoverKg ? Number(produccion.feedLeftoverKg) : 0,
        produccion.huevosColectados,
        pesoHuevo
      );

      if (!fcrResult.isValid || fcrResult.fcr == null) continue;

      const semana = getSemanaVida(lote.fechaIngreso);
      const curva = (lote.raza?.curvaFCR as any) || DEFAULT_FCR_CURVE;
      const fcrEsperado = getExpectedFCR(curva, semana) || DEFAULT_FCR_CURVE[DEFAULT_FCR_CURVE.length - 1].fcr;

      if (fcrResult.fcr > fcrEsperado) {
        const dev = calculateFCRDeviation(fcrResult.fcr, fcrEsperado, fcrResult.feedConsumedKg);
        alertas.push({
          loteId: lote.id,
          loteNombre: lote.nombre,
          razaNombre: lote.raza?.nombre || "Sin raza",
          fcrActual: fcrResult.fcr,
          fcrEsperado,
          deviationPercent: dev.deviationPercent,
          estimatedLoss: dev.estimatedLoss,
          feedConsumedKg: fcrResult.feedConsumedKg,
          eggMassKg: fcrResult.eggMassKg,
        });
      }
    }

    return NextResponse.json({
      alertas,
      totalLoss: alertas.reduce((s, a) => s + a.estimatedLoss, 0),
      hasAlerts: alertas.length > 0,
    });
  } catch (error) {
    console.error("FCR error:", error);
    return NextResponse.json({ error: "Error al calcular FCR" }, { status: 500 });
  }
}
