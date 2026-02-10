/** @format */

import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePage } from "../context/PageContext";
import WidgetList from "../components/WidgetList";
import ThemeSelector from "../components/ThemeSelector";

export default function DashboardPage() {
	const { user, token, logout } = useAuth();
	const { page, editMode, loading, loadMyPage, updateTheme, toggleEditMode } = usePage();
	const navigate = useNavigate();

	useEffect(() => {
		if (token) {
			loadMyPage(token);
		}
	}, [token]);

	const handleThemeChange = async (newTheme) => {
		try {
			await updateTheme(token, newTheme);
			await loadMyPage(token);
		} catch (error) {
			console.error("Error changing theme:", error);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	if (loading) {
		return (
			<div>
				<p>Loading page data...</p>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>
			<p className="mb-4">Email: {user?.email}</p>

			<div className="mb-4">
				<p className="text-gray-700">
					Current theme: <span className="font-semibold">{page?.theme || "Not set"}</span>
				</p>
			</div>

			{editMode && (
				<div className="mb-4">
					<ThemeSelector currentTheme={page?.theme || "ocean-light"} onThemeChange={handleThemeChange} />
				</div>
			)}

			<div className="mb-4">
				<button
					onClick={toggleEditMode}
					className={`px-4 py-2 rounded ${
						editMode ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-blue-600 text-white hover:bg-blue-700"
					}`}>
					{editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
				</button>
			</div>

			<div className="mb-4">
				<Link to={`/${user?.username}`} className="text-blue-600 hover:underline">
					View your page
				</Link>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Your Widgets</h2>
				<WidgetList widgets={page?.widgets || []} editMode={editMode} />
				{editMode && (
					<button
						onClick={() => alert("Widget creation coming next week!")}
						className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">
						Add Widget
					</button>
				)}
			</div>

			<button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
				Logout
			</button>
		</div>
	);
}
