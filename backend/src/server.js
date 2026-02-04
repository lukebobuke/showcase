/** @format */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// Test route
app.get("/api/health", (req, res) => {
	res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
