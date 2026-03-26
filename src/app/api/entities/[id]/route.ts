import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const entity = await prisma.entity.findUnique({
    where: { id },
    include: {
      comments: {
        where: { hidden: false },
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            where: { hidden: false },
            orderBy: { createdAt: "asc" },
            include: {
              replies: {
                where: { hidden: false },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
      votes: { select: { value: true, voterHash: true } },
      tags: { include: { tag: true } },
      _count: { select: { reports: true } },
    },
  });

  if (!entity || entity.hidden) {
    return NextResponse.json({ error: "Не знайдено" }, { status: 404 });
  }

  const topLevelComments = entity.comments.filter((c) => !c.parentId);
  const rating = entity.votes.reduce((sum, v) => sum + v.value, 0);

  return NextResponse.json({
    ...entity,
    comments: topLevelComments,
    rating,
    _count: undefined,
  });
}
