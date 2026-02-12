/** @format */

/**
 * Extract video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export function extractVideoId(url) {
	if (!url) return null;

	// Handle youtube.com/watch?v=VIDEO_ID
	const watchMatch = url.match(/[?&]v=([^&]+)/);
	if (watchMatch) return watchMatch[1];

	// Handle youtu.be/VIDEO_ID
	const shortMatch = url.match(/youtu\.be\/([^?]+)/);
	if (shortMatch) return shortMatch[1];

	// Handle youtube.com/embed/VIDEO_ID
	const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
	if (embedMatch) return embedMatch[1];

	return null;
}

/**
 * Get YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export function getEmbedUrl(videoId) {
	return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Thumbnail URL (maxresdefault quality)
 */
export function getThumbnailUrl(videoId) {
	return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
