import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Image as ImageIcon } from "lucide-react";
import {
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  addProductoImagen,
  deleteProductoImagen,
} from "../services/productoService";
import "../styles/DetalleProductoAdmin.css";

export default function DetalleProductoAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    nombreProductor: "",
    origen: "",
    categoria: "",
    temporada: "",
    certificaciones: "",
    slug: "",
    precio_kg: "",
    stock_kg: "",
    stock_minimo: "",
    precio_oferta: "",
    descuento: "",
    coste_produccion: "",
    activo: true,
    destacado: false,
    visible_catalogo: true,
  });

  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const cargarProducto = async () => {
        try {
          const data = await getProducto(id); // ✅ ya no pasamos token, lo gestiona el service
          setFormData({ ...formData, ...data });
          setImagenes(data.imagenes || []);
        } catch (err) {
          setError("Error al cargar producto");
        } finally {
          setLoading(false);
        }
      };
      cargarProducto();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (id) {
        await updateProducto(id, formData);
      } else {
        await createProducto(formData);
      }
      navigate("/gestion-productos");
    } catch (err) {
      setError("Error al guardar producto");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProducto(id);
      navigate("/gestion-productos");
    } catch (err) {
      setError("Error al eliminar producto");
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const nueva = await addProductoImagen(id, file);
      setImagenes((prev) => [...prev, nueva]);
    } catch (err) {
      setError("Error al subir imagen");
    }
  };

  const handleDeleteImage = async (imagenId) => {
    try {
      await deleteProductoImagen(id, imagenId);
      setImagenes((prev) => prev.filter((img) => img.id !== imagenId));
    } catch (err) {
      setError("Error al borrar imagen");
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="error-popup">{error}</p>;

  return (
    <div className="detalle-container">
      <div className="detalle-header">
        <Link to="/gestion-productos">
          <button className="btn-back">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <h1>{id ? "Editar Producto" : "Nuevo Producto"}</h1>
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

      {/* Formulario principal */}
      <form className="form-section">
        <div>
          <label>Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Slug</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Precio/kg</label>
          <input
            type="number"
            step="0.01"
            name="precio_kg"
            value={formData.precio_kg}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Stock (kg)</label>
          <input
            type="number"
            step="0.1"
            name="stock_kg"
            value={formData.stock_kg}
            onChange={handleChange}
          />
        </div>
      </form>

      {/* Gestión de imágenes */}
      {id && (
        <div className="form-section">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-green-800" />
            <h2 className="text-xl font-bold text-gray-900">Imágenes</h2>
          </div>
          <div className="imagenes-grid">
            {imagenes.map((img) => (
              <div key={img.id} className="imagen-item">
                <img
                  src={img.url_imagen} // ✅ usamos directamente la URL completa
                  alt={formData.nombre}
                  className="imagen-preview"
                />
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleDeleteImage(img.id)}
                >
                  <Trash2 className="w-4 h-4" /> Borrar
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" onChange={handleAddImage} />
        </div>
      )}
    </div>
  );
}
