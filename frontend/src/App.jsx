// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import InicioPage from "./pages/InicioPage";
import CatalogoPage from "./pages/CatalogoPage";
import DetalleProducto from "./pages/DetalleProductoPage";
import Agricultores from "./pages/AgricultoresPage";
import Suscripciones from "./pages/SuscripcionesPage";
import PreferenciasCaja from "./pages/PreferenciasCajaPage";
import Carrito from "./pages/CarritoPage";
import Checkout from "./pages/Checkout"; // 👈 importamos checkout
import RegistroPage from "./pages/RegistroPage";
import LoginPage from "./pages/LoginPage";
import PerfilClientePage from "./pages/PerfilClientePage";
import PanelAdmin from "./pages/PanelAdminPage";
import GestionUsuarios from "./pages/GestionUsuariosPage";
import DetalleUsuarioAdmin from "./pages/DetalleUsuarioAdminPage";
import GestionProductosPage from "./pages/GestionProductosPage";
import DetalleProductoAdmin from "./pages/DetalleProductoAdminPage";
import GestionPedidosPage from "./pages/GestionPedidosPage";
import PrivateRoute from "./components/PrivateRoute";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<InicioPage />} />
              <Route path="/catalogo" element={<CatalogoPage />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/agricultores" element={<Agricultores />} />
              <Route path="/suscripciones" element={<Suscripciones />} />
              <Route path="/preferencias-caja" element={<PreferenciasCaja />} />
              <Route path="/registro" element={<RegistroPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Bloqueadas: solo logueados */}
              <Route
                path="/perfil"
                element={
                  <PrivateRoute>
                    <PerfilClientePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/carrito"
                element={
                  <PrivateRoute>
                    <Carrito />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout /> {/* 👈 nueva ruta checkout */}
                  </PrivateRoute>
                }
              />

              <Route
                path="/checkout-suscripcion"
                element={
                  <PrivateRoute>
                    <Checkout /> {/* 👈 nueva ruta checkout */}
                  </PrivateRoute>
                }
              />

              {/* Bloqueadas: solo administradores */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <PanelAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gestion-usuarios"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <GestionUsuarios />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/usuarios/nuevo"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <DetalleUsuarioAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/usuarios/:id"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <DetalleUsuarioAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gestion-productos"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <GestionProductosPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/productos/nuevo"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <DetalleProductoAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/productos/:id"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <DetalleProductoAdmin />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gestion-pedidos"
                element={
                  <PrivateRoute allowedRoles={["administrador"]}>
                    <GestionPedidosPage />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}
