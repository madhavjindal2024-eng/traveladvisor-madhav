import { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { MapView } from '../components/map/MapView.jsx';
import { LayerToggle } from '../components/map/LayerToggle.jsx';
import { Card } from '../components/ui/Card.jsx';
import { useMap } from '../hooks/useMap.js';
import { useWishlist } from '../hooks/useWishlist.js';
import { api } from '../services/api.js';

/**
 * Full-screen style map explorer with layer toggles.
 */
export function MapExplorer() {
  const { layers, toggleLayer, selected, setSelected } = useMap();
  const { items: wishItems } = useWishlist();
  const [destinations, setDestinations] = useState([]);
  const [q, setQ] = useState('');
  const [center, setCenter] = useState({ lat: 20, lng: 0, zoom: 2 });

  useEffect(() => {
    api.get('/destinations', { params: { limit: 50 } }).then((res) => setDestinations(res.data.items || []));
  }, []);

  const filtered = destinations.filter((d) =>
    q ? `${d.name} ${d.country}`.toLowerCase().includes(q.toLowerCase()) : true
  );

  const markers = filtered.flatMap((d) => {
    const base = { id: d._id, lat: d.lat, lng: d.lng, title: d.name, kind: 'city' };
    const pois = (d.pointsOfInterest || [])
      .filter((p) => {
        if (p.type === 'attraction' && !layers.attractions) return false;
        if (p.type === 'restaurant' && !layers.restaurants) return false;
        if (p.type === 'hotel' && !layers.hotels) return false;
        if (p.type === 'hidden' && !layers.hidden) return false;
        return true;
      })
      .map((p, i) => ({
        id: `${d._id}-${p.name}-${i}`,
        lat: p.lat,
        lng: p.lng,
        title: p.name,
        kind: p.type,
      }));
    return [base, ...pois];
  });

  const geocode = async () => {
    const query = q.trim();
    if (!query) return;
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      const data = await r.json();
      if (Array.isArray(data) && data.length) {
        setCenter({ lat: Number(data[0].lat), lng: Number(data[0].lon), zoom: 7 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const first = filtered[0] || center;

  return (
    <PageWrapper>
      <Navbar />
      <main className="relative pb-24 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Map Explorer</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Clustered markers and layer filters (saved places when logged in).</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              className="glass-card flex-1 min-w-[200px] rounded-xl border border-[var(--glass-border)] px-4 py-2 text-[var(--text-primary)]"
              placeholder="Filter cities or geocode any place"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              type="button"
              onClick={geocode}
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-2 text-sm text-[var(--text-primary)]"
            >
              Search map
            </button>
            <LayerToggle layers={layers} onToggle={toggleLayer} />
          </div>
        </div>
        <div className="relative mx-auto mt-6 max-w-7xl px-4 sm:px-6">
          <MapView
            latitude={Number(first.lat)}
            longitude={Number(first.lng)}
            zoom={first.zoom || 2}
            markers={markers}
            height="calc(100vh - 220px)"
            onMarkerClick={(m) => setSelected(m)}
          />
          {selected && (
            <div className="absolute bottom-6 left-6 right-6 z-10 md:left-auto md:right-6 md:w-96">
              <Card>
                <p className="text-sm text-[var(--text-muted)]">{selected.kind || 'Place'}</p>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                  {selected.title}
                </h3>
                <button type="button" className="mt-3 text-sm text-[var(--accent-primary)]" onClick={() => setSelected(null)}>
                  Close
                </button>
              </Card>
            </div>
          )}
        </div>
        {layers.saved && wishItems.length > 0 && (
          <p className="mx-auto mt-4 max-w-7xl px-4 text-sm text-[var(--text-muted)] sm:px-6">
            Saved places layer highlights {wishItems.length} wishlist entries when destinations match seed data.
          </p>
        )}
      </main>
      <Footer />
    </PageWrapper>
  );
}
