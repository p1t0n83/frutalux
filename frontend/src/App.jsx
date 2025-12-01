import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import InicioPage from "./pages/InicioPage";
import CatalogoPage from "./pages/CatalogoPage";
import DetalleProducto from "./pages/DetalleProducto";
import Agricultores from "./pages/Agricultores";
import Suscripciones from "./pages/Suscripciones";
import PreferenciasCaja from "./pages/PreferenciasCaja";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<InicioPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/producto/:id" element={<DetalleProducto/>}/> 
          <Route path="/agricultores" element={<Agricultores/>}/>
          <Route path="/suscripciones" element={<Suscripciones/>}/>
          <Route path="/preferencias-caja" element={<PreferenciasCaja />} />
        </Route>
      </Routes>
    </Router>
  );
}
