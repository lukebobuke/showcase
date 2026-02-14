/** @format */

import { themes } from "../config/themes";

export default function ThemeSelector({ currentTheme, onThemeChange }) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-3">Page Theme</label>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{Object.entries(themes).map(([themeId, theme]) => {
					const isSelected = currentTheme === themeId;

					return (
						<div
							key={themeId}
							onClick={() => onThemeChange(themeId)}
							className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg transition-all ${
								isSelected ? "border-blue-600" : "border-gray-300"
							}`}
							style={{
								backgroundColor: theme.colors.background,
							}}>
							<div className="font-medium mb-2" style={{ color: theme.colors.text }}>
								{theme.name}
							</div>
							<div className="flex gap-2">
								<div className="w-6 h-6 rounded-full border" style={{ backgroundColor: theme.colors.widget }} title="Widget" />
								<div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }} title="Accent" />
								<div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.text }} title="Text" />
							</div>
							{isSelected && (
								<div className="mt-2 text-sm" style={{ color: theme.colors.text }}>
									✓ Selected
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
