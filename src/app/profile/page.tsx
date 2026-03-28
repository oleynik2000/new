"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";
import { RANK_COLORS as RANK_COLORS_MAP, RANK_BG, RANK_ICONS, getRankName } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BackLink from "@/components/ui/BackLink";

interface BadgeInfo {
  key: string;
  icon: string;
  nameUk: string;
  nameEn: string;
  nameRu: string;
  nameEs: string;
  earnedAt: string;
}

interface UserProfile {
  points: number;
  streak: number;
  rank: string;
  postsCount: number;
  commentsCount: number;
  votesCount: number;
  badges: BadgeInfo[];
}

const PROFILE_RANK_COLORS: Record<string, string> = {
  novice: "text-gray-400 border-gray-500/30 bg-gray-500/10",
  active: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  expert: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  legend: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
};

export default function ProfilePage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getBadgeName = (badge: BadgeInfo) => {
    const key = `name${locale.charAt(0).toUpperCase()}${locale.slice(1)}` as keyof BadgeInfo;
    return (badge[key] as string) || badge.nameEn;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <p className="text-lg text-[var(--text-secondary)]">{t.common.loadingError}</p>
      </div>
    );
  }

  const nextRankInfo: Record<string, { next: string; needed: number }> = {
    novice: { next: "active", needed: 50 - user.points },
    active: { next: "expert", needed: 200 - user.points },
    expert: { next: "legend", needed: 500 - user.points },
    legend: { next: "", needed: 0 },
  };

  const progressInfo = nextRankInfo[user.rank] || { next: "", needed: 0 };
  const progressPercent =
    user.rank === "legend"
      ? 100
      : user.rank === "expert"
        ? ((user.points - 200) / 300) * 100
        : user.rank === "active"
          ? ((user.points - 50) / 150) * 100
          : (user.points / 50) * 100;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <BackLink label={t.common.backToHome} />

      {/* Profile Header */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--border)] flex items-center justify-center text-2xl">
            {RANK_ICONS[user.rank] || "\u{1F464}"}

          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold border ${PROFILE_RANK_COLORS[user.rank]}`}>
                {getRankName(user.rank, locale)}
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">{user.points} {t.common.pts}</p>
          </div>
        </div>

        {/* Streak */}
        {user.streak > 0 && (
          <div className="mb-4 rounded-lg bg-[var(--warning-subtle)] border border-[var(--warning)]/20 p-3 flex items-center gap-2">
            <span className="text-xl">{"\u{1F525}"}</span>
            <span className="text-sm font-medium text-[var(--warning)]">
              {t.profile?.streakDays?.replace("{n}", String(user.streak)) || `${user.streak} day streak!`}
            </span>
          </div>
        )}

        {/* Progress to next rank */}
        {user.rank !== "legend" && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>{getRankName(user.rank, locale)}</span>
              <span>{getRankName(progressInfo.next, locale)} ({progressInfo.needed} {t.common.pts})</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-center">
            <p className="text-xl font-bold">{user.postsCount}</p>
            <p className="text-xs text-[var(--text-muted)]">{t.profile?.posts || "Posts"}</p>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-center">
            <p className="text-xl font-bold">{user.commentsCount}</p>
            <p className="text-xs text-[var(--text-muted)]">{t.common.comments}</p>
          </div>
          <div className="rounded-lg bg-[var(--bg-secondary)] p-3 text-center">
            <p className="text-xl font-bold">{user.votesCount}</p>
            <p className="text-xs text-[var(--text-muted)]">{t.profile?.votes || "Votes"}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">{t.profile?.badges || "Badges"}</h2>
        {user.badges.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-6">
            {t.profile?.noBadges || "No badges yet. Keep being active!"}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {user.badges.map((badge) => (
              <div
                key={badge.key}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 text-center hover:border-[var(--accent)]/50 transition-colors"
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-sm font-medium">{getBadgeName(badge)}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {new Date(badge.earnedAt).toLocaleDateString(locale)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
