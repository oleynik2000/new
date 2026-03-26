"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const FLAG_LABELS: Record<Locale, { flag: string; label: string }> = {
  uk: { flag: "🇺🇦", label: "Українська" },
  en: { flag: "🇬🇧", label: "English" },
  ru: { flag: "🇷🇺", label: "Русский" },
  es: { flag: "🇪🇸", label: "Español" },
};

const LOCALE_ORDER: Locale[] = ["uk", "en", "ru", "es"];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{FLAG_LABELS[locale].flag}</span>
        <span className="hidden sm:inline">{FLAG_LABELS[locale].label}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[160px] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg z-50 overflow-hidden animate-fade-in"
          role="listbox"
          aria-label="Languages"
        >
          {LOCALE_ORDER.map((loc) => (
            <button
              key={loc}
              role="option"
              aria-selected={locale === loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer ${
                locale === loc
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <span className="text-base leading-none">{FLAG_LABELS[loc].flag}</span>
              <span>{FLAG_LABELS[loc].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
