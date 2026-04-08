import { useState } from 'react';

/**
 * Simple accessible tabs.
 * @param {{ tabs: { id: string; label: string }[]; children: (id: string) => import('react').ReactNode }} props
 */
export function Tabs({ tabs, children }) {
  const [active, setActive] = useState(tabs[0]?.id);
  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[var(--glass-border)] pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              active === t.id
                ? 'bg-[var(--accent-primary)]/20 text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{children(active)}</div>
    </div>
  );
}
