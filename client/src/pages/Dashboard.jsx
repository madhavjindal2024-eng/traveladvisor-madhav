import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useWishlist } from '../hooks/useWishlist.js';
import { api } from '../services/api.js';

/**
 * User dashboard with saved trips, wishlists, itineraries, and settings.
 */
export function Dashboard() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  const idx = parts.indexOf('dashboard');
  const segment = idx >= 0 && parts[idx + 1] ? parts[idx + 1] : 'overview';
  const { user, updateProfile } = useAuth();
  const { items: wishItems } = useWishlist();
  const [trips, setTrips] = useState([]);
  const [itins, setItins] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [settings, setSettings] = useState({ name: user?.name || '', homeCountry: user?.homeCountry || '' });

  useEffect(() => {
    if (!user?.id) return;
    api.get('/trips').then((res) => setTrips(res.data.items || []));
    api.get(`/planner/user/${user.id}`).then((res) => setItins(res.data.items || []));
    api.get('/reviews/user/me').then((res) => setMyReviews(res.data.items || []));
  }, [user?.id]);

  useEffect(() => {
    setSettings({ name: user?.name || '', homeCountry: user?.homeCountry || '' });
  }, [user]);

  const saveSettings = async (e) => {
    e.preventDefault();
    await updateProfile(settings);
  };

  const deleteItin = async (id) => {
    await api.delete(`/planner/itinerary/${id}`);
    setItins((prev) => prev.filter((x) => x._id !== id));
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 pt-28 lg:flex-row lg:px-8">
        <Sidebar />
        <div className="min-w-0 flex-1">
          {segment === 'overview' && (
            <div className="space-y-6">
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Overview</h1>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <p className="text-sm text-[var(--text-muted)]">Countries visited</p>
                  <p className="mt-2 text-3xl text-[var(--accent-primary)]">{user?.countriesVisited ?? 0}</p>
                </Card>
                <Card>
                  <p className="text-sm text-[var(--text-muted)]">Trips completed</p>
                  <p className="mt-2 text-3xl text-[var(--accent-primary)]">{user?.tripsCompleted ?? 0}</p>
                </Card>
                <Card>
                  <p className="text-sm text-[var(--text-muted)]">Days traveled</p>
                  <p className="mt-2 text-3xl text-[var(--accent-primary)]">{user?.totalDaysTraveled ?? 0}</p>
                </Card>
              </div>
            </div>
          )}
          {segment === 'trips' && (
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Saved trips</h1>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {trips.map((t) => (
                  <Card key={t._id}>
                    <p className="text-xs text-[var(--text-muted)]">{t.status}</p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)]">
                      {t.title}
                    </p>
                  </Card>
                ))}
                {trips.length === 0 && <p className="text-[var(--text-muted)]">No saved trips yet.</p>}
              </div>
            </div>
          )}
          {segment === 'wishlist' && (
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Wishlist</h1>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishItems.map((w) => (
                  <Card key={w._id}>
                    <p className="font-medium text-[var(--text-primary)]">{w.destinationId?.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{w.destinationId?.country}</p>
                  </Card>
                ))}
                {wishItems.length === 0 && <p className="text-[var(--text-muted)]">Save destinations from Explore.</p>}
              </div>
            </div>
          )}
          {segment === 'itineraries' && (
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">
                My itineraries
              </h1>
              <div className="mt-6 space-y-4">
                {itins.map((it) => (
                  <Card key={it._id} className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{it.title}</p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {it.shareToken && (
                          <Link to={`/share/trip/${it.shareToken}`} className="text-[var(--accent-primary)] hover:underline">
                            Share link
                          </Link>
                        )}
                      </p>
                    </div>
                    <Button type="button" variant="ghost" onClick={() => deleteItin(it._id)}>
                      Delete
                    </Button>
                  </Card>
                ))}
                {itins.length === 0 && <p className="text-[var(--text-muted)]">Generate one in the Planner.</p>}
              </div>
            </div>
          )}
          {segment === 'reviews' && (
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">My reviews</h1>
              <div className="mt-6 space-y-4">
                {myReviews.map((r) => (
                  <Card key={r._id}>
                    <p className="text-sm text-[var(--accent-gold)]">{'★'.repeat(r.rating)}</p>
                    <p className="mt-1 text-[var(--text-primary)]">{r.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{r.destinationId?.name}</p>
                  </Card>
                ))}
                {myReviews.length === 0 && <p className="text-[var(--text-muted)]">No reviews yet.</p>}
              </div>
            </div>
          )}
          {segment === 'settings' && (
            <Card>
              <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">Settings</h1>
              <form onSubmit={saveSettings} className="mt-6 max-w-md space-y-4">
                <Input label="Name" value={settings.name} onChange={(e) => setSettings((s) => ({ ...s, name: e.target.value }))} />
                <Input
                  label="Home country"
                  value={settings.homeCountry}
                  onChange={(e) => setSettings((s) => ({ ...s, homeCountry: e.target.value }))}
                />
                <Button type="submit">Save</Button>
              </form>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
