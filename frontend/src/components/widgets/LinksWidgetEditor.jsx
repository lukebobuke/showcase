/** @format */

import { useState, useEffect } from "react";

export default function LinksWidgetEditor({ isOpen, initialLinks, onSave, onClose }) {
	const [links, setLinks] = useState([]);
	const [error, setError] = useState("");

	// Initialize links when modal opens or initialLinks changes
	useEffect(() => {
		if (isOpen) {
			setLinks(initialLinks && initialLinks.length > 0 ? [...initialLinks] : []);
			setError("");
		}
	}, [isOpen, initialLinks]);

	const addLink = () => {
		setLinks([...links, { label: "", url: "" }]);
		setError("");
	};

	const removeLink = (index) => {
		const newLinks = links.filter((_, i) => i !== index);
		setLinks(newLinks);
		setError("");
	};

	const updateLink = (index, field, value) => {
		const newLinks = [...links];
		newLinks[index][field] = value;
		setLinks(newLinks);
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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<h2 className="text-2xl font-bold mb-4">Edit Links</h2>

				{/* Error message */}
				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				{/* List of current links */}
				<div className="mb-4">
					{links.length === 0 ?
						<p className="text-gray-500 italic mb-4">No links yet. Click "Add Link" to get started.</p>
					:	links.map((link, index) => {
							const isLabelEmpty = link.label.trim() === "";
							const isUrlEmpty = link.url.trim() === "";

							return (
								<div key={index} className="flex gap-2 mb-2">
									<input
										type="text"
										placeholder="Label (e.g., Spotify)"
										value={link.label}
										onChange={(e) => updateLink(index, "label", e.target.value)}
										className={`flex-1 p-2 border rounded ${isLabelEmpty ? "border-red-400" : ""}`}
									/>
									<input
										type="text"
										placeholder="URL (e.g., https://spotify.com)"
										value={link.url}
										onChange={(e) => updateLink(index, "url", e.target.value)}
										className={`flex-1 p-2 border rounded ${isUrlEmpty ? "border-red-400" : ""}`}
									/>
									<button onClick={() => removeLink(index)} className="bg-red-600 text-white px-2 rounded hover:bg-red-700">
										X
									</button>
								</div>
							);
						})
					}
				</div>

				{/* Add Link button */}
				<button onClick={addLink} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
					Add Link
				</button>

				{/* Cancel and Save buttons */}
				<div className="flex justify-end gap-2">
					<button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={!hasValidLinks()}
						className={`px-4 py-2 rounded ${
							hasValidLinks() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
