/**
 * validateForm.js
 * Purpose: Shared form validation rules for React Hook Form.
 * Centralizes all validation logic so rules are consistent across all forms.
 * Import specific rules into form components as needed.
 */

/**
 * Validation rules for common form fields.
 * Used with React Hook Form's register({ ...rules.email })
 */
export const rules = {
  // ─── Name ───────────────────────────────────────────────────────
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 50, message: "Name must be under 50 characters" },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message: "Name can only contain letters, spaces, hyphens, and apostrophes",
    },
  },

  // ─── Email ──────────────────────────────────────────────────────
  email: {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Enter a valid email address",
    },
  },

  // ─── Password ────────────────────────────────────────────────────
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Password must contain uppercase, lowercase, and a number",
    },
  },

  // ─── Phone ──────────────────────────────────────────────────────
  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: "Enter a valid 10-digit Indian mobile number",
    },
  },

  // ─── Pincode ────────────────────────────────────────────────────
  postalCode: {
    required: "Postal code is required",
    pattern: {
      value: /^\d{6}$/,
      message: "Enter a valid 6-digit postal code",
    },
  },

  // ─── Product Price ───────────────────────────────────────────────
  price: {
    required: "Price is required",
    min: { value: 0, message: "Price must be positive" },
    validate: (value) => !isNaN(value) || "Price must be a number",
  },

  // ─── Product Stock ───────────────────────────────────────────────
  stock: {
    required: "Stock is required",
    min: { value: 0, message: "Stock cannot be negative" },
    validate: (value) => Number.isInteger(Number(value)) || "Stock must be a whole number",
  },
};
