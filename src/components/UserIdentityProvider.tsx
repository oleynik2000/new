"use client";

import { useEffect } from "react";

export default function UserIdentityProvider() {
  useEffect(() => {
    // Ensure the voter_id cookie is established by calling the balance endpoint.
    // The server generates the voter_id cookie on first API call if it doesn't exist.
    // This pre-establishes identity so subsequent actions (votes, comments, posts)
    // are all attributed to the same anonymous user.
    fetch("/api/gamification/balance").catch(() => {});
  }, []);

  return null;
}
