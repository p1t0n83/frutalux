import { useState, useEffect } from "react";
import { User, Package, Lock, Save, Calendar, Truck, CreditCard } from "lucide-react";
import {
  getPerfilCliente,
  updatePerfilCliente,
  updatePasswordCliente,
} from "../services/perfilClienteService";
import { getMisPedidos } from "../services/pedidoService";
import "../styles/PerfilCliente.css";

const TABS = [
  { id: "datos", nombre: "MIS DATOS", icon: User },
  { id: "pedidos", nombre: "PEDIDOS", icon: Package },
  { id: "seguridad", nombre: "SEGURIDAD", icon: Lock },
];

const CAMPOS = [
  "nombre",
  "apellidos",
  "email",
  "telefono",
  "direccion",
  "localidad",
];

const ESTADOS = {
  pendiente: { color: "#ffc107", bg: "#fff3cd", text: "Pendiente" },
  pagado: { color: "#28a745", bg: "#d4edda", text: "Pagado" },
  enviado: { color: "#17a2b8", bg: "#d1ecf1", text: "Enviado" },
  entregado: { color: "#28a745", bg: "#d4edda", text: "Entregado" },
  cancelado: { color: "#dc3545", bg: "#f8d7da", text: "Cancelado" },
};

export default function PerfilCliente() {
  const [activeTab, setActiveTab] = useState("datos");
  const [formData, setFormData] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

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

  if (!formData) return <p className="loading-text">Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-wrapper">
        <h1 className="perfil-title">Mi Perfil</h1>

        <div className="perfil-tabs">
          {TABS.map((tab) => {
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

        {activeTab === "datos" && (
          <TabDatosPersonales
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            successMessage={datosSuccess}
            errorMessage={datosError}
          />
        )}

        {activeTab === "pedidos" && (
          <TabPedidos
            pedidos={pedidos}
            loading={loadingPedidos}
          />
        )}

        {activeTab === "seguridad" && (
          <TabSeguridad
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            handlePasswordChange={handlePasswordChange}
            successMessage={seguridadSuccess}
            errorMessage={seguridadError}
          />
        )}
      </div>
    </div>
  );
}

// ================================================
// COMPONENTES AUXILIARES
// ================================================

function AlertMessage({ message, type }) {
  if (!message) return null;
  const className = type === "success" ? "success-popup" : "error-popup";
  return <div className={className}>{message}</div>;
}

function EstadoBadge({ estado }) {
  const est = ESTADOS[estado] || ESTADOS.pendiente;
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
}

// ================================================
// COMPONENTES DE TABS
// ================================================

function TabDatosPersonales({
  formData,
  setFormData,
  handleSave,
  successMessage,
  errorMessage,
}) {
  return (
    <div className="perfil-card">
      <h2 className="perfil-subtitle">Información Personal</h2>

      <AlertMessage message={successMessage} type="success" />
      <AlertMessage message={errorMessage} type="error" />

      <div className="perfil-grid">
        {CAMPOS.map((field) => (
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
  );
}

function TabPedidos({ pedidos, loading }) {
  return (
    <div className="perfil-card">
      <h2 className="perfil-subtitle">Mis Pedidos</h2>

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          Cargando pedidos...
        </p>
      ) : pedidos.length === 0 ? (
        <EmptyPedidos />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {pedidos.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyPedidos() {
  return (
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
  );
}

function TabSeguridad({
  passwordData,
  setPasswordData,
  handlePasswordChange,
  successMessage,
  errorMessage,
}) {
  return (
    <div className="perfil-card">
      <h2 className="perfil-subtitle">Seguridad de la Cuenta</h2>

      <AlertMessage message={successMessage} type="success" />
      <AlertMessage message={errorMessage} type="error" />

      <div className="space-y-6">
        <PasswordField
          label="Contraseña Actual"
          value={passwordData.currentPassword}
          onChange={(value) =>
            setPasswordData({ ...passwordData, currentPassword: value })
          }
        />
        <PasswordField
          label="Nueva Contraseña"
          value={passwordData.newPassword}
          onChange={(value) =>
            setPasswordData({ ...passwordData, newPassword: value })
          }
        />
        <PasswordField
          label="Confirmar Nueva Contraseña"
          value={passwordData.confirmPassword}
          onChange={(value) =>
            setPasswordData({ ...passwordData, confirmPassword: value })
          }
        />
        <button onClick={handlePasswordChange} className="perfil-btn">
          <Lock className="tab-icon" />
          CAMBIAR CONTRASEÑA
        </button>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <div>
      <label className="perfil-label">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="perfil-input"
      />
    </div>
  );
}

// ================================================
// COMPONENTES DE PEDIDOS
// ================================================

function PedidoCard({ pedido }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <PedidoHeader pedido={pedido} />
      <PedidoDetalles pedido={pedido} />
      {pedido.direccion_envio && <DireccionEnvio direccion={pedido.direccion_envio} />}
      <PedidoTotales pedido={pedido} />
      {pedido.factura_url && <FacturaButton url={pedido.factura_url} />}
    </div>
  );
}

function PedidoHeader({ pedido }) {
  return (
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
      <EstadoBadge estado={pedido.estado} />
    </div>
  );
}

function PedidoDetalles({ pedido }) {
  return (
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
  );
}

function DireccionEnvio({ direccion }) {
  return (
    <div style={{ marginBottom: "15px", fontSize: "13px" }}>
      <p style={{ margin: "0 0 5px 0", color: "#999" }}>Dirección de envío:</p>
      <p style={{ margin: 0, color: "#666" }}>{direccion}</p>
    </div>
  );
}

function PedidoTotales({ pedido }) {
  return (
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
  );
}

function FacturaButton({ url }) {
  return (
    <a
      href={url}
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
  );
}