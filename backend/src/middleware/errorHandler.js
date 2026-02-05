/** @format */

/**
 * Error handling middleware for Express
 * Handles Prisma errors and general application errors
 */

// #region Prisma Error Handler
/**
 * Handle Prisma-specific errors
 * @param {Error} err - The error object
 * @returns {Object} - { status, message }
 */
function handlePrismaError(err) {
	switch (err.code) {
		case "P2002":
			// Unique constraint violation
			const field = err.meta?.target?.[0] || "field";
			return {
				status: 409,
				message: `A record with this ${field} already exists`,
			};
		case "P2025":
			// Record not found
			return {
				status: 404,
				message: "Record not found",
			};
		case "P2003":
			// Foreign key constraint failed
			return {
				status: 400,
				message: "Invalid reference to related record",
			};
		case "P2014":
			// Invalid ID
			return {
				status: 400,
				message: "Invalid ID provided",
			};
		default:
			return {
				status: 500,
				message: "Database error occurred",
			};
	}
}
// #endregion

// #region Error Handler Middleware
/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
	// Log error to console
	console.error("Error occurred:");
	console.error("Path:", req.path);
	console.error("Method:", req.method);
	console.error("Error:", err);

	let statusCode = err.statusCode || 500;
	let message = err.message || "Internal server error";

	// Handle Prisma errors
	if (err.code && err.code.startsWith("P")) {
		const prismaError = handlePrismaError(err);
		statusCode = prismaError.status;
		message = prismaError.message;
	}

	// Handle validation errors
	if (err.name === "ValidationError") {
		statusCode = 400;
		message = err.message;
	}

	// Handle JWT errors
	if (err.name === "JsonWebTokenError") {
		statusCode = 401;
		message = "Invalid token";
	}

	if (err.name === "TokenExpiredError") {
		statusCode = 401;
		message = "Token expired";
	}

	// Send error response
	res.status(statusCode).json({
		error: message,
		status: statusCode,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
// #endregion

export default errorHandler;
