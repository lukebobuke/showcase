/** @format */

import { useEffect } from "react";
/**
 * Modal for selecting and adding a new widget to the page
 * Displays available widget types with descriptions
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed
 * @param {function} onSelectType - Callback when widget type is selected
 */ export default function AddWidgetModal({ isOpen, onClose, onAdd }) {
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

	if (!isOpen) return null;

	const widgetTypes = [
		{
			type: "text",
			label: "Text Widget",
			description: "Add text content to your page",
		},
		{
			type: "links",
			label: "Links Widget",
			description: "Add links to social media and websites",
		},
		{
			type: "photos",
			label: "Photo Album",
			description: "Add a gallery of images",
		},
		{
			type: "youtube",
			label: "YouTube Video",
			description: "Embed a YouTube video",
		},
		{
			type: "tour_dates",
			label: "Tour Dates",
			description: "Show upcoming tour dates on a map",
		},
	];

	const handleWidgetClick = (widgetType) => {
		onAdd(widgetType);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
			<div className="bg-white rounded-lg p-6 max-w-md w-full animate-modalSlideIn" onClick={(e) => e.stopPropagation()}>
				{/* Header with title and close button */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Add Widget</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" aria-label="Close modal">
						×
					</button>
				</div>

				{/* Widget type buttons */}
				<div>
					{widgetTypes.map((widget) => (
						<button
							key={widget.type}
							onClick={() => handleWidgetClick(widget.type)}
							className="w-full text-left p-4 border rounded mb-2 hover:bg-blue-50 transition-all hover:scale-105">
							<div className="font-semibold text-gray-900">{widget.label}</div>
							<div className="text-sm text-gray-600">{widget.description}</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
