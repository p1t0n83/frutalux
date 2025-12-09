import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { getUsuario, createUsuario, updateUsuario, deleteUsuario } from "../services/usuarioService";
import "../styles/DetalleUsuarioAdmin.css";

const FORM_INICIAL = {
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  telefono: "",
  direccion: "",
  codigo_postal: "",
  localidad: "",
  provincia: "",
  tipo_usuario: "cliente",
  activo: true
};

const TIPOS_USUARIO = [
  { value: "cliente", label: "Cliente" },
  { value: "admin", label: "Administrador" }
];

export default function DetalleUsuarioAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const cargarUsuario = async () => {
      try {
        const data = await getUsuario(id);
        setFormData({ ...data, password: "" });
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setError("Error al cargar usuario");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: null });
  };

  const validarFormulario = () => {
    const errors = {};
    
    if (!formData.nombre) errors.nombre = "El nombre es obligatorio";
    if (!formData.apellidos) errors.apellidos = "Los apellidos son obligatorios";
    if (!formData.email) errors.email = "El email es obligatorio";
    if (!id && !formData.password) errors.password = "La contraseña es obligatoria";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validarFormulario()) return;

    try {
      if (id) {
        await updateUsuario(id, formData);
      } else {
        await createUsuario(formData);
      }
      navigate("/gestion-usuarios");
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError("Error al guardar usuario");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    try {
      await deleteUsuario(id);
      navigate("/gestion-usuarios");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("Error al eliminar usuario");
    }
  };

  const handleActivoChange = (e) => {
    setFormData({ ...formData, activo: e.target.value === "true" });
  };

  if (loading) {
    return <p className="loading">Cargando usuario...</p>;
  }

  if (error) {
    return <p className="error-popup">{error}</p>;
  }

  return (
    <div className="detalle-container">
      <div className="detalle-wrapper">
        <div className="detalle-header">
          <Link to="/gestion-usuarios">
            <button className="btn-back">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <h1 className="detalle-title">
            {id ? "Editar Usuario" : "Nuevo Usuario"}
          </h1>
          <div className="acciones">
            {id && (
              <button className="btn-delete" onClick={handleDelete}>
                <Trash2 className="w-5 h-5" /> Eliminar
              </button>
            )}
            <button className="btn-save" onClick={handleSave}>
              <Save className="w-5 h-5" /> Guardar
            </button>
          </div>
        </div>

        <div className="form-card">
          <div className="form-grid">
            <div>
              <label>Nombre</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={validationErrors.nombre ? "input-error" : ""}
              />
              {validationErrors.nombre && (
                <p className="error-text">{validationErrors.nombre}</p>
              )}
            </div>

            <div>
              <label>Apellidos</label>
              <input
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={validationErrors.apellidos ? "input-error" : ""}
              />
              {validationErrors.apellidos && (
                <p className="error-text">{validationErrors.apellidos}</p>
              )}
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={validationErrors.email ? "input-error" : ""}
              />
              {validationErrors.email && (
                <p className="error-text">{validationErrors.email}</p>
              )}
            </div>

            {!id && (
              <div>
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={validationErrors.password ? "input-error" : ""}
                />
                {validationErrors.password && (
                  <p className="error-text">{validationErrors.password}</p>
                )}
              </div>
            )}

            <div>
              <label>Teléfono</label>
              <input 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label>Dirección</label>
              <input 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label>Código Postal</label>
              <input 
                name="codigo_postal" 
                value={formData.codigo_postal} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label>Localidad</label>
              <input 
                name="localidad" 
                value={formData.localidad} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label>Provincia</label>
              <input 
                name="provincia" 
                value={formData.provincia} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <label>Tipo de Usuario</label>
              <select 
                name="tipo_usuario" 
                value={formData.tipo_usuario} 
                onChange={handleChange}
              >
                {TIPOS_USUARIO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Estado</label>
              <select
                name="activo"
                value={formData.activo}
                onChange={handleActivoChange}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}