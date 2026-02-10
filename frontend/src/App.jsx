/** @format */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PublicPage from "./pages/PublicPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PageProvider } from "./context/PageContext";
import "./App.css";

function App() {
	return (
		<AuthProvider>
			<PageProvider>
				<BrowserRouter>
					<Layout>
						<Routes>
							<Route path="/" element={<Navigate to="/login" replace />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<DashboardPage />
									</ProtectedRoute>
								}
							/>
							<Route path="/:username" element={<PublicPage />} />
						</Routes>
					</Layout>
				</BrowserRouter>
			</PageProvider>
		</AuthProvider>
	);
}

export default App;
