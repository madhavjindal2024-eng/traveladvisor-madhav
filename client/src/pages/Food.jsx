import { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { api } from '../services/api.js';

const CATS = ['Fine Dining', 'Street Food', 'Cafes', 'Vegan', 'Seafood', 'Local Cuisine'];

/**
 * Restaurant discovery and foodie trail.
 */
export function Food() {
  const [destId, setDestId] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [trail, setTrail] = useState(null);

  useEffect(() => {
    api.get('/destinations', { params: { limit: 50 } }).then((res) => setDestinations(res.data.items || []));
  }, []);

  useEffect(() => {
    if (!destId) {
      setItems([]);
      return;
    }
    api.get('/restaurants/search', { params: { dest: destId, category: category || undefined } }).then((res) => {
      setItems(res.data.items || []);
    });
  }, [destId, category]);

  const runTrail = async () => {
    if (!destId) return;
    const { data } = await api.get('/restaurants/foodie-trail', { params: { dest: destId } });
    setTrail(data);
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">
          Restaurants
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Seed data stands in for Google Places; wire your key on the server for live POIs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <select
            className="glass-card rounded-xl border border-[var(--glass-border)] px-4 py-2 text-[var(--text-primary)]"
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
          >
            <option value="">Choose destination</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-sm ${
                category === c ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15' : 'border-[var(--glass-border)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <Button type="button" variant="ghost" onClick={runTrail} disabled={!destId}>
            Generate Foodie Trail (1 day)
          </Button>
        </div>
        {trail && (
          <Card className="mt-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">{trail.title}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-[var(--text-secondary)]">
              {(trail.stops || []).map((s) => (
                <li key={s.order}>
                  <span className="text-[var(--text-primary)]">{s.name}</span> — {s.cuisine} ({s.priceRange})
                </li>
              ))}
            </ol>
          </Card>
        )}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <Card key={r._id} hover>
              <div
                className="-mx-6 -mt-6 mb-4 h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${r.image})` }}
              />
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">{r.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {r.cuisine} · {r.priceRange}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{r.address}</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
