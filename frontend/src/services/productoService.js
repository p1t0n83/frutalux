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
/* ============================
   LISTAR TODOS LOS PRODUCTOS
   ============================ */
export async function getProductos() {
  const res = await fetch(`${API_BASE}/productos`, {
    headers: { "Accept": "application/json" }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.message || "Error al obtener productos");
  return json;
}

/* ============================
   OBTENER UN PRODUCTO POR ID
   ============================ */
export async function getProducto(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    headers: { "Accept": "application/json" }
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al obtener producto");
  return json;
}


/* ============================
   CREAR PRODUCTO
   ============================ */
export async function createProducto(data) {
  const res = await fetch(`${API_BASE}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al crear producto");
  return json;
}

/* ============================
   ACTUALIZAR PRODUCTO
   ============================ */
export async function updateProducto(id, data) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al actualizar producto");
  return json;
}

/* ============================
   BORRAR PRODUCTO
   ============================ */
export async function deleteProducto(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: "DELETE",
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Error al borrar producto");
}

/* ============================
   SUBIR IMAGEN DE PRODUCTO
   ============================ */
export async function addProductoImagen(id, file) {
  const formData = new FormData();
  formData.append("imagen", file);

  const res = await fetch(`${API_BASE}/productos/${id}/imagenes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
      // 👆 no ponemos Content-Type, fetch lo gestiona con FormData
    },
    body: formData
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error("Error al subir imagen");
  return json;
}

/* ============================
   BORRAR IMAGEN DE PRODUCTO
   ============================ */
export async function deleteProductoImagen(id, imagenId) {
  const res = await fetch(`${API_BASE}/productos/${id}/imagenes/${imagenId}`, {
    method: "DELETE",
    headers: { "Accept": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Error al borrar imagen");
}
