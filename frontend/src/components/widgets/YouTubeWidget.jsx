/** @format */

import { extractVideoId, getEmbedUrl } from "../../utils/youtubeHelpers";

export default function YouTubeWidget({ widgetData }) {
	const videoId = extractVideoId(widgetData?.videoUrl);

	// Show placeholder if no video URL
	if (!videoId) {
		return (
			<div
				className="border-2 border-dashed rounded-lg p-8 text-center"
				style={{
					borderColor: "var(--color-border)",
					color: "var(--color-text)",
				}}>
				<div className="text-4xl mb-2">🎥</div>
				<div className="font-medium mb-1" style={{ color: "var(--color-text)" }}>
					No video yet
				</div>
				<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
					Click Edit to add a YouTube video
				</div>
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
