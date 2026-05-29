/**
 * HomePage.jsx
 * Purpose: Phase 1 placeholder for the Home page.
 * Full HomePage with Hero, Featured Products, Categories, etc. built in Phase 9.
 * This confirms routing, layout, and Tailwind design system are working correctly.
 */

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

/**
 * HomePage — Landing page of the e-commerce store.
 * Phase 1: Visual confirmation that the design system is working.
 * Phase 9: Full implementation with all sections.
 */
function HomePage() {
  return (
    <>
      {/* ─── SEO ─────────────────────────────────────────────────────── */}
      <Helmet>
        <title>ShopEase — Premium Shopping Experience</title>
        <meta
          name="description"
          content="Discover curated products across fashion, electronics, and home. Premium shopping with fast delivery."
        />
      </Helmet>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="bg-accent min-h-[70vh] flex items-center">
        <div className="container">
          <div className="max-w-2xl">
            {/* Eyebrow label */}
            <p className="text-sm text-muted font-body tracking-widest uppercase mb-4">
              New Season Arrivals
            </p>

            {/* Heading — Playfair Display */}
            <h1 className="font-heading text-5xl md:text-7xl font-semibold text-primary leading-tight mb-6">
              Curated for
              <br />
              <em className="font-normal">Your Style</em>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-muted font-body mb-10 max-w-lg leading-relaxed">
              Discover thoughtfully selected products across fashion, electronics,
              and home — delivered to your door.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link
                to="/shop"
                className="bg-primary text-secondary text-sm font-body font-medium px-8 py-3.5 rounded-sm hover:opacity-90 transition-base"
              >
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="border border-border text-primary text-sm font-body font-medium px-8 py-3.5 rounded-sm hover:border-primary transition-base"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Phase 1 Status Banner ─────────────────────────────────────── */}
      <section className="bg-secondary py-16">
        <div className="container">
          <div className="border border-border rounded-md p-8 text-center">
            <p className="text-xs text-muted tracking-widest uppercase mb-3">
              Development Status
            </p>
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Phase 1 Complete ✓
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Project setup is complete. Design system, routing, and base
              configuration are working correctly.
            </p>

            {/* Status Checklist */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              {[
                "Vite + React 18",
                "Tailwind CSS Config",
                "Design System Colors",
                "Playfair + DM Sans Fonts",
                "React Router DOM v6",
                "Express Server",
                "MongoDB Config",
                "Environment Variables",
                "Folder Structure",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="w-4 h-4 rounded-full bg-success/10 text-success flex items-center justify-center text-xs">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Design System Preview ────────────────────────────────────── */}
      <section className="bg-accent py-16">
        <div className="container">
          <p className="text-xs text-muted tracking-widest uppercase mb-8">
            Design System Preview
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {[
              { name: "Primary", bg: "bg-primary", text: "text-secondary" },
              { name: "Secondary", bg: "bg-secondary", text: "text-primary", border: true },
              { name: "Accent", bg: "bg-accent", text: "text-primary", border: true },
              { name: "Success", bg: "bg-success", text: "text-secondary" },
              { name: "Danger", bg: "bg-danger", text: "text-secondary" },
            ].map((color) => (
              <div
                key={color.name}
                className={`${color.bg} ${color.text} ${
                  color.border ? "border border-border" : ""
                } rounded-sm p-4 text-xs font-body text-center`}
              >
                {color.name}
              </div>
            ))}
          </div>

          {/* Font Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary border border-border rounded-md p-6">
              <p className="text-xs text-muted uppercase tracking-widest mb-3">
                Playfair Display — Headings
              </p>
              <p className="font-heading text-3xl text-primary">
                The quick brown fox
              </p>
              <p className="font-heading text-xl text-muted italic mt-1">
                jumps over the lazy dog
              </p>
            </div>
            <div className="bg-secondary border border-border rounded-md p-6">
              <p className="text-xs text-muted uppercase tracking-widest mb-3">
                DM Sans — Body Text
              </p>
              <p className="font-body text-base text-primary">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="font-body text-sm text-muted mt-2">
                Regular · Medium · SemiBold
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
