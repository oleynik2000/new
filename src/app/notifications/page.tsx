"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  entity?: { id: string; title: string } | null;
}

export default function NotificationsPage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAllRead" }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markRead", notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "reply":
        return "\u{1F4AC}";
      case "reaction":
        return "\u{1F44D}";
      default:
        return "\u{1F514}";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.notificationsPage.title}</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="rounded-lg bg-[var(--bg-secondary)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            {t.notificationsPage.markAllRead}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-12 text-center">
          <span className="text-4xl block mb-3">{"\u{1F514}"}</span>
          <p className="text-[var(--text-muted)]">{t.notificationsPage.noNotifications}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markRead(notification.id)}
              className={`rounded-xl border p-4 transition-all cursor-pointer hover:border-[var(--accent)]/30 ${
                notification.read
                  ? "border-[var(--border)] bg-[var(--bg-card)]"
                  : "border-[var(--accent)]/20 bg-[var(--accent)]/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{typeIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="text-[var(--text-muted)]">
                      {notification.type === "reply"
                        ? t.notificationsPage.replyNotification
                        : notification.type === "reaction"
                          ? t.notificationsPage.reactionNotification
                          : t.notificationsPage.newPostNotification}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] truncate">
                    {notification.message}
                  </p>
                  {notification.entity && (
                    <Link
                      href={`/entity/${notification.entity.id}`}
                      className="mt-1 inline-block text-xs text-[var(--accent)] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.entity.title}
                    </Link>
                  )}
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {new Date(notification.createdAt).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
