const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Confirmar pedido
 * @param {Object} payload - Datos del pedido (productos, método de pago, total, etc.)
 * @returns {Promise<Object>} - Respuesta del backend o simulación
 */
export async function confirmarPedido(payload) {
  try {
    // En un backend real harías POST a /pedidos
    const res = await fetch(`${API_BASE}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include", // 👈 si usas auth con cookies
    });

    if (!res.ok) {
      throw new Error("Error al confirmar el pedido");
    }

    return await res.json();
  } catch (err) {
    console.error("checkoutService error:", err);

    // Simulación de respuesta si no hay backend
    return {
      success: true,
      numeroFactura: "FAC-" + Math.floor(Math.random() * 10000),
      fecha: new Date().toISOString().split("T")[0],
      ...payload,
    };
  }
}
