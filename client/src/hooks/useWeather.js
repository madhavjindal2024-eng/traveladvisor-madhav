import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

/**
 * Fetches weather via backend proxy.
 */
export function useWeather(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params?.city && !(params?.lat && params?.lng)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data: d } = await api.get('/weather', { params });
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params?.city, params?.lat, params?.lng]);

  return { data, loading, error };
}
