/** @format */

import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
	const { user } = useAuth();
	const location = useLocation();

	// Check if we're on a public page (/:username route)
	const isPublicPage =
		location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/dashboard";
	const isThemedPage = user && location.pathname === "/dashboard";

	return (
		<div className={isThemedPage ? "theme-scope" : ""}>
			<main className="container mx-auto p-8">{children}</main>
			{!isPublicPage && (
				<footer className="text-center text-gray-500 mt-8">
					<p>© 2026</p>
				</footer>
			)}
		</div>
	);
}
