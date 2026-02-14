/** @format */

import L from "leaflet";

/**
 * Configure Leaflet marker icons for Vite bundler
 * Vite doesn't automatically handle Leaflet's default icon paths,
 * so we need to point them to a CDN or bundled assets
 */

// Remove default icon URL getter
delete L.Icon.Default.prototype._getIconUrl;

// Set icon URLs to CDN (ensures icons display correctly)
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// TODO: Consider bundling marker icons locally for offline support
