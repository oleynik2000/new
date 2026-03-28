interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-subtle)] p-3 text-sm text-[var(--danger)]">
      {message}
    </div>
  );
}
