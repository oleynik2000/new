"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

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
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {t.faq_page.title}
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        {t.faq_page.subtitle}
      </p>

      <div className="space-y-3">
        {t.faq_page.questions.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {t.faq_page.stillHaveQuestions}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {t.faq_page.checkGuidelines}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/guidelines"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            {t.faq_page.communityGuidelines}
          </Link>
          <Link
            href="/add"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            {t.faq_page.createPost}
          </Link>
        </div>
      </div>
    </div>
  );
}
