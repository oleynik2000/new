"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";

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

const RANK_COLORS: Record<string, string> = {
  novice: "text-gray-400",
  active: "text-blue-400",
  expert: "text-purple-400",
  legend: "text-yellow-400",
};

const RANK_BG: Record<string, string> = {
  novice: "bg-gray-500/10 border-gray-500/20",
  active: "bg-blue-500/10 border-blue-500/20",
  expert: "bg-purple-500/10 border-purple-500/20",
  legend: "bg-yellow-500/10 border-yellow-500/20",
};

const RANK_ICONS: Record<string, string> = {
  novice: "\u{1F331}",
  active: "\u26A1",
  expert: "\u{1F48E}",
  legend: "\u{1F451}",
};

const MEDAL_ICONS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

export default function LeaderboardPage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const rankName = (rank: string) => {
    const names: Record<string, Record<string, string>> = {
      novice: { uk: "\u041D\u043E\u0432\u0430\u0447\u043E\u043A", en: "Novice", ru: "\u041D\u043E\u0432\u0438\u0447\u043E\u043A", es: "Novato" },
      active: { uk: "\u0410\u043A\u0442\u0438\u0432\u043D\u0438\u0439", en: "Active", ru: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439", es: "Activo" },
      expert: { uk: "\u0415\u043A\u0441\u043F\u0435\u0440\u0442", en: "Expert", ru: "\u042D\u043A\u0441\u043F\u0435\u0440\u0442", es: "Experto" },
      legend: { uk: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430", en: "Legend", ru: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430", es: "Leyenda" },
    };
    return names[rank]?.[locale] || rank;
  };

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
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t.common.backToHome}
      </Link>

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
                      {RANK_ICONS[entry.level]} {rankName(entry.level)}
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
