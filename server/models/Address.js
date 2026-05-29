/**
 * Address.js
 * Purpose: Mongoose schema for user shipping addresses.
 * Users can store multiple addresses and mark one as default.
 * Referenced by User.addresses[] and embedded in Order documents.
 *
 * Design Decision: Addresses are stored as separate documents (not embedded
 * in User) because:
 *  1. Users can have many addresses — no subdocument array size limit concerns
 *  2. Addresses can be fetched and managed independently
 *  3. Easy to add pagination to /api/users/addresses later
 *
 * Interview Q: Why is shipping address embedded in Order instead of referenced?
 * A: At order time, we copy the address INTO the order as a snapshot.
 *    If the user later edits or deletes the address, the order history
 *    still shows the correct address that was used. This is important
 *    for invoices and delivery tracking.
 */

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // ─── Ownership ────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Recipient Info ───────────────────────────────────────────────
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
    },

    // ─── Address Details ──────────────────────────────────────────────
    addressLine: {
      type: String,
      required: [true, "Address line is required"],
      trim: true,
      maxlength: [200, "Address line cannot exceed 200 characters"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [100, "State name cannot exceed 100 characters"],
    },

    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      match: [/^\d{6}$/, "Enter a valid 6-digit postal code"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      default: "India",
      trim: true,
    },

    // ─── Default Flag ─────────────────────────────────────────────────
    // Only one address per user can be default (enforced in controller)
    isDefault: {
      type: Boolean,
      default: false,
    },
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

// ─── Index: Fast lookup by user ───────────────────────────────────────────
addressSchema.index({ user: 1 });

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
