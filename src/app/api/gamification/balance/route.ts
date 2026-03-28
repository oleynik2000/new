import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getOrCreateUser, getRank } from "@/lib/gamification";

export async function GET(request: NextRequest) {
  const cookies = request.cookies;
  let userHash = cookies.get("voter_id")?.value;

  if (!userHash) {
    userHash = randomUUID();
  }

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

    if (!cookies.get("voter_id")?.value) {
      response.cookies.set("voter_id", userHash, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
