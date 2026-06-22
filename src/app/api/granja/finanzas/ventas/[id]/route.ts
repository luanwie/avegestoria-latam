import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = session.user.id;
  const { id } = await params;

  try {
    const venta = await prisma.venta.findFirst({ where: { id, userId } });
    if (!venta) return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });

    return NextResponse.json({
      id: venta.id, clienteNombre: venta.clienteNombre, fecha: venta.fecha.toISOString(),
      docenas: venta.docenas, precioPorDocena: Number(venta.precioPorDocena),
      total: Number(venta.docenas) * Number(venta.precioPorDocena),
      metodoPago: venta.metodoPago, descripcion: venta.descripcion,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener venta" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.venta.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });

    const body = await req.json();
    const { clienteNombre, fecha, docenas, precioPorDocena, metodoPago, descripcion } = body;
    const updateData: Record<string, unknown> = {};
    if (clienteNombre !== undefined) updateData.clienteNombre = clienteNombre || null;
    if (fecha !== undefined) updateData.fecha = new Date(fecha);
    if (docenas !== undefined) updateData.docenas = docenas;
    if (precioPorDocena !== undefined) updateData.precioPorDocena = Number(precioPorDocena);
    if (metodoPago !== undefined) updateData.metodoPago = metodoPago;
    if (descripcion !== undefined) updateData.descripcion = descripcion || null;

    const venta = await prisma.venta.update({ where: { id }, data: updateData });
    return NextResponse.json({
      id: venta.id, clienteNombre: venta.clienteNombre, fecha: venta.fecha.toISOString(),
      docenas: venta.docenas, precioPorDocena: Number(venta.precioPorDocena),
      total: Number(venta.docenas) * Number(venta.precioPorDocena),
      metodoPago: venta.metodoPago, descripcion: venta.descripcion,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar venta" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.venta.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
    await prisma.venta.delete({ where: { id } });
    return NextResponse.json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar venta" }, { status: 500 });
  }
}
