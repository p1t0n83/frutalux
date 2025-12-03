// src/pages/GestionProductosPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, PlusCircle, Eye, Trash2 } from "lucide-react";
import { getProductos, deleteProducto } from "../services/productoService";
import "../styles/GestionProductos.css";

export default function GestionProductosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar productos");
      }
    };
    cargarProductos();
  }, []);

  const filteredProductos = productos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <p className="error-popup">{error}</p>;

  return (
    <div className="gestion-container">
      <div className="gestion-wrapper">
        <div className="gestion-header">
          <h1 className="gestion-title">Gestión de Productos</h1>
          <button
            className="btn-nuevo"
            onClick={() => navigate("/admin/productos/nuevo")}
          >
            <PlusCircle className="w-5 h-5" />
            NUEVO PRODUCTO
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
              placeholder="Buscar por nombre, origen o categoría..."
              className="input-busqueda"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="tabla-wrapper">
          <div className="tabla-scroll">
            <table className="tabla-productos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Productor</th>
                  <th>Origen</th>
                  <th>Categoría</th>
                  <th>Precio/kg</th>
                  <th>Stock</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.nombre_productor || "Desconocido"}</td>
                    <td>{producto.origen || "Sin origen"}</td>
                    <td>{producto.categoria?.nombre || "Sin categoría"}</td>
                    <td>€{producto.precio_kg}</td>
                    <td>{producto.stock_kg} kg</td>
                    <td>
                      <div className="acciones">
                        {/* Ver detalle */}
                        <Link to={`/admin/productos/${producto.id}`}>
                          <button className="btn-ver">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                        {/* Borrar */}
                        <button
                          className="btn-borrar"
                          onClick={async () => {
                            try {
                              await deleteProducto(producto.id);
                              setProductos((prev) =>
                                prev.filter((p) => p.id !== producto.id)
                              );
                            } catch (err) {
                              setError("No se pudo borrar el producto");
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

        {filteredProductos.length === 0 && (
          <div className="no-results">
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
