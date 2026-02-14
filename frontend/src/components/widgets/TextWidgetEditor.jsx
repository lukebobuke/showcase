/** @format */

import { useState, useEffect, useRef } from "react";

export default function TextWidgetEditor({ isOpen, initialContent, onSave, onClose, isSaving }) {
	const [content, setContent] = useState(initialContent || "");
	const textareaRef = useRef(null);

	// Update content when initialContent changes
	useEffect(() => {
		setContent(initialContent || "");
	}, [initialContent]);

	// Auto-focus textarea when modal opens
	useEffect(() => {
		if (isOpen && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [isOpen]);

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

	const handleSave = () => {
		onSave(content);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
			<div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 animate-modalSlideIn" onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">Edit Text</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
						×
					</button>
				</div>

				{/* Textarea */}
				<textarea
					ref={textareaRef}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={10}
					placeholder="Enter your text content here..."
					className="w-full p-3 border-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>

				{/* Character count */}
				<p className="text-sm text-gray-600 mt-2">
					{content.length} character{content.length === 1 ? "" : "s"}
				</p>

				{/* Buttons */}
				<div className="flex justify-end gap-2 mt-4">
					<button
						onClick={onClose}
						disabled={isSaving}
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 transition-transform hover:scale-105 disabled:hover:scale-100">
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={isSaving}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-transform hover:scale-105 disabled:hover:scale-100">
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}
