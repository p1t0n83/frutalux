import { Link } from "react-router-dom";
import { Leaf, Award, Truck, Heart, ShoppingBasket, Users } from "lucide-react";
import "../styles/inicio.css";

const CARACTERISTICAS = [
  {
    id: 1,
    icon: Leaf,
    title: "Producto Local",
    description: "Frutas y verduras de temporada cultivadas por agricultores españoles. Apoyo directo a la economía local y km 0."
  },
  {
    id: 2,
    icon: Award,
    title: "Calidad Garantizada",
    description: "Seleccionamos solo productos frescos de máxima calidad. Trazabilidad completa desde el campo hasta tu hogar."
  },
  {
    id: 3,
    icon: Truck,
    title: "Entrega Rápida",
    description: "Envío directo desde la huerta. Recibe tus productos frescos en 24-48 horas en perfectas condiciones."
  }
];

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <Icon />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

export default function InicioPage() {
  return (
    <div className="inicio-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Productos frescos del agricultor a tu mesa</h1>
          <p className="hero-description">
            Compra frutas y verduras de origen español directamente de productores locales.
          </p>
          <p className="hero-subdescription">
            Calidad garantizada y apoyo a la agricultura nacional. Transparencia total en el origen de cada producto.
          </p>
          <div className="hero-buttons">
            <Link to="/catalogo">
              <button className="btn-primary">
                <ShoppingBasket className="icon" />
                VER CATÁLOGO
              </button>
            </Link>
            <Link to="/suscripciones">
              <button className="btn-secondary">
                <Heart className="icon" />
                CAJAS SORPRESA
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          {CARACTERISTICAS.map((caracteristica) => (
            <FeatureCard
              key={caracteristica.id}
              icon={caracteristica.icon}
              title={caracteristica.title}
              description={caracteristica.description}
            />
          ))}
        </div>
      </section>

      <section className="mission-section">
        <Users className="mission-icon" />
        <h2 className="mission-title">Nuestra Misión</h2>
        <p className="mission-text">
          Frutalux conecta directamente a agricultores locales con consumidores que valoran la calidad y el origen español...
        </p>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">¿Listo para probar productos auténticos?</h2>
        <p className="cta-subtext">Únete a miles de familias que ya disfrutan de frutas y verduras de calidad</p>
        <Link to="/registro">
          <button className="btn-cta">EMPEZAR AHORA</button>
        </Link>
      </section>
    </div>
  );
}