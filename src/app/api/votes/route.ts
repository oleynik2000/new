import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { voteSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { addPoints } from "@/lib/gamification";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = voteSchema.parse(body);

    const cookies = request.cookies;
    let voterHash = cookies.get("voter_id")?.value;
    if (!voterHash) {
      voterHash = uuidv4();
    }

    const existing = await prisma.vote.findUnique({
      where: { entityId_voterHash: { entityId: data.entityId, voterHash } },
    });

    if (existing) {
      if (existing.value === data.value) {
        await prisma.vote.delete({ where: { id: existing.id } });
      } else {
        await prisma.vote.update({
          where: { id: existing.id },
          data: { value: data.value },
        });
      }
    } else {
      await prisma.vote.create({
        data: {
          entityId: data.entityId,
          value: data.value,
          voterHash,
        },
      });
      // Gamification: +1 point for voting (only new votes)
      await addPoints(voterHash, 1, "vote");
    }

    const votes = await prisma.vote.findMany({
      where: { entityId: data.entityId },
      select: { value: true },
    });
    const rating = votes.reduce((sum, v) => sum + v.value, 0);

    const response = NextResponse.json({ rating, voterHash });
    response.cookies.set("voter_id", voterHash, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
