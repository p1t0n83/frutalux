// src/components/AppMenu.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/AppMenu.css";
import { userAuthContext } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

export default function AppMenu() {
  const { isLoggedIn, tipoUsuario, logout } = userAuthContext();
  const { carrito } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const itemCount = carrito?.items?.length || 0;

  return (
    <header className="menu-header">
      <div className="menu-container">
        <Link to="/" className="menu-logo">
          <img src="/img/logo-texto.jpg" alt="Frutalux logo" className="logo-img" />
        </Link>

        {/* Botón hamburguesa */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menú desktop (oculto en móvil) */}
        <nav className="menu-desktop">
          <Link to="/" className="menu-link">INICIO</Link>
          <Link to="/catalogo" className="menu-link">CATÁLOGO</Link>
          <Link to="/agricultores" className="menu-link">AGRICULTORES</Link>
          <Link to="/suscripciones" className="menu-link">SUSCRIPCIONES</Link>

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
            <button onClick={handleLogout} className="logout-btn">
              CERRAR SESIÓN
            </button>
          )}
        </nav>
      </div>

      {/* Overlay oscuro */}
      <div
        className={`menu-mobile-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Menú móvil lateral */}
      <nav className={`menu-mobile ${menuOpen ? 'open' : ''}`}>
        <div className="menu-mobile-list">
          <Link to="/" className="menu-link" onClick={() => setMenuOpen(false)}>
            INICIO
          </Link>

          <Link to="/catalogo" className="menu-link" onClick={() => setMenuOpen(false)}>
            CATÁLOGO
          </Link>

          <Link to="/agricultores" className="menu-link" onClick={() => setMenuOpen(false)}>
            AGRICULTORES
          </Link>

          <Link to="/suscripciones" className="menu-link" onClick={() => setMenuOpen(false)}>
            SUSCRIPCIONES
          </Link>

          <Link to="/carrito" className="menu-link carrito-link" onClick={() => setMenuOpen(false)}>
            CARRITO
            {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </Link>

          {isLoggedIn && (
            <Link to="/perfil" className="menu-link" onClick={() => setMenuOpen(false)}>
              MI PERFIL
            </Link>
          )}

          {isLoggedIn && tipoUsuario === "administrador" && (
            <Link to="/admin" className="menu-link" onClick={() => setMenuOpen(false)}>
              ADMIN
            </Link>
          )}

          <div className="menu-mobile-divider"></div>

          {!isLoggedIn ? (
            <Link to="/login" className="menu-link menu-link-primary" onClick={() => setMenuOpen(false)}>
              INICIAR SESIÓN
            </Link>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              CERRAR SESIÓN
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}