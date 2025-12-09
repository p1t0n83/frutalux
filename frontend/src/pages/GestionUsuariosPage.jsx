import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserPlus, Eye, Trash2 } from "lucide-react";
import { getUsuarios, deleteUsuario } from "../services/usuarioService";
import "../styles/GestionUsuarios.css";

const obtenerClaseTipoUsuario = (tipo) => {
  return tipo === "administrador" ? "admin" : "cliente";
};

const obtenerEtiquetaTipoUsuario = (tipo) => {
  return tipo === "administrador" ? "Admin" : "Cliente";
};

export default function GestionUsuarios() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  const filteredUsers = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.nombre?.toLowerCase().includes(searchLower) ||
      usuario.email?.toLowerCase().includes(searchLower) ||
      usuario.localidad?.toLowerCase().includes(searchLower)
    );
  });

  const handleEliminarUsuario = async (usuarioId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) {
      return;
    }

    try {
      await deleteUsuario(usuarioId);
      setUsuarios((prevUsuarios) => 
        prevUsuarios.filter((u) => u.id !== usuarioId)
      );
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("No se pudo eliminar el usuario");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleNuevoUsuario = () => {
    navigate("/admin/usuarios/nuevo");
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p className="error-popup">{error}</p>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-wrapper">
        <div className="gestion-header">
          <h1 className="gestion-title">Gestión de Usuarios</h1>
          <button className="btn-nuevo" onClick={handleNuevoUsuario}>
            <UserPlus className="w-5 h-5" />
            NUEVO USUARIO
          </button>
        </div>

        <div className="buscador-wrapper">
          <div className="buscador-input">
            <Search className="buscador-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email o localidad..."
              className="input-busqueda"
            />
          </div>
        </div>

        <div className="tabla-wrapper">
          <div className="tabla-scroll">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Teléfono</th>
                  <th>Localidad</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((usuario) => (
                  <tr key={usuario.id}>
                    <td data-label="Nombre">{usuario.nombre}</td>
                    <td data-label="Email">{usuario.email}</td>
                    <td data-label="Tipo">
                      <span className={`badge ${obtenerClaseTipoUsuario(usuario.tipo_usuario)}`}>
                        {obtenerEtiquetaTipoUsuario(usuario.tipo_usuario)}
                      </span>
                    </td>
                    <td data-label="Teléfono">{usuario.telefono}</td>
                    <td data-label="Localidad">{usuario.localidad}</td>
                    <td data-label="Estado">
                      <span className={`estado ${usuario.activo ? "activo" : "inactivo"}`}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones">
                        <Link to={`/admin/usuarios/${usuario.id}`}>
                          <button className="btn-ver">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          className="btn-borrar"
                          onClick={() => handleEliminarUsuario(usuario.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}