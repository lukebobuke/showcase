/** @format */

import express from "express";
import { register, login, getCurrentUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// #region POST /api/auth/register
/**
 * POST /api/auth/register
 * Register a new user
 * Body: { username, email, password }
 */
router.post("/register", register);
// #endregion

// #region POST /api/auth/login
/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 */
router.post("/login", login);
// #endregion

// #region GET /api/auth/me
/**
 * GET /api/auth/me
 * Get current authenticated user
 * Requires: Authorization header with Bearer token
 */
router.get("/me", authenticate, getCurrentUser);
// #endregion

export default router;
