/** @format */

export default function WidgetContainer({ widget, editMode, onDelete, onMoveUp, onMoveDown, isFirst, isLast, disabled }) {
	const handleDelete = () => {
		if (window.confirm("Delete this widget?")) {
			onDelete(widget.id);
		}
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow mb-4 relative">
			{/* Widget type badge */}
			<span className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded text-sm">{widget.widgetType}</span>

			{/* Widget content area */}
			<div className="mt-6">
				<p className="text-gray-600">Widget content: {widget.widgetType}</p>
			</div>

			{/* Edit mode controls */}
			{editMode && (
				<div className="flex gap-2 mt-4">
					{/* Move up button - hidden if isFirst */}
					{!isFirst && onMoveUp && (
						<button
							onClick={onMoveUp}
							disabled={disabled}
							className={`px-2 py-1 text-white text-xs rounded ${
								disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
							}`}
							title="Move up">
							↑
						</button>
					)}

					{/* Move down button - hidden if isLast */}
					{!isLast && onMoveDown && (
						<button
							onClick={onMoveDown}
							disabled={disabled}
							className={`px-2 py-1 text-white text-xs rounded ${
								disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
							}`}
							title="Move down">
							↓
						</button>
					)}

					{/* Edit button */}
					<button
						disabled={disabled}
						className={`px-2 py-1 text-white text-xs rounded ${
							disabled ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"
						}`}
						title="Edit">
						Edit
					</button>

					{/* Delete button */}
					{onDelete && (
						<button
							onClick={handleDelete}
							disabled={disabled}
							className={`px-2 py-1 text-white text-xs rounded ${
								disabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
							}`}
							title="Delete">
							✕
						</button>
					)}
				</div>
			)}
		</div>
	);
}
