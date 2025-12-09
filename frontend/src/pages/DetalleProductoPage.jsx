import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  ShoppingCart,
  Leaf,
  Calendar,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getProducto } from "../services/productoService";
import { useCarrito } from "../context/CarritoContext";
import "../styles/DetalleProducto.css";

const CANTIDAD_MINIMA = 0.5;
const CANTIDAD_INICIAL = 1;

export default function DetalleProducto() {
  const { id } = useParams();
  const { addItem } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(CANTIDAD_INICIAL);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await getProducto(id);
        setProducto(data);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  const imagenes = producto?.imagenes || [];
  const imagenActual = imagenes.length > 0 
    ? imagenes[currentIndex].url_imagen 
    : "/images/default-product.jpg";

  const navegarImagenAnterior = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1
    );
  };

  const navegarImagenSiguiente = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const seleccionarImagen = (index) => {
    setCurrentIndex(index);
  };

  const mostrarMensaje = (texto, duracion = 3000) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), duracion);
  };

  const handleAddToCarrito = async () => {
    try {
      await addItem({
        producto_id: producto.id,
        cantidad_kg: parseFloat(cantidad),
        precio_unitario: producto.precio_kg,
      });
      mostrarMensaje("✅ Producto añadido al carrito");
    } catch (error) {
      console.error("Error añadiendo al carrito:", error);
      mostrarMensaje("❌ No se pudo añadir al carrito");
    }
  };

  const handleCantidadChange = (e) => {
    const nuevaCantidad = e.target.value;
    if (nuevaCantidad >= CANTIDAD_MINIMA) {
      setCantidad(nuevaCantidad);
    }
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (!producto) {
    return <p>No se encontró el producto</p>;
  }

  return (
    <div className="detalle-container">
      <div className="detalle-grid">
        <div className="detalle-images">
          <div className="detalle-main-image">
            <img src={imagenActual} alt={producto.nombre} className="detalle-cover" />
            {imagenes.length > 1 && (
              <>
                <button className="carousel-btn left" onClick={navegarImagenAnterior}>
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="carousel-btn right" onClick={navegarImagenSiguiente}>
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="detalle-thumbs">
              {imagenes.map((imagen, index) => (
                <div
                  key={imagen.id || index}
                  className={`detalle-thumb ${index === currentIndex ? "active" : ""}`}
                  onClick={() => seleccionarImagen(index)}
                >
                  <img src={imagen.url_imagen} alt={`${producto.nombre} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="detalle-info">
          <h1 className="detalle-title">{producto.nombre}</h1>
          <div className="detalle-location">
            <MapPin className="icon-small" />
            <p>
              {producto.nombre_productor || "Productor desconocido"} -{" "}
              {producto.origen || "Origen no especificado"}
            </p>
          </div>

          <div className="detalle-tags">
            <span className="tag-season">
              <Calendar className="icon-small" /> {producto.temporada || "Sin temporada"}
            </span>
            <span className="tag-category">
              <Leaf className="icon-small" /> {producto.categoria?.nombre || "Sin categoría"}
            </span>
          </div>

          <div className="detalle-price">
            €{producto.precio_kg}
            <span>/kg</span>
          </div>

          <div className="detalle-stock">
            <Award className="icon-small" />
            <span>En stock: {producto.stock_kg} kg disponibles</span>
          </div>

          <div className="detalle-description">
            <h3>Descripción</h3>
            <p>{producto.descripcion || "Sin descripción"}</p>
          </div>

          <div className="detalle-actions">
            <div>
              <label>Cantidad (kg)</label>
              <input
                type="number"
                value={cantidad}
                onChange={handleCantidadChange}
                min={CANTIDAD_MINIMA}
                step={CANTIDAD_MINIMA}
                className="detalle-input"
              />
            </div>
            <button className="detalle-button" onClick={handleAddToCarrito}>
              <ShoppingCart className="icon-small" />
              AÑADIR AL CARRITO
            </button>
          </div>

          {mensaje && (
            <div className={mensaje.includes("✅") ? "mensaje-exito" : "mensaje-error"}>
              {mensaje}
            </div>
          )}
        </div>
      </div>

      <div className="detalle-reviews">
        <h2>Valoraciones de Clientes</h2>
        {producto.valoraciones?.length > 0 ? (
          producto.valoraciones.map((valoracion, index) => (
            <div key={valoracion.id || index} className="review-card">
              <div className="review-header">
                <span className="review-name">{valoracion.nombre}</span>
                <div className="review-stars">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={starIndex < valoracion.puntuacion ? "star-filled" : "star-empty"}
                    />
                  ))}
                </div>
              </div>
              <p className="review-text">{valoracion.comentario}</p>
            </div>
          ))
        ) : (
          <p>No hay valoraciones disponibles</p>
        )}
      </div>
    </div>
  );
}