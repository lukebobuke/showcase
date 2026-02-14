/** @format */

import WidgetContainer from "./WidgetContainer";

export default function WidgetList({
	widgets,
	editMode,
	onDelete,
	onMoveUp,
	onMoveDown,
	onUpdateWidget,
	disabled,
	newlyCreatedWidgetId,
	onClearNewlyCreated,
	borderRadiusEnabled = true,
	borderEnabled = true,
	borderThickness = 1,
	marginsEnabled = true,
	verticalSpacingEnabled = true,
	fullBleedEnabled = true,
}) {
	const containerClassName = fullBleedEnabled ? "" : "-mx-8 w-[calc(100%+4rem)]";
	// Empty state
	if (!widgets || widgets.length === 0) {
		return (
			<div className={containerClassName}>
				<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
					<div className="text-gray-600 font-medium mb-1">No widgets on your page</div>
					{editMode ?
						<div className="text-sm text-gray-500">Click 'Add Widget' below to start building your page</div>
					:	<div className="text-sm text-gray-500">Enter Edit Mode to add content to your page</div>}
				</div>
			</div>
		);
	}

	// Render widgets
	return (
		<div className={containerClassName}>
			{widgets.map((widget, index) => {
				const isFirst = index === 0;
				const isLast = index === widgets.length - 1;

				return (
					<WidgetContainer
						key={widget.id}
						widget={widget}
						editMode={editMode}
						onDelete={onDelete}
						onMoveUp={!isFirst ? () => onMoveUp(index) : undefined}
						onMoveDown={!isLast ? () => onMoveDown(index) : undefined}
						onUpdateWidget={onUpdateWidget}
						isFirst={isFirst}
						isLast={isLast}
						disabled={disabled}
						autoOpenEditor={widget.id === newlyCreatedWidgetId}
						onEditorOpened={onClearNewlyCreated}
						borderRadiusEnabled={borderRadiusEnabled}
						borderEnabled={borderEnabled}
						borderThickness={borderThickness}
						marginsEnabled={marginsEnabled}
						verticalSpacingEnabled={verticalSpacingEnabled}
					/>
				);
			})}
		</div>
	);
}
