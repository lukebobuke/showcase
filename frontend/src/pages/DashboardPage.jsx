/** @format */

import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePage } from "../context/PageContext";
import { useTheme } from "../context/ThemeContext";
import WidgetList from "../components/WidgetList";
import UserSettings from "../components/UserSettings";
import AddWidgetModal from "../components/AddWidgetModal";
import Toast from "../components/Toast";

export default function DashboardPage() {
	const { user, token, logout } = useAuth();
	const { page, editMode, loading, loadMyPage, updateTheme, toggleEditMode, addWidget, removeWidget, updateWidgetData, reorderPageWidgets } =
		usePage();
	const { applyTheme } = useTheme();
	const navigate = useNavigate();
	const [showAddModal, setShowAddModal] = useState(false);
	const [operationLoading, setOperationLoading] = useState(false);
	const [newlyCreatedWidgetId, setNewlyCreatedWidgetId] = useState(null);
	const [error, setError] = useState(null);
	const [toast, setToast] = useState(null);
	const [marginsEnabled, setMarginsEnabled] = useState(true);
	const [borderRadiusEnabled, setBorderRadiusEnabled] = useState(true);
	const [borderEnabled, setBorderEnabled] = useState(true);
	const [borderThickness, setBorderThickness] = useState(1);
	const [verticalSpacingEnabled, setVerticalSpacingEnabled] = useState(true);
	const [fullBleedEnabled, setFullBleedEnabled] = useState(true);

	useEffect(() => {
		if (token) {
			loadMyPage(token);
		}
	}, [token]);

	// Apply theme when page data is loaded
	useEffect(() => {
		if (page) {
			const theme = page.theme || "ocean-light";
			applyTheme(theme);
		}
	}, [page, applyTheme]);

	// Auto-dismiss error after 5 seconds
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	const showToast = (message, type = "success") => {
		setToast({ message, type });
	};

	const handleThemeChange = async (newTheme) => {
		try {
			await updateTheme(token, newTheme);
		} catch (error) {
			console.error("Error changing theme:", error);
			setError(error.message || "Failed to update theme. Please try again.");
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const handleAddWidget = async (widgetType) => {
		setOperationLoading(true);
		setError(null);
		try {
			const widget = await addWidget(token, widgetType);
			setShowAddModal(false);
			// Store the newly created widget ID to auto-open its editor
			setNewlyCreatedWidgetId(widget.widget.id);
			showToast("Widget added successfully!");
		} catch (err) {
			console.error("Error adding widget:", err);
			setError(err.message || "Failed to add widget. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	const handleDeleteWidget = async (widgetId) => {
		setOperationLoading(true);
		setError(null);
		try {
			await removeWidget(token, widgetId);
			showToast("Widget deleted successfully!");
		} catch (err) {
			console.error("Error deleting widget:", err);
			setError(err.message || "Failed to delete widget. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	// Move widget up in order (swap with previous)
	const handleMoveUp = async (index) => {
		if (index === 0) return; // Can't move up if already first

		setOperationLoading(true);
		setError(null);
		try {
			const newWidgets = [...page.widgets];
			[newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]];
			const widgetIds = newWidgets.map((w) => w.id);
			await reorderPageWidgets(token, widgetIds);
		} catch (err) {
			console.error("Error reordering widgets:", err);
			setError(err.message || "Failed to reorder widgets. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	// Move widget down in order (swap with next)
	const handleMoveDown = async (index) => {
		if (index === page.widgets.length - 1) return; // Can't move down if already last

		setOperationLoading(true);
		setError(null);
		try {
			const newWidgets = [...page.widgets];
			[newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
			const widgetIds = newWidgets.map((w) => w.id);
			await reorderPageWidgets(token, widgetIds);
		} catch (err) {
			console.error("Error reordering widgets:", err);
			setError(err.message || "Failed to reorder widgets. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	const handleUpdateWidget = async (widgetId, newData) => {
		setOperationLoading(true);
		setError(null);
		try {
			await updateWidgetData(token, widgetId, newData);
			showToast("Widget updated successfully!");
		} catch (err) {
			console.error("Error updating widget:", err);
			setError(err.message || "Failed to update widget. Please try again.");
		} finally {
			setOperationLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="theme-scope">
			{/* Error message banner */}
			{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

			{/* Band 1: Welcome */}
			<div className="mb-8 pb-6 border-b-2" style={{ borderColor: "var(--color-border)" }}>
				<h1 className="text-3xl font-bold mb-2">Welcome, {user?.username || "User"}!</h1>
				<p className="mb-4">{user?.email}</p>
				<Link to={`/${user?.username}`} className="theme-button inline-block px-4 py-2 rounded transition-transform hover:scale-105">
					View your page
				</Link>
			</div>

			{/* Band 2: Settings */}
			<div className="mb-8 pb-6 border-b-2" style={{ borderColor: "var(--color-border)" }}>
				<h2 className="text-2xl font-bold mb-4">Settings</h2>
				<UserSettings
					currentTheme={page?.theme || "ocean-light"}
					onThemeChange={handleThemeChange}
					marginsEnabled={marginsEnabled}
					onToggleMargins={() => {
						setMarginsEnabled((prev) => {
							const next = !prev;
							if (!next) {
								setBorderEnabled(false);
							}
							return next;
						});
					}}
					borderRadiusEnabled={borderRadiusEnabled}
					onToggleBorderRadius={() => setBorderRadiusEnabled((prev) => !prev)}
					borderEnabled={borderEnabled}
					onToggleBorder={() => setBorderEnabled((prev) => !prev)}
					borderThickness={borderThickness}
					onBorderThicknessChange={setBorderThickness}
					verticalSpacingEnabled={verticalSpacingEnabled}
					onToggleVerticalSpacing={() => setVerticalSpacingEnabled((prev) => !prev)}
					fullBleedEnabled={fullBleedEnabled}
					onToggleFullBleed={() => setFullBleedEnabled((prev) => !prev)}
				/>
			</div>

			{/* Band 3: Your Widgets */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Your Widgets</h2>
				<div className="mb-4">
					<button
						onClick={toggleEditMode}
						className={`px-4 py-2 rounded transition-transform hover:scale-105 ${
							editMode ? "bg-gray-600 text-white hover:bg-gray-700" : "theme-button"
						}`}>
						{editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
					</button>
				</div>
				{editMode && (
					<button
						onClick={() => setShowAddModal(true)}
						disabled={operationLoading}
						className={`px-4 py-2 rounded mb-4 transition-transform ${
							operationLoading ?
								"bg-gray-400 text-gray-200 cursor-not-allowed"
							:	"bg-green-600 text-white hover:bg-green-700 hover:scale-105"
						}`}>
						{operationLoading ? "Processing..." : "Add Widget"}
					</button>
				)}
				{operationLoading && <p className="mb-2">Processing...</p>}
				<WidgetList
					widgets={page?.widgets || []}
					editMode={editMode}
					onDelete={handleDeleteWidget}
					onMoveUp={handleMoveUp}
					onMoveDown={handleMoveDown}
					onUpdateWidget={handleUpdateWidget}
					disabled={operationLoading}
					newlyCreatedWidgetId={newlyCreatedWidgetId}
					onClearNewlyCreated={() => setNewlyCreatedWidgetId(null)}
					borderRadiusEnabled={borderRadiusEnabled}
					borderEnabled={borderEnabled}
					borderThickness={borderThickness}
					marginsEnabled={marginsEnabled}
					verticalSpacingEnabled={verticalSpacingEnabled}
					fullBleedEnabled={fullBleedEnabled}
				/>
			</div>

			<AddWidgetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddWidget} />

			{/* Toast Notification */}
			{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

			<div className="flex justify-center mt-8">
				<button
					onClick={handleLogout}
					className="danger bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-transform hover:scale-105">
					Logout
				</button>
			</div>
		</div>
	);
}
