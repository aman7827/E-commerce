/**
 * WishlistContext.jsx
 * Purpose: Global wishlist state management.
 * Full implementation in Phase 8.
 */

import React, { createContext, useContext } from "react";

export const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  return <WishlistContext.Provider value={{ wishlistItems: [] }}>{children}</WishlistContext.Provider>;
}
