import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const [totalEntities, totalComments, totalReports, hiddenEntities, hiddenComments, recentReports] = await Promise.all([
    prisma.entity.count(),
    prisma.comment.count(),
    prisma.report.count(),
    prisma.entity.count({ where: { hidden: true } }),
    prisma.comment.count({ where: { hidden: true } }),
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        entity: { select: { title: true } },
        comment: { select: { content: true } },
      },
    }),
  ]);

  return NextResponse.json({
    totalEntities,
    totalComments,
    totalReports,
    hiddenEntities,
    hiddenComments,
    recentReports,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, targetType, targetId } = body;

  if (action === "hide") {
    if (targetType === "entity") {
      await prisma.entity.update({ where: { id: targetId }, data: { hidden: true } });
    } else {
      await prisma.comment.update({ where: { id: targetId }, data: { hidden: true } });
    }
  } else if (action === "unhide") {
    if (targetType === "entity") {
      await prisma.entity.update({ where: { id: targetId }, data: { hidden: false } });
    } else {
      await prisma.comment.update({ where: { id: targetId }, data: { hidden: false } });
    }
  } else if (action === "delete") {
    if (targetType === "entity") {
      await prisma.entity.delete({ where: { id: targetId } });
    } else {
      await prisma.comment.delete({ where: { id: targetId } });
    }
  }

  return NextResponse.json({ ok: true });
}
