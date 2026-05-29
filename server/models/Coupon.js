/**
 * Coupon.js
 * Purpose: Mongoose schema for discount coupons.
 * Supports two discount types: percentage (%) and flat amount (₹).
 * Tracks which users have used a coupon to prevent reuse.
 *
 * Interview Q: How does the coupon validation work end-to-end?
 * A: 1. User enters coupon code on CartPage
 *    2. Frontend calls POST /api/coupons/validate with { code, orderTotal }
 *    3. Backend: finds coupon, checks isActive, expiry, minOrderValue,
 *       and whether this user has already used it
 *    4. Returns discount amount if valid
 *    5. At order creation, the coupon _id is saved on the Order document
 *    6. After payment, user._id is added to coupon.usedBy[]
 */

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    // ─── Coupon Code ──────────────────────────────────────────────────
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,  // Normalize to uppercase for case-insensitive matching
      trim: true,
      maxlength: [20, "Coupon code cannot exceed 20 characters"],
    },

    // ─── Discount Configuration ────────────────────────────────────────
    discountType: {
      type: String,
      enum: {
        values: ["percent", "flat"],
        message: "Discount type must be either 'percent' or 'flat'",
      },
      required: [true, "Discount type is required"],
    },

    // The discount value:
    //  - percent: 10 means 10% off
    //  - flat: 100 means ₹100 off
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },

    // Minimum order total required to apply this coupon
    minOrderValue: {
      type: Number,
      default: 0,
      min: [0, "Minimum order value cannot be negative"],
    },

    // Maximum discount amount (cap for percentage coupons)
    // E.g., 20% off but max ₹500 discount
    maxDiscount: {
      type: Number,
      default: null, // null means no cap
    },

    // ─── Validity ──────────────────────────────────────────────────────
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ─── Usage Tracking ────────────────────────────────────────────────
    // Array of user IDs who have used this coupon
    // Prevents one user from using the same coupon twice
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

// ─── Index ───────────────────────────────────────────────────────────────
// Note: code is already indexed via unique:true above
couponSchema.index({ expiryDate: 1 }); // For finding/cleaning expired coupons

// ─── Instance Method: Calculate Discount ─────────────────────────────────
/**
 * calculateDiscount — Computes the actual discount amount for an order.
 * @param {number} orderTotal - The order subtotal before discount
 * @returns {number} The discount amount in rupees
 *
 * Usage in controller: const discount = coupon.calculateDiscount(orderTotal)
 */
couponSchema.methods.calculateDiscount = function (orderTotal) {
  let discount = 0;

  if (this.discountType === "percent") {
    discount = (orderTotal * this.value) / 100;

    // Apply max discount cap if set
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.discountType === "flat") {
    discount = this.value;
  }

  // Discount can't exceed the order total
  return Math.min(discount, orderTotal);
};

// ─── Instance Method: Check If Expired ───────────────────────────────────
couponSchema.methods.isExpired = function () {
  return new Date() > this.expiryDate;
};

// ─── Instance Method: Check If User Already Used ─────────────────────────
couponSchema.methods.hasUserUsed = function (userId) {
  return this.usedBy.some((id) => id.toString() === userId.toString());
};

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
