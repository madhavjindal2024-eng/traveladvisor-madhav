import { useCallback, useState } from 'react';
import { api } from '../services/api.js';

/**
 * Currency conversion via backend proxy.
 */
export function useCurrency() {
  const [loading, setLoading] = useState(false);

  const convert = useCallback(async (from, to, amount = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/currency', { params: { from, to, amount } });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { convert, loading };
}

