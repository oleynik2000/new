import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — AnonBoard",
  description:
    "Learn about AnonBoard, an anonymous discussion platform built for honest, open conversations.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        About AnonBoard
      </h1>

      <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            Our Mission
          </h2>
          <p>
            AnonBoard is a platform designed for open, honest discussions. We
            believe that anonymity empowers people to share genuine opinions
            about companies, products, public figures, and more &mdash; without
            fear of judgment or retaliation.
          </p>
          <p className="mt-3">
            Whether you want to share a review, discuss a trending topic, or
            raise awareness about an issue, AnonBoard provides a safe and
            moderated space for your voice.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            Why Anonymous?
          </h2>
          <p>
            Anonymity is not about hiding &mdash; it&apos;s about freedom of
            expression. Many people hesitate to share honest feedback because
            they worry about social consequences. AnonBoard removes that
            barrier.
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Honest reviews:
                </strong>{" "}
                Share your real experience with products and services
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Open discussions:
                </strong>{" "}
                Debate ideas without personal attacks
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Whistleblowing:
                </strong>{" "}
                Report issues that matter to the community
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Privacy first:
                </strong>{" "}
                We never collect or store personal identity data
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="text-lg font-bold text-[var(--accent)] mb-2">
                1
              </div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Create a Post
              </h3>
              <p className="text-xs">
                Share a topic about a person, company, product, or anything
                else. No account required.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="text-lg font-bold text-[var(--accent)] mb-2">
                2
              </div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Discuss & Vote
              </h3>
              <p className="text-xs">
                Comment on posts, reply to others, and vote to highlight the
                most relevant content.
              </p>
            </div>
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="text-lg font-bold text-[var(--accent)] mb-2">
                3
              </div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Stay Safe
              </h3>
              <p className="text-xs">
                Report inappropriate content. Our moderation system keeps the
                platform clean and respectful.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
            Our Commitment
          </h2>
          <p>
            We are committed to maintaining a platform that is safe, fair, and
            useful. All content is subject to our{" "}
            <Link
              href="/guidelines"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
            >
              Community Guidelines
            </Link>
            . We use a combination of automated content filters, rate limiting,
            and community reporting to prevent abuse.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]"></span>
            <span className="text-[var(--text-muted)]">
              Platform actively moderated 24/7
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          Browse Discussions
        </Link>
      </div>
    </div>
  );
}
