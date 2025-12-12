const API_BASE = "http://frutalux.duckdns.orgapi";

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
 * Función centralizada para hacer peticiones a la API
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || options.errorMessage || "Error en la petición");
  return json;
}

/**
 * Obtener perfil del usuario autenticado
 */
export async function getPerfilCliente() {
  return apiFetch("/me", {
    errorMessage: "Error al obtener perfil"
  });
}

/**
 * Actualizar datos del perfil
 */
export async function updatePerfilCliente(data) {
  return apiFetch("/cliente/perfil", {
    method: "PUT",
    body: JSON.stringify(data),
    errorMessage: "Error al actualizar perfil"
  });
}

/**
 * Cambiar contraseña
 */
export async function updatePasswordCliente(payload) {
  return apiFetch("/cliente/password", {
    method: "PUT",
    body: JSON.stringify(payload),
    errorMessage: "Error al cambiar contraseña"
  });
}
