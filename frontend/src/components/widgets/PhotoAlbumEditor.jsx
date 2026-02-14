/** @format */

import { useState, useEffect, useRef } from "react";
import { convertToBase64, validateImage, compressImage } from "../../utils/imageHelpers";

export default function PhotoAlbumEditor({ isOpen, initialImages, onSave, onClose, isSaving }) {
	const [images, setImages] = useState([]);
	const [error, setError] = useState("");
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [selectedFileInfo, setSelectedFileInfo] = useState(null);
	const fileInputRef = useRef(null);

	// Initialize images when modal opens
	useEffect(() => {
		if (isOpen) {
			setImages(initialImages && initialImages.length > 0 ? [...initialImages] : []);
			setError("");
			setUploading(false);
			setProgress(0);
			setUploadSuccess(false);
			setSelectedFileInfo(null);
		}
	}, [isOpen, initialImages]);

	// ESC key to close modal
	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape" && !uploading) onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEsc);
			return () => document.removeEventListener("keydown", handleEsc);
		}
	}, [isOpen, onClose, uploading]);

	// Handle adding a photo
	const handleAddPhoto = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Reset file input
		e.target.value = "";

		// Check max photos limit
		if (images.length >= 5) {
			setError("Maximum 5 photos allowed");
			return;
		}

		// Show file info
		const fileSizeKB = (file.size / 1024).toFixed(1);
		const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
		const displaySize = file.size < 1024 * 1024 ? `${fileSizeKB} KB` : `${fileSizeMB} MB`;
		setSelectedFileInfo({ name: file.name, size: displaySize });

		// Validate image
		const validation = validateImage(file);
		if (!validation.valid) {
			setError(validation.error);
			setSelectedFileInfo(null);
			return;
		}

		try {
			setUploading(true);
			setError("");
			setProgress(0);
			setUploadSuccess(false);

			// Convert to base64
			setProgress(10);
			const base64 = await convertToBase64(file);

			// Compress image to reduce file size with progress tracking
			const compressed = await compressImage(base64, 800, (percent) => {
				setProgress(10 + Math.round(percent * 0.9)); // Map 0-100 to 10-100
			});

			setImages([...images, compressed]);
			setProgress(100);
			setUploadSuccess(true);
			setSelectedFileInfo(null);

			// Clear success message after 3 seconds
			setTimeout(() => setUploadSuccess(false), 3000);
		} catch (err) {
			setError("Failed to process image. Please try again.");
			setSelectedFileInfo(null);
			console.error("Error converting image:", err);
		} finally {
			setUploading(false);
		}
	};

	// Remove photo at index
	const removePhoto = (index) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
		setError("");
	};

	// Handle save
	const handleSave = () => {
		onSave({ images });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modalSlideIn">
				<h2 className="text-2xl font-bold mb-4">Edit Photos</h2>

				{/* Error message */}
				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				{/* Max photos info */}
				<p className="text-sm text-gray-600 mb-4">Add up to 5 photos ({images.length}/5 used)</p>

				{/* Photo grid */}
				<div className="mb-4">
					{images.length === 0 ?
						<p className="text-gray-500 italic mb-4">No photos yet. Click "Add Photo" to get started.</p>
					:	<div className="grid grid-cols-3 gap-2 mb-4">
							{images.map((image, index) => (
								<div key={index} className="relative">
									<img src={image} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover rounded" />
									<button
										onClick={() => removePhoto(index)}
										className="danger absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full hover:bg-red-700 flex items-center justify-center text-sm font-bold"
										aria-label="Delete photo">
										✕
									</button>
								</div>
							))}
						</div>
					}
				</div>

				{/* Add Photo button */}
				<div className="mb-4">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/jpg,image/png,image/webp"
						onChange={handleAddPhoto}
						className="hidden"
					/>
					<button
						onClick={() => fileInputRef.current?.click()}
						disabled={images.length >= 5 || uploading}
						className={`px-4 py-2 rounded flex items-center gap-2 transition-transform ${
							images.length >= 5 || uploading ?
								"bg-gray-300 text-gray-500 cursor-not-allowed"
							:	"bg-green-600 text-white hover:bg-green-700 hover:scale-105"
						}`}>
						{uploading && (
							<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						)}
						{uploading ?
							"Processing..."
						: images.length >= 5 ?
							"Max Photos Reached"
						:	"Add Photo"}
					</button>
					<p className="text-xs text-gray-500 mt-2">Accepted formats: JPEG, PNG, WebP • Max size: 2MB per image</p>

					{/* Show selected file info */}
					{selectedFileInfo && (
						<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
							<span className="font-medium">Selected:</span> {selectedFileInfo.name} ({selectedFileInfo.size})
						</div>
					)}

					{/* Progress bar */}
					{uploading && (
						<div className="mt-3">
							<div className="flex justify-between text-xs text-gray-600 mb-1">
								<span>Processing image...</span>
								<span>{progress}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
								<div className="bg-blue-600 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
							</div>
						</div>
					)}
				</div>

				{/* Cancel and Save buttons */}
				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-transform hover:scale-105">
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-transform hover:scale-105">
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
