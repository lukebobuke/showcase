/** @format */

import { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/api";
/**
 * Authentication context providing user state and auth operations
 * Manages JWT token storage and automatic session verification
 */ const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
	};

	const getCurrentUser = async (authToken) => {
		try {
			const userData = await api.getCurrentUser(authToken);
			return userData.user;
		} catch (error) {
			// Token invalid/expired - auto-logout
			console.error("Token expired or invalid:", error);
			logout();
			return null;
		}
	};

	// Load token from localStorage on mount
	useEffect(() => {
		const loadUser = async () => {
			const savedToken = localStorage.getItem("token");

			if (savedToken) {
				setToken(savedToken);
				try {
					const userData = await api.getCurrentUser(savedToken);
					setUser(userData.user);
				} catch (error) {
					// Token invalid, clear it
					localStorage.removeItem("token");
					setToken(null);
					setUser(null);
				}
			}
			setLoading(false); // Important!
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

	const value = {
		user,
		token,
		loading,
		login,
		register,
		logout,
		getCurrentUser,
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
