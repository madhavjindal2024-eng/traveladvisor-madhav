import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { DestinationHero } from '../components/destination/DestinationHero.jsx';
import { DestinationTabs } from '../components/destination/DestinationTabs.jsx';
import { MapView } from '../components/map/MapView.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Card } from '../components/ui/Card.jsx';
import { useWeather } from '../hooks/useWeather.js';
import { useTrip } from '../context/TripContext.jsx';
import { useWishlist } from '../hooks/useWishlist.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatMoney } from '../utils/formatters.js';
import { api } from '../services/api.js';

/**
 * Destination detail with tabs, map, weather, and offline snapshot.
 */
export function DestinationDetail() {
  const { id } = useParams();
  const [dest, setDest] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [reviews, setReviews] = useState({ items: [], aggregate: {} });
  const [lightbox, setLightbox] = useState(null);
  const { setDraftDestination } = useTrip();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const weather = useWeather(dest ? { lat: dest.lat, lng: dest.lng } : null);

  useEffect(() => {
    if (!id) return;
    api.get(`/destinations/${id}`).then((res) => setDest(res.data));
  }, [id]);

  useEffect(() => {
    if (!dest?._id) return;
    api.get('/hotels/search', { params: { dest: dest._id } }).then((res) => setHotels(res.data.items || []));
    api.get('/restaurants/search', { params: { dest: dest._id } }).then((res) => setRestaurants(res.data.items || []));
    api.get('/reviews', { params: { destinationId: dest._id } }).then((res) => setReviews(res.data));
  }, [dest?._id]);

  const saveOffline = () => {
    if (!dest) return;
    try {
      localStorage.setItem(`ta-offline-${dest._id}`, JSON.stringify(dest));
      alert('Saved for offline viewing in this browser.');
    } catch {
      alert('Could not save offline.');
    }
  };

  if (!dest) {
    return (
      <PageWrapper>
        <Navbar />
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="spinner" />
        </div>
      </PageWrapper>
    );
  }

  const markers = (dest.pointsOfInterest || []).map((p, i) => ({
    id: `${p.name}-${i}`,
    lat: p.lat,
    lng: p.lng,
    title: p.name,
  }));

  const weatherBlock = (
    <Card>
      <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">Weather</h3>
      {weather.loading ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">Loading forecast</p>
      ) : weather.data?.mock ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-3xl font-medium text-[var(--text-primary)]">{weather.data.current?.temp} C</p>
            <p className="text-sm text-[var(--text-secondary)]">{weather.data.current?.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(weather.data.daily || []).slice(0, 7).map((d) => (
              <div key={d.date} className="glass-card rounded-lg px-2 py-1 text-xs">
                {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                <br />
                {d.high}/{d.low}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Live OpenWeather data loaded server-side.</p>
      )}
    </Card>
  );

  const hotelsSlot = (
    <div className="grid gap-4 md:grid-cols-2">
      {hotels.map((h) => (
        <Card key={h._id} hover>
          <p className="text-sm text-[var(--text-muted)]">{h.starRating} stars</p>
          <h4 className="font-[family-name:var(--font-display)] text-lg text-[var(--text-primary)]">{h.name}</h4>
          <p className="text-sm text-[var(--text-secondary)]">{h.description}</p>
          <p className="mt-2 text-sm text-[var(--accent-gold)]">
            {formatMoney(h.pricePerNight)}/night · {h.distanceFromCenterKm} km from center
          </p>
          <Link to={`/hotels/${h._id}`} className="mt-3 inline-block text-sm text-[var(--accent-primary)] hover:underline">
            View details
          </Link>
        </Card>
      ))}
    </div>
  );

  const restaurantsSlot = (
    <div className="grid gap-4 md:grid-cols-2">
      {restaurants.map((r) => (
        <Card key={r._id} hover>
          <div className="flex gap-4">
            {r.image && (
              <div
                className="h-24 w-24 shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${r.image})` }}
              />
            )}
            <div>
              <h4 className="font-medium text-[var(--text-primary)]">{r.name}</h4>
              <p className="text-xs text-[var(--text-muted)]">
                {r.cuisine} · {r.priceRange}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{r.address}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const reviewsSlot = (
    <div className="space-y-4">
      <Card>
        <p className="text-sm text-[var(--text-muted)]">
          Average {reviews.aggregate?.average?.toFixed(1) || '—'} ({reviews.aggregate?.count || 0} reviews)
        </p>
      </Card>
      {(reviews.items || []).map((rev) => (
        <Card key={rev._id}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--accent-primary)]/30" />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{rev.userId?.name || 'Traveler'}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {rev.verifiedTraveler ? 'Verified traveler' : ''} · {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="ml-auto text-[var(--accent-gold)]">{'★'.repeat(rev.rating)}</span>
          </div>
          {rev.title && <p className="mt-2 font-medium text-[var(--text-primary)]">{rev.title}</p>}
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{rev.body}</p>
        </Card>
      ))}
    </div>
  );

  const breakdown = dest.costBreakdown || {};

  return (
    <PageWrapper>
      <Navbar />
      <DestinationHero image={dest.heroImage} title={dest.name} subtitle={dest.country} />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => {
              setDraftDestination(dest);
              alert('Added to trip planner draft. Open Planner to continue.');
            }}
          >
            Add to Trip
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (!user) {
                window.location.href = '/auth';
                return;
              }
              toggle(dest._id);
            }}
          >
            {has(dest._id) ? 'Saved to wishlist' : 'Save to wishlist'}
          </Button>
          <Button type="button" variant="outline" onClick={saveOffline}>
            Save offline
          </Button>
          <Link to="/planner">
            <Button variant="ghost">Open AI Planner</Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MapView latitude={dest.lat} longitude={dest.lng} zoom={11} markers={markers} height="380px" />
          </div>
          <Card>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
              Cost estimator
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Per person per day (USD, indicative)</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex justify-between">
                <span>Stay</span>
                <span>{formatMoney(breakdown.accommodation || 0)}</span>
              </li>
              <li className="flex justify-between">
                <span>Food</span>
                <span>{formatMoney(breakdown.food || 0)}</span>
              </li>
              <li className="flex justify-between">
                <span>Transport</span>
                <span>{formatMoney(breakdown.transport || 0)}</span>
              </li>
              <li className="flex justify-between">
                <span>Activities</span>
                <span>{formatMoney(breakdown.activities || 0)}</span>
              </li>
              <li className="flex justify-between">
                <span>Misc</span>
                <span>{formatMoney(breakdown.misc || 0)}</span>
              </li>
            </ul>
          </Card>
        </div>

        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {(dest.gallery || []).map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightbox(src)}
                className="relative aspect-video overflow-hidden rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
              Travel safety
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
              {(dest.safetyAlerts || []).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
              Phrasebook
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              {(dest.phrasebook || []).map((p) => (
                <li key={p.phrase}>
                  <span className="text-[var(--text-primary)]">{p.phrase}</span> — {p.translation}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <div className="mt-12">
          <DestinationTabs
            destination={dest}
            weatherContent={weatherBlock}
            hotelsSlot={hotelsSlot}
            restaurantsSlot={restaurantsSlot}
            reviewsSlot={reviewsSlot}
            mapSlot={null}
          />
        </div>
      </main>
      <Modal open={!!lightbox} onClose={() => setLightbox(null)} title="">
        {lightbox && <img src={lightbox} alt="" className="max-h-[70vh] w-full rounded-lg object-contain" />}
      </Modal>
      <Footer />
    </PageWrapper>
  );
}
