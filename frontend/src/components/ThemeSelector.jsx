/** @format */

export default function ThemeSelector({ currentTheme, onThemeChange }) {
	const handleChange = (e) => {
		onThemeChange(e.target.value);
	};

	return (
		<div>
			<label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-2">
				Select Theme
			</label>
			<select id="theme-select" value={currentTheme} onChange={handleChange} className="w-full p-2 border rounded">
				<optgroup label="Light Themes">
					<option value="ocean-light">Ocean Light</option>
					<option value="sunset-light">Sunset Light</option>
					<option value="forest-light">Forest Light</option>
				</optgroup>
				<optgroup label="Dark Themes">
					<option value="midnight-dark">Midnight Dark</option>
					<option value="noir-dark">Noir Dark</option>
				</optgroup>
			</select>
		</div>
	);
}
