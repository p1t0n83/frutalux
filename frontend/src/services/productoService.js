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
 * Función centralizada para hacer peticiones a la API
 */
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Accept": "application/json",
      ...options.headers,
    },
  });
  
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || options.errorMessage || "Error en la petición");
  return json;
}

/**
 * Función para peticiones autenticadas
 */
async function apiFetchAuth(endpoint, options = {}) {
  return apiFetch(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
}

/**
 * Función para peticiones DELETE sin respuesta JSON
 */
async function apiFetchDelete(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
    ...options,
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  
  if (!res.ok) throw new Error(options.errorMessage || "Error en la petición");
}

/* ============================
   LISTAR TODOS LOS PRODUCTOS
   ============================ */
export async function getProductos() {
  return apiFetch("/productos", {
    errorMessage: "Error al obtener productos"
  });
}

/* ============================
   OBTENER UN PRODUCTO POR ID
   ============================ */
export async function getProducto(id) {
  return apiFetch(`/productos/${id}`, {
    errorMessage: "Error al obtener producto"
  });
}

/* ============================
   CREAR PRODUCTO
   ============================ */
export async function createProducto(data) {
  return apiFetchAuth("/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    errorMessage: "Error al crear producto"
  });
}

/* ============================
   ACTUALIZAR PRODUCTO
   ============================ */
export async function updateProducto(id, data) {
  return apiFetchAuth(`/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    errorMessage: "Error al actualizar producto"
  });
}

/* ============================
   BORRAR PRODUCTO
   ============================ */
export async function deleteProducto(id) {
  return apiFetchDelete(`/productos/${id}`, {
    errorMessage: "Error al borrar producto"
  });
}

/* ============================
   SUBIR IMAGEN DE PRODUCTO
   ============================ */
export async function addProductoImagen(id, file) {
  const formData = new FormData();
  formData.append("imagen", file);
  
  return apiFetchAuth(`/productos/${id}/imagenes`, {
    method: "POST",
    headers: {}, // Sin Content-Type, fetch lo gestiona con FormData
    body: formData,
    errorMessage: "Error al subir imagen"
  });
}

/* ============================
   BORRAR IMAGEN DE PRODUCTO
   ============================ */
export async function deleteProductoImagen(id, imagenId) {
  return apiFetchDelete(`/productos/${id}/imagenes/${imagenId}`, {
    errorMessage: "Error al borrar imagen"
  });
}