import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getProductos } from "../services/productoService"; // 👈 import correcto
import "../styles/CatalogoPage.css";

export default function CatalogoPage() {
  const [productos, setProductos] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  React.useEffect(() => {
    getProductos() // 👈 usamos getProductos del nuevo servicio
      .then(setProductos)
      .catch((err) => {
        console.error("Error cargando productos:", err);
      });
  }, []);

  const filteredProducts = productos.filter((p) => {
    const nombre = (p.nombre || "").toLowerCase();
    const productor = (p.nombre_productor || p.productor || "").toLowerCase();
    const origen = (p.origen || "").toLowerCase();

    const matchesSearch =
      nombre.includes(searchTerm.toLowerCase()) ||
      productor.includes(searchTerm.toLowerCase()) ||
      origen.includes(searchTerm.toLowerCase());

    let categoriaNombre = (p.categoria?.nombre || "").toLowerCase();
    if (categoriaNombre.includes("fruta")) {
      categoriaNombre = "frutas";
    }

    const matchesCategory =
      selectedCategory === "all" ||
      categoriaNombre === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="catalogo-container">
      <div className="section-content">
        <h1 className="catalogo-title">Catálogo de Productos</h1>

        {/* Buscador */}
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, productor u origen..."
            className="search-input"
          />
        </div>

        {/* Filtros */}
        <div className="filter-buttons">
          {["all", "Frutas", "Verduras", "Hortalizas", "Legumbres", "Cítricos"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat === "all" ? "Todas" : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="products-grid">
          {filteredProducts.map((prod, i) => {
            const portada =
              prod.imagenes && prod.imagenes.length > 0
                ? prod.imagenes[0].url_imagen
                : "/images/default-product.jpg";

            return (
              <Link key={i} to={`/producto/${prod.id}`} className="product-link">
               
                <div className="product-card">
                  <div className="product-image">
                    <img
                      src={portada}
                      alt={prod.nombre || "Imagen de producto"}
                      className="product-cover"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{prod.nombre || "Sin nombre"}</h3>
                    <p className="product-producer">
                      {prod.nombre_productor || prod.productor || "Productor desconocido"}
                    </p>
                    <div className="product-origin">
                      <MapPin className="icon-small" />
                      <span>{prod.origen || "Origen no especificado"}</span>
                    </div>
                    <p className="product-category">
                      {prod.categoria?.nombre || "Sin categoría"}
                    </p>
                    <div className="product-price-box">
                      <span className="product-price">
                        €{prod.precio_kg || prod.precio || 0}
                      </span>
                      <span className="product-unit">/kg</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
