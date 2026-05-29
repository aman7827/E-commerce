/**
 * useLocalStorage.js
 * Purpose: Custom hook to sync React state with localStorage.
 * Used for guest cart, user preferences, and token caching.
 *
 * Interview Q: Why not just use localStorage directly?
 * A: This hook makes localStorage reactive — state updates trigger re-renders,
 *    just like useState. Direct localStorage reads don't cause re-renders.
 */

import { useState } from "react";

/**
 * useLocalStorage — State that persists in localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {[any, Function]} [storedValue, setValue]
 *
 * Usage:
 *   const [cart, setCart] = useLocalStorage("guestCart", []);
 */
const useLocalStorage = (key, initialValue) => {
  // Read from localStorage on initial render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue if nothing stored
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (e.g. corrupt JSON), return initialValue
      console.warn(`useLocalStorage: Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * setValue — Updates both React state and localStorage
   * Supports function updater pattern: setValue(prev => [...prev, newItem])
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: Error writing key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
