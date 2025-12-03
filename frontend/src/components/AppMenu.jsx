import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AppMenu.css";
import { userAuth } from "../hooks/userAuth";

export default function AppMenu() {
  const { isLoggedIn, tipoUsuario, logout } = userAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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

          {isLoggedIn  && (
            <Link to="/perfil" className="menu-link">MI PERFIL</Link>
          )}

          {isLoggedIn && tipoUsuario === "administrador" && (
            <Link to="/admin" className="menu-link">ADMIN</Link>
          )}

          {!isLoggedIn ? (
            <Link to="/login" className="menu-link">INICIAR SESIÓN</Link>
          ) : (
            <button onClick={handleLogout} className="logout-btn">CERRAR SESIÓN</button>
          )}
        </nav>
      </div>
    </header>
  );
}
