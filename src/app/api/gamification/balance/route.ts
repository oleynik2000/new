import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser, getRank } from "@/lib/gamification";
import { getOrCreateVoterHash, setVoterCookie } from "@/lib/cookies";

export async function GET(request: NextRequest) {
  const { userHash, isNew } = getOrCreateVoterHash(request);

  try {
    const user = await getOrCreateUser(userHash);
    const response = NextResponse.json({
      points: user.points,
      streak: user.streak,
      rank: getRank(user.points),
      postsCount: user.postsCount,
      commentsCount: user.commentsCount,
      votesCount: user.votesCount,
    });

    if (isNew) {
      setVoterCookie(response, userHash);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
