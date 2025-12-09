import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, PlusCircle, Eye, Trash2 } from "lucide-react";
import { getProductos, deleteProducto } from "../services/productoService";
import "../styles/GestionProductos.css";

export default function GestionProductosPage() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const filteredProductos = productos.filter((producto) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      producto.nombre?.toLowerCase().includes(searchLower) ||
      producto.origen?.toLowerCase().includes(searchLower) ||
      producto.categoria?.nombre?.toLowerCase().includes(searchLower)
    );
  });

  const handleEliminarProducto = async (productoId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
      return;
    }

    try {
      await deleteProducto(productoId);
      setProductos((prevProductos) => 
        prevProductos.filter((p) => p.id !== productoId)
      );
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("No se pudo eliminar el producto");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleNuevoProducto = () => {
    navigate("/admin/productos/nuevo");
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p className="error-popup">{error}</p>;
  }

  return (
    <div className="gestion-container">
      <div className="gestion-wrapper">
        <div className="gestion-header">
          <h1 className="gestion-title">Gestión de Productos</h1>
          <button className="btn-nuevo" onClick={handleNuevoProducto}>
            <PlusCircle className="w-5 h-5" />
            NUEVO PRODUCTO
          </button>
        </div>

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
                        <Link to={`/admin/productos/${producto.id}`}>
                          <button className="btn-ver">
                            <Eye className="w-5 h-5" />
                          </button>
                        </Link>
                        <button
                          className="btn-borrar"
                          onClick={() => handleEliminarProducto(producto.id)}
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