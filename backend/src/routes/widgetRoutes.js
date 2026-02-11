/** @format */

import express from "express";
import * as widgetController from "../controllers/widgetController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication

// Create widget
router.post("/", authenticate, widgetController.createWidget);

// Reorder widgets (must come before /:id to avoid conflict)
router.put("/reorder", authenticate, widgetController.reorderWidgets);

// Update widget
router.put("/:id", authenticate, widgetController.updateWidget);

// Delete widget
router.delete("/:id", authenticate, widgetController.deleteWidget);

export default router;
