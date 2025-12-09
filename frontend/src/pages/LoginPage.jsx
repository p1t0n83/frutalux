import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { userAuthContext } from "../context/AuthContext";
import "../styles/Registro.css";

const FORM_INICIAL = {
  email: "",
  password: ""
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = userAuthContext();

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate("/perfil");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
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
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="juan@email.com"
                required
                disabled={loading}
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
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>

          <div className="login-link">
            ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}