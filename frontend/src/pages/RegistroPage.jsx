import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Home } from "lucide-react";
import { registrarUsuario } from "../services/authService";
import "../styles/Registro.css";

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    password_confirmation: "",
    telefono: "",
    direccion: "",
    localidad: "",
    codigo_postal: "",
    provincia: ""
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registrarUsuario(formData);
      localStorage.setItem("token", res.access_token); // guardar token
      navigate("/perfil"); // redirigir tras registro
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <div className="logo">FRUTALUX</div>
          <h1>Crear Cuenta</h1>
          <p>Únete a la comunidad Frutalux</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <div className="input-icon">
                <User className="icon" />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Juan"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                placeholder="García López"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <Mail className="icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-icon">
              <Lock className="icon" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <div className="input-icon">
              <Phone className="icon" />
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="612 345 678"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <div className="input-icon">
              <Home className="icon" />
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Calle Mayor 23"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Localidad</label>
              <div className="input-icon">
                <MapPin className="icon" />
                <input
                  type="text"
                  value={formData.localidad}
                  onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
                  placeholder="Valencia"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Código Postal</label>
              <input
                type="text"
                value={formData.codigo_postal}
                onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                placeholder="46001"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Provincia</label>
            <input
              type="text"
              value={formData.provincia}
              onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
              placeholder="Valencia"
            />
          </div>

          <button type="submit" className="btn-submit">REGISTRARSE</button>

          <div className="login-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
