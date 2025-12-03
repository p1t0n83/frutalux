import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import "../styles/Carrito.css";
import { getCarrito, updateItem, removeItem, clearCarrito } from "../services/carritoService";
import { userAuthContext } from "../context/AuthContext"; // 👈 usa el hook correcto

export default function CarritoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = userAuthContext(); // 👈 obtenemos el usuario logueado

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // 👈 si no hay usuario, no pedimos nada
      try {
        const data = await getCarrito(); // 👈 ya no pasamos user.id
        setItems(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const updateCantidad = async (itemId, newCantidad) => {
    if (newCantidad >= 0.5 && user) {
      try {
        const actualizado = await updateItem(itemId, newCantidad);
        setItems(actualizado.items || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeItemFromCarrito = async (itemId) => {
    if (user) {
      try {
        const actualizado = await removeItem(itemId);
        setItems(actualizado.items || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const vaciarCarrito = async () => {
    if (user) {
      try {
        const actualizado = await clearCarrito();
        setItems(actualizado.items || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.cantidad_kg) * parseFloat(item.precio_unitario)),
    0
  );
  const gastosEnvio = 3.50;
  const total = subtotal + gastosEnvio;

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <div className="carrito-container">
      <div className="content-wrapper">
        <div className="carrito-header">
          <ShoppingBag className="icon-large" />
          <h1>Mi Carrito</h1>
        </div>

        {items.length === 0 ? (
          <div className="carrito-empty">
            <ShoppingBag className="icon-empty" />
            <p>Tu carrito está vacío</p>
            <Link to="/catalogo">
              <button className="btn-primary">IR AL CATÁLOGO</button>
            </Link>
          </div>
        ) : (
          <div className="carrito-grid">
            <div className="carrito-items">
              {items.map((item) => (
                <div key={item.id} className="carrito-item">
                  <div className="item-image">
                    <span className="emoji">🥬</span>
                  </div>
                  <div className="item-info">
                    <h3>{item.producto?.nombre}</h3>
                    <p className="productor">{item.producto?.productor}</p>
                    <p className="precio-unitario">
                      €{Number(item.precio_unitario).toFixed(2)}/kg
                    </p>
                    
                    <div className="item-actions">
                      <div className="cantidad-control">
                        <button onClick={() => updateCantidad(item.id, parseFloat(item.cantidad_kg) - 0.5)}>-</button>
                        <span>{Number(item.cantidad_kg).toFixed(1)} kg</span>
                        <button onClick={() => updateCantidad(item.id, parseFloat(item.cantidad_kg) + 0.5)}>+</button>
                      </div>
                      <button onClick={() => removeItemFromCarrito(item.id)} className="btn-remove">
                        <Trash2 className="icon-small" /> Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    <p>
                      €{(parseFloat(item.cantidad_kg) * parseFloat(item.precio_unitario)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="carrito-resumen">
              <h2>Resumen</h2>
              <div className="resumen-line">
                <span>Subtotal:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="resumen-line">
                <span>Gastos envío:</span>
                <span>€{gastosEnvio.toFixed(2)}</span>
              </div>
              <div className="resumen-total">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <button className="btn-primary full">
                  PROCEDER AL PAGO <ArrowRight className="icon-small" />
                </button>
              </Link>
              <Link to="/catalogo">
                <button className="btn-secondary full">SEGUIR COMPRANDO</button>
              </Link>
              <button onClick={vaciarCarrito} className="btn-remove full mt-3">
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
