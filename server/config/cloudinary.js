/**
 * cloudinary.js
 * Purpose: Configures the Cloudinary SDK with credentials from .env.
 * Imported by cloudinaryService.js for all image upload/delete operations.
 */

const cloudinary = require("cloudinary").v2;

/**
 * Configure Cloudinary with environment credentials.
 * Never hardcode these values — always use .env
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;
