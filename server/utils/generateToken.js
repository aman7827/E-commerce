/**
 * generateToken.js
 * Purpose: Generates a short-lived JWT access token (15 minutes).
 * Used at login and when refreshing tokens.
 */

const jwt = require("jsonwebtoken");

/**
 * generateToken — Creates a JWT access token
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT access token (expires in 15 minutes)
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

module.exports = generateToken;
