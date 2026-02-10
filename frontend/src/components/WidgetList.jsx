/** @format */

import WidgetContainer from "./WidgetContainer";

export default function WidgetList({ widgets, editMode }) {
	// Empty state
	if (!widgets || widgets.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				<p className="text-lg font-semibold mb-2">No widgets yet</p>
				{editMode ?
					<p className="text-sm">Click 'Add Widget' to get started</p>
				:	<p className="text-sm">This page is empty</p>}
			</div>
		);
	}

	// Render widgets
	return (
		<div>
			{widgets.map((widget, index) => (
				<WidgetContainer
					key={widget.id}
					widget={widget}
					editMode={editMode}
					onDelete={() => {}}
					onMoveUp={index > 0 ? () => {} : undefined}
					onMoveDown={index < widgets.length - 1 ? () => {} : undefined}
				/>
			))}
		</div>
	);
}
