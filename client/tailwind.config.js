/**
 * tailwind.config.js
 * Purpose: Extends Tailwind CSS with the project's strict design system.
 * All custom colors, fonts, and spacing defined here.
 * Never use default Tailwind colors (blue, indigo, etc.) — only use these tokens.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names (for tree-shaking unused styles)
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      // ─── Color System (STRICT — NO EXCEPTIONS) ──────────────────────────────
      // These map to CSS variables defined in index.css
      // Usage: bg-primary, text-muted, border-border, etc.
      colors: {
        primary:     "#1A1A1A",   // Buttons, headings, navbar
        secondary:   "#FFFFFF",   // Backgrounds, cards
        accent:      "#F5F5F5",   // Section backgrounds
        border:      "#E0E0E0",   // Dividers, input borders
        "text-main": "#1A1A1A",   // Primary body text
        muted:       "#757575",   // Labels, placeholders, captions
        success:     "#2E7D32",   // Success badges, order confirmed
        danger:      "#C62828",   // Errors, out of stock, validation
        "tag-bg":    "#F0F0F0",   // Filter tags, category pills
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        sans:    ["DM Sans", "system-ui", "sans-serif"], // Override Tailwind default sans
      },

      // ─── Border Radius (4px–8px only) ────────────────────────────────────
      borderRadius: {
        sm:  "4px",
        DEFAULT: "4px",
        md:  "6px",
        lg:  "8px",
        xl:  "8px",  // Capped at 8px per design rules
      },

      // ─── Box Shadow (minimal — max 0 1px 4px) ─────────────────────────────
      boxShadow: {
        sm:      "0 1px 2px rgba(0, 0, 0, 0.04)",
        DEFAULT: "0 1px 4px rgba(0, 0, 0, 0.06)",
        md:      "0 1px 4px rgba(0, 0, 0, 0.06)",
        // No large shadows — intentionally minimal
      },

      // ─── Spacing (generous editorial spacing) ────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ─── Typography Scale ─────────────────────────────────────────────────
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
    },
  },

  plugins: [],
};
