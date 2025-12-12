const API_BASE = "https://frutalux.duckdns.org/api";

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
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || options.errorMessage || "Error en la petición");
  return json;
}

/* ============================
   LISTAR TODOS LOS PEDIDOS (admin)
   ============================ */
export async function getPedidos() {
  return apiFetch("/pedidos", {
    errorMessage: "Error al obtener pedidos"
  });
}

/* ============================
   OBTENER DETALLE DE UN PEDIDO
   ============================ */
export async function getPedidoById(id) {
  return apiFetch(`/pedidos/${id}`, {
    errorMessage: "Error al obtener pedido"
  });
}

/* ============================
   LISTAR SOLO LOS PEDIDOS DEL CLIENTE
   ============================ */
export async function getMisPedidos() {
  return apiFetch("/mis-pedidos", {
    errorMessage: "Error al obtener mis pedidos"
  });
}
