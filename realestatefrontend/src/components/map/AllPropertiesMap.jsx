import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { pinIcon, DEFAULT_CENTER, DEFAULT_ZOOM } from './mapIcons';

/**
 * Plots every approved property on a shared map. Only properties with
 * isApproved=true and valid coordinates are shown — listings only become
 * visible on the map after an admin approves them.
 */
export default function AllPropertiesMap({ properties = [] }) {
  const pins = properties.filter(
    (p) => p.isApproved && typeof p.location?.lat === 'number' && typeof p.location?.lng === 'number'
      && !(p.location.lat === 0 && p.location.lng === 0)
  );

  const center = pins.length
    ? [pins[0].location.lat, pins[0].location.lng]
    : DEFAULT_CENTER;

  if (pins.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center" style={{ height: 520 }}>
        <p className="text-sm text-gray-500">No approved properties with map coordinates yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 520 }}>
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((p) => (
          <Marker key={p._id} position={[p.location.lat, p.location.lng]} icon={pinIcon('#059669')}>
            <Popup>
              <p className="font-semibold text-sm mb-0.5">{p.title}</p>
              <p className="text-xs text-gray-500 mb-1">{p.location?.city} · ₹{p.price?.toLocaleString()}</p>
              <Link to={`/properties/${p._id}`} className="text-xs text-primary-600 font-medium hover:underline">
                View details →
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
