/**
 * Category.js
 * Purpose: Mongoose schema for product categories.
 * Simple model — name, slug (URL-friendly name), and optional image.
 * Created before Product.js because Product references Category.
 *
 * Interview Q: What is a slug and why use it?
 * A: A slug is a URL-friendly version of a name. E.g., "Men's Fashion"
 *    becomes "mens-fashion". Slugs make URLs readable and SEO-friendly
 *    instead of using MongoDB's hex ObjectIds in the URL.
 */

const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    // ─── Name ─────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },

    // ─── Slug ─────────────────────────────────────────────────────────
    // Auto-generated from name in pre-save middleware
    // Used in URLs: /categories/mens-fashion
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // ─── Image ────────────────────────────────────────────────────────
    // Cloudinary URL — uploaded via admin panel
    image: {
      type: String,
      default: "",
    },

    // ─── Cloudinary Public ID (for deletion) ──────────────────────────
    imagePublicId: {
      type: String,
      default: "",
      select: false, // Internal field — not needed in API responses
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.imagePublicId;
        return ret;
      },
    },
  }
);

// ─── Pre-Save Middleware: Auto-Generate Slug ─────────────────────────────
/**
 * Generates a URL-friendly slug from the category name.
 * Only runs when name is modified to avoid unnecessary re-slugging.
 * E.g., "Men's Fashion" → "mens-fashion"
 */
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,        // Convert to lowercase
      strict: true,       // Remove special characters
      trim: true,         // Remove leading/trailing whitespace
    });
  }
  next();
});

// ─── Index ───────────────────────────────────────────────────────────────
categorySchema.index({ slug: 1 });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
