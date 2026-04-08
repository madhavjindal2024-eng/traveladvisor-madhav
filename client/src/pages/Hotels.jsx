import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { formatMoney } from '../utils/formatters.js';
import { api } from '../services/api.js';

/**
 * Hotel search and listing with filters.
 */
export function Hotels() {
  const [destId, setDestId] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [compare, setCompare] = useState([]);
  const [priceMax, setPriceMax] = useState('');
  const [stars, setStars] = useState('');

  useEffect(() => {
    api.get('/destinations', { params: { limit: 50 } }).then((res) => setDestinations(res.data.items || []));
  }, []);

  useEffect(() => {
    if (!destId) {
      setHotels([]);
      return;
    }
    api.get('/hotels/search', { params: { dest: destId } }).then((res) => {
      let list = res.data.items || [];
      if (priceMax) list = list.filter((h) => h.pricePerNight <= Number(priceMax));
      if (stars) list = list.filter((h) => h.starRating >= Number(stars));
      setHotels(list);
    });
  }, [destId, priceMax, stars]);

  const toggleCompare = (h) => {
    setCompare((prev) => {
      const has = prev.find((x) => x._id === h._id);
      if (has) return prev.filter((x) => x._id !== h._id);
      if (prev.length >= 3) return prev;
      return [...prev, h];
    });
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">Hotels</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <label className="text-sm text-[var(--text-secondary)]">
            Destination
            <select
              className="mt-1 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2"
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
            >
              <option value="">Select</option>
              {destinations.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}, {d.country}
                </option>
              ))}
            </select>
          </label>
          <Input label="Max price / night" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
          <label className="text-sm text-[var(--text-secondary)]">
            Min stars
            <select
              className="mt-1 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
            >
              <option value="">Any</option>
              {[3, 4, 5].map((s) => (
                <option key={s} value={s}>
                  {s}+
                </option>
              ))}
            </select>
          </label>
        </div>

        {compare.length > 0 && (
          <Card className="mt-8 overflow-x-auto">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Compare ({compare.length}/3)</p>
            <table className="mt-4 w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="text-[var(--text-muted)]">
                  <th className="py-2">Name</th>
                  <th>Stars</th>
                  <th>Price</th>
                  <th>Amenities</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((h) => (
                  <tr key={h._id} className="border-t border-[var(--glass-border)]">
                    <td className="py-2 text-[var(--text-primary)]">{h.name}</td>
                    <td>{h.starRating}</td>
                    <td>{formatMoney(h.pricePerNight)}</td>
                    <td>{(h.amenities || []).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((h) => (
            <Card key={h._id} hover>
              <div
                className="-mx-6 -mt-6 mb-4 h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${h.images?.[0]})` }}
              />
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">{h.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {h.starRating} stars · {formatMoney(h.pricePerNight)}/night · {h.distanceFromCenterKm} km to center
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{h.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(h.amenities || []).map((a) => (
                  <span key={a} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[var(--text-muted)]">
                    {a}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/hotels/${h._id}`} className="text-sm text-[var(--accent-primary)] hover:underline">
                  Details
                </Link>
                <button type="button" className="text-sm text-[var(--text-secondary)] hover:underline" onClick={() => toggleCompare(h)}>
                  Compare
                </button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
