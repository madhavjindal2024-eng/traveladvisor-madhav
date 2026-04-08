/**
 * Single day block in itinerary timeline.
 * @param {object} props
 */
export function DayCard({ day, index }) {
  return (
    <div
      className="glass-card timeline-step border-l-4 border-[var(--accent-primary)] p-5"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
        Day {day.dayNumber}
      </p>
      <div className="mt-3 space-y-4">
        {(day.slots || []).map((slot) => (
          <div key={`${day.dayNumber}-${slot.period}`} className="border-t border-[var(--glass-border)] pt-3 first:border-t-0 first:pt-0">
            <p className="text-xs text-[var(--accent-gold)]">{slot.period}</p>
            <p className="mt-1 font-medium text-[var(--text-primary)]">{slot.activity}</p>
            <p className="text-sm text-[var(--text-muted)]">{slot.location}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{slot.description}</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {slot.durationMinutes} min · est. ${slot.estimatedCost}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
