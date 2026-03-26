"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

const CATEGORY_LABELS: Record<string, string> = {
  person: "👤 Людина",
  company: "🏢 Компанія",
  thing: "📦 Річ",
  other: "🔖 Інше",
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
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          entityId,
          parentId: comment.id,
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
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-[var(--border)] pl-4" : ""}`}>
      <div className="rounded-lg bg-[var(--bg-card)] p-3 mb-2">
        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{comment.content}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span>{new Date(comment.createdAt).toLocaleString("uk")}</span>
          <span className="text-[var(--text-muted)]">Анонім</span>
          {depth < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-[var(--accent)] hover:underline"
            >
              Відповісти
            </button>
          )}
          {reportSent ? (
            <span className="text-[var(--warning)]">Скаргу надіслано</span>
          ) : (
            <button onClick={handleReport} className="text-[var(--text-muted)] hover:text-[var(--danger)]">
              🚩
            </button>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Ваша відповідь..."
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
              maxLength={2000}
            />
            <button
              onClick={handleReply}
              disabled={submitting}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              {submitting ? "..." : "→"}
            </button>
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
  const [entity, setEntity] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [error, setError] = useState("");

  const fetchEntity = useCallback(async () => {
    try {
      const res = await fetch(`/api/entities/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEntity(data);
      } else {
        setError("Об'єкт не знайдено");
      }
    } catch {
      setError("Помилка завантаження");
    }
    setLoading(false);
  }, [id]);

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
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          entityId: id,
        }),
      });
      if (res.ok) {
        setCommentText("");
        fetchEntity();
      } else {
        const data = await res.json();
        setError(data.error || "Помилка");
      }
    } catch {
      setError("Помилка з'єднання");
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
      <div className="py-20 text-center">
        <p className="text-lg text-[var(--text-muted)]">{error || "Не знайдено"}</p>
        <Link href="/" className="mt-3 inline-block text-[var(--accent)] hover:underline">
          ← На головну
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="mb-4 inline-block text-sm text-[var(--text-muted)] hover:text-[var(--accent)]">
        ← На головну
      </Link>

      {/* Entity Header */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        {entity.imageUrl && (
          <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
            <Image
              src={entity.imageUrl}
              alt={entity.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-[var(--text-muted)]">
              {CATEGORY_LABELS[entity.category] || entity.category}
            </span>
            <h1 className="text-2xl font-bold mt-1">{entity.title}</h1>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleVote(1)}
              className="rounded-lg border border-[var(--border)] px-3 py-1 text-lg hover:bg-[var(--success)]/20 hover:border-[var(--success)] transition-colors"
            >
              👍
            </button>
            <span className={`text-lg font-bold ${entity.rating > 0 ? "text-[var(--success)]" : entity.rating < 0 ? "text-[var(--danger)]" : "text-[var(--text-muted)]"}`}>
              {entity.rating > 0 ? "+" : ""}{entity.rating}
            </span>
            <button
              onClick={() => handleVote(-1)}
              className="rounded-lg border border-[var(--border)] px-3 py-1 text-lg hover:bg-[var(--danger)]/20 hover:border-[var(--danger)] transition-colors"
            >
              👎
            </button>
          </div>
        </div>

        {entity.description && (
          <p className="mt-4 text-[var(--text-secondary)] whitespace-pre-wrap">{entity.description}</p>
        )}

        {entity.tags && entity.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entity.tags.map((t) => (
              <span key={t.tag.id} className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs text-[var(--accent)]">
                #{t.tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <span>{new Date(entity.createdAt).toLocaleString("uk")}</span>
          {reportSent ? (
            <span className="text-[var(--warning)]">Скаргу надіслано</span>
          ) : (
            <button onClick={handleReportEntity} className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
              🚩 Поскаржитися
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          💬 Коментарі ({entity.comments.length})
        </h2>

        {/* Add Comment */}
        <div className="mb-6 flex gap-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Напишіть коментар анонімно..."
            rows={2}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none resize-none"
            maxLength={2000}
          />
          <button
            onClick={handleComment}
            disabled={submitting || !commentText.trim()}
            className="self-end rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {submitting ? "..." : "Надіслати"}
          </button>
        </div>

        {/* Comments List */}
        {entity.comments.length === 0 ? (
          <p className="py-8 text-center text-[var(--text-muted)]">
            Поки що немає коментарів. Будьте першим!
          </p>
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
