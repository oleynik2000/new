import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/gamification";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard(20);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
