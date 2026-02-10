/** @format */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
	cors({
		origin: "http://localhost:5173",
	}),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pages", pageRoutes);

app.use(errorHandler);

// Test route
app.get("/api/health", (req, res) => {
	res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
