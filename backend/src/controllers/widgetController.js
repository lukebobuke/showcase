/** @format */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const VALID_WIDGET_TYPES = ["text", "links", "photos", "youtube", "tour_dates"];

// Create a new widget
export const createWidget = async (req, res) => {
	try {
		const userId = req.user.id;
		const { widgetType, widgetData = {} } = req.body;

		// Validate widget type
		if (!VALID_WIDGET_TYPES.includes(widgetType)) {
			return res.status(400).json({
				error: `Invalid widget type. Must be one of: ${VALID_WIDGET_TYPES.join(", ")}`,
			});
		}

		// Find user's page
		const page = await prisma.page.findUnique({
			where: { userId },
		});

		if (!page) {
			return res.status(404).json({ error: "Page not found" });
		}

		// Count existing widgets for this page
		const widgetCount = await prisma.widget.count({
			where: { pageId: page.id },
		});

		// Create widget
		const widget = await prisma.widget.create({
			data: {
				pageId: page.id,
				widgetType,
				widgetData,
				position: widgetCount,
			},
		});

		return res.status(201).json({ widget });
	} catch (error) {
		console.error("Error creating widget:", error);
		return res.status(500).json({ error: "Failed to create widget" });
	}
};

// Update widget data
export const updateWidget = async (req, res) => {
	try {
		const widgetId = req.params.id;
		const userId = req.user.id;
		const { widgetData } = req.body;

		// Find widget with page and user
		const widget = await prisma.widget.findUnique({
			where: { id: widgetId },
			include: {
				page: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!widget) {
			return res.status(404).json({ error: "Widget not found" });
		}

		// Check authorization
		if (widget.page.userId !== userId) {
			return res.status(403).json({ error: "Not authorized" });
		}

		// Update widget data
		const updatedWidget = await prisma.widget.update({
			where: { id: widgetId },
			data: { widgetData },
		});

		return res.status(200).json({ widget: updatedWidget });
	} catch (error) {
		console.error("Error updating widget:", error);
		return res.status(500).json({ error: "Failed to update widget" });
	}
};

// Delete widget
export const deleteWidget = async (req, res) => {
	try {
		const widgetId = req.params.id;
		const userId = req.user.id;

		// Find widget with page and user
		const widget = await prisma.widget.findUnique({
			where: { id: widgetId },
			include: {
				page: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!widget) {
			return res.status(404).json({ error: "Widget not found" });
		}

		// Check authorization
		if (widget.page.userId !== userId) {
			return res.status(403).json({ error: "Not authorized" });
		}

		const deletedPosition = widget.position;
		const pageId = widget.pageId;

		// Delete the widget
		await prisma.widget.delete({
			where: { id: widgetId },
		});

		// Reorder remaining widgets (update position of widgets after deleted one)
		await prisma.widget.updateMany({
			where: {
				pageId,
				position: { gt: deletedPosition },
			},
			data: {
				position: { decrement: 1 },
			},
		});

		return res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error deleting widget:", error);
		return res.status(500).json({ error: "Failed to delete widget" });
	}
};

// Reorder widgets
export const reorderWidgets = async (req, res) => {
	try {
		const userId = req.user.id;
		const { widgetIds } = req.body;

		if (!Array.isArray(widgetIds)) {
			return res.status(400).json({ error: "widgetIds must be an array" });
		}

		// Find user's page with widgets
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

		// Validate all widgetIds belong to this page
		const pageWidgetIds = page.widgets.map((w) => w.id);
		const allValid = widgetIds.every((id) => pageWidgetIds.includes(id));

		if (!allValid) {
			return res.status(400).json({ error: "Some widget IDs do not belong to this page" });
		}

		// Update each widget's position to match array index
		const updatePromises = widgetIds.map((widgetId, index) =>
			prisma.widget.update({
				where: { id: widgetId },
				data: { position: index },
			}),
		);

		await Promise.all(updatePromises);

		// Fetch updated widgets
		const updatedWidgets = await prisma.widget.findMany({
			where: { pageId: page.id },
			orderBy: { position: "asc" },
		});

		return res.status(200).json({ widgets: updatedWidgets });
	} catch (error) {
		console.error("Error reordering widgets:", error);
		return res.status(500).json({ error: "Failed to reorder widgets" });
	}
};
