/**
 * rateLimiter.js
 * Purpose: Rate limiting middleware using express-rate-limit.
 * Prevents brute-force attacks on auth routes.
 * Auth routes: max 10 requests per 15 minutes per IP.
 */

const rateLimit = require("express-rate-limit");

/**
 * authLimiter — Applied to all /api/auth routes.
 * Limits login/register attempts to stop brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // Max 10 requests per window
  message: {
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,  // Disable X-RateLimit-* headers
});

/**
 * generalLimiter — Applied globally to all routes.
 * Loose limit to prevent general API abuse.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per window
  message: {
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, generalLimiter };
