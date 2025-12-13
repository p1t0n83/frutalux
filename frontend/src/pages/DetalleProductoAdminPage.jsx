import { useState, useEffect } from "react";
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
import { getCategorias } from "../services/categoriaService";
import "../styles/DetalleProductoAdmin.css";

const FORM_INICIAL = {
  nombre: "",
  descripcion: "",
  nombre_productor: "",
  origen: "",
  categoria_id: "",
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
};

export default function DetalleProductoAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [imagenes, setImagenes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [productoId, setProductoId] = useState(id);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
        console.log('Categorías cargadas:', data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };

    cargarCategorias();
  }, []);

  useEffect(() => {
    if (!id) return;

    const cargarProducto = async () => {
      try {
        const data = await getProducto(id);
        
        // Si viene categoria como objeto, extraer el id
        let categoriaId = data.categoria_id;
        if (data.categoria && typeof data.categoria === 'object') {
          categoriaId = data.categoria.id;
        }
        
        setFormData({ 
          ...FORM_INICIAL, 
          ...data,
          categoria_id: categoriaId 
        });
        setImagenes(data.imagenes || []);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("Error al cargar producto");
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    if (name === 'categoria_id') {
      finalValue = value === '' ? '' : Number(value);
      console.log('Categoría cambiada:', { value, finalValue, tipo: typeof finalValue });
    } else if (name === 'stock_kg') {
      finalValue = value === '' ? '' : parseInt(value);
    } else if (name === 'precio_kg') {
      finalValue = value === '' ? '' : parseFloat(value);
    }
    
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSave = async () => {
    try {
      console.log('FormData antes de validar:', formData);
      
      if (!formData.categoria_id) {
        setError("Debes seleccionar una categoría");
        return;
      }

      // Preparar datos para enviar solo los campos requeridos
      const dataToSend = {
        categoria_id: Number(formData.categoria_id),
        nombre: formData.nombre || '',
        slug: formData.slug || '',
        precio_kg: Number(formData.precio_kg) || 0,
        stock_kg: parseInt(formData.stock_kg) || 0,
      };

      // Añadir campos opcionales solo si tienen valor
      if (formData.nombre_productor) dataToSend.nombre_productor = formData.nombre_productor;
      if (formData.descripcion) dataToSend.descripcion = formData.descripcion;
      
      console.log('Datos a enviar:', dataToSend);
      console.log('categoria_id tipo:', typeof dataToSend.categoria_id);
      console.log('categoria_id valor:', dataToSend.categoria_id);
      
      if (productoId) {
        await updateProducto(productoId, dataToSend);
      } else {
        const nuevoProducto = await createProducto(dataToSend);
        setProductoId(nuevoProducto.id);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message || "Error al guardar producto");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
      return;
    }

    try {
      await deleteProducto(productoId);
      navigate("/gestion-productos");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("Error al eliminar producto");
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!productoId) {
      setError("Debes guardar el producto antes de añadir imágenes");
      return;
    }

    try {
      const nuevaImagen = await addProductoImagen(productoId, file);
      setImagenes((prevImagenes) => [...prevImagenes, nuevaImagen]);
      e.target.value = "";
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setError("Error al subir imagen");
    }
  };

  const handleDeleteImage = async (imagenId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) {
      return;
    }

    try {
      await deleteProductoImagen(productoId, imagenId);
      setImagenes((prevImagenes) => prevImagenes.filter((img) => img.id !== imagenId));
    } catch (err) {
      console.error("Error al borrar imagen:", err);
      setError("Error al borrar imagen");
    }
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p className="error-popup">{error}</p>;
  }

  return (
    <div className="detalle-container">
      <div className="detalle-header">
        <Link to="/gestion-productos">
          <button className="btn-back">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <h1>{productoId ? "Editar Producto" : "Nuevo Producto"}</h1>
        <div className="acciones">
          {productoId && (
            <button className="btn-delete" onClick={handleDelete}>
              <Trash2 className="w-5 h-5" /> Eliminar
            </button>
          )}
          <button className="btn-save" onClick={handleSave}>
            <Save className="w-5 h-5" /> Guardar
          </button>
        </div>
      </div>

      <form className="form-section" onSubmit={(e) => e.preventDefault()}>
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
          <label>Origen</label>
          <input
            name="origen"
            value={formData.origen}
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
          <label>Categoría</label>
          <select
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
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
            name="stock_kg"
            value={formData.stock_kg}
            onChange={handleChange}
          />
        </div>
      </form>

      {productoId && (
        <div className="form-section">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-green-800" />
            <h2 className="text-xl font-bold text-gray-900">Imágenes</h2>
          </div>
          <div className="imagenes-grid">
            {imagenes.map((imagen) => (
              <div key={imagen.id} className="imagen-item">
                <img
                  src={imagen.url_imagen}
                  alt={formData.nombre}
                  className="imagen-preview"
                />
                <button
                  type="button"
                  className="btn-delete-img"
                  onClick={() => handleDeleteImage(imagen.id)}
                >
                  <Trash2 className="w-4 h-4" /> Borrar
                </button>
              </div>
            ))}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAddImage}
          />
        </div>
      )}
    </div>
  );
}