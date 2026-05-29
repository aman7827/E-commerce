/**
 * AuthContext.jsx
 * Purpose: Global authentication state management.
 * Provides user, token, login(), logout(), register() to all components.
 * Full implementation in Phase 8.
 */

import React, { createContext, useContext } from "react";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
