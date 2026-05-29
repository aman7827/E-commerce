/**
 * AdminLayout.jsx
 * Purpose: Shell layout for all admin panel pages.
 * Contains sidebar navigation and main content area.
 * Phase 1: Placeholder. Full admin layout built in Phase 12.
 */

import React from "react";
import { Outlet, Link } from "react-router-dom";

/**
 * AdminLayout — Wraps all /admin/* pages.
 * Sidebar (left) + Content area (right)
 */
function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-accent">
      {/* ─── Sidebar (Phase 12) ──────────────────────────────────────── */}
      <aside className="w-64 min-h-screen bg-primary text-secondary p-6 flex flex-col gap-2">
        <p className="font-heading text-xl font-semibold mb-6 pb-4 border-b border-white/10">
          Admin Panel
        </p>
        <Link to="/admin" className="text-sm text-white/70 hover:text-white py-2 transition-base">
          Dashboard
        </Link>
        <Link to="/admin/products" className="text-sm text-white/70 hover:text-white py-2 transition-base">
          Products
        </Link>
        <Link to="/admin/orders" className="text-sm text-white/70 hover:text-white py-2 transition-base">
          Orders
        </Link>
        <Link to="/admin/users" className="text-sm text-white/70 hover:text-white py-2 transition-base">
          Users
        </Link>
        <Link to="/admin/categories" className="text-sm text-white/70 hover:text-white py-2 transition-base">
          Categories
        </Link>
        <Link to="/admin/coupons" className="text-sm text-white/70 hover:text-white py-2 transition-base">
          Coupons
        </Link>
      </aside>

      {/* ─── Admin Content Area ───────────────────────────────────────── */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
