/**
 * formatCurrency.js
 * Purpose: Utility to format numbers as Indian Rupee currency strings.
 * Used throughout the app for consistent price display.
 */

/**
 * formatCurrency — Formats a number as INR currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string e.g. "₹1,299.00"
 *
 * Interview Q: Why use Intl.NumberFormat instead of manual formatting?
 * A: It's built-in, handles locale-specific formatting automatically,
 *    and is more maintainable than custom string manipulation.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * formatCurrencyDetailed — With paise (decimals)
 * @param {number} amount - The amount to format
 * @returns {string} e.g. "₹1,299.99"
 */
export const formatCurrencyDetailed = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
