"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";
import { ZODIAC_ICONS } from "@/lib/gamification";

interface TrendEntity {
  id: string;
  title: string;
  category: string;
  contentType: string;
  zodiacSign: string | null;
  rating: number;
  commentCount: number;
  createdAt: string;
}

interface TrendTag {
  name: string;
  count: number;
}

interface TrendsData {
  popularToday: TrendEntity[];
  mostDiscussed: TrendEntity[];
  trendingTags: TrendTag[];
  newTodayCount: number;
}

export default function TrendingPage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trends")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--text-muted)]">{t.common.loadingError}</p>
      </div>
    );
  }

  const zodiacIcon = (sign: string | null) => {
    if (!sign) return null;
    return ZODIAC_ICONS[sign as keyof typeof ZODIAC_ICONS] || null;
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t.common.trending}</h1>

      {/* What's New Today */}
      <div className="mb-6 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 flex items-center gap-3">
        <span className="text-2xl">{"\u{2728}"}</span>
        <div>
          <p className="font-semibold">{t.common.whatsNew}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            {data.newTodayCount} {t.trends.postsToday}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Today */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>{"\u{1F525}"}</span> {t.trends.popularToday}
          </h2>
          {data.popularToday.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">{t.home.noPostsYet}</p>
          ) : (
            <div className="space-y-3">
              {data.popularToday.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/entity/${item.id}`}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-[var(--bg-secondary)] transition-colors group"
                >
                  <span className="text-lg font-bold text-[var(--text-muted)] w-6 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors truncate">
                      {item.contentType === "horoscope" && item.zodiacSign && (
                        <span className="mr-1">{zodiacIcon(item.zodiacSign)}</span>
                      )}
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)]">
                      <span>{"\u2B06"} {item.rating}</span>
                      <span>{"\u{1F4AC}"} {item.commentCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Most Discussed This Week */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>{"\u{1F4AC}"}</span> {t.trends.mostDiscussedWeek}
          </h2>
          {data.mostDiscussed.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-4 text-center">{t.home.noPostsYet}</p>
          ) : (
            <div className="space-y-3">
              {data.mostDiscussed.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`/entity/${item.id}`}
                  className="flex items-start gap-3 rounded-lg p-2 hover:bg-[var(--bg-secondary)] transition-colors group"
                >
                  <span className="text-lg font-bold text-[var(--text-muted)] w-6 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)]">
                      <span>{"\u{1F4AC}"} {item.commentCount} {t.common.comments}</span>
                      <span>{"\u2B06"} {item.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>{"#"}</span> {t.trends.trendingTags}
        </h2>
        {data.trendingTags.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">{t.home.noPostsYet}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.trendingTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/?tag=${encodeURIComponent(tag.name)}`}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/10 transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-[var(--text-muted)]">({tag.count})</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
