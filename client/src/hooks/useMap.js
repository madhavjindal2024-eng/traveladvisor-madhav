import { useCallback, useState } from 'react';

/**
 * Map UI state (layers, selection) for Map Explorer.
 */
export function useMap() {
  const [layers, setLayers] = useState({
    attractions: true,
    restaurants: true,
    hotels: true,
    hidden: true,
    saved: true,
  });
  const [selected, setSelected] = useState(null);

  const toggleLayer = useCallback((key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { layers, toggleLayer, selected, setSelected };
}
