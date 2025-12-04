// src/services/pedidoService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

/* ============================
   LISTAR TODOS LOS PEDIDOS
   ============================ */
export async function getPedidos() {
  const res = await fetch(`${API_BASE}/pedidos`, {  // 👈 FIX: Paréntesis
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener pedidos");
  return json;
}

/* ============================
   OBTENER DETALLE DE UN PEDIDO
   ============================ */
export async function getPedidoById(id) {
  const res = await fetch(`${API_BASE}/pedidos/${id}`, {  // 👈 FIX: Paréntesis
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener pedido");
  return json;
}