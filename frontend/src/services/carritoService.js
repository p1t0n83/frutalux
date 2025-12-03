const API_BASE = "http://localhost:8000/api";

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
 * Obtener carrito del usuario autenticado
 */
export async function getCarrito() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/carrito`, {
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener carrito");
  return json;
}

/**
 * Añadir producto al carrito
 */
export async function addItem({ producto_id, cantidad_kg, precio_unitario }) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/carrito/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ producto_id, cantidad_kg, precio_unitario }),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al añadir producto");
  return json;
}

/**
 * Actualizar cantidad de un producto en el carrito
 */
export async function updateItem(itemId, cantidad_kg) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/carrito/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cantidad_kg }),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al actualizar producto");
  return json;
}

/**
 * Eliminar producto del carrito
 */
export async function removeItem(itemId) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/carrito/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al eliminar producto");
  return json;
}

/**
 * Vaciar carrito entero
 */
export async function clearCarrito() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/carrito/clear`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al vaciar carrito");
  return json;
}
