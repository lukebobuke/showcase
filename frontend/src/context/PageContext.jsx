/** @format */

import { createContext, useContext, useState } from "react";
import { getMyPage, updatePage, createWidget, updateWidget, deleteWidget, reorderWidgets } from "../services/api";

const PageContext = createContext();

export function PageProvider({ children }) {
	const [page, setPage] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadMyPage = async (token) => {
		try {
			setLoading(true);
			const data = await getMyPage(token);
			setPage(data.page);
		} catch (error) {
			console.error("Error loading page:", error);
			setPage(null);
		} finally {
			setLoading(false);
		}
	};

	const updateTheme = async (token, theme) => {
		try {
			setLoading(true);
			const data = await updatePage(token, theme, page?.headerImage);
			setPage(data.page);
		} catch (error) {
			console.error("Error updating theme:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const toggleEditMode = () => {
		setEditMode((prev) => !prev);
	};

	const addWidget = async (token, widgetType) => {
		try {
			const widget = await createWidget(token, widgetType, {});
			await loadMyPage(token);
			return widget;
		} catch (error) {
			console.error("Error adding widget:", error);
			throw error;
		}
	};

	const removeWidget = async (token, widgetId) => {
		try {
			await deleteWidget(token, widgetId);
			await loadMyPage(token);
		} catch (error) {
			console.error("Error removing widget:", error);
			throw error;
		}
	};

	const updateWidgetData = async (token, widgetId, widgetData) => {
		try {
			await updateWidget(token, widgetId, widgetData);
			await loadMyPage(token);
		} catch (error) {
			console.error("Error updating widget:", error);
			throw error;
		}
	};

	const reorderPageWidgets = async (token, widgetIds) => {
		try {
			await reorderWidgets(token, widgetIds);
			await loadMyPage(token);
		} catch (error) {
			console.error("Error reordering widgets:", error);
			throw error;
		}
	};

	const value = {
		page,
		editMode,
		loading,
		loadMyPage,
		updateTheme,
		toggleEditMode,
		addWidget,
		removeWidget,
		updateWidgetData,
		reorderPageWidgets,
	};

	return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
	const context = useContext(PageContext);
	if (!context) {
		throw new Error("usePage must be used within a PageProvider");
	}
	return context;
}
