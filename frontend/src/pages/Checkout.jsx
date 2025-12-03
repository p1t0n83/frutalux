import React, { useState, useEffect } from "react";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import { generarFactura } from "../services/facturaService";
import { getCarrito } from "../services/carritoService"; // 👈 usamos el service
import "../styles/Checkout.css";

export default function Checkout() {
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [gastosEnvio, setGastosEnvio] = useState(3.50);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar carrito usando el service
  useEffect(() => {
    getCarrito()
      .then(data => {
       

        // El controlador devuelve { items: [...] }
        const items = data.items || [];
        setProductos(items);

        // Calcular subtotal con cantidad_kg y precio_unitario
        const sub = items.reduce((acc, item) => {
          const precio = parseFloat(item.precio_unitario) || 0;
          const cantidad = parseFloat(item.cantidad_kg) || 0;
          return acc + precio * cantidad;
        }, 0);
        setSubtotal(sub);

        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando carrito", err);
        setLoading(false);
      });
  }, []);

  const total = subtotal + gastosEnvio;

  const handleConfirmar = async () => {
  try {
    const productosFactura = productos.map(prod => ({
      nombre: prod.producto?.nombre || "Producto",
      cantidad: prod.cantidad_kg,
      precio: prod.precio_unitario,
    }));

    const factura = await generarFactura({
      productos: productosFactura,
      subtotal,
      gastos_envio: gastosEnvio,
      total,
      metodoPago,
    });

    setMensaje("✅ Pedido confirmado con éxito. Factura generada.");
    // Abrir el blob en nueva pestaña
    window.open(factura.url, "_blank");

    setTimeout(() => setMensaje(""), 4000);
  } catch (err) {
    console.error(err);
    setMensaje("❌ Error al confirmar el pedido");
    setTimeout(() => setMensaje(""), 4000);
  }
};


  if (loading) return <p>Cargando carrito...</p>;

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">Finalizar Pedido</h1>

        <div className="checkout-grid">
          {/* Formulario */}
          <div className="checkout-form">
            {/* Dirección */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <Truck className="icon" />
                <h2>Dirección de Envío</h2>
              </div>
              <div className="checkout-card-body">
                <input type="text" placeholder="Dirección" />
                <input type="text" placeholder="Código Postal" />
                <input type="text" placeholder="Localidad" />
                <input type="text" placeholder="Provincia" />
              </div>
            </div>

            {/* Método de pago */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <CreditCard className="icon" />
                <h2>Método de Pago</h2>
              </div>
              <div className="checkout-card-body">
                {[
                  { id: "tarjeta", nombre: "Tarjeta de crédito/débito", icon: "💳" },
                  { id: "transferencia", nombre: "Transferencia bancaria", icon: "🏦" },
                  { id: "reembolso", nombre: "Contra reembolso", icon: "💵" }
                ].map((metodo) => (
                  <label
                    key={metodo.id}
                    className={`metodo-pago ${metodoPago === metodo.id ? "activo" : ""}`}
                  >
                    <input
                      type="radio"
                      name="pago"
                      value={metodo.id}
                      checked={metodoPago === metodo.id}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    <span className="icon-text">{metodo.icon}</span>
                    {metodo.nombre}
                  </label>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="checkout-card">
              <h2>Notas del Pedido</h2>
              <textarea placeholder="Instrucciones especiales de entrega..." />
            </div>
          </div>

          {/* Resumen */}
          <div className="checkout-summary">
            <h2>Tu Pedido</h2>
            <div className="summary-items">
              {productos.length === 0 ? (
                <p>No hay productos en el carrito</p>
              ) : (
                productos.map((prod, i) => (
                  <div key={i} className="summary-item">
                    <div>
                      <p>{prod.producto?.nombre}</p>
                      <small>{prod.cantidad_kg} kg</small>
                    </div>
                    <span>€{prod.precio_unitario}</span>
                  </div>
                ))
              )}
            </div>
            <div className="summary-totals">
              <div><span>Subtotal:</span><span>€{subtotal.toFixed(2)}</span></div>
              <div><span>Gastos envío:</span><span>€{gastosEnvio.toFixed(2)}</span></div>
              <div className="summary-total">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-confirmar" onClick={handleConfirmar}>
              <CheckCircle className="icon" /> CONFIRMAR PEDIDO
            </button>

            {mensaje && (
              <div className={mensaje.includes("✅") ? "mensaje-exito" : "mensaje-error"}>
                {mensaje}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
