/** @format */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Get page by username (public)
export const getPageByUsername = async (req, res) => {
	try {
		const { username } = req.params;

		// Find user by username (case-insensitive)
		const user = await prisma.user.findFirst({
			where: {
				username: {
					equals: username,
					mode: "insensitive",
				},
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Find page with widgets ordered by position
		const page = await prisma.page.findUnique({
			where: { userId: user.id },
			include: {
				widgets: {
					orderBy: { position: "asc" },
				},
			},
		});

		if (!page) {
			return res.status(404).json({ error: "Page not found" });
		}

		// Return page data without sensitive user info
		res.status(200).json({
			page: {
				theme: page.theme,
				headerImage: page.headerImage,
				widgets: page.widgets,
			},
			user: {
				username: user.username,
			},
		});
	} catch (error) {
		console.error("Error fetching page by username:", error);
		res.status(500).json({ error: "Unable to load page. Please try again." });
	}
};

// Get current user's page (authenticated)
export const getMyPage = async (req, res) => {
	try {
		const userId = req.user.id;

		const page = await prisma.page.findUnique({
			where: { userId },
			include: {
				widgets: {
					orderBy: { position: "asc" },
				},
			},
		});

		if (!page) {
			return res.status(404).json({ error: "Page not found" });
		}

		res.status(200).json({
			page: {
				id: page.id,
				theme: page.theme,
				headerImage: page.headerImage,
				widgets: page.widgets,
			},
		});
	} catch (error) {
		console.error("Error fetching user page:", error);
		res.status(500).json({ error: "Unable to load your page. Please try again." });
	}
};

// Create page for current user (authenticated)
export const createPage = async (req, res) => {
	try {
		const userId = req.user.id;

		// Check if user already has a page
		const existingPage = await prisma.page.findUnique({
			where: { userId },
		});

		if (existingPage) {
			return res.status(409).json({ error: "Page already exists" });
		}

		// Create page with default theme
		const page = await prisma.page.create({
			data: {
				userId,
				theme: "ocean-light",
				headerImage: null,
			},
		});

		res.status(201).json({ page });
	} catch (error) {
		console.error("Error creating page:", error);
		res.status(500).json({ error: "Unable to create page. Please try again." });
	}
};

// Update current user's page (authenticated)
export const updatePage = async (req, res) => {
	try {
		const userId = req.user.id;
		const { theme, headerImage } = req.body;

		// Build update data object
		const updateData = {};
		if (theme !== undefined) updateData.theme = theme;
		if (headerImage !== undefined) updateData.headerImage = headerImage;

		// Update page
		const page = await prisma.page.update({
			where: { userId },
			data: updateData,
		});

		res.status(200).json({ page });
	} catch (error) {
		if (error.code === "P2025") {
			return res.status(404).json({ error: "Page not found" });
		}
		console.error("Error updating page:", error);
		res.status(500).json({ error: "Unable to update page. Please try again." });
	}
};
