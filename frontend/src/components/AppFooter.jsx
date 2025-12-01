import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/index";
import "../styles/AppFooter.css";

export default function AppFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-logo">FRUTALUX</h3>
          <p>Productos frescos del agricultor a tu mesa.</p>
        </div>
        <div>
          <h4>Navegación</h4>
          <Link to={createPageUrl("Catalogo")}>Catálogo</Link>
          <Link to={createPageUrl("Suscripciones")}>Suscripciones</Link>
          <Link to={createPageUrl("PerfilCliente")}>Mi Perfil</Link>
        </div>
        <div>
          <h4>Información</h4>
          <p>Sobre Nosotros</p>
          <p>Política de Privacidad</p>
          <p>Términos y Condiciones</p>
        </div>
        <div>
          <h4>Contacto</h4>
          <p>Email: info@frutalux.com</p>
          <p>Teléfono: 900 123 456</p>
          <p>Horario: L-V 9:00-18:00</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 FRUTALUX - Todos los derechos reservados
      </div>
    </footer>
  );
}
