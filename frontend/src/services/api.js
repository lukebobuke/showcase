/** @format */

import axios from "axios";

// API endpoint URL - uses environment variable for production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function register(username, email, password) {
	try {
		const response = await axios.post(`${API_URL}/api/auth/register`, {
			username,
			email,
			password,
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
		throw new Error(message);
	}
}

export async function login(email, password) {
	try {
		const response = await axios.post(`${API_URL}/api/auth/login`, {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
		throw new Error(message);
	}
}

export async function getCurrentUser(token) {
	try {
		const response = await axios.get(`${API_URL}/api/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
		throw new Error(message);
	}
}

// Page-related functions
export async function getPageByUsername(username) {
	try {
		const response = await axios.get(`${API_URL}/api/pages/${username}`);
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
		throw new Error(message);
	}
}

export async function getMyPage(token) {
	try {
		const response = await axios.get(`${API_URL}/api/pages/my-page`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
		throw new Error(message);
	}
}

export async function updatePage(token, theme, headerImage) {
	try {
		const response = await axios.put(
			`${API_URL}/api/pages/my-page`,
			{ theme, headerImage },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Something went wrong. Please try again.";
		throw new Error(message);
	}
}

// Widget-related functions
export async function createWidget(token, widgetType, widgetData) {
	try {
		const response = await axios.post(
			`${API_URL}/api/widgets`,
			{ widgetType, widgetData },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Failed to create widget. Please try again.";
		throw new Error(message);
	}
}

export async function updateWidget(token, widgetId, widgetData) {
	try {
		const response = await axios.put(
			`${API_URL}/api/widgets/${widgetId}`,
			{ widgetData },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Failed to save widget. Please try again.";
		throw new Error(message);
	}
}

export async function deleteWidget(token, widgetId) {
	try {
		const response = await axios.delete(`${API_URL}/api/widgets/${widgetId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Failed to delete widget. Please try again.";
		throw new Error(message);
	}
}

export async function reorderWidgets(token, widgetIds) {
	try {
		const response = await axios.put(
			`${API_URL}/api/widgets/reorder`,
			{ widgetIds },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Failed to reorder widgets. Please try again.";
		throw new Error(message);
	}
}

export async function updatePageSettings(token, settings) {
	try {
		const response = await axios.put(`${API_URL}/api/pages/my-page/settings`, settings, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		const message = error.response?.data?.error || error.message || "Failed to update settings. Please try again.";
		throw new Error(message);
	}
}
