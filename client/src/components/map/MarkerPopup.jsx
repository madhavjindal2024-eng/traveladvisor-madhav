/**
 * Simple popup content for map markers.
 * @param {{ title: string; description?: string }} props
 */
export function MarkerPopup({ title, description }) {
  return (
    <div className="glass-card max-w-xs p-3 text-sm">
      <p className="font-medium text-[var(--text-primary)]">{title}</p>
      {description && <p className="mt-1 text-[var(--text-muted)]">{description}</p>}
    </div>
  );
}
