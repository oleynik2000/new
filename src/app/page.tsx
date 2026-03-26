"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Tag {
  tag: { id: string; name: string };
}

interface Entity {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  createdAt: string;
  rating: number;
  commentCount: number;
  tags: Tag[];
}

const CATEGORY_LABELS: Record<string, string> = {
  person: "👤 Людина",
  company: "🏢 Компанія",
  thing: "📦 Річ",
  other: "🔖 Інше",
};

const CATEGORY_COLORS: Record<string, string> = {
  person: "bg-blue-500/20 text-blue-400",
  company: "bg-green-500/20 text-green-400",
  thing: "bg-orange-500/20 text-orange-400",
  other: "bg-purple-500/20 text-purple-400",
};

export default function HomePage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEntities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      sort,
      category,
      page: page.toString(),
    });
    try {
      const res = await fetch(`/api/entities?${params}`);
      const data = await res.json();
      setEntities(data.entities);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [search, sort, category, page]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, category]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔥 Анонімна платформа</h1>
        <p className="text-[var(--text-secondary)]">
          Додавайте, обговорюйте та оцінюйте об&apos;єкти анонімно
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="newest">🕐 Нові</option>
          <option value="popular">⭐ Популярні</option>
          <option value="discussed">💬 Обговорювані</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="all">Усі категорії</option>
          <option value="person">👤 Людина</option>
          <option value="company">🏢 Компанія</option>
          <option value="thing">📦 Річ</option>
          <option value="other">🔖 Інше</option>
        </select>
      </div>

      {/* Entity Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      ) : entities.length === 0 ? (
        <div className="py-20 text-center text-[var(--text-muted)]">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg">Нічого не знайдено</p>
          <Link href="/add" className="mt-3 inline-block text-[var(--accent)] hover:underline">
            Додати перший об&apos;єкт →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/entity/${entity.id}`}
              className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--bg-hover)]"
            >
              {entity.imageUrl && (
                <div className="relative mb-3 h-48 w-full overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
                  <Image
                    src={entity.imageUrl}
                    alt={entity.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                  {entity.title}
                </h2>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[entity.category] || CATEGORY_COLORS.other}`}>
                  {CATEGORY_LABELS[entity.category] || entity.category}
                </span>
              </div>
              {entity.description && (
                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
                  {entity.description}
                </p>
              )}
              {entity.tags && entity.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {entity.tags.map((t) => (
                    <span key={t.tag.id} className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                      #{t.tag.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm text-[var(--text-muted)]">
                <span className={entity.rating > 0 ? "text-[var(--success)]" : entity.rating < 0 ? "text-[var(--danger)]" : ""}>
                  {entity.rating > 0 ? "+" : ""}{entity.rating} ⭐
                </span>
                <span>💬 {entity.commentCount}</span>
                <span className="ml-auto text-xs">
                  {new Date(entity.createdAt).toLocaleDateString("uk")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-30 hover:bg-[var(--bg-hover)] transition-colors"
          >
            ← Назад
          </button>
          <span className="flex items-center px-4 text-sm text-[var(--text-muted)]">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-30 hover:bg-[var(--bg-hover)] transition-colors"
          >
            Далі →
          </button>
        </div>
      )}
    </div>
  );
}
