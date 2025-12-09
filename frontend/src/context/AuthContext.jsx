
import { createContext, useContext } from "react";
import { userAuth } from "../hooks/userAuth"; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const value = userAuth(); 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function userAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}
