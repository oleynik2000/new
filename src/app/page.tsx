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
  person: "Person",
  company: "Company",
  thing: "Product",
  other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  person: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  company: "bg-green-500/15 text-green-400 border border-green-500/20",
  thing: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  other: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
          Speak Freely. Stay Anonymous.
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl leading-relaxed">
          Share honest opinions about people, companies, and products without
          revealing your identity. Your voice matters &mdash; and here, it&apos;s
          protected.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/add"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md transition-all"
          >
            Start a Discussion
          </Link>
          <Link
            href="/guidelines"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            Read Guidelines
          </Link>
        </div>
        <div className="mt-6 flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"></span>
            Moderated platform
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"></span>
            100% anonymous
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--warning)]"></span>
            Community-driven
          </span>
        </div>
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
            placeholder="Search discussions..."
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
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="discussed">Most Discussed</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="person">Person</option>
          <option value="company">Company</option>
          <option value="thing">Product</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Entity Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      ) : entities.length === 0 ? (
        <div className="py-20 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
            <svg className="h-8 w-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-[var(--text-secondary)] mb-1">No posts yet</p>
          <p className="text-sm text-[var(--text-muted)] mb-4">Be the first to start a discussion on this platform.</p>
          <Link
            href="/add"
            className="inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity, index) => (
            <Link
              key={entity.id}
              href={`/entity/${entity.id}`}
              className="group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)] hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              {entity.imageUrl && (
                <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
                  <Image
                    src={entity.imageUrl}
                    alt={entity.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                  {entity.title}
                </h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${CATEGORY_COLORS[entity.category] || CATEGORY_COLORS.other}`}
                >
                  {CATEGORY_LABELS[entity.category] || entity.category}
                </span>
              </div>
              {entity.description && (
                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {entity.description}
                </p>
              )}
              {entity.tags && entity.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {entity.tags.map((t) => (
                    <span
                      key={t.tag.id}
                      className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[11px] text-[var(--accent)] font-medium"
                    >
                      #{t.tag.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
                <span
                  className={`font-medium ${entity.rating > 0 ? "text-[var(--success)]" : entity.rating < 0 ? "text-[var(--danger)]" : ""}`}
                >
                  {entity.rating > 0 ? "+" : ""}
                  {entity.rating} pts
                </span>
                <span>{entity.commentCount} comments</span>
                <span className="ml-auto">
                  {new Date(entity.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-30 hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-sm text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium disabled:opacity-30 hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
