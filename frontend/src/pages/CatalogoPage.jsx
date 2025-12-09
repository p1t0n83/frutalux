import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { getProductos } from "../services/productoService";
import "../styles/CatalogoPage.css";

const CATEGORIAS = ["all", "Frutas con hueso", "Verduras", "Hortalizas", "Legumbres", "Cítricos"];

export default function CatalogoPage() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const filteredProducts = productos.filter((producto) => {
    const nombre = (producto.nombre || "").toLowerCase();
    const productor = (producto.nombre_productor || producto.productor || "").toLowerCase();
    const origen = (producto.origen || "").toLowerCase();

    const matchesSearch =
      nombre.includes(searchTerm.toLowerCase()) ||
      productor.includes(searchTerm.toLowerCase()) ||
      origen.includes(searchTerm.toLowerCase());

    let categoriaNombre = (producto.categoria?.nombre || "").toLowerCase();
  

    const matchesCategory =
      selectedCategory === "all" ||
      categoriaNombre === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="catalogo-container">
      <div className="section-content">
        <h1 className="catalogo-title">Catálogo de Productos</h1>

        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, productor u origen..."
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          {CATEGORIAS.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setSelectedCategory(categoria)}
              className={`filter-btn ${selectedCategory === categoria ? "active" : ""}`}
            >
              {categoria === "all" ? "Todas" : categoria}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map((producto) => {
            const imagenPortada =
              producto.imagenes && producto.imagenes.length > 0
                ? producto.imagenes[0].url_imagen
                : "/images/default-product.jpg";

            return (
              <Link key={producto.id} to={`/producto/${producto.id}`} className="product-link">
                <div className="product-card">
                  <div className="product-image">
                    <img
                      src={imagenPortada}
                      alt={producto.nombre || "Imagen de producto"}
                      className="product-cover"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{producto.nombre || "Sin nombre"}</h3>
                    <p className="product-producer">
                      {producto.nombre_productor || producto.productor || "Productor desconocido"}
                    </p>
                    <div className="product-origin">
                      <MapPin className="icon-small" />
                      <span>{producto.origen || "Origen no especificado"}</span>
                    </div>
                    <p className="product-category">
                      {producto.categoria?.nombre || "Sin categoría"}
                    </p>
                    <div className="product-price-box">
                      <span className="product-price">
                        €{producto.precio_kg || producto.precio || 0}
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