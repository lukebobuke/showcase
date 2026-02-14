/** @format */

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatTourDate, isUpcoming } from "../utils/dateHelpers";

/**
 * Interactive map component displaying tour date locations
 * Uses Leaflet for map rendering with markers for each venue
 * @param {Array} dates - Array of tour date objects with latitude/longitude coordinates
 */
export default function TourMap({ dates, borderRadiusEnabled = true }) {
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

		// Custom marker icons using theme colors
		const upcomingIcon = L.divIcon({
			className: "custom-marker",
			html: `<div style="
				width: 24px;
				height: 24px;
				border-radius: 50% 50% 50% 0;
				background: var(--color-accent);
				border: 3px solid white;
				transform: rotate(-45deg);
			"></div>`,
			iconSize: [24, 24],
			iconAnchor: [12, 24],
			popupAnchor: [0, -24],
		});

		const pastIcon = L.divIcon({
			className: "custom-marker",
			html: `<div style="
				width: 24px;
				height: 24px;
				border-radius: 50% 50% 50% 0;
				background: #9CA3AF;
				border: 3px solid white;
				transform: rotate(-45deg);
			"></div>`,
			iconSize: [24, 24],
			iconAnchor: [12, 24],
			popupAnchor: [0, -24],
		});

		// Create map instance with mobile-friendly settings
		const map = L.map(mapRef.current, {
			scrollWheelZoom: true, // Enable scroll/pinch zoom
			touchZoom: true, // Enable touch zoom (pinch)
			dragging: true,
			tap: true,
			zoomControl: false, // Remove zoom buttons
			attributionControl: false, // Remove attribution footer
		});
		mapInstanceRef.current = map;

		// Add OpenStreetMap tile layer
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

		// Collect all marker coordinates for bounds calculation
		const bounds = L.latLngBounds(datesWithCoords.map((date) => [date.latitude, date.longitude]));

		// Add markers for each tour date
		datesWithCoords.forEach((tourDate) => {
			// Choose icon based on whether date is upcoming or past
			const icon = isUpcoming(tourDate.date) ? upcomingIcon : pastIcon;

			const marker = L.marker([tourDate.latitude, tourDate.longitude], { icon }).addTo(map);

			// Create popup content
			const popupContent = `
				<div style="padding: 8px; color: var(--color-text);">
					<div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 4px; color: var(--color-text);">${tourDate.venue}</div>
					<div style="color: var(--color-text-secondary); margin-bottom: 4px;">${tourDate.city}</div>
					<div style="color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: 8px;">
						${formatTourDate(tourDate.date)}
					</div>
					${
						tourDate.ticketLink ?
							`
						<a 
							href="${tourDate.ticketLink}" 
							target="_blank" 
							rel="noopener noreferrer"
							style="display: inline-block; background-color: var(--color-accent); color: var(--color-widget); padding: 4px 12px; border-radius: 4px; font-size: 0.875rem; text-decoration: none;"
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

		// Fit map bounds to show all markers with padding
		map.fitBounds(bounds, { padding: [50, 50] });

		// Cleanup function
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
		};
	}, [datesWithCoords]);

	return (
		<div
			className={`mb-4 border overflow-hidden h-64 md:h-96 w-full relative ${borderRadiusEnabled ? "rounded-2xl" : "rounded-none"}`}
			style={{ isolation: "isolate" }}>
			<div ref={mapRef} className="h-full w-full relative z-0" />
			<div
				className="absolute inset-0 pointer-events-none z-10"
				style={{
					backgroundColor: "var(--color-accent)",
					mixBlendMode: "soft-light",
					opacity: 0.75,
				}}
			/>
		</div>
	);
}
