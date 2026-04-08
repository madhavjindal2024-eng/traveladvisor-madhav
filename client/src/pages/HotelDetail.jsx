import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { MapView } from '../components/map/MapView.jsx';
import { Card } from '../components/ui/Card.jsx';
import { formatMoney } from '../utils/formatters.js';
import { api } from '../services/api.js';

/**
 * Single hotel detail with carousel and map.
 */
export function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    api.get(`/hotels/${id}`).then((res) => setHotel(res.data));
  }, [id]);

  if (!hotel) {
    return (
      <PageWrapper>
        <Navbar />
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="spinner" />
        </div>
      </PageWrapper>
    );
  }

  const img = hotel.images?.[idx] || hotel.images?.[0];

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        <Link to="/hotels" className="text-sm text-[var(--accent-primary)] hover:underline">
          Back to hotels
        </Link>
        <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)]">
          <div className="h-72 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
          <div className="flex gap-2 overflow-x-auto bg-[var(--bg-secondary)]/50 p-2">
            {(hotel.images || []).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIdx(i)}
                className={`h-16 w-24 shrink-0 rounded-lg bg-cover bg-center ${i === idx ? 'ring-2 ring-[var(--accent-primary)]' : ''}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </div>
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">{hotel.name}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{hotel.description}</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Room types</h2>
            <table className="mt-4 w-full text-sm">
              <tbody>
                <tr className="border-b border-[var(--glass-border)]">
                  <td className="py-2">Standard</td>
                  <td className="text-right">{formatMoney(hotel.pricePerNight)}</td>
                </tr>
                <tr>
                  <td className="py-2">Deluxe</td>
                  <td className="text-right">{formatMoney(hotel.pricePerNight * 1.25)}</td>
                </tr>
              </tbody>
            </table>
          </Card>
          <Card>
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Amenities</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
              {(hotel.amenities || []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">Location</h2>
          <div className="mt-4">
            <MapView latitude={hotel.lat || 0} longitude={hotel.lng || 0} zoom={13} markers={[]} height="280px" />
          </div>
        </div>
        <Card className="mt-8">
          <h2 className="text-lg font-medium text-[var(--text-primary)]">Guest reviews</h2>
          <div className="mt-4 space-y-4">
            {(hotel.reviewsSnippet || []).map((r) => (
              <div key={r.author} className="border-t border-[var(--glass-border)] pt-4 first:border-t-0 first:pt-0">
                <p className="text-sm text-[var(--accent-gold)]">{'★'.repeat(r.rating)}</p>
                <p className="mt-1 text-[var(--text-primary)]">{r.text}</p>
                <p className="text-xs text-[var(--text-muted)]">{r.author}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
      <Footer />
    </PageWrapper>
  );
}
