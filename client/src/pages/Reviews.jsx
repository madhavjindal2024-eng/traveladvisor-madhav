import { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../hooks/useAuth.js';
import { api } from '../services/api.js';

/**
 * Community reviews with aggregate chart and submission form.
 */
export function Reviews() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [destId, setDestId] = useState('');
  const [sort, setSort] = useState('recent');
  const [data, setData] = useState({ items: [], aggregate: {} });
  const [form, setForm] = useState({ rating: 5, title: '', body: '' });

  useEffect(() => {
    api.get('/destinations', { params: { limit: 50 } }).then((res) => setDestinations(res.data.items || []));
  }, []);

  useEffect(() => {
    if (!destId) return;
    api.get('/reviews', { params: { destinationId: destId, sort } }).then((res) => setData(res.data));
  }, [destId, sort]);

  const chartData = [1, 2, 3, 4, 5].map((star) => ({
    star: `${star}★`,
    count: data.aggregate?.breakdown?.[star] || 0,
  }));

  const submit = async (e) => {
    e.preventDefault();
    if (!user || !destId) return;
    await api.post('/reviews', { destinationId: destId, ...form });
    const { data: d } = await api.get('/reviews', { params: { destinationId: destId, sort } });
    setData(d);
    setForm({ rating: 5, title: '', body: '' });
  };

  const helpful = async (id) => {
    await api.post(`/reviews/${id}/helpful`);
    const { data: d } = await api.get('/reviews', { params: { destinationId: destId, sort } });
    setData(d);
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">Reviews</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
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
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-4 flex gap-2">
              {['recent', 'helpful'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSort(s)}
                  className={`rounded-lg px-3 py-2 text-sm ${sort === s ? 'bg-white/10' : 'text-[var(--text-muted)]'}`}
                >
                  {s === 'recent' ? 'Most recent' : 'Most helpful'}
                </button>
              ))}
            </div>
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="star" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,22,40,0.95)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-4">
              {(data.items || []).map((r) => (
                <Card key={r._id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--accent-gold)]">{'★'.repeat(r.rating)}</p>
                      <p className="mt-1 font-medium text-[var(--text-primary)]">{r.title}</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{r.body}</p>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {r.userId?.name} · {r.verifiedTraveler ? 'Verified traveler' : ''}
                      </p>
                    </div>
                    <button type="button" className="text-xs text-[var(--accent-primary)]" onClick={() => helpful(r._id)}>
                      Helpful ({r.helpfulCount})
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">Write a review</h2>
            {!user && <p className="mt-2 text-sm text-[var(--text-muted)]">Sign in to post.</p>}
            <form onSubmit={submit} className="mt-4 space-y-3">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                disabled={!user}
              />
              <label className="text-sm text-[var(--text-secondary)]">
                Rating
                <select
                  className="mt-1 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2"
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  disabled={!user}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-[var(--text-secondary)]">
                Review
                <textarea
                  className="mt-1 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text-primary)]"
                  rows={4}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  disabled={!user}
                />
              </label>
              <Button type="submit" disabled={!user || !destId}>
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
