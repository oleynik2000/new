import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="py-20 text-center animate-fade-in">
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
          {icon}
        </div>
      )}
      <p className="text-lg font-medium text-[var(--text-secondary)] mb-1">
        {title}
      </p>
      {description && (
        <p className="text-sm text-[var(--text-muted)] mb-4">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
