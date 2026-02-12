/** @format */

import { extractVideoId, getEmbedUrl } from "../../utils/youtubeHelpers";

export default function YouTubeWidget({ widgetData }) {
	const videoId = extractVideoId(widgetData?.videoUrl);

	// Show placeholder if no video URL
	if (!videoId) {
		return (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<div className="text-4xl mb-2">🎥</div>
				<div className="text-gray-600 font-medium mb-1">No video yet</div>
				<div className="text-sm text-gray-500">Click Edit to add a YouTube video</div>
			</div>
		);
	}

	// Embed URL for iframe
	const embedUrl = getEmbedUrl(videoId);

	return (
		<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
			<iframe
				className="absolute top-0 left-0 w-full h-full rounded"
				src={embedUrl}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				title="YouTube video"
			/>
		</div>
	);
}
