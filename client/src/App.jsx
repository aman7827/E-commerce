/**
 * App.jsx
 * Purpose: Root React component — sets up routing and context providers.
 * All routes are defined here. Context providers wrap the entire tree.
 * Phase 1: Minimal scaffold with a working home placeholder.
 * Phases 7–13 will add all routes and context providers progressively.
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// ─── Layouts ────────────────────────────────────────────────────────────────
// Full layouts added in Phase 7 — placeholders here
const MainLayout = lazy(() => import("./layouts/MainLayout.jsx"));

// ─── Pages (lazy loaded for code splitting) ──────────────────────────────────
// Full page components added in Phases 8–13
const HomePage = lazy(() => import("./pages/public/HomePage.jsx"));

// ─── Loading Fallback ────────────────────────────────────────────────────────
// Displayed while lazy components are loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted text-sm font-body">Loading...</p>
    </div>
  </div>
);

/**
 * App — Root component
 * Structure:
 *   Router
 *     └── Context Providers (added in Phase 7+)
 *           └── Suspense (lazy loading)
 *                 └── Routes
 *                       ├── MainLayout  → public + user pages
 *                       └── AdminLayout → admin pages
 */
function App() {
  return (
    <Router>
      {/* Global SEO defaults — overridden by each page's <Helmet> */}
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ShopEase — Premium Shopping Experience</title>
      </Helmet>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ─── Public Routes ─────────────────────────────────────────── */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            {/* 
              Additional routes added in Phase 7–13:
              <Route path="shop" element={<ShopPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="login" element={<LoginPage />} />
              etc.
            */}
          </Route>

          {/* ─── Admin Routes (Phase 12) ────────────────────────────────── */}
          {/* 
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
