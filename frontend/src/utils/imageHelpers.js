/** @format */

/**
 * Convert a File object to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string with data URL prefix
 */
export function convertToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

/**
 * Validate an image file
 * @param {File} file - The file to validate
 * @returns {{ valid: boolean, error: string }} - Validation result
 */
export function validateImage(file) {
	// Check file type
	const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
	if (!validTypes.includes(file.type)) {
		return {
			valid: false,
			error: "Only JPEG, PNG, and WebP images are allowed",
		};
	}

	// Check file size (2MB = 2 * 1024 * 1024 bytes)
	const maxSize = 2 * 1024 * 1024;
	if (file.size > maxSize) {
		return {
			valid: false,
			error: "Image must be smaller than 2MB",
		};
	}

	return { valid: true, error: "" };
}

/**
 * Compress an image to reduce file size
 * @param {string} base64 - Base64 encoded image
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {Function} onProgress - Optional progress callback (percent)
 * @returns {Promise<string>} - Compressed base64 string
 */
export function compressImage(base64, maxWidth = 800, onProgress = null) {
	return new Promise((resolve, reject) => {
		// Create an image element
		const img = new Image();

		img.onload = () => {
			// Check original size and warn if > 5MB
			const originalSize = Math.round((base64.length * 3) / 4); // Approximate size
			if (originalSize > 5 * 1024 * 1024) {
				console.warn(`Original image is ${(originalSize / (1024 * 1024)).toFixed(2)}MB. This may take a moment to compress.`);
			}

			if (onProgress) onProgress(20);

			// Calculate new dimensions maintaining aspect ratio
			let width = img.width;
			let height = img.height;

			if (width > maxWidth) {
				height = (height * maxWidth) / width;
				width = maxWidth;
			}

			if (onProgress) onProgress(40);

			// Create canvas
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			// Draw image on canvas
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);

			if (onProgress) onProgress(60);

			// Target max file size: 200KB
			const targetSize = 200 * 1024; // 200KB in bytes
			let quality = 0.9; // Start with high quality
			let compressedBase64 = canvas.toDataURL("image/jpeg", quality);
			let attempts = 0;
			const maxAttempts = 5;

			if (onProgress) onProgress(70);

			// Iteratively reduce quality if file is still too large
			while (compressedBase64.length > targetSize && quality > 0.7 && attempts < maxAttempts) {
				quality -= 0.05; // Reduce quality by 5%
				compressedBase64 = canvas.toDataURL("image/jpeg", quality);
				attempts++;

				if (onProgress) {
					const progress = 70 + (attempts / maxAttempts) * 20;
					onProgress(Math.round(progress));
				}
			}

			// Log final size for debugging
			const finalSize = Math.round((compressedBase64.length * 3) / 4);
			console.log(`Compressed image: ${(finalSize / 1024).toFixed(2)}KB at ${(quality * 100).toFixed(0)}% quality`);

			if (onProgress) onProgress(100);

			resolve(compressedBase64);
		};

		img.onerror = (error) => {
			reject(new Error("Failed to load image for compression"));
		};

		img.src = base64;
	});
}
