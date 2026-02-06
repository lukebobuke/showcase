/** @format */

import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// #region Authenticate Middleware
/**
 * Middleware to verify JWT token and attach user to request
 * Expects Authorization header: "Bearer <token>"
 */
export const authenticate = async (req, res, next) => {
	try {
		// 1. Get Authorization header
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({
				error: "No token provided",
			});
		}

		// 2. Check format (Bearer <token>)
		if (!authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				error: "Invalid token format",
			});
		}

		// 3. Extract token
		const token = authHeader.substring(7); // Remove "Bearer " prefix

		// 4. Verify token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({
				error: "Invalid token",
			});
		}

		// 5. Get userId from decoded payload
		const { userId } = decoded;

		// 6. Fetch user from database
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return res.status(401).json({
				error: "User not found",
			});
		}

		// 7. Attach user to request (exclude passwordHash)
		req.user = {
			id: user.id,
			username: user.username,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		// 8. Continue to next middleware/route
		next();
	} catch (error) {
		console.error("Authentication error:", error);
		return res.status(500).json({
			error: "Internal server error",
		});
	}
};
// #endregion

export default authenticate;
