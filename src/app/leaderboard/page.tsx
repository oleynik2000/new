"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";
import { RANK_COLORS, RANK_BG, RANK_ICONS, getRankName } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import BackLink from "@/components/ui/BackLink";

interface LeaderboardEntry {
  rank: number;
  userHash: string;
  points: number;
  level: string;
  streak: number;
  postsCount: number;
  commentsCount: number;
  votesCount: number;
  badgeCount: number;
}

const MEDAL_ICONS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

export default function LeaderboardPage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gamification/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const leaderboardTitle: Record<string, string> = {
    uk: "\u041B\u0456\u0434\u0435\u0440\u0431\u043E\u0440\u0434",
    en: "Leaderboard",
    ru: "\u041B\u0438\u0434\u0435\u0440\u0431\u043E\u0440\u0434",
    es: "Tabla de l\u00EDderes",
  };

  const leaderboardDesc: Record<string, string> = {
    uk: "\u0422\u043E\u043F \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456\u0432 \u0437\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044E \u0431\u0430\u043B\u0456\u0432",
    en: "Top users by points",
    ru: "\u0422\u043E\u043F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u043F\u043E \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0443 \u0431\u0430\u043B\u043B\u043E\u0432",
    es: "Mejores usuarios por puntos",
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <BackLink label={t.common.backToHome} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{leaderboardTitle[locale] || leaderboardTitle.en}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{leaderboardDesc[locale] || leaderboardDesc.en}</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
          <p className="text-[var(--text-muted)]">
            {locale === "uk" ? "\u041F\u043E\u043A\u0438 \u043D\u0435\u043C\u0430\u0454 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432" : "No participants yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`rounded-xl border bg-[var(--bg-card)] p-4 transition-colors hover:bg-[var(--bg-hover)] ${
                entry.rank <= 3 ? "border-[var(--accent)]/30" : "border-[var(--border)]"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank number */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-lg font-bold">
                  {entry.rank <= 3 ? MEDAL_ICONS[entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[var(--text-secondary)]">
                      {entry.userHash}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${RANK_COLORS[entry.level]} ${RANK_BG[entry.level]}`}>
                      {RANK_ICONS[entry.level]} {getRankName(entry.level, locale)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{entry.postsCount} {t.profile?.posts || "posts"}</span>
                    <span>{entry.commentsCount} {t.common.comments}</span>
                    <span>{entry.votesCount} {t.profile?.votes || "votes"}</span>
                    {entry.badgeCount > 0 && <span>{entry.badgeCount} {t.profile?.badges || "badges"}</span>}
                  </div>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-[var(--accent)]">{entry.points}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{t.common.pts}</p>
                </div>

                {/* Streak */}
                {entry.streak > 1 && (
                  <div className="shrink-0 text-center">
                    <span className="text-lg">{"\u{1F525}"}</span>
                    <p className="text-[10px] text-orange-400">{entry.streak}d</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
