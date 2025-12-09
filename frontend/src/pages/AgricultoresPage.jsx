import { MapPin, Award, Heart } from "lucide-react";
import "../styles/Agricultores.css"; 

const AGRICULTORES_DATA = [
  {
    id: 1,
    nombre: "José García",
    finca: "Huerta de José",
    ubicacion: "Almería",
    especialidad: "Tomates y Hortalizas",
    experiencia: "25 años",
    descripcion: "Tercera generación de agricultores, especializado en tomates Raf y hortalizas de calidad. Cultivo tradicional con técnicas sostenibles.",
    imagen: "/img/logo-texto.jpg"
  },
  {
    id: 2,
    nombre: "Carmen Ruiz",
    finca: "Cítricos del Turia",
    ubicacion: "Valencia",
    especialidad: "Naranjas y Mandarinas",
    experiencia: "30 años",
    descripcion: "Experta en cítricos valencianos. Sus naranjas son reconocidas por su sabor excepcional. Agricultura ecológica certificada.",
    imagen: "/img/logo-texto.jpg"
  },
  {
    id: 3,
    nombre: "Pedro López",
    finca: "Huerta Navarra",
    ubicacion: "Navarra",
    especialidad: "Pimientos y Espárragos",
    experiencia: "35 años",
    descripcion: "Maestro del cultivo de pimientos del piquillo...",
    imagen: "/img/logo-texto.jpg"
  },
  {
    id: 4,
    nombre: "Laura Sánchez",
    finca: "Berries Huelva",
    ubicacion: "Huelva",
    especialidad: "Fresas y Frutos Rojos",
    experiencia: "18 años",
    descripcion: "Especialista en fresas y frutos rojos...",
    imagen: "/img/logo-texto.jpg"
  }
];

const ESTADISTICAS = [
  {
    icon: Award,
    numero: "50+",
    texto: "Agricultores Asociados"
  },
  {
    icon: MapPin,
    numero: "12",
    texto: "Provincias de España"
  },
  {
    icon: Heart,
    numero: "100%",
    texto: "Producto Nacional"
  }
];

export default function Agricultores() {
  return (
    <div className="agricultores-container">
      <div className="agricultores-hero">
        <div className="content-wrapper text-center">
          <h1 className="agricultores-title">AGRICULTORES</h1>
          <p className="agricultores-subtitle">
            Conoce a las personas que cultivan con pasión los mejores productos de España.
            Cada uno de nuestros agricultores aporta años de experiencia, dedicación y amor por la tierra.
          </p>
        </div>
      </div>

      <div className="content-wrapper agricultores-stats">
        <div className="stats-grid">
          {ESTADISTICAS.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stats-card">
                <IconComponent className="stats-icon" />
                <div className="stats-number">{stat.numero}</div>
                <div className="stats-text">{stat.texto}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="content-wrapper agricultores-grid">
        {AGRICULTORES_DATA.map((agricultor) => (
          <div key={agricultor.id} className="agricultor-card">
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