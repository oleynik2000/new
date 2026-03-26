import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validators";
import { containsToxicContent, sanitizeHtml } from "@/lib/moderation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Забагато запитів." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = createCommentSchema.parse(body);

    if (containsToxicContent(data.content)) {
      return NextResponse.json({ error: "Коментар містить заборонені слова." }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: sanitizeHtml(data.content),
        entityId: data.entityId,
        parentId: data.parentId || null,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Невірні дані." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Помилка сервера." }, { status: 500 });
  }
}
