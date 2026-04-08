import { useEffect } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

/**
 * Leaflet map powered by OpenStreetMap tiles.
 * @param {object} props
 */
export function MapView({
  latitude,
  longitude,
  zoom = 10,
  markers = [],
  onMarkerClick,
  height = '420px',
}) {
  // Leaflet marker icon asset fix for Vite/Webpack.
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
  });

  const mapMarkers = markers.filter((m) => Number.isFinite(Number(m.lat)) && Number.isFinite(Number(m.lng)));

  function UpdateView({ lat, lng, z }) {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], z, { animate: true });
    }, [lat, lng, z, map]);
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--glass-border)]" style={{ height }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom
      >
        <UpdateView lat={latitude} lng={longitude} z={zoom} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapMarkers.map((m) => (
          <Marker key={m.id} position={[Number(m.lat), Number(m.lng)]} eventHandlers={{ click: () => onMarkerClick?.(m) }}>
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{m.title}</p>
                {m.kind && <p className="text-xs opacity-80">{m.kind}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
