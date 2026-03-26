import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createReportSchema } from "@/lib/validators";
import { REPORT_THRESHOLD } from "@/lib/moderation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Забагато запитів." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = createReportSchema.parse(body);

    const report = await prisma.report.create({
      data: {
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason || null,
        entityId: data.targetType === "entity" ? data.targetId : null,
        commentId: data.targetType === "comment" ? data.targetId : null,
      },
    });

    const reportCount = await prisma.report.count({
      where: { targetType: data.targetType, targetId: data.targetId },
    });

    if (reportCount >= REPORT_THRESHOLD) {
      if (data.targetType === "entity") {
        await prisma.entity.update({
          where: { id: data.targetId },
          data: { hidden: true },
        });
      } else {
        await prisma.comment.update({
          where: { id: data.targetId },
          data: { hidden: true },
        });
      }
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка сервера." }, { status: 500 });
  }
}
