import { createContext, useContext, useMemo, useState } from 'react';

const TripContext = createContext(null);

/**
 * Lightweight client state for in-progress trip planning (Add to Trip).
 */
export function TripProvider({ children }) {
  const [draftDestination, setDraftDestination] = useState(null);

  const value = useMemo(
    () => ({
      draftDestination,
      setDraftDestination,
    }),
    [draftDestination]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
