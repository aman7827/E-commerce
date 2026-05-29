/**
 * Cart.js
 * Purpose: Mongoose schema for the shopping cart.
 * One cart per user — items are an array of product references with quantities.
 *
 * Design Decision: Cart is stored in MongoDB (not just localStorage) for
 * logged-in users. This allows:
 *  1. Cart persistence across devices (login on phone, checkout on laptop)
 *  2. Server-side stock validation at checkout
 *  3. Merge with guest cart (localStorage) on login
 *
 * Interview Q: How does the cart handle guest users?
 * A: Guest cart is stored in localStorage (managed by CartContext).
 *    On login, the frontend reads the localStorage cart and calls the
 *    POST /api/cart endpoint to merge items into the server cart.
 *    localStorage is then cleared.
 */

const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
  },
  { _id: false } // No separate _id for subdocuments — cleaner API response
);

const cartSchema = new mongoose.Schema(
  {
    // One cart per user (enforced by unique index)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
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

// ─── Virtual: itemCount ───────────────────────────────────────────────────
// Total number of items in the cart (sum of all quantities)
cartSchema.virtual("itemCount").get(function () {
  return this.items.reduce((total, item) => total + item.qty, 0);
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
