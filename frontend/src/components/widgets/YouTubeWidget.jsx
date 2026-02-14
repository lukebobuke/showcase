/** @format */

import React from "react";
import { extractVideoId, getEmbedUrl } from "../../utils/youtubeHelpers";

function YouTubeWidget({ widgetData, borderRadiusEnabled = true }) {
	const videoId = extractVideoId(widgetData?.videoUrl);

	// Show placeholder if no video URL
	if (!videoId) {
		return (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<div className="text-gray-600 font-medium mb-1">No video added</div>
				<div className="text-sm text-gray-500">Click Edit to add a YouTube video</div>
			</div>
		);
	}

	// Embed URL for iframe
	const embedUrl = getEmbedUrl(videoId);

	return (
		<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
			<iframe
				className={`absolute top-0 left-0 w-full h-full ${borderRadiusEnabled ? "rounded-2xl" : "rounded-none"}`}
				src={embedUrl}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
				title="YouTube video"
			/>
		</div>
	);
}

// Prevent unnecessary re-renders
export default React.memo(YouTubeWidget);
