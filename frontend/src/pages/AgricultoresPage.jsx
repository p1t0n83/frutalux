import React from "react";
import { MapPin, Award, Heart } from "lucide-react";
import "../styles/Agricultores.css"; // 🔧 fichero de estilos separado

export default function Agricultores() {
  const agricultores = [
    {
      nombre: "José García",
      finca: "Huerta de José",
      ubicacion: "Almería",
      especialidad: "Tomates y Hortalizas",
      experiencia: "25 años",
      descripcion: "Tercera generación de agricultores, especializado en tomates Raf y hortalizas de calidad. Cultivo tradicional con técnicas sostenibles.",
      imagen: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=300&fit=crop"
    },
    {
      nombre: "Carmen Ruiz",
      finca: "Cítricos del Turia",
      ubicacion: "Valencia",
      especialidad: "Naranjas y Mandarinas",
      experiencia: "30 años",
      descripcion: "Experta en cítricos valencianos. Sus naranjas son reconocidas por su sabor excepcional. Agricultura ecológica certificada.",
      imagen: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=300&fit=crop"
    },
    {
      nombre: "Pedro López",
      finca: "Huerta Navarra",
      ubicacion: "Navarra",
      especialidad: "Pimientos y Espárragos",
      experiencia: "35 años",
      descripcion: "Maestro del cultivo de pimientos del piquillo...",
      imagen: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=400&h=300&fit=crop" // perro con gafas
    },
    {
      nombre: "Laura Sánchez",
      finca: "Berries Huelva",
      ubicacion: "Huelva",
      especialidad: "Fresas y Frutos Rojos",
      experiencia: "18 años",
      descripcion: "Especialista en fresas y frutos rojos...",
      imagen: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=300&fit=crop" // gato mirando raro
    }
  ];


  return (
    <div className="agricultores-container">
      {/* Hero Section */}
      <div className="agricultores-hero">
        <div className="content-wrapper text-center">
          <h1 className="agricultores-title">AGRICULTORES</h1>
          <p className="agricultores-subtitle">
            Conoce a las personas que cultivan con pasión los mejores productos de España.
            Cada uno de nuestros agricultores aporta años de experiencia, dedicación y amor por la tierra.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="content-wrapper agricultores-stats">
        <div className="stats-grid">
          <div className="stats-card">
            <Award className="stats-icon" />
            <div className="stats-number">50+</div>
            <div className="stats-text">Agricultores Asociados</div>
          </div>
          <div className="stats-card">
            <MapPin className="stats-icon" />
            <div className="stats-number">12</div>
            <div className="stats-text">Provincias de España</div>
          </div>
          <div className="stats-card">
            <Heart className="stats-icon" />
            <div className="stats-number">100%</div>
            <div className="stats-text">Producto Nacional</div>
          </div>
        </div>
      </div>

      {/* Agricultores Grid */}
      <div className="content-wrapper agricultores-grid">
        {agricultores.map((agricultor, i) => (
          <div key={i} className="agricultor-card">
            <div className="agricultor-image">
              <img src={agricultor.imagen} alt={agricultor.nombre} />
            </div>
            <div className="agricultor-info">
              <h3>{agricultor.nombre}</h3>
              <div className="finca">{agricultor.finca}</div>
              <div className="ubicacion">
                <MapPin className="icon-small" />
                <span>{agricultor.ubicacion}</span>
              </div>
              <div className="especialidad">
                <strong>Especialidad:</strong> {agricultor.especialidad}
              </div>
              <div className="experiencia">
                <strong>Experiencia:</strong> {agricultor.experiencia}
              </div>
              <p className="descripcion">{agricultor.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="agricultores-cta">
        <div className="content-wrapper text-center">
          <h2>¿Eres agricultor y quieres unirte?</h2>
          <p>
            Si produces alimentos de calidad y compartes nuestra pasión por la agricultura sostenible,
            nos encantaría conocerte y trabajar juntos.
          </p>
          <button className="cta-button">CONTACTA CON NOSOTROS</button>
        </div>
      </div>
    </div>
  );
}
