/** @format */

import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const PAGES_API_URL = "http://localhost:5000/api/pages";

export async function register(username, email, password) {
	try {
		const response = await axios.post(`${API_URL}/register`, {
			username,
			email,
			password,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function login(email, password) {
	try {
		const response = await axios.post(`${API_URL}/login`, {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getCurrentUser(token) {
	try {
		const response = await axios.get(`${API_URL}/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

// Page-related functions
export async function getPageByUsername(username) {
	try {
		const response = await axios.get(`${PAGES_API_URL}/${username}`);
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function getMyPage(token) {
	try {
		const response = await axios.get(`${PAGES_API_URL}/my-page`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}

export async function updatePage(token, theme, headerImage) {
	try {
		const response = await axios.put(
			`${PAGES_API_URL}/my-page`,
			{ theme, headerImage },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}
