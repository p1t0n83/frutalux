import React from "react";
import { Link } from "react-router-dom";
import { Check, Package, Calendar, Percent } from "lucide-react";
import "../styles/Suscripciones.css";

export default function Suscripciones() {
  const planes = [
    {
      tipo: "Pequeña",
      peso: "4-6 kg",
      personas: "1-2 personas",
      precio: "19.99",
      incluye: ["3-4 variedades frutas", "2-3 variedades verduras", "Productos de temporada", "Envío incluido"]
    },
    {
      tipo: "Mediana",
      peso: "8-10 kg",
      personas: "3-4 personas",
      precio: "34.99",
      incluye: ["5-6 variedades frutas", "4-5 variedades verduras", "Productos de temporada", "Envío incluido"],
      destacado: true
    },
    {
      tipo: "Grande",
      peso: "12-15 kg",
      personas: "5+ personas",
      precio: "49.99",
      incluye: ["7-8 variedades frutas", "6-7 variedades verduras", "Productos de temporada", "Envío incluido"]
    }
  ];

  const frecuencias = [
    { tipo: "Semanal", descuento: "5%", periodo: "Cada semana" },
    { tipo: "Quincenal", descuento: "3%", periodo: "Cada 2 semanas" },
    { tipo: "Mensual", descuento: "0%", periodo: "Cada mes" }
  ];

  return (
    <div className="suscripciones-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="suscripciones-header">
          <h1>Cajas de Productos Frescos</h1>
          <p>Recibe productos frescos de temporada directamente en tu casa</p>
        </div>

        {/* Planes */}
        <div className="planes-grid">
          {planes.map((plan) => (
            <div
              key={plan.tipo}
              className={`plan-card ${plan.destacado ? "destacado" : ""}`}
            >
              {plan.destacado && (
                <div className="plan-popular">MÁS POPULAR</div>
              )}
              <div className="plan-body">
                <div className="plan-title">
                  <Package className="icon" />
                  <h3>Caja {plan.tipo}</h3>
                </div>

                <div className="plan-precio">
                  <p className="precio">€{plan.precio}</p>
                  <p>Descripción: {plan.peso}</p>
                  <p className="personas">Ideal para {plan.personas}</p>
                </div>

                <div className="plan-incluye">
                  {plan.incluye.map((item, idx) => (
                    <div key={idx} className="incluye-item">
                      <Check className="icon-check" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/preferencias-caja">
                  <button className={`btn-select ${plan.destacado ? "btn-destacado" : ""}`}>
                    SELECCIONAR
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Frecuencias */}
        <div className="frecuencias-card">
          <div className="frecuencias-header">
            <Calendar className="icon" />
            <h2>Frecuencia de Entrega</h2>
          </div>

          <div className="frecuencias-grid">
            {frecuencias.map((freq) => (
              <div key={freq.tipo} className="frecuencia-item">
                <h3>{freq.tipo}</h3>
                <p>{freq.periodo}</p>
                {freq.descuento !== "0%" && (
                  <div className="frecuencia-descuento">
                    <Percent className="icon-small" />
                    <span>{freq.descuento} de descuento</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
