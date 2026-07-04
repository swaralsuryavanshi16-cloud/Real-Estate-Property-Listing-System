import L from 'leaflet';

// Leaflet's default marker icons reference image paths that break under
// Vite/webpack bundling. Instead we build a lightweight inline SVG pin as a
// divIcon — no external image assets required, and it inherits the portal's
// theme colour via currentColor / inline fill.
export function pinIcon(color = '#026fc7', size = 34) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="white" stroke-width="1" d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 15 9 15s9-8.5 9-15c0-4.97-4.03-9-9-9z"/>
      <circle cx="12" cy="9" r="3.4" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: 'propestate-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export const DEFAULT_CENTER = [20.5937, 78.9629]; // Center of India, sensible fallback
export const DEFAULT_ZOOM = 5;
