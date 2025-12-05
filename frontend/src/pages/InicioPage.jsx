import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Award, Truck, Heart, ShoppingBasket, Users } from "lucide-react";
import "../styles/inicio.css";

export default function InicioPage() {
  return (
    <div className="inicio-container">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <Feature icon={<Leaf />} title="Producto Local" description="Frutas y verduras de temporada cultivadas por agricultores españoles. Apoyo directo a la economía local y km 0." />
          <Feature icon={<Award />} title="Calidad Garantizada" description="Seleccionamos solo productos frescos de máxima calidad. Trazabilidad completa desde el campo hasta tu hogar." />
          <Feature icon={<Truck />} title="Entrega Rápida" description="Envío directo desde la huerta. Recibe tus productos frescos en 24-48 horas en perfectas condiciones." />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <Users className="mission-icon" />
        <h2 className="mission-title">Nuestra Misión</h2>
        <p className="mission-text">
          Frutalux conecta directamente a agricultores locales con consumidores que valoran la calidad y el origen español...
        </p>
      </section>

      {/* CTA Section */}
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

function Feature({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}
