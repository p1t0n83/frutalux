const API_BASE = "https://frutalux.duckdns.org/api";

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa. Por favor, inicia sesión.");
  return token;
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no válida: " + text);
  }
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || options.errorMessage || "Error en la petición");
  return json;
}

/**
 * Obtener las suscripciones del cliente autenticado
 */
export async function getMisSuscripciones() {
  return apiFetch("/mis-suscripciones", {
    errorMessage: "Error al obtener suscripciones",
  });
}

/**
 * Cancelar una suscripción propia
 */
export async function cancelarSuscripcion(id) {
  return apiFetch(`/suscripciones/${id}/cancelar`, {
    method: "POST",
    errorMessage: "Error al cancelar la suscripción",
  });
}