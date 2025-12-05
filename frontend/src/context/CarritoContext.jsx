import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { userAuthContext } from "./AuthContext";
import {
  getCarrito,
  addItem as addItemApi,
  updateItem as updateItemApi,
  removeItem as removeItemApi,
  clearCarrito as clearCarritoApi,
} from "../services/carritoService";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { user, loading: authLoading } = userAuthContext();
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar carrito cuando el usuario está disponible
  const bootstrap = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setCarrito(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Recuperar carrito del usuario autenticado
      const c = await getCarrito();
      setCarrito(c);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const refresh = async () => {
    const c = await getCarrito();
    setCarrito(c);
  };

  const addItem = async (payload) => {
    const c = await addItemApi(payload);
    setCarrito(c);
  };

  const updateItem = async (itemId, cantidad_kg) => {
    const c = await updateItemApi(itemId, cantidad_kg);
    setCarrito(c);
  };

  const removeItem = async (itemId) => {
    const c = await removeItemApi(itemId);
    setCarrito(c);
  };

  const clear = async () => {
    const c = await clearCarritoApi();
    setCarrito(c);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, loading, refresh, addItem, updateItem, removeItem, clear }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito must be used within CarritoProvider");
  return ctx;
}
