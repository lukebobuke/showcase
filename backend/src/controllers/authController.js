/** @format */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// #region Validation Helpers
/**
 * Validate email format
 */
const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Validate username format
 */
const isValidUsername = (username) => {
	const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
	return usernameRegex.test(username);
};
// #endregion

// #region Register
/**
 * Register a new user
 * POST /api/auth/register
 * Body: { username, email, password }
 */
export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// 1. Validate all fields are present
		if (!username || !email || !password) {
			return res.status(400).json({
				error: "Username, email, and password are required",
			});
		}

		// 2. Validate email format
		if (!isValidEmail(email)) {
			return res.status(400).json({
				error: "Invalid email format",
			});
		}

		// 3. Validate username format
		if (!isValidUsername(username)) {
			return res.status(400).json({
				error: "Username must be 3-30 characters long and contain only letters, numbers, and underscores",
			});
		}

		// 4. Validate password length
		if (password.length < 8) {
			return res.status(400).json({
				error: "Password must be at least 8 characters long",
			});
		}

		// 5. Check if email already exists
		const existingEmail = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (existingEmail) {
			return res.status(409).json({
				error: "Email already exists",
			});
		}

		// 6. Check if username already exists
		const existingUsername = await prisma.user.findUnique({
			where: { username: username.toLowerCase() },
		});

		if (existingUsername) {
			return res.status(409).json({
				error: "Username already exists",
			});
		}

		// 7. Hash password
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		// 8. Create user in database
		const newUser = await prisma.user.create({
			data: {
				username: username.toLowerCase(),
				email: email.toLowerCase(),
				passwordHash,
			},
		});

		// 9. Generate JWT token
		const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

		// 10. Return response (exclude passwordHash)
		return res.status(201).json({
			token,
			user: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		return res.status(500).json({
			error: "Internal server error",
		});
	}
};
// #endregion

// #region Login
/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1. Validate all fields are present
		if (!email || !password) {
			return res.status(400).json({
				error: "Email and password are required",
			});
		}

		// 2. Find user by email (case-insensitive)
		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		// 3. If user not found, return invalid credentials
		if (!user) {
			return res.status(401).json({
				error: "Invalid credentials",
			});
		}

		// 4. Compare password with stored hash
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

		// 5. If password doesn't match, return invalid credentials
		if (!isPasswordValid) {
			return res.status(401).json({
				error: "Invalid credentials",
			});
		}

		// 6. Generate JWT token
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

		// 7. Return response (exclude passwordHash)
		return res.status(200).json({
			token,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({
			error: "Internal server error",
		});
	}
};
// #endregion

// #region Get Current User
/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires authentication middleware
 */
export const getCurrentUser = async (req, res) => {
	// User is already attached to req.user by authenticate middleware
	return res.status(200).json({
		user: {
			id: req.user.id,
			username: req.user.username,
			email: req.user.email,
		},
	});
};
// #endregion
