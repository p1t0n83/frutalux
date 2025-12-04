// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { generarFactura } from "../services/facturaService";
import { getCarrito, clearCarrito } from "../services/carritoService";
import "../styles/Checkout.css";

export default function Checkout({ tipo = "pedido" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [gastosEnvio, setGastosEnvio] = useState(3.50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Datos del cliente
  const [cliente, setCliente] = useState({
    nombre: "",
    email: "",
    direccion: "",
    cp: "",
    localidad: "",
    provincia: ""
  });

  // Cargar datos según el tipo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Si es suscripción, cargar datos de sessionStorage
        if (tipo === "suscripcion" || location.pathname === "/checkout-suscripcion") {
          const suscripcionData = sessionStorage.getItem("suscripcionData");
          
          if (!suscripcionData) {
            setError("No hay datos de suscripción. Por favor, configura tu caja primero.");
            setLoading(false);
            setTimeout(() => navigate("/preferencias-caja"), 2000);
            return;
          }

          const data = JSON.parse(suscripcionData);
          
          // Precios base según tamaño
          let precioBase = 0;
          let kg = 0;
          
          if (data.tamano === "pequena") {
            precioBase = 19.99;
            kg = 5;
          } else if (data.tamano === "mediana") {
            precioBase = 34.99;
            kg = 9;
          } else {
            precioBase = 49.99;
            kg = 13;
          }
          
          // Aplicar descuento según frecuencia
          let precioFinal = precioBase;
          let descuento = 0;

          // CORRECCIÓN: Aplicar los descuentos correctos según la frecuencia
          if (data.frecuencia === "semanal") {
            descuento = 5; // 5% descuento para entrega semanal
            precioFinal = precioBase * 0.95;
          } else if (data.frecuencia === "quincenal") {
            descuento = 3; // 3% descuento para entrega quincenal (NO 5%)
            precioFinal = precioBase * 0.97;
          } else if (data.frecuencia === "mensual") {
            descuento = 5; // 5% descuento para entrega mensual (NO 10%)
            precioFinal = precioBase * 0.95;
          }

          // El nombre del producto también debería reflejar la frecuencia correctamente
          const nombreCaja = `Caja ${data.tamano.charAt(0).toUpperCase() + data.tamano.slice(1)} - Entrega ${data.frecuencia}`;

          // Crear producto de suscripción
          const productosSuscripcion = [
            {
              producto: { 
                nombre: nombreCaja + (descuento > 0 ? ` (${descuento}% descuento)` : '')
              },
              cantidad_kg: 1,
              precio_unitario: precioFinal,
              kg_caja: kg,
              precioOriginal: precioBase,
              descuento: descuento,
              esCaja: true
            }
          ];
          
          setProductos(productosSuscripcion);
          setSubtotal(precioFinal); // Solo el precio de UNA caja
          setLoading(false);
          return;
        }

        // Si es pedido normal, cargar carrito (puede tener múltiples productos)
        const data = await getCarrito();
        const items = data.items || [];
        
        if (items.length === 0) {
          setError("Tu carrito está vacío. Añade productos antes de continuar.");
          setLoading(false);
          setTimeout(() => navigate("/catalogo"), 2000);
          return;
        }

        setProductos(items);

        // Calcular subtotal multiplicando precio * cantidad para productos normales
        const sub = items.reduce((acc, item) => {
          const precio = parseFloat(item.precio_unitario) || 0;
          const cantidad = parseFloat(item.cantidad_kg) || 0;
          return acc + (precio * cantidad);
        }, 0);
        
        setSubtotal(sub);
        setLoading(false);

      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los datos del pedido");
        setLoading(false);
      }
    };

    cargarDatos();
  }, [tipo, location.pathname, navigate]);

  const total = subtotal + gastosEnvio;

  const handleConfirmar = async () => {
    // Validar datos del cliente
    if (!cliente.nombre || !cliente.direccion || !cliente.cp || !cliente.localidad) {
        setMensaje("❌ Por favor completa todos los campos obligatorios");
        setTimeout(() => setMensaje(""), 4000);
        return;
    }

    // Validar email
    if (!cliente.email || !cliente.email.includes("@")) {
        setMensaje("❌ Por favor introduce un email válido");
        setTimeout(() => setMensaje(""), 4000);
        return;
    }

    // Validar que haya productos
    if (productos.length === 0) {
        setMensaje("❌ No hay productos en el pedido");
        setTimeout(() => setMensaje(""), 4000);
        return;
    }

    setMensaje("⏳ Generando factura...");

    try {
        const productosFactura = productos.map(prod => ({
            nombre: prod.producto?.nombre || "Producto",
            cantidad: prod.cantidad_kg || 1,
            precio: prod.precio_unitario || 0,
        }));

        const tipoFactura = tipo === "suscripcion" || location.pathname === "/checkout-suscripcion" 
            ? "suscripcion" 
            : "pedido";
        
       

        const factura = await generarFactura({
            tipo: tipoFactura,
            productos: productosFactura,
            subtotal,
            gastos_envio: gastosEnvio,
            total,
            metodoPago,
            cliente_nombre: cliente.nombre,
            cliente_email: cliente.email,
            cliente_direccion: cliente.direccion,
            cliente_cp: cliente.cp,
            cliente_localidad: cliente.localidad,
            cliente_provincia: cliente.provincia
        });

        setMensaje("✅ Pedido confirmado con éxito. Factura generada.");
        window.open(factura.url, "_blank");

        // NUEVA FUNCIONALIDAD: Redirigir al inicio y vaciar carrito si es pedido
        setTimeout(() => {
            setMensaje("");
            
            // Limpiar sessionStorage si es suscripción
            if (tipoFactura === "suscripcion") {
                sessionStorage.removeItem("suscripcionData");
            } else {
                // Si es pedido normal, vaciar el carrito
                try {
                    // Intentar vaciar carrito a través del servicio
                    clearCarrito();
                    
                    // También limpiar localStorage/sessionStorage como respaldo
                    localStorage.removeItem("carrito");
                    localStorage.removeItem("cartItems");
                    sessionStorage.removeItem("carrito");
                    sessionStorage.removeItem("cartItems");
                } catch (error) {
                    console.warn("No se pudo vaciar el carrito automáticamente:", error);
                    // El pedido ya se completó, solo mostramos advertencia
                }
            }
            
            // REDIRECCIÓN: Siempre al inicio (home)
            navigate("/");
        }, 3000);

    } catch (err) {
        console.error("Error completo:", err);
        setMensaje(`❌ Error: ${err.message}`);
        setTimeout(() => setMensaje(""), 6000);
    }
};

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <p style={{ textAlign: "center", padding: "40px" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="checkout-wrapper">
          <div style={{
            background: "#fee",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            color: "#c00"
          }}>
            <AlertCircle size={48} style={{ marginBottom: "10px" }} />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const esSuscripcion = tipo === "suscripcion" || location.pathname === "/checkout-suscripcion";

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">
          {esSuscripcion ? "Confirmar Suscripción" : "Finalizar Pedido"}
        </h1>

        <div className="checkout-grid">
          {/* Formulario */}
          <div className="checkout-form">
            {/* Dirección */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <Truck className="icon" />
                <h2>Datos de Envío</h2>
              </div>
              <div className="checkout-card-body">
                <input 
                  type="text" 
                  placeholder="Nombre completo *" 
                  value={cliente.nombre}
                  onChange={(e) => setCliente({...cliente, nombre: e.target.value})}
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email *" 
                  value={cliente.email}
                  onChange={(e) => setCliente({...cliente, email: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Dirección *" 
                  value={cliente.direccion}
                  onChange={(e) => setCliente({...cliente, direccion: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Código Postal *" 
                  value={cliente.cp}
                  onChange={(e) => setCliente({...cliente, cp: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Localidad *" 
                  value={cliente.localidad}
                  onChange={(e) => setCliente({...cliente, localidad: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Provincia *" 
                  value={cliente.provincia}
                  onChange={(e) => setCliente({...cliente, provincia: e.target.value})}
                  required
                />
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
            {esSuscripcion && (
              <div style={{
                background: "#fff3cd",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "13px",
                border: "1px solid #ffc107"
              }}>
                <strong>🔄 Suscripción activa</strong>
                <p style={{margin: "5px 0 0 0", fontSize: "12px", color: "#856404"}}>
                  Precio por entrega con descuento aplicado
                </p>
              </div>
            )}
            <div className="summary-items">
              {productos.length === 0 ? (
                <p>No hay productos</p>
              ) : (
                productos.map((prod, i) => (
                  <div key={i} className="summary-item">
                    <div>
                      <p>{prod.producto?.nombre}</p>
                      {/* Si es caja de suscripción, mostrar kg de la caja */}
                      {prod.esCaja && prod.kg_caja ? (
                        <small>{prod.kg_caja} kg por caja</small>
                      ) : (
                        <small>{prod.cantidad_kg} kg</small>
                      )}
                      {/* Mostrar precio original tachado si hay descuento */}
                      {prod.descuento > 0 && (
                        <div style={{ fontSize: "11px", color: "#4caf50", marginTop: "2px" }}>
                          <span style={{ textDecoration: "line-through", color: "#999", marginRight: "5px" }}>
                            €{prod.precioOriginal?.toFixed(2)}
                          </span>
                          -{prod.descuento}%
                        </div>
                      )}
                    </div>
                    <span>€{parseFloat(prod.precio_unitario).toFixed(2)}</span>
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
              <CheckCircle className="icon" /> 
              {esSuscripcion ? "CONFIRMAR SUSCRIPCIÓN" : "CONFIRMAR PEDIDO"}
            </button>

            {mensaje && (
              <div className={
                mensaje.includes("✅") ? "mensaje-exito" : 
                mensaje.includes("⏳") ? "mensaje-info" : 
                "mensaje-error"
              }>
                {mensaje}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}