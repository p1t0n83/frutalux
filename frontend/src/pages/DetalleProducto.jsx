import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, ShoppingCart, Leaf, Calendar, Award } from "lucide-react";
import { fetchProductoById } from "../services/productosService";
import "../styles/DetalleProducto.css";

export default function DetalleProducto() {
  const { id } = useParams(); // 👈 id dinámico de la URL
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetchProductoById(id)
      .then(setProducto)
      .catch((err) => console.error("Error cargando producto:", err));
  }, [id]);

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="detalle-container">
      <div className="detalle-grid">
        {/* Imágenes */}
        <div className="detalle-images">
          <div className="detalle-main-image">
            {producto.imagenes?.[0]?.url ? (
              <img src={producto.imagenes[0].url} alt={producto.nombre} />
            ) : (
              <span className="text-9xl">🥬</span>
            )}
          </div>
          <div className="detalle-thumbs">
            {producto.imagenes?.map((img, i) => (
              <div key={i} className="detalle-thumb">
                <img src={img.url} alt={`${producto.nombre} ${i}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Información */}
        <div className="detalle-info">
          <h1 className="detalle-title">{producto.nombre}</h1>
          <div className="detalle-location">
            <MapPin className="icon-small" />
            <p>{producto.nombre_productor || "Productor desconocido"} - {producto.origen || "Origen no especificado"}</p>
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
            €{producto.precio_kg}<span>/kg</span>
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
            <button className="detalle-button">
              <ShoppingCart className="icon-small" />
              AÑADIR AL CARRITO
            </button>
          </div>
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
