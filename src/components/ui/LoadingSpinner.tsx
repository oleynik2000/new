export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  return (
    <div className="flex justify-center py-20">
      <div
        className={`${sizeClass} animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent`}
      />
    </div>
  );
}
