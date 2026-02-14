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
					className="w-full p-2 rounded min-h-32 text-base leading-relaxed"
					style={{
						borderColor: "var(--color-border)",
						color: "var(--color-text)",
						border: "1px solid",
					}}
				/>
			</div>
		);
	}

	// View mode - show content
	if (!content) {
		return (
			<div className="italic text-center py-8" style={{ color: "var(--color-text-secondary)" }}>
				Click "Edit" to add text to your page
			</div>
		);
	}

	return (
		<p className="text-base leading-relaxed" style={{ color: "var(--color-text)" }}>
			{content}
		</p>
	);
}
