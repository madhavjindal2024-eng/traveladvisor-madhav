/**
 * Small pill label for tags and status.
 * @param {object} props
 */
export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-white/10 text-[var(--text-secondary)]',
    accent: 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]',
    gold: 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
