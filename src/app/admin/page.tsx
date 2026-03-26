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

  const handleAction = async (action: string, targetType: string, targetId: string) => {
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

  if (!stats) return <p className="text-center text-[var(--text-muted)]">Помилка завантаження</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">🛡️ Адмін-панель</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        {[
          { label: "Об'єкти", value: stats.totalEntities, icon: "📦" },
          { label: "Коментарі", value: stats.totalComments, icon: "💬" },
          { label: "Скарги", value: stats.totalReports, icon: "🚩" },
          { label: "Приховані об'єкти", value: stats.hiddenEntities, icon: "🙈" },
          { label: "Приховані коментарі", value: stats.hiddenComments, icon: "🙊" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center"
          >
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <h2 className="text-lg font-semibold mb-4">📋 Останні скарги</h2>
      {stats.recentReports.length === 0 ? (
        <p className="text-center py-8 text-[var(--text-muted)]">Скарг поки немає</p>
      ) : (
        <div className="space-y-3">
          {stats.recentReports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${report.targetType === "entity" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"}`}>
                      {report.targetType === "entity" ? "Об'єкт" : "Коментар"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(report.createdAt).toLocaleString("uk")}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] truncate">
                    {report.entity?.title || report.comment?.content || report.targetId}
                  </p>
                  {report.reason && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">Причина: {report.reason}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAction("hide", report.targetType, report.targetId)}
                    className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-3 py-1.5 text-xs text-[var(--warning)] hover:bg-[var(--warning)]/20 transition-colors"
                  >
                    Приховати
                  </button>
                  <button
                    onClick={() => handleAction("unhide", report.targetType, report.targetId)}
                    className="rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-1.5 text-xs text-[var(--success)] hover:bg-[var(--success)]/20 transition-colors"
                  >
                    Показати
                  </button>
                  <button
                    onClick={() => handleAction("delete", report.targetType, report.targetId)}
                    className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-1.5 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/20 transition-colors"
                  >
                    Видалити
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
