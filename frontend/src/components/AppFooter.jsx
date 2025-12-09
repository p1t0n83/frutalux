import { Link } from "react-router-dom";
import "../styles/AppFooter.css";

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="footer-logo">FRUTALUX</h3>
          <p>Productos frescos del agricultor a tu mesa.</p>
        </div>

        <div>
          <h4>Navegación</h4>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/suscripciones">Suscripciones</Link>
          <Link to="/perfil">Mi Perfil</Link>
        </div>

        <div>
          <h4>Información</h4>
          <p>Sobre Nosotros</p>
          <p>Política de Privacidad</p>
          <p>Términos y Condiciones</p>
        </div>

        <div>
          <h4>Contacto</h4>
          <p>
            Email: info@frutalux.com
          </p>
          <p>
            Teléfono: 900 123 456
          </p>
          <p>Horario: L-V 9:00-18:00</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {currentYear} FRUTALUX - Todos los derechos reservados
      </div>
    </footer>
  );
}