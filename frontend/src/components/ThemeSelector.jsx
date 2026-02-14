/** @format */

import { themes } from "../config/themes";

export default function ThemeSelector({ currentTheme, onThemeChange }) {
	return (
		<div>
			<div className="flex flex-col gap-3">
				{Object.entries(themes).map(([themeId, theme]) => {
					const isSelected = currentTheme === themeId;

					return (
						<div
							key={themeId}
							onClick={() => onThemeChange(themeId)}
							className="p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between"
							style={{
								backgroundColor: theme.colors.background,
								borderColor: isSelected ? theme.colors.accent : "#d1d5db",
							}}>
							<div className="flex items-center gap-2">
								<div className="font-medium" style={{ color: theme.colors.text }}>
									{theme.name}
								</div>
								{isSelected && (
									<div className="text-sm" style={{ color: theme.colors.text }}>
										✓
									</div>
								)}
							</div>
							<div className="flex gap-2">
								<div className="w-6 h-6 rounded-full border" style={{ backgroundColor: theme.colors.widget }} title="Widget" />
								<div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }} title="Accent" />
								<div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.text }} title="Text" />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
