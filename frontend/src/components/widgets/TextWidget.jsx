/** @format */

export default function TextWidget({ widgetData, editMode }) {
	const content = widgetData?.content || "";

	// Edit mode - show textarea
	if (editMode) {
		return (
			<div>
				<textarea
					value={content}
					readOnly
					placeholder="No text yet"
					className="w-full p-2 border rounded min-h-32 text-base leading-relaxed"
				/>
			</div>
		);
	}

	// View mode - show content
	if (!content) {
		return <div className="text-gray-400 italic text-center py-8">Click "Edit" to add text to your page</div>;
	}

	return <p className="text-base leading-relaxed">{content}</p>;
}
