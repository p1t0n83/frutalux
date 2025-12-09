import { useState, useEffect } from "react";
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

  const itemCount = carrito?.items?.length || 0;

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <header className="menu-header">
      <div className="menu-container">
        <Link to="/" className="menu-logo">
          <img src="/img/logo-texto.jpg" alt="Frutalux logo" className="logo-img" />
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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

      <div
        className={`menu-mobile-overlay ${menuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      <nav className={`menu-mobile ${menuOpen ? 'open' : ''}`}>
        <div className="menu-mobile-list">
          <Link to="/" className="menu-link" onClick={closeMenu}>
            INICIO
          </Link>

          <Link to="/catalogo" className="menu-link" onClick={closeMenu}>
            CATÁLOGO
          </Link>

          <Link to="/agricultores" className="menu-link" onClick={closeMenu}>
            AGRICULTORES
          </Link>

          <Link to="/suscripciones" className="menu-link" onClick={closeMenu}>
            SUSCRIPCIONES
          </Link>

          <Link to="/carrito" className="menu-link carrito-link" onClick={closeMenu}>
            CARRITO
            {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </Link>

          {isLoggedIn && (
            <Link to="/perfil" className="menu-link" onClick={closeMenu}>
              MI PERFIL
            </Link>
          )}

          {isLoggedIn && tipoUsuario === "administrador" && (
            <Link to="/admin" className="menu-link" onClick={closeMenu}>
              ADMIN
            </Link>
          )}

          <div className="menu-mobile-divider"></div>

          {!isLoggedIn ? (
            <Link to="/login" className="menu-link menu-link-primary" onClick={closeMenu}>
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