/** @format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await login(email.trim(), password);
			navigate("/dashboard");
		} catch (err) {
			setError(err.message || "Login failed. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded">
			<h1 className="text-2xl font-bold mb-6">Login</h1>

			{error && <div className="text-red-600 mb-4">{error}</div>}

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
						}}
						required
						className="w-full p-2 border rounded"
					/>
				</div>

				<div className="mb-4 relative">
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setError("");
						}}
						required
						className="w-full p-2 border rounded pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						aria-label={showPassword ? "Hide password" : "Show password"}>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
							<circle cx="12" cy="12" r="3" />
							{showPassword && <line x1="3" y1="21" x2="21" y2="3" />}
						</svg>
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-transform hover:scale-105 disabled:hover:scale-100">
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>

			<div className="mt-4 text-center">
				<Link to="/register" className="text-blue-600 hover:underline">
					Don't have an account? Register
				</Link>
			</div>
		</div>
	);
}
