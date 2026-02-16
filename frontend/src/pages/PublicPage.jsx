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

	// Set dynamic meta title for SEO
	useEffect(() => {
		if (user && page) {
			document.title = `${user.username} | Musician Landing Page`;
		}

		// Cleanup: reset to default title when leaving page
		return () => {
			document.title = "Musician Landing Pages";
		};
	}, [user, page]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading page...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="text-6xl mb-4">404</div>
					<h1 className="text-2xl font-bold mb-2">Page not found</h1>
					<p className="text-gray-600">The page you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="theme-scope max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-4">{user?.username}</h1>
			<WidgetList
				widgets={page.widgets || []}
				editMode={false}
				borderRadiusEnabled={page.borderRadiusEnabled ?? true}
				borderEnabled={page.borderEnabled ?? true}
				borderThickness={page.borderThickness ?? 1}
				marginsEnabled={page.marginsEnabled ?? true}
				verticalSpacingEnabled={page.verticalSpacingEnabled ?? true}
				fullBleedEnabled={page.fullBleedEnabled ?? true}
			/>
		</div>
	);
}
