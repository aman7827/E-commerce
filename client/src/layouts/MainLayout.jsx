/**
 * MainLayout.jsx
 * Purpose: Shell layout for all public-facing and user pages.
 * Contains the Navbar (top) and Footer (bottom) with <Outlet /> in between.
 * Phase 1: Minimal scaffold. Full Navbar + Footer built in Phase 7.
 */

import React from "react";
import { Outlet } from "react-router-dom";

/**
 * MainLayout — Wraps all public and user pages.
 * Structure:
 *   <header> Navbar </header>
 *   <main>   <Outlet /> (page content) </main>
 *   <footer> Footer </footer>
 */
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {/* ─── Navbar (Phase 7) ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-secondary border-b border-border">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="font-heading text-xl font-semibold text-primary tracking-tight">
            ShopEase
          </a>

          {/* Placeholder nav — replaced in Phase 7 */}
          <nav className="flex items-center gap-6">
            <a href="/shop" className="text-sm text-muted hover:text-primary transition-base">
              Shop
            </a>
            <a href="/cart" className="text-sm text-muted hover:text-primary transition-base">
              Cart
            </a>
            <a href="/login" className="text-sm bg-primary text-secondary px-4 py-2 rounded-sm hover:opacity-90 transition-base">
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Page Content ────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ─── Footer (Phase 7) ────────────────────────────────────────── */}
      <footer className="bg-primary text-secondary py-8 mt-auto">
        <div className="container text-center">
          <p className="font-heading text-lg font-medium mb-1">ShopEase</p>
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
