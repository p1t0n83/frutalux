import { Navigate } from "react-router-dom";
import { userAuth } from "../hooks/userAuth";

export default function PrivateRoute({ children, allowedRoles }) {
  const { isLoggedIn, tipoUsuario, loading } = userAuth();

  // Mientras se está cargando el usuario, no redirigimos
  if (loading) {
    return <div>Cargando...</div>; // o un spinner
  }

  // Si no está logueado → al login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el usuario no está en ellos → al inicio
  if (allowedRoles && !allowedRoles.includes(tipoUsuario)) {
    return <Navigate to="/" replace />;
  }

  // Si pasa las condiciones → renderiza la página
  return children;
}
