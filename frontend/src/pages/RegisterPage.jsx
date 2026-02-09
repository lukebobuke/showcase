/** @format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (username.length < 3 || username.length > 30) {
			setError("Username must be between 3 and 30 characters");
			return;
		}

		const usernameRegex = /^[a-zA-Z0-9_]+$/;
		if (!usernameRegex.test(username)) {
			setError("Username can only contain letters, numbers, and underscores");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setLoading(true);

		try {
			await register(username, email, password);
			navigate("/dashboard");
		} catch (err) {
			setError(err.message || "Registration failed. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
			<h1 className="text-2xl font-bold mb-6">Register</h1>

			{error && <div className="text-red-600 mb-4">{error}</div>}

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
							setError("");
						}}
						required
						className="w-full p-2 border rounded"
					/>
				</div>

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
					{loading ? "Creating account..." : "Register"}
				</button>
			</form>

			<div className="mt-4 text-center">
				<Link to="/login" className="text-blue-600 hover:underline">
					Already have an account? Login
				</Link>
			</div>
		</div>
	);
}
