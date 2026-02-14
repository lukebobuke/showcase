/** @format */

import React, { createContext, useContext, useEffect, useState } from "react";
import { getTheme } from "../config/themes";

// Create the theme context
const ThemeContext = createContext();

/**
 * ThemeProvider component
 * Wraps the app and provides theme management capabilities
 * Gets theme from page data and applies CSS variables to document root
 */
export const ThemeProvider = ({ children, themeName = "ocean-light" }) => {
	const [currentTheme, setCurrentTheme] = useState(themeName);
	const [themeColors, setThemeColors] = useState(getTheme(themeName).colors);

	/**
	 * Apply theme by setting CSS variables on document root
	 * @param {string} themeName - The name of the theme to apply
	 */
	const applyTheme = (themeName) => {
		const theme = getTheme(themeName);
		const { colors, type } = theme;

		// Set CSS variables on :root
		document.documentElement.style.setProperty("--color-bg", colors.background);
		document.documentElement.style.setProperty("--color-widget", colors.widget);
		document.documentElement.style.setProperty("--color-text", colors.text);
		document.documentElement.style.setProperty("--color-accent", colors.accent);
		document.documentElement.style.setProperty("--color-border", colors.border);
		document.documentElement.style.setProperty("--color-text-secondary", colors.textSecondary);

		// Set theme type on body for conditional styling
		document.body.setAttribute("data-theme-type", type);

		// Update state
		setCurrentTheme(themeName);
		setThemeColors(colors);
	};

	// Apply theme when themeName prop changes
	useEffect(() => {
		applyTheme(themeName);
	}, [themeName]);

	const value = {
		currentTheme,
		themeColors,
		applyTheme,
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use theme context
 * @returns {object} Theme context value with currentTheme, themeColors, and applyTheme
 */
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
