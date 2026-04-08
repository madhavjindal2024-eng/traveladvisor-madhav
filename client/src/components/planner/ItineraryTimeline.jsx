import { DayCard } from './DayCard.jsx';

/**
 * Vertical timeline of itinerary days.
 * @param {{ days: unknown[] }} props
 */
export function ItineraryTimeline({ days }) {
  return (
    <div className="space-y-4">
      {(days || []).map((d, i) => (
        <DayCard key={d.dayNumber || i} day={d} index={i} />
      ))}
    </div>
  );
}
