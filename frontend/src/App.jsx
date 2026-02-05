/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [submitting, setSubmitting] = useState(false);

	// Fetch users from backend
	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await axios.get("http://localhost:5000/api/test/users");
			setUsers(response.data.data);
		} catch (err) {
			setError(`Error fetching users: ${err.message}`);
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fetch users on component mount
	useEffect(() => {
		fetchUsers();
	}, []);

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			await axios.post("http://localhost:5000/api/test/users", formData);
			// Reset form
			setFormData({ username: "", email: "", password: "" });
			// Refresh user list
			await fetchUsers();
		} catch (err) {
			setError(`Error creating user: ${err.response?.data?.error || err.message}`);
			console.error("Error:", err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="app">
			<h1>Musician Landing Page - Full Stack Test</h1>

			{/* Create User Form */}
			<section>
				<h2>Create New User</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
					</div>
					<div>
						<input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
					</div>
					<div>
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={handleInputChange}
							required
						/>
					</div>
					<button type="submit" disabled={submitting}>
						{submitting ? "Creating..." : "Create User"}
					</button>
				</form>
			</section>

			{/* User List */}
			<section>
				<h2>All Users ({users.length})</h2>
				{loading && <p>Loading users...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{!loading && users.length === 0 && <p>No users found.</p>}
				{!loading && users.length > 0 && (
					<ul>
						{users.map((user) => (
							<li key={user.id}>
								<strong>{user.username}</strong> - {user.email}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

export default App;
