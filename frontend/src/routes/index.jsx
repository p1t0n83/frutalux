import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import CatalogoPage from "../pages/CatalogoPage";
import NuestrosAgricultores from "../pages/Agricultores";
import Suscripciones from "../pages/Suscripciones";
import Carrito from "../pages/Carrito";
import PerfilCliente from "../pages/PerfilCliente";
import PanelAdmin from "../pages/PanelAdmin";
import DetalleProducto from "../pages/DetalleProducto";
import PreferenciasCaja from "../pages/PreferenciasCaja";
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/agricultores" element={<NuestrosAgricultores />} />
        <Route path="/suscripciones" element={<Suscripciones />} />
        <Route path="/preferencias" element={<PreferenciasCaja/>}/>
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<PerfilCliente />} />
        <Route path="/admin" element={<PanelAdmin />} />
      </Routes>
    </Router>
  );
}
