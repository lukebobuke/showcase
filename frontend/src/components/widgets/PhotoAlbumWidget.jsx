/** @format */

import { useState } from "react";
import ImageLightbox from "../ImageLightbox";

export default function PhotoAlbumWidget({ widgetData }) {
	const images = widgetData?.images || [];
	const [selectedImage, setSelectedImage] = useState(null);

	// Empty state
	if (images.length === 0) {
		return (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<div className="text-4xl mb-2">📷</div>
				<div className="text-gray-600 font-medium mb-1">No photos yet</div>
				<div className="text-gray-500 text-sm">Click Edit to add photos to your gallery</div>
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
