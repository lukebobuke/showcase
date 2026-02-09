/** @format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
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

				<div className="mb-4">
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setError("");
						}}
						required
						className="w-full p-2 border rounded"
					/>
				</div>

				<button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
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
