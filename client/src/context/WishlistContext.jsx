import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);

/**
 * Tracks wishlisted destination ids for quick UI toggles.
 */
export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(new Set());
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    if (!user?.id) {
      setIds(new Set());
      setItems([]);
      return;
    }
    try {
      const { data } = await api.get(`/wishlist/user/${user.id}`);
      const list = data.items || [];
      setItems(list);
      setIds(new Set(list.map((w) => String(w.destinationId?._id || w.destinationId))));
    } catch {
      setIds(new Set());
      setItems([]);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (destinationId, notes = '') => {
    if (!user?.id) throw new Error('Sign in to save');
    const idStr = String(destinationId);
    if (ids.has(idStr)) {
      const row = items.find((w) => String(w.destinationId?._id || w.destinationId) === idStr);
      if (row) await api.delete(`/wishlist/${row._id}`);
      setIds((prev) => {
        const n = new Set(prev);
        n.delete(idStr);
        return n;
      });
      setItems((prev) => prev.filter((w) => String(w.destinationId?._id || w.destinationId) !== idStr));
    } else {
      const { data } = await api.post('/wishlist/', { destinationId, notes });
      setIds((prev) => new Set(prev).add(idStr));
      setItems((prev) => [...prev, data]);
    }
  };

  const value = useMemo(
    () => ({ ids, items, has: (id) => ids.has(String(id)), toggle, reload: load }),
    [ids, items, load]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
