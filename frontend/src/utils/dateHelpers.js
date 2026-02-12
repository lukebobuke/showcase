/** @format */

/**
 * Format a date string to human-readable format
 * @param {string} dateString - Date in format "2026-03-15"
 * @returns {string} Formatted date like "March 15, 2026"
 */
export function formatTourDate(dateString) {
	try {
		const date = new Date(dateString);

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return dateString; // Return original if invalid
		}

		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch (error) {
		console.error("Error formatting date:", error);
		return dateString;
	}
}

/**
 * Check if a date is today or in the future
 * @param {string} dateString - Date in format "2026-03-15"
 * @returns {boolean} True if date is today or future, false if past
 */
export function isUpcoming(dateString) {
	try {
		const date = new Date(dateString);
		const today = new Date();

		// Set time to midnight for accurate day comparison
		today.setHours(0, 0, 0, 0);
		date.setHours(0, 0, 0, 0);

		return date >= today;
	} catch (error) {
		console.error("Error checking if date is upcoming:", error);
		return false;
	}
}

/**
 * Sort tour dates with upcoming dates first (chronological), then past dates (reverse chronological)
 * @param {Array} datesArray - Array of tour date objects with .date property
 * @returns {Array} New sorted array
 */
export function sortTourDates(datesArray) {
	if (!Array.isArray(datesArray) || datesArray.length === 0) {
		return [];
	}

	try {
		// Create a copy to avoid mutating original
		const datesCopy = [...datesArray];

		// Separate into upcoming and past
		const upcoming = [];
		const past = [];

		datesCopy.forEach((dateObj) => {
			if (isUpcoming(dateObj.date)) {
				upcoming.push(dateObj);
			} else {
				past.push(dateObj);
			}
		});

		// Sort upcoming dates chronologically (earliest first)
		upcoming.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateA - dateB;
		});

		// Sort past dates reverse chronologically (most recent first)
		past.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateB - dateA;
		});

		// Return upcoming first, then past
		return [...upcoming, ...past];
	} catch (error) {
		console.error("Error sorting tour dates:", error);
		return datesArray;
	}
}
