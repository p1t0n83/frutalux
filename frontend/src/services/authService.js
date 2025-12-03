const API_BASE = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

/**
 * Función auxiliar para parsear JSON de forma segura
 */
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no válida: " + text);
  }
}

/**
 * Registro de usuario
 */
export async function registrarUsuario(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json.message || "Error al registrar usuario");
  }

  localStorage.setItem("token", json.access_token);
  return json; // { access_token, user, ... }
}

/**
 * Login de usuario
 */
export async function loginUsuario(data) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json.message || "Error al iniciar sesión");
  }

  localStorage.setItem("token", json.access_token);
  return json; // { access_token, user, ... }
}

/**
 * Logout de usuario
 */
export async function logoutUsuario() {
  const token = getToken();

  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json.message || "Error al cerrar sesión");
  }

  localStorage.removeItem("token");
  return json; // { message: "Sesión cerrada exitosamente" }
}

/**
 * Obtener usuario autenticado
 */
export async function getUsuario() {
  const token = getToken();

  const res = await fetch(`${API_BASE}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json.message || "Error al obtener usuario");
  }

  return json; // objeto usuario con carritos, pedidos, etc.
}
