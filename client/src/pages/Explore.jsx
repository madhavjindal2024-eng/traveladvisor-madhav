import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { DestinationCard } from '../components/destination/DestinationCard.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { MapView } from '../components/map/MapView.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { SORT_OPTIONS, DEST_TYPES, TAG_OPTIONS } from '../utils/constants.js';
import { api } from '../services/api.js';

/**
 * Search results with filters and optional map view.
 */
export function Explore() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [type, setType] = useState(params.get('type') || '');
  const [sort, setSort] = useState(params.get('sort') || 'popularity');
  const [minRating, setMinRating] = useState(params.get('minRating') || '');
  const [maxCost, setMaxCost] = useState(params.get('maxCost') || '');
  const [tag, setTag] = useState(params.get('tag') || '');
  const debouncedQ = useDebounce(q, 400);

  useEffect(() => {
    setLoading(true);
    api
      .get('/destinations', {
        params: {
          q: debouncedQ || undefined,
          type: type || undefined,
          sort,
          minRating: minRating || undefined,
          maxCost: maxCost || undefined,
          tag: tag || undefined,
          limit: 24,
        },
      })
      .then((res) => setItems(res.data.items || []))
      .finally(() => setLoading(false));
  }, [debouncedQ, type, sort, minRating, maxCost, tag]);

  const first = items[0];

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="glass-card h-fit w-full shrink-0 space-y-4 p-5 lg:w-72">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Filters</p>
            <label className="block text-xs text-[var(--text-muted)]">Destination type</label>
            <select
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Any</option>
              {DEST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="block text-xs text-[var(--text-muted)]">Tag</label>
            <select
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">Any</option>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="block text-xs text-[var(--text-muted)]">Min rating</label>
            <input
              type="range"
              min="3"
              max="5"
              step="0.1"
              value={minRating || 3}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full"
            />
            <label className="block text-xs text-[var(--text-muted)]">Max cost / day (USD)</label>
            <input
              type="number"
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value)}
              placeholder="e.g. 200"
            />
            <label className="block text-xs text-[var(--text-muted)]">Sort</label>
            <select
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </aside>
          <div className="min-w-0 flex-1">
            <input
              className="glass-card mb-4 w-full max-w-xl rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
              placeholder="Search destinations"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Explore</h1>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`rounded-lg px-3 py-2 text-sm ${view === 'grid' ? 'bg-white/10' : 'text-[var(--text-muted)]'}`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView('map')}
                  className={`rounded-lg px-3 py-2 text-sm ${view === 'map' ? 'bg-white/10' : 'text-[var(--text-muted)]'}`}
                >
                  Map
                </button>
              </div>
            </div>
            {view === 'grid' ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)
                  : items.map((d) => <DestinationCard key={d._id} destination={d} />)}
              </div>
            ) : (
              <div className="mt-8">
                {first ? (
                  <MapView
                    latitude={first.lat}
                    longitude={first.lng}
                    zoom={2}
                    markers={items.map((d) => ({
                      id: d._id,
                      lat: d.lat,
                      lng: d.lng,
                      title: d.name,
                    }))}
                    height="560px"
                  />
                ) : (
                  <p className="text-[var(--text-muted)]">No markers to show yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
