/** @format */

import { useState, useEffect } from "react";

export default function LinksWidgetEditor({ isOpen, initialLinks, onSave, onClose, isSaving }) {
	const [links, setLinks] = useState([]);
	const [error, setError] = useState("");
	const [fieldErrors, setFieldErrors] = useState([]);

	// Initialize links when modal opens or initialLinks changes
	useEffect(() => {
		if (isOpen) {
			setLinks(initialLinks && initialLinks.length > 0 ? [...initialLinks] : []);
			setError("");
			setFieldErrors([]);
		}
	}, [isOpen, initialLinks]);

	// ESC key to close modal
	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEsc);
			return () => document.removeEventListener("keydown", handleEsc);
		}
	}, [isOpen, onClose]);

	const addLink = () => {
		setLinks([...links, { label: "", url: "" }]);
		setError("");
		setFieldErrors([...fieldErrors, { label: null, url: null }]);
	};

	const removeLink = (index) => {
		const newLinks = links.filter((_, i) => i !== index);
		setLinks(newLinks);
		const newErrors = fieldErrors.filter((_, i) => i !== index);
		setFieldErrors(newErrors);
		setError("");
	};

	const updateLink = (index, field, value) => {
		const newLinks = [...links];
		newLinks[index][field] = value;
		setLinks(newLinks);

		// Clear field error when typing
		if (fieldErrors[index]) {
			const newErrors = [...fieldErrors];
			newErrors[index] = { ...newErrors[index], [field]: null };
			setFieldErrors(newErrors);
		}
		setError("");
	};

	// Validate URL and prepend https:// if needed
	const normalizeUrl = (url) => {
		const trimmed = url.trim();
		if (trimmed && !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
			return `https://${trimmed}`;
		}
		return trimmed;
	};

	// Validate URL format
	const isValidUrl = (url) => {
		if (!url.trim()) return false;
		try {
			const normalized = normalizeUrl(url);
			new URL(normalized);
			return true;
		} catch {
			return false;
		}
	};

	// Validate individual link field on blur
	const handleBlur = (index, field) => {
		const link = links[index];
		const newErrors = [...fieldErrors];

		if (!newErrors[index]) {
			newErrors[index] = { label: null, url: null };
		}

		if (field === "url" && link.url.trim() !== "" && !isValidUrl(link.url)) {
			newErrors[index].url = "Please enter a valid URL";
		} else if (field === "url") {
			newErrors[index].url = null;
		}

		if (field === "label" && link.label.trim() === "" && link.url.trim() !== "") {
			newErrors[index].label = "Label is required when URL is provided";
		} else if (field === "label") {
			newErrors[index].label = null;
		}

		setFieldErrors(newErrors);
	};

	// Check if there are any valid links
	const hasValidLinks = () => {
		return links.some((link) => link.label.trim() !== "" && link.url.trim() !== "");
	};

	const handleSave = () => {
		// Filter and validate links
		const validatedLinks = links
			.filter((link) => link.label.trim() !== "" && link.url.trim() !== "")
			.map((link) => ({
				label: link.label.trim(),
				url: normalizeUrl(link.url),
			}));

		// Check if at least one valid link exists
		if (validatedLinks.length === 0) {
			setError("At least one link required. Please add a link with both label and URL.");
			return;
		}

		// Call onSave with validated links
		onSave({ links: validatedLinks });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modalSlideIn">
				<h2 className="text-2xl font-bold mb-4">Edit Links</h2>

				{/* Error message */}
				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				{/* List of current links */}
				<div className="mb-4">
					{links.length === 0 ?
						<p className="text-gray-500 italic mb-4">No links yet. Click "Add Link" to get started.</p>
					:	links.map((link, index) => {
							const safeLink = link || { label: "", url: "" };
							const isLabelEmpty = safeLink.label.trim() === "";
							const isUrlEmpty = safeLink.url.trim() === "";
							const labelError = fieldErrors[index]?.label;
							const urlError = fieldErrors[index]?.url;

							return (
								<div key={index} className="mb-3">
									<div className="flex gap-2">
										<div className="flex-1">
											<input
												type="text"
												placeholder="Label (e.g., Spotify)"
												value={safeLink.label}
												onChange={(e) => updateLink(index, "label", e.target.value)}
												onBlur={() => handleBlur(index, "label")}
												className={`w-full p-2 border rounded ${labelError ? "border-red-400" : ""}`}
											/>
											{labelError && <div className="text-red-600 text-xs mt-1">{labelError}</div>}
										</div>
										<div className="flex-1">
											<input
												type="text"
												placeholder="URL (e.g., https://spotify.com)"
												value={safeLink.url}
												onChange={(e) => updateLink(index, "url", e.target.value)}
												onBlur={() => handleBlur(index, "url")}
												className={`w-full p-2 border rounded ${urlError ? "border-red-400" : ""}`}
											/>
											{urlError && <div className="text-red-600 text-xs mt-1">{urlError}</div>}
										</div>
										<button
											onClick={() => removeLink(index)}
											className="danger bg-red-600 text-white px-2 rounded hover:bg-red-700">
											X
										</button>
									</div>
								</div>
							);
						})
					}
				</div>

				{/* Add Link button */}
				<button
					onClick={addLink}
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4 transition-transform hover:scale-105">
					Add Link
				</button>

				{/* Cancel and Save buttons */}
				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						disabled={isSaving}
						className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 transition-transform hover:scale-105 disabled:hover:scale-100">
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={!hasValidLinks() || isSaving}
						className={`px-4 py-2 rounded transition-transform ${
							hasValidLinks() && !isSaving ?
								"bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
							:	"bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}>
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}
