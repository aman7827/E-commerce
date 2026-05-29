/**
 * Product.js
 * Purpose: Mongoose schema for products — the core of the e-commerce catalog.
 * References Category and Review models.
 * Stores Cloudinary image URLs and maintains denormalized rating stats.
 *
 * Design Decision: ratings and numReviews are stored on the Product document
 * (denormalized) instead of computing them on every query. The Review model's
 * post-save/delete hooks keep these stats in sync automatically.
 *
 * Interview Q: Why store ratings on the product instead of computing them?
 * A: Performance. If you compute the average on every product list request,
 *    you'd need an expensive aggregation across the reviews collection.
 *    Denormalizing trades a tiny write cost for very fast reads.
 */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ─── Core Info ───────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // ─── Categorization ───────────────────────────────────────────────
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },

    // ─── Pricing ──────────────────────────────────────────────────────
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },

    // ─── Inventory ────────────────────────────────────────────────────
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    // ─── Images ───────────────────────────────────────────────────────
    // Array of Cloudinary secure_url strings
    // First image in array = primary display image
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String, // Cloudinary public_id — needed for deletion
          required: true,
        },
      },
    ],

    // ─── Ratings (Denormalized — Updated by Review model hooks) ───────
    ratings: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot exceed 5"],
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // ─── Flags ────────────────────────────────────────────────────────
    isFeatured: {
      type: Boolean,
      default: false, // Featured products appear on the homepage
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: {
      virtuals: true, // Include virtual fields in JSON output
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ─── Indexes for Performance ──────────────────────────────────────────────
// Text index: enables $text search across name and description
productSchema.index({ name: "text", description: "text" });
// Compound index: fast filtering by category + price range
productSchema.index({ category: 1, price: 1 });
// Single field indexes for common filters
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ ratings: -1 }); // Descending: highest rated first

// ─── Virtual: inStock ─────────────────────────────────────────────────────
/**
 * Virtual field — computed on-the-fly, not stored in DB.
 * Accessible as product.inStock in API responses.
 * Avoids storing a redundant boolean that could fall out of sync.
 */
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
