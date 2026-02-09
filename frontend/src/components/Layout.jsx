/** @format */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div>
			<header className="bg-blue-600 text-white p-4">
				<div className="container mx-auto flex justify-between items-center">
					<h1 className="text-xl font-bold">Musician Showcase</h1>
					<nav>
						{user ?
							<div className="flex items-center gap-4">
								<span>Logged in as {user.username}</span>
								<button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
									Logout
								</button>
							</div>
						:	<div className="flex gap-4">
								<Link to="/login" className="hover:underline">
									Login
								</Link>
								<Link to="/register" className="hover:underline">
									Register
								</Link>
							</div>
						}
					</nav>
				</div>
			</header>
			<main className="container mx-auto p-8">{children}</main>
			<footer className="text-center text-gray-500 mt-8">
				<p>© 2026</p>
			</footer>
		</div>
	);
}
