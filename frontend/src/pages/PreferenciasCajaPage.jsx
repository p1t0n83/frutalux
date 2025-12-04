// src/pages/PreferenciasCaja.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Check } from "lucide-react";
import "../styles/PreferenciasCaja.css";

export default function PreferenciasCaja() {
  const navigate = useNavigate();
  const [tamano, setTamano] = useState("mediana");
  const [frecuencia, setFrecuencia] = useState("quincenal");
  const [preferencias, setPreferencias] = useState({
    frutas: true,
    verduras: true,
    citricos: true,
    hortalizas: true
  });

  const handleConfirmar = () => {
    // Guardar preferencias en sessionStorage
    const datosSuscripcion = {
      tamano,
      frecuencia,
      preferencias,
      tipo: "suscripcion"
    };
    
    sessionStorage.setItem("suscripcionData", JSON.stringify(datosSuscripcion));
    
    // Redirigir a checkout con tipo suscripcion
    navigate("/checkout-suscripcion");
  };

  return (
    <div className="preferencias-container">
      <div className="content-wrapper">
        <h1 className="preferencias-title">Personaliza tu Caja de Productos</h1>

        {/* Tamaño */}
        <div className="preferencias-card">
          <div className="preferencias-header">
            <Package className="icon" />
            <h2>Tamaño de la Caja</h2>
          </div>
          
          <div className="preferencias-options">
            {[
              { id: "pequena", nombre: "Caja Pequeña", peso: "4-6 kg", personas: "1-2 personas", precio: "€19.99" },
              { id: "mediana", nombre: "Caja Mediana", peso: "8-10 kg", personas: "3-4 personas", precio: "€34.99" },
              { id: "grande", nombre: "Caja Grande", peso: "12-15 kg", personas: "5+ personas", precio: "€49.99" }
            ].map((caja) => (
              <label 
                key={caja.id}
                className={`preferencias-option ${tamano === caja.id ? "selected" : ""}`}
              >
                <div className="option-info">
                  <input 
                    type="radio" 
                    name="tamano" 
                    value={caja.id}
                    checked={tamano === caja.id}
                    onChange={(e) => setTamano(e.target.value)}
                  />
                  <div>
                    <p className="option-title">{caja.nombre}</p>
                    <p className="option-sub">{caja.peso} • {caja.personas}</p>
                  </div>
                </div>
                <p className="option-price">{caja.precio}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Frecuencia */}
        <div className="preferencias-card">
          <div className="preferencias-header">
            <Calendar className="icon" />
            <h2>Frecuencia de Entrega</h2>
          </div>
          
          <div className="preferencias-options">
            {[
              { id: "semanal", nombre: "Semanal", descuento: "5% descuento" },
              { id: "quincenal", nombre: "Quincenal", descuento: "3% descuento" },
              { id: "mensual", nombre: "Mensual", descuento: null }
            ].map((freq) => (
              <label 
                key={freq.id}
                className={`preferencias-option ${frecuencia === freq.id ? "selected" : ""}`}
              >
                <div className="option-info">
                  <input 
                    type="radio" 
                    name="frecuencia" 
                    value={freq.id}
                    checked={frecuencia === freq.id}
                    onChange={(e) => setFrecuencia(e.target.value)}
                  />
                  <p className="option-title">{freq.nombre}</p>
                </div>
                {freq.descuento && (
                  <p className="option-discount">{freq.descuento}</p>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Preferencias */}
        <div className="preferencias-card">
          <h2 className="preferencias-subtitle">Preferencias de Productos</h2>
          
          <div className="preferencias-grid">
            {[
              { id: "frutas", nombre: "Frutas", desc: "Manzanas, naranjas, fresas..." },
              { id: "verduras", nombre: "Verduras", desc: "Lechugas, espinacas, acelgas..." },
              { id: "citricos", nombre: "Cítricos", desc: "Naranjas, limones, mandarinas..." },
              { id: "hortalizas", nombre: "Hortalizas", desc: "Tomates, pimientos, calabacines..." }
            ].map((pref) => (
              <label 
                key={pref.id}
                className={`preferencias-option ${preferencias[pref.id] ? "selected" : ""}`}
              >
                <input 
                  type="checkbox" 
                  checked={preferencias[pref.id]}
                  onChange={(e) => setPreferencias({...preferencias, [pref.id]: e.target.checked})}
                />
                <div>
                  <p className="option-title">{pref.nombre}</p>
                  <p className="option-sub">{pref.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="preferencias-note">
            <p>
              💡 <strong>Nota:</strong> Selecciona tus preferencias. Intentaremos incluir productos que te gusten, 
              pero puede variar según disponibilidad de temporada.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="preferencias-buttons">
          <button className="btn-cancel" onClick={() => navigate("/suscripciones")}>
            CANCELAR
          </button>
          <button className="btn-confirm" onClick={handleConfirmar}>
            <Check className="icon-small" />
            CONFIRMAR SUSCRIPCIÓN
          </button>
        </div>
      </div>
    </div>
  );
}