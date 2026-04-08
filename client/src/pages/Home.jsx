import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Button } from '../components/ui/Button.jsx';
import { DestinationCard } from '../components/destination/DestinationCard.jsx';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';
import { api } from '../services/api.js';

/**
 * Landing page with hero search and featured destinations.
 */
export function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [featured, setFeatured] = useState([]);
  const s1 = useIntersectionObserver();
  const s2 = useIntersectionObserver();
  const s3 = useIntersectionObserver();

  useEffect(() => {
    api.get('/destinations', { params: { limit: 6 } }).then((res) => setFeatured(res.data.items || []));
  }, []);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    if (travelers) params.set('travelers', String(travelers));
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <section className="page-enter text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent-primary)]">Premium travel discovery</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--text-primary)] sm:text-6xl">
            Discover Your Next Journey
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)]">
            Search destinations, compare costs, and plan day-by-day itineraries with tools built for real trips.
          </p>
          <form
            onSubmit={search}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <input
              className="min-h-[48px] flex-1 rounded-xl border border-transparent bg-[var(--bg-card)] px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
              placeholder="Where to?"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              type="date"
              className="min-h-[48px] rounded-xl border border-transparent bg-[var(--bg-card)] px-3 text-[var(--text-primary)] focus:outline-none"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <input
              type="date"
              className="min-h-[48px] rounded-xl border border-transparent bg-[var(--bg-card)] px-3 text-[var(--text-primary)] focus:outline-none"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <input
              type="number"
              min={1}
              className="w-full min-h-[48px] rounded-xl border border-transparent bg-[var(--bg-card)] px-3 text-[var(--text-primary)] sm:w-24"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
            />
            <Button type="submit" className="min-h-[48px] w-full sm:w-auto">
              Search
            </Button>
          </form>
        </section>

        <section ref={s1.ref} className={`reveal mt-24 ${s1.visible ? 'visible' : ''}`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">
                Featured destinations
              </h2>
              <p className="mt-2 text-[var(--text-muted)]">Curated picks with rich detail pages and live data hooks.</p>
            </div>
            <Link to="/explore" className="text-sm text-[var(--accent-primary)] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        </section>

        <section ref={s2.ref} className={`reveal mt-24 ${s2.visible ? 'visible' : ''}`}>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Trending trips</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {featured.slice(0, 4).map((d) => (
              <Link
                key={d._id}
                to={`/destination/${d._id}`}
                className="glass-card card-hover min-w-[260px] shrink-0 overflow-hidden"
              >
                <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${d.heroImage})` }} />
                <div className="p-4">
                  <p className="font-[family-name:var(--font-display)] text-lg text-[var(--text-primary)]">{d.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{d.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section ref={s3.ref} className={`reveal mt-24 ${s3.visible ? 'visible' : ''}`}>
          <div className="glass-card grid gap-6 p-8 sm:grid-cols-3">
            {[
              { k: '120+', l: 'Countries covered in seed data' },
              { k: '48k', l: 'Trips planned (demo stat)' },
              { k: '4.8', l: 'Average community rating' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--accent-primary)]">{s.k}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{s.l}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  );
}
