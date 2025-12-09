// src/pages/RegistroPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Home } from "lucide-react";
import { userAuthContext } from "../context/AuthContext";
import "../styles/Registro.css";

const CAMPOS_FORMULARIO = [
  { name: "nombre", label: "Nombre", type: "text", placeholder: "Juan", icon: User, required: true, grid: true },
  { name: "apellidos", label: "Apellidos", type: "text", placeholder: "García López", icon: User, required: true, grid: true },
  { name: "email", label: "Email", type: "email", placeholder: "juan@email.com", icon: Mail, required: true },
  { name: "password", label: "Contraseña", type: "password", placeholder: "••••••••", icon: Lock, required: true },
  { name: "password_confirmation", label: "Confirmar Contraseña", type: "password", placeholder: "••••••••", icon: Lock, required: true },
  { name: "telefono", label: "Teléfono", type: "tel", placeholder: "612 345 678", icon: Phone },
  { name: "direccion", label: "Dirección", type: "text", placeholder: "Calle Mayor 23", icon: Home },
  { name: "localidad", label: "Localidad", type: "text", placeholder: "Valencia", icon: MapPin, grid: true },
  { name: "codigo_postal", label: "Código Postal", type: "text", placeholder: "46001", icon: MapPin, grid: true },
  { name: "provincia", label: "Provincia", type: "text", placeholder: "Valencia", icon: MapPin }
];

export default function RegistroPage() {
  const navigate = useNavigate();
  const { register, isLoggedIn } = userAuthContext();

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

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/perfil");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/perfil");
    } catch (err) {
      setError("Error en el registro");
      console.error("Error registro:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="registro-container">
      <div className="registro-card">
        <RegistroHeader />
        {error && <ErrorMessage message={error} />}
        <RegistroForm 
          formData={formData} 
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

// ================================================
// COMPONENTES PRINCIPALES
// ================================================

function RegistroHeader() {
  return (
    <div className="registro-header">
      <div className="logo">FRUTALUX</div>
      <h1>Crear Cuenta</h1>
      <p>Únete a la comunidad Frutalux</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}

function RegistroForm({ formData, onSubmit, onChange }) {
  // Agrupar campos que van en grid
  const camposGrid = CAMPOS_FORMULARIO.filter(c => c.grid);
  const camposSolos = CAMPOS_FORMULARIO.filter(c => !c.grid);

  return (
    <form onSubmit={onSubmit} className="registro-form">
      {/* Campos en grid (nombre y apellidos) */}
      <div className="form-grid">
        {camposGrid.slice(0, 2).map((campo) => (
          <FormField
            key={campo.name}
            campo={campo}
            value={formData[campo.name]}
            onChange={onChange}
          />
        ))}
      </div>

      {/* Campos individuales */}
      {camposSolos.map((campo) => (
        <FormField
          key={campo.name}
          campo={campo}
          value={formData[campo.name]}
          onChange={onChange}
        />
      ))}

      {/* Campos en grid (localidad y código postal) */}
      <div className="form-grid">
        {camposGrid.slice(2, 4).map((campo) => (
          <FormField
            key={campo.name}
            campo={campo}
            value={formData[campo.name]}
            onChange={onChange}
          />
        ))}
      </div>

      {/* Provincia */}
      {CAMPOS_FORMULARIO.filter(c => c.name === 'provincia').map((campo) => (
        <FormField
          key={campo.name}
          campo={campo}
          value={formData[campo.name]}
          onChange={onChange}
        />
      ))}

      <button type="submit" className="btn-submit">
        REGISTRARSE
      </button>

      <LoginLink />
    </form>
  );
}

// ================================================
// COMPONENTES DE FORMULARIO
// ================================================

function FormField({ campo, value, onChange }) {
  const Icon = campo.icon;

  return (
    <div className="form-group">
      <label>{campo.label}</label>
      <div className="input-icon">
        <Icon className="icon" />
        <input
          type={campo.type}
          value={value}
          onChange={(e) => onChange(campo.name, e.target.value)}
          placeholder={campo.placeholder}
          required={campo.required}
        />
      </div>
    </div>
  );
}

function LoginLink() {
  return (
    <div className="login-link">
      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
    </div>
  );
}