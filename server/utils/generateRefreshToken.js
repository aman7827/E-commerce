/**
 * generateRefreshToken.js
 * Purpose: Generates a long-lived JWT refresh token (7 days).
 * Stored as an httpOnly cookie — never accessible via JavaScript (XSS-safe).
 */

const jwt = require("jsonwebtoken");

/**
 * generateRefreshToken — Creates a JWT refresh token
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT refresh token (expires in 7 days)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateRefreshToken;
