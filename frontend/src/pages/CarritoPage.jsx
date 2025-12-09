import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import "../styles/Carrito.css";
import { useCarrito } from "../context/CarritoContext"; 

const CANTIDAD_MINIMA = 0.5;
const GASTOS_ENVIO = 3.50;

export default function CarritoPage() {
  const { carrito, loading, updateItem, removeItem, clear } = useCarrito();

  const items = carrito?.items || [];

  const handleCantidadChange = async (itemId, newCantidad) => {
    if (newCantidad >= CANTIDAD_MINIMA) {
      try {
        await updateItem(itemId, newCantidad);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  const handleClearCarrito = async () => {
    try {
      await clear();
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.cantidad_kg) * parseFloat(item.precio_unitario)),
    0
  );
  const total = subtotal + GASTOS_ENVIO;

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
                        <button onClick={() => handleCantidadChange(item.id, parseFloat(item.cantidad_kg) - 0.5)}>-</button>
                        <span>{Number(item.cantidad_kg).toFixed(1)} kg</span>
                        <button onClick={() => handleCantidadChange(item.id, parseFloat(item.cantidad_kg) + 0.5)}>+</button>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="btn-remove">
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
                <span>€{GASTOS_ENVIO.toFixed(2)}</span>
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
              <button onClick={handleClearCarrito} className="btn-remove full mt-3">
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}