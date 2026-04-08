import { Tabs } from '../ui/Tabs.jsx';
import { Card } from '../ui/Card.jsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Tabbed destination content: overview, places, hotels link, restaurants, reviews, weather.
 * @param {object} props
 */
export function DestinationTabs({
  destination,
  weatherContent,
  hotelsSlot,
  restaurantsSlot,
  reviewsSlot,
  mapSlot,
}) {
  const climate = (destination.climateMonthly || []).map((c) => ({
    name: c.month,
    high: c.avgHighC,
    low: c.avgLowC,
  }));

  return (
    <Tabs
      tabs={[
        { id: 'overview', label: 'Overview' },
        { id: 'places', label: 'Places to Visit' },
        { id: 'hotels', label: 'Hotels' },
        { id: 'restaurants', label: 'Restaurants' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'weather', label: 'Weather' },
      ]}
    >
      {(id) => {
        if (id === 'overview')
          return (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                  About
                </h3>
                <p className="mt-3 text-[var(--text-secondary)]">{destination.description}</p>
                <h4 className="mt-6 text-sm font-medium text-[var(--text-muted)]">Best time to visit</h4>
                <p className="mt-2 text-[var(--text-secondary)]">{destination.bestTimeToVisit}</p>
              </Card>
              <Card>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                  Local tips
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
                  {(destination.localTips || []).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Card>
              <Card className="lg:col-span-3">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                  Monthly climate
                </h3>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={climate}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15,22,40,0.95)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 12,
                        }}
                      />
                      <Line type="monotone" dataKey="high" stroke="var(--accent-primary)" dot={false} />
                      <Line type="monotone" dataKey="low" stroke="var(--accent-secondary)" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          );
        if (id === 'places')
          return (
            <div className="grid gap-4 md:grid-cols-2">
              {(destination.pointsOfInterest || []).map((p) => (
                <Card key={p.name}>
                  <p className="text-sm text-[var(--text-muted)]">{p.type}</p>
                  <h4 className="mt-1 font-medium text-[var(--text-primary)]">{p.name}</h4>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{p.note}</p>
                </Card>
              ))}
            </div>
          );
        if (id === 'hotels') return hotelsSlot;
        if (id === 'restaurants') return restaurantsSlot;
        if (id === 'reviews') return reviewsSlot;
        if (id === 'weather') return weatherContent;
        return mapSlot;
      }}
    </Tabs>
  );
}
