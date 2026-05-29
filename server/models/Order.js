/**
 * Order.js
 * Purpose: Mongoose schema for customer orders — the most complex model.
 * Stores a complete snapshot of the order at the time of purchase:
 *   - Order items (with prices at time of purchase)
 *   - Shipping address (copy — not a reference)
 *   - Payment info (Razorpay IDs)
 *   - Price breakdown (items + shipping + tax + discount = total)
 *   - Status lifecycle
 *
 * Key Design Decisions:
 *  1. orderItems embed product data (name, price, image) as a SNAPSHOT.
 *     If the product changes price later, historical orders are unaffected.
 *  2. shippingAddress is also a snapshot (not a reference to Address).
 *     Historical orders show the address that was actually used.
 *  3. Price breakdown stored on order — never recomputed from current prices.
 *
 * Interview Q: Why embed order items instead of referencing products?
 * A: Referential integrity over time. Products get updated, go out of stock,
 *    or get deleted. An order needs to permanently record what was purchased
 *    at what price. Embedding a snapshot ensures the invoice is always accurate.
 */

const mongoose = require("mongoose");

// ─── Order Item Sub-Schema ────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    image: {
      type: String, // First product image URL at time of purchase
      required: true,
    },
    price: {
      type: Number, // Price AT TIME OF PURCHASE — not a reference
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      // This is kept for "Buy Again" or "View Product" links
      // But the actual order data (name, price, image) is the snapshot above
    },
  },
  { _id: false }
);

// ─── Shipping Address Sub-Schema ──────────────────────────────────────────
// A COPY of the address — not a reference to the Address model
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    addressLine: { type: String, required: true },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    postalCode:  { type: String, required: true },
    country:     { type: String, required: true, default: "India" },
  },
  { _id: false }
);

// ─── Main Order Schema ────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    // ─── Ownership ──────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Order Items (Snapshot) ──────────────────────────────────────
    orderItems: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must have at least one item",
      },
    },

    // ─── Shipping Address (Snapshot) ─────────────────────────────────
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },

    // ─── Payment ─────────────────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      required: [true, "Payment method is required"],
    },

    // Razorpay IDs — populated after payment
    razorpayOrderId:   { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },

    // ─── Coupon ───────────────────────────────────────────────────────
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    // ─── Price Breakdown (All stored — never recomputed) ─────────────
    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      // Free shipping if itemsPrice > 999, else ₹99
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      // 18% GST on itemsPrice
    },

    discountPrice: {
      type: Number,
      default: 0, // Coupon discount amount
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      // = itemsPrice + shippingPrice + taxPrice - discountPrice
    },

    // ─── Payment Status ───────────────────────────────────────────────
    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // ─── Delivery Status ──────────────────────────────────────────────
    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    // ─── Order Status Lifecycle ────────────────────────────────────────
    /**
     * Status flow:
     * pending → processing → shipped → delivered
     *                                → cancelled (from any stage before shipped)
     *
     * pending:    Order placed, payment not yet confirmed (or COD waiting)
     * processing: Payment confirmed, admin is preparing the order
     * shipped:    Dispatched — tracking number may be provided later
     * delivered:  Customer confirmed receipt (or auto-set by admin)
     * cancelled:  Order cancelled by user or admin
     */
    status: {
      type: String,
      enum: {
        values: ["pending", "processing", "shipped", "delivered", "cancelled"],
        message: "Invalid order status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true, // createdAt = order placed date
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
orderSchema.index({ user: 1, createdAt: -1 }); // My orders — newest first
orderSchema.index({ status: 1 });               // Admin filter by status
orderSchema.index({ razorpayOrderId: 1 });      // Fast payment verification lookup

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
