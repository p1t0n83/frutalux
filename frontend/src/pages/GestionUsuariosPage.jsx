import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserPlus, Eye, Trash2 } from "lucide-react";
import { getUsuarios, deleteUsuario } from "../services/usuarioService";
import "../styles/GestionUsuarios.css";

export default function GestionUsuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (err) {
        setError("Error al cargar usuarios");
      }
    };
    cargarUsuarios();
  }, []);

  const filteredUsers = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.localidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <p className="error-popup">{error}</p>;

  return (
    <div className="gestion-container">
      <div className="gestion-wrapper">
        <div className="gestion-header">
          <h1 className="gestion-title">Gestión de Usuarios</h1>
          <button className="btn-nuevo" onClick={() => navigate("/admin/usuarios/nuevo")}>
            <UserPlus className="w-5 h-5" />
            NUEVO USUARIO
          </button>
        </div>

        {/* Buscador */}
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

        {/* Tabla */}
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
                      <span
                        className={`badge ${usuario.tipo_usuario === "administrador"
                          ? "admin"
                          : "cliente"
                          }`}
                      >
                        {usuario.tipo_usuario === "administrador"
                          ? "Admin"
                          : "Cliente"}
                      </span>
                    </td>
                    <td data-label="Teléfono">{usuario.telefono}</td>
                    <td data-label="Localidad">{usuario.localidad}</td>
                    <td data-label="Estado">
                      <span
                        className={`estado ${usuario.activo ? "activo" : "inactivo"
                          }`}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones">
                        {/* Aquí pasamos el id en la ruta */}
                        <Link to={`/admin/usuarios/${usuario.id}`}>
                          <button className="btn-ver">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          className="btn-borrar"
                          onClick={async () => {
                            try {
                              await deleteUsuario(usuario.id);
                              setUsuarios((prev) =>
                                prev.filter((u) => u.id !== usuario.id)
                              );
                            } catch (err) {
                              setError("No se pudo borrar el usuario");
                            }
                          }}
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