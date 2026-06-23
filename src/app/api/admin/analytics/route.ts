import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total visitors (distinct by day basically, simplified: total pageviews)
    const [totalVisitors, totalPageViews, ctaClicks] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.pageView.count({ where: { createdAt: { gte: last30Days }, ctaClick: null } }),
      prisma.pageView.count({ where: { createdAt: { gte: last30Days }, ctaClick: { not: null } } }),
    ]);

    // Top pages (last 7 days)
    const topPagesRaw = await prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: last7Days }, ctaClick: null },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });
    const topPages = topPagesRaw.map((p) => ({ path: p.path, count: p._count.path }));

    // Top CTAs (last 30 days)
    const topCTAsRaw = await prisma.pageView.groupBy({
      by: ["ctaClick"],
      where: { createdAt: { gte: last30Days }, ctaClick: { not: null } },
      _count: { ctaClick: true },
      orderBy: { _count: { ctaClick: "desc" } },
      take: 10,
    });
    const topCTAs = topCTAsRaw.map((c) => ({ cta: c.ctaClick, count: c._count.ctaClick }));

    // Daily views (last 30 days)
    const dailyViewsRaw = await prisma.$queryRawUnsafe<Array<{ date: string; count: bigint }>>(
      `SELECT DATE("created_at") as date, COUNT(*)::int as count
       FROM "page_views"
       WHERE "created_at" >= $1
       GROUP BY DATE("created_at")
       ORDER BY date`,
      last30Days.toISOString()
    );
    const dailyViews = dailyViewsRaw.map((d) => ({ date: d.date, count: Number(d.count) }));

    return NextResponse.json({
      totalVisitors,
      totalPageViews,
      ctaClicks,
      topPages,
      topCTAs,
      dailyViews,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Error al obtener analytics" }, { status: 500 });
  }
}
