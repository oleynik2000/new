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
  const [honeypot, setHoneypot] = useState("");

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
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("File upload error");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    if (!title.trim()) {
      setError("Title is required");
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
          website: honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/entity/${data.id}`);
      } else {
        setError(data.error || "Creation failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Post</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Share something for the community to discuss anonymously.
        </p>
      </div>

      {/* Guidelines Banner */}
      <div className="mb-6 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-subtle)] p-4">
        <h3 className="text-sm font-medium text-[var(--accent)] mb-2">
          Before you post
        </h3>
        <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
          <li>- Be respectful and constructive in your discussions</li>
          <li>- No illegal content, harassment, or personal attacks</li>
          <li>- Provide accurate information when possible</li>
          <li>- All posts are moderated and must follow our community guidelines</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-subtle)] p-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot - invisible to users, catches bots */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Title <span className="text-[var(--danger)]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear, descriptive title"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            maxLength={200}
            required
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {title.length}/200 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context and details (optional)"
            rows={4}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none resize-none transition-colors"
            maxLength={5000}
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {description.length}/5000 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none cursor-pointer transition-colors"
          >
            <option value="person">Person</option>
            <option value="company">Company</option>
            <option value="thing">Product</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Image (optional)
          </label>
          <div className="space-y-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (https://...)"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
            <div className="text-center text-xs text-[var(--text-muted)]">or</div>
            <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--bg-hover)]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-[var(--text-muted)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <span className="text-sm text-[var(--text-muted)]">
                  {uploading ? "Uploading..." : "Click to upload an image"}
                </span>
                <span className="block text-xs text-[var(--text-muted)] mt-1">
                  JPEG, PNG, WebP, GIF up to 5MB
                </span>
              </div>
            </label>
          </div>
          {imageUrl && (
            <p className="mt-2 text-xs text-[var(--success)]">
              Image added: {imageUrl.substring(0, 50)}...
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="technology, business, review"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Add relevant tags to help others find your post
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 shadow-sm hover:shadow-md transition-all"
          >
            {submitting ? "Publishing..." : "Publish Anonymously"}
          </button>
          <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
            Your identity is never stored or shared. All posts are anonymous.
          </p>
        </div>
      </form>
    </div>
  );
}
