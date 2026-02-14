/** @format */

import { useState, useEffect } from "react";
import TextWidget from "./widgets/TextWidget";
import TextWidgetEditor from "./widgets/TextWidgetEditor";
import LinksWidget from "./widgets/LinksWidget";
import LinksWidgetEditor from "./widgets/LinksWidgetEditor";
import PhotoAlbumWidget from "./widgets/PhotoAlbumWidget";
import PhotoAlbumEditor from "./widgets/PhotoAlbumEditor";
import YouTubeWidget from "./widgets/YouTubeWidget";
import YouTubeWidgetEditor from "./widgets/YoutubeWidgetEditor";
import TourDatesWidget from "./widgets/TourDatesWidget";
import TourDatesEditor from "./widgets/TourDatesEditor";

export default function WidgetContainer({
	widget,
	editMode,
	onDelete,
	onMoveUp,
	onMoveDown,
	isFirst,
	isLast,
	disabled,
	onUpdateWidget,
	autoOpenEditor,
	onEditorOpened,
}) {
	const [showEditModal, setShowEditModal] = useState(false);

	// Auto-open editor for newly created widgets
	useEffect(() => {
		if (autoOpenEditor && editMode) {
			setShowEditModal(true);
			// Notify parent that editor has been opened
			if (onEditorOpened) {
				onEditorOpened();
			}
		}
	}, [autoOpenEditor, editMode, onEditorOpened]);

	const handleDelete = () => {
		if (window.confirm("Delete this widget?")) {
			onDelete(widget.id);
		}
	};

	const handleSaveContent = (newData) => {
		onUpdateWidget(widget.id, newData);
		setShowEditModal(false);
	};

	const renderWidgetContent = () => {
		switch (widget.widgetType) {
			case "text":
				return <TextWidget widgetData={widget.widgetData} editMode={editMode} />;
			case "links":
				return <LinksWidget widgetData={widget.widgetData} />;
			case "photos":
				return <PhotoAlbumWidget widgetData={widget.widgetData} />;
			case "youtube":
				return <YouTubeWidget widgetData={widget.widgetData} />;
			case "tour_dates":
				return <TourDatesWidget widgetData={widget.widgetData} />;
			default:
				return <div>Unknown widget type</div>;
		}
	};

	return (
		<div
			className="p-4 rounded-lg shadow mb-4 relative"
			style={{
				backgroundColor: "var(--color-widget)",
				borderColor: "var(--color-border)",
				border: "1px solid",
			}}>
			{/* Widget type badge */}
			<span
				className="absolute top-2 right-2 px-2 py-1 rounded text-sm"
				style={{
					backgroundColor: "var(--color-border)",
					color: "var(--color-text)",
				}}>
				{widget.widgetType}
			</span>

			{/* Widget content area */}
			<div className="mt-6">{renderWidgetContent()}</div>

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
						onClick={() => setShowEditModal(true)}
						disabled={disabled}
						className={`px-2 py-1 text-white text-xs rounded ${
							disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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

			{/* Edit Modal - Text Widget */}
			{widget.widgetType === "text" && (
				<TextWidgetEditor
					isOpen={showEditModal}
					initialContent={widget.widgetData?.content || ""}
					onSave={(newContent) => handleSaveContent({ content: newContent })}
					onClose={() => setShowEditModal(false)}
				/>
			)}

			{/* Edit Modal - Links Widget */}
			{widget.widgetType === "links" && (
				<LinksWidgetEditor
					isOpen={showEditModal}
					initialLinks={widget.widgetData?.links || []}
					onSave={(newData) => handleSaveContent(newData)}
					onClose={() => setShowEditModal(false)}
				/>
			)}

			{/* Edit Modal - Photos Widget */}
			{widget.widgetType === "photos" && (
				<PhotoAlbumEditor
					isOpen={showEditModal}
					initialImages={widget.widgetData?.images || []}
					onSave={(newData) => handleSaveContent(newData)}
					onClose={() => setShowEditModal(false)}
				/>
			)}

			{/* Edit Modal - YouTube Widget */}
			{widget.widgetType === "youtube" && (
				<YouTubeWidgetEditor
					isOpen={showEditModal}
					initialVideoUrl={widget.widgetData?.videoUrl || ""}
					onSave={(newData) => handleSaveContent(newData)}
					onClose={() => setShowEditModal(false)}
				/>
			)}

			{/* Edit Modal - Tour Dates Widget */}
			{widget.widgetType === "tour_dates" && (
				<TourDatesEditor
					isOpen={showEditModal}
					initialDates={widget.widgetData?.dates || []}
					onSave={(newData) => handleSaveContent(newData)}
					onClose={() => setShowEditModal(false)}
				/>
			)}
		</div>
	);
}
