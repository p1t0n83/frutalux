const API_BASE = import.meta.env.VITE_API_URL || "http://api.frutalux.duckdns.org/api";

/**
 * Obtener token de autenticación
 */
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay sesión activa. Por favor, inicia sesión.");
  }
  return token;
}

/**
 * Maneja errores de respuesta del servidor
 */
async function handleErrorResponse(res) {
  const contentType = res.headers.get("content-type");
  
  if (contentType?.includes("application/json")) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al generar la factura");
  }
  
  const text = await res.text();
  console.error("Respuesta backend:", text);
  throw new Error("Error al generar la factura");
}

/**
 * Generar factura PDF
 * @param {Object} payload - Datos de la factura
 * @returns {Promise<Object>} - URL del PDF generado
 */
export async function generarFactura(payload) {
  try {
    const token = getToken();
    
    const res = await fetch(`${API_BASE}/facturas/generar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/pdf, application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      await handleErrorResponse(res);
    }

    // Procesar el PDF
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    
    return { url };
  } catch (err) {
    console.error("facturaService error:", err);
    throw err;
  }
}