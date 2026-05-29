/**
 * seeder.js
 * Purpose: Placeholder for the database seeder script.
 * Full implementation in Phase 15 — seeds products, users, coupons.
 * Run with: node seeder.js
 */

require("dotenv").config();
const connectDB = require("./config/db");

const seedData = async () => {
  await connectDB();
  console.log("🌱 Seeder ready — full implementation in Phase 15");
  process.exit(0);
};

seedData();
