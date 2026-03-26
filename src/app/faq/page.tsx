"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    question: "Is AnonBoard really anonymous?",
    answer:
      "Yes. We do not require registration, login, or any personal information to post or comment. We do not store usernames, email addresses, or IP addresses in connection with your posts. Your identity is never associated with your content.",
  },
  {
    question: "How does content moderation work?",
    answer:
      "We use automated content filters to detect profanity and toxic language before it is published. Additionally, any user can report content they find inappropriate. Posts and comments that receive multiple reports are automatically hidden and flagged for admin review. Our admin team reviews flagged content and can hide or permanently remove violations.",
  },
  {
    question: "Can I post about real people or companies?",
    answer:
      "Yes, you can discuss public figures, companies, and organizations. However, all posts must be factual and respectful. Personal attacks, defamation, doxxing (sharing private personal information), and harassment are strictly prohibited. Stick to honest opinions and verifiable facts.",
  },
  {
    question: "What types of content are not allowed?",
    answer:
      "We prohibit harassment, hate speech, illegal content, spam, misinformation, explicit material, and doxxing. Please read our Community Guidelines for a complete list. Content that violates these rules will be removed.",
  },
  {
    question: "How do I report inappropriate content?",
    answer:
      'Every post and comment has a "Report" button. Click it to flag the content for review. Reports are processed by our moderation system — content with multiple reports is automatically hidden pending admin review.',
  },
  {
    question: "Is there a limit on how much I can post?",
    answer:
      "We implement rate limiting to prevent spam and abuse. Under normal usage, you should not encounter any limits. If you see a rate limit message, please wait a minute before trying again.",
  },
  {
    question: "Can I edit or delete my posts?",
    answer:
      "Since the platform is fully anonymous, we do not offer edit or delete functionality for regular users. If you need content removed, you can report your own post and an admin will review it.",
  },
  {
    question: "How does the voting system work?",
    answer:
      "Each post can be upvoted or downvoted. The total score is displayed on the post. You can change your vote at any time — clicking the same vote button again will remove your vote. Voting helps the community surface the most relevant and useful content.",
  },
  {
    question: "Are there ads on AnonBoard?",
    answer:
      "Currently, AnonBoard is ad-free. In the future, we may introduce non-intrusive advertising to support platform operations. Any ads will be clearly marked and will never compromise user privacy or experience.",
  },
  {
    question: "How can I contact the team?",
    answer:
      "For general inquiries, suggestions, or concerns about content, please use the report feature. For urgent matters or business inquiries, we can be reached through the admin panel.",
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--border-hover)] transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-medium text-[var(--text-primary)] pr-4">
          {question}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-fade-in">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        Find answers to common questions about how AnonBoard works.
      </p>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Still have questions?
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Check out our community guidelines or start a discussion.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/guidelines"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            Community Guidelines
          </Link>
          <Link
            href="/add"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Create a Post
          </Link>
        </div>
      </div>
    </div>
  );
}
