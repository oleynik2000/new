"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const RANK_COLORS: Record<string, string> = {
  novice: "text-gray-400",
  active: "text-blue-400",
  expert: "text-purple-400",
  legend: "text-yellow-400",
};

const RANK_ICONS: Record<string, string> = {
  novice: "\u{1F331}",
  active: "\u26A1",
  expert: "\u{1F48E}",
  legend: "\u{1F451}",
};

interface UserBalance {
  points: number;
  streak: number;
  rank: string;
}

export default function PointsBadge() {
  const [user, setUser] = useState<UserBalance | null>(null);

  useEffect(() => {
    fetch("/api/gamification/balance")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.points === "number") {
          setUser(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <Link
      href="/profile"
      className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-hover)]"
    >
      <span>{RANK_ICONS[user.rank] || "\u{1F331}"}</span>
      <span className={`font-semibold ${RANK_COLORS[user.rank] || ""}`}>
        {user.points}
      </span>
      {user.streak > 1 && (
        <span className="text-xs text-orange-400" title={`${user.streak} day streak`}>
          {"\u{1F525}"}{user.streak}
        </span>
      )}
    </Link>
  );
}
