import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRank } from "@/lib/gamification";

export async function GET(request: NextRequest) {
  const cookies = request.cookies;
  const userHash = cookies.get("voter_id")?.value;

  if (!userHash) {
    return NextResponse.json({
      points: 0,
      streak: 0,
      rank: "novice",
      postsCount: 0,
      commentsCount: 0,
      votesCount: 0,
      badges: [],
    });
  }

  const user = await prisma.userActivity.findUnique({
    where: { userHash },
    include: { badges: { include: { badge: true } } },
  });

  if (!user) {
    return NextResponse.json({
      points: 0,
      streak: 0,
      rank: "novice",
      postsCount: 0,
      commentsCount: 0,
      votesCount: 0,
      badges: [],
    });
  }

  return NextResponse.json({
    points: user.points,
    streak: user.streak,
    rank: getRank(user.points),
    postsCount: user.postsCount,
    commentsCount: user.commentsCount,
    votesCount: user.votesCount,
    badges: user.badges.map((ub) => ({
      key: ub.badge.key,
      icon: ub.badge.icon,
      nameUk: ub.badge.nameUk,
      nameEn: ub.badge.nameEn,
      nameRu: ub.badge.nameRu,
      nameEs: ub.badge.nameEs,
      earnedAt: ub.earnedAt,
    })),
  });
}
