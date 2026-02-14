/** @format */

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPageByUsername } from "../services/api";
import WidgetList from "../components/WidgetList";
import { useTheme } from "../context/ThemeContext";

export default function PublicPage() {
	const { username } = useParams();
	const [page, setPage] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const { applyTheme } = useTheme();

	useEffect(() => {
		const fetchPage = async () => {
			try {
				setLoading(true);
				setError(false);
				const data = await getPageByUsername(username);
				setPage(data.page);
				setUser(data.user);
			} catch (err) {
				console.error("Error fetching page:", err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchPage();
	}, [username]);

	// Apply theme when page data is loaded
	useEffect(() => {
		const theme = page?.theme || "ocean-light";
		applyTheme(theme);

		// Cleanup: reset to default theme when leaving page
		return () => {
			applyTheme("ocean-light");
		};
	}, [page, applyTheme]);

	if (loading) {
		return (
			<div className="max-w-4xl mx-auto p-8">
				<p>Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto p-8">
				<p>Page not found</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-4">{user?.username}</h1>
			<p className="text-gray-600 mb-8">Theme: {page?.theme}</p>
			<WidgetList widgets={page.widgets || []} editMode={false} />
		</div>
	);
}
