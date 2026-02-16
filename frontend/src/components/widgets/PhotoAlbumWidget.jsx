/** @format */

import React, { useState } from "react";
import ImageLightbox from "../ImageLightbox";

function PhotoAlbumWidget({ widgetData, borderRadiusEnabled = true }) {
	const images = widgetData?.images || [];
	const [selectedImage, setSelectedImage] = useState(null);

	// Empty state
	if (images.length === 0) {
		return (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<div className="text-gray-600 font-medium mb-1">No photos yet</div>
				<div className="text-sm text-gray-500">Click Edit to add up to 5 photos to your gallery</div>
			</div>
		);
	}

	// Duplicate images for seamless loop
	const duplicatedImages = [...images, ...images];

	return (
		<>
			{/* Horizontal Scrolling Band */}
			<div className={`overflow-hidden w-full ${borderRadiusEnabled ? "rounded-2xl" : "rounded-none"}`}>
				<div
					className="flex animate-scroll"
					style={{
						animation: "scroll 10s linear infinite",
					}}>
					{duplicatedImages.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Photo ${index + 1}`}
							onClick={() => setSelectedImage(image)}
							loading="lazy"
							className="h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
							style={{ width: "auto" }}
						/>
					))}
				</div>
			</div>

			{/* Lightbox */}
			<ImageLightbox isOpen={selectedImage !== null} imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />

			{/* Inline CSS for scroll animation */}
			<style>{`
				@keyframes scroll {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
			`}</style>
		</>
	);
}

// Prevent unnecessary re-renders
export default React.memo(PhotoAlbumWidget);
