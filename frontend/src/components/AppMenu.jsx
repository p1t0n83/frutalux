// src/components/AppMenu.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AppMenu.css";
import { userAuthContext } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext"; // 👈 importamos el hook

export default function AppMenu() {
  const { isLoggedIn, tipoUsuario, logout } = userAuthContext();
  const { carrito } = useCarrito(); // 👈 obtenemos el carrito del contexto
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Contador de items (si carrito existe y tiene items)
  const itemCount = carrito?.items?.length || 0;


  return (
    <header className="menu-header">
      <div className="menu-container">
        <Link to="/" className="menu-logo">
          <img src="/img/logo-texto.jpg" alt="Frutalux logo" className="logo-img" />
        </Link>
        <nav className="menu-desktop">
          <Link to="/" className="menu-link">INICIO</Link>
          <Link to="/catalogo" className="menu-link">CATÁLOGO</Link>
          <Link to="/agricultores" className="menu-link">AGRICULTORES</Link>
          <Link to="/suscripciones" className="menu-link">SUSCRIPCIONES</Link>

          {/* Carrito con contador dinámico */}
          <Link to="/carrito" className="menu-link carrito-link">
            CARRITO
            {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </Link>

          {isLoggedIn && (
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
