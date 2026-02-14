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
			// Provide user-friendly messages for specific fields
			if (field === "email") {
				return {
					status: 409,
					message: "This email is already registered. Please use a different email or try logging in.",
				};
			} else if (field === "username") {
				return {
					status: 409,
					message: "Username already taken. Please choose a different username.",
				};
			}
			return {
				status: 409,
				message: `This ${field} is already taken. Please try a different one.`,
			};
		case "P2025":
			// Record not found
			return {
				status: 404,
				message: "The requested item could not be found.",
			};
		case "P2003":
			// Foreign key constraint failed
			return {
				status: 400,
				message: "Invalid data reference. Please check your input.",
			};
		case "P2014":
			// Invalid ID
			return {
				status: 400,
				message: "Invalid ID provided. Please try again.",
			};
		default:
			return {
				status: 500,
				message: "Something went wrong. Please try again.",
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
		message = "Invalid authentication token. Please log in again.";
	}

	if (err.name === "TokenExpiredError") {
		statusCode = 401;
		message = "Your session has expired. Please log in again.";
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
