"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "@/lib/i18n";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  replies: Comment[];
}

interface Tag {
  tag: { id: string; name: string };
}

interface EntityDetail {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  createdAt: string;
  rating: number;
  comments: Comment[];
  tags: Tag[];
  votes: { value: number; voterHash: string }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  person: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  company: "bg-green-500/15 text-green-400 border border-green-500/20",
  thing: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  other: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
};

function CommentComponent({
  comment,
  entityId,
  depth,
  onReplyAdded,
}: {
  comment: Comment;
  entityId: string;
  depth: number;
  onReplyAdded: () => void;
}) {
  const t = useTranslations();
  const { locale } = useLocale();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyHoneypot, setReplyHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim() || replyHoneypot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          entityId,
          parentId: comment.id,
          website: replyHoneypot,
        }),
      });
      if (res.ok) {
        setReplyContent("");
        setShowReplyForm(false);
        onReplyAdded();
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleReport = async () => {
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "comment",
          targetId: comment.id,
        }),
      });
      setReportSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`${depth > 0 ? "ml-4 sm:ml-6 border-l-2 border-[var(--border)] pl-4" : ""}`}
    >
      <div className="rounded-lg bg-[var(--bg-card)] border border-[var(--border)] p-4 mb-2 hover:border-[var(--border-hover)] transition-colors">
        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(comment.createdAt).toLocaleString(locale, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-[var(--text-muted)]">{t.common.anonymous}</span>
          {depth < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium"
            >
              {t.entity.reply}
            </button>
          )}
          {reportSent ? (
            <span className="text-[var(--warning)]">{t.common.reported}</span>
          ) : (
            <button
              onClick={handleReport}
              className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
              title={t.common.report}
            >
              {t.common.report}
            </button>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-3">
            {/* Honeypot */}
            <div className="hp-field" aria-hidden="true">
              <input
                type="text"
                name="phone"
                value={replyHoneypot}
                onChange={(e) => setReplyHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t.entity.replyPlaceholder}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                maxLength={2000}
              />
              <button
                onClick={handleReply}
                disabled={submitting || !replyContent.trim()}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
              >
                {submitting ? "..." : t.common.send}
              </button>
            </div>
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentComponent
          key={reply.id}
          comment={reply}
          entityId={entityId}
          depth={depth + 1}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  );
}

export default function EntityPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations();
  const { locale } = useLocale();
  const [entity, setEntity] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentHoneypot, setCommentHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [error, setError] = useState("");

  const CATEGORY_LABELS: Record<string, string> = {
    person: t.home.person,
    company: t.home.company,
    thing: t.home.product,
    other: t.home.other,
  };

  const fetchEntity = useCallback(async () => {
    try {
      const res = await fetch(`/api/entities/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEntity(data);
      } else {
        setError(t.entity.postNotFound);
      }
    } catch {
      setError(t.common.loadingError);
    }
    setLoading(false);
  }, [id, t.entity.postNotFound, t.common.loadingError]);

  useEffect(() => {
    fetchEntity();
  }, [fetchEntity]);

  const handleVote = async (value: 1 | -1) => {
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: id, value }),
      });
      if (res.ok) {
        const data = await res.json();
        setEntity((prev) => (prev ? { ...prev, rating: data.rating } : prev));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || commentHoneypot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          entityId: id,
          website: commentHoneypot,
        }),
      });
      if (res.ok) {
        setCommentText("");
        fetchEntity();
      } else {
        const data = await res.json();
        setError(data.error || "Error");
      }
    } catch {
      setError(t.entity.connectionError);
    }
    setSubmitting(false);
  };

  const handleReportEntity = async () => {
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "entity",
          targetId: id,
        }),
      });
      setReportSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
          <svg className="h-8 w-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text-secondary)]">
          {error || t.common.notFound}
        </p>
        <Link
          href="/"
          className="mt-3 inline-block text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
        >
          {t.common.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t.common.backToHome}
      </Link>

      {/* Entity Header */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        {entity.imageUrl && (
          <div className="relative mb-5 h-64 sm:h-80 w-full overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
            <Image
              src={entity.imageUrl}
              alt={entity.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${CATEGORY_COLORS[entity.category] || CATEGORY_COLORS.other}`}
            >
              {CATEGORY_LABELS[entity.category] || entity.category}
            </span>
            <h1 className="text-2xl font-bold mt-2 tracking-tight">
              {entity.title}
            </h1>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => handleVote(1)}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--success-subtle)] hover:border-[var(--success)] transition-colors"
              title="Upvote"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <span
              className={`text-lg font-bold ${entity.rating > 0 ? "text-[var(--success)]" : entity.rating < 0 ? "text-[var(--danger)]" : "text-[var(--text-muted)]"}`}
            >
              {entity.rating > 0 ? "+" : ""}
              {entity.rating}
            </span>
            <button
              onClick={() => handleVote(-1)}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--danger-subtle)] hover:border-[var(--danger)] transition-colors"
              title="Downvote"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>

        {entity.description && (
          <p className="mt-4 text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
            {entity.description}
          </p>
        )}

        {entity.tags && entity.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entity.tags.map((tg) => (
              <span
                key={tg.tag.id}
                className="rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs text-[var(--accent)] font-medium"
              >
                #{tg.tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(entity.createdAt).toLocaleString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {reportSent ? (
            <span className="text-[var(--warning)] text-xs">{t.common.reportSubmitted}</span>
          ) : (
            <button
              onClick={handleReportEntity}
              className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors text-xs"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.71l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
              {t.common.report}
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          {t.entity.commentsTitle} ({entity.comments.length})
        </h2>

        {/* Add Comment */}
        <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
          {/* Honeypot */}
          <div className="hp-field" aria-hidden="true">
            <input
              type="text"
              name="email_confirm"
              value={commentHoneypot}
              onChange={(e) => setCommentHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t.entity.commentPlaceholder}
            rows={3}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none resize-none transition-colors"
            maxLength={2000}
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              {t.entity.commentRules}
            </p>
            <button
              onClick={handleComment}
              disabled={submitting || !commentText.trim()}
              className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-all"
            >
              {submitting ? t.entity.sending : t.entity.postComment}
            </button>
          </div>
        </div>

        {/* Comments List */}
        {entity.comments.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
              <svg className="h-6 w-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {t.entity.noCommentsYet}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {t.entity.noCommentsDescription}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entity.comments.map((comment) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                entityId={entity.id}
                depth={0}
                onReplyAdded={fetchEntity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
