/** @format */

import { createContext, useContext, useState } from "react";
import { getMyPage, updatePage } from "../services/api";

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

	const value = {
		page,
		editMode,
		loading,
		loadMyPage,
		updateTheme,
		toggleEditMode,
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
