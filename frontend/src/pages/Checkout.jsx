import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { generarFactura } from "../services/facturaService";
import { getCarrito } from "../services/carritoService";
import { useCarrito } from "../context/CarritoContext";
import "../styles/Checkout.css";

const GASTOS_ENVIO = 3.50;

const PRECIOS_CAJAS = {
  pequena: { precio: 19.99, kg: 5 },
  mediana: { precio: 34.99, kg: 9 },
  grande: { precio: 49.99, kg: 13 }
};

const DESCUENTOS_FRECUENCIA = {
  semanal: 5,
  quincenal: 3,
  mensual: 5
};

const METODOS_PAGO = [
  { id: "tarjeta", nombre: "Tarjeta de crédito/débito", icon: "💳" },
  { id: "transferencia", nombre: "Transferencia bancaria", icon: "🏦" },
  { id: "reembolso", nombre: "Contra reembolso", icon: "💵" }
];

export default function Checkout({ tipo = "pedido" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clear } = useCarrito();
  
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verFactura, setVerFactura] = useState(false);
  
  const [cliente, setCliente] = useState({
    nombre: "",
    email: "",
    direccion: "",
    cp: "",
    localidad: "",
    provincia: ""
  });

  const esSuscripcion = tipo === "suscripcion" || location.pathname === "/checkout-suscripcion";

  const calcularPrecioSuscripcion = (tamano, frecuencia) => {
    const { precio, kg } = PRECIOS_CAJAS[tamano] || PRECIOS_CAJAS.pequena;
    const descuento = DESCUENTOS_FRECUENCIA[frecuencia] || 0;
    const precioFinal = precio * (1 - descuento / 100);
    
    return { precio, precioFinal, kg, descuento };
  };

  const cargarSuscripcion = () => {
    const suscripcionData = sessionStorage.getItem("suscripcionData");
    
    if (!suscripcionData) {
      setError("No hay datos de suscripción. Por favor, configura tu caja primero.");
      setLoading(false);
      setTimeout(() => navigate("/preferencias-caja"), 2000);
      return;
    }

    const data = JSON.parse(suscripcionData);
    const { precio, precioFinal, kg, descuento } = calcularPrecioSuscripcion(data.tamano, data.frecuencia);
    
    const nombreCaja = `Caja ${data.tamano.charAt(0).toUpperCase() + data.tamano.slice(1)} - Entrega ${data.frecuencia}`;
    
    const productosSuscripcion = [{
      producto: {
        nombre: nombreCaja + (descuento > 0 ? ` (${descuento}% descuento)` : '')
      },
      cantidad_kg: 1,
      precio_unitario: precioFinal,
      kg_caja: kg,
      precioOriginal: precio,
      descuento: descuento,
      esCaja: true
    }];

    setProductos(productosSuscripcion);
    setSubtotal(precioFinal);
    setLoading(false);
  };

  const cargarCarrito = async () => {
    try {
      const data = await getCarrito();
      const items = data.items || [];

      if (items.length === 0) {
        setError("Tu carrito está vacío. Añade productos antes de continuar.");
        setLoading(false);
        setTimeout(() => navigate("/catalogo"), 2000);
        return;
      }

      setProductos(items);

      const calculoSubtotal = items.reduce((acc, item) => {
        const precio = parseFloat(item.precio_unitario) || 0;
        const cantidad = parseFloat(item.cantidad_kg) || 0;
        return acc + (precio * cantidad);
      }, 0);

      setSubtotal(calculoSubtotal);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setError("Error al cargar los datos del pedido");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (esSuscripcion) {
      cargarSuscripcion();
    } else {
      cargarCarrito();
    }
  }, [tipo, location.pathname]);

  const validarFormulario = () => {
    if (!cliente.nombre || !cliente.direccion || !cliente.cp || !cliente.localidad) {
      setMensaje("❌ Por favor completa todos los campos obligatorios");
      setTimeout(() => setMensaje(""), 4000);
      return false;
    }

    if (!cliente.email || !cliente.email.includes("@")) {
      setMensaje("❌ Por favor introduce un email válido");
      setTimeout(() => setMensaje(""), 4000);
      return false;
    }

    if (productos.length === 0) {
      setMensaje("❌ No hay productos en el pedido");
      setTimeout(() => setMensaje(""), 4000);
      return false;
    }

    return true;
  };

  const handleConfirmar = async () => {
    if (!validarFormulario()) return;

    setMensaje("⏳ Generando factura...");

    try {
      const productosFactura = productos.map(prod => ({
        nombre: prod.producto?.nombre || "Producto",
        cantidad: prod.cantidad_kg || 1,
        precio: prod.precio_unitario || 0,
      }));

      const tipoFactura = esSuscripcion ? "suscripcion" : "pedido";
      const total = subtotal + GASTOS_ENVIO;

      const factura = await generarFactura({
        tipo: tipoFactura,
        productos: productosFactura,
        subtotal,
        gastos_envio: GASTOS_ENVIO,
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
      
      if (verFactura && factura.url) {
        window.open(factura.url, "_blank");
      }

      setTimeout(async () => {
        setMensaje("");

        if (tipoFactura === "suscripcion") {
          sessionStorage.removeItem("suscripcionData");
          navigate("/");
        } else {
          try {
            await clear();
            navigate("/");
          } catch (error) {
            console.error("⚠️ Error al vaciar el carrito:", error);
            navigate("/");
          }
        }
      }, 3000);

    } catch (err) {
      console.error("Error completo:", err);
      setMensaje(`❌ Error: ${err.message}`);
      setTimeout(() => setMensaje(""), 6000);
    }
  };

  const actualizarCliente = (campo, valor) => {
    setCliente({ ...cliente, [campo]: valor });
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

  const total = subtotal + GASTOS_ENVIO;

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <h1 className="checkout-title">
          {esSuscripcion ? "Confirmar Suscripción" : "Finalizar Pedido"}
        </h1>

        <div className="checkout-grid">
          <div className="checkout-form">
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
                  onChange={(e) => actualizarCliente("nombre", e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={cliente.email}
                  onChange={(e) => actualizarCliente("email", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Dirección *"
                  value={cliente.direccion}
                  onChange={(e) => actualizarCliente("direccion", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Código Postal *"
                  value={cliente.cp}
                  onChange={(e) => actualizarCliente("cp", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Localidad *"
                  value={cliente.localidad}
                  onChange={(e) => actualizarCliente("localidad", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Provincia *"
                  value={cliente.provincia}
                  onChange={(e) => actualizarCliente("provincia", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="checkout-card">
              <div className="checkout-card-header">
                <CreditCard className="icon" />
                <h2>Método de Pago</h2>
              </div>
              <div className="checkout-card-body">
                {METODOS_PAGO.map((metodo) => (
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

            <div className="checkout-card">
              <h2>Notas del Pedido</h2>
              <textarea placeholder="Instrucciones especiales de entrega..." />
            </div>
          </div>

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
                <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#856404" }}>
                  Precio por entrega con descuento aplicado
                </p>
              </div>
            )}
            
            <div className="summary-items">
              {productos.length === 0 ? (
                <p>No hay productos</p>
              ) : (
                productos.map((prod, index) => (
                  <div key={index} className="summary-item">
                    <div>
                      <p>{prod.producto?.nombre}</p>
                      {prod.esCaja && prod.kg_caja ? (
                        <small>{prod.kg_caja} kg por caja</small>
                      ) : (
                        <small>{prod.cantidad_kg} kg</small>
                      )}
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
              <div><span>Gastos envío:</span><span>€{GASTOS_ENVIO.toFixed(2)}</span></div>
              <div className="summary-total">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={verFactura}
                onChange={(e) => setVerFactura(e.target.checked)}
              />
              Ver factura al finalizar
            </label>
            
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