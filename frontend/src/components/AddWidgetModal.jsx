/** @format */

export default function AddWidgetModal({ isOpen, onClose, onAdd }) {
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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
			<div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
							className="w-full text-left p-4 border rounded mb-2 hover:bg-blue-50 transition-colors">
							<div className="font-semibold text-gray-900">{widget.label}</div>
							<div className="text-sm text-gray-600">{widget.description}</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
