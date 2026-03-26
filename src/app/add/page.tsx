"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEntityPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.url);
      } else {
        setError(data.error || "Помилка завантаження");
      }
    } catch {
      setError("Помилка завантаження файлу");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Назва обов'язкова");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          imageUrl: imageUrl || undefined,
          category,
          tags: tagList.length > 0 ? tagList : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/entity/${data.id}`);
      } else {
        setError(data.error || "Помилка створення");
      }
    } catch {
      setError("Помилка з'єднання з сервером");
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">➕ Додати об&apos;єкт</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Назва <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть назву об'єкта"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
            maxLength={200}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Опис
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Додайте опис (необов'язково)"
            rows={4}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none resize-none"
            maxLength={5000}
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Категорія
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="person">👤 Людина</option>
            <option value="company">🏢 Компанія</option>
            <option value="thing">📦 Річ</option>
            <option value="other">🔖 Інше</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Фото
          </label>
          <div className="space-y-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL зображення (https://...)"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
            />
            <div className="text-center text-sm text-[var(--text-muted)]">або</div>
            <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--accent)]/50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-sm text-[var(--text-muted)]">
                {uploading ? "Завантаження..." : "📷 Натисніть, щоб завантажити фото"}
              </span>
            </label>
          </div>
          {imageUrl && (
            <p className="mt-2 text-xs text-[var(--success)]">
              Фото додано: {imageUrl.substring(0, 50)}...
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Теги (через кому)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="скандал, політика, бізнес"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {submitting ? "Створення..." : "Опублікувати анонімно"}
        </button>
      </form>
    </div>
  );
}
