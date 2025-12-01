import React from "react";
import { Link } from "react-router-dom";
import "../styles/AppMenu.css";

export default function AppMenu() {
  return (
    <header className="menu-header">
      <div className="menu-container">
        <Link to="/" className="menu-logo">FRUTALUX</Link>
        <nav className="menu-desktop">
          <Link to="/" className="menu-link">INICIO</Link>
          <Link to="/catalogo" className="menu-link">CATÁLOGO</Link>
          <Link to="/agricultores" className="menu-link">AGRICULTORES</Link>
          <Link to="/suscripciones" className="menu-link">SUSCRIPCIONES</Link>
          <Link to="/carrito" className="menu-link">CARRITO</Link>
          <Link to="/perfil" className="menu-link">MI PERFIL</Link>
          <Link to="/admin" className="menu-link">ADMIN</Link>
        </nav>
      </div>
    </header>
  );
}
