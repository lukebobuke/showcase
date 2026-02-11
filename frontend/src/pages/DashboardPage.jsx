/** @format */

import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePage } from "../context/PageContext";
import WidgetList from "../components/WidgetList";
import ThemeSelector from "../components/ThemeSelector";
import AddWidgetModal from "../components/AddWidgetModal";

export default function DashboardPage() {
	const { user, token, logout } = useAuth();
	const { page, editMode, loading, loadMyPage, updateTheme, toggleEditMode, addWidget, removeWidget, reorderPageWidgets } = usePage();
	const navigate = useNavigate();
	const [showAddModal, setShowAddModal] = useState(false);
	const [operationLoading, setOperationLoading] = useState(false);

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

	const handleAddWidget = async (widgetType) => {
		setOperationLoading(true);
		try {
			await addWidget(token, widgetType);
			setShowAddModal(false);
			alert("Widget added!");
		} catch (error) {
			console.error("Error adding widget:", error);
			alert("Failed to add widget. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	const handleDeleteWidget = async (widgetId) => {
		setOperationLoading(true);
		try {
			await removeWidget(token, widgetId);
			alert("Widget deleted!");
		} catch (error) {
			console.error("Error deleting widget:", error);
			alert("Failed to delete widget. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	const handleMoveUp = async (index) => {
		if (index === 0) return; // Can't move up if already first

		setOperationLoading(true);
		try {
			const newWidgets = [...page.widgets];
			[newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]];
			const widgetIds = newWidgets.map((w) => w.id);
			await reorderPageWidgets(token, widgetIds);
			console.log("Widget reordered successfully");
		} catch (error) {
			console.error("Error reordering widgets:", error);
			alert("Failed to reorder widgets. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	const handleMoveDown = async (index) => {
		if (index === page.widgets.length - 1) return; // Can't move down if already last

		setOperationLoading(true);
		try {
			const newWidgets = [...page.widgets];
			[newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
			const widgetIds = newWidgets.map((w) => w.id);
			await reorderPageWidgets(token, widgetIds);
			console.log("Widget reordered successfully");
		} catch (error) {
			console.error("Error reordering widgets:", error);
			alert("Failed to reorder widgets. Please try again.");
		} finally {
			setOperationLoading(false);
		}
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
				<span className="ml-4 text-gray-600">
					{page?.widgets?.length || 0} widget{page?.widgets?.length === 1 ? "" : "s"}
				</span>
			</div>

			<div className="mb-4">
				<Link to={`/${user?.username}`} className="text-blue-600 hover:underline">
					View your page
				</Link>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Your Widgets</h2>
				{operationLoading && <p className="text-blue-600 mb-2">Processing...</p>}
				<WidgetList
					widgets={page?.widgets || []}
					editMode={editMode}
					onDelete={handleDeleteWidget}
					onMoveUp={handleMoveUp}
					onMoveDown={handleMoveDown}
					disabled={operationLoading}
				/>
				{editMode && (
					<button
						onClick={() => setShowAddModal(true)}
						disabled={operationLoading}
						className={`px-4 py-2 rounded mt-4 ${
							operationLoading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
						}`}>
						{operationLoading ? "Processing..." : "Add Widget"}
					</button>
				)}
			</div>

			<AddWidgetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddWidget} />

			<button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
				Logout
			</button>
		</div>
	);
}
