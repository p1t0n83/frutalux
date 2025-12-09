import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, Check } from "lucide-react";
import "../styles/PreferenciasCaja.css";

const TAMANOS_CAJA = [
  { id: "pequena", nombre: "Caja Pequeña", peso: "4-6 kg", personas: "1-2 personas", precio: "€19.99" },
  { id: "mediana", nombre: "Caja Mediana", peso: "8-10 kg", personas: "3-4 personas", precio: "€34.99" },
  { id: "grande", nombre: "Caja Grande", peso: "12-15 kg", personas: "5+ personas", precio: "€49.99" }
];

const FRECUENCIAS = [
  { id: "semanal", nombre: "Semanal", descuento: "5% descuento" },
  { id: "quincenal", nombre: "Quincenal", descuento: "3% descuento" },
  { id: "mensual", nombre: "Mensual", descuento: null }
];

const PREFERENCIAS_PRODUCTOS = [
  { id: "frutas", nombre: "Frutas", desc: "Manzanas, naranjas, fresas..." },
  { id: "verduras", nombre: "Verduras", desc: "Lechugas, espinacas, acelgas..." },
  { id: "citricos", nombre: "Cítricos", desc: "Naranjas, limones, mandarinas..." },
  { id: "hortalizas", nombre: "Hortalizas", desc: "Tomates, pimientos, calabacines..." }
];

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
    const datosSuscripcion = {
      tamano,
      frecuencia,
      preferencias,
      tipo: "suscripcion"
    };

    sessionStorage.setItem("suscripcionData", JSON.stringify(datosSuscripcion));
    navigate("/checkout-suscripcion");
  };

  const handleCancelar = () => {
    navigate("/suscripciones");
  };

  return (
    <div className="preferencias-container">
      <div className="content-wrapper">
        <h1 className="preferencias-title">Personaliza tu Caja de Productos</h1>

        <SeccionTamanoCaja tamano={tamano} setTamano={setTamano} />
        <SeccionFrecuencia frecuencia={frecuencia} setFrecuencia={setFrecuencia} />
        <SeccionPreferencias preferencias={preferencias} setPreferencias={setPreferencias} />
        <BotonesAccion onConfirmar={handleConfirmar} onCancelar={handleCancelar} />
      </div>
    </div>
  );
}

// ================================================
// COMPONENTES DE SECCIONES
// ================================================

function SeccionTamanoCaja({ tamano, setTamano }) {
  return (
    <div className="preferencias-card">
      <div className="preferencias-header">
        <Package className="icon" />
        <h2>Tamaño de la Caja</h2>
      </div>

      <div className="preferencias-options">
        {TAMANOS_CAJA.map((caja) => (
          <OpcionTamano
            key={caja.id}
            caja={caja}
            seleccionado={tamano === caja.id}
            onChange={setTamano}
          />
        ))}
      </div>
    </div>
  );
}

function SeccionFrecuencia({ frecuencia, setFrecuencia }) {
  return (
    <div className="preferencias-card">
      <div className="preferencias-header">
        <Calendar className="icon" />
        <h2>Frecuencia de Entrega</h2>
      </div>

      <div className="preferencias-options">
        {FRECUENCIAS.map((freq) => (
          <OpcionFrecuencia
            key={freq.id}
            frecuencia={freq}
            seleccionado={frecuencia === freq.id}
            onChange={setFrecuencia}
          />
        ))}
      </div>
    </div>
  );
}

function SeccionPreferencias({ preferencias, setPreferencias }) {
  const handleToggle = (id, checked) => {
    setPreferencias({ ...preferencias, [id]: checked });
  };

  return (
    <div className="preferencias-card">
      <h2 className="preferencias-subtitle">Preferencias de Productos</h2>

      <div className="preferencias-grid">
        {PREFERENCIAS_PRODUCTOS.map((pref) => (
          <OpcionPreferencia
            key={pref.id}
            preferencia={pref}
            seleccionado={preferencias[pref.id]}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <NotaPreferencias />
    </div>
  );
}

// ================================================
// COMPONENTES DE OPCIONES
// ================================================

function OpcionTamano({ caja, seleccionado, onChange }) {
  return (
    <label className={`preferencias-option ${seleccionado ? "selected" : ""}`}>
      <div className="option-info">
        <input
          type="radio"
          name="tamano"
          value={caja.id}
          checked={seleccionado}
          onChange={(e) => onChange(e.target.value)}
        />
        <div>
          <p className="option-title">{caja.nombre}</p>
          <p className="option-sub">{caja.peso} • {caja.personas}</p>
        </div>
      </div>
      <p className="option-price">{caja.precio}</p>
    </label>
  );
}

function OpcionFrecuencia({ frecuencia, seleccionado, onChange }) {
  return (
    <label className={`preferencias-option ${seleccionado ? "selected" : ""}`}>
      <div className="option-info">
        <input
          type="radio"
          name="frecuencia"
          value={frecuencia.id}
          checked={seleccionado}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="option-title">{frecuencia.nombre}</p>
      </div>
      {frecuencia.descuento && (
        <p className="option-discount">{frecuencia.descuento}</p>
      )}
    </label>
  );
}

function OpcionPreferencia({ preferencia, seleccionado, onToggle }) {
  return (
    <label className={`preferencias-option ${seleccionado ? "selected" : ""}`}>
      <input
        type="checkbox"
        checked={seleccionado}
        onChange={(e) => onToggle(preferencia.id, e.target.checked)}
      />
      <div>
        <p className="option-title">{preferencia.nombre}</p>
        <p className="option-sub">{preferencia.desc}</p>
      </div>
    </label>
  );
}

// ================================================
// COMPONENTES AUXILIARES
// ================================================

function NotaPreferencias() {
  return (
    <div className="preferencias-note">
      <p>
        💡 <strong>Nota:</strong> Selecciona tus preferencias. Intentaremos incluir productos que te gusten,
        pero puede variar según disponibilidad de temporada.
      </p>
    </div>
  );
}

function BotonesAccion({ onConfirmar, onCancelar }) {
  return (
    <div className="preferencias-buttons">
      <button className="btn-cancel" onClick={onCancelar}>
        CANCELAR
      </button>
      <button className="btn-confirm" onClick={onConfirmar}>
        <Check className="icon-small" />
        CONFIRMAR SUSCRIPCIÓN
      </button>
    </div>
  );
}