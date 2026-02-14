/** @format */

/**
 * Theme configuration with 5 preset color palettes
 * Each theme provides colors for background, text, widgets, and accents
 */

export const themes = {
	// ===== LIGHT THEMES =====
	"ocean-light": {
		name: "Light Ocean",
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
		name: "Light Sunset",
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
	"bubblegum-light": {
		name: "Light Bubblegum",
		type: "light",
		colors: {
			background: "#fce7f3", // cotton candy pink
			widget: "#fffbeb", // light cream
			text: "#db2777", // hot pink
			accent: "#ec4899", // bright pink
			border: "#fbcfe8",
			textSecondary: "#f472b6", // soft pink
		},
	},
	"lavender-light": {
		name: "Light Lavender",
		type: "light",
		colors: {
			background: "#f3e8ff", // lavender
			widget: "#ffffff",
			text: "#581c87", // deep purple
			accent: "#a855f7", // purple
			border: "#e9d5ff",
			textSecondary: "#7c3aed", // muted purple
		},
	},
	"rose-light": {
		name: "Light Rose",
		type: "light",
		colors: {
			background: "#ffe4e6", // rose
			widget: "#ffffff",
			text: "#881337", // dark rose
			accent: "#f43f5e", // rose red
			border: "#fecdd3",
			textSecondary: "#9f1239", // muted rose
		},
	},

	// ===== DARK THEMES =====
	"midnight-dark": {
		name: "Dark Midnight",
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
		name: "Dark Noir",
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
	"crimson-dark": {
		name: "Dark Crimson",
		type: "dark",
		colors: {
			background: "#1a0a0f", // very dark red
			widget: "#3f1c28", // dark burgundy
			text: "#fecdd3", // light pink
			accent: "#f43f5e", // bright red
			border: "#5c1f2e",
			textSecondary: "#fda4af", // soft pink
		},
	},
	"emerald-dark": {
		name: "Dark Emerald",
		type: "dark",
		colors: {
			background: "#042f2e", // very dark teal
			widget: "#134e4a", // dark green
			text: "#d1fae5", // light mint
			accent: "#10b981", // emerald green
			border: "#1e5e5a",
			textSecondary: "#a7f3d0", // soft mint
		},
	},
	"purple-haze": {
		name: "Dark Purple Haze",
		type: "dark",
		colors: {
			background: "#1e1029", // deep purple-black
			widget: "#3a2357", // dark purple
			text: "#f3e8ff", // light lavender
			accent: "#d946ef", // fuchsia
			border: "#4c2f70",
			textSecondary: "#e9d5ff", // soft lavender
		},
	},
	"amber-dark": {
		name: "Dark Amber",
		type: "dark",
		colors: {
			background: "#1c1103", // very dark brown
			widget: "#3f2b0f", // dark amber
			text: "#fef3c7", // light cream
			accent: "#fb923c", // bright orange
			border: "#5c3d14",
			textSecondary: "#fde68a", // soft yellow
		},
	},
	cyberpunk: {
		name: "Dark Cyberpunk",
		type: "dark",
		colors: {
			background: "#0a0e27", // deep blue-black
			widget: "#1a1f3a", // dark navy
			text: "#00ffff", // cyan
			accent: "#ff00ff", // magenta
			border: "#2d3561",
			textSecondary: "#7dd3fc", // soft cyan
		},
	},
	"deep-ocean": {
		name: "Dark Deep Ocean",
		type: "dark",
		colors: {
			background: "#051d2e", // deep ocean blue
			widget: "#0c3c5c", // darker teal
			text: "#cffafe", // light cyan
			accent: "#06b6d4", // bright cyan
			border: "#155e75",
			textSecondary: "#a5f3fc", // soft cyan
		},
	},
	"mocha-dark": {
		name: "Dark Mocha",
		type: "dark",
		colors: {
			background: "#1a120b", // dark coffee
			widget: "#3e2723", // brown
			text: "#efebe9", // cream
			accent: "#d4a574", // caramel
			border: "#5d4037",
			textSecondary: "#d7ccc8", // light tan
		},
	},
	"vaporwave-dark": {
		name: "Dark Vaporwave",
		type: "dark",
		colors: {
			background: "#1a0033", // deep purple
			widget: "#2d0066", // dark purple
			text: "#ff71ce", // hot pink
			accent: "#01cdfe", // electric blue
			border: "#4a0099",
			textSecondary: "#b967ff", // soft purple
		},
	},
	"neon-nights": {
		name: "Dark Neon Nights",
		type: "dark",
		colors: {
			background: "#0d0221", // deep purple-black
			widget: "#1b0a33", // dark purple
			text: "#f0e7ff", // light purple-white
			accent: "#00ff9f", // neon green
			border: "#2f1e4a",
			textSecondary: "#c4b5fd", // soft purple
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
