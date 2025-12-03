// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { userAuthContext } from "../context/AuthContext"; // 👈 usamos el contexto
import "../styles/Registro.css"; // mismo estilo que registro

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = userAuthContext(); // 👈 obtenemos login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData); // login ya guarda token y usuario en el contexto
      navigate("/perfil");   // redirigir tras login
    } catch (err) {
      setError("Credenciales inválidas");
      console.error("Error login:", err);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <div className="logo">FRUTALUX</div>
          <h1>Iniciar Sesión</h1>
          <p>Accede a tu cuenta Frutalux</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <Mail className="icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">ENTRAR</button>

          <div className="login-link">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
