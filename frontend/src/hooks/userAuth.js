import { useState, useEffect } from "react";
import { loginUsuario, registrarUsuario, logoutUsuario, getUsuario } from "../services/authService";

export function userAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getUsuario(); // backend devuelve objeto usuario
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data) => {
    const res = await loginUsuario(data);
    setUser(res.user); // login devuelve { access_token, user }
    return res;
  };

  const register = async (data) => {
    const res = await registrarUsuario(data);
    setUser(res.user); // register devuelve { access_token, user }
    return res;
  };

  const logout = async () => {
    await logoutUsuario();
    setUser(null);
  };

  const isLoggedIn = !!user;
  const tipoUsuario = user?.tipo_usuario ? user.tipo_usuario.toLowerCase() : null;

  return { user, tipoUsuario, isLoggedIn, loading, login, register, logout };
}
