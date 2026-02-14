/** @format */

import React from "react";

function TextWidget({ widgetData, editMode }) {
	const content = widgetData?.content || "";

	// Edit mode - show textarea
	if (editMode) {
		return (
			<div>
				<textarea
					value={content}
					readOnly
					placeholder="No text yet"
					className="w-full p-2 rounded min-h-32 text-base leading-relaxed"
					style={{
						borderColor: "var(--color-border)",
						color: "var(--color-text)",
						border: "none",
					}}
				/>
			</div>
		);
	}

	// View mode - show content
	if (!content) {
		return (
			<div className="p-8 text-center">
				<div className="text-gray-600 font-medium mb-1">No text content</div>
				<div className="text-sm text-gray-500">Click Edit to add text to your page</div>
			</div>
		);
	}

	return (
		<p className="text-base leading-relaxed" style={{ color: "var(--color-text)" }}>
			{content}
		</p>
	);
}

// Prevent unnecessary re-renders
export default React.memo(TextWidget);
