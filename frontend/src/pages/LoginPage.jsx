import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { loginUsuario } from "../services/authService";
import "../styles/Registro.css"; // mismo estilo que registro

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUsuario(formData);
      localStorage.setItem("token", res.access_token); // guardar token
      navigate("/perfil"); // redirigir tras login
    } catch (err) {
      setError(err.message);
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

          <button type="submit" className="btn-submit">ENTRAR</button>

          <div className="login-link">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
