import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines — AnonBoard",
  description:
    "Read our community guidelines to understand the rules and expectations for participating on AnonBoard.",
};

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Community Guidelines
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        These guidelines help us maintain a safe, respectful, and productive
        community. By using AnonBoard, you agree to follow these rules.
      </p>

      <div className="space-y-4">
        {/* Allowed */}
        <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success-subtle)] p-6">
          <h2 className="text-lg font-semibold text-[var(--success)] mb-3">
            What is welcome
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">+</span>
              <span>
                Honest and constructive reviews of products, companies, and
                services
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">+</span>
              <span>
                Respectful discussions and debates on public topics
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">+</span>
              <span>
                Sharing personal experiences and factual information
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">+</span>
              <span>
                Reporting content that violates these guidelines
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--success)] mt-0.5">+</span>
              <span>
                Asking questions, seeking advice, and helping others
              </span>
            </li>
          </ul>
        </div>

        {/* Not Allowed */}
        <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger-subtle)] p-6">
          <h2 className="text-lg font-semibold text-[var(--danger)] mb-3">
            What is not allowed
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Harassment and bullying:
                </strong>{" "}
                Personal attacks, threats, or targeted harassment of individuals
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Hate speech:
                </strong>{" "}
                Content promoting discrimination based on race, religion,
                gender, sexual orientation, or ethnicity
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Illegal content:
                </strong>{" "}
                Anything that promotes or facilitates illegal activities
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Spam and self-promotion:
                </strong>{" "}
                Excessive advertising, link spam, or repetitive content
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Misinformation:
                </strong>{" "}
                Deliberately false information intended to mislead
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Explicit content:
                </strong>{" "}
                Pornographic, extremely violent, or graphic material
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--danger)] mt-0.5">-</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Doxxing:
                </strong>{" "}
                Posting private personal information of others without consent
              </span>
            </li>
          </ul>
        </div>

        {/* Moderation */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            How We Moderate
          </h2>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              We use a multi-layered approach to content moderation to keep the
              platform safe:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Automated filters:
                  </strong>{" "}
                  Profanity detection and toxic content filtering applied to all
                  posts and comments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Community reporting:
                  </strong>{" "}
                  Users can report content that violates guidelines. Content
                  with multiple reports is automatically hidden for review
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Rate limiting:
                  </strong>{" "}
                  Protections against spam and automated abuse
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Admin review:
                  </strong>{" "}
                  Reported content is reviewed by administrators who can hide or
                  remove violations
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Consequences */}
        <div className="rounded-xl border border-[var(--warning)]/20 bg-[var(--warning-subtle)] p-6">
          <h2 className="text-lg font-semibold text-[var(--warning)] mb-3">
            Enforcement
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Content that violates these guidelines may be hidden or permanently
            removed without notice. Repeated violations may result in IP-based
            restrictions. We reserve the right to take action on any content
            that we determine is harmful to the community, even if not
            explicitly covered above.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Have questions about our guidelines?
        </p>
        <Link
          href="/faq"
          className="inline-block rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
        >
          Read our FAQ
        </Link>
      </div>
    </div>
  );
}
