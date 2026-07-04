import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search, MapPin, Loader2, Crosshair } from 'lucide-react';
import { pinIcon, DEFAULT_CENTER, DEFAULT_ZOOM } from './mapIcons';

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ lat, lng, zoom }) {
  const map = useMap();
  map.setView([lat, lng], zoom ?? map.getZoom());
  return null;
}

/**
 * Interactive map used by Agents/Admins on the property form to pin the
 * exact location of a listing. Search uses OpenStreetMap's free Nominatim
 * geocoder (runs client-side in the user's browser); clicking anywhere on
 * the map also drops/moves the pin. Selected lat/lng are reported to the
 * parent via onChange so they can be submitted with the property.
 */
export default function LocationPicker({ lat, lng, onChange }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const hasCoords = typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng);
  const center = hasCoords ? [lat, lng] : DEFAULT_CENTER;

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const results = await res.json();
      if (results?.[0]) {
        onChange(parseFloat(results[0].lat), parseFloat(results[0].lon));
      }
    } catch {
      // Silently ignore — user can still click the map manually
    }
    setSearching(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      onChange(pos.coords.latitude, pos.coords.longitude);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') search(e); }}
            placeholder="Search an address to drop the pin..."
            className="input-field pl-9"
          />
        </div>
        <button type="button" onClick={search} disabled={searching} className="btn-secondary px-3 flex items-center gap-1.5 text-sm">
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
        <button type="button" onClick={useMyLocation} title="Use my current location" className="btn-secondary px-3">
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 260 }}>
        <MapContainer center={center} zoom={hasCoords ? 15 : DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {hasCoords && <Marker position={[lat, lng]} icon={pinIcon('#4f46e5')} />}
          {hasCoords && <Recenter lat={lat} lng={lng} />}
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" />
        Click anywhere on the map to place the pin, or search an address above.
        {hasCoords && <span className="ml-1 text-gray-500 font-medium">Selected: {lat.toFixed(5)}, {lng.toFixed(5)}</span>}
      </p>
    </div>
  );
}
