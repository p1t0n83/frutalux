// src/services/facturaService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Generar factura PDF
 * @param {Object} payload - Datos de la factura
 * @returns {Promise<Object>} - URL del PDF generado
 */
export async function generarFactura(payload) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa. Por favor, inicia sesión.");
    }

    const res = await fetch(`${API_BASE}/facturas/generar`, {  // 👈 FIX: Paréntesis en lugar de backticks
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/pdf, application/json",  // 👈 FIX: Aceptar ambos tipos
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Si la respuesta es JSON (error), parsearla
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al generar la factura");
      } else {
        const text = await res.text();
        console.error("Respuesta backend:", text);
        throw new Error("Error al generar la factura");
      }
    }

    // Si todo va bien, procesar el PDF
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    return { url };

  } catch (err) {
    console.error("facturaService error:", err);
    throw err;
  }
}