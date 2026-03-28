"use client";

/**
 * User identity is managed server-side via the httpOnly `voter_id` cookie.
 * The cookie is set automatically by the server on first API call
 * (e.g. /api/gamification/balance, /api/comments, /api/votes, /api/entities).
 *
 * The UserIdentityProvider component calls /api/gamification/balance on mount
 * to ensure the cookie is established on first visit.
 *
 * This module provides a minimal client-side fingerprint utility that can be
 * used for additional device-based identification if needed in the future.
 */

export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") return "";
  const nav = navigator;
  const components = [
    nav.language || "",
    String(screen?.width || 0),
    String(screen?.height || 0),
    String(screen?.colorDepth || 0),
    String(new Date().getTimezoneOffset()),
    nav.hardwareConcurrency ? String(nav.hardwareConcurrency) : "",
    nav.platform || "",
  ];
  return components.join("|");
}
