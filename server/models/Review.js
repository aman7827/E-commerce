/**
 * Review.js
 * Purpose: Mongoose schema for product reviews.
 * Created before Product.js because Product embeds review stats
 * that are computed from this collection.
 *
 * Each review is a separate document — this lets us:
 *  1. Enforce one-review-per-user-per-product via a compound index
 *  2. Query reviews independently (admin moderation, etc.)
 *  3. Keep the Product document smaller (no embedded review array)
 */

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // ─── Relations ────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },

    // ─── Review Content ───────────────────────────────────────────────
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Compound Index: One Review Per User Per Product ─────────────────────
/**
 * This enforces the business rule: one user can only review
 * a product once. The database rejects duplicates at the index level,
 * which is more reliable than checking in the application layer.
 *
 * Interview Q: Why use a database index for this constraint instead of
 * checking in the controller?
 * A: Race conditions — two near-simultaneous requests could both pass
 *    the controller check. The database unique constraint is atomic.
 */
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// ─── Static Method: Calculate Average Rating ─────────────────────────────
/**
 * calcAverageRating — Recalculates and updates the product's rating stats.
 * Called after every review is saved or deleted.
 *
 * Uses MongoDB aggregation pipeline to compute:
 *  - Average rating (rounded to 1 decimal)
 *  - Total review count
 *
 * @param {ObjectId} productId - The product to recalculate for
 */
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    // Stage 1: Only reviews for this product
    { $match: { product: productId } },
    // Stage 2: Group and compute averages
    {
      $group: {
        _id: "$product",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  // Update the Product document with fresh stats
  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      ratings: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
    });
  } else {
    // No reviews left — reset to defaults
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      numReviews: 0,
      ratings: 0,
    });
  }
};

// ─── Post-Save Hook: Trigger Rating Recalculation ────────────────────────
// Runs after every review save (new or updated)
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product);
});

// ─── Post-Delete Hook: Trigger Rating Recalculation ──────────────────────
// Runs after a review is deleted so Product stats stay accurate
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
