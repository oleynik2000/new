"use client";

import Link from "next/link";
import { I18nProvider, useTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function HeaderNav() {
  const t = useTranslations();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors tracking-tight"
          >
            {t.common.brandName}
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/about"
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {t.common.about}
            </Link>
            <Link
              href="/guidelines"
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {t.common.guidelines}
            </Link>
            <Link
              href="/faq"
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {t.common.faq}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/add"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md transition-all"
          >
            {t.common.newPost}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              {t.common.brandName}
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              {t.footer.platform}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {t.footer.communityGuidelines}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {t.footer.faq}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              {t.footer.trustSafety}
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {t.footer.trustDescription}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"></span>
              <span className="text-xs text-[var(--text-muted)]">
                {t.footer.activelyModerated}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {t.common.brandName}. {t.footer.allRightsReserved}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {t.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <HeaderNav />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        {children}
      </main>
      <Footer />
    </I18nProvider>
  );
}
