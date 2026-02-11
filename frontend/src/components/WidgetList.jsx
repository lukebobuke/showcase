/** @format */

import WidgetContainer from "./WidgetContainer";

export default function WidgetList({ widgets, editMode, onDelete, onMoveUp, onMoveDown, disabled }) {
	// Empty state
	if (!widgets || widgets.length === 0) {
		return (
			<div className="text-center py-12 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
				<p className="text-xl font-semibold mb-2 text-gray-700">No widgets yet</p>
				{editMode ?
					<p className="text-gray-600">Your page is empty. Click 'Add Widget' to get started!</p>
				:	<p className="text-gray-600">No content on your page yet.</p>}
			</div>
		);
	}

	// Render widgets
	return (
		<div>
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
						isFirst={isFirst}
						isLast={isLast}
						disabled={disabled}
					/>
				);
			})}
		</div>
	);
}
