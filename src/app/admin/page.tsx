"use client";

import { useState, useEffect } from "react";

interface ReportItem {
  id: string;
  targetType: string;
  targetId: string;
  reason: string | null;
  createdAt: string;
  entity: { title: string } | null;
  comment: { content: string } | null;
}

interface AdminStats {
  totalEntities: number;
  totalComments: number;
  totalReports: number;
  hiddenEntities: number;
  hiddenComments: number;
  recentReports: ReportItem[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAction = async (
    action: string,
    targetType: string,
    targetId: string
  ) => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetType, targetId }),
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!stats)
    return (
      <p className="text-center text-[var(--text-muted)]">Loading error</p>
    );

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Monitor and moderate platform content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        {[
          { label: "Posts", value: stats.totalEntities, color: "text-[var(--accent)]" },
          { label: "Comments", value: stats.totalComments, color: "text-[var(--accent)]" },
          { label: "Reports", value: stats.totalReports, color: "text-[var(--warning)]" },
          { label: "Hidden Posts", value: stats.hiddenEntities, color: "text-[var(--danger)]" },
          { label: "Hidden Comments", value: stats.hiddenComments, color: "text-[var(--danger)]" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center hover:border-[var(--border-hover)] transition-colors"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-[var(--warning)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.71l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
          />
        </svg>
        Recent Reports
      </h2>
      {stats.recentReports.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
            <svg
              className="h-6 w-6 text-[var(--success)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            No reports yet
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            The community is behaving well. No reports have been submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentReports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        report.targetType === "entity"
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                          : "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                      }`}
                    >
                      {report.targetType === "entity" ? "Post" : "Comment"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(report.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] truncate">
                    {report.entity?.title ||
                      report.comment?.content ||
                      report.targetId}
                  </p>
                  {report.reason && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Reason: {report.reason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() =>
                      handleAction("hide", report.targetType, report.targetId)
                    }
                    className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--warning)] hover:bg-[var(--warning)]/20 transition-colors"
                  >
                    Hide
                  </button>
                  <button
                    onClick={() =>
                      handleAction("unhide", report.targetType, report.targetId)
                    }
                    className="rounded-lg border border-[var(--success)]/30 bg-[var(--success-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--success)] hover:bg-[var(--success)]/20 transition-colors"
                  >
                    Show
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        "delete",
                        report.targetType,
                        report.targetId
                      )
                    }
                    className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger)]/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
