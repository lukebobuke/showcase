/** @format */

import { useEffect } from "react";

export default function ImageLightbox({ isOpen, imageUrl, onClose }) {
	// Handle ESC key to close lightbox
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={onClose}>
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
				aria-label="Close lightbox">
				✕
			</button>

			{/* Image - click event stops propagation to prevent closing when clicking image */}
			<img src={imageUrl} alt="Full size" className="max-h-[90vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
		</div>
	);
}
