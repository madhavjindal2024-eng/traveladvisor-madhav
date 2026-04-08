import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

function normalizeUser(u) {
  if (!u) return null;
  const id = u.id || u._id;
  return { ...u, id: id ? String(id) : undefined };
}

/**
 * Provides auth state and helpers for JWT cookie-based session.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(normalizeUser(data.user));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const u = normalizeUser(data.user);
    setUser(u);
    return u;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    const u = normalizeUser(data.user);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch('/auth/me', payload);
    const u = normalizeUser(data.user);
    setUser(u);
    return u;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      refresh,
    }),
    [user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
