/** @format */

import { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	// Load token from localStorage on mount
	useEffect(() => {
		const loadUser = async () => {
			const storedToken = localStorage.getItem("token");

			if (storedToken) {
				setToken(storedToken);
				try {
					const userData = await api.getCurrentUser(storedToken);
					setUser(userData.user);
				} catch (error) {
					console.error("Error loading user:", error);
					localStorage.removeItem("token");
					setToken(null);
				}
			}

			setLoading(false);
		};

		loadUser();
	}, []);

	const login = async (email, password) => {
		try {
			const data = await api.login(email, password);
			const newToken = data.token;

			setToken(newToken);
			setUser(data.user);
			localStorage.setItem("token", newToken);

			return data;
		} catch (error) {
			// Extract error message from API response
			const errorMessage = error.response?.data?.error || error.message || "Network error. Please check your connection.";
			throw new Error(errorMessage);
		}
	};

	const register = async (username, email, password) => {
		try {
			const data = await api.register(username, email, password);
			const newToken = data.token;

			setToken(newToken);
			setUser(data.user);
			localStorage.setItem("token", newToken);

			return data;
		} catch (error) {
			// Extract error message from API response
			const errorMessage = error.response?.data?.error || error.message || "Network error. Please check your connection.";
			throw new Error(errorMessage);
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
	};

	const value = {
		user,
		token,
		loading,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
