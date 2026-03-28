import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validators";
import {
  containsToxicContent,
  sanitizeHtml,
  containsSpamLinks,
  isRepeatedContent,
  isHoneypotTriggered,
} from "@/lib/moderation";
import { checkRateLimit } from "@/lib/rate-limit";
import { addPoints } from "@/lib/gamification";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = createCommentSchema.parse(body);

    // Honeypot check
    if (isHoneypotTriggered(data.website)) {
      return NextResponse.json({ id: "ok" }, { status: 201 });
    }

    if (containsToxicContent(data.content)) {
      return NextResponse.json(
        { error: "Comment contains prohibited words." },
        { status: 400 }
      );
    }

    if (containsSpamLinks(data.content)) {
      return NextResponse.json(
        { error: "Comment contains spam or too many links." },
        { status: 400 }
      );
    }

    if (isRepeatedContent(data.content)) {
      return NextResponse.json(
        { error: "Comment appears to be repetitive or spam." },
        { status: 400 }
      );
    }

    const cookies = request.cookies;
    let userHash = cookies.get("voter_id")?.value;
    if (!userHash) {
      userHash = uuidv4();
    }

    const comment = await prisma.comment.create({
      data: {
        content: sanitizeHtml(data.content),
        entityId: data.entityId,
        parentId: data.parentId || null,
        authorHash: userHash,
      },
    });

    // Gamification: +1 point for comment
    await addPoints(userHash, 1, "comment");

    // Create notification for parent comment author (reply notification)
    if (data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: data.parentId },
        select: { authorHash: true, entityId: true },
      });
      if (parentComment?.authorHash && parentComment.authorHash !== userHash) {
        await prisma.notification.create({
          data: {
            userHash: parentComment.authorHash,
            type: "reply",
            message: data.content.substring(0, 100),
            entityId: data.entityId,
          },
        });
      }
    }

    const response = NextResponse.json(comment, { status: 201 });
    response.cookies.set("voter_id", userHash, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid data." },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
