/**
 * Toggle chips for map layers.
 * @param {{ layers: Record<string, boolean>; onToggle: (k: string) => void }} props
 */
export function LayerToggle({ layers, onToggle }) {
  const labels = {
    attractions: 'Attractions',
    restaurants: 'Restaurants',
    hotels: 'Hotels',
    hidden: 'Hidden Gems',
    saved: 'Saved Places',
  };
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(labels).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onToggle(key)}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            layers[key]
              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 text-[var(--text-primary)]'
              : 'border-[var(--glass-border)] text-[var(--text-muted)] hover:bg-white/5'
          }`}
        >
          {labels[key]}
        </button>
      ))}
    </div>
  );
}
