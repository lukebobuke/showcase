/** @format */

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatTourDate, isUpcoming } from "../utils/dateHelpers";

export default function TourMap({ dates }) {
	const mapRef = useRef(null);
	const mapInstanceRef = useRef(null);

	// Filter dates that have coordinates
	const datesWithCoords = dates.filter((date) => date.latitude !== null && date.longitude !== null);

	// If no dates have coordinates, show message
	if (datesWithCoords.length === 0) {
		return (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
				<div className="text-4xl mb-2">🗺️</div>
				<div className="text-gray-600">Add cities to see them on the map</div>
			</div>
		);
	}

	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return;

		// Custom marker icons for upcoming vs past dates
		const upcomingIcon = new L.Icon({
			iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
			shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41],
		});

		const pastIcon = new L.Icon({
			iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
			shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41],
		});

		// Determine map center - use first date with coordinates or default to US center
		const center = datesWithCoords.length > 0 ? [datesWithCoords[0].latitude, datesWithCoords[0].longitude] : [39.8283, -98.5795]; // Geographic center of contiguous United States

		// Detect mobile device
		const isMobile = window.innerWidth < 768;

		// Create map instance with mobile-friendly settings
		const map = L.map(mapRef.current, {
			scrollWheelZoom: !isMobile, // Disable scroll zoom on mobile
			touchZoom: true,
			dragging: true,
			tap: true,
		}).setView(center, 4);
		mapInstanceRef.current = map;

		// Add OpenStreetMap tile layer
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		// Add markers for each tour date
		datesWithCoords.forEach((tourDate) => {
			// Choose icon based on whether date is upcoming or past
			const icon = isUpcoming(tourDate.date) ? upcomingIcon : pastIcon;

			const marker = L.marker([tourDate.latitude, tourDate.longitude], { icon }).addTo(map);

			// Create popup content
			const popupContent = `
				<div style="padding: 8px;">
					<div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 4px;">${tourDate.venue}</div>
					<div style="color: #374151; margin-bottom: 4px;">${tourDate.city}</div>
					<div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 8px;">
						${formatTourDate(tourDate.date)}
					</div>
					${
						tourDate.ticketLink ?
							`
						<a 
							href="${tourDate.ticketLink}" 
							target="_blank" 
							rel="noopener noreferrer"
							style="display: inline-block; background-color: #2563EB; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.875rem; text-decoration: none;"
						>
							Get Tickets
						</a>
					`
						:	""
					}
				</div>
			`;

			marker.bindPopup(popupContent);
		});

		// Cleanup function
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, [datesWithCoords]);

	return <div ref={mapRef} className="mb-4 rounded-lg border overflow-hidden h-64 md:h-96 w-full" />;
}
