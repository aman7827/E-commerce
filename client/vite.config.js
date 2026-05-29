/**
 * vite.config.js
 * Purpose: Vite build tool configuration for the React frontend.
 * Sets up development server, proxy to backend, and build output.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(), // Enables React Fast Refresh in dev mode
  ],

  // ─── Path Aliases ──────────────────────────────────────────────────────────
  // Allows: import Navbar from "@/components/Navbar"
  // Instead of: import Navbar from "../../components/Navbar"
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ─── Development Server ────────────────────────────────────────────────────
  server: {
    port: 5173,     // React runs on 5173
    open: true,     // Auto-open browser on dev start
    proxy: {
      // Proxy API calls to the Express server during development
      // This avoids CORS issues in development
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ─── Production Build ──────────────────────────────────────────────────────
  build: {
    outDir: "dist",
    sourcemap: false, // No source maps in production (security)
    rollupOptions: {
      output: {
        // Code splitting — large libraries go into separate chunks
        manualChunks: {
          vendor:  ["react", "react-dom"],
          router:  ["react-router-dom"],
          charts:  ["chart.js", "react-chartjs-2"],
        },
      },
    },
  },
});
