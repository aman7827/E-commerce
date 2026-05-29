/**
 * errorHandler.js
 * Purpose: Global Express error handling middleware.
 * Catches all errors thrown/passed via next(error) in any route.
 * Returns a consistent JSON error response format.
 */

/**
 * errorHandler middleware
 * Must have 4 parameters for Express to treat it as an error handler.
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set on the error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    // Only show stack trace in development — never in production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
