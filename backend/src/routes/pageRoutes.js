/** @format */

import express from "express";
import * as pageController from "../controllers/pageController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - require authentication (more specific, must come first)
router.get("/my-page", authenticate, pageController.getMyPage);
router.post("/my-page", authenticate, pageController.createPage);
router.put("/my-page", authenticate, pageController.updatePage);
router.put("/my-page/settings", authenticate, pageController.updatePageSettings);

// Public route - get page by username (more general, comes last)
router.get("/:username", pageController.getPageByUsername);

export default router;
