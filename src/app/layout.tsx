import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AnonBoard — Anonymous Discussion Platform",
  description:
    "A safe, anonymous platform for open discussions about people, companies, products, and more. Share your honest opinion without revealing your identity.",
  keywords: "anonymous, discussion, forum, reviews, opinions, community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xl font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors tracking-tight"
              >
                AnonBoard
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  href="/about"
                  className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/guidelines"
                  className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Guidelines
                </Link>
                <Link
                  href="/faq"
                  className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  FAQ
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/add"
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md transition-all"
              >
                + New Post
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                  AnonBoard
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  A safe space for anonymous, honest discussions. Share your
                  thoughts freely while respecting others.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                  Platform
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about"
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/guidelines"
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      Community Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                  Trust & Safety
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  All content is moderated. We use automated filters and
                  community reporting to keep discussions safe and respectful.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"></span>
                  <span className="text-xs text-[var(--text-muted)]">
                    Platform actively moderated
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[var(--text-muted)]">
                &copy; {new Date().getFullYear()} AnonBoard. All rights
                reserved.
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Built with transparency, privacy, and respect in mind.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
