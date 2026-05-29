/**
 * useDebounce.js
 * Purpose: Custom hook to debounce rapidly changing values (e.g., search input).
 * Prevents API calls on every keystroke — waits until user stops typing.
 *
 * Interview Q: Why use debounce for search?
 * A: Without debounce, typing "laptop" would fire 6 API calls (l, la, lap...).
 *    With 300ms debounce, only 1 call fires when user stops typing.
 */

import { useState, useEffect } from "react";

/**
 * useDebounce — Returns a debounced version of the value
 * @param {any} value - The value to debounce (usually a string)
 * @param {number} delay - Milliseconds to wait (default: 300ms)
 * @returns {any} The debounced value
 *
 * Usage:
 *   const [search, setSearch] = useState("");
 *   const debouncedSearch = useDebounce(search, 300);
 *   useEffect(() => { fetchProducts(debouncedSearch); }, [debouncedSearch]);
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
