/**
 * CartContext.jsx
 * Purpose: Global cart state — guest + logged-in cart management.
 * Full implementation in Phase 8.
 */

import React, { createContext, useContext } from "react";

export const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  return <CartContext.Provider value={{ cartItems: [], itemCount: 0, total: 0 }}>{children}</CartContext.Provider>;
}
