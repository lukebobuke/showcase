/** @format */

// Theme configuration with 5 preset color palettes

export const themes = {
	"ocean-light": {
		name: "Ocean Light",
		type: "light",
		colors: {
			background: "#e0f2fe", // light blue
			widget: "#ffffff", // white
			text: "#0c4a6e", // dark blue
			accent: "#0ea5e9", // bright blue
			border: "#bae6fd", // light blue border
			textSecondary: "#64748b", // muted gray for placeholders
		},
	},
	"sunset-light": {
		name: "Sunset Light",
		type: "light",
		colors: {
			background: "#fef3c7", // cream
			widget: "#ffffff",
			text: "#78350f", // brown
			accent: "#f59e0b", // orange
			border: "#fde68a",
			textSecondary: "#92400e", // muted brown for placeholders
		},
	},
	"forest-light": {
		name: "Forest Light",
		type: "light",
		colors: {
			background: "#d1fae5", // mint
			widget: "#ffffff",
			text: "#065f46", // dark green
			accent: "#10b981", // green
			border: "#a7f3d0",
			textSecondary: "#047857", // muted green for placeholders
		},
	},
	"midnight-dark": {
		name: "Midnight Dark",
		type: "dark",
		colors: {
			background: "#1e293b", // dark blue-gray
			widget: "#334155", // medium gray
			text: "#f1f5f9", // light gray
			accent: "#818cf8", // purple
			border: "#475569",
			textSecondary: "#94a3b8", // lighter gray for placeholders
		},
	},
	"noir-dark": {
		name: "Noir Dark",
		type: "dark",
		colors: {
			background: "#0f172a", // almost black
			widget: "#1e293b", // dark gray
			text: "#e2e8f0", // off-white
			accent: "#60a5fa", // blue
			border: "#334155",
			textSecondary: "#cbd5e1", // lighter off-white for placeholders
		},
	},
};

/**
 * Get a theme by name, or return the default theme if not found
 * @param {string} themeName - The name of the theme to retrieve
 * @returns {object} The theme object
 */
export const getTheme = (themeName) => {
	return themes[themeName] || themes["ocean-light"];
};

/**
 * Get a list of all available themes for display in theme selector
 * @returns {array} Array of theme objects with id, name, type, and colors
 */
export const getThemeList = () => {
	return Object.entries(themes).map(([id, theme]) => ({
		id,
		name: theme.name,
		type: theme.type,
		colors: theme.colors,
	}));
};
