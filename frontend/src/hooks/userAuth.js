import { useState, useEffect } from "react";
import { 
  loginUsuario, 
  registrarUsuario, 
  logoutUsuario, 
  getUsuario 
} from "../services/authService";

export function userAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await getUsuario();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginUsuario(credentials);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await registrarUsuario(userData);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await logoutUsuario();
    setUser(null);
  };

  const isLoggedIn = !!user;
  const tipoUsuario = user?.tipo_usuario?.toLowerCase() || null;

  return { 
    user, 
    tipoUsuario, 
    isLoggedIn, 
    loading, 
    login, 
    register, 
    logout 
  };
}