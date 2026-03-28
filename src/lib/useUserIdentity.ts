"use client";

import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "anon_user_id";

function generateFingerprint(): string {
  const nav = typeof navigator !== "undefined" ? navigator : null;
  if (!nav) return "";
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

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";

  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  // Generate new ID with fingerprint component
  const fingerprint = generateFingerprint();
  const fingerprintHash = simpleHash(fingerprint);
  const userId = `${uuidv4()}-${fingerprintHash}`;

  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, userId);

  return userId;
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}
