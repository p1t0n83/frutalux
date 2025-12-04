import React, { useState, useEffect } from "react";
import { User, Package, Lock, Save, Calendar, Truck, CreditCard } from "lucide-react";
import {
  getPerfilCliente,
  updatePerfilCliente,
  updatePasswordCliente,
} from "../services/perfilClienteService";
import { getMisPedidos } from "../services/pedidoService";
import "../styles/PerfilCliente.css";

export default function PerfilCliente() {
  const [activeTab, setActiveTab] = useState("datos");
  const [formData, setFormData] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  // Mensajes separados por tab
  const [datosSuccess, setDatosSuccess] = useState("");
  const [datosError, setDatosError] = useState("");
  const [seguridadSuccess, setSeguridadSuccess] = useState("");
  const [seguridadError, setSeguridadError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const user = await getPerfilCliente();
        setFormData({
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono || "",
          direccion: user.direccion || "",
          localidad: user.localidad || "",
        });
      } catch (err) {
        setDatosError("Error al cargar perfil");
      }
    };
    cargarPerfil();
  }, []);

  // Cargar pedidos cuando se cambia a la pestaña de pedidos
 useEffect(() => {
  if (activeTab === "pedidos") {
    const cargarPedidos = async () => {
      setLoadingPedidos(true);
      try {
        const data = await getMisPedidos();
        setPedidos(data || []);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setPedidos([]);
      } finally {
        setLoadingPedidos(false);
      }
    };
    cargarPedidos();
  }
}, [activeTab]);


  const handleSave = async () => {
    try {
      await updatePerfilCliente(formData);
      setDatosSuccess("Datos actualizados correctamente");
      setDatosError("");
      setTimeout(() => setDatosSuccess(""), 3000);
    } catch (err) {
      setDatosError(err.message);
      setDatosSuccess("");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSeguridadError("Las contraseñas no coinciden");
      setSeguridadSuccess("");
      return;
    }
    try {
      await updatePasswordCliente({
        current: passwordData.currentPassword,
        new: passwordData.newPassword,
      });
      setSeguridadSuccess("Contraseña actualizada correctamente");
      setSeguridadError("");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSeguridadSuccess(""), 3000);
    } catch (err) {
      setSeguridadError(err.message);
      setSeguridadSuccess("");
    }
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      pendiente: { color: "#ffc107", bg: "#fff3cd", text: "Pendiente" },
      pagado: { color: "#28a745", bg: "#d4edda", text: "Pagado" },
      enviado: { color: "#17a2b8", bg: "#d1ecf1", text: "Enviado" },
      entregado: { color: "#28a745", bg: "#d4edda", text: "Entregado" },
      cancelado: { color: "#dc3545", bg: "#f8d7da", text: "Cancelado" },
    };
    const est = estados[estado] || estados.pendiente;
    return (
      <span
        style={{
          background: est.bg,
          color: est.color,
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {est.text}
      </span>
    );
  };

  if (!formData) return <p className="loading-text">Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-wrapper">
        <h1 className="perfil-title">Mi Perfil</h1>

        {/* Tabs */}
        <div className="perfil-tabs">
          {[
            { id: "datos", nombre: "MIS DATOS", icon: User },
            { id: "pedidos", nombre: "PEDIDOS", icon: Package },
            { id: "seguridad", nombre: "SEGURIDAD", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`perfil-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                <Icon className="tab-icon" />
                {tab.nombre}
              </button>
            );
          })}
        </div>

        {/* Tab: MIS DATOS */}
        {activeTab === "datos" && (
          <div className="perfil-card">
            <h2 className="perfil-subtitle">Información Personal</h2>

            {datosSuccess && <div className="success-popup">{datosSuccess}</div>}
            {datosError && <div className="error-popup">{datosError}</div>}

            <div className="perfil-grid">
              {[
                "nombre",
                "apellidos",
                "email",
                "telefono",
                "direccion",
                "localidad",
              ].map((field) => (
                <div
                  key={field}
                  className={field === "direccion" ? "col-span-2" : ""}
                >
                  <label className="perfil-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="perfil-input"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="perfil-btn">
              <Save className="tab-icon" />
              GUARDAR CAMBIOS
            </button>
          </div>
        )}

        {/* Tab: PEDIDOS */}
        {activeTab === "pedidos" && (
          <div className="perfil-card">
            <h2 className="perfil-subtitle">Mis Pedidos</h2>

            {loadingPedidos ? (
              <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                Cargando pedidos...
              </p>
            ) : pedidos.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <Package size={64} style={{ color: "#ddd", marginBottom: "20px" }} />
                <p style={{ color: "#999", fontSize: "16px" }}>
                  Aún no tienes pedidos realizados
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    {/* Header del pedido */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "15px",
                        paddingBottom: "15px",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 5px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#333",
                          }}
                        >
                          {pedido.numero_pedido}
                        </h3>
                        <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#666" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <Calendar size={14} />
                            {new Date(pedido.created_at).toLocaleDateString("es-ES")}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <CreditCard size={14} />
                            {pedido.metodo_pago || "Tarjeta"}
                          </span>
                        </div>
                      </div>
                      {getEstadoBadge(pedido.estado)}
                    </div>

                    {/* Detalles del pedido */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                      <div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#999" }}>
                          Tipo de pedido
                        </p>
                        <p style={{ margin: 0, fontWeight: "500" }}>
                          {pedido.tipo_pedido === "suscripcion" ? "🔄 Suscripción" : "🛒 Carrito"}
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#999" }}>
                          Entrega estimada
                        </p>
                        <p style={{ margin: 0, fontWeight: "500", display: "flex", alignItems: "center", gap: "5px" }}>
                          <Truck size={14} />
                          {pedido.fecha_entrega_estimada
                            ? new Date(pedido.fecha_entrega_estimada).toLocaleDateString("es-ES")
                            : "Por confirmar"}
                        </p>
                      </div>
                    </div>

                    {/* Dirección de envío */}
                    {pedido.direccion_envio && (
                      <div style={{ marginBottom: "15px", fontSize: "13px" }}>
                        <p style={{ margin: "0 0 5px 0", color: "#999" }}>Dirección de envío:</p>
                        <p style={{ margin: 0, color: "#666" }}>{pedido.direccion_envio}</p>
                      </div>
                    )}

                    {/* Totales */}
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "12px",
                        borderRadius: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "13px" }}>
                        <div style={{ marginBottom: "3px" }}>
                          Subtotal: <strong>€{parseFloat(pedido.subtotal || 0).toFixed(2)}</strong>
                        </div>
                        <div>
                          Envío: <strong>€{parseFloat(pedido.gastos_envio || 0).toFixed(2)}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 3px 0", fontSize: "12px", color: "#999" }}>Total</p>
                        <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#4caf50" }}>
                          €{parseFloat(pedido.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Botón de factura */}
                    {pedido.factura_url && (
                      <a
                        href={pedido.factura_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "12px",
                          padding: "8px 16px",
                          background: "#2c3e50",
                          color: "#fff",
                          borderRadius: "6px",
                          fontSize: "13px",
                          textDecoration: "none",
                          fontWeight: "500",
                        }}
                      >
                        📄 Ver Factura
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: SEGURIDAD */}
        {activeTab === "seguridad" && (
          <div className="perfil-card">
            <h2 className="perfil-subtitle">Seguridad de la Cuenta</h2>

            {seguridadSuccess && (
              <div className="success-popup">{seguridadSuccess}</div>
            )}
            {seguridadError && (
              <div className="error-popup">{seguridadError}</div>
            )}

            <div className="space-y-6">
              <div>
                <label className="perfil-label">Contraseña Actual</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="perfil-input"
                />
              </div>
              <div>
                <label className="perfil-label">Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="perfil-input"
                />
              </div>
              <div>
                <label className="perfil-label">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="perfil-input"
                />
              </div>
              <button onClick={handlePasswordChange} className="perfil-btn">
                <Lock className="tab-icon" />
                CAMBIAR CONTRASEÑA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}