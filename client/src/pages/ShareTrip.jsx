import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { ItineraryTimeline } from '../components/planner/ItineraryTimeline.jsx';
import { api } from '../services/api.js';

/**
 * Public share view for a saved itinerary.
 */
export function ShareTrip() {
  const { token } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.get(`/planner/share/${token}`).then((res) => setData(res.data));
  }, [token]);

  if (!data) {
    return (
      <PageWrapper>
        <Navbar />
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="spinner" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--text-primary)]">{data.title}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{data.destinationName}</p>
        <div className="mt-10">
          <ItineraryTimeline days={data.days} />
        </div>
      </main>
      <Footer />
    </PageWrapper>
  );
}
