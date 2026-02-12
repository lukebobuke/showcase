/** @format */

import { useState, useEffect } from "react";
import { extractVideoId, getEmbedUrl } from "../../utils/youtubeHelpers";

export default function YouTubeWidgetEditor({ isOpen, initialVideoUrl, onSave, onClose }) {
	const [videoUrl, setVideoUrl] = useState("");
	const [previewVideoId, setPreviewVideoId] = useState(null);
	const [error, setError] = useState("");

	// Initialize videoUrl when modal opens
	useEffect(() => {
		if (isOpen) {
			setVideoUrl(initialVideoUrl || "");
			setPreviewVideoId(extractVideoId(initialVideoUrl));
			setError("");
		}
	}, [isOpen, initialVideoUrl]);

	// Handle URL change
	const handleUrlChange = (url) => {
		setVideoUrl(url);
		setError("");

		// Extract video ID for preview
		const videoId = extractVideoId(url);
		setPreviewVideoId(videoId);

		// Show error if URL is provided but not valid
		if (url.trim() && !videoId) {
			setError("Please enter a valid YouTube URL");
		}
	};

	// Handle save
	const handleSave = () => {
		if (!previewVideoId) {
			setError("Please enter a valid YouTube URL");
			return;
		}

		onSave({ videoUrl });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<h2 className="text-2xl font-bold mb-4">Edit YouTube Video</h2>

				{/* Instructions */}
				<p className="text-sm text-gray-600 mb-4">Paste any YouTube video URL</p>

				{/* URL Input */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">YouTube URL</label>
					<input
						type="text"
						value={videoUrl}
						onChange={(e) => handleUrlChange(e.target.value)}
						placeholder="https://www.youtube.com/watch?v=..."
						className={`w-full p-2 border rounded ${error ? "border-red-400" : "border-gray-300"}`}
					/>
					{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
				</div>

				{/* Live Preview */}
				{previewVideoId && (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-2">Preview</label>
						<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
							<iframe
								className="absolute top-0 left-0 w-full h-full rounded"
								src={getEmbedUrl(previewVideoId)}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								title="YouTube video preview"
							/>
						</div>
					</div>
				)}

				{/* No preview placeholder */}
				{videoUrl && !previewVideoId && (
					<div className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
						<div className="text-gray-500 italic">Invalid YouTube URL - no preview available</div>
					</div>
				)}

				{/* Cancel and Save buttons */}
				<div className="flex justify-end gap-2">
					<button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={!previewVideoId}
						className={`px-4 py-2 rounded ${
							previewVideoId ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
