import React, { useState, useEffect } from "react";
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
import { fetchProductoById } from "../services/productosService";
import { useCarrito } from "../context/CarritoContext"; 
import "../styles/DetalleProducto.css";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mensaje, setMensaje] = useState(""); // 👈 estado para mensaje

  const { addItem } = useCarrito();

  useEffect(() => {
    fetchProductoById(id)
      .then(setProducto)
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  if (!producto) return <p>Cargando producto...</p>;

  const imagenes = producto.imagenes || [];
  const portada =
    imagenes.length > 0 ? imagenes[currentIndex].url_imagen : "/images/default-product.jpg";

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCarrito = async () => {
    try {
      await addItem({
        producto_id: producto.id,
        cantidad_kg: parseFloat(cantidad),
        precio_unitario: producto.precio_kg,
      });
      setMensaje("✅ Producto añadido al carrito");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("Error añadiendo al carrito:", err);
      setMensaje("❌ No se pudo añadir al carrito");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="detalle-container">
      <div className="detalle-grid">
        {/* Carrusel de imágenes */}
        <div className="detalle-images">
          <div className="detalle-main-image">
            <img src={portada} alt={producto.nombre} className="detalle-cover" />
            {imagenes.length > 1 && (
              <>
                <button className="carousel-btn left" onClick={prevImage}>
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="carousel-btn right" onClick={nextImage}>
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="detalle-thumbs">
              {imagenes.map((img, i) => (
                <div
                  key={i}
                  className={`detalle-thumb ${i === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                >
                  <img src={img.url_imagen} alt={`${producto.nombre} ${i}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
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
                onChange={(e) => setCantidad(e.target.value)}
                min="0.5"
                step="0.5"
                className="detalle-input"
              />
            </div>
            <button className="detalle-button" onClick={handleAddToCarrito}>
              <ShoppingCart className="icon-small" />
              AÑADIR AL CARRITO
            </button>
          </div>

          {/* Mensaje debajo del botón */}
          {mensaje && (
            <div className={mensaje.includes("✅") ? "mensaje-exito" : "mensaje-error"}>
              {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* Valoraciones */}
      <div className="detalle-reviews">
        <h2>Valoraciones de Clientes</h2>
        {producto.valoraciones?.length > 0 ? (
          producto.valoraciones.map((val, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <span className="review-name">{val.nombre}</span>
                <div className="review-stars">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={idx < val.puntuacion ? "star-filled" : "star-empty"}
                    />
                  ))}
                </div>
              </div>
              <p className="review-text">{val.comentario}</p>
            </div>
          ))
        ) : (
          <p>No hay valoraciones disponibles</p>
        )}
      </div>
    </div>
  );
}
