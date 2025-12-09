import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

  const bootstrap = useCallback(async () => {
    if (authLoading) return;
    
    if (!user) {
      setCarrito(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const carritoData = await getCarrito();
      setCarrito(carritoData);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const refresh = async () => {
    const carritoData = await getCarrito();
    setCarrito(carritoData);
  };

  const addItem = async (payload) => {
    const carritoData = await addItemApi(payload);
    setCarrito(carritoData);
  };

  const updateItem = async (itemId, cantidad_kg) => {
    const carritoData = await updateItemApi(itemId, cantidad_kg);
    setCarrito(carritoData);
  };

  const removeItem = async (itemId) => {
    const carritoData = await removeItemApi(itemId);
    setCarrito(carritoData);
  };

  const clear = async () => {
    const carritoData = await clearCarritoApi();
    setCarrito(carritoData);
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
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito must be used within CarritoProvider");
  return context;
}