"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function GuidelinesPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {t.guidelines_page.title}
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        {t.guidelines_page.subtitle}
      </p>

      <div className="space-y-4">
        {/* Allowed */}
        <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success-subtle)] p-6">
          <h2 className="text-lg font-semibold text-[var(--success)] mb-3">
            {t.guidelines_page.welcomeTitle}
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {t.guidelines_page.welcomeItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-0.5">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Allowed */}
        <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger-subtle)] p-6">
          <h2 className="text-lg font-semibold text-[var(--danger)] mb-3">
            {t.guidelines_page.notAllowedTitle}
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {t.guidelines_page.notAllowedItems.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[var(--danger)] mt-0.5">-</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    {item.title}
                  </strong>{" "}
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Moderation */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            {t.guidelines_page.moderationTitle}
          </h2>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>{t.guidelines_page.moderationIntro}</p>
            <ul className="space-y-2">
              {t.guidelines_page.moderationItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
                  <span>
                    <strong className="text-[var(--text-primary)]">
                      {item.title}
                    </strong>{" "}
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Consequences */}
        <div className="rounded-xl border border-[var(--warning)]/20 bg-[var(--warning-subtle)] p-6">
          <h2 className="text-lg font-semibold text-[var(--warning)] mb-3">
            {t.guidelines_page.enforcementTitle}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {t.guidelines_page.enforcementText}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {t.guidelines_page.questionsAboutGuidelines}
        </p>
        <Link
          href="/faq"
          className="inline-block rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
        >
          {t.guidelines_page.readFaq}
        </Link>
      </div>
    </div>
  );
}
