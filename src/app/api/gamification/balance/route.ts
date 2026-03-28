import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser, getRank } from "@/lib/gamification";

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
    });
  }

  try {
    const user = await getOrCreateUser(userHash);
    return NextResponse.json({
      points: user.points,
      streak: user.streak,
      rank: getRank(user.points),
      postsCount: user.postsCount,
      commentsCount: user.commentsCount,
      votesCount: user.votesCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
