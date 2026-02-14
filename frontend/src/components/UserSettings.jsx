/** @format */

import { useEffect, useRef, useState } from "react";
import { themes } from "../config/themes";

export default function UserSettings({
	currentTheme,
	onThemeChange,
	marginsEnabled,
	onToggleMargins,
	borderRadiusEnabled,
	onToggleBorderRadius,
	borderEnabled,
	onToggleBorder,
	borderThickness,
	onBorderThicknessChange,
	verticalSpacingEnabled,
	onToggleVerticalSpacing,
	fullBleedEnabled,
	onToggleFullBleed,
}) {
	const [themeMenuOpen, setThemeMenuOpen] = useState(false);
	const selectedTheme = themes[currentTheme] || themes["ocean-light"];
	const menuRef = useRef(null);

	const handleThemeSelect = (themeId) => {
		onThemeChange(themeId);
		setThemeMenuOpen(false);
	};

	useEffect(() => {
		if (!themeMenuOpen) return;

		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setThemeMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [themeMenuOpen]);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Theme</span>
				<div className="relative" ref={menuRef}>
					<button
						type="button"
						onClick={() => setThemeMenuOpen((prev) => !prev)}
						className="plain-button rounded px-3 py-1 flex items-center gap-2 min-w-40 justify-between">
						<span className="text-sm">{selectedTheme.name}</span>
						<div className="flex gap-1">
							<div className="w-3 h-3 rounded-full border" style={{ backgroundColor: selectedTheme.colors.widget }} />
							<div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.accent }} />
							<div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.colors.text }} />
						</div>
					</button>

					{themeMenuOpen && (
						<div className="absolute right-0 mt-2 w-56 bg-white border rounded z-10">
							{Object.entries(themes).map(([themeId, theme]) => (
								<button
									key={themeId}
									type="button"
									onClick={() => handleThemeSelect(themeId)}
									className="plain-button w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50">
									<span className="text-sm">{theme.name}</span>
									<div className="flex gap-1">
										<div className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.colors.widget }} />
										<div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
										<div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.text }} />
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Padding</span>
				<input type="checkbox" checked={marginsEnabled} onChange={onToggleMargins} />
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Border radius</span>
				<input type="checkbox" checked={borderRadiusEnabled} onChange={onToggleBorderRadius} />
			</div>

			<div className={`flex items-center justify-between ${marginsEnabled ? "" : "opacity-50"}`}>
				<span className="text-sm font-medium">Border</span>
				<input type="checkbox" checked={borderEnabled} onChange={onToggleBorder} disabled={!marginsEnabled} />
			</div>

			<div className={`flex items-center justify-between ${borderEnabled && marginsEnabled ? "" : "opacity-50"}`}>
				<span className="text-sm font-medium">Border thickness</span>
				<div className="flex items-center gap-2">
					<input
						type="range"
						min="1"
						max="6"
						value={borderThickness}
						onChange={(e) => onBorderThicknessChange(Number(e.target.value))}
						disabled={!borderEnabled || !marginsEnabled}
						className="w-28"
					/>
					<span className="text-xs w-6 text-right">{borderThickness}</span>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Vertical spacing</span>
				<input type="checkbox" checked={verticalSpacingEnabled} onChange={onToggleVerticalSpacing} />
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Margins</span>
				<input type="checkbox" checked={fullBleedEnabled} onChange={onToggleFullBleed} />
			</div>
		</div>
	);
}
