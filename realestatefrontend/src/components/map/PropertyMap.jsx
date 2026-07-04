import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, ShieldCheck, Clock } from 'lucide-react';
import { pinIcon } from './mapIcons';

/**
 * Shows the exact location of a single property on an interactive map.
 * Per platform policy, the live map pin is only rendered once the listing
 * has been approved by an Admin — pending listings show a placeholder
 * explaining that the map will appear after approval.
 */
export default function PropertyMap({ property, canPreview = false }) {
  const { lat, lng } = property?.location || {};
  const hasCoords = typeof lat === 'number' && typeof lng === 'number' && !(lat === 0 && lng === 0);

  if (!property?.isApproved && !canPreview) {
    return (
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-500" /> Location
        </h3>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            The map will appear here once this listing is approved by an admin.
          </p>
        </div>
      </div>
    );
  }

  if (!hasCoords) {
    return (
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-500" /> Location
        </h3>
        <p className="text-sm text-gray-500">
          The agent hasn't pinned exact coordinates for this property yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-500" /> Location
        </span>
        {property.isApproved && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified location
          </span>
        )}
        {!property.isApproved && canPreview && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
            Preview — hidden from buyers until approved
          </span>
        )}
      </h3>
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 280 }}>
        <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={pinIcon('#e11d48')}>
            <Popup>
              <p className="font-semibold text-sm mb-0.5">{property.title}</p>
              <p className="text-xs text-gray-500">{property.location?.address}, {property.location?.city}</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {property.location?.address}, {property.location?.city}, {property.location?.state}
        {property.location?.pincode ? ` - ${property.location.pincode}` : ''}
      </p>
    </div>
  );
}
