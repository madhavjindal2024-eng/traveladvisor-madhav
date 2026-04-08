/**
 * Loading placeholder block.
 * @param {object} props
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 ${className}`}
    />
  );
}
