/** @format */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();
	const navigate = useNavigate();

	const validateField = (field, value) => {
		switch (field) {
			case "username":
				if (value.length === 0) return null;
				if (value.length < 3) return "Username must be at least 3 characters";
				if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores";
				return null;
			case "email":
				if (value.length === 0) return null;
				if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
				return null;
			case "password":
				if (value.length === 0) return null;
				if (value.length < 8) return "Password must be at least 8 characters";
				return null;
			default:
				return null;
		}
	};

	const handleBlur = (field, value) => {
		const errorMessage = validateField(field, value);
		setErrors({ ...errors, [field]: errorMessage });
	};

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
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded">
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
							if (errors.username) {
								setErrors({ ...errors, username: null });
							}
						}}
						onBlur={(e) => handleBlur("username", e.target.value)}
						required
						className={`w-full p-2 border rounded ${errors.username ? "border-red-400" : ""}`}
					/>
					{errors.username && <div className="text-red-600 text-sm mt-1">{errors.username}</div>}
				</div>

				<div className="mb-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
							if (errors.email) {
								setErrors({ ...errors, email: null });
							}
						}}
						onBlur={(e) => handleBlur("email", e.target.value)}
						required
						className={`w-full p-2 border rounded ${errors.email ? "border-red-400" : ""}`}
					/>
					{errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
				</div>

				<div className="mb-4 relative">
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setError("");
							if (errors.password) {
								setErrors({ ...errors, password: null });
							}
						}}
						onBlur={(e) => handleBlur("password", e.target.value)}
						required
						className={`w-full p-2 border rounded pr-10 ${errors.password ? "border-red-400" : ""}`}
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
					{errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-transform hover:scale-105 disabled:hover:scale-100">
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
