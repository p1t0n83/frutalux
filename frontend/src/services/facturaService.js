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
 * Generar factura PDF en backend
 */
export async function generarFactura(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/facturas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/pdf", // 👈 pedimos PDF
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Error al generar factura");

  // Recibir como blob
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

