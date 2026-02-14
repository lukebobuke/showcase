/** @format */

/**
 * Geocode a city name to coordinates using Nominatim API (OpenStreetMap)
 * @param {string} city - City name (e.g., "Chicago, IL" or "New York, NY")
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function geocodeCity(city) {
	if (!city || typeof city !== "string" || city.trim() === "") {
		console.error("Invalid city name provided");
		return null;
	}

	try {
		// Nominatim API endpoint
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

		// Nominatim requires a User-Agent header
		const response = await fetch(url, {
			headers: {
				"User-Agent": "ShowcaseApp/1.0 (showcase-widget-app)", // Required by Nominatim
			},
		});

		if (!response.ok) {
			console.error(`Geocoding failed with status: ${response.status}`);
			return null;
		}

		const data = await response.json();

		// Check if we got any results
		if (!data || data.length === 0) {
			console.warn(`No coordinates found for city: ${city}`);
			return null;
		}

		// Extract latitude and longitude from first result
		const result = data[0];
		const latitude = parseFloat(result.lat);
		const longitude = parseFloat(result.lon);

		// Validate coordinates
		if (isNaN(latitude) || isNaN(longitude)) {
			console.error("Invalid coordinates received from API");
			return null;
		}

		return {
			latitude,
			longitude,
		};
	} catch (error) {
		console.error("Error geocoding city:", error);
		return null;
	}
}

/**
 * Geocode multiple cities with rate limiting (1 request per second)
 * @param {Array<string>} cities - Array of city names
 * @returns {Promise<Array<{latitude: number, longitude: number} | null>>}
 */
export async function geocodeCities(cities) {
	const results = [];

	for (let i = 0; i < cities.length; i++) {
		const result = await geocodeCity(cities[i]);
		results.push(result);

		// Wait 1 second between requests (Nominatim rate limit)
		if (i < cities.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	return results;
}
