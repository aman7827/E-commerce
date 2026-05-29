/**
 * db.js
 * Purpose: Establishes connection to MongoDB Atlas using Mongoose.
 * Called once at server startup. Exits process on failure.
 */

const mongoose = require("mongoose");

/**
 * connectDB - Connects to MongoDB using the MONGO_URI from .env
 * Uses async/await pattern. Logs success or exits on error.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options prevent deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure code so Render/server restarts
    process.exit(1);
  }
};

module.exports = connectDB;
