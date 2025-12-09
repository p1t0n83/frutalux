// src/pages/Suscripciones.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Check, Package, Calendar, Percent } from "lucide-react";
import "../styles/Suscripciones.css";

const PLANES = [
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

const FRECUENCIAS = [
  { tipo: "Semanal", descuento: "5%", periodo: "Cada semana" },
  { tipo: "Quincenal", descuento: "3%", periodo: "Cada 2 semanas" },
  { tipo: "Mensual", descuento: "0%", periodo: "Cada mes" }
];

export default function Suscripciones() {
  return (
    <div className="suscripciones-container">
      <div className="content-wrapper">
        <SuscripcionesHeader />
        <PlanesGrid planes={PLANES} />
        <FrecuenciasCard frecuencias={FRECUENCIAS} />
      </div>
    </div>
  );
}

// ================================================
// COMPONENTES PRINCIPALES
// ================================================

function SuscripcionesHeader() {
  return (
    <div className="suscripciones-header">
      <h1>Cajas de Productos Frescos</h1>
      <p>Recibe productos frescos de temporada directamente en tu casa</p>
    </div>
  );
}

function PlanesGrid({ planes }) {
  return (
    <div className="planes-grid">
      {planes.map((plan) => (
        <PlanCard key={plan.tipo} plan={plan} />
      ))}
    </div>
  );
}

function FrecuenciasCard({ frecuencias }) {
  return (
    <div className="frecuencias-card">
      <div className="frecuencias-header">
        <Calendar className="icon" />
        <h2>Frecuencia de Entrega</h2>
      </div>
      <div className="frecuencias-grid">
        {frecuencias.map((freq) => (
          <FrecuenciaItem key={freq.tipo} frecuencia={freq} />
        ))}
      </div>
    </div>
  );
}

// ================================================
// COMPONENTES DE PLAN
// ================================================

function PlanCard({ plan }) {
  return (
    <div className={`plan-card ${plan.destacado ? "destacado" : ""}`}>
      {plan.destacado && <PlanPopularBadge />}
      <div className="plan-body">
        <PlanTitle tipo={plan.tipo} />
        <PlanPrecio plan={plan} />
        <PlanIncluye items={plan.incluye} />
        <PlanButton destacado={plan.destacado} />
      </div>
    </div>
  );
}

function PlanPopularBadge() {
  return <div className="plan-popular">MÁS POPULAR</div>;
}

function PlanTitle({ tipo }) {
  return (
    <div className="plan-title">
      <Package className="icon" />
      <h3>Caja {tipo}</h3>
    </div>
  );
}

function PlanPrecio({ plan }) {
  return (
    <div className="plan-precio">
      <p className="precio">€{plan.precio}</p>
      <p>Descripción: {plan.peso}</p>
      <p className="personas">Ideal para {plan.personas}</p>
    </div>
  );
}

function PlanIncluye({ items }) {
  return (
    <div className="plan-incluye">
      {items.map((item, idx) => (
        <div key={idx} className="incluye-item">
          <Check className="icon-check" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function PlanButton({ destacado }) {
  return (
    <Link to="/preferencias-caja">
      <button className={`btn-select ${destacado ? "btn-destacado" : ""}`}>
        SELECCIONAR
      </button>
    </Link>
  );
}

// ================================================
// COMPONENTES DE FRECUENCIA
// ================================================

function FrecuenciaItem({ frecuencia }) {
  return (
    <div className="frecuencia-item">
      <h3>{frecuencia.tipo}</h3>
      <p>{frecuencia.periodo}</p>
      {frecuencia.descuento !== "0%" && (
        <div className="frecuencia-descuento">
          <Percent className="icon-small" />
          <span>{frecuencia.descuento} de descuento</span>
        </div>
      )}
    </div>
  );
}