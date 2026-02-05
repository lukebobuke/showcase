/** @format */

import express from "express";
import { getAllUsers, createUser } from "../services/userService.js";

const router = express.Router();

// #region GET /api/test/users
/**
 * GET /api/test/users
 * Returns all users from the database
 */
router.get("/users", async (req, res) => {
	try {
		const users = await getAllUsers();
		res.json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});
// #endregion

// #region POST /api/test/users
/**
 * POST /api/test/users
 * Creates a test user
 * Body: { username, email, password }
 */
router.post("/users", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Validate input
		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				error: "Username, email, and password are required",
			});
		}

		// For now, use password as-is (we'll add bcrypt later)
		const newUser = await createUser(username, email, password);

		res.status(201).json({
			success: true,
			data: newUser,
		});
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});
// #endregion

export default router;
