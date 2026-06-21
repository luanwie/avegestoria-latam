import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    // ── Rate limit: 50 requests per day ──
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const dailyCount = await prisma.chatLog.count({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
    });

    if (dailyCount >= 50) {
      return NextResponse.json({
        reply: "⚠️ Has alcanzado el límite de 50 preguntas por día. Vuelve mañana o actualiza tu plan.",
      });
    }

    // ── Log this request ──
    await prisma.chatLog.create({
      data: { userId },
    });

    // ── Fetch granja context ──
    const [lotes, galpones, razas, producciones, ventas, gastos] = await Promise.all([
      prisma.lote.findMany({ where: { userId }, select: { id: true, nombre: true, cantidadAves: true, estado: true } }),
      prisma.galpon.findMany({ where: { userId }, select: { id: true, nombre: true, capacidadMaxima: true } }),
      prisma.raza.findMany({ where: { userId }, select: { id: true, nombre: true, productividadEsperada: true } }),
      prisma.produccionDiaria.findMany({
        where: { userId, fecha: { gte: new Date(Date.now() - 30 * 86400000) } },
        orderBy: { fecha: "desc" },
        take: 30,
        select: { fecha: true, loteId: true, huevosColectados: true, mortalidad: true },
      }),
      prisma.venta.findMany({
        where: { userId, fecha: { gte: new Date(Date.now() - 30 * 86400000) } },
        orderBy: { fecha: "desc" },
        take: 10,
        select: { fecha: true, docenas: true, precioPorDocena: true, metodoPago: true },
      }),
      prisma.gasto.findMany({
        where: { userId, fecha: { gte: new Date(Date.now() - 30 * 86400000) } },
        orderBy: { fecha: "desc" },
        take: 10,
        select: { fecha: true, categoria: true, monto: true },
      }),
    ]);

    // ── Build context ──
    const totalAves = lotes.reduce((s, l) => s + l.cantidadAves, 0);
    const totalProduccion = producciones.reduce((s, p) => s + p.huevosColectados, 0);
    const totalVentas = ventas.reduce((s, v) => s + Number(v.docenas) * Number(v.precioPorDocena), 0);
    const totalGastos = gastos.reduce((s, g) => s + Number(g.monto), 0);

    const systemContext = `Eres un asistente experto en avicultura y gestión de granjas de ponedoras. 
Responde preguntas sobre la granja del usuario usando los datos disponibles. 
Sé conciso (máximo 3 párrafos). Usa español neutro. Si no tienes datos suficientes, dilo honestamente.

DATOS DE LA GRANJA:
- Galpones: ${galpones.length} (${galpones.map((g) => g.nombre).join(", ")})
- Razas: ${razas.length} (${razas.map((r) => r.nombre).join(", ")})
- Lotes activos: ${lotes.filter((l) => l.estado === "activo").length} lote(s), ${totalAves} aves totales
|- Producción (últimos 30 días): ${totalProduccion} huevos, media diaria: ${producciones.length > 0 ? Math.round(totalProduccion / new Set(producciones.map((p) => p.fecha.toISOString().split("T")[0])).size || 1) : 0}
- Ventas (últimos 30 días): ${ventas.length} ventas, total $${totalVentas.toFixed(2)}
- Gastos (últimos 30 días): ${gastos.length} gastos, total $${totalGastos.toFixed(2)}
- Lucro estimado: $${(totalVentas - totalGastos).toFixed(2)}`;

    // ── Call DeepSeek ──
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      return NextResponse.json({
        reply: "⚠️ La IA no está configurada. El administrador debe agregar DEEPSEEK_API_KEY al archivo .env",
        error: "DEEPSEEK_API_KEY not configured",
      });
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${deepseekKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemContext },
            ...history.slice(-10),
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("DeepSeek error:", err);
      return NextResponse.json({ reply: "Error al consultar la IA. Intenta de nuevo." }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No pude generar una respuesta.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ reply: "Error interno al procesar tu consulta." }, { status: 500 });
  }
}
