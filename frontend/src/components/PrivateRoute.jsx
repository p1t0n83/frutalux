import { Navigate } from "react-router-dom";
import { userAuth } from "../hooks/userAuth";

export default function PrivateRoute({ children, allowedRoles }) {
  const { isLoggedIn, tipoUsuario, loading } = userAuth();

  
  if (loading) {
    return <div>Cargando...</div>; 
  }

 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

 
  if (allowedRoles && !allowedRoles.includes(tipoUsuario)) {
    return <Navigate to="/" replace />;
  }


  return children;
}
