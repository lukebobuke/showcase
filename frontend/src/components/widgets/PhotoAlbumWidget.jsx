/** @format */

import { useState } from "react";
import ImageLightbox from "../ImageLightbox";

export default function PhotoAlbumWidget({ widgetData }) {
	const images = widgetData?.images || [];
	const [selectedImage, setSelectedImage] = useState(null);

	// Empty state
	if (images.length === 0) {
		return (
			<div
				className="border-2 border-dashed rounded-lg p-8 text-center"
				style={{
					borderColor: "var(--color-border)",
					color: "var(--color-text)",
				}}>
				<div className="text-4xl mb-2">📷</div>
				<div className="font-medium mb-1" style={{ color: "var(--color-text)" }}>
					No photos yet
				</div>
				<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
					Click Edit to add photos to your gallery
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Image Grid */}
			<div className="grid grid-cols-2 gap-2">
				{images.map((image, index) => (
					<img
						key={index}
						src={image}
						alt={`Photo ${index + 1}`}
						onClick={() => setSelectedImage(image)}
						className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
					/>
				))}
			</div>

			{/* Lightbox */}
			<ImageLightbox isOpen={selectedImage !== null} imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
		</>
	);
}
