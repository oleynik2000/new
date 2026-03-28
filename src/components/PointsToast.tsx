"use client";

import { useState, useEffect, useCallback } from "react";

interface ToastMessage {
  id: number;
  points: number;
  action: string;
  streakBonus?: number;
}

let toastId = 0;
const listeners: Array<(msg: ToastMessage) => void> = [];

export function showPointsToast(points: number, action: string, streakBonus?: number) {
  if (points <= 0) return;
  const msg: ToastMessage = { id: ++toastId, points, action, streakBonus };
  listeners.forEach((fn) => fn(msg));
}

const ACTION_LABELS: Record<string, Record<string, string>> = {
  comment: { uk: "Коментар", en: "Comment", ru: "Комментарий", es: "Comentario" },
  post: { uk: "Пост", en: "Post", ru: "Пост", es: "Publicacion" },
  vote: { uk: "Голос", en: "Vote", ru: "Голос", es: "Voto" },
};

export default function PointsToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("anonboard-locale");
      if (stored) setLocale(stored);
    }
  }, []);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev.slice(-4), msg]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== msg.id));
    }, 3000);
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-up rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-card)] px-4 py-3 shadow-lg shadow-[var(--accent)]/10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/15 text-lg">
              {"\u2B50"}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">
                +{toast.points} {locale === "uk" ? "балів" : locale === "ru" ? "баллов" : locale === "es" ? "puntos" : "pts"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {ACTION_LABELS[toast.action]?.[locale] || toast.action}
                {toast.streakBonus && toast.streakBonus > 0 ? ` (+${toast.streakBonus} streak)` : ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
