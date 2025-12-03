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
 * Obtener perfil del usuario autenticado
 */
export async function getPerfilCliente() {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener perfil");
  return json;
}

/**
 * Actualizar datos del perfil
 */
export async function updatePerfilCliente(data) {
  const res = await fetch(`${API_BASE}/cliente/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al actualizar perfil");
  return json;
}

/**
 * Cambiar contraseña
 */
export async function updatePasswordCliente(payload) {
  const res = await fetch(`${API_BASE}/cliente/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload)
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al cambiar contraseña");
  return json;
}
