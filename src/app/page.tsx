"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "@/lib/i18n";
import { CATEGORY_COLORS, HOROSCOPE_GRADIENT, getCategoryLabels, getZodiacIcon } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

interface Tag {
  tag: { id: string; name: string };
}

interface Entity {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  contentType: string;
  zodiacSign: string | null;
  createdAt: string;
  rating: number;
  commentCount: number;
  tags: Tag[];
}

export default function HomePage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const CATEGORY_LABELS = getCategoryLabels(t);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchEntities = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    const params = new URLSearchParams({
      search: debouncedSearch,
      sort,
      category,
      page: pageNum.toString(),
    });
    if (contentType !== "all") {
      params.set("contentType", contentType);
    }
    try {
      const res = await fetch(`/api/entities?${params}`);
      const data = await res.json();
      if (append) {
        setEntities((prev) => [...prev, ...data.entities]);
      } else {
        setEntities(data.entities);
      }
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setLoadingMore(false);
  }, [debouncedSearch, sort, category, contentType]);

  useEffect(() => {
    setPage(1);
    fetchEntities(1, false);
  }, [debouncedSearch, sort, category, contentType, fetchEntities]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchEntities(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [page, totalPages, loadingMore, fetchEntities]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
          {t.home.heroTitle}
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
          {t.home.heroDescription}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/add"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            {t.home.startDiscussion}
          </Link>
          <Link
            href="/guidelines"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            {t.home.readGuidelines}
          </Link>
        </div>
        <div className="mt-6 flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"></span>
            {t.home.moderatedPlatform}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"></span>
            {t.home.fullyAnonymous}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--warning)]"></span>
            {t.home.communityDriven}
          </span>
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="mb-4 flex gap-2">
        {[
          { value: "all", label: t.horoscope.filterAll },
          { value: "review", label: t.horoscope.filterReviews },
          { value: "horoscope", label: t.horoscope.filterHoroscopes },
        ].map((ct) => (
          <button
            key={ct.value}
            onClick={() => setContentType(ct.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all active:scale-95 ${
              contentType === ct.value
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)]"
            }`}
          >
            {ct.value === "horoscope" && "\u2728 "}
            {ct.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={t.home.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] pl-10 pr-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
        >
          <option value="newest">{t.home.newest}</option>
          <option value="popular">{t.home.mostPopular}</option>
          <option value="discussed">{t.home.mostDiscussed}</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
        >
          <option value="all">{t.home.allCategories}</option>
          <option value="person">{t.home.person}</option>
          <option value="company">{t.home.company}</option>
          <option value="thing">{t.home.product}</option>
          <option value="other">{t.home.other}</option>
        </select>
      </div>

      {/* Entity Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : entities.length === 0 ? (
        <EmptyState
          icon={
            <svg className="h-8 w-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          title={t.home.noPostsYet}
          description={t.home.noPostsDescription}
          actionLabel={t.home.createFirstPost}
          actionHref="/add"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity, index) => (
            <Link
              key={entity.id}
              href={`/entity/${entity.id}`}
              className={`group rounded-xl border p-4 transition-all duration-200 hover:shadow-lg animate-slide-up ${
                entity.contentType === "horoscope"
                  ? `${HOROSCOPE_GRADIENT} hover:border-indigo-400/40`
                  : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]"
              }`}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              {/* Horoscope zodiac badge */}
              {entity.contentType === "horoscope" && entity.zodiacSign && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">{getZodiacIcon(entity.zodiacSign)}</span>
                  <span className="text-sm font-medium text-indigo-400">
                    {t.horoscope.zodiacSigns[entity.zodiacSign as keyof typeof t.horoscope.zodiacSigns] || entity.zodiacSign}
                  </span>
                </div>
              )}
              {entity.imageUrl && (
                <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
                  <Image
                    src={entity.imageUrl}
                    alt={entity.title}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                  {entity.contentType === "horoscope" && !entity.zodiacSign && (
                    <span className="mr-1">{"\u2728"}</span>
                  )}
                  {entity.title}
                </h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    entity.contentType === "horoscope"
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                      : CATEGORY_COLORS[entity.category] || CATEGORY_COLORS.other
                  }`}
                >
                  {entity.contentType === "horoscope"
                    ? t.horoscope.filterHoroscopes
                    : CATEGORY_LABELS[entity.category] || entity.category}
                </span>
              </div>
              {entity.description && (
                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {entity.description}
                </p>
              )}
              {entity.tags && entity.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {entity.tags.map((tg) => (
                    <span
                      key={tg.tag.id}
                      className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[11px] text-[var(--accent)] font-medium"
                    >
                      #{tg.tag.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <span
                  className={`font-medium ${entity.rating > 0 ? "text-[var(--success)]" : entity.rating < 0 ? "text-[var(--danger)]" : ""}`}
                >
                  {entity.rating > 0 ? "+" : ""}
                  {entity.rating} {t.common.pts}
                </span>
                <span>{entity.commentCount} {t.common.comments}</span>
                <span className="ml-auto">
                  {new Date(entity.createdAt).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {entities.length > 0 && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loadingMore && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          )}
          {page >= totalPages && (
            <p className="text-sm text-[var(--text-muted)]">{t.common.noMore}</p>
          )}
        </div>
      )}
    </div>
  );
}
