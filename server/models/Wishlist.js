/**
 * Wishlist.js
 * Purpose: Mongoose schema for the user's wishlist.
 * One wishlist per user — stores an array of product references.
 * Simpler than Cart because there are no quantities.
 *
 * Interview Q: Why a separate Wishlist model instead of a field on User?
 * A: Separation of concerns — the User model handles authentication.
 *    A separate Wishlist model makes it easy to:
 *    - Populate products without over-fetching user data
 *    - Clear/reset the wishlist independently
 *    - Add wishlist-specific fields later (e.g., notes, price alerts)
 */

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    // One wishlist per user (enforced by unique index)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Array of product references (no duplicates enforced in controller logic)
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Virtual: count ───────────────────────────────────────────────────────
wishlistSchema.virtual("count").get(function () {
  return this.products.length;
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
