"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {t.about.title}
      </h1>

      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            {t.about.missionTitle}
          </h2>
          <p>{t.about.missionText1}</p>
          <p className="mt-3">{t.about.missionText2}</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            {t.about.whyAnonymousTitle}
          </h2>
          <p>{t.about.whyAnonymousText}</p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  {t.about.honestReviews}
                </strong>{" "}
                {t.about.honestReviewsDesc}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  {t.about.openDiscussions}
                </strong>{" "}
                {t.about.openDiscussionsDesc}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  {t.about.whistleblowing}
                </strong>{" "}
                {t.about.whistleblowingDesc}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  {t.about.privacyFirst}
                </strong>{" "}
                {t.about.privacyFirstDesc}
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            {t.about.howItWorksTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="text-lg font-bold text-[var(--accent)] mb-2">1</div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {t.about.step1Title}
              </h3>
              <p className="text-xs">{t.about.step1Desc}</p>
            </div>
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="text-lg font-bold text-[var(--accent)] mb-2">2</div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {t.about.step2Title}
              </h3>
              <p className="text-xs">{t.about.step2Desc}</p>
            </div>
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="text-lg font-bold text-[var(--accent)] mb-2">3</div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {t.about.step3Title}
              </h3>
              <p className="text-xs">{t.about.step3Desc}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            {t.about.commitmentTitle}
          </h2>
          <p>{t.about.commitmentText}</p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"></span>
            <span className="text-[var(--text-muted)]">
              {t.about.activelyModerated247}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          {t.about.browseDiscussions}
        </Link>
      </div>
    </div>
  );
}
