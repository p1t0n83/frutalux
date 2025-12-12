const API_BASE = "http://frutalux.duckdns.orgapi";

function getToken() {
  return localStorage.getItem("token");
}

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
      "Accept": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || options.errorMessage || "Error en la petición");
  return json;
}

/**
 * Obtener carrito del usuario autenticado
 */
export async function getCarrito() {
  return apiFetch("/carrito", {
    errorMessage: "Error al obtener carrito"
  });
}

/**
 * Añadir producto al carrito
 */
export async function addItem({ producto_id, cantidad_kg, precio_unitario }) {
  return apiFetch("/carrito/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id, cantidad_kg, precio_unitario }),
    errorMessage: "Error al añadir producto"
  });
}

/**
 * Actualizar cantidad de un producto en el carrito
 */
export async function updateItem(itemId, cantidad_kg) {
  return apiFetch(`/carrito/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantidad_kg }),
    errorMessage: "Error al actualizar producto"
  });
}

/**
 * Eliminar producto del carrito
 */
export async function removeItem(itemId) {
  return apiFetch(`/carrito/items/${itemId}`, {
    method: "DELETE",
    errorMessage: "Error al eliminar producto"
  });
}

/**
 * Vaciar carrito entero
 */
export async function clearCarrito() {
  return apiFetch("/carrito/clear", {
    method: "DELETE",
    errorMessage: "Error al vaciar carrito"
  });
}
