import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AnonBoard — Анонімна платформа",
  description: "Анонімна платформа для обговорення об'єктів",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen">
        <nav className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
              🔍 AnonBoard
            </Link>
            <div className="flex gap-3">
              <Link
                href="/add"
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
              >
                + Додати
              </Link>
              <Link
                href="/admin"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                Адмін
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
