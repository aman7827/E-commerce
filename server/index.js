/**
 * index.js
 * Purpose: Main Express server entry point.
 * Initializes middleware, routes, error handling, and starts the HTTP server.
 * This is the first file that runs when you start the backend.
 */

// ─── Load Environment Variables ────────────────────────────────────────────
require("dotenv").config();

// ─── Core Dependencies ──────────────────────────────────────────────────────
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// ─── Custom Modules ─────────────────────────────────────────────────────────
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");

// ─── Initialize Express App ─────────────────────────────────────────────────
const app = express();

// ─── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ─── Security Middleware ────────────────────────────────────────────────────
// Helmet sets secure HTTP headers (XSS, clickjacking, etc.)
app.use(helmet());

// CORS — only allow requests from the React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Required for httpOnly cookies (refresh token)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── General Rate Limiting ──────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Body Parsing Middleware ────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));         // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));   // Parse URL-encoded bodies
app.use(cookieParser());                           // Parse cookies (for refresh token)

// ─── Request Logging (Development Only) ────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logs: METHOD /path STATUS ms
}

// ─── Health Check Route ─────────────────────────────────────────────────────
// Used by Render health checks and monitoring tools
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
// Routes will be added phase by phase as we build them
// Phase 3: Auth routes
// Phase 4: Product & Category routes
// Phase 5: Cart, Wishlist, Coupon routes
// Phase 6: Order routes
// Phase 7+: User admin routes

// Placeholder: Will be replaced in Phase 3
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/products", require("./routes/products"));
// app.use("/api/categories", require("./routes/categories"));
// app.use("/api/cart", require("./routes/cart"));
// app.use("/api/wishlist", require("./routes/wishlist"));
// app.use("/api/orders", require("./routes/orders"));
// app.use("/api/users", require("./routes/users"));
// app.use("/api/coupons", require("./routes/coupons"));

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// Must be LAST — after all routes and middleware
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
});
