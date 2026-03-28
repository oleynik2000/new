"use client";

import { useEffect } from "react";
import { getOrCreateUserId } from "@/lib/useUserIdentity";

export default function UserIdentityProvider() {
  useEffect(() => {
    // Generate and store anonymous user ID on first visit
    getOrCreateUserId();
  }, []);

  return null;
}
