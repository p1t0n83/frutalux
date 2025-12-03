import React, { useState, useEffect } from "react";
import { User, Package, Bell, Lock, Save } from "lucide-react";
import {
  getPerfilCliente,
  updatePerfilCliente,
  updatePasswordCliente,
} from "../services/perfilClienteService";
import "../styles/PerfilCliente.css";

export default function PerfilCliente() {
  const [activeTab, setActiveTab] = useState("datos");
  const [formData, setFormData] = useState(null);
  const [pedidos, setPedidos] = useState([]);

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
        setPedidos(user.pedidos || []);
      } catch (err) {
        setDatosError("Error al cargar perfil");
      }
    };
    cargarPerfil();
  }, []);

  const handleSave = async () => {
    try {
      await updatePerfilCliente(formData);
      setDatosSuccess("Datos actualizados correctamente");
      setDatosError("");
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
        currentPassword: passwordData.newPassword,
        newPassword: "",
        confirmPassword: "",
      });
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

        {/* Tabs */}
        <div className="perfil-tabs">
          {[
            { id: "datos", nombre: "MIS DATOS", icon: User },
            { id: "pedidos", nombre: "PEDIDOS", icon: Package },
            { id: "notificaciones", nombre: "NOTIFICACIONES", icon: Bell },
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
