/** @format */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// #region Get All Users
/**
 * Get all users from the database
 * @returns {Promise<Array>} Array of user objects
 */
export async function getAllUsers() {
	try {
		const users = await prisma.user.findMany();
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw new Error("Failed to fetch users");
	}
}
// #endregion

// #region Create User
/**
 * Create a new user
 * @param {string} username - The username
 * @param {string} email - The email address
 * @param {string} passwordHash - The hashed password
 * @returns {Promise<Object>} The created user object
 */
export async function createUser(username, email, passwordHash) {
	try {
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				passwordHash,
			},
		});
		return newUser;
	} catch (error) {
		console.error("Error creating user:", error);
		if (error.code === "P2002") {
			throw new Error("User with this email or username already exists");
		}
		throw new Error("Failed to create user");
	}
}
// #endregion

// #region Get User By Email
/**
 * Find a user by email
 * @param {string} email - The email address to search for
 * @returns {Promise<Object|null>} The user object or null if not found
 */
export async function getUserByEmail(email) {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		return user;
	} catch (error) {
		console.error("Error fetching user by email:", error);
		throw new Error("Failed to fetch user");
	}
}
// #endregion
