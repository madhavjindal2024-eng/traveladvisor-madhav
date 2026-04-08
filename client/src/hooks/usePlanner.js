import { useCallback, useState } from 'react';
import { api } from '../services/api.js';

/**
 * Planner generate/save helpers.
 */
export function usePlanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (body) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/planner/generate', body);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveItinerary = useCallback(async (body) => {
    const { data } = await api.post('/planner/save', body);
    return data;
  }, []);

  const packing = useCallback(async (body) => {
    const { data } = await api.post('/planner/packing', body);
    return data;
  }, []);

  return { generate, saveItinerary, packing, loading, error };
}
