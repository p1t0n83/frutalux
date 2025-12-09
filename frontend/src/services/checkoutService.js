const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Función auxiliar para hacer peticiones a la API
 */
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error(options.errorMessage || "Error en la petición");
  }
  
  return await res.json();
}

/**
 * Genera una respuesta simulada de pedido
 */
function generarRespuestaSimulada(payload) {
  return {
    success: true,
    numeroFactura: "FAC-" + Math.floor(Math.random() * 10000),
    fecha: new Date().toISOString().split("T")[0],
    ...payload,
  };
}

/**
 * Confirmar pedido
 * @param {Object} payload - Datos del pedido (productos, método de pago, total, etc.)
 * @returns {Promise<Object>} - Respuesta del backend o simulación
 */
export async function confirmarPedido(payload) {
  try {
    return await apiFetch("/pedidos", {
      method: "POST",
      body: JSON.stringify(payload),
      errorMessage: "Error al confirmar el pedido",
    });
  } catch (err) {
    console.error("checkoutService error:", err);
    // Simulación de respuesta si no hay backend
    return generarRespuestaSimulada(payload);
  }
}