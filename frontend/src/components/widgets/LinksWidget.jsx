/** @format */

export default function LinksWidget({ widgetData }) {
	const links = widgetData?.links || [];

	// Detect platform from URL and return appropriate colors
	const getPlatformColors = (url) => {
		const lowerUrl = url.toLowerCase();

		if (lowerUrl.includes("spotify.com")) {
			return "bg-green-600 hover:bg-green-700";
		} else if (lowerUrl.includes("instagram.com")) {
			return "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700";
		} else if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
			return "bg-red-600 hover:bg-red-700";
		} else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
			return "bg-sky-500 hover:bg-sky-600";
		} else if (lowerUrl.includes("facebook.com")) {
			return "bg-blue-700 hover:bg-blue-800";
		} else if (lowerUrl.includes("tiktok.com")) {
			return "bg-black hover:bg-gray-900";
		} else if (lowerUrl.includes("soundcloud.com")) {
			return "bg-orange-600 hover:bg-orange-700";
		} else if (lowerUrl.includes("apple.com") || lowerUrl.includes("music.apple")) {
			return "bg-pink-600 hover:bg-pink-700";
		} else {
			return "bg-blue-600 hover:bg-blue-700";
		}
	};

	// Empty state
	if (links.length === 0) {
		return (
			<div className="italic text-center py-8" style={{ color: "var(--color-text-secondary)" }}>
				Click "Edit" to add links to social media and websites
			</div>
		);
	}

	// Render links as clickable buttons
	return (
		<div className="space-y-2">
			{links.map((link, index) => (
				<a
					key={index}
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					className="w-full py-3 px-4 rounded-lg text-left font-medium flex justify-between items-center transition-all hover:opacity-90 shadow-sm"
					style={{
						backgroundColor: "var(--color-accent)",
						color: "var(--color-widget)",
					}}>
					<span className="flex items-center gap-2">
						<span>{link.label}</span>
					</span>
					<span>→</span>
				</a>
			))}
		</div>
	);
}
