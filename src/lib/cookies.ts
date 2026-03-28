import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const VOTER_COOKIE = "voter_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Extract or generate a voter_id hash from request cookies.
 */
export function getOrCreateVoterHash(request: NextRequest): {
  userHash: string;
  isNew: boolean;
} {
  const existing = request.cookies.get(VOTER_COOKIE)?.value;
  if (existing) {
    return { userHash: existing, isNew: false };
  }
  return { userHash: uuidv4(), isNew: true };
}

/**
 * Set the voter_id cookie on a response.
 */
export function setVoterCookie(response: NextResponse, userHash: string): void {
  response.cookies.set(VOTER_COOKIE, userHash, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
