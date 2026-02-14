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
			error: "Image too large. Max 2MB per image.",
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
			// Calculate approximate original size for optimization logic
			const originalSize = Math.round((base64.length * 3) / 4);

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

			// Target max file size: 200KB (conservative target)
			const targetSize = 200 * 1024; // 200KB in bytes
			const strictTarget = 190 * 1024; // 190KB for safety margin

			let quality = 0.8; // Start with 80% quality as specified
			let compressedBase64 = canvas.toDataURL("image/jpeg", quality);
			let currentSize = Math.round((compressedBase64.length * 3) / 4);
			let attempts = 0;
			const maxAttempts = 10; // More attempts to reach target

			if (onProgress) onProgress(70);

			// Iteratively reduce quality if file is still too large
			while (currentSize > strictTarget && quality > 0.5 && attempts < maxAttempts) {
				// Aggressive quality reduction if file is much larger than target
				if (currentSize > targetSize * 2) {
					quality -= 0.1; // Reduce by 10% if much too large
				} else if (currentSize > targetSize * 1.5) {
					quality -= 0.05; // Reduce by 5% if moderately too large
				} else {
					quality -= 0.02; // Fine-tune if close to target
				}

				// Don't go below minimum quality
				quality = Math.max(0.5, quality);

				compressedBase64 = canvas.toDataURL("image/jpeg", quality);
				currentSize = Math.round((compressedBase64.length * 3) / 4);
				attempts++;

				if (onProgress) {
					const progress = 70 + (attempts / maxAttempts) * 20;
					onProgress(Math.round(progress));
				}
			}

			// If still too large, try more aggressive resize (fallback)
			if (currentSize > targetSize && width > 600) {
				const scaleFactor = 0.8;
				canvas.width = Math.floor(width * scaleFactor);
				canvas.height = Math.floor(height * scaleFactor);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				compressedBase64 = canvas.toDataURL("image/jpeg", quality);
				currentSize = Math.round((compressedBase64.length * 3) / 4);
			}

			// TODO: Add user notification if compression fails to reach target size

			if (onProgress) onProgress(100);

			resolve(compressedBase64);
		};

		img.onerror = (error) => {
			reject(new Error("Failed to load image for compression"));
		};

		img.src = base64;
	});
}
