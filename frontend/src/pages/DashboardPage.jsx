/** @format */

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>
			<p className="mb-4">Email: {user?.email}</p>
			<p className="mb-4">Your page builder will go here</p>

			<button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
				Logout
			</button>
		</div>
	);
}
